
import React, { useState, useContext } from 'react';
import { draftDocument } from '../services/gemini';
import { ThemeContext } from '../App';

const DocDrafter: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('Report');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; summary: string; outline: string[] } | null>(null);
  const themeCtx = useContext(ThemeContext);

  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const handleDraft = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const data = await draftDocument(topic, "General/Professional", type);
      setResult(data);
    } catch (err) {
      alert("Error drafting document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto pb-12 text-${colors.text}`}>
      <header className="mb-8">
        <h2 className="text-3xl font-black mb-2 flex items-center">
          <i className="fa-solid fa-file-signature mr-4 opacity-40"></i>
          Doc Drafter
        </h2>
        <p className="opacity-60 font-bold uppercase tracking-widest text-xs">Structure Your Thoughts</p>
      </header>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-white mb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-widest opacity-40">Document Type</label>
            <select 
              className="w-full p-5 rounded-2xl bg-gray-50 border-none font-bold text-pink-900 outline-none"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option>Report</option>
              <option>Proposal</option>
              <option>Essay</option>
              <option>Memorandum</option>
              <option>Research Abstract</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-widest opacity-40">Document Topic</label>
            <input 
              className="w-full p-5 rounded-2xl bg-gray-50 border-none font-bold text-pink-900 outline-none"
              placeholder="e.g., Q3 Budget Analysis, TA Feedback Rubric..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
          </div>
        </div>
        <button 
          onClick={handleDraft}
          disabled={loading || !topic}
          className={`w-full py-5 rounded-2xl bg-${colors.primary} text-white font-black shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50`}
        >
          {loading ? "Structuring..." : "Create Outline"}
        </button>
      </div>

      {result && (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-white animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-2xl font-black mb-4">{result.title}</h3>
          <div className="p-6 bg-pink-50/50 rounded-2xl border-l-4 border-pink-500 mb-8 italic text-sm leading-relaxed">
            {result.summary}
          </div>
          <div className="space-y-4">
            {result.outline.map((step, i) => (
              <div key={i} className="flex items-start space-x-4">
                <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-black text-xs shrink-0">
                  {i + 1}
                </span>
                <p className="pt-1 font-bold opacity-80">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocDrafter;
