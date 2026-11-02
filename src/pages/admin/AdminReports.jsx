import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, FileSpreadsheet, FileText, Printer, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, CATEGORY_ORDER, COMPANY } from '../../data/constants';
import { categoryProgress, enabledKeys, overallProgress, siteStatus, taskLists } from '../../utils/progress';
import { formatDate } from '../../utils/format';
import Modal from '../../components/common/Modal';
import { EmptyState } from '../../components/common/Misc';
import { SimpleBar } from '../../components/charts/Charts';

const TABS = [
  { id: 'site', label: 'Site-wise Progress' },
  { id: 'category', label: 'Category-wise' },
  { id: 'client', label: 'Client-wise' },
  { id: 'daily', label: 'Daily Progress' },
];

export default function AdminReports() {
  const { sites, clients, tickets, feedbacks, getClient, toast } = useApp();
  const [tab, setTab] = useState('site');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [q, setQ] = useState('');
  const [preview, setPreview] = useState(false);

  const report = useMemo(() => {
    const inRange = (s) => (!from || s.expectedDate >= from) && (!to || s.startDate <= to);
    const dateIn = (d) => (!from || d >= from) && (!to || d <= to);
    const ss = sites.filter(inRange);
    let title = '';
    let columns = [];
    let rows = [];
    let chart = { data: [], unit: '%', label: '' };

    if (tab === 'site') {
      title = 'Site-wise Progress Report';
      columns = ['Site', 'Client', 'Location', 'Start', 'Expected', 'Progress', 'Status'];
      rows = ss.map((s) => [s.name, getClient(s.clientId)?.name || 'Unassigned', s.location, formatDate(s.startDate), formatDate(s.expectedDate), `${overallProgress(s)}%`, siteStatus(s)]);
      chart = { data: ss.map((s) => ({ name: s.name.split(' ').slice(0, 2).join(' '), value: overallProgress(s) })), unit: '%', label: 'Overall completion by site' };
    } else if (tab === 'category') {
      title = 'Category-wise Progress Report';
      columns = ['Category', 'Type', 'Sites', 'Average Progress', 'Tasks Completed'];
      const data = CATEGORY_ORDER.map((k) => {
        const withCat = ss.filter((s) => enabledKeys(s).includes(k));
        const avg = withCat.length ? Math.round(withCat.reduce((a, s) => a + categoryProgress(s, k), 0) / withCat.length) : 0;
        const done = withCat.reduce((a, s) => a + CATEGORIES[k].tasks.filter((t) => (s.tasks[t.id] || 0) >= 100).length, 0);
        return { k, withCat, avg, done };
      });
      rows = data.map((d) => [CATEGORIES[d.k].name, CATEGORIES[d.k].mandatory ? 'Mandatory' : 'Optional', d.withCat.length, `${d.avg}%`, `${d.done} / ${d.withCat.length * 4}`]);
      chart = { data: data.map((d) => ({ name: CATEGORIES[d.k].short, value: d.avg })), unit: '%', label: 'Average completion by category' };
    } else if (tab === 'client') {
      title = 'Client-wise Report';
      columns = ['Client', 'Company', 'Assigned Site', 'Progress', 'Pending Tasks', 'Open Requests', 'Feedback'];
      const list = clients.map((c) => {
        const s = ss.find((x) => x.clientId === c.id);
        const fb = feedbacks.filter((f) => s && f.siteId === s.id);
        return { c, s, fb };
      });
      rows = list.map(({ c, s, fb }) => [c.name, c.company, s?.name || '-', s ? `${overallProgress(s)}%` : '-', s ? taskLists(s).pending.length : '-', tickets.filter((t) => t.clientId === c.id && t.status !== 'Resolved').length, fb.length ? `${fb[0].rating}/5` : '-']);
      chart = { data: list.filter((l) => l.s).map((l) => ({ name: l.c.name.split(' ')[0], value: overallProgress(l.s) })), unit: '%', label: 'Project completion by client' };
    } else {
      title = 'Daily Progress Report';
      columns = ['Date', 'Site', 'Type', 'Details'];
      const entries = [];
      sites.forEach((s) => {
        s.updates.forEach((u) => dateIn(u.date) && entries.push({ d: u.date, row: [formatDate(u.date), s.name, 'Daily Update', u.text] }));
        s.history.forEach((h) => dateIn(h.date.slice(0, 10)) && entries.push({ d: h.date.slice(0, 10), row: [formatDate(h.date), s.name, 'Progress Change', h.text] }));
      });
      entries.sort((a, b) => (a.d < b.d ? 1 : -1));
      rows = entries.map((e) => e.row);
      const byDay = {};
      entries.forEach((e) => (byDay[e.d] = (byDay[e.d] || 0) + 1));
      chart = { data: Object.keys(byDay).sort().slice(-10).map((d) => ({ name: formatDate(d).slice(0, 6), value: byDay[d] })), unit: '', label: 'Activity entries per day' };
    }

    const needle = q.trim().toLowerCase();
    if (needle) rows = rows.filter((r) => r.join(' ').toLowerCase().includes(needle));
    return { title, columns, rows, chart };
  }, [tab, from, to, q, sites, clients, tickets, feedbacks, getClient]);

  const period = from || to ? `${from ? formatDate(from) : 'Start'} - ${to ? formatDate(to) : 'Today'}` : 'All dates';

  const exportCsv = () => {
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [report.columns, ...report.rows].map((r) => r.map(esc).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Excel-compatible CSV downloaded (frontend demo export).');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-1 scroll-thin" role="tablist">
        {TABS.map((t) => <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tab === t.id ? 'bg-navy text-white shadow-md' : 'bg-white text-navy ring-1 ring-slate-200 hover:ring-royal'}`}>{t.label}</button>)}
      </div>

      <div className="card grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_2fr_auto]">
        <div><label className="label" htmlFor="from">From date</label><input id="from" type="date" className="input" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><label className="label" htmlFor="to">To date</label><input id="to" type="date" className="input" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} /></div>
        <div><label className="label" htmlFor="rq">Search</label><div className="relative"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="rq" className="input pl-10" placeholder="Search this report..." value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
        <div className="flex items-end gap-2 sm:col-span-2 xl:col-span-1">
          <button onClick={() => { setFrom(''); setTo(''); setQ(''); }} className="btn-ghost">Reset</button>
          <button onClick={() => setPreview(true)} className="btn-outline"><Eye className="h-4 w-4" /> Preview</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="font-display text-xl font-bold">{report.title}</h2><p className="text-sm text-slate-500">Period: {period} - {report.rows.length} record(s)</p></div>
        <div className="flex gap-2">
          <button onClick={() => setPreview(true)} className="btn-navy btn-sm"><FileText className="h-4 w-4" /> Export PDF</button>
          <button onClick={exportCsv} className="btn-primary btn-sm"><FileSpreadsheet className="h-4 w-4" /> Export Excel</button>
        </div>
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-5">
        <div className="card xl:col-span-2">
          <h3 className="mb-1 font-display text-lg font-bold">{report.chart.label}</h3>
          {report.chart.data.length ? <SimpleBar data={report.chart.data} unit={report.chart.unit} height={280} colors={['#1769E0', '#F5A623', '#0891B2', '#7C3AED', '#E11D48']} /> : <EmptyState title="No chart data" text="Adjust the filters to see data." />}
        </div>
        <div className="card overflow-hidden !p-0 xl:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-ice text-xs uppercase tracking-wide text-slate-500"><tr>{report.columns.map((c) => <th key={c} className="px-4 py-3">{c}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {report.rows.length === 0 && <tr><td colSpan={report.columns.length} className="px-4 py-10 text-center text-slate-500">No records match the current filters.</td></tr>}
                {report.rows.map((r, i) => <tr key={i} className="hover:bg-ice/60">{r.map((cell, j) => <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-semibold text-navy' : ''}`}>{cell}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      <Modal open={preview} onClose={() => setPreview(false)} title="Report Preview" size="max-w-4xl">
        <div id="report-print" className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between border-b-2 border-navy pb-4">
            <div><p className="font-display text-2xl font-bold text-navy">{COMPANY.name}</p><p className="text-xs text-slate-500">{COMPANY.email}</p></div>
            <div className="text-right"><p className="font-semibold text-navy">{report.title}</p><p className="text-xs text-slate-500">Period: {period}</p><p className="text-xs text-slate-500">Generated: {formatDate(new Date().toISOString())}</p></div>
          </div>
          <table className="mt-4 w-full text-left text-xs">
            <thead><tr className="bg-navy text-white">{report.columns.map((c) => <th key={c} className="px-2.5 py-2">{c}</th>)}</tr></thead>
            <tbody>{report.rows.map((r, i) => <tr key={i} className={i % 2 ? 'bg-ice' : ''}>{r.map((cell, j) => <td key={j} className="px-2.5 py-1.5">{cell}</td>)}</tr>)}</tbody>
          </table>
          {report.rows.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No records.</p>}
          <p className="mt-6 text-center text-[10px] text-slate-400">Demo report generated from mock data - {report.rows.length} record(s)</p>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button onClick={() => setPreview(false)} className="btn-outline">Close</button>
          <button onClick={exportCsv} className="btn-primary"><FileSpreadsheet className="h-4 w-4" /> Export Excel</button>
          <button onClick={() => window.print()} className="btn-gold"><Printer className="h-4 w-4" /> Print / Save as PDF</button>
        </div>
      </Modal>
    </div>
  );
}
