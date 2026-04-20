import { useLocation, useNavigate } from 'react-router-dom';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) return <button onClick={() => navigate('/')} className="p-20 underline">Return Home</button>;

  return (
    <div className="min-h-screen bg-zinc-50 flex justify-center p-8 md:p-20">
      <div className="w-full max-w-3xl bg-white border border-border p-12 shadow-sm">
        <div className="flex justify-between items-center mb-20">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em]">Final Strategy</h2>
          <button onClick={() => navigate('/')} className="text-[10px] text-muted hover:text-black underline underline-offset-8">RESET</button>
        </div>

        <div className="space-y-16">
          <Section label="Primary Hook" content={result.hook} large />
          <Section label="Scripting" content={result.script} italic />
          
          <div className="grid grid-cols-2 gap-12 border-t border-zinc-100 pt-12">
            <Section label="Visuals" content={result.visuals} />
            <Section label="Audio" content={result.audio} />
          </div>
          
          <div className="bg-black text-white p-10">
            <Section label="Caption" content={result.caption} />
          </div>
          
          <footer className="pt-10 border-t border-zinc-100">
            <p className="text-[9px] text-muted uppercase tracking-[0.2em]">
              Compliance: {result.complianceScore} | {result.guardianWarning}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function Section({ label, content, large, italic }) {
  return (
    <div>
      <h3 className="text-[9px] uppercase tracking-widest text-muted mb-4 font-bold">{label}</h3>
      <p className={`text-black leading-relaxed ${large ? 'text-2xl font-light' : 'text-base font-light'} ${italic ? 'italic font-serif' : ''}`}>
        {content}
      </p>
    </div>
  );
}