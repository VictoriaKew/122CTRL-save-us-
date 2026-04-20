import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

export default function Main() {
  const navigate = useNavigate();
  const [links, setLinks] = useState(['', '', '']);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStart = async () => {
    setIsAnalyzing(true);

    // --- UI/UX TESTING BYPASS ---
    // We use a small timeout to simulate the "loading" animation for 1 second,
    // then immediately force navigation to Page 5.
    setTimeout(() => {
        setIsAnalyzing(false);
        navigate('/suggestions'); 
    }, 1000);
    
    /* --- REAL API CALL (COMMENTED OUT FOR UI TESTING) ---
    try {
      const response = await fetch('http://localhost:8080/api/strategize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputText }) 
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Buddy encountered an issue. Try again!");
        setIsAnalyzing(false);
        return; 
      }

      const data = await response.json();
      console.log("AI Data Received:", data);
      navigate('/suggestions', { state: { strategyData: data } });
      
    } catch (error) {
      console.error("Network Error:", error);
      alert("Failed to connect to the backend Buddy engine!");
      setIsAnalyzing(false);
    }
    ----------------------------------------------------- */
  };
  
  return (
    <motion.main 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="pt-32 pb-20 px-6 max-w-4xl mx-auto relative z-10"
    >
      <header className="text-center mb-16">
        <motion.h2 
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-blue-600 font-bold text-sm tracking-[0.3em] uppercase mb-4"
        >
          Phase 01: Style Learning
        </motion.h2>
        <h1 className="text-6xl font-bold tracking-tight mb-4 text-[#1d1d1f]">Meet your Buddy.</h1>
        <p className="text-xl text-gray-500">Paste 3 video links so Buddy can clone your signature style.</p>
      </header>

      {/* 3 LINK INPUTS */}
      <div className="space-y-4 mb-12">
        {links.map((link, i) => (
          <div key={i} className="flex items-center bg-white/40 backdrop-blur-md rounded-2xl p-2 border border-white/50 focus-within:bg-white focus-within:border-blue-500 transition-all shadow-sm">
            <div className="pl-4 text-gray-400 text-[10px] font-black uppercase tracking-widest w-20">Link 0{i+1}</div>
            <input 
              className="w-full bg-transparent py-4 px-4 outline-none font-medium text-[#1d1d1f]"
              placeholder="Paste TikTok, Reel, or Shorts URL..."
              value={link}
              onChange={(e) => {
                const newLinks = [...links];
                newLinks[i] = e.target.value;
                setLinks(newLinks);
              }}
            />
          </div>
        ))}
      </div>

      {/* PROMPT AREA */}
      <div className="bg-white/60 backdrop-blur-2xl border-2 border-dashed border-white/80 rounded-[40px] p-10 text-center hover:border-blue-400 transition-all group shadow-xl">
        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-32 bg-transparent text-2xl font-light outline-none text-center resize-none placeholder:text-gray-300 text-[#1d1d1f]"
          placeholder="What are we promoting next? (Or let Buddy think for you)"
        />
        
        <button 
          onClick={handleStart}
          disabled={isAnalyzing}
          className="mt-8 bg-black text-white px-12 py-5 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-2xl disabled:bg-gray-400 disabled:scale-100"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Buddy is Learning...
            </>
          ) : (
            <>
              <Sparkles size={20} /> Let Buddy Think
            </>
          )}
        </button>
      </div>
    </motion.main>
  );
}