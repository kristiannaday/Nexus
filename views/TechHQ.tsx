
import React, { useState, useContext } from 'react';
import { techArchitect } from '../services/gemini';
import { ThemeContext } from '../App';

const TechHQ: React.FC = () => {
  const [reqs, setReqs] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const handleDesign = async () => {
    setLoading(true);
    try {
      const data = await techArchitect(reqs);
      setResult(data);
    } catch (err) { alert("Error designing system."); }
    finally { setLoading(false); }
  };

  return (
    <div className={`max-w-4xl mx-auto pb-20 text-${colors.text}`}>
      <header className="mb-8"><h2 className="text-4xl font-black">Tech HQ</h2></header>
      <div className="bg-white p-8 rounded-[3rem] shadow-sm mb-10">
        <textarea className="w-full h-48 p-6 rounded-2xl bg-slate-50 border-none outline-none font-mono text-sm mb-4" placeholder="Specify system requirements, users, scale..." value={reqs} onChange={e => setReqs(e.target.value)} />
        <button onClick={handleDesign} disabled={loading} className={`w-full bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl`}>
          {loading ? "ARCHITECTING..." : "DESIGN SYSTEM"}
        </button>
      </div>
      {result && (
        <div className="bg-slate-900 text-slate-100 p-10 rounded-[3rem] shadow-2xl font-mono text-sm whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
};
export default TechHQ;
