
import React, { useState, useContext } from 'react';
import { businessStrategist } from '../services/gemini';
import { ThemeContext } from '../App';

const BusinessHQ: React.FC = () => {
  const [company, setCompany] = useState('');
  const [market, setMarket] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, grounding: any[] } | null>(null);
  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await businessStrategist(company, market);
      setResult(data);
    } catch (err) { alert("Error analyzing."); }
    finally { setLoading(false); }
  };

  return (
    <div className={`max-w-4xl mx-auto pb-20 text-${colors.text}`}>
      <header className="mb-8"><h2 className="text-4xl font-black">Business HQ</h2></header>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input className="p-5 rounded-2xl bg-white border border-gray-100 font-bold" placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} />
        <input className="p-5 rounded-2xl bg-white border border-gray-100 font-bold" placeholder="Market Sector" value={market} onChange={e => setMarket(e.target.value)} />
      </div>
      <button onClick={handleAnalyze} disabled={loading} className={`w-full bg-slate-800 text-white font-black py-4 rounded-2xl mb-10`}>
        {loading ? "STRATEGIZING..." : "GENERATE MARKET SWOT"}
      </button>
      {result && (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.text}</p>
          <div className="mt-8 pt-8 border-t flex flex-wrap gap-2">
            {result.grounding.map((g, i) => g.web && (
              <a key={i} href={g.web.uri} target="_blank" className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-600 uppercase">
                <i className="fa-solid fa-globe mr-1"></i> {g.web.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default BusinessHQ;
