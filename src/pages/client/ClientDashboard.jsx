import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle2, Clock, ListChecks, MapPin, Package, Hourglass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/constants';
import { categoryBreakdown, overallProgress, siteStatus, taskLists } from '../../utils/progress';
import { formatDate } from '../../utils/format';
import ProgressBar from '../../components/common/ProgressBar';
import StatCard from '../../components/common/StatCard';
import { EmptyState, StatusBadge } from '../../components/common/Misc';
import { CategoryBarChart, CompletedRemainingChart, OverallDonut } from '../../components/charts/Charts';
import InteriorCarousel from '../../components/InteriorCarousel';
import ImageGallery from '../../components/ImageGallery';

export default function ClientDashboard() {
  const { clientSite: site, user } = useApp();

  if (!site) {
    return (
      <div className="mx-auto max-w-xl pt-10">
        <EmptyState title="No project assigned yet" text="Your administrator has not assigned a construction site to your account. Please check back soon or send us a message." icon={Clock}>
          <Link to="/client/messages" className="btn-primary">Message Administrator</Link>
        </EmptyState>
        <div className="mt-8"><InteriorCarousel /></div>
      </div>
    );
  }

  const progress = overallProgress(site);
  const status = siteStatus(site);
  const { completed, pending } = taskLists(site);
  const breakdown = categoryBreakdown(site);
  const daysLeft = Math.ceil((new Date(site.expectedDate) - Date.now()) / 86400000);

  return (
    <div className="space-y-6">
      {/* Project header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-royal p-6 text-white shadow-lift sm:p-8">
        <div className="blueprint-bg absolute inset-0 opacity-20" />
        <div className="relative grid items-center gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Welcome, {user?.name?.split(' ')[0]}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3"><h2 className="font-display text-3xl font-bold !text-white">{site.name}</h2><StatusBadge status={status} /></div>
            <div className="mt-4 grid gap-3 text-sm text-blue-100 sm:grid-cols-3">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" />{site.location}</span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gold" />Start: {formatDate(site.startDate)}</span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gold" />Expected: {formatDate(site.expectedDate)}</span>
            </div>
            <p className="mt-4 text-sm text-blue-100">{progress >= 100 ? 'Your project is complete. Congratulations!' : daysLeft >= 0 ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining until the expected completion date.` : `${Math.abs(daysLeft)} day(s) past the expected completion date.`}</p>
          </div>
          <div className="rounded-2xl bg-white p-3 text-navy"><OverallDonut site={site} height={190} /></div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Overall Completion" value={progress} suffix="%" icon={ListChecks} tone="blue" />
        <StatCard label="Completed Tasks" value={completed.length} icon={CheckCircle2} tone="green" />
        <StatCard label="Pending Tasks" value={pending.length} icon={Hourglass} tone="orange" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card">
          <h3 className="mb-4 font-display text-lg font-bold">Work Category Progress</h3>
          <div className="space-y-5">
            {breakdown.map((c) => (
              <div key={c.key}>
                <div className="mb-1.5 flex items-center justify-between text-sm"><span className="font-semibold text-navy">{c.fullName}{!CATEGORIES[c.key].mandatory && <span className="ml-2 text-[10px] font-bold uppercase text-slate-400">Optional</span>}</span><span className="font-bold" style={{ color: c.color }}>{c.completed}%</span></div>
                <ProgressBar value={c.completed} color={c.color} height="h-3" />
              </div>
            ))}
          </div>
        </div>
        <div className="card"><h3 className="font-display text-lg font-bold">Category-wise Chart</h3><CategoryBarChart site={site} /></div>
        <div className="card"><h3 className="font-display text-lg font-bold">Completed vs Remaining</h3><CompletedRemainingChart site={site} /></div>
      </div>

      {/* Interior Works Showcase */}
      <InteriorCarousel />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <div className="mb-4 flex items-center justify-between"><h3 className="font-display text-lg font-bold">Daily Construction Updates</h3><Link to="/client/progress" className="flex items-center gap-1 text-sm font-semibold text-royal hover:underline">All updates <ArrowRight className="h-4 w-4" /></Link></div>
          {site.updates.length === 0 ? <p className="text-sm text-slate-500">No updates posted yet.</p> : (
            <ol className="relative space-y-5 border-l-2 border-royal/20 pl-6">
              {site.updates.slice(0, 3).map((u) => (
                <li key={u.id} className="relative"><span className="absolute -left-[1.95rem] top-1 h-3.5 w-3.5 rounded-full bg-gold ring-4 ring-white" /><p className="text-sm text-slate-700">{u.text}</p><p className="mt-1 text-xs text-slate-400">{formatDate(u.date)} - {u.author}</p></li>
              ))}
            </ol>
          )}
        </div>
        <div className="card">
          <div className="mb-3 flex items-center justify-between"><h3 className="flex items-center gap-2 font-display text-lg font-bold"><Package className="h-5 w-5 text-royal" /> Materials</h3><Link to="/client/materials" className="text-sm font-semibold text-royal hover:underline">View</Link></div>
          <p className="font-display text-4xl font-bold text-navy">{site.materials.length}</p>
          <p className="text-sm text-slate-500">materials selected by your administrator for this project.</p>
          <Link to="/client/materials" className="btn-outline btn-sm mt-4">See material list</Link>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between"><h3 className="font-display text-lg font-bold">Construction Site Images</h3><Link to="/client/progress" className="flex items-center gap-1 text-sm font-semibold text-royal hover:underline">Full gallery <ArrowRight className="h-4 w-4" /></Link></div>
        {site.images.length ? <ImageGallery images={site.images.slice(0, 4)} /> : <p className="text-sm text-slate-500">No site images uploaded yet.</p>}
      </div>
    </div>
  );
}
