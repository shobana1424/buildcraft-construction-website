import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, X } from 'lucide-react';
import { interiorSlides } from '../data/mockData';
import SmartImage from './common/SmartImage';

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0.4 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0.4 }),
};

export default function InteriorCarousel({ slides = interiorSlides, interval = 4200 }) {
  const [[index, dir], setState] = useState([0, 1]);
  const [hovered, setHovered] = useState(false);
  const [full, setFull] = useState(false);
  const count = slides.length;

  const paginate = useCallback((d) => setState(([i]) => [(i + d + count) % count, d]), [count]);
  const goTo = (n) => setState(([i]) => [n, n >= i ? 1 : -1]);

  // Auto-rotate continuously; pauses on hover or while the full-screen preview is open.
  useEffect(() => {
    if (hovered || full) return undefined;
    const t = setInterval(() => paginate(1), interval);
    return () => clearInterval(t);
  }, [hovered, full, interval, paginate]);

  useEffect(() => {
    if (!full) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setFull(false);
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'ArrowLeft') paginate(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [full, paginate]);

  const slide = slides[index];

  return (
    <section className="overflow-hidden rounded-3xl bg-navy shadow-lift" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} aria-label="Interior Works Showcase">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-7">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Interior Works Showcase</span>
          <h3 className="font-display text-xl font-bold !text-white sm:text-2xl">Designed to Inspire</h3>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${hovered ? 'bg-gold/20 text-gold' : 'bg-white/10 text-blue-100'}`}>
          {hovered ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {hovered ? 'Paused' : 'Auto-playing'}
        </span>
      </div>

      <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden sm:aspect-[16/7]">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={slide.id}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 220, damping: 30 }, opacity: { duration: 0.35 } }}
            className="absolute inset-0"
          >
            <SmartImage src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
              <h4 className="font-display text-2xl font-bold !text-white sm:text-3xl">{slide.title}</h4>
              <p className="mt-1.5 max-w-2xl text-sm text-blue-100 sm:text-base">{slide.caption}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button onClick={() => paginate(-1)} aria-label="Previous slide" className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-navy shadow-lg transition hover:scale-110 hover:bg-gold">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={() => paginate(1)} aria-label="Next slide" className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-navy shadow-lg transition hover:scale-110 hover:bg-gold">
          <ChevronRight className="h-5 w-5" />
        </button>
        <button onClick={() => setFull(true)} aria-label="View full screen" className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy shadow-lg transition hover:bg-gold">
          <Maximize2 className="h-3.5 w-3.5" /> Full screen
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 py-4" role="tablist" aria-label="Slide indicators">
        {slides.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-gold' : 'w-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {full && (
          <motion.div className="fixed inset-0 z-[80] flex flex-col bg-black/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between p-4 text-white">
              <span className="text-sm font-semibold">{index + 1} / {count}</span>
              <button onClick={() => setFull(false)} aria-label="Close full screen" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
              <AnimatePresence mode="wait">
                <motion.div key={slide.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex max-h-full max-w-6xl flex-col items-center">
                  <SmartImage src={slide.image} alt={slide.title} className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain" />
                  <div className="mt-4 text-center text-white">
                    <h4 className="font-display text-2xl font-bold !text-white">{slide.title}</h4>
                    <p className="mt-1 max-w-2xl text-sm text-slate-300">{slide.caption}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <button onClick={() => paginate(-1)} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-gold hover:text-navy">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={() => paginate(1)} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-gold hover:text-navy">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
