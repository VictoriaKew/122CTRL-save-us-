import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Music, Video, Camera } from 'lucide-react';

export default function Main() {
  const navigate = useNavigate();
  const [links, setLinks] = useState(['', '', '']);
  
  // NEW: Platform Selection State
  const [selectedPlatforms, setSelectedPlatforms] = useState(['TikTok']); // Default to TikTok
  
  const [contentType, setContentType] = useState('Auto');
  const [subject, setSubject] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState("Buddy is Learning...");

  useEffect(() => {
    sessionStorage.removeItem('lastBuddyProject');
  }, []);

  const availablePlatforms = [
    { id: 'TikTok', name: 'TikTok', icon: <Music size={20} />, color: 'bg-black text-white dark:bg-white dark:text-black' },
    { id: 'YouTube Shorts', name: 'YouTube Shorts', icon: <Video size={20} />, color: 'bg-red-500 text-white' },
    { id: 'Instagram Reels', name: 'Instagram Reels', icon: <Camera size={20} />, color: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 text-white' }
  ];

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const loadingMessages = [
    "Analyzing video pacing...",
    "Extracting Sonic DNA...",
    "Cross-referencing viral hooks...",
    "Drafting director's storyboard...",
    "Finalizing UI assets..."
  ];

  // Must have at least 1 link, 1 goal, AND 1 platform selected
  const isFormValid = links.some(link => link.trim() !== '') && 
                      (contentType === 'Auto' || subject.trim() !== '') &&
                      selectedPlatforms.length > 0;

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

    const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    alert("Please log in to save your project!");
    setIsAnalyzing(false);
    return;
  }

    const finalPrompt = contentType === 'Auto' 
      ? "Analyze my style and suggest the best viral topic for my next video." 
      : `Create an engaging ${contentType} video specifically about: ${subject}`;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/strategize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            user_id: user.id, 
            prompt: finalPrompt,
            links: links 
        }) 
      });
      
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      sessionStorage.setItem('lastBuddyProject', JSON.stringify(data));
      // 🔥 WE NOW PASS THE SELECTED PLATFORMS TO THE NEXT PAGE
      navigate('/suggestions', { state: { strategyData: data, platforms: selectedPlatforms } });
      
    } catch (error) {
      console.error("❌ Backend Connection Failed:", error);
      alert("Buddy's brain is offline! Check your Java terminal.\nError: " + error.message);
      setIsAnalyzing(false); 
    }


// Step 2: Send to Java
const handleSaveProject = async (projectData) => {
  await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save-project`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: user.id, // Linking the current user
      title: projectData.hook,
      content_json: JSON.stringify(projectData), // Stores hook, script, storyboard
      url_reference_1: links[0],
      url_reference_2: links[1],
      url_reference_3: links[2],
      platform: "multiple"
    })
  });
};
  };

  
  return (
    <motion.main 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="pt-32 pb-20 px-6 max-w-4xl mx-auto relative z-10"
    >
      <header className="text-center mb-16">
        <motion.h2 
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-[0.3em] uppercase mb-4 transition-colors"
        >
          Phase 01: Style Learning
        </motion.h2>
        <h1 className="text-6xl font-bold tracking-tight mb-4 text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors">Meet your Buddy.</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 transition-colors">Paste 3 video links so Buddy can clone your signature style.</p>
      </header>

      {/* 3 LINK INPUTS */}
      <div className="space-y-4 mb-12">
        {links.map((link, i) => (
          <div key={i} className="flex items-center bg-white/40 dark:bg-white/[0.03] backdrop-blur-md rounded-2xl p-2 border border-white/50 dark:border-white/10 focus-within:bg-white dark:focus-within:bg-white/[0.05] focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-all shadow-sm">
            <div className="pl-4 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest w-20">Link 0{i+1}</div>
            <input 
              className="w-full bg-transparent py-4 px-4 outline-none font-medium text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-gray-400 dark:placeholder:text-gray-600"
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

      {/* NEW: PLATFORM SELECTION */}
      <div className="mb-12">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6 text-center">Where are you publishing?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availablePlatforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.id);
            return (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 ${
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
      </div>

      {/* NEW INTERACTIVE PROMPT AREA */}
      <div className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl border-2 border-dashed border-white/80 dark:border-white/10 rounded-[40px] p-8 md:p-10 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-all group shadow-xl">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">What is the goal for this video?</h3>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {['Auto', 'Educational', 'Promotional', 'Entertainment'].map(type => (
            <button
              key={type}
              onClick={() => setContentType(type)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                contentType === type
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white/60 dark:bg-white/[0.05] text-gray-500 dark:text-gray-300 hover:bg-white dark:hover:bg-white/[0.1] hover:text-gray-800 dark:hover:text-white border border-white/50 dark:border-white/10'
              }`}
            >
              {type === 'Auto' ? '✨ Let Buddy Decide' : type}
            </button>
          ))}
        </div>

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
                className="w-full h-24 bg-white/60 dark:bg-black/40 rounded-2xl p-5 text-xl font-light outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-[#1d1d1f] dark:text-[#f5f5f7] shadow-inner border border-white/50 dark:border-white/10 mb-2 focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
                placeholder={`What is the main subject for this ${contentType.toLowerCase()} video?`}
              />
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-gray-500 dark:text-gray-400 italic mb-4 h-12 flex items-center justify-center transition-colors"
            >
              Buddy will analyze your links and find the perfect viral gap for your audience.
            </motion.p>
          )}
        </AnimatePresence>
        
        <button 
          onClick={handleStart}
          disabled={isAnalyzing || !isFormValid}
          className="mt-6 bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-2xl disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
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