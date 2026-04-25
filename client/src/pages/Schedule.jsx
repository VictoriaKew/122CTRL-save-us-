import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Sparkles, Globe2, ArrowRight, Wand2, ArrowLeft } from 'lucide-react';

export default function Schedule() {
  const navigate = useNavigate();
  const [pendingProject, setPendingProject] = useState(null);
  const { scheduledPosts, setScheduledPosts } = useOutletContext(); 

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [scheduleMode, setScheduleMode] = useState("auto"); // "auto" or "manual"

  // --- REAL-TIME DYNAMIC CALENDAR LOGIC ---
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const liveTimeMY = now.toLocaleTimeString('en-US', { 
    timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit', hour12: true 
  });

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); 
  const todayDate = now.getDate();
  const monthName = now.toLocaleString('default', { month: 'long' });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startingDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); 
  
  const emptyBlanks = Array(startingDayOfWeek).fill(null);
  const monthDays = Array.from({length: daysInMonth}, (_, i) => i + 1);

  const formatLocalDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };

  const tomorrow = new Date();
  tomorrow.setDate(todayDate + 1);
  const suggestedDateStr = formatLocalDate(tomorrow);
  const suggestedTimeStr = "19:00";
  const formattedSuggestedDisplay = `${tomorrow.toLocaleString('default', { month: 'short' })} ${tomorrow.getDate()}, ${currentYear} @ 7:00 PM`;

  // --- LOAD PROJECT FROM STORAGE (WITH PLACEHOLDER BLOCKER) ---
  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('lastBuddyProject'));
    // Only load if it exists AND is not our empty state warning string
    if (stored && stored.hook && !stored.hook.includes("No project loaded")) {
      setPendingProject(stored);
    }
  }, []);

  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handleSchedulePost = () => {
    let finalDate = selectedDate;
    let finalTime = selectedTime;

    if (scheduleMode === "auto") {
        finalDate = suggestedDateStr;
        finalTime = suggestedTimeStr;
    }

    if (!finalDate || !finalTime) {
      triggerToast("⚠️ Please select a date and time!");
      return;
    }

    const dateObj = new Date(finalDate + "T00:00:00");
    const dayName = dateObj.toLocaleString('en-US', { weekday: 'short' });

    const newPost = {
      id: Date.now(),
      title: pendingProject.hook,
      platform: "multiple", 
      date: finalDate,
      time: finalTime,
      dayNum: dayName,
      status: "Scheduled"
    };

    const updatedSchedule = [...scheduledPosts, newPost].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setScheduledPosts(updatedSchedule);
    setPendingProject(null); 
    sessionStorage.removeItem('lastBuddyProject'); 
    triggerToast("✨ Project Published to Grid!");
  };

  const getPostsForDay = (day) => {
    const dateStr = formatLocalDate(new Date(currentYear, currentMonth, day));
    return scheduledPosts.filter(p => p.date === dateStr);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-[1400px] mx-auto pb-80 relative z-10">
      
      {/* HEADER */}
      <header className="mb-10 mt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <motion.h2 className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              Phase 04: Content Calendar
            </motion.h2>
            <h1 className="text-5xl font-black tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">Publishing Hub.</h1>
            <div className="flex items-center gap-4 text-gray-500 font-medium">
                <p>Ready to go viral?</p>
                <span className="hidden md:inline-block border-l border-black/10 dark:border-white/10 h-4"></span>
                <span className="flex items-center gap-1.5 text-blue-500 bg-blue-500/5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/10">
                    <Globe2 size={12} /> {liveTimeMY} KL, MY
                </span>
            </div>
        </div>
        
        <button 
            onClick={() => navigate('/success')}
            className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-black text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-2xl shrink-0"
        >
            Publish & Finish 🎉 <ArrowRight size={18} />
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        
        {/* LEFT COLUMN: Awaiting Scheduling */}
        <div className="col-span-1 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-2">Awaiting Scheduling</h3>
            
            <AnimatePresence mode="popLayout">
                {pendingProject ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/70 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[32px] p-8 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden"
                    >
                        <div className="inline-block bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6 border border-blue-500/10">
                            Optimization Complete
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight tracking-tight">{pendingProject.hook}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-8 italic leading-relaxed">"{pendingProject.script}"</p>
                        
                        <div className="bg-black/5 dark:bg-white/5 p-1 rounded-2xl flex mb-6 border border-black/5 dark:border-white/5">
                            <button 
                                onClick={() => setScheduleMode("auto")}
                                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${scheduleMode === 'auto' ? 'bg-white dark:bg-black shadow-xl text-blue-600 dark:text-blue-400 border border-black/5 dark:border-white/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                🤖 Buddy Suggests
                            </button>
                            <button 
                                onClick={() => setScheduleMode("manual")}
                                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${scheduleMode === 'manual' ? 'bg-white dark:bg-black shadow-xl text-gray-900 dark:text-white border border-black/5 dark:border-white/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                ✍️ Custom Time
                            </button>
                        </div>

                        {scheduleMode === "auto" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-5 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20 text-center">
                                <Sparkles size={28} className="text-purple-500 mx-auto mb-3 animate-pulse" />
                                <span className="block text-[10px] font-black text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-widest">Peak Viral Window</span>
                                <span className="block text-lg font-black text-gray-900 dark:text-white leading-none">{formattedSuggestedDisplay}</span>
                            </motion.div>
                        )}

                        {scheduleMode === "manual" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 mb-6">
                                <div className="flex-1 flex items-center gap-3 bg-black/5 dark:bg-black/40 rounded-2xl p-4 border border-black/5 dark:border-white/5 focus-within:border-blue-500/50 transition-colors">
                                    <CalendarIcon size={18} className="text-gray-400 shrink-0" />
                                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent outline-none w-full text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer"/>
                                </div>
                                <div className="flex-1 flex items-center gap-3 bg-black/5 dark:bg-black/40 rounded-2xl p-4 border border-black/5 dark:border-white/5 focus-within:border-blue-500/50 transition-colors">
                                    <Clock size={18} className="text-gray-400 shrink-0" />
                                    <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="bg-transparent outline-none w-full text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer"/>
                                </div>
                            </motion.div>
                        )}

                        <button 
                            onClick={handleSchedulePost}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black transition-all hover:shadow-2xl shadow-lg text-sm active:scale-95"
                        >
                            Confirm Publication <ArrowRight size={18} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-xl border border-dashed border-gray-300 dark:border-white/10 rounded-[32px] p-10 flex flex-col items-center justify-center text-center min-h-[350px] shadow-inner">
                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6">
                            <CheckCircle2 size={40} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-400 dark:text-gray-500 mb-2">Workspace Empty</h4>
                        <p className="text-xs text-gray-400 dark:text-gray-600 mb-8 max-w-[200px] leading-relaxed">Your creative queue is currently empty. Generate a new strategy to begin.</p>
                        
                        {/* 🔥 CHANGED THIS TO ROUTE USER BACK TO START */}
                        <button 
                            onClick={() => navigate('/')} // Assuming '/' is your generator page
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl text-xs font-black text-gray-600 dark:text-gray-300 transition-all shadow-sm active:scale-95"
                        >
                            <ArrowLeft size={14} /> Back to Phase 1
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: The Dynamic Visual Grid Calendar */}
        <div className="col-span-1 xl:col-span-3 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 flex items-center justify-between ml-2">
                <span>{monthName} {currentYear} GRID</span>
                <span className="opacity-50">PUBLISHED & SCHEDULED</span>
            </h3>

            <div className="bg-white/70 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] rounded-[40px] p-5 md:p-8 transition-all duration-500">
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4">
                    {emptyBlanks.map((_, i) => (
                        <div key={`blank-${i}`} className="min-h-[90px] md:min-h-[130px] rounded-[24px] bg-black/[0.02] dark:bg-white/[0.01]"></div>
                    ))}

                    {monthDays.map(day => {
                        const dayPosts = getPostsForDay(day);
                        const isToday = day === todayDate;

                        return (
                            <div 
                                key={day} 
                                className={`min-h-[90px] md:min-h-[130px] rounded-[24px] p-3 border transition-all relative ${
                                    isToday 
                                    ? 'border-blue-500/50 bg-blue-500/[0.08] dark:bg-blue-500/[0.15] shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] scale-[1.02] z-10' 
                                    : 'border-black/5 dark:border-white/5 bg-white/30 dark:bg-white/[0.02] hover:border-black/10 dark:hover:border-white/20'
                                }`}
                            >
                                <div className={`text-[11px] font-black w-7 h-7 flex items-center justify-center rounded-full mb-2 ${
                                    isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 dark:text-gray-500'
                                }`}>
                                    {day}
                                </div>
                                
                                <div className="space-y-2 absolute bottom-3 left-2.5 right-2.5 z-20">
                                    {dayPosts.map(post => (
                                        <div key={post.id} className="relative group hover:z-[999]">
                                            <motion.div 
                                                whileHover={{ scale: 1.08 }}
                                                className="text-[9px] font-black leading-tight bg-black dark:bg-white text-white dark:text-black p-2 rounded-xl truncate cursor-pointer shadow-xl transition-all active:scale-95"
                                            >
                                                {post.time} - {post.title}
                                            </motion.div>
                                            
                                            {/* THE FLOATING HOVER TOOLTIP */}
                                            <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-60 p-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-[24px] shadow-[0_32px_64px_rgba(0,0,0,0.4)] opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 pointer-events-none transition-all duration-300 z-[999] origin-bottom border border-white/10 dark:border-black/5">
                                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 dark:bg-white rotate-45 border-b border-r border-white/10 dark:border-black/5"></div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                                    <span className="font-black uppercase tracking-[0.2em] text-[8px] opacity-60">Verified Entry</span>
                                                </div>
                                                <p className="font-bold text-sm mb-1 leading-snug">{post.title}</p>
                                                <p className="opacity-60 font-bold text-[10px] mb-3 tracking-tighter">{post.date} • {post.time}</p>
                                                <div className="flex items-center gap-2 pt-3 border-t border-white/10 dark:border-black/5">
                                                    <CheckCircle2 size={14} className="text-emerald-400 dark:text-emerald-500" /> 
                                                    <span className="font-black text-emerald-400 dark:text-emerald-500 uppercase tracking-widest text-[8px]">Safe to Publish</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-[120px] left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-8 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-colors border border-white/10 dark:border-black/5"
          >
            <CheckCircle2 size={20} className="text-emerald-400 dark:text-emerald-500" />
            <span className="font-black text-sm tracking-tight">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}