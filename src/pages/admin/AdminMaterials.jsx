import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckSquare, Edit3, Package, Save, Square, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MATERIAL_GROUPS, materialId } from '../../data/constants';
import { EmptyState } from '../../components/common/Misc';

export default function AdminMaterials() {
  const { sites, getClient, saveMaterials, toast } = useApp();
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState([]);
  const site = sites.find((s) => s.id === siteId);

  useEffect(() => {
    setEditing(false);
  }, [siteId]);

  if (!site) return <EmptyState title="No sites registered" text="Register a site first to manage its materials." icon={Package} />;

  const saved = new Set(site.materials);
  const current = new Set(editing ? draft : site.materials);

  const startEdit = () => { setDraft(site.materials); setEditing(true); };
  const toggle = (id) => setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const toggleGroup = (g) => {
    const ids = g.items.map((i) => materialId(g.key, i));
    const all = ids.every((id) => draft.includes(id));
    setDraft((d) => (all ? d.filter((x) => !ids.includes(x)) : [...new Set([...d, ...ids])]));
  };
  const save = () => { saveMaterials(site.id, draft); setEditing(false); toast(`Materials saved for ${site.name}.`); };

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-[240px] flex-1">
          <label className="label" htmlFor="site-select">Construction site</label>
          <select id="site-select" className="input" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name} - {getClient(s.clientId)?.name || 'Unassigned'}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-royal-50 px-4 py-2 text-sm font-bold text-royal">{current.size} selected</span>
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="btn-outline"><X className="h-4 w-4" /> Cancel</button>
              <button onClick={save} className="btn-gold"><Save className="h-4 w-4" /> Save Materials</button>
            </>
          ) : (
            <button onClick={startEdit} className="btn-primary"><Edit3 className="h-4 w-4" /> Edit Selection</button>
          )}
        </div>
      </div>

      {editing && <p className="rounded-xl bg-gold-50 px-4 py-3 text-sm font-medium text-gold-600">Editing mode - tick the materials used on this site and press "Save Materials". Clients can only view the saved list.</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        {MATERIAL_GROUPS.map((g, gi) => {
          const ids = g.items.map((i) => materialId(g.key, i));
          const count = ids.filter((id) => current.has(id)).length;
          return (
            <motion.section key={g.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.06 }} className="card overflow-hidden !p-0">
              <header className="flex items-center justify-between gap-3 px-5 py-4 text-white" style={{ background: g.color }}>
                <div><h3 className="font-display text-lg font-bold !text-white">{g.title}</h3><p className="text-xs text-white/80">{count} of {g.items.length} selected</p></div>
                {editing && (
                  <button onClick={() => toggleGroup(g)} className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/30">
                    {count === g.items.length ? <Square className="h-3.5 w-3.5" /> : <CheckSquare className="h-3.5 w-3.5" />} {count === g.items.length ? 'Clear all' : 'Select all'}
                  </button>
                )}
              </header>
              <div className="grid gap-2.5 p-5 sm:grid-cols-2">
                {g.items.map((item) => {
                  const id = materialId(g.key, item);
                  const on = current.has(id);
                  const changed = editing && on !== saved.has(id);
                  return (
                    <label key={id} className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition ${editing ? 'cursor-pointer' : 'cursor-default'} ${on ? 'border-transparent bg-royal-50 text-navy ring-2' : 'border-slate-200 text-slate-500'} ${editing && !on ? 'hover:border-royal' : ''}`} style={on ? { '--tw-ring-color': g.color } : undefined}>
                      <input type="checkbox" className="h-4 w-4" style={{ accentColor: g.color }} checked={on} disabled={!editing} onChange={() => toggle(id)} />
                      <span className="flex-1">{item}</span>
                      {on && !changed && <Check className="h-4 w-4" style={{ color: g.color }} />}
                      {changed && <span className="rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold text-navy">{on ? 'NEW' : 'REMOVED'}</span>}
                    </label>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>

      <div className="card overflow-hidden !p-0">
        <h3 className="px-5 pt-5 font-display text-lg font-bold">Selected Materials by Site</h3>
        <div className="overflow-x-auto">
          <table className="mt-3 w-full min-w-[560px] text-left text-sm">
            <thead className="bg-ice text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Site</th>{MATERIAL_GROUPS.map((g) => <th key={g.key} className="px-5 py-3">{g.title.replace(' Materials', '')}</th>)}<th className="px-5 py-3">Total</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {sites.map((s) => (
                <tr key={s.id} className={`cursor-pointer hover:bg-ice/60 ${s.id === siteId ? 'bg-royal-50/50' : ''}`} onClick={() => setSiteId(s.id)}>
                  <td className="px-5 py-3 font-semibold text-navy">{s.name}</td>
                  {MATERIAL_GROUPS.map((g) => <td key={g.key} className="px-5 py-3">{s.materials.filter((m) => m.startsWith(`${g.key}:`)).length}</td>)}
                  <td className="px-5 py-3 font-bold text-royal">{s.materials.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
