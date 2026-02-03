
import React, { useState, useContext } from 'react';
import { creativeDirector } from '../services/gemini';
import { ThemeContext } from '../App';

const CreativeHQ: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ image: string, brief: string } | null>(null);
  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const handleDraft = async () => {
    setLoading(true);
    try {
      const data = await creativeDirector(prompt);
      setResult(data);
    } catch (err) { alert("Error creating brief."); }
    finally { setLoading(false); }
  };

  return (
    <div className={`max-w-6xl mx-auto pb-20 text-${colors.text}`}>
      <header className="mb-8"><h2 className="text-4xl font-black">Creative HQ</h2></header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm">
          <textarea className="w-full h-48 p-6 rounded-2xl bg-pink-50/20 border-none outline-none font-bold text-sm mb-4" placeholder="Brand name, vibe, product..." value={prompt} onChange={e => setPrompt(e.target.value)} />
          <button onClick={handleDraft} disabled={loading} className={`w-full bg-${colors.primary} text-white font-black py-4 rounded-2xl shadow-xl`}>
            {loading ? "GENERATING VIBE..." : "GENERATE MOODBOARD"}
          </button>
        </div>
        <div className="space-y-6">
          {result ? (
            <>
              <img src={result.image} className="w-full rounded-[2rem] shadow-xl" />
              <div className="bg-white p-8 rounded-[3rem] shadow-sm text-sm leading-relaxed whitespace-pre-wrap">{result.brief}</div>
            </>
          ) : (
            <div className="h-full bg-gray-50 border-4 border-dashed rounded-[3rem] flex items-center justify-center text-gray-200">
              <i className="fa-solid fa-palette text-9xl"></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CreativeHQ;
