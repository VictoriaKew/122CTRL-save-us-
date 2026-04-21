import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

export default function Schedule() {
  const navigate = useNavigate();
  // Bring in the global state we created in App.jsx!
  const { scheduledPosts, setScheduledPosts } = useOutletContext();
  
  const [selectedSlot, setSelectedSlot] = useState({ id: 'recommended', dayNum: 23 });
  const [isScheduling, setIsScheduling] = useState(false);

  const scheduleSlots = [
    { id: 'early', day: 'Wed, Apr 22', dayNum: 22, time: '09:00 AM', label: 'Morning Commute' },
    { id: 'recommended', day: 'Thu, Apr 23', dayNum: 23, time: '06:30 PM', label: 'AI Recommended' },
    { id: 'weekend', day: 'Sat, Apr 25', dayNum: 25, time: '12:00 PM', label: 'Weekend Spike' }
  ];

  const handleConfirm = () => {
    setIsScheduling(true);
    
    // Save this exact post to the global array so the calendar remembers it
    setTimeout(() => {
        setScheduledPosts(prev => [...prev, {
            title: "The Ultimate Workflow Hack",
            dayNum: selectedSlot.dayNum
        }]);
        setIsScheduling(false);
        navigate('/success'); 
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-5xl mx-auto pb-32">
      <header className="mb-12 mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-[#1d1d1f] mb-2">Publishing Strategy.</h1>
          <p className="text-xl text-gray-500 font-light">Buddy has analyzed audience activity to find the perfect launch window.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-[40px] p-10 text-white shadow-xl relative overflow-hidden">
            <Sparkles className="absolute top-6 right-6 text-white/30" size={80} strokeWidth={1} />
            <h3 className="text-xs font-black uppercase tracking-widest text-white/70 mb-2">Prime Time Algorithm</h3>
            <h2 className="text-3xl font-bold mb-4">Thursday at 6:30 PM</h2>
            <p className="text-white/80 font-medium leading-relaxed">
              Based on your audience demographics, engagement spikes significantly on Thursday evenings.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl border border-white/80 shadow-xl rounded-[40px] p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Select a Slot</h3>
            <div className="space-y-4">
              {scheduleSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all duration-300 ${
                    selectedSlot.id === slot.id ? 'border-black bg-black text-white shadow-lg' : 'border-white bg-white/50 text-gray-600 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {slot.id === 'recommended' ? <Sparkles size={20} className={selectedSlot.id === slot.id ? 'text-yellow-400' : 'text-blue-500'} /> : <Clock size={20} />}
                    <div className="text-left">
                      <p className="font-bold">{slot.day}</p>
                      <p className={`text-sm ${selectedSlot.id === slot.id ? 'text-gray-300' : 'text-gray-400'}`}>{slot.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white/80 backdrop-blur-2xl border border-white/80 shadow-xl rounded-[40px] p-10 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Content Pipeline</h3>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <CalendarIcon size={16} className="text-gray-500" />
              <span className="text-sm font-bold text-gray-700">April 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 flex-1 mt-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-gray-50 border border-gray-100/50 flex items-center justify-center text-gray-300 font-medium">
                {i + 1}
              </div>
            ))}
            
            <div className="aspect-square rounded-2xl bg-white border border-gray-200 flex flex-col items-center justify-center relative">
              <span className="font-bold text-gray-800">16</span>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Today</span>
            </div>

            {Array.from({ length: 14 }).map((_, i) => {
              const dayNum = 17 + i;
              const isTargetDay = selectedSlot.dayNum === dayNum;
              
              // Check global state if this day is already scheduled
              const existingPost = scheduledPosts.find(post => post.dayNum === dayNum);

              return (
                <div 
                  key={`future-${i}`} 
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-500 relative cursor-pointer ${
                    existingPost ? 'bg-green-100 border-green-300 text-green-800' : 
                    isTargetDay ? 'bg-blue-600 shadow-lg scale-110 z-10 text-white' : 'bg-white border border-gray-100 hover:border-blue-300 text-gray-600'
                  }`}
                >
                  <span className="font-bold">{dayNum}</span>
                  {(isTargetDay || existingPost) && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2">
                      <CheckCircle2 className={`${existingPost ? 'text-green-600' : 'text-green-400'} bg-white rounded-full`} size={18} />
                    </motion.div>
                  )}
                  {existingPost && (
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1 text-green-700 line-clamp-1 px-1 text-center leading-tight">
                      Locked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end border-t border-gray-200 pt-8">
        <button 
          onClick={handleConfirm}
          disabled={isScheduling}
          className="flex items-center gap-3 bg-black text-white px-12 py-5 rounded-full font-bold hover:scale-105 transition-all shadow-2xl disabled:bg-gray-400 disabled:scale-100"
        >
          {isScheduling ? <><Loader2 className="animate-spin" size={20} /> Saving to Database...</> : "Confirm & Schedule Post"}
        </button>
      </div>
    </motion.div>
  );
}