
import React, { useState, useContext } from 'react';
import { analyzeAccountingTransaction } from '../services/gemini';
import { ThemeContext } from '../App';

interface JournalEntry {
  account: string;
  type: 'Debit' | 'Credit';
  amount: string;
  reason: string;
}

const AccountingTool: React.FC = () => {
  const [transaction, setTransaction] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ analysis: string, entries: JournalEntry[] } | null>(null);
  const themeCtx = useContext(ThemeContext);

  if (!themeCtx) return null;
  const { colors, theme } = themeCtx;

  const handleAnalyze = async () => {
    if (!transaction) return;
    setLoading(true);
    try {
      const result = await analyzeAccountingTransaction(transaction);
      setAnalysis(result);
    } catch (err) {
      alert("Error analyzing transaction.");
    } finally {
      setLoading(false);
    }
  };

  const accentColor = colors.primary.split('-')[0];

  return (
    <div className={`max-w-5xl mx-auto pb-20 text-${colors.text}`}>
      <header className="mb-8">
        <h2 className="text-3xl font-black mb-2 tracking-tight">Accounting Study Suite</h2>
        <p className={`text-${colors.primary} opacity-70 font-medium`}>Master double-entry bookkeeping and financial logic.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className={`font-bold text-${colors.primary} mb-4 flex items-center`}>
              <i className="fa-solid fa-magnifying-glass-chart mr-2"></i>
              Entry Analyzer
            </h3>
            <textarea
              className={`w-full h-32 p-4 rounded-2xl border border-${accentColor}-50 bg-${accentColor}-50/10 focus:ring-2 focus:ring-${colors.primary} outline-none text-sm`}
              placeholder="Describe a transaction (e.g., Sold services for $1000 on account...)"
              value={transaction}
              onChange={e => setTransaction(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !transaction}
              className={`w-full mt-4 bg-${colors.primary} text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 transition-all`}
            >
              {loading ? "Analyzing GAAP..." : "Analyze Entry"}
            </button>
          </div>

          <div className={`bg-${colors.text.split('-')[0]}-900 p-6 rounded-3xl text-white shadow-xl`}>
            <h3 className="font-bold mb-4 flex items-center opacity-80">
              <i className="fa-solid fa-balance-scale mr-2"></i>
              The Equation
            </h3>
            <div className="flex justify-between items-center text-center">
              <div>
                <div className="text-2xl font-black">A</div>
                <div className="text-[10px] opacity-60 uppercase font-bold">Assets</div>
              </div>
              <div className={`text-xl font-bold text-${accentColor}-400`}>=</div>
              <div>
                <div className="text-2xl font-black">L</div>
                <div className="text-[10px] opacity-60 uppercase font-bold">Liabilities</div>
              </div>
              <div className={`text-xl font-bold text-${accentColor}-400`}>+</div>
              <div>
                <div className="text-2xl font-black">E</div>
                <div className="text-[10px] opacity-60 uppercase font-bold">Equity</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {analysis ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h4 className={`font-bold text-${colors.primary} mb-2`}>Rule Application</h4>
                <p className="opacity-80 text-sm leading-relaxed">{analysis.analysis}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.entries.map((entry, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border-2 border-gray-50 overflow-hidden shadow-sm">
                    <div className={`p-2 text-center text-[10px] font-black uppercase tracking-widest text-white ${entry.type === 'Debit' ? `bg-${colors.primary}` : 'bg-gray-800'}`}>
                      {entry.type}
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-black">{entry.account}</div>
                        <div className="text-[10px] opacity-40 max-w-[140px] leading-tight mt-1">{entry.reason}</div>
                      </div>
                      <div className={`text-xl font-black ${entry.type === 'Debit' ? `text-${colors.primary}` : 'text-gray-800'}`}>
                        ${entry.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white/40 border-2 border-dashed border-gray-200 rounded-[3rem] h-full flex flex-col items-center justify-center p-12 text-center text-gray-300">
              <i className="fa-solid fa-file-invoice text-6xl mb-4 opacity-50"></i>
              <p className="text-lg font-bold">Analyze a transaction to visualize the journal entry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountingTool;
