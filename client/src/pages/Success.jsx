import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Success() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-500 mb-8">
        <CheckCircle size={100} strokeWidth={1} />
      </motion.div>
      
      <h1 className="text-6xl font-bold tracking-tight mb-4">Mission Accomplished.</h1>
      <p className="text-xl text-gray-400 max-w-lg mb-12">
        Your strategy has been learned, checked, and scheduled. Buddy will handle the rest.
      </p>

<button 
        // 1. CHANGE '/' TO '/app'
        onClick={() => navigate('/app')}
        className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
      >
        <ArrowLeft size={18} /> Create Another Strategy
      </button>
    </div>
  );
}