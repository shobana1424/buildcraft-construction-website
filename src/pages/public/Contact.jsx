import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Clock, Mail, MapPin, Send } from 'lucide-react';
import { COMPANY } from '../../data/constants';
import { IMAGES } from '../../data/mockData';
import { enquiryServices } from '../../data/publicData';
import { isEmail } from '../../utils/format';
import Reveal from '../../components/common/Reveal';
import { Field, PageHeader } from '../../components/common/Misc';

const empty = { name: '', email: '', subject: '', service: '', location: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email address is required.';
    else if (!isEmail(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.service) e.service = 'Please select a service.';
    if (!form.location.trim()) e.location = 'Project location is required.';
    if (!form.message.trim()) e.message = 'Please describe your requirement.';
    else if (form.message.trim().length < 10) e.message = 'Message should be at least 10 characters.';
    return e;
  };

  // Frontend-only: nothing is sent anywhere.
  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSent(true);
    setForm(empty);
  };

  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`;

  return (
    <>
      <PageHeader eyebrow="Contact Us" title="Let's Discuss Your Project" text="Send us an enquiry and our team will respond to you by email." image={IMAGES.site1} />
      <section className="container-x grid gap-10 py-16 lg:grid-cols-5">
        <Reveal className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl bg-navy p-7 text-white shadow-lift">
            <h2 className="font-display text-2xl font-bold !text-white">Get in Touch</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold"><Mail className="h-5 w-5" /></span><div><p className="font-semibold text-gold">Email</p><a href={`mailto:${COMPANY.email}`} className="break-all text-blue-100 hover:text-white">{COMPANY.email}</a></div></li>
              <li className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold"><MapPin className="h-5 w-5" /></span><div><p className="font-semibold text-gold">Address</p><p className="text-blue-100">{COMPANY.address.map((l) => <span key={l} className="block">{l}</span>)}</p></div></li>
              <li className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold"><Clock className="h-5 w-5" /></span><div><p className="font-semibold text-gold">Office Hours</p><p className="text-blue-100">{COMPANY.hours}</p></div></li>
            </ul>
          </div>

          {/* Google Maps placeholder (swap for a real embed iframe later) */}
          <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-200 bg-royal-50 shadow-card" role="img" aria-label="Map placeholder showing company location">
            <div className="blueprint-bg absolute inset-0" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 260" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 190 C80 150 140 210 220 160 S340 120 400 140" stroke="#1769E0" strokeOpacity=".35" strokeWidth="10" fill="none" />
              <path d="M90 0 C110 80 80 150 120 260" stroke="#F5A623" strokeOpacity=".55" strokeWidth="7" fill="none" />
              <path d="M260 0 C250 70 300 130 280 260" stroke="#1769E0" strokeOpacity=".2" strokeWidth="6" fill="none" />
            </svg>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[70%]">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} className="flex flex-col items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger text-white shadow-lg ring-4 ring-white"><MapPin className="h-6 w-6" /></span>
                <span className="mt-1 h-2 w-6 rounded-full bg-navy/20 blur-sm" />
              </motion.div>
            </div>
            <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-navy shadow">{COMPANY.name} - Head Office</div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-9">
            <h2 className="font-display text-2xl font-bold">Send an Enquiry</h2>
            <p className="mt-1 text-sm text-slate-500">Fields marked * are required. This demo form does not send real emails.</p>

            <AnimatePresence>
              {sent && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="mt-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Enquiry submitted successfully!</p>
                    <p className="text-sm">Thank you for contacting {COMPANY.name}. Our team will review your requirement and reply to your email shortly.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={submit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Full Name *" error={errors.name}><input className={cls('name')} value={form.name} onChange={set('name')} placeholder="Your full name" autoComplete="name" /></Field>
              <Field label="Email Address *" error={errors.email}><input type="email" className={cls('email')} value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" /></Field>
              <div className="sm:col-span-2"><Field label="Subject *" error={errors.subject}><input className={cls('subject')} value={form.subject} onChange={set('subject')} placeholder="e.g. 3BHK villa construction estimate" /></Field></div>
              <Field label="Service Required *" error={errors.service}>
                <select className={cls('service')} value={form.service} onChange={set('service')}>
                  <option value="">Select a service</option>
                  {enquiryServices.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Project Location *" error={errors.location}><input className={cls('location')} value={form.location} onChange={set('location')} placeholder="City / area" /></Field>
              <div className="sm:col-span-2"><Field label="Message *" error={errors.message}><textarea rows={5} className={`${cls('message')} resize-none`} value={form.message} onChange={set('message')} placeholder="Tell us about your project, size, timeline and budget..." /></Field></div>
              <div className="sm:col-span-2"><button type="submit" className="btn-primary w-full py-3.5 text-base sm:w-auto"><Send className="h-4 w-4" /> Submit Enquiry</button></div>
            </form>
          </div>
        </Reveal>
      </section>
    </>
  );
}
