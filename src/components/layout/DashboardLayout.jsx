import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ClipboardList, FileBarChart, FolderKanban, Globe, LayoutDashboard, LogOut, Menu, MessageSquare, Package, PlusSquare, Star, Users, X, TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Misc';
import NotificationBell from '../NotificationBell';
import FeedbackPrompt from '../FeedbackPrompt';

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/sites', label: 'Construction Sites', icon: FolderKanban },
  { to: '/admin/sites/new', label: 'Register New Site', icon: PlusSquare },
  { to: '/admin/materials', label: 'Materials', icon: Package },
  { to: '/admin/messages', label: 'Messages & Corrections', icon: MessageSquare, badge: 'tickets' },
  { to: '/admin/feedback', label: 'Client Feedback', icon: Star },
  { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
  { to: '/admin/clients', label: 'Client Management', icon: Users },
];
const clientNav = [
  { to: '/client', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/client/progress', label: 'Progress & Updates', icon: TrendingUp },
  { to: '/client/materials', label: 'Materials', icon: Package },
  { to: '/client/messages', label: 'Messages & Corrections', icon: MessageSquare },
];

export default function DashboardLayout({ role }) {
  const { user, logout, tickets } = useApp();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const nav = role === 'admin' ? adminNav : clientNav;
  const openTickets = tickets.filter((t) => t.status === 'Submitted').length;
  // "Construction Sites" stays active on site detail pages, but not on the register page.
  const sitesActive = location.pathname === '/admin/sites' || (location.pathname.startsWith('/admin/sites/') && !location.pathname.startsWith('/admin/sites/new'));

  useEffect(() => setOpen(false), [location.pathname]);

  const title =
    [...nav].sort((a, b) => b.to.length - a.to.length).find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))?.label || 'Dashboard';

  const handleLogout = () => {
    logout();
    navigate(role === 'admin' ? '/admin/login' : '/client/login');
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-navy text-white">
      <div className="flex items-center justify-between px-5 py-5">
        <NavLink to="/" aria-label="Home"><Logo light /></NavLink>
        <button className="rounded-lg p-1.5 text-blue-200 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mx-5 mb-3 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-gold">
        {role === 'admin' ? 'Admin Console' : 'Client Portal'}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 scroll-thin">
        {nav.map(({ to, label, icon: I, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end || to === '/admin/sites' || to === '/admin/sites/new'}
            className={({ isActive }) => {
              const active = to === '/admin/sites' ? sitesActive : isActive;
              return `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${active ? 'bg-royal text-white shadow-lg' : 'text-blue-100 hover:bg-white/10'}`;
            }}
          >
            {({ isActive: routeActive }) => (
              <>
                {(to === '/admin/sites' ? sitesActive : routeActive) && <motion.span layoutId={`active-${role}`} className="absolute left-0 top-2 h-[calc(100%-1rem)] w-1 rounded-r-full bg-gold" />}
                <I className="h-[18px] w-[18px]" />
                <span className="flex-1">{label}</span>
                {badge === 'tickets' && openTickets > 0 && <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-navy">{openTickets}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <NavLink to="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-blue-100 hover:bg-white/10">
          <Globe className="h-[18px] w-[18px]" /> Public Website
        </NavLink>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-blue-100 hover:bg-danger/80 hover:text-white">
          <LogOut className="h-[18px] w-[18px]" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ice">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] lg:hidden" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.25 }}>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/70 bg-white/85 px-4 py-3 backdrop-blur-md sm:px-6">
          <button className="rounded-xl p-2 text-navy hover:bg-royal-50 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-xl font-bold text-navy sm:text-2xl">{title}</h1>
          </div>
          {role === 'admin' && <NotificationBell />}
          <div className="flex items-center gap-3 rounded-full bg-ice py-1 pl-1 pr-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-royal text-sm font-bold text-white">{user?.name?.[0] || 'U'}</span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-semibold text-navy">{user?.name}</span>
              <span className="block text-[11px] capitalize text-slate-500">{user?.role}</span>
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
            <Outlet />
          </motion.div>
        </main>
      </div>

      {role === 'client' && <FeedbackPrompt />}
    </div>
  );
}
