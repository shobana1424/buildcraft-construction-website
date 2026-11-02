import { useState } from 'react';
import { Edit3, Mail, Plus, Search, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isEmail } from '../../utils/format';
import { overallProgress } from '../../utils/progress';
import Modal from '../../components/common/Modal';
import { EmptyState, Field } from '../../components/common/Misc';

const blank = { name: '', email: '', company: '', password: '', siteId: '' };

export default function AdminClients() {
  const { clients, sites, addClient, updateClient, toggleClientActive, toast } = useApp();
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'add' | 'edit', id? }
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  const siteOf = (id) => sites.find((s) => s.clientId === id);
  const list = clients.filter((c) => `${c.name} ${c.email} ${c.company}`.toLowerCase().includes(q.toLowerCase()));

  const openAdd = () => { setForm(blank); setErrors({}); setModal({ mode: 'add' }); };
  const openEdit = (c) => { setForm({ name: c.name, email: c.email, company: c.company || '', password: c.password, siteId: siteOf(c.id)?.id || '' }); setErrors({}); setModal({ mode: 'edit', id: c.id }); };
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: undefined })); };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = 'Name is required.';
    if (!form.email.trim()) er.email = 'Email is required.';
    else if (!isEmail(form.email.trim())) er.email = 'Enter a valid email address.';
    else if (clients.some((c) => c.email.toLowerCase() === form.email.trim().toLowerCase() && c.id !== modal.id)) er.email = 'This email is already registered.';
    if (!form.password || form.password.length < 6) er.password = 'Password must be at least 6 characters.';
    setErrors(er);
    if (Object.keys(er).length) return;
    const data = { name: form.name.trim(), email: form.email.trim(), company: form.company.trim(), password: form.password };
    if (modal.mode === 'add') { addClient(data, form.siteId || null); toast('Client added successfully.'); }
    else { updateClient(modal.id, data, form.siteId || null); toast('Client details updated.'); }
    setModal(null);
  };

  const available = (clientId) => sites.filter((s) => !s.clientId || s.clientId === clientId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="input pl-10" placeholder="Search clients..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <button onClick={openAdd} className="btn-gold"><Plus className="h-4 w-4" /> Add Client</button>
      </div>

      {list.length === 0 ? <EmptyState title="No clients found" icon={UserPlus} /> : (
        <div className="card overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-ice text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Client</th><th className="px-5 py-3">Assigned Site</th><th className="px-5 py-3">Progress</th><th className="px-5 py-3">Account</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((c) => {
                  const s = siteOf(c.id);
                  return (
                    <tr key={c.id} className="hover:bg-ice/60">
                      <td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-bold text-gold">{c.name[0]}</span><div><p className="font-semibold text-navy">{c.name}</p><p className="flex items-center gap-1 text-xs text-slate-500"><Mail className="h-3 w-3" />{c.email}</p>{c.company && <p className="text-xs text-slate-400">{c.company}</p>}</div></div></td>
                      <td className="px-5 py-3.5">{s ? s.name : <span className="text-slate-400">Not assigned</span>}</td>
                      <td className="px-5 py-3.5 font-bold text-royal">{s ? `${overallProgress(s)}%` : '-'}</td>
                      <td className="px-5 py-3.5">
                        <button role="switch" aria-checked={c.active} aria-label={`${c.active ? 'Deactivate' : 'Activate'} ${c.name}`} onClick={() => { toggleClientActive(c.id); toast(`${c.name} ${c.active ? 'deactivated' : 'activated'}.`); }} className="flex items-center gap-2.5">
                          <span className={`relative h-6 w-11 rounded-full transition ${c.active ? 'bg-success' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${c.active ? 'left-[22px]' : 'left-0.5'}`} /></span>
                          <span className={`text-xs font-semibold ${c.active ? 'text-success' : 'text-slate-500'}`}>{c.active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right"><button onClick={() => openEdit(c)} className="btn-outline btn-sm"><Edit3 className="h-3.5 w-3.5" /> Edit</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Edit Client' : 'Add New Client'}>
        <form onSubmit={submit} noValidate className="space-y-4">
          <Field label="Full Name *" error={errors.name}><input className={`input ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={set('name')} /></Field>
          <Field label="Email *" error={errors.email}><input type="email" className={`input ${errors.email ? 'input-error' : ''}`} value={form.email} onChange={set('email')} /></Field>
          <Field label="Company / Family Name"><input className="input" value={form.company} onChange={set('company')} /></Field>
          <Field label="Login Password *" error={errors.password} hint="Demo only - stored in React state."><input className={`input ${errors.password ? 'input-error' : ''}`} value={form.password} onChange={set('password')} /></Field>
          <Field label="Assign Construction Site" hint="Only unassigned sites (or this client's current site) are listed.">
            <select className="input" value={form.siteId} onChange={set('siteId')}>
              <option value="">No site assigned</option>
              {available(modal?.id).map((s) => <option key={s.id} value={s.id}>{s.name} - {s.location}</option>)}
            </select>
          </Field>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModal(null)} className="btn-outline">Cancel</button><button className="btn-primary">{modal?.mode === 'edit' ? 'Save Changes' : 'Add Client'}</button></div>
        </form>
      </Modal>
    </div>
  );
}
