
import React, { useState, useContext } from 'react';
import { scientificResearcher } from '../services/gemini';
import { ThemeContext } from '../App';

const ScientificHQ: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, grounding: any[] } | null>(null);
  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const handleResearch = async () => {
    setLoading(true);
    try {
      const data = await scientificResearcher(query);
      setResult(data);
    } catch (err) { alert("Error conducting research."); }
    finally { setLoading(false); }
  };

  return (
    <div className={`max-w-4xl mx-auto pb-20 text-${colors.text}`}>
      <header className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <i className="fa-solid fa-flask text-2xl"></i>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Scientific HQ</h2>
        </div>
      </header>
      <div className="bg-white p-8 rounded-[3rem] shadow-sm mb-10">
        <textarea className="w-full h-32 p-6 rounded-2xl bg-gray-50 border-none outline-none font-bold text-sm mb-4" placeholder="Enter research query, compound, or methodology..." value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={handleResearch} disabled={loading} className={`w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl transition-all hover:scale-[1.01]`}>
          {loading ? "CONDUCTING RESEARCH..." : "QUERY RESEARCH DATABASE"}
        </button>
      </div>
      {result && (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.text}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {result.grounding.map((g, i) => g.web && (
              <a key={i} href={g.web.uri} target="_blank" className="px-3 py-1 bg-emerald-50 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                <i className="fa-solid fa-microscope mr-1"></i> {g.web.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ScientificHQ;
