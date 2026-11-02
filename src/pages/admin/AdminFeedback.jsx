import { MessageCircleHeart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/format';
import { EmptyState, Stars } from '../../components/common/Misc';
import StatCard from '../../components/common/StatCard';

export default function AdminFeedback() {
  const { feedbacks } = useApp();
  const avg = feedbacks.length ? feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Feedback Received" value={feedbacks.length} icon={MessageCircleHeart} tone="blue" />
        <div className="card flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-600"><Star className="h-6 w-6" /></div><div><p className="font-display text-3xl font-bold text-navy">{avg.toFixed(1)}<span className="text-base text-slate-400"> / 5</span></p><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Average Rating</p></div></div>
        <StatCard label="5-Star Reviews" value={feedbacks.filter((f) => f.rating === 5).length} icon={Star} tone="gold" />
      </div>
      <p className="text-sm text-slate-500">Feedback is requested automatically from clients when their project reaches 85% completion.</p>
      {feedbacks.length === 0 ? (
        <EmptyState title="No feedback yet" text="Client feedback will appear here once submitted." icon={MessageCircleHeart} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {feedbacks.map((f, i) => (
            <motion.article key={f.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-bold text-gold">{f.clientName?.[0] || '?'}</span><div><p className="font-semibold text-navy">{f.clientName}</p><p className="text-xs text-slate-500">{f.siteName}</p></div></div>
                <Stars value={f.rating} size="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm text-slate-700">{f.comment ? `"${f.comment}"` : <span className="italic text-slate-400">No written comment.</span>}</p>
              <p className="mt-3 text-xs text-slate-400">Submitted {formatDate(f.at)}</p>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
