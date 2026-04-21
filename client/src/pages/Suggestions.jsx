import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Hash, FileText, Download, Image as ImageIcon } from 'lucide-react';

export default function Suggestions() {
  const location = useLocation();
  const passedData = location.state?.strategyData || JSON.parse(sessionStorage.getItem('lastBuddyProject')) || {};
  
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
      // THE ULTIMATE FIX: This mathematical lock subtracts your sidebar width from the screen width, stopping the blowout dead in its tracks.
      className="p-6 md:p-8 mx-auto w-full max-w-[100vw] md:max-w-[calc(100vw-17rem)] flex flex-col pb-48 overflow-hidden"
    >
      <header className="mb-12 mt-6">
        <h1 className="text-5xl font-bold tracking-tight text-[#1d1d1f] mb-2">Buddy's Creative Lab.</h1>
        <p className="text-xl text-gray-500 font-light">Based on your 3 videos, here is the next move.</p>
      </header>

      <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-6 ml-2">Content Suggestion</h2>
      
      {/* Side Scrolling Cards */}
      <div className="flex overflow-x-auto gap-6 pb-6 w-full">
        <div className="min-w-[320px] md:min-w-[400px] bg-white/60 backdrop-blur-2xl border border-white shadow-lg rounded-[32px] p-8 shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6"><FileText size={24} /></div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">The Hook / Title</h3>
          <p className="text-2xl font-bold text-[#1d1d1f] leading-snug">{aiData.title}</p>
        </div>

        <div className="min-w-[320px] md:min-w-[400px] bg-white/60 backdrop-blur-2xl border border-white shadow-lg rounded-[32px] p-8 shrink-0">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6"><Music size={24} /></div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Trending Audio</h3>
          <p className="text-2xl font-bold text-[#1d1d1f] leading-snug">{aiData.song}</p>
        </div>

        <div className="min-w-[320px] md:min-w-[400px] bg-white/60 backdrop-blur-2xl border border-white shadow-lg rounded-[32px] p-8 shrink-0">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6"><Hash size={24} /></div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Caption & Hashtags</h3>
          <p className="text-lg font-medium text-gray-600 leading-relaxed">{aiData.caption}</p>
        </div>
      </div>

      <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-6 ml-2 mt-8">Visualisation Storyboard</h2>
      
      {/* The Storyboard Card */}
      <div className="bg-white/80 backdrop-blur-2xl border border-white/80 shadow-xl rounded-[40px] w-full flex flex-col overflow-hidden">
        
        {/* THE TABLE SCROLL ZONE */}
        <div className="w-full overflow-x-auto">
            {/* The table forces the scrollbar by demanding 1000px inside the locked wrapper */}
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
                    {aiData.storyboard.map((row) => (
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
  // THE FIX: If the image breaks, replace it with a clean grey placeholder
  onError={(e) => {
    e.target.onerror = null; 
    e.target.src = "https://placehold.co/160x120/e2e8f0/64748b?text=Generating+Sketch...";
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

        {/* THE BUTTONS */}
        {/* Buttons are totally safe outside the table area, wrapping onto new lines if needed */}
        <div className="w-full bg-white/50 border-t border-gray-200 p-6 flex flex-wrap items-center justify-end gap-4 shrink-0">
          <button 
            onClick={downloadActorScript}
            className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all shadow-sm"
          >
            <FileText size={16} /> Script Only (Actor Ver.)
          </button>
          
          <button 
            onClick={downloadDirectorStoryboard}
            className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-sm bg-black text-white hover:scale-105 transition-all shadow-xl"
          >
            <Download size={16} /> Full Storyboard (Director Ver.)
          </button>
        </div>
      </div>

    </motion.div>
  );
}