import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Hash, FileText, Download, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';

export default function Suggestions() {
  const location = useLocation();
  const navigate = useNavigate(); // 🔥 Added for the success page routing
  
  // 1. Strictly look for new data first, then check memory.
  const savedMemory = JSON.parse(sessionStorage.getItem('lastBuddyProject'));
  const passedData = location.state?.strategyData || savedMemory;

  // 2. Initialize state with REAL data, or empty defaults (NO hardcoded placeholders!)
  const [projectData, setProjectData] = useState(passedData || {
    hook: "No project loaded. Go back and generate one! ⚠️",
    sonicDna: "-",
    script: "",
    storyboard: []
  });

  // 🔥 THE MEMORY FIX: Auto-save to session storage whenever data changes!
  useEffect(() => {
    if (projectData && projectData.hook !== "No project loaded. Go back and generate one! ⚠️") {
      sessionStorage.setItem('lastBuddyProject', JSON.stringify(projectData));
    }
  }, [projectData]);

  const [isRefining, setIsRefining] = useState(false);
  const [customThought, setCustomThought] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handleRefine = async (instruction) => {
    if (isRefining) return; 
    setIsRefining(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            currentData: projectData, 
            instruction: instruction 
        })
      });

      if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Server ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      
      setProjectData(data);
      sessionStorage.setItem('lastBuddyProject', JSON.stringify(data));
      triggerToast("Buddy has updated the script! ✨");

    } catch (error) {
      console.error("❌ Refinement Error:", error);
      triggerToast("Connection failed. Using local backup. ⚠️");
      
      setProjectData({
        ...projectData,
        script: `(Local Edit: ${instruction})\n\n` + projectData.script
      });
    } finally {
      setIsRefining(false);
    }
  };

  const downloadActorScript = () => {
    let scriptContent = `TITLE: ${projectData.hook}\n\n--- MAIN SCRIPT / CAPTION ---\n${projectData.script}\n\n--- STORYBOARD DIALOGUE ---\n\n`;
    projectData.storyboard.forEach((row, index) => {
      scriptContent += `SCENE ${row.scene || index + 1}: ${row.visual}\nACTION: ${row.characterAction}\nDIALOGUE: ${row.dialogue}\n\n`;
    });
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Buddy_Actor_Script.txt";
    link.click();
    triggerToast("Actor Script Downloaded! 🎬"); 
  };

  const downloadDirectorStoryboard = () => {
    const headers = ["Scene No.", "Location", "Character/Action", "Way of Shooting", "Way of Editing", "Dialogue"];
    const csvContent = [
      headers.join(","), 
      ...projectData.storyboard.map((row, index) => 
        [row.scene || index + 1, `"${row.visual}"`, `"${row.characterAction}"`, `"${row.wayOfShooting}"`, `"${row.wayOfEditing}"`, `"${row.dialogue}"`].join(",")
      )
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Buddy_Director_Storyboard.csv";
    link.click();
    triggerToast("Director Storyboard Downloaded! 🎥");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
      className="p-6 md:p-8 mx-auto w-full max-w-[100vw] md:max-w-[calc(100vw-17rem)] flex flex-col pb-48 overflow-hidden relative"
    >
      <header className="mb-12 mt-6">
        <motion.h2 
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-[0.3em] uppercase mb-4 transition-colors"
        >
          Phase 02: Creative Lab
        </motion.h2>
        <h1 className="text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2 transition-colors">Buddy's Creative Lab.</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 font-light transition-colors">Based on your 3 videos, here is the next move.</p>
      </header>

      <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-6 ml-2 transition-colors">Content Suggestion</h2>
      
      <div className="flex overflow-x-auto gap-6 pb-6 w-full hide-scrollbar">
        <div className="min-w-[320px] md:min-w-[400px] flex-1 bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl border border-white dark:border-white/10 shadow-lg rounded-[32px] p-8 shrink-0 transition-all duration-500">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6"><FileText size={24} /></div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">The Hook / Title</h3>
          <p className={`text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] leading-snug whitespace-normal break-words transition-opacity duration-300 ${isRefining ? 'opacity-30' : 'opacity-100'}`}>
            {projectData.hook}
          </p>
        </div>

        <div className="min-w-[320px] md:min-w-[400px] flex-1 bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl border border-white dark:border-white/10 shadow-lg rounded-[32px] p-8 shrink-0 transition-all duration-500">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6"><Music size={24} /></div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Trending Audio</h3>
          <p className={`text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] leading-snug whitespace-normal break-words transition-opacity duration-300 ${isRefining ? 'opacity-30' : 'opacity-100'}`}>
            {projectData.sonicDna}
          </p>
        </div>

        <div className="min-w-[320px] md:min-w-[450px] bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl border border-white dark:border-white/10 shadow-lg rounded-[32px] p-6 snap-start shrink-0 flex flex-col relative overflow-hidden transition-all duration-500">
          {isRefining && (
              <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-[32px]">
                  <Loader2 className="animate-spin text-emerald-500 dark:text-emerald-400 mb-2" size={32} />
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">Buddy is rewriting the project...</p>
              </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Hash size={24} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Caption & Script</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Co-Pilot Workspace</p>
            </div>
          </div>
          
          <textarea 
            value={projectData.script}
            onChange={(e) => setProjectData({...projectData, script: e.target.value})}
            disabled={isRefining}
            className={`w-full flex-grow min-h-[120px] bg-white/50 dark:bg-black/40 border border-white dark:border-white/10 rounded-2xl p-4 text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:border-emerald-400 dark:focus:border-emerald-500 transition-all resize-none shadow-inner`}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button 
              onClick={() => handleRefine("Make the video punchier, shorter, and more aggressive.")}
              className="text-[10px] font-black uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded-lg hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors shadow-sm"
            >
              Punch It Up 🥊
            </button>
            <button 
              onClick={() => handleRefine("Make the video much funnier and add a joke.")}
              className="text-[10px] font-black uppercase tracking-wider bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              Make it Funnier 😂
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/60 dark:border-white/10 flex items-center gap-2">
            <input 
              type="text"
              value={customThought}
              onChange={(e) => setCustomThought(e.target.value)}
              placeholder="Tell Buddy how to rewrite..."
              className="flex-grow bg-white/50 dark:bg-black/40 border border-white/80 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-400 dark:focus:border-emerald-500 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customThought.trim()) {
                  handleRefine(customThought);
                  setCustomThought("");
                }
              }}
            />
            <button
              onClick={() => { handleRefine(customThought); setCustomThought(""); }}
              disabled={!customThought.trim()}
              className="bg-emerald-500 dark:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 shrink-0"
            >
              Ask ✨
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-6 ml-2 mt-8 transition-colors">Visualisation Storyboard</h2>
      
      <div className={`bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-xl rounded-[40px] w-full flex flex-col overflow-hidden transition-all duration-500 ${isRefining ? 'opacity-40 blur-[2px]' : 'opacity-100 blur-none'}`}>
        
        <div className="w-full overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-white/50 dark:bg-black/40 border-b border-gray-200 dark:border-white/10">
                    <tr>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">Scene</th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap"><div className="flex items-center gap-2"><ImageIcon size={14}/> Visual</div></th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">Character/Action</th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">Way of Shooting</th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">Way of Editing</th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Dialogue</th>
                    </tr>
                </thead>
                <motion.tbody 
                  key={projectData.script} 
                  variants={containerVariants} 
                  initial="hidden" 
                  animate="visible"
                  className="text-sm text-[#1d1d1f] dark:text-gray-300"
                >
                    {projectData.storyboard?.map((row, index) => (
                        <motion.tr 
                          variants={rowVariants}
                          key={index} 
                          className="border-b border-gray-100 dark:border-white/10 last:border-0 hover:bg-white/60 dark:hover:bg-white/5 transition-colors"
                        >
                            <td className="p-6 font-bold text-gray-900 dark:text-white min-w-[200px] whitespace-normal break-words">
                              <div className="flex items-start gap-3">
                                <span className="bg-blue-100/50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs shrink-0 mt-0.5">{row.scene || index + 1}</span>
                                <span>{row.visual}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <img 
                                src={`https://image.pollinations.ai/prompt/${encodeURIComponent((row.visual || "scene") + " " + (row.characterAction || "character") + " simple rough pencil storyboard sketch")}?width=160&height=120&nologo=true`} 
                                alt={`Sketch for scene ${row.scene || index + 1}`}
                                className="w-24 h-16 object-cover rounded-xl shadow-sm border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/50"
                                loading="lazy"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/160x120/e2e8f0/64748b?text=Generating+Sketch..."; }}
                              />
                            </td>
                            <td className="p-6 font-medium text-gray-600 dark:text-gray-300 min-w-[200px] whitespace-normal break-words">{row.characterAction}</td>
                            <td className="p-6 font-medium text-blue-600 dark:text-blue-400 min-w-[200px] whitespace-normal break-words">{row.wayOfShooting}</td>
                            <td className="p-6 font-medium text-purple-600 dark:text-purple-400 min-w-[200px] whitespace-normal break-words">{row.wayOfEditing}</td>
                            <td className="p-6 italic text-gray-500 dark:text-gray-400 leading-relaxed min-w-[300px] whitespace-normal break-words">"{row.dialogue}"</td>
                        </motion.tr>
                    ))}
                </motion.tbody>
            </table>
        </div>

        <div className="w-full bg-white/50 dark:bg-black/40 border-t border-gray-200 dark:border-white/10 py-6 pl-6 pr-16 flex flex-wrap items-center justify-end gap-4 shrink-0 transition-colors">
          <button 
            onClick={downloadActorScript}
            disabled={isRefining}
            className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-sm bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 hover:scale-105 transition-all shadow-sm disabled:opacity-50"
          >
            <FileText size={16} /> Script Only (Actor Ver.)
          </button>
          
          <button 
            onClick={downloadDirectorStoryboard}
            disabled={isRefining}
            className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-sm bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-all shadow-xl disabled:opacity-50"
          >
            <Download size={16} /> Full Storyboard (Director Ver.)
          </button>
        </div>
      </div>

      {/* 🔥 The Final Success Button! */}
      <div className="mt-12 flex justify-center w-full pb-12">
        <button 
          onClick={() => {
            navigate('/success'); 
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg hover:scale-105 flex items-center gap-2"
        >
          <CheckCircle2 size={20} /> Publish & Finish Project 🎉
        </button>
      </div>

<AnimatePresence>
  {toast.show && (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-[1px] md:bottom-120 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black shadow-2xl transition-colors"
    >
      <CheckCircle2 size={20} className="text-emerald-400 dark:text-emerald-500" />
      <span className="font-bold text-sm">{toast.message}</span>
    </motion.div>
  )}
</AnimatePresence>

    </motion.div>
  );
}