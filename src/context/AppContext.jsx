import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialActivities, initialClients, initialFeedbacks, initialNotifications, initialSites, initialTickets } from '../data/mockData';
import { CATEGORIES, TICKET_STATUSES, findTask } from '../data/constants';
import { clamp, overallProgress } from '../utils/progress';
import { todayISO } from '../utils/format';

const AppContext = createContext(null);

// Demo-only admin credentials (frontend demo authentication).
export const ADMIN_CREDENTIALS = { email: 'admin@buildcraft.com', password: 'admin123', name: 'Admin Manager' };

let seq = 1000;
const uid = (p = 'id') => `${p}-${++seq}-${Math.random().toString(36).slice(2, 6)}`;
const nowISO = () => new Date().toISOString();

const readSession = () => {
  try {
    const raw = sessionStorage.getItem('bc_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AppProvider({ children }) {
  const [sites, setSites] = useState(initialSites);
  const [clients, setClients] = useState(initialClients);
  const [tickets, setTickets] = useState(initialTickets);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [activities, setActivities] = useState(initialActivities);
  const [feedbackPrompted, setFeedbackPrompted] = useState({});
  const [user, setUser] = useState(readSession);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      if (user) sessionStorage.setItem('bc_user', JSON.stringify(user));
      else sessionStorage.removeItem('bc_user');
    } catch {
      /* ignore */
    }
  }, [user]);

  /* ---------- Toasts ---------- */
  const toast = useCallback((message, type = 'success') => {
    const id = uid('toast');
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  /* ---------- Helpers ---------- */
  const addNotification = (n) =>
    setNotifications((prev) => [{ id: uid('n'), at: nowISO(), read: false, ...n }, ...prev]);
  const addActivity = (text) => setActivities((prev) => [{ id: uid('a'), text, at: nowISO() }, ...prev].slice(0, 30));

  /* ---------- Auth (demo only) ---------- */
  const login = (role, email, password) => {
    const e = email.trim().toLowerCase();
    if (role === 'admin') {
      if (e === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        setUser({ role: 'admin', id: 'admin', name: ADMIN_CREDENTIALS.name });
        return { ok: true };
      }
      return { ok: false, error: 'Invalid admin email or password.' };
    }
    const c = clients.find((x) => x.email.toLowerCase() === e && x.password === password);
    if (!c) return { ok: false, error: 'Invalid client email or password.' };
    if (!c.active) return { ok: false, error: 'This account is deactivated. Please contact the administrator.' };
    setUser({ role: 'client', id: c.id, name: c.name });
    return { ok: true };
  };
  const logout = () => setUser(null);

  const clientSite = useMemo(
    () => (user?.role === 'client' ? sites.find((s) => s.clientId === user.id) || null : null),
    [sites, user]
  );
  const getClient = (id) => clients.find((c) => c.id === id);
  const getSite = (id) => sites.find((s) => s.id === id);

  /* ---------- Sites ---------- */
  const registerSite = (data) => {
    const id = uid('s');
    const tasks = {};
    Object.values(CATEGORIES).forEach((c) => c.tasks.forEach((t) => (tasks[t.id] = 0)));
    const site = {
      id,
      name: data.name,
      location: data.location,
      type: data.type,
      startDate: data.startDate,
      expectedDate: data.expectedDate,
      clientId: data.clientId || null,
      optional: { showcase: !!data.optional.showcase, ceiling: !!data.optional.ceiling },
      tasks,
      updates: [],
      remarks: [],
      images: [],
      history: [{ id: uid('h'), taskId: null, ts: Date.now(), date: nowISO(), text: 'Site registered', value: 0 }],
      materials: [],
    };
    setSites((prev) => [site, ...prev]);
    addNotification({ type: 'site', siteId: id, title: 'New site registered', text: `${site.name} has been registered.` });
    if (site.clientId) {
      const c = clients.find((x) => x.id === site.clientId);
      addNotification({ type: 'client', siteId: id, title: 'New client assigned', text: `${c?.name || 'Client'} was assigned to ${site.name}.` });
    }
    addActivity(`New site registered: ${site.name}`);
    return id;
  };

  const updateTask = (siteId, taskId, value) => {
    const site = sites.find((s) => s.id === siteId);
    if (!site) return;
    const v = clamp(value);
    if (site.tasks[taskId] === v) return;
    const task = findTask(taskId);
    const before = overallProgress(site);
    const ts = Date.now();
    const text = `${task.name} (${CATEGORIES[task.cat].short}) updated to ${v}%`;
    const last = site.history[0];
    const entry = { id: uid('h'), taskId, ts, date: nowISO(), text, value: v };
    // Merge rapid consecutive edits of the same task (slider dragging) into a single history entry.
    const history = last && last.taskId === taskId && ts - last.ts < 4000 ? [{ ...entry, id: last.id }, ...site.history.slice(1)] : [entry, ...site.history];
    const next = { ...site, tasks: { ...site.tasks, [taskId]: v }, history };
    const after = overallProgress(next);
    setSites((prev) => prev.map((s) => (s.id === siteId ? next : s)));
    setNotifications((prev) => {
      let list = prev;
      const noteText = `${site.name}: ${task.name} now ${v}% (overall ${after}%)`;
      const recent = list.find((n) => n.type === 'progress' && n.siteId === siteId && ts - new Date(n.at).getTime() < 8000);
      list = recent
        ? list.map((n) => (n === recent ? { ...n, text: noteText, at: nowISO(), read: false } : n))
        : [{ id: uid('n'), type: 'progress', siteId, title: 'Project progress updated', text: noteText, at: nowISO(), read: false }, ...list];
      if (before < 85 && after >= 85 && !list.some((n) => n.type === 'milestone' && n.siteId === siteId)) {
        list = [{ id: uid('n'), type: 'milestone', siteId, title: 'Project reached 85%', text: `${site.name} crossed the 85% completion milestone.`, at: nowISO(), read: false }, ...list];
      }
      return list;
    });
  };

  const toggleOptional = (siteId, key) => {
    setSites((prev) =>
      prev.map((s) =>
        s.id === siteId
          ? {
              ...s,
              optional: { ...s.optional, [key]: !s.optional[key] },
              history: [{ id: uid('h'), taskId: null, ts: Date.now(), date: nowISO(), text: `${CATEGORIES[key].name} ${s.optional[key] ? 'disabled' : 'enabled'}`, value: null }, ...s.history],
            }
          : s
      )
    );
  };

  const addUpdate = (siteId, text) => {
    setSites((prev) => prev.map((s) => (s.id === siteId ? { ...s, updates: [{ id: uid('u'), date: todayISO(), text, author: 'Admin Manager' }, ...s.updates] } : s)));
    const site = sites.find((s) => s.id === siteId);
    addActivity(`Daily update added for ${site?.name}`);
  };
  const addRemark = (siteId, text) =>
    setSites((prev) => prev.map((s) => (s.id === siteId ? { ...s, remarks: [{ id: uid('r'), date: todayISO(), text }, ...s.remarks] } : s)));
  const addImages = (siteId, imgs) => {
    setSites((prev) => prev.map((s) => (s.id === siteId ? { ...s, images: [...imgs.map((i) => ({ id: uid('i'), date: todayISO(), ...i })), ...s.images] } : s)));
    const site = sites.find((s) => s.id === siteId);
    addActivity(`${imgs.length} image(s) uploaded to ${site?.name}`);
  };
  const saveMaterials = (siteId, ids) => {
    setSites((prev) => prev.map((s) => (s.id === siteId ? { ...s, materials: ids } : s)));
    const site = sites.find((s) => s.id === siteId);
    addActivity(`Materials list updated for ${site?.name}`);
  };

  /* ---------- Clients ---------- */
  const assignSite = (clientId, siteId) => {
    setSites((prev) =>
      prev.map((s) => {
        if (s.id === siteId) return { ...s, clientId };
        if (s.clientId === clientId) return { ...s, clientId: null };
        return s;
      })
    );
    if (siteId) {
      const c = clients.find((x) => x.id === clientId);
      const s = sites.find((x) => x.id === siteId);
      addNotification({ type: 'client', siteId, title: 'New client assigned', text: `${c?.name} was assigned to ${s?.name}.` });
    }
  };
  const addClient = (data, siteId) => {
    const id = uid('c');
    setClients((prev) => [...prev, { id, active: true, joined: todayISO(), ...data }]);
    if (siteId) assignSite(id, siteId);
    return id;
  };
  const updateClient = (id, data, siteId) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    const current = sites.find((s) => s.clientId === id)?.id || '';
    if ((siteId || '') !== current) {
      if (siteId) assignSite(id, siteId);
      else setSites((prev) => prev.map((s) => (s.clientId === id ? { ...s, clientId: null } : s)));
    }
  };
  const toggleClientActive = (id) => setClients((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));

  /* ---------- Messages & corrections ---------- */
  const createTicket = ({ siteId, clientId, category, type, subject, text }) => {
    const id = uid('t');
    const at = nowISO();
    setTickets((prev) => [{ id, siteId, clientId, category, type, subject, status: 'Submitted', createdAt: at, thread: [{ id: uid('m'), from: 'client', text, at }] }, ...prev]);
    const c = clients.find((x) => x.id === clientId);
    addNotification({
      type: type === 'correction' ? 'correction' : 'message',
      siteId,
      title: type === 'correction' ? 'New client correction submitted' : 'New client message received',
      text: `${c?.name}: ${subject}`,
    });
    return id;
  };
  const replyTicket = (ticketId, from, text) => {
    const at = nowISO();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const status = from === 'admin' && t.status === 'Submitted' ? 'Under Review' : t.status;
        return { ...t, status, thread: [...t.thread, { id: uid('m'), from, text, at }] };
      })
    );
    if (from === 'client') {
      const t = tickets.find((x) => x.id === ticketId);
      const c = clients.find((x) => x.id === t?.clientId);
      addNotification({ type: 'message', siteId: t?.siteId, title: 'New client message received', text: `${c?.name} replied: ${t?.subject}` });
    }
  };
  const setTicketStatus = (ticketId, status) => {
    if (!TICKET_STATUSES.includes(status)) return;
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status } : t)));
  };

  /* ---------- Feedback (85% popup) ---------- */
  const markFeedbackPrompted = (siteId) => setFeedbackPrompted((p) => ({ ...p, [siteId]: true }));
  const submitFeedback = ({ siteId, rating, comment }) => {
    const site = sites.find((s) => s.id === siteId);
    const c = clients.find((x) => x.id === site?.clientId);
    setFeedbacks((prev) => [{ id: uid('f'), siteId, siteName: site?.name, clientName: c?.name, rating, comment, at: nowISO() }, ...prev]);
    addNotification({ type: 'feedback', siteId, title: 'New client feedback received', text: `${c?.name} rated ${site?.name} ${rating}/5.` });
  };

  /* ---------- Notifications ---------- */
  const markRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    sites, clients, tickets, notifications, feedbacks, activities, feedbackPrompted, user, toasts, unreadCount, clientSite,
    login, logout, toast, dismissToast, getClient, getSite,
    registerSite, updateTask, toggleOptional, addUpdate, addRemark, addImages, saveMaterials,
    addClient, updateClient, toggleClientActive, assignSite,
    createTicket, replyTicket, setTicketStatus,
    markFeedbackPrompted, submitFeedback, markRead, markAllRead,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
