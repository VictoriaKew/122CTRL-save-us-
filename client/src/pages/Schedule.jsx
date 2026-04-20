import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function Schedule() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(20);
  const [time, setTime] = useState("18:30");

  // 1. DATA: Define your content topics here
  const mockTopics = {
    20: "Intro to Content Buddy",
    22: "FSKTM Lab Tour",
    25: "GenFest Hype Reel",
    28: "AI DNA Tutorial",
    30: "Final Project Reveal"
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const blanks = Array.from({ length: 3 }, (_, i) => i);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="pt-28 pb-20 px-6 max-w-5xl mx-auto relative z-10"
    >
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-5xl font-bold tracking-tight mb-2 text-apple-text">Content Schedule</h1>
        <p className="text-xl text-apple-sub">April 2026</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: THE VISUAL GRID */}
        <div className="lg:col-span-7 bg-white/40 backdrop-blur-3xl rounded-[32px] p-8 border border-white/50 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">April</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-black/5 rounded-full transition-colors"><ChevronLeft size={18}/></button>
              <button className="p-2 hover:bg-black/5 rounded-full transition-colors"><ChevronRight size={18}/></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(d => (
              <div key={d} className="text-center text-[10px] font-black text-apple-sub py-2 tracking-widest">{d}</div>
            ))}
            {blanks.map(b => <div key={`b-${b}`} />)}
            
            {days.map(day => (
              <button 
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`group relative h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border overflow-hidden
                  ${selectedDay === day 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105 z-20' 
                    : 'bg-white/50 border-white/20 hover:border-transparent text-apple-text'}`}
              >
                {/* DEFAULT VIEW (Number) */}
                <div className={`flex flex-col items-center transition-all duration-500 ${selectedDay === day ? '' : 'group-hover:opacity-0 group-hover:scale-50'}`}>
                  <span className="text-sm font-bold">{day}</span>
                  {day === 20 && <span className="text-[8px] font-black uppercase opacity-60">Today</span>}
                  {mockTopics[day] && selectedDay !== day && (
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-1" />
                  )}
                </div>

                {/* HOVER VIEW (Topic Reveal) */}
                {selectedDay !== day && (
                  <div className="absolute inset-0 bg-black text-white flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <span className="text-[7px] font-black uppercase opacity-50 mb-1">Day {day}</span>
                    <span className="text-[9px] font-bold leading-tight text-center">
                      {mockTopics[day] || "Available"}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS PANEL */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-black text-white p-8 rounded-[32px] shadow-2xl">
             <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <Sparkles size={14} /> AI Recommendation
             </div>
             <p className="text-lg font-medium leading-snug">
               "Your {mockTopics[selectedDay] || "next post"} will perform best at {time} based on Video #1's engagement pattern."
             </p>
          </div>

          <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[32px] border border-white shadow-xl">
             <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-apple-sub uppercase tracking-widest mb-1">Selected Date</label>
                  <p className="text-2xl font-bold">April {selectedDay}, 2026</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-apple-sub uppercase tracking-widest mb-2">
                    <Clock size={12} /> Specific Time
                  </label>
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#f5f5f7] p-4 rounded-2xl text-xl font-bold outline-none border border-transparent focus:border-blue-600 transition-all"
                  />
                </div>
                <button 
                  onClick={() => navigate('/success')}
                  className="w-full bg-[#0066cc] text-white py-5 rounded-2xl font-bold hover:bg-[#0077ee] active:scale-95 transition-all shadow-lg"
                >
                  Finalize & Schedule
                </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}