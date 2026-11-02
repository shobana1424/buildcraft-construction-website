
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Mail, MapPin, Menu, X } from 'lucide-react';
import { COMPANY } from '../../data/constants';
import { Logo } from '../common/Misc';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || open;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'bg-white/95 shadow-card backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container-x flex items-center justify-between py-3.5">
        <Link to="/" aria-label="BuildCraft Constructions home">
          <Logo light={!solid} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `relative rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  solid ? 'text-navy hover:text-royal' : 'text-white/90 hover:text-white'
                } ${isActive ? (solid ? '!text-royal' : '!text-gold') : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gold"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            to="/client/login"
            className={`btn btn-sm border ${
              solid
                ? 'border-slate-300 text-navy hover:border-royal hover:text-royal'
                : 'border-white/40 text-white hover:bg-white/10'
            }`}
          >
            Client Login
          </Link>
          <Link to="/admin/login" className="btn-gold btn-sm">
            Admin Login
          </Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className={`rounded-lg p-2 lg:hidden ${solid ? 'text-navy' : 'text-white'}`}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
          >
            <nav className="container-x flex flex-col gap-1 py-4" aria-label="Mobile">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-semibold ${
                      isActive ? 'bg-royal-50 text-royal' : 'text-navy hover:bg-ice'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}

              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link to="/client/login" className="btn-outline">
                  Client Login
                </Link>
                <Link to="/admin/login" className="btn-gold">
                  Admin Login
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-navy-800 text-blue-100">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm text-blue-200">
            {COMPANY.tagline} Premium residential, commercial and industrial construction with complete digital transparency.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest !text-gold">
            Company
          </h4>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest !text-gold">
            Portals
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/client/login" className="hover:text-gold">
                Client Login
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-gold">
                Admin Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest !text-gold">
            Reach Us
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${COMPANY.email}`} className="break-all hover:text-gold">
                {COMPANY.email}
              </a>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{COMPANY.address.join(', ')}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-blue-300">
        &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved. Frontend demo - mock data only.
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  const { pathname } = useLocation();
  const [showTop, setShowTop] = useState(false);

  // Scroll to top whenever the route changes.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  // Show the back-to-top button when scrolling.
  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 600);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <motion.main
        key={pathname}
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.main>

      <Footer />

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="fixed bottom-5 right-5 z-40 rounded-full bg-gold p-3 text-navy shadow-lift hover:bg-gold-600"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
