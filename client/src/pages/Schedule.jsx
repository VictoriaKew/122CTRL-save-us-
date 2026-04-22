import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Sparkles, Globe2, ArrowRight, Wand2 } from 'lucide-react';

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

  // --- LOAD PROJECT FROM STORAGE ---
  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('lastBuddyProject'));
    if (stored && stored.hook) {
      setPendingProject(stored);
    }
  }, []);

  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  // --- HACKATHON SAFETY NET: LOAD FAKE DATA IF BACKEND FAILS ---
  const loadDemoProject = () => {
      setPendingProject({
          hook: "How I built this app in 24 hours 🚀",
          script: "This is a demo project to show off the scheduling UI because the backend is offline!",
      });
      triggerToast("Loaded Demo Project!");
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
    triggerToast("✨ Post Locked into Calendar!");
  };

  const getPostsForDay = (day) => {
    const dateStr = formatLocalDate(new Date(currentYear, currentMonth, day));
    return scheduledPosts.filter(p => p.date === dateStr);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-[1400px] mx-auto pb-40 relative z-10">
      
      {/* HEADER WITH LAUNCH WORKSPACE BUTTON */}
      <header className="mb-8 mt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <motion.h2 className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              Phase 04: Content Calendar
            </motion.h2>
            <h1 className="text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Publishing Hub.</h1>
            <div className="flex items-center gap-4 text-gray-500 font-medium">
                <p>Manage your upcoming viral hits.</p>
                <span className="hidden md:inline-block border-l border-gray-300 dark:border-gray-700 h-4"></span>
                <span className="flex items-center gap-1.5 text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    <Globe2 size={12} /> KL, Malaysia • {liveTimeMY}
                </span>
            </div>
        </div>
        
        {/* Navigate to Success Page */}
        <button 
            onClick={() => navigate('/success')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shrink-0"
        >
            Launch Workspace <ArrowRight size={18} />
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: Pending Approvals */}
        <div className="col-span-1 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Awaiting Scheduling</h3>
            
            <AnimatePresence mode="popLayout">
                {pendingProject ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-blue-200 dark:border-blue-500/30 rounded-[32px] p-6 shadow-xl relative"
                    >
                        <div className="inline-block bg-blue-100 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                            Ready to Post
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-snug">{pendingProject.hook}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-6 italic">"{pendingProject.script}"</p>
                        
                        {/* THE 2 OPTIONS FOR SCHEDULING */}
                        <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl flex mb-4">
                            <button 
                                onClick={() => setScheduleMode("auto")}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${scheduleMode === 'auto' ? 'bg-white dark:bg-black shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                🤖 Buddy Suggests
                            </button>
                            <button 
                                onClick={() => setScheduleMode("manual")}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${scheduleMode === 'manual' ? 'bg-white dark:bg-black shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                ✍️ Custom Time
                            </button>
                        </div>

                        {/* MODE 1: AI SUGGESTION */}
                        {scheduleMode === "auto" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-100 dark:border-purple-500/20 text-center">
                                <Sparkles size={24} className="text-purple-500 mx-auto mb-2 animate-pulse" />
                                <span className="block text-xs font-bold text-purple-700 dark:text-purple-400 mb-1">Peak Viral Window Detected</span>
                                <span className="block text-lg font-black text-gray-900 dark:text-white">{formattedSuggestedDisplay}</span>
                            </motion.div>
                        )}

                        {/* MODE 2: MANUAL INPUT */}
                        {scheduleMode === "manual" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 mb-4">
                                <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-black/40 rounded-xl p-3 border border-gray-100 dark:border-white/5 focus-within:border-blue-400 transition-colors">
                                    <CalendarIcon size={16} className="text-gray-400 shrink-0" />
                                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent outline-none w-full text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"/>
                                </div>
                                <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-black/40 rounded-xl p-3 border border-gray-100 dark:border-white/5 focus-within:border-blue-400 transition-colors">
                                    <Clock size={16} className="text-gray-400 shrink-0" />
                                    <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="bg-transparent outline-none w-full text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"/>
                                </div>
                            </motion.div>
                        )}

                        <button 
                            onClick={handleSchedulePost}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-colors shadow-md text-sm"
                        >
                            Lock it in Calendar <ArrowRight size={16} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/50 dark:bg-white/[0.02] border border-dashed border-gray-300 dark:border-white/20 rounded-[32px] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                        <CheckCircle2 size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                        <h4 className="text-gray-500 dark:text-gray-400 font-bold mb-1">Inbox Zero!</h4>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">No pending projects to schedule.</p>
                        
                        <button 
                            onClick={loadDemoProject}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors"
                        >
                            <Wand2 size={14} /> Load Demo Project
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: The Dynamic Visual Grid Calendar */}
        <div className="col-span-1 xl:col-span-3 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center justify-between">
                {monthName} {currentYear} Content Grid
            </h3>

            <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-xl rounded-[40px] p-4 md:p-6">
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-3">
                    {emptyBlanks.map((_, i) => (
                        <div key={`blank-${i}`} className="min-h-[80px] md:min-h-[120px] rounded-2xl bg-gray-50/50 dark:bg-white/[0.01]"></div>
                    ))}

                    {monthDays.map(day => {
                        const dayPosts = getPostsForDay(day);
                        const isToday = day === todayDate;

                        return (
                            <div 
                                key={day} 
                                className={`min-h-[80px] md:min-h-[120px] rounded-xl md:rounded-2xl p-1.5 md:p-2 border transition-all relative ${
                                    isToday 
                                    ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 shadow-inner' 
                                    : 'border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/20'
                                }`}
                            >
                                <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                                    isToday ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 dark:text-gray-500'
                                }`}>
                                    {day}
                                </div>
                                
                                {/* Removed overflow-hidden so tooltips can escape! */}
                                <div className="space-y-1.5 absolute bottom-2 left-1.5 right-1.5 z-20">
                                    {dayPosts.map(post => (
                                        <div key={post.id} className="relative group">
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                className="text-[9px] md:text-[10px] leading-tight font-bold bg-black dark:bg-white text-white dark:text-black p-1 md:p-1.5 rounded-md truncate cursor-pointer shadow-md group-hover:scale-105 transition-transform"
                                            >
                                                {post.time} - {post.title}
                                            </motion.div>
                                            
                                            {/* THE FLOATING HOVER TOOLTIP */}
                                            <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-48 p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 pointer-events-none transition-all duration-200 z-[100] origin-bottom">
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45"></div>
                                                <p className="font-black text-sm mb-1 leading-tight text-white dark:text-black">{post.title}</p>
                                                <p className="opacity-70 font-medium text-gray-300 dark:text-gray-600">{post.date} @ {post.time}</p>
                                                <div className="mt-2 pt-2 border-t border-white/20 dark:border-black/10 flex items-center gap-1 font-bold text-emerald-400 dark:text-emerald-500">
                                                    <CheckCircle2 size={12} /> {post.status}
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

      {/* TOAST NOTIFICATION - Safely at bottom-[120px] */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-[120px] left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black shadow-2xl transition-colors"
          >
            <CheckCircle2 size={20} className="text-emerald-400 dark:text-emerald-500" />
            <span className="font-bold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}