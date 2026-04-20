import { motion } from 'framer-motion';
import { ShieldCheck, Music, Zap, Copy, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StrategyLab() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-apple-secondary p-6">
      <div className="max-w-6xl mx-auto py-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <button onClick={() => navigate('/')} className="text-apple-blue text-sm font-bold mb-2">← Back</button>
            <h1 className="text-5xl font-bold tracking-tight">Strategy Brief</h1>
          </div>
          <button onClick={() => navigate('/calendar')} className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2">
            <LayoutDashboard size={16}/> View Calendar
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-white p-12 rounded-[32px] shadow-sm flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-bold mb-8 uppercase tracking-widest">
                <ShieldCheck size={14} /> Compliance Passed
              </div>
              <h2 className="text-5xl font-bold mb-8 leading-tight">"Stop studying like it's 2010. Use the DNA method instead."</h2>
              <p className="text-apple-sub text-xl leading-relaxed italic">Fast-paced cuts of a desk setup. Sync text overlays to the beat. Transition to 122CTRL app interface.</p>
            </div>
            <div className="pt-8 border-t border-gray-50 flex justify-between">
              <span className="text-apple-sub font-bold text-xs uppercase tracking-widest">Draft v1.0</span>
              <button className="text-apple-blue font-bold flex items-center gap-2 underline underline-offset-4"><Copy size={16}/> Copy Script</button>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[28px] shadow-sm">
              <Music className="text-apple-blue mb-4" size={28} />
              <h4 className="text-apple-sub font-bold text-[10px] uppercase mb-1 tracking-widest">Audio DNA</h4>
              <p className="text-2xl font-bold italic text-apple-text">Chill Lofi (98bpm)</p>
            </div>
            <div className="bg-white p-8 rounded-[28px] shadow-sm">
              <Zap className="text-amber-500 mb-4" size={28} />
              <h4 className="text-apple-sub font-bold text-[10px] uppercase mb-1 tracking-widest">Pacing</h4>
              <p className="text-2xl font-bold italic text-apple-text">3s Pattern Interrupts</p>
            </div>
            <div className="bg-slate-900 text-white p-8 rounded-[28px] shadow-sm">
              <h4 className="text-gray-500 font-bold text-[10px] uppercase mb-4 tracking-widest">Guardian Analysis</h4>
              <p className="text-lg leading-relaxed text-gray-200">"Removed 'Link in Bio' to maximize TikTok algorithmic reach by 35%."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}