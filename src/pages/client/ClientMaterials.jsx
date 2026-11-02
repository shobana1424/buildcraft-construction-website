import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MATERIAL_GROUPS, materialId } from '../../data/constants';
import { EmptyState } from '../../components/common/Misc';

// READ-ONLY materials view: no inputs, no edit/delete controls.
export default function ClientMaterials() {
  const { clientSite: site } = useApp();
  if (!site) return <EmptyState title="No project assigned yet" icon={Package} />;

  const selected = new Set(site.materials);
  const total = site.materials.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-navy p-6 text-white shadow-lift">
        <div>
          <h2 className="font-display text-2xl font-bold !text-white">Materials for {site.name}</h2>
          <p className="mt-1 text-sm text-blue-100">{total} material{total === 1 ? '' : 's'} selected by your project administrator.</p>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-gold"><Lock className="h-4 w-4" /> View only</span>
      </div>

      {total === 0 ? (
        <EmptyState title="No materials selected yet" text="Your administrator hasn't published a materials list for this project." icon={Package} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {MATERIAL_GROUPS.map((g, i) => {
            const items = g.items.filter((item) => selected.has(materialId(g.key, item)));
            return (
              <motion.section key={g.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card overflow-hidden !p-0">
                <header className="flex items-center justify-between px-5 py-4 text-white" style={{ background: g.color }}>
                  <h3 className="font-display text-lg font-bold !text-white">{g.title}</h3>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">{items.length} selected</span>
                </header>
                {items.length ? (
                  <ul className="grid gap-2.5 p-5 sm:grid-cols-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 rounded-xl bg-ice px-3.5 py-2.5 text-sm font-medium text-navy">
                        <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: g.color }} />
                        <span className="flex-1">{item}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{g.title.replace(' Materials', '')}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="p-5 text-sm text-slate-500">No materials selected in this category.</p>}
              </motion.section>
            );
          })}
        </div>
      )}
      <p className="flex items-center justify-center gap-2 text-xs text-slate-500"><Lock className="h-3.5 w-3.5" /> Materials are managed by the administrator. To request a change, send a message from Messages & Corrections.</p>
    </div>
  );
}
