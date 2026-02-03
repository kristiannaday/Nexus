
import React, { useState, useContext } from 'react';
import { marketingStrategist } from '../services/gemini';
import { ThemeContext } from '../App';

const MarketingHQ: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, grounding: any[] } | null>(null);
  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const handleStrategy = async () => {
    setLoading(true);
    try {
      const data = await marketingStrategist(query);
      setResult(data);
    } catch (err) { alert("Error developing strategy."); }
    finally { setLoading(false); }
  };

  return (
    <div className={`max-w-4xl mx-auto pb-20 text-${colors.text}`}>
      <header className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
            <i className="fa-solid fa-bullhorn text-2xl"></i>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Marketing Strategy HQ</h2>
        </div>
      </header>
      <div className="bg-white p-8 rounded-[3rem] shadow-sm mb-10">
        <textarea className="w-full h-32 p-6 rounded-2xl bg-gray-50 border-none outline-none font-bold text-sm mb-4" placeholder="Describe product, target audience, or campaign goal..." value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={handleStrategy} disabled={loading} className={`w-full bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl transition-all hover:scale-[1.01]`}>
          {loading ? "DEVELOPING STRATEGY..." : "GENERATE STRATEGY"}
        </button>
      </div>
      {result && (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.text}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {result.grounding.map((g, i) => g.web && (
              <a key={i} href={g.web.uri} target="_blank" className="px-3 py-1 bg-orange-50 rounded-full text-[10px] font-black text-orange-700 uppercase tracking-widest">
                <i className="fa-solid fa-chart-line mr-1"></i> {g.web.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default MarketingHQ;
