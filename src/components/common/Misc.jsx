import { AnimatePresence, motion } from 'framer-motion';
import {
  Award, BadgeCheck, Building2, CheckCircle2, Clock, Droplets, Eye, Factory, Hammer, Handshake, Home, Inbox, Leaf, PaintRoller,
  ShieldCheck, Star, Users, Wrench, X, XCircle, Zap,
} from 'lucide-react';
import { STATUS_STYLES, TICKET_STYLES } from '../../data/constants';
import { useApp } from '../../context/AppContext';

const ICONS = { Award, BadgeCheck, Building2, Clock, Droplets, Eye, Factory, Hammer, Handshake, Home, Leaf, PaintRoller, ShieldCheck, Users, Wrench, Zap };
export const Icon = ({ name, ...props }) => {
  const C = ICONS[name] || Building2;
  return <C {...props} />;
};

export const StatusBadge = ({ status }) => <span className={`badge ${STATUS_STYLES[status] || ''}`}>{status}</span>;
export const TicketBadge = ({ status }) => <span className={`badge ${TICKET_STYLES[status] || ''}`}>{status}</span>;

export const Stars = ({ value = 0, onChange, size = 'h-5 w-5', hover = 0, onHover }) => (
  <div className="flex items-center gap-1" role={onChange ? 'radiogroup' : undefined}>
    {[1, 2, 3, 4, 5].map((n) => {
      const active = (hover || value) >= n;
      const star = <Star className={`${size} transition ${active ? 'fill-gold text-gold' : 'text-slate-300'}`} />;
      return onChange ? (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => onHover?.(n)}
          onMouseLeave={() => onHover?.(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-125"
        >
          {star}
        </button>
      ) : (
        <span key={n}>{star}</span>
      );
    })}
  </div>
);

export const EmptyState = ({ title = 'Nothing here yet', text, icon: IconC = Inbox, children }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
    <div className="mb-3 rounded-full bg-royal-50 p-3 text-royal">
      <IconC className="h-6 w-6" />
    </div>
    <p className="font-semibold text-navy">{title}</p>
    {text && <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
    {children && <div className="mt-4">{children}</div>}
  </div>
);

export const Field = ({ label, error, children, hint }) => (
  <div>
    {label && <label className="label">{label}</label>}
    {children}
    {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    {error && <p className="field-error">{error}</p>}
  </div>
);

export function ToastHost() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-lift"
          >
            {t.type === 'error' ? <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />}
            <p className="flex-1 text-sm font-medium text-navy">{t.message}</p>
            <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-slate-400 hover:text-navy">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export const Logo = ({ light = false }) => (
  <span className="flex items-center gap-2.5">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-navy shadow">
      <Building2 className="h-6 w-6" />
    </span>
    <span className="leading-tight">
      <span className={`block font-display text-lg font-bold ${light ? 'text-white' : 'text-navy'}`}>BuildCraft</span>
      <span className={`block text-[10px] font-semibold uppercase tracking-[0.25em] ${light ? 'text-gold' : 'text-royal'}`}>Constructions</span>
    </span>
  </span>
);

export const PageHeader = ({ eyebrow, title, text, image }) => (
  <section className="relative overflow-hidden bg-navy pb-20 pt-36 text-white">
    {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" onError={(e) => (e.currentTarget.style.display = 'none')} />}
    <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-royal/70" />
    <div className="blueprint-bg absolute inset-0 opacity-30" />
    <div className="container-x relative">
      <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-eyebrow !text-gold">{eyebrow}</motion.span>
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="max-w-3xl font-display text-4xl font-bold !text-white sm:text-5xl">{title}</motion.h1>
      {text && <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-4 max-w-2xl text-lg text-blue-100">{text}</motion.p>}
    </div>
  </section>
);
