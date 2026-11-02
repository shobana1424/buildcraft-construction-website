import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

const tones = {
  blue: 'bg-royal-50 text-royal',
  green: 'bg-green-100 text-success',
  orange: 'bg-orange-100 text-warning',
  red: 'bg-red-100 text-danger',
  gold: 'bg-gold-50 text-gold-600',
  navy: 'bg-navy text-gold',
};

export default function StatCard({ label, value, suffix = '', icon: I, tone = 'blue', hint }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="card flex items-center gap-4 transition hover:shadow-lift">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <I className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="font-display text-3xl font-bold leading-none text-navy">
          <AnimatedCounter value={value} suffix={suffix} duration={1} />
        </p>
        <p className="mt-1 truncate text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
      </div>
    </motion.div>
  );
}
