import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Compliance() {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState({ tiktok: true, instagram: false, youtube: false });

  const togglePlatform = (key) => setPlatforms(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="pt-32 p-6 max-w-4xl mx-auto relative z-10 pb-32">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Safety & Compliance.</h1>
        <p className="text-xl text-gray-500 mt-2">Buddy is checking platform rules and copyright.</p>
      </header>

      {/* Platform Selection */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
        <h3 className="font-bold text-lg mb-4">1. Where are you posting?</h3>
        <div className="flex gap-4">
          {['tiktok', 'instagram', 'youtube'].map((platform) => (
            <button 
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wider text-sm border-2 transition-all ${
                platforms[platform] ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-gray-300'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Results */}
      <div className="bg-[#f5f5f7] rounded-3xl p-8 mb-8">
        <h3 className="font-bold text-lg mb-6">2. Buddy's Analysis</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-white rounded-2xl">
            <CheckCircle2 className="text-emerald-500 mt-1" />
            <div>
              <p className="font-bold">Copyright Audio Check</p>
              <p className="text-sm text-gray-500">"Lofi Study Beats" is cleared for commercial use on all selected platforms.</p>
            </div>
          </div>

          {platforms.tiktok && (
            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
              <ShieldAlert className="text-yellow-600 mt-1" />
              <div>
                <p className="font-bold text-yellow-800">TikTok Restriction Warning</p>
                <p className="text-sm text-yellow-700">Buddy removed the phrase "link in bio" from the script to prevent algorithmic shadowbanning on TikTok.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => navigate('/schedule')}
          className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700"
        >
          Approve & Go to Schedule →
        </button>
      </div>
    </div>
  );
}