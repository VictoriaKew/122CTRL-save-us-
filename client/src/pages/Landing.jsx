import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/buddy.png'; 

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-6 text-center font-sans text-[#1d1d1f] bg-transparent">
      
      {/* THE GLOWING ORB */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-gradient-to-tr from-purple-500 via-blue-400 to-indigo-400 rounded-full blur-[140px] opacity-25 pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* ANIMATED LOGO */}
        <motion.img 
          initial={{ y: 20, opacity: 0, scale: 0.9 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }} 
          src={logo} 
          alt="Content Buddy Logo" 
          className="w-64 h-auto drop-shadow-2xl"
        />
        
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-xl text-gray-500 font-light mb-12">
          Your AI director, strategist, and manager.
        </motion.p>
        <motion.button 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
          onClick={() => navigate('/login')}
          className="bg-black text-white px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl"
        >
          Join Us Now
        </motion.button>
      </div>
    </div>
  );
}