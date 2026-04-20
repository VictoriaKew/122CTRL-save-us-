import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Send, 
  Sparkles, 
  MousePointer2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Schedule() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
  const [selectedDate, setSelectedDate] = useState('2026-04-21');
  const [selectedTime, setSelectedTime] = useState('18:00');

  // Mock Calendar Data for the Grid
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="pt-32 p-6 max-w-6xl mx-auto relative z-10 pb-40">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Content Roadmap.</h1>
        <p className="text-xl text-gray-500">Pick Buddy's optimized timing or set your own strategy.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: SCHEDULING CONTROLS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Mode Switcher */}
          <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-2">
            <button 
              onClick={() => setMode('auto')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${mode === 'auto' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-black'}`}
            >
              <Sparkles size={18} /> Buddy's Auto
            </button>
            <button 
              onClick={() => setMode('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${mode === 'manual' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-black'}`}
            >
              <MousePointer2 size={18} /> Manual Pick
            </button>
          </div>

          {/* Dynamic Card based on Mode */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {mode === 'auto' ? (
                <motion.div 
                  key="auto" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Sparkles size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Tomorrow @ 6:00 PM</h3>
                    <p className="text-gray-500 mt-2 leading-relaxed">
                      Buddy analyzed the FSKTM audience. 6 PM is the peak activity window for GenFest prep.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="manual" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                    <Clock size={32} />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Date</label>
                      <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full mt-1 bg-gray-50 border-none rounded-xl p-4 font-bold focus:ring-2 focus:ring-purple-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Time</label>
                      <input 
                        type="time" 
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full mt-1 bg-gray-50 border-none rounded-xl p-4 font-bold focus:ring-2 focus:ring-purple-200 outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => navigate('/success')}
              className="w-full bg-black text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-8"
            >
              <Send size={20} /> Schedule with Buddy
            </button>
          </div>
        </div>

        {/* RIGHT: CALENDAR GRID VISUALIZER */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold">April 2026</h3>
                    <p className="text-sm text-gray-400">UM Semester 2 Overview</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} /></button>
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 mb-4">
              {days.map(day => (
                <div key={day} className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">{day}</div>
              ))}
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 gap-2">
              {dates.map(date => {
                const isToday = date === 20;
                const isScheduled = date === 21; // The Buddy recommended date
                
                return (
                  <div 
                    key={date} 
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative border transition-all ${
                      isToday ? 'border-black bg-black text-white' : 
                      isScheduled ? 'border-blue-200 bg-blue-50/50' : 
                      'border-gray-50 hover:border-gray-200 text-gray-400'
                    }`}
                  >
                    <span className="text-sm font-bold">{date}</span>
                    {isScheduled && (
                        <motion.div 
                          layoutId="activePost"
                          className="absolute -bottom-1 w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
                        />
                    )}
                    {isScheduled && (
                        <div className="absolute top-1 right-1 bg-blue-600 text-[8px] text-white px-1.5 py-0.5 rounded-full font-black">
                            POST
                        </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-8 border-t border-gray-50 flex gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-black rounded-full" />
                    <span className="text-xs text-gray-400 font-bold">Today</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    <span className="text-xs text-gray-400 font-bold">Scheduled Post</span>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}