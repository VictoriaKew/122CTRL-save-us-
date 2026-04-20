import { useNavigate } from 'react-router-dom';
import { Calendar as CalIcon, Clock, CheckCircle2, ChevronLeft } from 'lucide-react';

export default function ContentCalendar() {
  const navigate = useNavigate();

  const mockPosts = [
    { id: 1, title: "Product Launch Hook", platform: "TikTok", time: "Mon, 10:00 AM", status: "Scheduled" },
    { id: 2, title: "Behind the Scenes", platform: "Instagram", time: "Wed, 02:30 PM", status: "Draft" },
    { id: 3, title: "122CTRL Feature Walkthrough", platform: "YouTube", time: "Fri, 06:00 PM", status: "Scheduled" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <button onClick={() => navigate('/lab')} className="mb-8 text-slate-400 hover:text-brand-600 flex items-center gap-2 text-sm font-bold">
        <ChevronLeft size={16} /> BACK TO LAB
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Content Calendar</h1>
            <p className="text-slate-500">Manage your upcoming viral moments.</p>
          </div>
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
            <button className="px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-bold">Week</button>
            <button className="px-4 py-2 text-slate-500 rounded-xl text-sm font-bold">Month</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockPosts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-3xl shadow-modern border border-slate-100 hover:border-brand-500 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <CalIcon size={20} />
                </div>
                <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${post.status === 'Scheduled' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {post.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{post.title}</h3>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 flex items-center gap-2"><Clock size={12}/> {post.time}</p>
                <p className="text-xs text-brand-600 font-bold">{post.platform}</p>
              </div>
            </div>
          ))}
          {/* Add Item Placeholder */}
          <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-6 text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer">
            <span className="text-2xl mb-2">+</span>
            <span className="text-xs font-bold uppercase tracking-widest">Plan New Post</span>
          </div>
        </div>
      </div>
    </div>
  );
}