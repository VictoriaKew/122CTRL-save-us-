import { useState } from 'react'; 
import { supabase } from '../supabaseClient'; 
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    alert("Login failed: " + error.message);
  } else {
    console.log("Logged in user ID:", data.user.id);
    navigate('/app');
  }
};
  return (
    // ADDED: dark:bg-[#000000] and dark:text-[#f5f5f7]
    <div className="h-screen w-full relative overflow-hidden flex items-center justify-center p-6 font-sans text-[#1d1d1f] dark:text-[#f5f5f7] bg-[#f8f9fb] dark:bg-[#000000] transition-colors duration-500">
      
      {/* THE GLOWING ORB (Updated to match App.jsx!) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-gradient-to-tr from-purple-500 via-blue-400 to-indigo-400 dark:from-fuchsia-500 dark:via-blue-500 dark:to-purple-400 rounded-full blur-[140px] opacity-25 dark:opacity-40 pointer-events-none z-0 transition-all duration-500"></div>

      {/* CONTENT: Replaced the long string of utility classes with our clean `glass-panel` class */}
      <div className="relative z-10 glass-panel rounded-[40px] p-12 w-full max-w-md text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-2">Welcome back.</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Log in to Content Buddy.</p>
        
        {/* Updated Inputs for Dark Mode */}
        <input 
          type="text" 
          placeholder="Email" 
          className="w-full mb-4 px-6 py-4 rounded-2xl bg-white/80 dark:bg-black/50 border border-white dark:border-white/10 outline-none focus:border-blue-500 dark:focus:border-blue-400 font-medium shadow-sm text-black dark:text-white transition-colors" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full mb-8 px-6 py-4 rounded-2xl bg-white/80 dark:bg-black/50 border border-white dark:border-white/10 outline-none focus:border-blue-500 dark:focus:border-blue-400 font-medium shadow-sm text-black dark:text-white transition-colors" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button 
          onClick={handleLogin} 
          className="w-full bg-blue-600 dark:bg-blue-500 text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform mb-6 shadow-xl"
        >
          Sign In
        </button>
        
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Don't have an account? <button onClick={() => navigate('/register')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Create one</button>
        </p>
      </div>
    </div>
  );
}