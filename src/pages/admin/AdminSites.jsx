import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusSquare, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { siteStatus } from '../../utils/progress';
import SiteCard from '../../components/SiteCard';
import { EmptyState } from '../../components/common/Misc';

const filters = ['All', 'On Track', 'In Progress', 'Delayed', 'Completed'];

export default function AdminSites() {
  const { sites, getClient } = useApp();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');

  const list = sites.filter((s) => {
    const text = `${s.name} ${s.location} ${getClient(s.clientId)?.name || ''}`.toLowerCase();
    return text.includes(q.toLowerCase()) && (status === 'All' || siteStatus(s) === status);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input pl-10" placeholder="Search by site, location or client..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Link to="/admin/sites/new" className="btn-gold"><PlusSquare className="h-4 w-4" /> Register New Site</Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setStatus(f)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${status === f ? 'bg-royal text-white' : 'bg-white text-navy ring-1 ring-slate-200 hover:ring-royal'}`}>{f}</button>
        ))}
      </div>
      {list.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{list.map((s) => <SiteCard key={s.id} site={s} />)}</div>
      ) : (
        <EmptyState title="No sites found" text="Try a different search or filter, or register a new site." />
      )}
    </div>
  );
}
