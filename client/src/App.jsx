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
  
  // Grab the theme and toggle function from Context
  const { theme, toggleTheme } = useTheme(); 
  
  // ==========================================
  // DYNAMIC MOCK DATA GENERATOR
  // Always ensures the calendar has data based on the *current* real-world date
  // ==========================================
  const [scheduledPosts, setScheduledPosts] = useState([]);

  const navItems = [
    { path: '/app', label: 'Create', icon: <Wand2 size={18} /> },
    { path: '/suggestions', label: 'Suggest', icon: <Home size={18} /> },
    { path: '/compliance', label: 'Safety', icon: <ShieldCheck size={18} /> },
    { path: '/schedule', label: 'Schedule', icon: <CalendarClock size={18} /> }
  ];

  return (
    <div className="flex h-screen w-full relative overflow-hidden font-sans text-[#1d1d1f] dark:text-[#f5f5f7] bg-[#f8f9fb] dark:bg-[#000000] transition-colors duration-500">
      
      {/* THE GLOWING ORB */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-gradient-to-tr from-purple-500 via-blue-400 to-indigo-400 dark:from-fuchsia-500 dark:via-blue-500 dark:to-purple-400 rounded-full blur-[140px] opacity-25 dark:opacity-40 pointer-events-none z-0 transition-all duration-500"></div>

      {/* SIDEBAR: Frosted Glass Panel */}
      <aside className="w-64 bg-white/80 dark:bg-black/40 backdrop-blur-2xl border-r border-white/80 dark:border-white/10 hidden md:flex flex-col p-6 z-20 shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-10">
            <img src={logo} alt="Logo" className="w-12 h-12 drop-shadow-md" />
            <h2 className="text-xl font-bold tracking-tight">Buddy.</h2>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Pipeline</h3>
          <ul className="space-y-3">
            {scheduledPosts.length === 0 ? (
                <li className="text-sm font-medium text-gray-400 dark:text-gray-600 italic">No scheduled posts</li>
            ) : (
                scheduledPosts.map((post, idx) => (
                    <li key={idx} className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] shrink-0"></div>
                        <span className="truncate">{post.title}</span> 
                        <span className="text-xs text-gray-400 shrink-0">({post.dayNum})</span>
                    </li>
                ))
            )}
          </ul>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative h-full z-10">
        {/* HEADER: Frosted Glass Panel */}
        <header className="h-20 bg-white/80 dark:bg-black/40 backdrop-blur-md border-b border-white/80 dark:border-white/10 flex items-center justify-end px-8 z-20 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-6 text-gray-600 dark:text-gray-300">
            
            {/* THEME TOGGLE BUTTON */}
            <button onClick={toggleTheme} className="hover:text-black dark:hover:text-white transition-colors drop-shadow-sm">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button className="hover:text-black dark:hover:text-white transition-colors relative">
                <Bell size={20} />
                {scheduledPosts.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>}
            </button>
            <button className="hover:text-black dark:hover:text-white transition-colors"><Settings size={20} /></button>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full text-white flex items-center justify-center shadow-md cursor-pointer border border-white/20">
              <User size={20} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-32">
          {/* Outlet passes the state down to all pages (like Schedule.jsx) */}
          <Outlet context={{ scheduledPosts, setScheduledPosts }} />
        </main>

        {/* BOTTOM NAVIGATION: Floating Island Style */}
        <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/70 dark:bg-black/50 backdrop-blur-3xl border border-white dark:border-white/10 shadow-2xl rounded-full px-2 py-2 flex gap-2 z-50 transition-all duration-300">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${isActive ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105' : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white'}`}>
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