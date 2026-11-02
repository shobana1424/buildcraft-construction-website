import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { IMAGES } from '../../data/mockData';
import { services } from '../../data/publicData';
import Reveal from '../../components/common/Reveal';
import SmartImage from '../../components/common/SmartImage';
import { Icon, PageHeader } from '../../components/common/Misc';

export default function Services() {
  return (
    <>
      <PageHeader eyebrow="Our Services" title="End-to-End Construction Solutions" text="From structure to interiors, our specialist teams deliver every trade with precision." image={IMAGES.site3} />
      <section className="container-x space-y-20 py-20">
        {services.map((s, i) => (
          <Reveal key={s.id}>
            <article id={s.id} className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
              <div className="overflow-hidden rounded-3xl shadow-lift">
                <SmartImage src={s.image} alt={s.title} className="h-80 w-full object-cover transition duration-700 hover:scale-105" />
              </div>
              <div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-gold"><Icon name={s.icon} className="h-7 w-7" /></div>
                <h2 className="section-title !text-3xl">{s.title}</h2>
                <p className="mt-3 text-slate-600">{s.desc}</p>
                <ul className="mt-5 space-y-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm font-medium text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />{p}</li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-primary mt-6">Enquire Now <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}
