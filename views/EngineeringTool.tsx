
import React, { useState, useContext } from 'react';
import { solveEngineeringProblem } from '../services/gemini';
import { ThemeContext } from '../App';

const EngineeringTool: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ solution: string, finalResult: string, principles: string[], visualDescription?: string } | null>(null);

  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const handleSolve = async () => {
    if (!problem) return;
    setLoading(true);
    try {
      const data = await solveEngineeringProblem(problem);
      setResult(data);
    } catch (err) {
      alert("Error solving complex engineering problem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-6xl mx-auto pb-20 text-${colors.text}`}>
      <header className="mb-8">
        <div className="flex items-center space-x-4 mb-2">
          <div className={`p-3 rounded-2xl bg-blue-600/10 text-blue-600`}>
            <i className="fa-solid fa-microchip text-2xl"></i>
          </div>
          <h2 className="text-4xl font-black tracking-tight">Engineering HQ</h2>
        </div>
        <p className="text-blue-600 opacity-70 font-bold italic">Electrical & Mathematical Solver Terminal.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Drafting Area */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6 flex items-center">
              <i className="fa-solid fa-pen-ruler mr-2"></i> Problem Specification
            </h3>
            <textarea
              className="flex-1 w-full min-h-[300px] p-6 rounded-3xl bg-blue-50/30 border-2 border-blue-50 focus:border-blue-200 outline-none font-mono text-sm leading-relaxed"
              placeholder="e.g. Calculate the impedance of a circuit with R=10, L=5mH at 1kHz. Or solve the ODE: y'' + 5y' + 6y = sin(x)..."
              value={problem}
              onChange={e => setProblem(e.target.value)}
            />
            <button
              onClick={handleSolve}
              disabled={loading || !problem}
              className="w-full mt-6 bg-blue-600 text-white font-black py-5 rounded-3xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-atom animate-spin"></i>
                  <span>DERIVING SOLUTION...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-square-root-variable"></i>
                  <span>SOLVE TECHNICAL PROBLEM</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Console */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              {/* Final Result Card */}
              <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <i className="fa-solid fa-equals text-7xl"></i>
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Final Simplified Result</h4>
                <div className="text-3xl font-black font-mono tracking-tight bg-white/5 p-4 rounded-2xl border border-white/10">
                  {result.finalResult}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {result.principles.map((p, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[9px] font-black uppercase">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Box */}
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6">Full Derivation & Analysis</h4>
                <div className="prose prose-sm max-w-none font-medium leading-relaxed whitespace-pre-wrap">
                  {result.solution}
                </div>
              </div>

              {/* Visualization Hint */}
              {result.visualDescription && (
                <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 flex items-start space-x-4">
                  <i className="fa-solid fa-chart-area text-emerald-500 mt-1"></i>
                  <div>
                    <h5 className="text-[10px] font-black uppercase text-emerald-600">Schematic / Logic Note</h5>
                    <p className="text-xs text-emerald-800 italic">{result.visualDescription}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-50/20 border-4 border-dashed border-blue-100 rounded-[4rem] h-full min-h-[500px] flex flex-col items-center justify-center p-20 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <i className="fa-solid fa-compass-drafting text-4xl text-blue-200"></i>
              </div>
              <h3 className="text-2xl font-black text-blue-300">Terminal Ready</h3>
              <p className="text-blue-300 max-w-xs mt-2 font-bold uppercase tracking-widest text-[10px]">Awaiting electrical circuit data or mathematical scenario for processing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngineeringTool;
