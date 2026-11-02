import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0, color = '#1769E0', height = 'h-2.5', showLabel = false, className = '' }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`w-full overflow-hidden rounded-full bg-slate-200 ${height}`} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${v}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && <span className="w-10 text-right text-xs font-bold text-navy">{v}%</span>}
    </div>
  );
}
