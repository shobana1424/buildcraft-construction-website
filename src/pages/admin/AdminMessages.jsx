import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, MessageSquare, Search, Send, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TICKET_STATUSES } from '../../data/constants';
import { formatDateTime, timeAgo } from '../../utils/format';
import { EmptyState, TicketBadge } from '../../components/common/Misc';

export default function AdminMessages() {
  const { tickets, getClient, getSite, replyTicket, setTicketStatus, toast } = useApp();
  const [selectedId, setSelectedId] = useState(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [reply, setReply] = useState('');
  const endRef = useRef(null);

  const list = [...tickets]
    .sort((a, b) => new Date(b.thread[b.thread.length - 1].at) - new Date(a.thread[a.thread.length - 1].at))
    .filter((t) => (filter === 'All' || t.status === filter) && `${t.subject} ${getClient(t.clientId)?.name} ${getSite(t.siteId)?.name}`.toLowerCase().includes(q.toLowerCase()));
  const ticket = tickets.find((t) => t.id === selectedId);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [ticket?.thread.length, selectedId]);

  const send = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    replyTicket(ticket.id, 'admin', reply.trim());
    setReply('');
    toast('Reply sent to client.');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className={`card flex flex-col !p-0 lg:col-span-2 ${ticket ? 'hidden lg:flex' : 'flex'}`}>
        <div className="space-y-3 border-b border-slate-100 p-4">
          <div className="relative"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="input pl-10" placeholder="Search messages..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <div className="flex flex-wrap gap-1.5">
            {['All', ...TICKET_STATUSES].map((s) => <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1 text-xs font-semibold transition ${filter === s ? 'bg-royal text-white' : 'bg-ice text-navy hover:bg-royal-50'}`}>{s}</button>)}
          </div>
        </div>
        <ul className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto scroll-thin">
          {list.length === 0 && <li className="p-6"><EmptyState title="No messages found" /></li>}
          {list.map((t) => {
            const last = t.thread[t.thread.length - 1];
            return (
              <li key={t.id}>
                <button onClick={() => setSelectedId(t.id)} className={`w-full px-4 py-3.5 text-left transition hover:bg-ice ${selectedId === t.id ? 'bg-royal-50' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex items-center gap-1.5 truncate text-sm font-bold text-navy">{t.type === 'correction' ? <Wrench className="h-3.5 w-3.5 shrink-0 text-danger" /> : <MessageSquare className="h-3.5 w-3.5 shrink-0 text-royal" />}{t.subject}</p>
                    <TicketBadge status={t.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{getClient(t.clientId)?.name} - {getSite(t.siteId)?.name}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-600">{last.from === 'admin' ? 'You: ' : ''}{last.text}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{t.category} - {timeAgo(last.at)}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={`card flex min-h-[28rem] flex-col !p-0 lg:col-span-3 ${ticket ? 'flex' : 'hidden lg:flex'}`}>
        {!ticket ? (
          <div className="m-auto p-8"><EmptyState title="Select a conversation" text="Choose a client message or correction request to read and reply." icon={MessageSquare} /></div>
        ) : (
          <>
            <div className="space-y-3 border-b border-slate-100 p-4">
              <button onClick={() => setSelectedId(null)} className="flex items-center gap-1 text-sm font-semibold text-royal lg:hidden"><ArrowLeft className="h-4 w-4" /> Back</button>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold">{ticket.subject}</h3>
                  <p className="text-xs text-slate-500">{getClient(ticket.clientId)?.name} - {getSite(ticket.siteId)?.name} - {ticket.category} - {ticket.type === 'correction' ? 'Correction request' : 'Message'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select aria-label="Update status" value={ticket.status} onChange={(e) => { setTicketStatus(ticket.id, e.target.value); toast(`Status updated to ${e.target.value}.`); }} className="input !w-auto !py-1.5 text-xs font-semibold">
                    {TICKET_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <button disabled={ticket.status === 'Resolved'} onClick={() => { setTicketStatus(ticket.id, 'Resolved'); toast('Marked as resolved.'); }} className="btn-primary btn-sm"><CheckCircle2 className="h-3.5 w-3.5" /> Resolve</button>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-ice/60 p-4 scroll-thin" style={{ maxHeight: '50vh' }}>
              {ticket.thread.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.from === 'admin' ? 'rounded-br-md bg-royal text-white' : 'rounded-bl-md bg-white text-slate-700'}`}>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <p className={`mt-1 text-[10px] ${m.from === 'admin' ? 'text-blue-100' : 'text-slate-400'}`}>{m.from === 'admin' ? 'You' : getClient(ticket.clientId)?.name} - {formatDateTime(m.at)}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={send} className="flex gap-3 border-t border-slate-100 p-4">
              <input className="input" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply to the client..." aria-label="Reply" />
              <button className="btn-primary shrink-0" disabled={!reply.trim()}><Send className="h-4 w-4" /><span className="hidden sm:inline">Reply</span></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
