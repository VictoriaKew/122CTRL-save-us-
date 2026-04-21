import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, ScanLine, Activity } from 'lucide-react';

export default function Compliance() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [score, setScore] = useState(0);

  // Simulate an agentic workflow scanning the script upon load
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsScanning(false);
        setScore(98);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-4xl mx-auto pb-32">
      <header className="mb-12 mt-6">
        <h1 className="text-5xl font-bold tracking-tight text-[#1d1d1f] mb-2">Automated Compliance.</h1>
        <p className="text-xl text-gray-500 font-light">Buddy Agent is scanning your script against active platform algorithms.</p>
      </header>

      {/* AGENT SCANNER HUD */}
      <div className="bg-white/80 backdrop-blur-2xl border border-white/80 shadow-xl rounded-[40px] p-10 mb-8 relative overflow-hidden">
        {isScanning ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-6">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="text-blue-500">
                    <ScanLine size={64} />
                </motion.div>
                <h2 className="text-2xl font-bold animate-pulse">Running Policy Cross-Check...</h2>
                <div className="flex gap-4 text-sm text-gray-400 font-medium">
                    <span className="flex items-center gap-2"><Activity size={16}/> Audio Fingerprinting</span>
                    <span className="flex items-center gap-2"><Activity size={16}/> Text Toxicity</span>
                </div>
            </div>
        ) : (
            <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-40 h-40 rounded-full border-8 border-green-400 flex flex-col items-center justify-center bg-green-50 shadow-inner">
                    <span className="text-5xl font-black text-green-600">{score}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-green-600/70">Safe Score</span>
                </div>
                <div className="flex-1 space-y-4">
                    <div className="p-5 bg-gray-50 rounded-2xl flex items-start gap-4 border border-gray-100">
                        <CheckCircle2 className="text-green-500 mt-1 shrink-0" />
                        <div>
                            <p className="font-bold">Copyright Audio Cleared</p>
                            <p className="text-sm text-gray-500">Background track matches safe commercial-use libraries.</p>
                        </div>
                    </div>
                    <div className="p-5 bg-blue-50 rounded-2xl flex items-start gap-4 border border-blue-100">
                        <AlertTriangle className="text-blue-500 mt-1 shrink-0" />
                        <div>
                            <p className="font-bold text-blue-900">Auto-Fix: Engagement Bait Removed</p>
                            <p className="text-sm text-blue-700">Agent removed "link in bio" to prevent TikTok algorithmic shadowbanning.</p>
                        </div>
                    </div>
                    <div className="p-5 bg-yellow-50 rounded-2xl flex items-start gap-4 border border-yellow-100">
                        <ShieldAlert className="text-yellow-600 mt-1 shrink-0" />
                        <div>
                            <p className="font-bold text-yellow-800">Monetization Status</p>
                            <p className="text-sm text-yellow-700">Script is fully compliant with YouTube Partner Program advertiser guidelines.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      <div className="flex justify-end">
        <button 
          disabled={isScanning}
          onClick={() => navigate('/schedule')}
          className="flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-bold hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:scale-100"
        >
          {isScanning ? 'Awaiting Scan...' : 'Approve & Go to Schedule'} <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}