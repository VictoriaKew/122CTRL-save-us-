import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Compliance() {
  const navigate = useNavigate();
  // Default to all platforms selected for the "wow" factor in the demo
  const [platforms, setPlatforms] = useState({ tiktok: true, instagram: true, youtube: true });

  const togglePlatform = (key) => setPlatforms(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-8 max-w-4xl mx-auto pb-32"
    >
      <header className="mb-12 mt-6">
        <h1 className="text-5xl font-bold tracking-tight text-[#1d1d1f] mb-2">Safety & Compliance.</h1>
        <p className="text-xl text-gray-500 font-light">Buddy is reviewing platform rules and copyright status.</p>
      </header>

      {/* SECTION 1: PLATFORM SELECTION (Glass Card) */}
      <div className="bg-white/60 backdrop-blur-2xl border border-white shadow-xl rounded-[40px] p-10 mb-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">1. Target Platforms</h3>
        <div className="flex flex-wrap gap-4">
          {Object.keys(platforms).map((platform) => (
            <button 
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`flex-1 min-w-[120px] py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 ${
                platforms[platform] 
                  ? 'bg-black text-white shadow-lg scale-105 border border-black' 
                  : 'bg-white/50 border border-white text-gray-400 hover:bg-white/80 hover:text-black'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: AI ANALYSIS RESULTS (Glass Card) */}
      <div className="bg-white/60 backdrop-blur-2xl border border-white shadow-xl rounded-[40px] p-10 mb-12">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">2. Buddy's Legal Analysis</h3>
        
        <div className="space-y-4">
          {/* Universal Audio Clearance */}
          <div className="flex items-start gap-4 p-6 bg-emerald-50/50 backdrop-blur-sm border border-emerald-100 rounded-[24px]">
            <CheckCircle2 className="text-emerald-500 mt-1 shrink-0" size={24} />
            <div>
              <p className="font-bold text-emerald-900 text-lg">Copyright Audio Cleared</p>
              <p className="text-emerald-700 font-medium leading-relaxed mt-1">"Lofi Study Beats" is flagged as trending and is 100% cleared for commercial use on all platforms.</p>
            </div>
          </div>

          {/* Dynamic Warnings with Framer Motion AnimatePresence */}
          <AnimatePresence>
            {platforms.tiktok && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-4 p-6 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-[24px] my-4">
                  <ShieldAlert className="text-yellow-600 mt-1 shrink-0" size={24} />
                  <div>
                    <p className="font-bold text-yellow-800 text-lg">TikTok Algorithm Warning</p>
                    <p className="text-yellow-700 font-medium leading-relaxed mt-1">Buddy removed the phrase "link in bio" from your script. TikTok's current algorithm shadowbans videos attempting to drive traffic off-platform.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {platforms.instagram && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-4 p-6 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-[24px] my-4">
                  <AlertTriangle className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <p className="font-bold text-blue-900 text-lg">Instagram Reels Strategy</p>
                    <p className="text-blue-700 font-medium leading-relaxed mt-1">Engagement bait is penalized. Buddy verified your caption provides genuine value without asking for artificial "saves" or "shares".</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {platforms.youtube && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-4 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-[24px] my-4">
                  <CheckCircle2 className="text-red-500 mt-1 shrink-0" size={24} />
                  <div>
                    <p className="font-bold text-red-900 text-lg">YouTube Shorts Loop</p>
                    <p className="text-red-700 font-medium leading-relaxed mt-1">Script pacing has been optimized to create a seamless loop at the 60-second mark to maximize viewer retention.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="flex justify-end">
        <button 
          onClick={() => navigate('/schedule')}
          className="flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-bold hover:scale-105 transition-all shadow-xl"
        >
          Approve & Go to Schedule <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}