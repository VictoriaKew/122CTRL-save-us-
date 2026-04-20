import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Settings, Bell, User, History, Wand2, ShieldCheck, CalendarClock, Home } from 'lucide-react';

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

  const navItems = [
    { path: '/app', label: 'Create', icon: <Wand2 size={18} /> },
    { path: '/suggestions', label: 'Suggest', icon: <Home size={18} /> },
    { path: '/compliance', label: 'Safety', icon: <ShieldCheck size={18} /> },
    { path: '/schedule', label: 'Schedule', icon: <CalendarClock size={18} /> }
  ];

  return (
    <div className="flex h-screen w-full relative overflow-hidden font-sans text-[#1d1d1f] bg-[#f8f9fb]">
      
      {/* --- THE APPLE CENTER MESH GRADIENT --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-gradient-to-tr from-purple-500 via-blue-400 to-indigo-400 rounded-full blur-[140px] opacity-25 pointer-events-none z-0"></div>

      {/* PANEL 1: SIDE PANEL */}
      <aside className="w-64 bg-white/80 backdrop-blur-2xl border-r border-white/80 hidden md:flex flex-col p-6 z-20 shadow-[10px_0_40px_-15px_rgba(0,0,0,0.05)]">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Buddy.</h2>
        <div className="flex-1">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">History</h3>
          <ul className="space-y-3">
            <li className="text-sm font-medium text-gray-400 italic">No recent projects</li>
          </ul>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative h-full z-10">
        {/* PANEL 2: TOP PANEL */}
        {/* PANEL 2: TOP PANEL (Now with higher opacity and a soft shadow) */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-white/80 flex items-center justify-end px-8 z-20 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)]">
          {/* ... inside stays exactly the same ... */}
          <div className="flex items-center gap-6 text-gray-600">
            <button className="hover:text-black transition-colors"><Bell size={20} /></button>
            <button className="hover:text-black transition-colors"><Settings size={20} /></button>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full text-white flex items-center justify-center shadow-md cursor-pointer">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto pb-32">
          <Outlet />
        </main>

        {/* PANEL 3: BOTTOM NAVIGATION */}
        <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-3xl border border-white shadow-2xl rounded-full px-2 py-2 flex gap-2 z-50">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                  isActive ? 'bg-black text-white shadow-lg scale-105' : 'text-gray-500 hover:bg-black/5 hover:text-black'
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

// --- THIS IS LIKELY THE PART THAT GOT DELETED BY MISTAKE! ---
export default function App() {
  return (
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
  );
}