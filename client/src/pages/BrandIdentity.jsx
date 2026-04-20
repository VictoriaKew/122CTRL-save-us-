import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Link2 } from 'lucide-react';

export default function BrandIdentity() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => navigate('/lab'), 1500);
  };

  return (
    <div className="min-h-screen bg-apple-bg text-apple-text font-sans selection:bg-apple-blue/20">
      {/* Super-Thin Top Nav */}
      <nav className="h-12 border-b border-gray-100 flex items-center justify-center px-6 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <span className="font-bold tracking-tight text-sm">122CTRL</span>
      </nav>

      <main className="max-w-5xl mx-auto pt-24 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-apple-blue font-semibold text-xl">Content Copilot</h2>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">Clone your vibe. <br/> <span className="text-apple-sub">Effortlessly.</span></h1>
        </motion.div>

        {/* The "Apple Search Bar" Input */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-apple-secondary rounded-apple p-1 flex items-center border border-transparent focus-within:border-apple-blue transition-all">
            <div className="pl-6 text-apple-sub"><Link2 size={22} /></div>
            <input 
              className="flex-1 bg-transparent py-6 px-4 text-xl outline-none placeholder:text-apple-sub font-medium"
              placeholder="Paste video link"
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              onClick={handleStart}
              className="bg-apple-blue text-white px-8 py-4 rounded-[18px] font-bold text-sm hover:opacity-90 active:scale-95 transition-all mr-1"
            >
              {loading ? "Analyzing..." : "Continue"}
            </button>
          </div>
          <p className="text-center mt-6 text-apple-sub text-sm">Supports TikTok, Reels, and YouTube Shorts.</p>
        </div>

        {/* Feature Grid - Looks like Apple Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-32 pb-24">
          <div className="bg-apple-secondary p-12 rounded-apple h-[400px] flex flex-col justify-end">
            <h3 className="text-3xl font-bold mb-2">Style Extractor</h3>
            <p className="text-apple-sub text-lg">Our engine analyzes pacing, tone, and visual hooks in seconds.</p>
          </div>
          <div className="bg-slate-900 text-white p-12 rounded-apple h-[400px] flex flex-col justify-end">
            <h3 className="text-3xl font-bold mb-2 text-white">Guardian AI</h3>
            <p className="text-gray-400 text-lg">Real-time compliance checks to avoid shadowbans on any platform.</p>
          </div>
        </div>
      </main>
    </div>
  );
}