import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Plus, Send, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TICKET_CATEGORIES, TICKET_STATUSES } from '../../data/constants';
import { formatDateTime, timeAgo } from '../../utils/format';
import { EmptyState, Field, TicketBadge } from '../../components/common/Misc';

const blank = { category: 'General', type: 'correction', subject: '', text: '' };

export default function ClientMessages() {
  const { tickets, clientSite: site, user, createTicket, replyTicket, toast } = useApp();
  const mine = tickets.filter((t) => t.clientId === user.id).sort((a, b) => new Date(b.thread[b.thread.length - 1].at) - new Date(a.thread[a.thread.length - 1].at));
  const [view, setView] = useState('new'); // 'new' | ticket id
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [reply, setReply] = useState('');
  const endRef = useRef(null);
  const ticket = mine.find((t) => t.id === view);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [ticket?.thread.length, view]);

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: undefined })); };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.subject.trim()) er.subject = 'Please add a short subject.';
    if (!form.text.trim()) er.text = 'Please describe your message or correction.';
    else if (form.text.trim().length < 10) er.text = 'Please add a little more detail (10+ characters).';
    setErrors(er);
    if (Object.keys(er).length) return;
    const id = createTicket({ siteId: site.id, clientId: user.id, category: form.category, type: form.type, subject: form.subject.trim(), text: form.text.trim() });
    toast(form.type === 'correction' ? 'Correction request submitted.' : 'Message sent to the administrator.');
    setForm(blank);
    setView(id);
  };

  const send = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    replyTicket(ticket.id, 'client', reply.trim());
    setReply('');
  };

  if (!site) return <EmptyState title="No project assigned yet" text="You can message the administrator once a project is assigned to your account." icon={MessageSquare} />;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Thread list */}
      <div className={`card flex flex-col !p-0 lg:col-span-2 ${view !== 'new' && ticket ? 'hidden lg:flex' : 'flex'}`}>
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="font-display text-lg font-bold">My Messages</h2>
          <button onClick={() => setView('new')} className="btn-primary btn-sm"><Plus className="h-3.5 w-3.5" /> New</button>
        </div>
        <ul className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto scroll-thin">
          {mine.length === 0 && <li className="p-6"><EmptyState title="No messages yet" text="Send your first message or correction request." /></li>}
          {mine.map((t) => {
            const last = t.thread[t.thread.length - 1];
            return (
              <li key={t.id}>
                <button onClick={() => setView(t.id)} className={`w-full px-4 py-3.5 text-left transition hover:bg-ice ${view === t.id ? 'bg-royal-50' : ''}`}>
                  <div className="flex items-start justify-between gap-2"><p className="flex items-center gap-1.5 truncate text-sm font-bold text-navy">{t.type === 'correction' ? <Wrench className="h-3.5 w-3.5 shrink-0 text-danger" /> : <MessageSquare className="h-3.5 w-3.5 shrink-0 text-royal" />}{t.subject}</p><TicketBadge status={t.status} /></div>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-600">{last.from === 'admin' ? 'Admin: ' : 'You: '}{last.text}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{t.category} - {timeAgo(last.at)}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right pane */}
      <div className={`card flex min-h-[28rem] flex-col !p-0 lg:col-span-3 ${view === 'new' || !ticket ? 'flex' : 'flex'}`}>
        {view === 'new' || !ticket ? (
          <form onSubmit={submit} noValidate className="space-y-5 p-5 sm:p-6">
            {mine.length > 0 && <button type="button" onClick={() => setView(mine[0].id)} className="flex items-center gap-1 text-sm font-semibold text-royal lg:hidden"><ArrowLeft className="h-4 w-4" /> My messages</button>}
            <div><h3 className="font-display text-xl font-bold">Send a Message or Report a Correction</h3><p className="text-sm text-slate-500">Describe the change or issue and our team will review it.</p></div>
            <fieldset>
              <legend className="label">Request type</legend>
              <div className="grid grid-cols-2 gap-3">
                {[{ v: 'correction', l: 'Correction / Issue', i: Wrench }, { v: 'message', l: 'General Message', i: MessageSquare }].map((o) => (
                  <label key={o.v} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-sm font-semibold transition ${form.type === o.v ? 'border-royal bg-royal-50 text-royal' : 'border-slate-200 text-navy hover:border-royal'}`}>
                    <input type="radio" name="type" className="accent-royal" checked={form.type === o.v} onChange={() => setForm((f) => ({ ...f, type: o.v }))} /><o.i className="h-4 w-4" />{o.l}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Related project"><select className="input" value={site.id} onChange={() => {}} aria-readonly><option value={site.id}>{site.name}</option></select></Field>
              <Field label="Work category"><select className="input" value={form.category} onChange={set('category')}>{TICKET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            </div>
            <Field label="Subject *" error={errors.subject}><input className={`input ${errors.subject ? 'input-error' : ''}`} value={form.subject} onChange={set('subject')} placeholder="e.g. Move the switchboard in the bedroom" /></Field>
            <Field label="Description *" error={errors.text}><textarea rows={5} className={`input resize-none ${errors.text ? 'input-error' : ''}`} value={form.text} onChange={set('text')} placeholder="Describe the correction or message in detail..." /></Field>
            <button className="btn-primary w-full sm:w-auto"><Send className="h-4 w-4" /> {form.type === 'correction' ? 'Submit Correction' : 'Send Message'}</button>
          </form>
        ) : (
          <>
            <div className="space-y-3 border-b border-slate-100 p-4">
              <button onClick={() => setView('new')} className="flex items-center gap-1 text-sm font-semibold text-royal lg:hidden"><ArrowLeft className="h-4 w-4" /> Back</button>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="font-display text-lg font-bold">{ticket.subject}</h3><p className="text-xs text-slate-500">{ticket.category} - {ticket.type === 'correction' ? 'Correction request' : 'Message'}</p></div>
                <TicketBadge status={ticket.status} />
              </div>
              <ol className="flex items-center gap-1.5" aria-label="Status progress">
                {TICKET_STATUSES.map((s, i) => {
                  const idx = TICKET_STATUSES.indexOf(ticket.status);
                  return <li key={s} className="flex flex-1 flex-col gap-1"><span className={`h-1.5 rounded-full ${i <= idx ? 'bg-royal' : 'bg-slate-200'}`} /><span className={`text-[10px] font-semibold ${i <= idx ? 'text-royal' : 'text-slate-400'}`}>{s}</span></li>;
                })}
              </ol>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-ice/60 p-4 scroll-thin" style={{ maxHeight: '50vh' }}>
              {ticket.thread.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.from === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.from === 'client' ? 'rounded-br-md bg-royal text-white' : 'rounded-bl-md bg-white text-slate-700'}`}>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <p className={`mt-1 text-[10px] ${m.from === 'client' ? 'text-blue-100' : 'text-slate-400'}`}>{m.from === 'client' ? 'You' : 'BuildCraft Admin'} - {formatDateTime(m.at)}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={send} className="flex gap-3 border-t border-slate-100 p-4">
              <input className="input" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a follow-up message..." aria-label="Follow-up message" />
              <button className="btn-primary shrink-0" disabled={!reply.trim()}><Send className="h-4 w-4" /><span className="hidden sm:inline">Send</span></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
