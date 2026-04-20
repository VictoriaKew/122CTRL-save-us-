import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, MessageSquare, Lightbulb, ChevronLeft } from 'lucide-react';

export default function Insights() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <button onClick={() => navigate('/calendar')} className="mb-8 text-slate-400 hover:text-brand-600 flex items-center gap-2 text-sm font-bold">
        <ChevronLeft size={16} /> BACK TO CALENDAR
      </button>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-10">Performance Insights</h1>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<TrendingUp />} label="Total Views" value="1.2M" change="+12%" color="text-emerald-500" />
          <StatCard icon={<Users />} label="Engagement" value="84.2K" change="+5.4%" color="text-emerald-500" />
          <StatCard icon={<MessageSquare />} label="Comments" value="12.1K" change="-2.1%" color="text-rose-500" />
        </div>

        {/* The "Why it Worked" Card */}
        <div className="bg-brand-600 rounded-[2rem] p-10 text-white shadow-xl flex flex-col md:flex-row gap-8 items-center">
          <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-md">
            <Lightbulb size={48} className="text-amber-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">Agentic Analysis: Why it Worked</h2>
            <p className="text-brand-100 leading-relaxed text-lg italic">
              "Your 3-second 'Pattern Interrupt' hook in the latest TikTok script increased viewer retention by 24%. 
              By avoiding the word 'Giveaway' and using 'Mystery Box' instead, the Guardian successfully bypassed 
              algorithmic suppression, leading to a 3x higher reach in the first hour."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, color }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-modern border border-slate-100">
      <div className="text-brand-500 mb-4">{icon}</div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-3">
        <h3 className="text-3xl font-black text-slate-900">{value}</h3>
        <span className={`text-xs font-bold ${color}`}>{change}</span>
      </div>
    </div>
  );
}