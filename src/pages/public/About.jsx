import { Eye, Target } from 'lucide-react';
import { IMAGES } from '../../data/mockData';
import { stats, team, timeline, values } from '../../data/publicData';
import Reveal from '../../components/common/Reveal';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import SmartImage from '../../components/common/SmartImage';
import { Icon, PageHeader } from '../../components/common/Misc';

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About Us" title="Building Trust, One Project at a Time" text="Learn about the people, principles and experience behind BuildCraft Constructions." image={IMAGES.site2} />

      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <Reveal>
          <span className="section-eyebrow">Company Profile</span>
          <h2 className="section-title">A Legacy of Quality Construction</h2>
          <p className="mt-5 text-slate-600">Founded in 2008, BuildCraft Constructions has grown from a small residential contractor into a multi-disciplinary construction company serving homeowners, developers and industries.</p>
          <p className="mt-3 text-slate-600">Our in-house teams cover structural works, electrical, plumbing, interior design and ceiling work, giving clients a single accountable partner. In 2024 we introduced a client progress portal so every project is transparent from day one.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <SmartImage src={IMAGES.site4} alt="BuildCraft team on site" className="h-[380px] w-full rounded-3xl object-cover shadow-lift" />
        </Reveal>
      </section>

      <section className="bg-ice py-20">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, title: 'Our Mission', text: 'To deliver safe, durable and beautifully finished buildings on time and within budget, while keeping our clients informed and involved at every stage.' },
            { icon: Eye, title: 'Our Vision', text: 'To be the most trusted construction brand in South India - recognised for engineering excellence, transparency and long-term client relationships.' },
          ].map((m, i) => (
            <Reveal key={m.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl bg-white p-8 shadow-card">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-gold"><m.icon className="h-7 w-7" /></div>
                <h3 className="font-display text-2xl font-bold">{m.title}</h3>
                <p className="mt-3 text-slate-600">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-20">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-eyebrow">Experience</span>
          <h2 className="section-title">Our Journey & Numbers</h2>
        </Reveal>
        <div className="grid gap-10 lg:grid-cols-2">
          <ol className="relative space-y-8 border-l-2 border-royal/20 pl-8">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 0.08} className="relative">
                <span className="absolute -left-[2.6rem] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold ring-4 ring-white" />
                <p className="font-display text-2xl font-bold text-royal">{t.year}</p>
                <p className="text-slate-600">{t.text}</p>
              </Reveal>
            ))}
          </ol>
          <div className="grid grid-cols-2 gap-5">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-navy p-6 text-center text-white shadow-card">
                <p className="font-display text-4xl font-bold text-gold"><AnimatedCounter value={s.value} suffix={s.suffix} /></p>
                <p className="mt-1 text-sm text-blue-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ice py-20">
        <div className="container-x">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <span className="section-eyebrow">Core Values</span>
            <h2 className="section-title">What Guides Us</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl bg-white p-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-royal-50 text-royal"><Icon name={v.icon} className="h-7 w-7" /></div>
                  <h3 className="font-display text-xl font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-eyebrow">Our Team</span>
          <h2 className="section-title">Meet the Leadership</h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.07}>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-navy to-royal font-display text-3xl font-bold text-gold">
                  {m.name.split(' ').map((p) => p[0]).join('')}
                </div>
                <h3 className="font-display text-lg font-bold">{m.name}</h3>
                <p className="text-sm text-slate-500">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
