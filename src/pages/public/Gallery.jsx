import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Maximize2, X } from 'lucide-react';
import { IMAGES } from '../../data/mockData';
import { galleryFilters, projects } from '../../data/publicData';
import SmartImage from '../../components/common/SmartImage';
import { PageHeader } from '../../components/common/Misc';

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState(null); // index inside filtered list
  const list = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % list.length);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + list.length) % list.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, list.length]);

  const current = active !== null ? list[active] : null;

  return (
    <>
      <PageHeader eyebrow="Gallery" title="Our Projects in Pictures" text="Explore ongoing and completed residential, commercial, industrial and interior projects." image={IMAGES.tower} />
      <section className="container-x py-16">
        <div className="mb-10 flex flex-wrap justify-center gap-2.5" role="tablist" aria-label="Project categories">
          {galleryFilters.map((f) => (
            <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${filter === f ? 'bg-royal text-white shadow-md' : 'bg-ice text-navy hover:bg-royal-50'}`}>
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.button
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActive(i)}
                className="group relative overflow-hidden rounded-2xl text-left shadow-card"
                aria-label={`Preview ${p.title}`}
              >
                <SmartImage src={p.image} alt={p.title} className="h-72 w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent opacity-80 transition group-hover:opacity-100" />
                <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">{p.category}</span>
                <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${p.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>{p.status}</span>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="font-display text-lg font-bold !text-white">{p.title}</h3>
                  <p className="flex items-center gap-1 text-xs text-blue-100"><MapPin className="h-3.5 w-3.5" />{p.location}</p>
                </div>
                <span className="absolute bottom-4 right-4 rounded-full bg-white/90 p-2 text-navy opacity-0 transition group-hover:opacity-100"><Maximize2 className="h-4 w-4" /></span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <AnimatePresence>
        {current && (
          <motion.div className="fixed inset-0 z-[80] flex flex-col bg-black/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-end p-4">
              <button onClick={() => setActive(null)} aria-label="Close preview" className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X className="h-6 w-6" /></button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
              <AnimatePresence mode="wait">
                <motion.div key={current.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="text-center">
                  <SmartImage src={current.image} alt={current.title} className="mx-auto max-h-[72vh] max-w-full rounded-xl object-contain" />
                  <h3 className="mt-4 font-display text-2xl font-bold !text-white">{current.title}</h3>
                  <p className="text-sm text-slate-300">{current.category} - {current.location} - {current.status}</p>
                </motion.div>
              </AnimatePresence>
              <button onClick={() => setActive((i) => (i - 1 + list.length) % list.length)} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-gold hover:text-navy"><ChevronLeft className="h-6 w-6" /></button>
              <button onClick={() => setActive((i) => (i + 1) % list.length)} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-gold hover:text-navy"><ChevronRight className="h-6 w-6" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
