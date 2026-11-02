import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/constants';
import { categoryProgress, clamp, enabledKeys, overallProgress, taskLists } from '../../utils/progress';
import { formatDate, formatDateTime } from '../../utils/format';
import ProgressBar from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/Misc';
import ImageGallery from '../../components/ImageGallery';

export default function ClientProgress() {
  const { clientSite: site } = useApp();
  if (!site) return <EmptyState title="No project assigned yet" icon={Clock} />;

  const { completed, pending } = taskLists(site);
  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="font-display text-xl font-bold">{site.name}</h2><p className="text-sm text-slate-500">{completed.length} tasks completed - {pending.length} pending</p></div>
        <div className="w-full sm:w-64"><div className="mb-1 flex justify-between text-sm font-bold text-navy"><span>Overall</span><span>{overallProgress(site)}%</span></div><ProgressBar value={overallProgress(site)} height="h-3" /></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {enabledKeys(site).map((k) => (
          <section key={k} className="card">
            <div className="mb-4 flex items-center justify-between"><h3 className="flex items-center gap-3 font-display text-lg font-bold"><span className="h-6 w-1.5 rounded-full" style={{ background: CATEGORIES[k].color }} />{CATEGORIES[k].name}</h3><span className="font-display text-xl font-bold" style={{ color: CATEGORIES[k].color }}>{categoryProgress(site, k)}%</span></div>
            <ul className="space-y-4">
              {CATEGORIES[k].tasks.map((t) => {
                const v = clamp(site.tasks[t.id]);
                return (
                  <li key={t.id}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-sm"><span className="flex items-center gap-2 font-medium text-slate-700">{v >= 100 ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-slate-300" />}{t.name}</span><span className="font-bold text-navy">{v >= 100 ? 'Completed' : `${v}%`}</span></div>
                    <ProgressBar value={v} color={v >= 100 ? '#16A34A' : CATEGORIES[k].color} height="h-2" />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h3 className="mb-3 font-display text-lg font-bold">Pending Tasks ({pending.length})</h3>
          {pending.length ? <ul className="space-y-2">{pending.map((t) => <li key={t.id} className="flex items-center justify-between rounded-lg bg-ice px-3 py-2 text-sm"><span><span className="font-semibold text-navy">{t.name}</span><span className="ml-2 text-xs text-slate-500">{t.catName}</span></span><span className="font-bold text-warning">{t.value}%</span></li>)}</ul> : <p className="text-sm text-success">Everything is complete.</p>}
        </section>
        <section className="card">
          <h3 className="mb-3 font-display text-lg font-bold">Completed Tasks ({completed.length})</h3>
          {completed.length ? <ul className="space-y-2">{completed.map((t) => <li key={t.id} className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /><span className="font-semibold text-navy">{t.name}</span><span className="ml-auto text-xs text-slate-500">{t.catName}</span></li>)}</ul> : <p className="text-sm text-slate-500">No tasks completed yet.</p>}
        </section>
      </div>

      <section className="card">
        <h3 className="mb-4 font-display text-lg font-bold">Daily Construction Updates</h3>
        {site.updates.length === 0 ? <p className="text-sm text-slate-500">No updates posted yet.</p> : (
          <ol className="relative space-y-5 border-l-2 border-royal/20 pl-6">
            {site.updates.map((u) => <li key={u.id} className="relative"><span className="absolute -left-[1.95rem] top-1 h-3.5 w-3.5 rounded-full bg-gold ring-4 ring-white" /><p className="text-sm text-slate-700">{u.text}</p><p className="mt-1 text-xs text-slate-400">{formatDate(u.date)} - {u.author}</p></li>)}
          </ol>
        )}
      </section>

      <section className="card">
        <h3 className="mb-4 font-display text-lg font-bold">Progress History</h3>
        {site.history.length === 0 ? <p className="text-sm text-slate-500">No history yet.</p> : (
          <ul className="space-y-2.5">{site.history.slice(0, 10).map((h) => <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-ice px-3 py-2 text-sm"><span className="font-medium text-navy">{h.text}</span><span className="text-xs text-slate-400">{formatDateTime(h.date)}</span></li>)}</ul>
        )}
      </section>

      <section className="card">
        <h3 className="mb-4 font-display text-lg font-bold">Construction Site Images</h3>
        {site.images.length ? <ImageGallery images={site.images} /> : <p className="text-sm text-slate-500">No site images uploaded yet.</p>}
      </section>
    </div>
  );
}
