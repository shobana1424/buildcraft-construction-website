import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, MapPin, Quote, Star } from 'lucide-react';
import { IMAGES } from '../../data/mockData';
import { projects, services, stats, testimonials, whyUs } from '../../data/publicData';
import Reveal from '../../components/common/Reveal';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import SmartImage from '../../components/common/SmartImage';
import { Icon } from '../../components/common/Misc';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy text-white">
        <SmartImage src={IMAGES.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30" />
        <div className="blueprint-bg absolute inset-0 opacity-30" />
        <div className="container-x relative pb-20 pt-36">
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Premium Construction Since 2008
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="max-w-3xl font-display text-4xl font-extrabold leading-tight !text-white sm:text-6xl">
            We Build Spaces That <span className="text-gold">Stand the Test</span> of Time
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-6 max-w-xl text-lg text-blue-100">
            From foundations to finishing touches - BuildCraft delivers residential, commercial and industrial projects with live progress tracking you can follow from your own dashboard.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="mt-9 flex flex-wrap gap-4">
            <Link to="/contact" className="btn-gold px-7 py-3.5 text-base">Request a Quote <ArrowRight className="h-5 w-5" /></Link>
            <Link to="/client/login" className="btn border border-white/40 px-7 py-3.5 text-base text-white hover:bg-white/10">Track My Project</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-14 flex flex-wrap gap-8 text-sm text-blue-100">
            {['Certified Engineers', 'On-Time Delivery', 'Transparent Pricing'].map((t) => (
              <span key={t} className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-gold" />{t}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <SmartImage src={IMAGES.site1} alt="Construction in progress" className="h-[420px] w-full rounded-3xl object-cover shadow-lift" />
            <div className="absolute -bottom-6 -right-2 rounded-2xl bg-gold p-5 text-navy shadow-lift sm:-right-6">
              <p className="font-display text-4xl font-bold">18+</p>
              <p className="text-sm font-semibold">Years of Experience</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <span className="section-eyebrow">About BuildCraft</span>
          <h2 className="section-title">Engineering Precision Meets Thoughtful Design</h2>
          <p className="mt-5 text-slate-600">BuildCraft Constructions is a full-service construction company delivering homes, commercial spaces and industrial facilities across South India. Our integrated teams handle structure, electrical, plumbing and interiors under one roof.</p>
          <p className="mt-3 text-slate-600">Every client gets a private dashboard with live progress, daily updates, site photos and a direct channel to raise corrections - so you always know exactly where your project stands.</p>
          <Link to="/about" className="btn-primary mt-7">Learn More About Us <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
      </section>

      {/* Services */}
      <section className="bg-ice py-20">
        <div className="container-x">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <span className="section-eyebrow">What We Do</span>
            <h2 className="section-title">Complete Construction Services</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.05}>
                <motion.div whileHover={{ y: -8 }} className="group h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition hover:shadow-lift">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-royal-50 text-royal transition group-hover:bg-royal group-hover:text-white">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
            <Reveal delay={0.35}>
              <Link to="/services" className="flex h-full min-h-[10rem] flex-col items-center justify-center rounded-2xl bg-navy p-6 text-center text-white shadow-card transition hover:bg-royal">
                <span className="font-display text-lg font-bold !text-white">View All Services</span>
                <ArrowRight className="mt-2 h-6 w-6 text-gold" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="container-x py-20">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-eyebrow">Our Work</span>
            <h2 className="section-title">Featured Projects</h2>
          </div>
          <Link to="/gallery" className="btn-outline">View Full Gallery <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <motion.article whileHover={{ y: -8 }} className="group overflow-hidden rounded-2xl bg-white shadow-card transition hover:shadow-lift">
                <div className="relative h-60 overflow-hidden">
                  <SmartImage src={p.image} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">{p.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold">{p.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="h-4 w-4 text-royal" />{p.location} - {p.status}</p>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-navy py-16 text-white">
        <div className="blueprint-bg absolute inset-0 opacity-20" />
        <div className="container-x relative grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl font-bold text-gold sm:text-5xl"><AnimatedCounter value={s.value} suffix={s.suffix} /></p>
              <p className="mt-2 text-sm font-medium text-blue-100">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="container-x py-20">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-eyebrow">Why Choose Us</span>
          <h2 className="section-title">Built on Trust, Delivered with Pride</h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.05}>
              <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600"><Icon name={w.icon} className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-display text-lg font-bold">{w.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{w.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ice py-20">
        <div className="container-x">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <span className="section-eyebrow">Testimonials</span>
            <h2 className="section-title">What Our Clients Say</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="relative h-full rounded-2xl bg-white p-7 shadow-card">
                  <Quote className="absolute right-6 top-6 h-10 w-10 text-royal/10" />
                  <div className="mb-4 flex gap-0.5">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className="h-4 w-4 fill-gold text-gold" />)}</div>
                  <p className="text-slate-600">"{t.text}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-royal font-bold text-white">{t.name[0]}</span>
                    <div>
                      <p className="font-semibold text-navy">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-royal px-8 py-14 text-center text-white sm:px-16">
            <div className="blueprint-bg absolute inset-0 opacity-20" />
            <h2 className="relative font-display text-3xl font-bold !text-white sm:text-4xl">Ready to Start Your Dream Project?</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-blue-100">Share your requirements through our enquiry form and our team will get back to you by email.</p>
            <Link to="/contact" className="btn-gold relative mt-8 px-8 py-3.5 text-base">Send an Enquiry <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
