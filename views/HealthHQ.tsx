
import React, { useState, useContext } from 'react';
import { generateAnatomyDictionaryEntry } from '../services/gemini';
import { ThemeContext } from '../App';

const HealthHQ: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ image: string, details: any } | null>(null);

  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await generateAnatomyDictionaryEntry(query);
      setResult(data);
    } catch (err) {
      alert("Error generating anatomical profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-6xl mx-auto pb-20 text-${colors.text}`}>
      <header className="mb-8">
        <div className="flex items-center space-x-4 mb-2">
          <div className={`p-3 rounded-2xl bg-teal-600/10 text-teal-600`}>
            <i className="fa-solid fa-dna text-2xl"></i>
          </div>
          <h2 className="text-4xl font-black tracking-tight">Anatomy HQ</h2>
        </div>
        <p className="text-teal-600 opacity-70 font-bold italic">Clinical Reference & Anatomical Visualizer.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Terminal Input */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-gray-100 sticky top-10">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6 flex items-center">
              <i className="fa-solid fa-magnifying-glass mr-2"></i> Clinical Search
            </h3>
            <input
              type="text"
              className="w-full p-5 rounded-2xl bg-teal-50/30 border-2 border-teal-50 focus:border-teal-200 outline-none font-bold text-sm mb-4"
              placeholder="e.g. Left Ventricle, Femur..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query}
              className="w-full bg-teal-600 text-white font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-microscope animate-spin"></i>
                  <span>VISUALIZING...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-dna"></i>
                  <span>LOOKUP STRUCTURE</span>
                </>
              )}
            </button>
            <div className="mt-8 p-6 rounded-3xl bg-gray-50 border border-gray-100">
               <h4 className="text-[9px] font-black opacity-30 uppercase mb-4 tracking-widest">Medical Context</h4>
               <p className="text-xs font-medium leading-relaxed italic opacity-60">Nexus uses Gemini 3 Pro Vision to generate clinical-grade illustrations and verify anatomical accuracy.</p>
            </div>
          </div>
        </div>

        {/* Output Console */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="bg-white rounded-[4rem] overflow-hidden shadow-2xl border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-4 bg-gray-100 flex items-center justify-center min-h-[400px]">
                    <img src={result.image} alt={result.details.name} className="max-w-full rounded-3xl shadow-lg border border-white" />
                  </div>
                  <div className="p-10 flex flex-col justify-center">
                    <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">Structure Classified</span>
                    <h4 className="text-4xl font-black mb-4 tracking-tight">{result.details.name}</h4>
                    <p className="text-sm font-medium leading-relaxed opacity-70 mb-6">{result.details.definition}</p>
                    <div className="flex flex-wrap gap-2">
                      {result.details.pathologies.map((p: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                  <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Physiological Function</h5>
                  <p className="text-sm font-bold leading-relaxed">{result.details.function}</p>
                </div>
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                  <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Anatomical Location</h5>
                  <p className="text-sm font-bold leading-relaxed">{result.details.location}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-teal-50/20 border-4 border-dashed border-teal-100 rounded-[4rem] h-full min-h-[600px] flex flex-col items-center justify-center p-20 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <i className="fa-solid fa-bone text-4xl text-teal-200"></i>
              </div>
              <h3 className="text-2xl font-black text-teal-300">Atlas Ready</h3>
              <p className="text-teal-300 max-w-xs mt-2 font-bold uppercase tracking-widest text-[10px]">Awaiting anatomical structure for clinical visualization and dictionary profile generation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthHQ;
