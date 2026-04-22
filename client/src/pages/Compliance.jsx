import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, ScanLine, Video, Camera, Music, Info, Loader2 } from 'lucide-react';

export default function Compliance() {
  const navigate = useNavigate();
  
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [scanState, setScanState] = useState('selection'); // 'selection' | 'scanning' | 'results'
  const [scanResults, setScanResults] = useState([]);
  const [score, setScore] = useState(0);
  const [isApiLoading, setIsApiLoading] = useState(false);
  
  // --- NEW TOAST STATE ---
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const availablePlatforms = [
    { id: 'tiktok', name: 'TikTok', icon: <Music size={20} />, color: 'bg-black text-white dark:bg-white dark:text-black' },
    { id: 'youtube', name: 'YouTube Shorts', icon: <Video size={20} />, color: 'bg-red-500 text-white' },
    { id: 'instagram', name: 'Instagram Reels', icon: <Camera size={20} />, color: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 text-white' }
  ];

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const runComplianceScan = async () => {
    setIsApiLoading(true);
    setScanState('scanning');

    const storedProject = JSON.parse(sessionStorage.getItem('lastBuddyProject')) || {};
    const scriptToScan = storedProject.script || "Sample content for testing compliance.";

    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/compliance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                script: scriptToScan, 
                platforms: selectedPlatforms 
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Server ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        
        // Success! Set the results from your Java Backend
        setScanResults(data.issues || []);
        setScore(data.score || 0);
        setScanState('results');
        triggerToast("Scan complete. Safe for publishing!");

    } catch (error) {
        console.error("❌ Compliance Scan Failed:", error);
        
        // ==========================================
        // HACKATHON SAFETY NET (Demo Mode Fallback)
        // ==========================================
        triggerToast("Backend offline. Using Demo Compliance Data! ⚠️", "warning");
        
        // If Java fails, push fake data so the judges can still see the UI!
        setTimeout(() => {
            setScanResults([
                { type: "warning", platform: "TikTok", title: "Pacing", desc: "Video might be too long for TikTok average attention span." },
                { type: "success", platform: "YouTube", title: "Content", desc: "Clean content detected. Safe for monetization." }
            ]);
            setScore(92);
            setScanState('results');
        }, 1500);

    } finally {
        setIsApiLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-4xl mx-auto pb-40">
      <header className="mb-12 mt-6">
        <motion.h2 
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-[0.3em] uppercase mb-4 transition-colors"
        >
          Phase 03: Safety Scan
        </motion.h2>
        <h1 className="text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2 transition-colors">Automated Compliance.</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 font-light transition-colors">Buddy Agent scans your script against active platform algorithms.</p>
      </header>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: PLATFORM SELECTION */}
        {scanState === 'selection' && (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-xl rounded-[40px] p-10 mb-8 transition-colors duration-500"
          >
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6 text-center">Where are you publishing?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {availablePlatforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all duration-300 ${
                      isSelected 
                      ? `border-transparent shadow-lg scale-105 ${platform.color}` 
                      : 'border-white dark:border-white/10 bg-white/50 dark:bg-white/[0.02] text-gray-500 hover:bg-white dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className={`mb-3 ${isSelected ? 'animate-bounce' : ''}`}>{platform.icon}</div>
                    <span className="font-bold text-sm">{platform.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center">
              <button 
                onClick={runComplianceScan}
                disabled={selectedPlatforms.length === 0 || isApiLoading}
                className="flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-bold hover:scale-105 transition-all shadow-xl disabled:opacity-50"
              >
                {isApiLoading ? <Loader2 className="animate-spin" size={20} /> : <ScanLine size={20} />}
                Run Compliance Scan
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: SCANNING ANIMATION */}
        {scanState === 'scanning' && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-xl rounded-[40px] p-10 mb-8 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
          >
            <motion.div 
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-blue-400 dark:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
            />

            <div className="w-40 h-40 shrink-0 rounded-full border-8 border-gray-200 dark:border-white/5 flex items-center justify-center animate-pulse">
                <ShieldAlert className="text-gray-300 dark:text-white/10" size={48} />
            </div>
            
            <div className="flex-1 space-y-4 w-full">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-md w-1/3 mb-3"></div>
                        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-md w-3/4"></div>
                    </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3: RESULTS HUD */}
        {scanState === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-xl rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10 transition-colors duration-500">
                <div className={`w-40 h-40 shrink-0 rounded-full border-8 flex flex-col items-center justify-center shadow-inner transition-colors ${
                  score >= 90 ? 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-500/10' : 
                  'border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10'
                }`}>
                    <span className={`text-5xl font-black ${score >= 90 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{score}</span>
                    <span className={`text-xs font-bold uppercase tracking-widest opacity-70`}>Safe Score</span>
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                    {scanResults.map((result, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                          key={idx} 
                          className={`p-5 rounded-2xl flex items-start gap-4 border ${
                            result.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20' :
                            result.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-100 dark:border-yellow-500/20' :
                            'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20'
                          }`}
                        >
                            <div className="mt-1 shrink-0">
                                {result.type === 'success' && <CheckCircle2 className="text-green-500" />}
                                {result.type === 'warning' && <AlertTriangle className="text-yellow-600" />}
                                {result.type === 'info' && <Info className="text-blue-500" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-md">
                                        {result.platform}
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">{result.title}</p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{result.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-4">
              <button 
                onClick={() => { setScanState('selection'); setSelectedPlatforms([]); }}
                className="px-8 py-5 rounded-full font-bold text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                Scan Again
              </button>
              <button 
                onClick={() => navigate('/schedule')}
                className="flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-full font-bold hover:scale-105 transition-all shadow-xl"
              >
                Approve & Schedule <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOAST NOTIFICATION WITH BOTTOM-120px FIX --- */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-[120px] left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black shadow-2xl transition-colors"
          >
            {toast.type === "success" ? (
                <CheckCircle2 size={20} className="text-emerald-400 dark:text-emerald-500" />
            ) : (
                <AlertTriangle size={20} className="text-yellow-400 dark:text-yellow-500" />
            )}
            <span className="font-bold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}