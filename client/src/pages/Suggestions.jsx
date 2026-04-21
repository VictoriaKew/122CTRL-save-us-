import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Hash, FileText, Download, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Suggestions() {
  const location = useLocation();
  const passedData = location.state?.strategyData || JSON.parse(sessionStorage.getItem('lastBuddyProject')) || {};
  
  // --- NEW: GLOBAL PROJECT STATE ---
  // We now store the ENTIRE object in state, so the whole page can update dynamically!
  const [projectData, setProjectData] = useState({
    hook: passedData.hook || "The Ultimate Workflow Hack for 2026",
    sonicDna: passedData.sonicDna || "Trending: Lofi Study Beats / Acoustic Pop",
    script: passedData.script || "Stop scrolling! If you want to survive this semester, save this video. 🚀 #Workflow #ProductivityHacks #Tech",
    storyboard: passedData.storyboard || [
      { id: 1, scene: "Office / Desk", character: "Subject sitting", shooting: "Wide angle, static", editing: "Fade in", dialogue: "(Background music starts)", duration: "3s" },
      { id: 2, scene: "Close up on face", character: "Subject looking at camera", shooting: "Push in close-up", editing: "Hard cut", dialogue: "\"Stop scrolling, I have a secret.\"", duration: "2s" },
      { id: 3, scene: "Screen capture", character: "Mouse moving on screen", shooting: "Screen recording", editing: "Zoom into screen", dialogue: "\"Here is exactly how this works...\"", duration: "5s" },
      { id: 4, scene: "Office / Desk", character: "Subject smiling", shooting: "Medium shot", editing: "Whip pan out", dialogue: "\"Save this for later!\"", duration: "3s" }
    ]
  });

  const [isRefining, setIsRefining] = useState(false);
  const [customThought, setCustomThought] = useState("");

  // --- THE GLOBAL REFINE FUNCTION ---
  const handleRefine = async (instruction) => {
    setIsRefining(true);
    
    // --- DEMO BYPASS (Remove this timeout block when API is ready) ---
    setTimeout(() => {
        setProjectData({
            ...projectData,
            script: `(AI Refined: ${instruction})\n\n` + projectData.script + " 🔥",
            storyboard: projectData.storyboard.map(row => ({
                ...row,
                dialogue: row.dialogue + " (Updated!)"
            }))
        });
        setIsRefining(false);
    }, 3000);
    return;
    // -----------------------------------------------------------------

    /* --- REAL LIVE API CALL (Uncomment when Java is running) ---
    try {
      const response = await fetch('http://localhost:8080/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We send the ENTIRE current project state to Java as a string
        body: JSON.stringify({ 
            currentData: JSON.stringify(projectData), 
            instruction: instruction 
        })
      });
      
      const data = await response.json();
      
      // If the AI returns a valid object, update the whole page!
      if (data && data.storyboard) {
        setProjectData(data);
        sessionStorage.setItem('lastBuddyProject', JSON.stringify(data)); // Save backup
      }
    } catch (error) {
      console.error("Failed to refine:", error);
    } finally {
      setIsRefining(false);
    }
    */
  };

  const downloadActorScript = () => {
    let scriptContent = `TITLE: ${projectData.hook}\n\n--- MAIN SCRIPT / CAPTION ---\n${projectData.script}\n\n--- STORYBOARD DIALOGUE ---\n\n`;
    projectData.storyboard.forEach(row => {
      scriptContent += `SCENE ${row.id}: ${row.scene}\nACTION: ${row.character}\nDIALOGUE: ${row.dialogue}\n\n`;
    });
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Buddy_Actor_Script.txt";
    link.click();
  };

  const downloadDirectorStoryboard = () => {
    const headers = ["Scene No.", "Location", "Character/Action", "Way of Shooting", "Way of Editing", "Dialogue", "Time"];
    const csvContent = [
      headers.join(","), 
      ...projectData.storyboard.map(row => 
        [row.id, `"${row.scene}"`, `"${row.character}"`, `"${row.shooting}"`, `"${row.editing}"`, `"${row.dialogue}"`, row.duration].join(",")
      )
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Buddy_Director_Storyboard.csv";
    link.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-6 md:p-8 mx-auto w-full max-w-[100vw] md:max-w-[calc(100vw-17rem)] flex flex-col pb-48 overflow-hidden"
    >
      <header className="mb-12 mt-6">
        <h1 className="text-5xl font-bold tracking-tight text-[#1d1d1f] mb-2">Buddy's Creative Lab.</h1>
        <p className="text-xl text-gray-500 font-light">Based on your 3 videos, here is the next move.</p>
      </header>

      <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-6 ml-2">Content Suggestion</h2>
      
      {/* Side Scrolling Cards */}
      <div className="flex overflow-x-auto gap-6 pb-6 w-full">
        <div className="min-w-[320px] md:min-w-[400px] bg-white/60 backdrop-blur-2xl border border-white shadow-lg rounded-[32px] p-8 shrink-0 transition-all duration-500">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6"><FileText size={24} /></div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">The Hook / Title</h3>
          {/* Reads dynamically from State! */}
          <p className={`text-2xl font-bold text-[#1d1d1f] leading-snug transition-opacity duration-300 ${isRefining ? 'opacity-30' : 'opacity-100'}`}>{projectData.hook}</p>
        </div>

        <div className="min-w-[320px] md:min-w-[400px] bg-white/60 backdrop-blur-2xl border border-white shadow-lg rounded-[32px] p-8 shrink-0 transition-all duration-500">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6"><Music size={24} /></div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Trending Audio</h3>
          <p className={`text-2xl font-bold text-[#1d1d1f] leading-snug transition-opacity duration-300 ${isRefining ? 'opacity-30' : 'opacity-100'}`}>{projectData.sonicDna}</p>
        </div>

        {/* INTERACTIVE WORKSPACE CARD */}
        <div className="min-w-[320px] md:min-w-[450px] bg-white/60 backdrop-blur-2xl border border-white shadow-lg rounded-[32px] p-6 snap-start shrink-0 flex flex-col relative overflow-hidden">
          
          {/* Loading Overlay */}
          {isRefining && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-[32px]">
                  <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
                  <p className="text-sm font-bold text-emerald-600 animate-pulse">Buddy is rewriting the project...</p>
              </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <Hash size={24} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Caption & Script</h3>
              <p className="text-xs text-emerald-600 font-bold">Co-Pilot Workspace</p>
            </div>
          </div>
          
          <textarea 
            value={projectData.script}
            onChange={(e) => setProjectData({...projectData, script: e.target.value})}
            disabled={isRefining}
            className={`w-full flex-grow min-h-[120px] bg-white/50 border border-white rounded-2xl p-4 text-sm font-medium text-gray-700 outline-none focus:border-emerald-400 transition-all resize-none shadow-inner`}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button 
              onClick={() => handleRefine("Make the video punchier, shorter, and more aggressive. Change the storyboard to match.")}
              className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-3 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Punch It Up 🥊
            </button>
            <button 
              onClick={() => handleRefine("Make the video much funnier and add a joke to the dialogue.")}
              className="text-[10px] font-black uppercase tracking-wider bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Make it Funnier 😂
            </button>
            <button 
              onClick={() => handleRefine("Make the video highly cinematic. Update the storyboard shooting styles to reflect high-budget directing.")}
              className="text-[10px] font-black uppercase tracking-wider bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Make it Cinematic 🎬
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/60 flex items-center gap-2">
            <input 
              type="text"
              value={customThought}
              onChange={(e) => setCustomThought(e.target.value)}
              placeholder="Tell Buddy how to rewrite the video..."
              className="flex-grow bg-white/50 border border-white/80 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-400 text-gray-700 placeholder:text-gray-400 transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customThought.trim()) {
                  handleRefine(customThought);
                  setCustomThought("");
                }
              }}
            />
            <button
              onClick={() => {
                handleRefine(customThought);
                setCustomThought("");
              }}
              disabled={!customThought.trim()}
              className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shrink-0"
            >
              Ask ✨
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-6 ml-2 mt-8">Visualisation Storyboard</h2>
      
      {/* The Storyboard Card */}
      <div className={`bg-white/80 backdrop-blur-2xl border border-white/80 shadow-xl rounded-[40px] w-full flex flex-col overflow-hidden transition-all duration-500 ${isRefining ? 'opacity-40 blur-[2px]' : 'opacity-100 blur-none'}`}>
        
        <div className="w-full overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-white/50 border-b border-gray-200">
                    <tr>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Scene</th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 whitespace-nowrap"><div className="flex items-center gap-2"><ImageIcon size={14}/> Visual</div></th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Character/Action</th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Way of Shooting</th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Way of Editing</th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Dialogue</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-[#1d1d1f]">
                    {projectData.storyboard.map((row) => (
                        <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-white/60 transition-colors">
                            <td className="p-6 font-bold whitespace-nowrap">
                              <span className="bg-blue-100/50 text-blue-600 px-3 py-1 rounded-full text-xs mr-3">{row.id}</span>
                              {row.scene}
                            </td>
                            <td className="p-6">
                              <img 
                                src={`https://image.pollinations.ai/prompt/${encodeURIComponent(row.scene + " " + row.character + " simple rough pencil storyboard sketch")}?width=160&height=120&nologo=true`} 
                                alt={`Sketch for scene ${row.id}`}
                                className="w-24 h-16 object-cover rounded-xl shadow-sm border border-gray-200 bg-gray-50"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.onerror = null; 
                                  e.target.src = "[https://placehold.co/160x120/e2e8f0/64748b?text=Generating+Sketch](https://placehold.co/160x120/e2e8f0/64748b?text=Generating+Sketch)...";
                                }}
                              />
                            </td>
                            <td className="p-6 font-medium text-gray-600 min-w-[150px]">{row.character}</td>
                            <td className="p-6 font-medium text-blue-600 min-w-[150px]">{row.shooting}</td>
                            <td className="p-6 font-medium text-purple-600 min-w-[150px]">{row.editing}</td>
                            <td className="p-6 italic text-gray-500 leading-relaxed min-w-[300px]">"{row.dialogue}"</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="w-full bg-white/50 border-t border-gray-200 py-6 pl-6 pr-16 flex flex-wrap items-center justify-end gap-4 shrink-0">
          <button 
            onClick={downloadActorScript}
            disabled={isRefining}
            className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all shadow-sm disabled:opacity-50"
          >
            <FileText size={16} /> Script Only (Actor Ver.)
          </button>
          
          <button 
            onClick={downloadDirectorStoryboard}
            disabled={isRefining}
            className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-sm bg-black text-white hover:scale-105 transition-all shadow-xl disabled:opacity-50"
          >
            <Download size={16} /> Full Storyboard (Director Ver.)
          </button>
        </div>
      </div>

    </motion.div>
  );
}