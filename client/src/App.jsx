import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Settings, Bell, User, Wand2, CalendarClock, Home, Sun, Moon } from 'lucide-react';
import logo from './assets/buddy.png'; 
import { ThemeProvider, useTheme } from './context/ThemeContext'; 

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Suggestions from './pages/Suggestions';
import Schedule from './pages/Schedule';
import Success from './pages/Success';

import { createClient } from '@supabase/supabase-js';

// --- INITIALIZE SUPABASE ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Buddy warning: Supabase credentials missing. Check Vercel Environment Variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); 
  const [history, setHistory] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);

  // --- NOTIFICATION STATES ---
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const navItems = [
    { path: '/app', label: 'Create', icon: <Wand2 size={18} /> },
    { path: '/suggestions', label: 'Suggest', icon: <Home size={18} /> },
    { path: '/schedule', label: 'Schedule', icon: <CalendarClock size={18} /> }
  ];

  // --- FETCH HISTORY ON LOAD ---
  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, hook, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
      } else {
        setHistory(data || []);
      }
    };
    fetchHistory();
  }, []);

  // --- FETCH NOTIFICATIONS ---
  useEffect(() => {
    const fetchNotifications = async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('scheduled_posts')
        .select('*, projects(hook)')
        .eq('status', 'pending')
        .lte('publish_time', now); 

      if (!error) {
        setNotifications(data || []);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- LOAD EXISTING PROJECT FROM HISTORY ---
  const loadProject = async (projectId) => {
    try {
      const { data: project, error: pError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (pError) throw pError;

      const { data: scenes, error: sError } = await supabase
        .from('storyboard_scenes')
        .select('*')
        .eq('project_id', projectId)
        .order('scene_number', { ascending: true });

      if (sError) throw sError;

      const fullProject = {
        id:project.id,
        hook: project.hook,
        sonicDna: project.sonic_dna,
        script: project.script,
        storyboard: scenes.map(s => ({
          scene: s.scene_number,
          visual: s.visual,
          characterAction: s.character_action,
          wayOfShooting: s.shooting_style,
          wayOfEditing: s.editing_style,
          dialogue: s.dialogue
        }))
      };

      sessionStorage.setItem('lastBuddyProject', JSON.stringify(fullProject));
      navigate('/suggestions');
    } catch (err) {
      console.error("Failed to load project:", err);
      alert("Buddy couldn't retrieve that project.");
    }
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden font-sans text-[#1d1d1f] dark:text-[#f5f5f7] bg-[#f8f9fb] dark:bg-[#000000] transition-colors duration-500">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-gradient-to-tr from-purple-500 via-blue-400 to-indigo-400 dark:from-fuchsia-600 dark:via-blue-600 dark:to-purple-500 rounded-full blur-[140px] opacity-20 dark:opacity-30 pointer-events-none z-0 transition-all duration-500"></div>

      {/* SIDEBAR */}
      <aside className="w-72 bg-white/70 dark:bg-[#0a0a0c]/40 backdrop-blur-3xl border-r border-white/40 dark:border-white/5 hidden md:flex flex-col p-8 z-20 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)] dark:shadow-[20px_0_40px_-20px_rgba(0,0,0,0.4)] transition-all duration-500">
        <div className="flex items-center gap-3 mb-12">
            <img src={logo} alt="Logo" className="w-12 h-12 drop-shadow-md" />
            <h2 className="text-2xl font-black tracking-tighter">Buddy.</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">Past Strategies</h3>
          <ul className="space-y-2">
            {history.length === 0 ? (
              <li className="text-xs text-gray-400 italic px-2">No history yet...</li>
            ) : (
              history.map((item) => (
                <li 
                  key={item.id} 
                  onClick={() => loadProject(item.id)}
                  className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/10 hover:text-blue-600 cursor-pointer transition-all group border border-transparent hover:border-blue-500/20"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                  <span className="truncate flex-1 text-xs">{item.hook}</span>
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
        {/* HEADER WITH NOTIFICATIONS */}
        <header className="h-20 bg-white/40 dark:bg-[#0a0a0c]/20 backdrop-blur-md border-b border-white/40 dark:border-white/5 flex items-center justify-end px-10 z-20 transition-all duration-500">
          <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
            <button onClick={toggleTheme} className="hover:text-black dark:hover:text-white transition-all p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {/* NOTIFICATION SECTION */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className={`hover:text-black dark:hover:text-white transition-all relative p-2 rounded-full ${showNotifPanel ? 'bg-black/5 dark:bg-white/5' : ''}`}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#f8f9fb] dark:border-black animate-pulse"></span>
                )}
              </button>

              {/* DROPDOWN PANEL */}
              {showNotifPanel && (
                <div className="absolute right-0 mt-4 w-80 bg-white/95 dark:bg-[#0a0a0c]/95 backdrop-blur-2xl border border-white dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[32px] p-6 z-[100] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Buddy Reminders</h4>
                    {notifications.length > 0 && (
                      <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">{notifications.length}</span>
                    )}
                  </div>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto hide-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-xs text-gray-400 italic">All caught up! No pending posts. ☕</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:border-blue-500/30 transition-colors">
                          <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 leading-tight mb-2">
                            Ready to Post: "{n.projects?.hook || 'Untitled Strategy'}"
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">{n.platform}</span>
                            <button 
                              onClick={() => { navigate('/schedule'); setShowNotifPanel(false); }}
                              className="text-[9px] font-black text-gray-400 hover:text-blue-500 transition-colors"
                            >
                              VIEW
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/success" element={<Success />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}