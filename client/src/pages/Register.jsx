import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // 1. Sign up in Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      try {

        const userData = {
          user_id: data.user.id,
          email: email,     
          username: username 
        };

        console.log("User data to sync:", userData);
        
        // 2. Sync to Java Backend
        const response = await fetch('http://localhost:8080/api/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: data.user.id,
            email: email,
            username: username,
          })
        });

        const contentType = response.headers.get("content-type");
        if (response.ok) {
          alert("Registration successful!");
          navigate('/login');
        } else {
          const errorText = await response.text(); // Use .text() first to avoid the JSON crash
          console.error("Server Error:", errorText);
          alert("Sync failed: " + errorText);
        }
+
        alert("Registration successful! You can now log in.");
        navigate('/login');
      } catch (err) {
        console.error("Sync Error:", err);
        alert("Auth worked, but DB sync failed: " + err.message);
      }
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden flex items-center justify-center p-6 font-sans text-[#1d1d1f] bg-[#f8f9fb]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-gradient-to-tr from-purple-500 via-blue-400 to-indigo-400 rounded-full blur-[140px] opacity-25 pointer-events-none z-0"></div>

      <div className="relative z-10 bg-white/70 backdrop-blur-2xl border border-white shadow-2xl rounded-[40px] p-12 w-full max-w-md text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-8">Create Account.</h2>
        <input 
          type="text" placeholder="Username" 
          className="w-full mb-4 px-6 py-4 rounded-2xl bg-white/80 border border-white outline-none focus:border-blue-500 font-medium shadow-sm" 
          value={username} onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="email" placeholder="Email Address" 
          className="w-full mb-4 px-6 py-4 rounded-2xl bg-white/80 border outline-none focus:border-blue-500 font-medium" 
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full mb-4 px-6 py-4 rounded-2xl bg-white/80 border border-white outline-none focus:border-blue-500 font-medium shadow-sm" 
          value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <input 
          type="password" placeholder="Confirm Password" 
          className="w-full mb-8 px-6 py-4 rounded-2xl bg-white/80 border border-white outline-none focus:border-blue-500 font-medium shadow-sm" 
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleRegister} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform mb-6 shadow-xl">
          Create an account
        </button>
      </div>
    </div>
  );
}