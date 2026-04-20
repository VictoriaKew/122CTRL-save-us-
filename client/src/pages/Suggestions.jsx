import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Hash, FileText, Clapperboard, Download } from 'lucide-react';

export default function Suggestions() {
  const location = useLocation();
  
  // 1. SAFE DATA MERGING (Fallback data if API is empty)
  const passedData = location.state?.strategyData || {};
  
  const aiData = {
    title: passedData.hook || "The Ultimate Workflow Hack for 2026",
    song: passedData.sonicDna || "Trending: Lofi Study Beats / Acoustic Pop",
    caption: passedData.script || "Stop scrolling! If you want to survive this semester, save this video. 🚀 #Workflow #ProductivityHacks #Tech",
    storyboard: passedData.storyboard || [
      { id: 1, scene: "Office / Desk", character: "Subject sitting", shooting: "Wide angle, static", editing: "Fade in", dialogue: "(Background music starts)", duration: "3s" },
      { id: 2, scene: "Close up on face", character: "Subject looking at camera", shooting: "Push in close-up", editing: "Hard cut", dialogue: "\"Stop scrolling, I have a secret.\"", duration: "2s" },
      { id: 3, scene: "Screen capture", character: "Mouse moving on screen", shooting: "Screen recording", editing: "Zoom into screen", dialogue: "\"Here is exactly how this works...\"", duration: "5s" },
      { id: 4, scene: "Office / Desk", character: "Subject smiling", shooting: "Medium shot", editing: "Whip pan out", dialogue: "\"Save this for later!\"", duration: "3s" }
    ]
  };

  // 2. DOWNLOAD FUNCTION: ACTOR VERSION (Script & Dialogue Only)
  const downloadActorScript = () => {
    let scriptContent = `TITLE: ${aiData.title}\n\n--- ACTOR SCRIPT ---\n\n`;
    aiData.storyboard.forEach(row => {
      scriptContent += `SCENE ${row.id}: ${row.scene}\nACTION: ${row.character}\nDIALOGUE: ${row.dialogue}\n\n`;
    });
    
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Buddy_Actor_Script.txt";
    link.click();
  };

  // 3. DOWNLOAD FUNCTION: DIRECTOR VERSION (Full Storyboard CSV)
  const downloadDirectorStoryboard = () => {
    const headers = ["Scene No.", "Location", "Character/Action", "Way of Shooting", "Way of Editing", "Dialogue", "Time"];
    const csvContent = [
      headers.join(","), 
      ...aiData.storyboard.map(row => 
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
      className="p-8 max-w-7xl mx-auto"
    >
      <header className="mb-12 mt-6">
        <h1 className="text-5xl font-bold tracking-tight text-[#1d1d1f] mb-2">Buddy's Creative Lab.</h1>
        <p className="text-xl text-gray-500 font-light">Based on your 3 videos, here is the next move.</p>
      </header>

      {/* SECTION 1: SIDE-SCROLLING CARDS (Content Suggestion) */}
      <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-6 ml-2">Content Suggestion</h2>
      
      {/* This is the horizontal scrolling container. 
        Hold shift to scroll horizontally on desktop, or swipe on trackpad/mobile!
      */}
      <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
        
        {/* Card 1: Title */}
        <div className="min-w-[320px] md:min-w-[400px] bg-white/60 backdrop-blur-2xl border border-white shadow-lg rounded-[32px] p-8 snap-start shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
            <FileText size={24} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">The Hook / Title</h3>
          <p className="text-2xl font-bold text-[#1d1d1f] leading-snug">{aiData.title}</p>
        </div>

        {/* Card 2: Song */}
        <div className="min-w-[320px] md:min-w-[400px] bg-white/60 backdrop-blur-2xl border border-white shadow-lg rounded-[32px] p-8 snap-start shrink-0">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6">
            <Music size={24} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Trending Audio</h3>
          <p className="text-2xl font-bold text-[#1d1d1f] leading-snug">{aiData.song}</p>
        </div>

        {/* Card 3: Caption & Hashtags */}
        <div className="min-w-[320px] md:min-w-[400px] bg-white/60 backdrop-blur-2xl border border-white shadow-lg rounded-[32px] p-8 snap-start shrink-0">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
            <Hash size={24} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Caption & Hashtags</h3>
          <p className="text-lg font-medium text-gray-600 leading-relaxed">{aiData.caption}</p>
        </div>

      </div>

      {/* SECTION 2: VISUALISATION STORYBOARD TABLE */}
      <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-6 ml-2 mt-8">Visualisation Storyboard</h2>
      
      <div className="bg-white/60 backdrop-blur-2xl border border-white shadow-xl rounded-[40px] p-8 overflow-hidden mb-8">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Scene</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Character/Action</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Way of Shooting</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Way of Editing</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400 w-1/4">Dialogue</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-[#1d1d1f]">
                    {aiData.storyboard.map((row) => (
                        <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-white/40 transition-colors">
                            <td className="p-4 font-bold">
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs mr-2">{row.id}</span>
                              {row.scene}
                            </td>
                            <td className="p-4 font-medium text-gray-600">{row.character}</td>
                            <td className="p-4 font-medium text-blue-600">{row.shooting}</td>
                            <td className="p-4 font-medium text-purple-600">{row.editing}</td>
                            <td className="p-4 italic text-gray-500 leading-relaxed">"{row.dialogue}"</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* SECTION 3: THE DUAL DOWNLOAD BUTTONS */}
      <div className="flex flex-wrap items-center justify-end gap-4 mb-20">
        <button 
          onClick={downloadActorScript}
          className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all shadow-sm"
        >
          <FileText size={16} /> 
          Script Only (Actor Ver.)
        </button>
        
        <button 
          onClick={downloadDirectorStoryboard}
          className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-sm bg-black text-white hover:scale-105 transition-all shadow-xl"
        >
          <Download size={16} /> 
          Full Storyboard (Director Ver.)
        </button>
      </div>

    </motion.div>
  );
}