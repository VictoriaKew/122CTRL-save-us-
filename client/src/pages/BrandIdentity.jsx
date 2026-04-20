import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link2, Sparkles, ShieldCheck } from 'lucide-react';

export default function BrandIdentity() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => navigate('/lab'), 1500);
  };

  return (
    <div className="min-h-screen bg-white text-apple-text">
      <nav className="fixed top-0 w-full h-12 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center justify-between px-10">
        <div className="font-bold tracking-tighter text-lg">122CTRL</div>
        <button className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-bold">Get Started</button>
      </nav>

      <section className="pt-40 pb-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tight leading-[0.95] mb-8">Your content. <br/> <span className="text-apple-sub">Perfected.</span></h1>
          <p className="text-2xl text-apple-sub max-w-2xl mx-auto mb-12 font-medium">The world's first agentic copilot that clones your brand DNA.</p>

          <div className="max-w-xl mx-auto bg-apple-secondary rounded-[24px] p-2 flex items-center border border-transparent focus-within:bg-white focus-within:border-apple-blue transition-all shadow-inner">
            <Link2 className="ml-4 text-apple-sub" />
            <input 
              className="w-full bg-transparent py-5 px-4 text-xl outline-none placeholder:text-apple-sub font-medium"
              placeholder="Paste video URL"
              onChange={(e) => setUrl(e.target.value)}
            />
            <button onClick={handleStart} className="bg-apple-blue text-white px-8 py-4 rounded-[20px] font-bold text-sm hover:bg-blue-700 transition-all shadow-lg active:scale-95">
              {loading ? "Analyzing..." : "Start"}
            </button>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-apple-secondary rounded-[32px] p-12 relative overflow-hidden group">
          <Sparkles className="text-apple-blue mb-4" size={40} />
          <h3 className="text-4xl font-bold mb-4">DNA Extraction</h3>
          <p className="text-xl text-apple-sub max-w-sm">We clone your tone, pacing, and visual style from your best work.</p>
        </div>
        <div className="bg-black text-white rounded-[32px] p-12 flex flex-col justify-between">
          <ShieldCheck className="text-emerald-400" size={40} />
          <h3 className="text-3xl font-bold mb-2 text-white">Guardian AI</h3>
          <p className="text-gray-400">Automatic compliance checks for platform guidelines.</p>
        </div>
      </section>
    </div>
  );
}