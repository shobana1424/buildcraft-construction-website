import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Building2, CheckCheck, MessageSquare, PartyPopper, Star, TrendingUp, UserPlus, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { timeAgo } from '../utils/format';

const TYPE_ICON = {
  correction: { icon: Wrench, cls: 'bg-red-100 text-danger' },
  message: { icon: MessageSquare, cls: 'bg-blue-100 text-royal' },
  progress: { icon: TrendingUp, cls: 'bg-green-100 text-success' },
  milestone: { icon: PartyPopper, cls: 'bg-gold-50 text-gold-600' },
  client: { icon: UserPlus, cls: 'bg-purple-100 text-purple-600' },
  site: { icon: Building2, cls: 'bg-slate-100 text-navy' },
  feedback: { icon: Star, cls: 'bg-gold-50 text-gold-600' },
};

export const NotificationIcon = ({ type }) => {
  const { icon: I, cls } = TYPE_ICON[type] || TYPE_ICON.site;
  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cls}`}>
      <I className="h-4 w-4" />
    </span>
  );
};

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const go = (n) => {
    markRead(n.id);
    setOpen(false);
    if (n.type === 'correction' || n.type === 'message') navigate('/admin/messages');
    else if (n.type === 'feedback') navigate('/admin/feedback');
    else if (n.siteId && n.siteId !== 'site-old') navigate(`/admin/sites/${n.siteId}`);
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-label={`Notifications, ${unreadCount} unread`} aria-expanded={open} className="relative rounded-full p-2.5 text-navy transition hover:bg-royal-50">
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span key={unreadCount} initial={{ scale: 0.4 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-danger px-1 text-[11px] font-bold text-white ring-2 ring-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="absolute right-[-3.5rem] z-50 mt-2 w-[22rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lift sm:right-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <p className="font-semibold text-navy">Notifications</p>
                <p className="text-xs text-slate-500">{unreadCount} unread</p>
              </div>
              <button onClick={markAllRead} disabled={!unreadCount} className="flex items-center gap-1 text-xs font-semibold text-royal hover:underline disabled:text-slate-400 disabled:no-underline">
                <CheckCheck className="h-4 w-4" /> Mark all as read
              </button>
            </div>
            <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto scroll-thin">
              {notifications.length === 0 && <li className="p-6 text-center text-sm text-slate-500">You're all caught up.</li>}
              {notifications.slice(0, 12).map((n) => (
                <motion.li key={n.id} layout className={`flex gap-3 px-4 py-3 transition ${n.read ? 'bg-white' : 'bg-royal-50/70'}`}>
                  <NotificationIcon type={n.type} />
                  <button onClick={() => go(n)} className="min-w-0 flex-1 text-left">
                    <p className={`text-sm ${n.read ? 'font-medium text-slate-700' : 'font-bold text-navy'}`}>{n.title}</p>
                    <p className="line-clamp-2 text-xs text-slate-500">{n.text}</p>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">{timeAgo(n.at)}</p>
                  </button>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="self-start rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-royal hover:bg-white" title="Mark as read">
                      <span className="mr-1 inline-block h-2 w-2 rounded-full bg-royal align-middle" />
                      Read
                    </button>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
