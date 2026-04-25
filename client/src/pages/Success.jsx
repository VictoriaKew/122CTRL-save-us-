import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // Fire confetti explosion when the page loads!
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#601ccb', '#3b82f6', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#601ccb', '#3b82f6', '#10b981']
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-500 dark:text-emerald-400 mb-8 transition-colors">
        <CheckCircle size={100} strokeWidth={1} />
      </motion.div>
      
      <motion.h2 
        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-[0.3em] uppercase mb-4 transition-colors"
      >
        Phase 05: Hand-off
      </motion.h2>

      <h1 className="text-6xl font-bold tracking-tight mb-4 text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors">
        Mission Accomplished.
      </h1>
      
      <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg mb-12 transition-colors">
        Your strategy has been learned, checked, and scheduled. Buddy will handle the rest.
      </p>

      <button 
        onClick={() => navigate('/app')}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors hover:scale-105"
      >
        <ArrowLeft size={18} /> Create Another Strategy
      </button>
    </div>
  );
}