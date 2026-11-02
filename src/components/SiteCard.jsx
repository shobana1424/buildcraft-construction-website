import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { overallProgress, siteStatus } from '../utils/progress';
import { formatDate } from '../utils/format';
import ProgressBar from './common/ProgressBar';
import SmartImage from './common/SmartImage';
import { StatusBadge } from './common/Misc';

export default function SiteCard({ site }) {
  const { getClient } = useApp();
  const progress = overallProgress(site);
  const status = siteStatus(site);
  const client = getClient(site.clientId);
  const color = status === 'Delayed' ? '#DC2626' : status === 'In Progress' ? '#F97316' : status === 'Completed' ? '#1769E0' : '#16A34A';

  return (
    <motion.article whileHover={{ y: -6 }} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition hover:shadow-lift">
      <Link to={`/admin/sites/${site.id}`} className="block">
        <div className="relative h-36 overflow-hidden">
          <SmartImage src={site.images[0]?.url} alt={site.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
          <div className="absolute left-3 top-3"><StatusBadge status={status} /></div>
          <span className="absolute bottom-3 right-3 rounded-full bg-white px-2.5 py-1 text-sm font-bold text-navy shadow">{progress}%</span>
        </div>
        <div className="space-y-3 p-4">
          <div>
            <h3 className="truncate font-display text-lg font-bold text-navy">{site.name}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-royal" />{site.location}</p>
          </div>
          <ProgressBar value={progress} color={color} />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 truncate"><User className="h-3.5 w-3.5" />{client?.name || 'Unassigned'}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(site.expectedDate)}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
