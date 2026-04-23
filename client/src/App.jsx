import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Settings, Bell, User, Wand2, ShieldCheck, CalendarClock, Home, Sun, Moon } from 'lucide-react';
import logo from './assets/buddy.png'; 
import { ThemeProvider, useTheme } from './context/ThemeContext'; 

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Suggestions from './pages/Suggestions';
import Compliance from './pages/Compliance';
import Schedule from './pages/Schedule';
import Success from './pages/Success';

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); 
  
  // 🔥 FIXED: Start with a completely empty schedule! No more FSKTM mock data!
  const [scheduledPosts, setScheduledPosts] = useState([]);

  const navItems = [
    { path: '/app', label: 'Create', icon: <Wand2 size={18} /> },
    { path: '/suggestions', label: 'Suggest', icon: <Home size={18} /> },
    { path: '/compliance', label: 'Safety', icon: <ShieldCheck size={18} /> },
    { path: '/schedule', label: 'Schedule', icon: <CalendarClock size={18} /> }
  ];

  return (
    <div className="flex h-screen w-full relative overflow-hidden font-sans text-[#1d1d1f] dark:text-[#f5f5f7] bg-[#f8f9fb] dark:bg-[#000000] transition-colors duration-500">
      
      {/* THE GLOWING ORB BACKGROUND */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-gradient-to-tr from-purple-500 via-blue-400 to-indigo-400 dark:from-fuchsia-600 dark:via-blue-600 dark:to-purple-500 rounded-full blur-[140px] opacity-20 dark:opacity-30 pointer-events-none z-0 transition-all duration-500"></div>

      {/* SIDEBAR: Glass Panel (ONLY ONE HERE) */}
      <aside className="w-72 bg-white/70 dark:bg-[#0a0a0c]/40 backdrop-blur-3xl border-r border-white/40 dark:border-white/5 hidden md:flex flex-col p-8 z-20 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)] dark:shadow-[20px_0_40px_-20px_rgba(0,0,0,0.4)] transition-all duration-500">
        <div className="flex items-center gap-3 mb-12">
            <img src={logo} alt="Logo" className="w-12 h-12 drop-shadow-md" />
            <h2 className="text-2xl font-black tracking-tighter">Buddy.</h2>
        </div>
        
        <div className="flex-1">
          <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">Content Pipeline</h3>
          <ul className="space-y-4">
            {scheduledPosts.length === 0 ? (
                <li className="text-sm font-medium text-gray-400 dark:text-gray-600 italic px-2">No scheduled posts</li>
            ) : (
                scheduledPosts.map((post, idx) => (
                    <li key={idx} className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-3 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default group">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] shrink-0 group-hover:scale-125 transition-transform"></div>
                        <span className="truncate flex-1">{post.title}</span> 
                        <span className="text-[10px] opacity-40 font-black shrink-0">({post.dayNum})</span>
                    </li>
                ))
            )}
          </ul>
        </div>

        <div className="pt-6 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <User size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold">FSKTM Creator</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black">Pro Plan</p>
                </div>
            </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative h-full z-10">
        {/* HEADER: Tinted Glass Top Bar */}
        <header className="h-20 bg-white/40 dark:bg-[#0a0a0c]/20 backdrop-blur-md border-b border-white/40 dark:border-white/5 flex items-center justify-end px-10 z-20 transition-all duration-500">
          <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
            <button onClick={toggleTheme} className="hover:text-black dark:hover:text-white transition-all p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="hover:text-black dark:hover:text-white transition-all relative">
                <Bell size={20} />
                {scheduledPosts.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f8f9fb] dark:border-black"></span>}
            </button>
            <button className="hover:text-black dark:hover:text-white transition-all"><Settings size={20} /></button>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto pb-40">
          <Outlet context={{ scheduledPosts, setScheduledPosts }} />
        </main>

        {/* FLOATING NAVIGATION */}
        <nav className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/70 dark:bg-black/40 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full px-3 py-3 flex gap-2 z-50 transition-all duration-500">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.path} 
                onClick={() => navigate(item.path)} 
                className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                  isActive 
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-xl scale-105' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                }`}
              >
                {item.icon} {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<Main />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/success" element={<Success />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}