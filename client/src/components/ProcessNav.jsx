import { useNavigate, useLocation } from 'react-router-dom';
import { Lightbulb, ShieldCheck, CalendarCheck } from 'lucide-react';

export default function ProcessNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { name: 'Suggestions', path: '/suggestions', icon: <Lightbulb size={20} /> },
    { name: 'Compliance', path: '/compliance', icon: <ShieldCheck size={20} /> },
    { name: 'Schedule', path: '/schedule', icon: <CalendarCheck size={20} /> },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/70 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-full px-6 py-3 flex gap-8 items-center">
        {steps.map((step) => {
          const isActive = location.pathname === step.path;
          return (
            <button
              key={step.path}
              onClick={() => navigate(step.path)}
              className={`flex items-center gap-2 transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-black'}`}
            >
              {step.icon}
              <span className="text-[11px] font-bold uppercase tracking-widest">{step.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}