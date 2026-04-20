import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  UserCircle, 
  Lightbulb, 
  ShieldCheck, 
  CalendarCheck 
} from 'lucide-react';

// Import your pages
import Main from './pages/Main';
import Suggestions from './pages/Suggestions';
import Compliance from './pages/Compliance';
import Schedule from './pages/Schedule';
import Login from './pages/Login';
import Success from './pages/Success';

// --- 1. VIBRANT BACKGROUND (The "Alive" Mesh) ---
function BackgroundShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-[#fbfbfd]">
      {/* Stronger Blue Blob */}
      <motion.div 
        animate={{ 
          x: [0, 120, 0], 
          y: [0, 80, 0],
          scale: [1, 1.3, 1] 
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-blue-200/60 rounded-full blur-[110px]"
      />
      {/* Stronger Purple Blob */}
      <motion.div 
        animate={{ 
          x: [0, -100, 0], 
          y: [0, 150, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-40 w-[700px] h-[700px] bg-purple-200/50 rounded-full blur-[110px]"
      />
      {/* Teal Accent */}
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-[-100px] left-1/4 w-[600px] h-[600px] bg-teal-100 rounded-full blur-[130px]"
      />
    </div>
  );
}

// --- 2. THE FLOATING BOTTOM DOCK ---
function BottomDock() {
  const location = useLocation();
  const path = location.pathname;

  const creationSteps = ['/suggestions', '/compliance', '/schedule'];
  if (!creationSteps.includes(path)) return null;

  const steps = [
    { name: 'Suggest', path: '/suggestions', icon: <Lightbulb size={20} /> },
    { name: 'Safety', path: '/compliance', icon: <ShieldCheck size={20} /> },
    { name: 'Schedule', path: '/schedule', icon: <CalendarCheck size={20} /> },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[90]">
      <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full px-5 py-2.5 flex gap-6 items-center">
        {steps.map((step) => {
          const isActive = path === step.path;
          return (
            <Link
              key={step.path}
              to={step.path}
              className={`relative flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-500 group ${
                isActive ? 'text-[#0066cc]' : 'text-gray-400 hover:text-black'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeDockTab"
                  className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {step.icon}
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{step.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// --- 3. PAGE WRAPPER FOR TRANSITIONS ---
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Main />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </AnimatePresence>
  );
}

// --- 4. THE MAIN EXPORT ---
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative overflow-x-hidden selection:bg-[#0066cc]/10">
        
        <BackgroundShapes />

        {/* TOP NAV (Icons Fixed at Right) */}
        <nav className="fixed top-0 w-full h-16 border-b border-gray-100 bg-white/40 backdrop-blur-xl z-[100] flex items-center justify-between px-10">
          <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm rotate-45" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">Content Buddy</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link to="/schedule" className="text-gray-400 hover:text-[#0066cc] transition-all">
              <Calendar size={22} strokeWidth={1.5} />
            </Link>
            <Link to="/login" className="text-gray-400 hover:text-black transition-all">
              <UserCircle size={26} strokeWidth={1.5} />
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="relative z-10">
          <AnimatedRoutes />
        </main>

        <BottomDock />

      </div>
    </BrowserRouter>
  );
}