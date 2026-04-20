import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/strategize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      if (!response.ok) throw new Error("Server not responding");

      const data = await response.json();
      // This is what moves you to the new "page"
      navigate('/result', { state: { result: data.generatedPost } });
    } catch (e) {
      alert("⚠️ Backend Connection Failed. Check if Java is running on port 8080!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-[0.3em] uppercase">122CTRL</h1>
          <div className="h-[1px] w-12 bg-black mx-auto mt-4"></div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Campaign Subject</label>
          <input 
            className="w-full border-b border-zinc-200 py-3 focus:outline-none focus:border-black transition-all text-lg font-light" 
            placeholder="e.g. New Product Launch" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)} 
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="w-full bg-black text-white py-5 text-[10px] font-bold tracking-[0.2em] hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:bg-zinc-100 disabled:text-zinc-400"
        >
          {loading ? "ANALYZING..." : "GENERATE STRATEGY"}
        </button>
      </div>
    </div>
  );
}