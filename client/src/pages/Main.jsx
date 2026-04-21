import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

export default function Main() {
  const navigate = useNavigate();
  const [links, setLinks] = useState(['', '', '']);
  
  // NEW STATE: Managing the structured prompt choices
  const [contentType, setContentType] = useState('Auto'); // 'Auto', 'Educational', 'Promotional', 'Entertainment'
  const [subject, setSubject] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState("Buddy is Learning...");

  // Clear memory when landing on this page so you start fresh!
  useEffect(() => {
    sessionStorage.removeItem('lastBuddyProject');
  }, []);

  const loadingMessages = [
    "Analyzing video pacing...",
    "Extracting Sonic DNA...",
    "Cross-referencing viral hooks...",
    "Drafting director's storyboard...",
    "Finalizing UI assets..."
  ];

  // FORM VALIDATION: Must have at least 1 link AND (either Auto is selected OR they typed a subject)
  const isFormValid = links.some(link => link.trim() !== '') && (contentType === 'Auto' || subject.trim() !== '');

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      let step = 0;
      interval = setInterval(() => {
        step = (step + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[step]);
      }, 2000); 
    } else {
      setLoadingText("Buddy is Learning...");
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleStart = async () => {
    setIsAnalyzing(true);

    // This creates the perfect prompt string to send to your Java backend!
    const finalPrompt = contentType === 'Auto' 
      ? "Analyze my style and suggest the best viral topic for my next video." 
      : `Create an engaging ${contentType} video specifically about: ${subject}`;

    // ==========================================
    // HACKATHON DEMO MODE (Currently Active)
    // ==========================================
    setTimeout(() => {
        setIsAnalyzing(false);

        const dummyData = {
          hook: "The Ultimate Workflow Hack for 2026",
          sonicDna: "Trending: Lofi Study Beats / Acoustic Pop",
          script: `Stop scrolling! If you want to survive this semester, save this video. 🚀 #Workflow #ProductivityHacks #Tech`,
          storyboard: [
            { id: 1, scene: "Office / Desk", character: "Subject sitting", shooting: "Wide angle, static", editing: "Fade in", dialogue: "(Background music starts)", duration: "3s" },
            { id: 2, scene: "Close up on face", character: "Subject looking at camera", shooting: "Push in close-up", editing: "Hard cut", dialogue: "\"Stop scrolling, I have a secret.\"", duration: "2s" },
            { id: 3, scene: "Screen capture", character: "Mouse moving on screen", shooting: "Screen recording", editing: "Zoom into screen", dialogue: "\"Here is exactly how this works...\"", duration: "5s" },
            { id: 4, scene: "Office / Desk", character: "Subject smiling", shooting: "Medium shot", editing: "Whip pan out", dialogue: "\"Save this for later!\"", duration: "3s" }
          ]
        };
        
        sessionStorage.setItem('lastBuddyProject', JSON.stringify(dummyData));
        navigate('/suggestions', { state: { strategyData: dummyData } }); 
    }, 8000); 
    
    // ==========================================
    // REAL LIVE API MODE (Uncomment when ready!)
    // ==========================================
    /*
    try {
      const response = await fetch('http://localhost:8080/api/strategize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt }) // Sends the smartly constructed prompt!
      });
      
      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      sessionStorage.setItem('lastBuddyProject', JSON.stringify(data));
      navigate('/suggestions', { state: { strategyData: data } });
      
    } catch (error) {
      console.error("API Failed, falling back to Demo Data:", error);
      setIsAnalyzing(false); 
      
      const fallbackData = {
          hook: "The Ultimate Workflow Hack for 2026",
          sonicDna: "Trending: Lofi Study Beats / Acoustic Pop",
          script: "Stop scrolling! If you want to survive this semester, save this video. 🚀 #Workflow #ProductivityHacks #Tech",
          storyboard: [
            { id: 1, scene: "Office / Desk", character: "Subject sitting", shooting: "Wide angle, static", editing: "Fade in", dialogue: "(Background music starts)", duration: "3s" },
            { id: 2, scene: "Close up on face", character: "Subject looking at camera", shooting: "Push in close-up", editing: "Hard cut", dialogue: "\"Stop scrolling, I have a secret.\"", duration: "2s" },
            { id: 3, scene: "Screen capture", character: "Mouse moving on screen", shooting: "Screen recording", editing: "Zoom into screen", dialogue: "\"Here is exactly how this works...\"", duration: "5s" },
            { id: 4, scene: "Office / Desk", character: "Subject smiling", shooting: "Medium shot", editing: "Whip pan out", dialogue: "\"Save this for later!\"", duration: "3s" }
          ]
      };
      
      sessionStorage.setItem('lastBuddyProject', JSON.stringify(fallbackData));
      navigate('/suggestions', { state: { strategyData: fallbackData } });
    }
    */
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

      {/* NEW INTERACTIVE PROMPT AREA */}
      <div className="bg-white/60 backdrop-blur-2xl border-2 border-dashed border-white/80 rounded-[40px] p-8 md:p-10 text-center hover:border-blue-400 transition-all group shadow-xl">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">What is the goal for this video?</h3>

        {/* The Category Selection Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {['Auto', 'Educational', 'Promotional', 'Entertainment'].map(type => (
            <button
              key={type}
              onClick={() => setContentType(type)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                contentType === type
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white/60 text-gray-500 hover:bg-white hover:text-gray-800 border border-white/50'
              }`}
            >
              {type === 'Auto' ? '✨ Let Buddy Decide' : type}
            </button>
          ))}
        </div>

        {/* The Subject Input (Smoothly animates in/out based on selection) */}
        <AnimatePresence>
          {contentType !== 'Auto' ? (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="overflow-hidden"
            >
              <textarea 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-24 bg-white/60 rounded-2xl p-5 text-xl font-light outline-none resize-none placeholder:text-gray-400 text-[#1d1d1f] shadow-inner border border-white/50 mb-2 focus:border-blue-400 transition-colors"
                placeholder={`What is the main subject for this ${contentType.toLowerCase()} video?`}
              />
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-500 italic mb-4 h-12 flex items-center justify-center"
            >
              Buddy will analyze your links and find the perfect viral gap for your audience.
            </motion.p>
          )}
        </AnimatePresence>
        
        <button 
          onClick={handleStart}
          disabled={isAnalyzing || !isFormValid}
          className="mt-6 bg-black text-white px-12 py-5 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-2xl disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {loadingText}
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