
import React, { useState, useContext } from 'react';
import { legalResearcher } from '../services/gemini';
import { ThemeContext } from '../App';

const LegalHQ: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, grounding: any[] } | null>(null);
  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await legalResearcher(query);
      setResult(data);
    } catch (err) { alert("Error researching."); }
    finally { setLoading(false); }
  };

  return (
    <div className={`max-w-4xl mx-auto pb-20 text-${colors.text}`}>
      <header className="mb-8"><h2 className="text-4xl font-black">Legal HQ</h2></header>
      <div className="bg-white p-8 rounded-[3rem] shadow-sm mb-10">
        <textarea className="w-full p-6 rounded-2xl bg-gray-50 border-none outline-none font-bold text-sm mb-4" placeholder="Enter legal question or statute..." value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={handleSearch} disabled={loading} className={`w-full bg-${colors.primary} text-white font-black py-4 rounded-2xl shadow-xl`}>
          {loading ? "RESEARCHING..." : "ANALYZE PRECEDENT"}
        </button>
      </div>
      {result && (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.text}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {result.grounding.map((g, i) => g.web && (
              <a key={i} href={g.web.uri} target="_blank" className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">
                <i className="fa-solid fa-link mr-1"></i> {g.web.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default LegalHQ;
