import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Music, Video, Download, Camera } from 'lucide-react';

export default function Suggestions() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. SAFE DATA MERGING 
  // Prevents the blank screen by using fallback data if the API hasn't finished loading
  const passedData = location.state?.strategyData || {};
  
  const defaultStoryboard = [
    { id: 1, shotType: "Wide", movement: "Static", action: "Establishing shot of the subject in a clean, professional environment.", dialogue: "(Background music fades in)", duration: "3s" },
    { id: 2, shotType: "Close-up", movement: "Push In", action: "Subject looks directly at camera, confident expression.", dialogue: "\"Stop scrolling, I have a secret to share.\"", duration: "2s" },
    { id: 3, shotType: "Screen Record", movement: "None", action: "Demonstration of the product or method being discussed.", dialogue: "\"Here is exactly how this works...\"", duration: "5s" },
    { id: 4, shotType: "Medium", movement: "Pan Left", action: "Subject smiling, giving a call to action.", dialogue: "\"Save this for later!\"", duration: "3s" }
  ];

  const aiData = {
    hook: passedData.hook || "Stop scrolling. Here is the ultimate shortcut for your workflow.",
    script: passedData.script || "Using the fast pacing from your latest video, we cut straight to the core value. No fluff.",
    sonicDna: passedData.sonicDna || "Lofi Study Beats (Trending)",
    trendReport: passedData.trendReport || "New trends emerging in the creator space. Post soon for high engagement.",
    storyboard: passedData.storyboard || defaultStoryboard 
  };

  // 2. DOWNLOAD FUNCTION
  const downloadStoryboard = () => {
    const headers = ["Shot No.", "Shot Type", "Camera Movement", "Visual/Action", "Dialogue/Audio", "Duration"];
    const csvContent = [
      headers.join(","), 
      ...aiData.storyboard.map(row => 
        [row.id, row.shotType, row.movement, `"${row.action}"`, `"${row.dialogue}"`, row.duration].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "Buddy_Storyboard.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-32 p-6 max-w-7xl mx-auto relative z-10 pb-32">
      <header className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight">Buddy's Creative Lab.</h1>
        <p className="text-xl text-gray-500 mt-2">Trend-aligned strategy for your next post.</p>
      </header>

      {/* TOP SECTION: Script & Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-8 bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
           <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold mb-6">
             <Zap size={14} /> AI GENERATED STRATEGY
           </div>
           <h2 className="text-3xl font-bold leading-tight mb-4">"{aiData.hook}"</h2>
           <p className="text-lg text-gray-500 leading-relaxed italic mb-8">"{aiData.script}"</p>
           <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">#ViralContent</span>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">#SocialStrategy</span>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-[#f5f5f7] p-8 rounded-[32px]">
              <Music className="text-blue-600 mb-4" />
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trending Audio</h4>
              <p className="text-xl font-bold">{aiData.sonicDna}</p>
           </div>
           <button 
             onClick={() => navigate('/compliance')}
             className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors"
           >
             Continue to Safety Check →
           </button>
        </div>
      </div>

      {/* BOTTOM SECTION: Professional Storyboard Table */}
      <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3 text-black">
                <Video size={28} />
                <h3 className="text-2xl font-bold">Director's Storyboard</h3>
            </div>
            
            <button 
              onClick={downloadStoryboard}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-black px-5 py-2.5 rounded-full font-bold text-sm transition-all"
            >
              <Download size={16} /> Download CSV
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-black text-white text-sm uppercase tracking-wider">
                        <th className="p-4 rounded-tl-2xl">Shot</th>
                        <th className="p-4 text-center">Visual</th>
                        <th className="p-4">Shot Type</th>
                        <th className="p-4">Movement</th>
                        <th className="p-4 w-1/3">Action</th>
                        <th className="p-4">Audio</th>
                        <th className="p-4 rounded-tr-2xl">Time</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                    {aiData.storyboard.map((row, index) => (
                        <tr key={row.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfd]'}`}>
                            <td className="p-4 font-black text-lg text-center">{row.id}</td>
                            {/* NEW "MAGIC" CODE */}
<td className="p-4 text-center">
    <img 
        src={`https://image.pollinations.ai/prompt/${encodeURIComponent(row.action + " simple pencil sketch storyboard style")}?width=160&height=120&nologo=true`} 
        alt="Storyboard sketch"
        className="w-20 h-14 object-cover rounded-md mx-auto shadow-sm border border-gray-200"
        loading="lazy"
    />
</td>
                            <td className="p-4 font-bold">{row.shotType}</td>
                            <td className="p-4 font-bold text-blue-600">{row.movement}</td>
                            <td className="p-4 leading-relaxed">{row.action}</td>
                            <td className="p-4 italic text-gray-500">{row.dialogue}</td>
                            <td className="p-4 font-bold text-center">{row.duration}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}