import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Lock, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, PROJECT_TYPES } from '../../data/constants';
import { todayISO } from '../../utils/format';
import { Field } from '../../components/common/Misc';

export default function RegisterSite() {
  const { clients, sites, registerSite, toast } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', location: '', type: 'Residential', startDate: todayISO(), expectedDate: '', clientId: '', optional: { showcase: false, ceiling: false } });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const assignedIds = new Set(sites.map((s) => s.clientId).filter(Boolean));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = 'Site name is required.';
    if (!form.location.trim()) er.location = 'Location is required.';
    if (!form.startDate) er.startDate = 'Start date is required.';
    if (!form.expectedDate) er.expectedDate = 'Expected completion date is required.';
    else if (form.startDate && form.expectedDate <= form.startDate) er.expectedDate = 'Completion date must be after the start date.';
    setErrors(er);
    if (Object.keys(er).length) return toast('Please fix the highlighted fields.', 'error');
    const id = registerSite({ ...form, name: form.name.trim(), location: form.location.trim() });
    toast(`Site "${form.name.trim()}" registered successfully.`);
    navigate(`/admin/sites/${id}`);
  };

  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`;

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-4xl space-y-6">
      <div className="card space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold">Site Details</h2>
          <p className="text-sm text-slate-500">Register a new construction site and start tracking its progress.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Site Name *" error={errors.name}><input className={cls('name')} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Sunrise Heights Villa" /></Field>
          <Field label="Location *" error={errors.location}><input className={cls('location')} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Area, City" /></Field>
          <Field label="Start Date *" error={errors.startDate}><input type="date" className={cls('startDate')} value={form.startDate} onChange={(e) => set('startDate', e.target.value)} /></Field>
          <Field label="Expected Completion Date *" error={errors.expectedDate}><input type="date" className={cls('expectedDate')} value={form.expectedDate} min={form.startDate} onChange={(e) => set('expectedDate', e.target.value)} /></Field>
        </div>
        <fieldset>
          <legend className="label">Project Type</legend>
          <div className="flex flex-wrap gap-3">
            {PROJECT_TYPES.map((t) => (
              <label key={t} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${form.type === t ? 'border-royal bg-royal-50 text-royal' : 'border-slate-200 text-navy hover:border-royal'}`}>
                <input type="radio" name="type" value={t} checked={form.type === t} onChange={() => set('type', t)} className="accent-royal" /> {t}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="card space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold">Client Assignment</h2>
          <p className="text-sm text-slate-500">Select the client who will be able to track this site.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${form.clientId === '' ? 'border-royal bg-royal-50' : 'border-slate-200 hover:border-royal'}`}>
            <input type="radio" name="client" checked={form.clientId === ''} onChange={() => set('clientId', '')} className="accent-royal" />
            <span className="text-sm font-semibold text-navy">Assign later</span>
          </label>
          {clients.map((c) => (
            <label key={c.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${form.clientId === c.id ? 'border-royal bg-royal-50' : 'border-slate-200 hover:border-royal'} ${!c.active ? 'opacity-60' : ''}`}>
              <input type="radio" name="client" checked={form.clientId === c.id} onChange={() => set('clientId', c.id)} className="accent-royal" />
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-gold">{c.name[0]}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-navy">{c.name}</span>
                <span className="block truncate text-xs text-slate-500">{assignedIds.has(c.id) ? 'Already has a site' : 'No site assigned'}{!c.active && ' - inactive'}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="card space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold">Work Categories</h2>
          <p className="text-sm text-slate-500">Mandatory categories are always tracked. Disabled optional categories are excluded from progress calculations.</p>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><Lock className="h-3.5 w-3.5" /> Mandatory</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {['building', 'electrical', 'plumbing'].map((k) => (
              <label key={k} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-ice p-3.5">
                <input type="checkbox" checked disabled className="h-4 w-4 accent-royal" />
                <span className="text-sm font-semibold text-navy">{CATEGORIES[k].name}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><CheckSquare className="h-3.5 w-3.5" /> Optional</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {['showcase', 'ceiling'].map((k) => (
              <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${form.optional[k] ? 'border-royal bg-royal-50' : 'border-slate-200 hover:border-royal'}`}>
                <input type="checkbox" checked={form.optional[k]} onChange={() => setForm((f) => ({ ...f, optional: { ...f.optional, [k]: !f.optional[k] } }))} className="h-4 w-4 accent-royal" />
                <span className="text-sm font-semibold text-navy">{CATEGORIES[k].name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => navigate('/admin/sites')} className="btn-outline">Cancel</button>
        <button type="submit" className="btn-primary"><UserCheck className="h-4 w-4" /> Register Site</button>
      </div>
    </form>
  );
}
