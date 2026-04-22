import { User, Bell, Settings, Bookmark, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="h-20 bg-[#2D2D2D] border-b border-white/5 px-10 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-[#007BFF] rounded-xl flex items-center justify-center font-black text-xl shadow-lg">B</div>
        <span className="font-bold text-xl tracking-tighter text-[#F5F5F7]">Buddy.</span>
      </div>

      {/* Management Overlay */}
      <div className="hidden md:flex items-center gap-2 bg-[#1A1A1A] px-4 py-2 rounded-full border border-white/5">
        <button className="p-2 text-[#A1A1A6] hover:text-[#007BFF] transition-colors"><Bookmark size={18} /></button>
        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
        <button className="p-2 text-[#A1A1A6] hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer text-[#A1A1A6] hover:text-white">
          <Bell size={22} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#2D2D2D]"></span>
        </div>
        
        <div className="flex items-center gap-4 cursor-pointer group border-l border-white/10 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#F5F5F7] leading-none">Vic’s Lab</p>
            <p className="text-[10px] text-[#007BFF] font-black uppercase mt-1 tracking-widest">Creator Pro</p>
          </div>
          <div className="w-11 h-11 bg-[#3D3D3D] rounded-full flex items-center justify-center border-2 border-transparent group-hover:border-[#007BFF] transition-all">
            <User size={20} className="text-[#F5F5F7]" />
          </div>
          <Settings size={20} className="text-[#A1A1A6] hover:text-white" />
        </div>
      </div>
    </header>
  );
}