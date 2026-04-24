import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full relative overflow-hidden flex items-center justify-center p-6 font-sans text-[#1d1d1f] bg-[#f8f9fb]">
      
      {/* THE GLOWING ORB */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-gradient-to-tr from-purple-500 via-blue-400 to-indigo-400 rounded-full blur-[140px] opacity-25 pointer-events-none z-0"></div>

      {/* CONTENT */}
      <div className="relative z-10 bg-white/70 backdrop-blur-2xl border border-white shadow-2xl rounded-[40px] p-12 w-full max-w-md text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-8">Create Account.</h2>
        <input type="text" placeholder="Username" className="w-full mb-4 px-6 py-4 rounded-2xl bg-white/80 border border-white outline-none focus:border-blue-500 font-medium shadow-sm" />
        <input type="password" placeholder="Password" className="w-full mb-4 px-6 py-4 rounded-2xl bg-white/80 border border-white outline-none focus:border-blue-500 font-medium shadow-sm" />
        <input type="password" placeholder="Confirm Password" className="w-full mb-8 px-6 py-4 rounded-2xl bg-white/80 border border-white outline-none focus:border-blue-500 font-medium shadow-sm" />
        <button onClick={() => navigate('/login')} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform mb-6 shadow-xl">
          Create an account
        </button>
      </div>
    </div>
  );
}