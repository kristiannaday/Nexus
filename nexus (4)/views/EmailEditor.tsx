
import React, { useState, useContext } from 'react';
import { generateEmail } from '../services/gemini';
import { ThemeContext } from '../App';

interface EmailVariation {
  label: string;
  subject: string;
  body: string;
}

const EmailEditor: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<EmailVariation[]>([]);
  const themeCtx = useContext(ThemeContext);

  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const handleGenerate = async () => {
    if (!goal) return;
    setLoading(true);
    try {
      const data = await generateEmail(goal, context);
      setResults(data.variations);
    } catch (err) {
      alert("Error generating emails.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto pb-12 text-${colors.text}`}>
      <header className="mb-8">
        <h2 className="text-3xl font-black mb-2 flex items-center">
          <i className="fa-solid fa-envelope-open-text mr-4 opacity-40"></i>
          Nexus Email Editor
        </h2>
        <p className="opacity-60 font-bold uppercase tracking-widest text-xs">AI Assisted Drafting</p>
      </header>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-white mb-10 space-y-6">
        <div className="space-y-4">
          <label className="block text-xs font-black uppercase tracking-widest opacity-40">What is the goal of this email?</label>
          <input 
            className="w-full p-5 rounded-2xl bg-gray-50 border border-transparent focus:border-pink-200 outline-none text-pink-900 font-bold"
            placeholder="e.g., Ask for a meeting, follow up on a job, request info..."
            value={goal}
            onChange={e => setGoal(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <label className="block text-xs font-black uppercase tracking-widest opacity-40">Any specific context or people?</label>
          <textarea 
            className="w-full h-32 p-5 rounded-2xl bg-gray-50 border border-transparent focus:border-pink-200 outline-none text-pink-900 text-sm"
            placeholder="e.g., Mention I enjoyed the lecture on double-entry bookkeeping..."
            value={context}
            onChange={e => setContext(e.target.value)}
          />
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading || !goal}
          className={`w-full py-5 rounded-2xl bg-${colors.primary} text-white font-black shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50`}
        >
          {loading ? "Generating Drafts..." : "Draft Email"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((v, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-white flex flex-col h-full">
            <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-full bg-gray-100 text-gray-500 w-fit`}>
              {v.label}
            </span>
            <h4 className="font-black text-sm mb-3">Sub: {v.subject}</h4>
            <p className="text-xs opacity-70 leading-relaxed whitespace-pre-wrap flex-1 italic">{v.body}</p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(v.body);
                alert("Copied to clipboard!");
              }}
              className="mt-6 text-[10px] font-black uppercase text-pink-500 hover:text-pink-600"
            >
              Copy Body
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailEditor;
