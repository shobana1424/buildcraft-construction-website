import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, Building2, CheckCheck, Clock, PlusSquare, TrendingUp, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, CATEGORY_ORDER } from '../../data/constants';
import { categoryProgress, enabledKeys, overallProgress, siteStatus } from '../../utils/progress';
import { timeAgo } from '../../utils/format';
import StatCard from '../../components/common/StatCard';
import SiteCard from '../../components/SiteCard';
import ProgressBar from '../../components/common/ProgressBar';
import { StatusBadge } from '../../components/common/Misc';
import { SimpleBar, StatusDonut } from '../../components/charts/Charts';
import { NotificationIcon } from '../../components/NotificationBell';

export default function AdminDashboard() {
  const { sites, clients, activities, notifications, markRead, markAllRead, user } = useApp();
  const statuses = sites.map(siteStatus);
  const count = (s) => statuses.filter((x) => x === s).length;
  const overall = sites.length ? Math.round(sites.reduce((a, s) => a + overallProgress(s), 0) / sites.length) : 0;

  const siteData = sites.map((s) => ({ name: s.name.split(' ').slice(0, 2).join(' '), value: overallProgress(s) }));
  const categoryData = CATEGORY_ORDER.map((k) => {
    const withCat = sites.filter((s) => enabledKeys(s).includes(k));
    return {
      name: CATEGORIES[k].short,
      value: withCat.length ? Math.round(withCat.reduce((a, s) => a + categoryProgress(s, k), 0) / withCat.length) : 0,
      color: CATEGORIES[k].color,
    };
  });
  const statusData = ['On Track', 'In Progress', 'Delayed', 'Completed'].map((name) => ({ name, value: count(name) })).filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h2>
          <p className="text-sm text-slate-500">Here's what's happening across your construction sites.</p>
        </div>
        <Link to="/admin/sites/new" className="btn-gold"><PlusSquare className="h-4 w-4" /> Register New Site</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total Sites" value={sites.length} icon={Building2} tone="navy" />
        <StatCard label="On Track" value={count('On Track')} icon={CheckCheck} tone="green" />
        <StatCard label="In Progress" value={count('In Progress')} icon={Clock} tone="orange" />
        <StatCard label="Delayed" value={count('Delayed')} icon={AlertTriangle} tone="red" />
        <StatCard label="Total Clients" value={clients.length} icon={Users} tone="blue" />
        <StatCard label="Overall Completion" value={overall} suffix="%" icon={TrendingUp} tone="gold" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <h3 className="mb-1 font-display text-lg font-bold">Site-wise Progress</h3>
          <p className="mb-3 text-xs text-slate-500">Overall completion of every registered site</p>
          <SimpleBar data={siteData} colors={['#1769E0', '#F5A623', '#0891B2', '#7C3AED', '#E11D48']} />
        </div>
        <div className="card">
          <h3 className="mb-1 font-display text-lg font-bold">Project Status</h3>
          <p className="mb-3 text-xs text-slate-500">Distribution across all sites</p>
          <StatusDonut data={statusData} height={260} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card">
          <h3 className="mb-1 font-display text-lg font-bold">Category-wise Progress</h3>
          <p className="mb-4 text-xs text-slate-500">Average across sites where the category is enabled</p>
          <div className="space-y-4">
            {categoryData.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex justify-between text-sm font-semibold text-navy"><span>{c.name}</span><span>{c.value}%</span></div>
                <ProgressBar value={c.value} color={c.color} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold"><Activity className="h-5 w-5 text-royal" /> Recent Activities</h3>
          </div>
          <ul className="space-y-3">
            {activities.slice(0, 6).map((a) => (
              <li key={a.id} className="flex gap-3 text-sm">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <div><p className="text-slate-700">{a.text}</p><p className="text-xs text-slate-400">{timeAgo(a.at)}</p></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Notifications</h3>
            <button onClick={markAllRead} className="text-xs font-semibold text-royal hover:underline">Mark all read</button>
          </div>
          <ul className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <li key={n.id} className={`flex gap-3 rounded-xl p-2 ${n.read ? '' : 'bg-royal-50/70'}`}>
                <NotificationIcon type={n.type} />
                <button onClick={() => markRead(n.id)} className="min-w-0 flex-1 text-left">
                  <p className={`text-sm ${n.read ? 'font-medium' : 'font-bold text-navy'}`}>{n.title}</p>
                  <p className="line-clamp-1 text-xs text-slate-500">{n.text}</p>
                  <p className="text-[11px] text-slate-400">{timeAgo(n.at)}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">Project Cards</h3>
          <Link to="/admin/sites" className="text-sm font-semibold text-royal hover:underline">View all sites</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {sites.slice(0, 4).map((s) => <SiteCard key={s.id} site={s} />)}
        </div>
      </div>

      <div className="card overflow-hidden !p-0">
        <h3 className="px-5 pt-5 font-display text-lg font-bold">Project Status Overview</h3>
        <div className="overflow-x-auto">
          <table className="mt-3 w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ice text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-5 py-3">Site</th><th className="px-5 py-3">Client</th><th className="px-5 py-3">Progress</th><th className="px-5 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sites.map((s) => (
                <tr key={s.id} className="hover:bg-ice/60">
                  <td className="px-5 py-3 font-semibold text-navy"><Link to={`/admin/sites/${s.id}`} className="hover:text-royal">{s.name}</Link></td>
                  <td className="px-5 py-3">{clients.find((c) => c.id === s.clientId)?.name || 'Unassigned'}</td>
                  <td className="w-56 px-5 py-3"><ProgressBar value={overallProgress(s)} showLabel /></td>
                  <td className="px-5 py-3"><StatusBadge status={siteStatus(s)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
