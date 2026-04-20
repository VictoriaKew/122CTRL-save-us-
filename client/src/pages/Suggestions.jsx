import { useNavigate } from 'react-router-dom';
import { Zap, Music, Send } from 'lucide-react';

export default function Suggestions() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 p-6 max-w-6xl mx-auto relative z-10">
      <header className="mb-16">
        <h1 className="text-5xl font-bold tracking-tight">Buddy's Creative Lab.</h1>
        <p className="text-xl text-gray-500 mt-2">Based on your 3 videos, here is the next move.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Main Suggestion */}
        <div className="lg:col-span-8 bg-white rounded-[40px] p-12 shadow-sm border border-gray-100">
           <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold mb-8">
             <Zap size={14} /> AI RECOMMENDED
           </div>
           <h2 className="text-4xl font-bold leading-tight mb-6">"Behind the scenes: How we actually build the 122CTRL engine."</h2>
           <p className="text-xl text-gray-500 leading-relaxed italic mb-10">"Using the pacing from Video #2 and the hook style from Video #1, this angle will maximize your FSKTM audience reach."</p>
           
           <div className="h-[1px] bg-gray-100 w-full mb-8"></div>
           
           <div className="flex justify-between items-center">
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold">#UMWEEK</span>
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold">#FSKTM</span>
             </div>
             <button className="text-blue-600 font-bold hover:underline">Edit Script</button>
           </div>
        </div>

        {/* Right: Small Info Cards */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-[#f5f5f7] p-8 rounded-[32px]">
              <Music className="text-blue-600 mb-4" />
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sonic DNA</h4>
              <p className="text-xl font-bold">Smooth Jazz-Hop</p>
           </div>
           <div className="bg-black text-white p-8 rounded-[32px]">
              <h4 className="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-4">Trend Report</h4>
              <p className="text-lg font-medium leading-snug">GenFest is peaking in 48 hours. Schedule now to hit the wave.</p>
           </div>
        </div>
      </div>
    </div>
  );
}