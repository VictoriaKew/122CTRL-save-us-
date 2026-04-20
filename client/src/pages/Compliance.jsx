import { useState } from 'react';
import { ShieldCheck, Copyright, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Compliance() {
  const navigate = useNavigate();
  const platforms = ['TikTok', 'Instagram Reels', 'YouTube Shorts'];

  return (
    <div className="pt-24 p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Safety & Platforms</h2>
      
      <div className="bg-white border border-gray-100 shadow-xl rounded-[32px] overflow-hidden mb-8">
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 text-emerald-600 bg-emerald-50 p-4 rounded-2xl">
            <Copyright /> <span className="font-bold">Music Copyright: SAFE</span>
          </div>
          
          <div className="space-y-4">
            <p className="font-bold text-sm text-gray-400 uppercase tracking-widest">Select Platforms</p>
            <div className="flex gap-4">
              {platforms.map(p => (
                <label key={p} className="flex items-center gap-2 bg-[#f5f5f7] px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-200">
                  <input type="checkbox" className="accent-blue-600" /> {p}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 p-6 border-t border-amber-100 flex gap-4">
          <AlertCircle className="text-amber-600" />
          <p className="text-amber-800 text-sm font-medium">Platform Alert: TikTok might flag "Giveaway" in captions. Buddy swapped it to "Gift" to be safe.</p>
        </div>
      </div>
      
      <button onClick={() => navigate('/schedule')} className="w-full bg-black text-white py-5 rounded-full font-bold">Check Schedule →</button>
    </div>
  );
}