import { motion } from 'framer-motion';
import { ShieldCheck, Music, Zap, Copy } from 'lucide-react';

export default function StrategyLab() {
  return (
    <div className="min-h-screen bg-apple-secondary p-6 font-sans">
      <div className="max-w-6xl mx-auto py-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Your Strategy</h1>
            <p className="text-apple-sub text-lg mt-2">Personalized for Jennie's Brand Voice.</p>
          </div>
          <button className="bg-apple-blue text-white px-6 py-3 rounded-full font-bold text-sm">Download Brief</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Card: The Script */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-white p-10 rounded-apple shadow-sm flex flex-col justify-between min-h-[500px]"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-xs font-bold mb-8">
                <ShieldCheck size={14} /> COMPLIANCE PASSED
              </div>
              <h2 className="text-4xl font-bold mb-6 italic leading-tight text-apple-text">"Stop studying like it's 2010. Use the DNA method instead."</h2>
              <p className="text-apple-sub text-xl leading-relaxed">Fast cuts of a desk setup, text overlays popping in sync with the beat. Transition to a screen share of the 122CTRL app.</p>
            </div>
            
            <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-bold text-apple-sub uppercase tracking-widest">Script Draft #1</span>
              <button className="text-apple-blue font-bold flex items-center gap-2"><Copy size={16}/> Copy Script</button>
            </div>
          </motion.div>

          {/* Side Cards */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-apple shadow-sm">
              <Music className="text-apple-blue mb-4" size={32} />
              <h4 className="text-apple-sub font-bold text-xs uppercase mb-1">Audio DNA</h4>
              <p className="text-xl font-bold italic">Chill Lofi Beat (98bpm)</p>
            </div>

            <div className="bg-white p-8 rounded-apple shadow-sm">
              <Zap className="text-amber-500 mb-4" size={32} />
              <h4 className="text-apple-sub font-bold text-xs uppercase mb-1">Pacing</h4>
              <p className="text-xl font-bold italic">High Intensity (3s cuts)</p>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-apple shadow-sm border border-slate-800">
              <h4 className="text-gray-400 font-bold text-xs uppercase mb-4">Guardian Alert</h4>
              <p className="text-lg leading-relaxed text-gray-200 font-medium">
                "Replaced 'Link in Bio' with 'Check Profile' to maximize TikTok Reach."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}