import { useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Calendar, Check, CheckCircle2, Circle, History, ImagePlus, MapPin, MessageSquarePlus, StickyNote, Upload, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, CATEGORY_ORDER } from '../../data/constants';
import { categoryProgress, clamp, enabledKeys, overallProgress, siteStatus, taskLists } from '../../utils/progress';
import { formatDate, formatDateTime } from '../../utils/format';
import ProgressBar from '../../components/common/ProgressBar';
import { EmptyState, StatusBadge } from '../../components/common/Misc';
import { CategoryBarChart, CompletedRemainingChart, OverallDonut } from '../../components/charts/Charts';
import ImageGallery from '../../components/ImageGallery';

const tabs = [
  { id: 'progress', label: 'Progress Tracking', icon: CheckCircle2 },
  { id: 'updates', label: 'Daily Updates & Remarks', icon: StickyNote },
  { id: 'images', label: 'Site Images', icon: ImagePlus },
  { id: 'history', label: 'Progress History', icon: History },
];

function TaskRow({ task, value, color, onChange }) {
  const done = value >= 100;
  return (
    <div className={`rounded-xl border p-3.5 transition ${done ? 'border-green-200 bg-green-50/60' : 'border-slate-200 bg-white'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-slate-300" />}
          <span className="text-sm font-semibold text-navy">{task.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-300 bg-white">
            <input type="number" min={0} max={100} value={value} onChange={(e) => onChange(e.target.value)} aria-label={`${task.name} percentage`} className="w-14 rounded-lg bg-transparent px-2 py-1 text-right text-sm font-bold text-navy focus:outline-none" />
            <span className="pr-2 text-sm text-slate-500">%</span>
          </div>
          <button onClick={() => onChange(100)} disabled={done} className="btn-outline btn-sm !px-2.5"><Check className="h-3.5 w-3.5" /> {done ? 'Done' : 'Complete'}</button>
        </div>
      </div>
      <input type="range" min={0} max={100} step={5} value={value} onChange={(e) => onChange(e.target.value)} aria-label={`${task.name} slider`} className="mt-3 w-full" style={{ accentColor: color }} />
    </div>
  );
}

export default function SiteDetail() {
  const { siteId } = useParams();
  const { getSite, getClient, updateTask, toggleOptional, addUpdate, addRemark, addImages, toast } = useApp();
  const site = getSite(siteId);
  const [tab, setTab] = useState('progress');
  const [updateText, setUpdateText] = useState('');
  const [remarkText, setRemarkText] = useState('');
  const [caption, setCaption] = useState('');
  const fileRef = useRef(null);

  if (!site) return <Navigate to="/admin/sites" replace />;

  const progress = overallProgress(site);
  const status = siteStatus(site);
  const client = getClient(site.clientId);
  const { completed, pending } = taskLists(site);

  const onFiles = (e) => {
    const files = [...(e.target.files || [])].filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    addImages(site.id, files.map((f) => ({ url: URL.createObjectURL(f), caption: caption.trim() || f.name.replace(/\.[^.]+$/, '') })));
    setCaption('');
    e.target.value = '';
    toast(`${files.length} image(s) uploaded.`);
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/sites" className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline"><ArrowLeft className="h-4 w-4" /> All sites</Link>

      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3"><h2 className="font-display text-2xl font-bold">{site.name}</h2><StatusBadge status={status} /><span className="badge bg-slate-100 text-slate-600 ring-slate-200">{site.type}</span></div>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-royal" />{site.location}</span>
            <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-royal" />{client?.name || 'Unassigned'}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-royal" />{formatDate(site.startDate)} - {formatDate(site.expectedDate)}</span>
          </div>
        </div>
        <div className="w-full sm:w-64"><div className="mb-1 flex justify-between text-sm font-bold text-navy"><span>Overall</span><span>{progress}%</span></div><ProgressBar value={progress} height="h-3" /></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card"><h3 className="font-display text-lg font-bold">Overall Completion</h3><OverallDonut site={site} /></div>
        <div className="card"><h3 className="font-display text-lg font-bold">Category Progress</h3><CategoryBarChart site={site} /></div>
        <div className="card"><h3 className="font-display text-lg font-bold">Completed vs Remaining</h3><CompletedRemainingChart site={site} /></div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scroll-thin" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tab === t.id ? 'bg-navy text-white shadow-md' : 'bg-white text-navy ring-1 ring-slate-200 hover:ring-royal'}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {tab === 'progress' && (
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="space-y-6 xl:col-span-2">
                <div className="card">
                  <h3 className="font-display text-lg font-bold">Optional Categories</h3>
                  <p className="mb-3 text-sm text-slate-500">Disabled optional categories are excluded from the overall calculation.</p>
                  <div className="flex flex-wrap gap-3">
                    {['showcase', 'ceiling'].map((k) => (
                      <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${site.optional[k] ? 'border-royal bg-royal-50 text-royal' : 'border-slate-200 text-slate-600 hover:border-royal'}`}>
                        <input type="checkbox" className="h-4 w-4 accent-royal" checked={!!site.optional[k]} onChange={() => toggleOptional(site.id, k)} />
                        {CATEGORIES[k].name}
                      </label>
                    ))}
                  </div>
                </div>

                {CATEGORY_ORDER.filter((k) => enabledKeys(site).includes(k)).map((k) => (
                  <div key={k} className="card">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3"><span className="h-8 w-1.5 rounded-full" style={{ background: CATEGORIES[k].color }} /><h3 className="font-display text-lg font-bold">{CATEGORIES[k].name}</h3>{!CATEGORIES[k].mandatory && <span className="badge bg-slate-100 text-slate-600 ring-slate-200">Optional</span>}</div>
                      <span className="font-display text-2xl font-bold" style={{ color: CATEGORIES[k].color }}>{categoryProgress(site, k)}%</span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {CATEGORIES[k].tasks.map((t) => (
                        <TaskRow key={t.id} task={t} color={CATEGORIES[k].color} value={clamp(site.tasks[t.id])} onChange={(v) => updateTask(site.id, t.id, v)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="card">
                  <h3 className="mb-3 font-display text-lg font-bold">Pending Tasks <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-warning">{pending.length}</span></h3>
                  {pending.length ? (
                    <ul className="max-h-80 space-y-2.5 overflow-y-auto pr-1 scroll-thin">
                      {pending.map((t) => (
                        <li key={t.id} className="rounded-lg bg-ice p-2.5">
                          <div className="flex justify-between text-sm"><span className="font-semibold text-navy">{t.name}</span><span className="font-bold text-slate-600">{t.value}%</span></div>
                          <p className="mb-1 text-[11px] text-slate-500">{t.catName}</p>
                          <ProgressBar value={t.value} color={t.color} height="h-1.5" />
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-success">All tasks are complete!</p>}
                </div>
                <div className="card">
                  <h3 className="mb-3 font-display text-lg font-bold">Completed Tasks <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-success">{completed.length}</span></h3>
                  {completed.length ? (
                    <ul className="max-h-64 space-y-2 overflow-y-auto pr-1 scroll-thin">
                      {completed.map((t) => <li key={t.id} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" /><span className="font-medium text-slate-700">{t.name}</span><span className="ml-auto text-[11px] text-slate-400">{t.catName.replace(' Work', '')}</span></li>)}
                    </ul>
                  ) : <p className="text-sm text-slate-500">No tasks completed yet.</p>}
                </div>
              </div>
            </div>
          )}

          {tab === 'updates' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card">
                <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><MessageSquarePlus className="h-5 w-5 text-royal" /> Daily Updates</h3>
                <form onSubmit={(e) => { e.preventDefault(); if (!updateText.trim()) return toast('Please write an update first.', 'error'); addUpdate(site.id, updateText.trim()); setUpdateText(''); toast('Daily update added.'); }} className="space-y-3">
                  <textarea rows={3} className="input resize-none" placeholder="What happened on site today?" value={updateText} onChange={(e) => setUpdateText(e.target.value)} />
                  <button className="btn-primary btn-sm">Add Daily Update</button>
                </form>
                <ul className="mt-5 space-y-3">
                  {site.updates.length === 0 && <EmptyState title="No updates yet" />}
                  {site.updates.map((u) => (
                    <li key={u.id} className="border-l-4 border-royal bg-ice p-3 pl-4"><p className="text-sm text-slate-700">{u.text}</p><p className="mt-1 text-xs text-slate-400">{formatDate(u.date)} - {u.author}</p></li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><StickyNote className="h-5 w-5 text-gold-600" /> Remarks</h3>
                <form onSubmit={(e) => { e.preventDefault(); if (!remarkText.trim()) return toast('Please write a remark first.', 'error'); addRemark(site.id, remarkText.trim()); setRemarkText(''); toast('Remark added.'); }} className="space-y-3">
                  <textarea rows={3} className="input resize-none" placeholder="Add an internal remark..." value={remarkText} onChange={(e) => setRemarkText(e.target.value)} />
                  <button className="btn-gold btn-sm">Add Remark</button>
                </form>
                <ul className="mt-5 space-y-3">
                  {site.remarks.length === 0 && <EmptyState title="No remarks yet" />}
                  {site.remarks.map((r) => (
                    <li key={r.id} className="border-l-4 border-gold bg-gold-50 p-3 pl-4"><p className="text-sm text-slate-700">{r.text}</p><p className="mt-1 text-xs text-slate-400">{formatDate(r.date)}</p></li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'images' && (
            <div className="card space-y-5">
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[220px] flex-1"><label className="label" htmlFor="cap">Caption (optional)</label><input id="cap" className="input" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. First floor slab casting" /></div>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
                <button onClick={() => fileRef.current?.click()} className="btn-primary"><Upload className="h-4 w-4" /> Upload Images</button>
              </div>
              {site.images.length ? <ImageGallery images={site.images} /> : <EmptyState title="No images uploaded" text="Upload construction photos to share progress with the client." icon={ImagePlus} />}
            </div>
          )}

          {tab === 'history' && (
            <div className="card">
              <h3 className="mb-4 font-display text-lg font-bold">Progress History</h3>
              {site.history.length === 0 ? <EmptyState title="No history yet" /> : (
                <ol className="relative space-y-5 border-l-2 border-royal/20 pl-6">
                  {site.history.map((h) => (
                    <li key={h.id} className="relative"><span className="absolute -left-[1.95rem] top-1 h-3.5 w-3.5 rounded-full bg-royal ring-4 ring-white" /><p className="text-sm font-semibold text-navy">{h.text}</p><p className="text-xs text-slate-400">{formatDateTime(h.date)}</p></li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
