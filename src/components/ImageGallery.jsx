import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { formatDate } from '../utils/format';
import SmartImage from './common/SmartImage';

// Thumbnail grid with a full-screen preview (used for construction site images).
export default function ImageGallery({ images, columns = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' }) {
  const [active, setActive] = useState(null);
  const count = images.length;

  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % count);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + count) % count);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, count]);

  const current = active !== null ? images[active] : null;

  return (
    <>
      <div className={`grid gap-4 ${columns}`}>
        {images.map((im, i) => (
          <motion.button key={im.id} whileHover={{ y: -4 }} onClick={() => setActive(i)} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 text-left shadow-card" aria-label={`Preview ${im.caption || 'image'}`}>
            <SmartImage src={im.url} alt={im.caption} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-3 text-white">
              <p className="line-clamp-1 text-sm font-semibold">{im.caption || 'Site image'}</p>
              <p className="text-[11px] text-blue-100">{formatDate(im.date)}</p>
            </div>
            <span className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-navy opacity-0 transition group-hover:opacity-100"><Maximize2 className="h-3.5 w-3.5" /></span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div className="fixed inset-0 z-[80] flex flex-col bg-black/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-end p-4">
              <button onClick={() => setActive(null)} aria-label="Close preview" className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X className="h-6 w-6" /></button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
              <AnimatePresence mode="wait">
                <motion.div key={current.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="text-center">
                  <SmartImage src={current.url} alt={current.caption} className="mx-auto max-h-[75vh] max-w-full rounded-xl object-contain" />
                  <p className="mt-3 font-semibold text-white">{current.caption}</p>
                  <p className="text-xs text-slate-300">{formatDate(current.date)} - {active + 1} / {count}</p>
                </motion.div>
              </AnimatePresence>
              {count > 1 && (
                <>
                  <button onClick={() => setActive((i) => (i - 1 + count) % count)} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-gold hover:text-navy"><ChevronLeft className="h-6 w-6" /></button>
                  <button onClick={() => setActive((i) => (i + 1) % count)} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-gold hover:text-navy"><ChevronRight className="h-6 w-6" /></button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
