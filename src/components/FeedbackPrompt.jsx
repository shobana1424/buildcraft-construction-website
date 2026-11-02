import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { overallProgress } from '../utils/progress';
import Modal from './common/Modal';
import { Stars } from './common/Misc';

// 85% completion feedback popup. Shown automatically once per project.
export default function FeedbackPrompt() {
  const { clientSite, feedbackPrompted, markFeedbackPrompted, submitFeedback, toast } = useApp();
  const progress = clientSite ? overallProgress(clientSite) : 0;
  const eligible = !!clientSite && progress >= 85 && !feedbackPrompted[clientSite.id];

  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!eligible) {
      setShow(false);
      return undefined;
    }
    const t = setTimeout(() => setShow(true), 700);
    return () => clearTimeout(t);
  }, [eligible]);

  if (!clientSite) return null;

  const later = () => {
    setShow(false);
    markFeedbackPrompted(clientSite.id);
  };
  const submit = (e) => {
    e.preventDefault();
    if (!rating) return setError('Please select a star rating.');
    submitFeedback({ siteId: clientSite.id, rating, comment: comment.trim() });
    markFeedbackPrompted(clientSite.id);
    setShow(false);
    toast('Thank you! Your feedback has been submitted.');
  };

  return (
    <Modal open={show} onClose={later} size="max-w-lg" padded={false}>
      <div className="relative overflow-hidden bg-gradient-to-br from-navy to-royal px-6 pb-8 pt-10 text-center text-white">
        <div className="blueprint-bg absolute inset-0 opacity-20" />
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.15 }} className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-navy shadow-lg">
          <PartyPopper className="h-8 w-8" />
        </motion.div>
        <h2 className="relative font-display text-2xl font-bold !text-white sm:text-3xl">Your Dream Project Is Almost Ready!</h2>
        <p className="relative mt-3 text-sm text-blue-100 sm:text-base">
          We are excited to inform you that your construction project has reached 85% completion. We would love to hear your feedback about our work so far.
        </p>
      </div>
      <form onSubmit={submit} className="space-y-4 p-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-semibold text-navy">Rate your experience</span>
          <Stars value={rating} hover={hover} onHover={setHover} onChange={(n) => { setRating(n); setError(''); }} size="h-9 w-9" />
          {error && <p className="field-error">{error}</p>}
        </div>
        <div>
          <label className="label" htmlFor="fb-text">Your feedback</label>
          <textarea id="fb-text" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us what we did well and what we can improve..." className="input resize-none" />
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={later} className="btn-outline">Maybe Later</button>
          <button type="submit" className="btn-gold">Submit Feedback</button>
        </div>
      </form>
    </Modal>
  );
}
