
import React, { useState, useContext } from 'react';
import { analyzeAccountingTransaction, draftFinancialStatements, lookupGAAPRule, auditTransaction } from '../services/gemini';
import { ThemeContext } from '../App';

interface JournalEntry {
  account: string;
  type: 'Debit' | 'Credit';
  amount: string;
  reason?: string;
}

interface StatementLine {
  item: string;
  amount: number;
  category?: string;
  type?: string;
}

interface FinancialRatio {
  name: string;
  value: string;
  interpretation: string;
}

const AccountingTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'statements' | 'rules' | 'audit'>('analyzer');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Results State
  const [analysis, setAnalysis] = useState<{ analysis: string, financialImpact: string, entries: JournalEntry[] } | null>(null);
  const [statements, setStatements] = useState<{ incomeStatement: StatementLine[], balanceSheet: StatementLine[], summary: string, ratios: FinancialRatio[], healthScore: number } | null>(null);
  const [ruleResult, setRuleResult] = useState<{ text: string, grounding: any[] } | null>(null);
  const [auditResult, setAuditResult] = useState<{ analysis: string, riskLevel: 'Low' | 'Medium' | 'High', warnings: string[], correctEntry: JournalEntry[] } | null>(null);

  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;
  const { colors, theme } = themeCtx;

  const handleAction = async () => {
    if (!inputText) return;
    setLoading(true);
    try {
      if (activeTab === 'analyzer') {
        const result = await analyzeAccountingTransaction(inputText);
        setAnalysis(result);
      } else if (activeTab === 'statements') {
        const result = await draftFinancialStatements(inputText);
        setStatements(result);
      } else if (activeTab === 'rules') {
        const result = await lookupGAAPRule(inputText);
        setRuleResult(result);
      } else if (activeTab === 'audit') {
        const result = await auditTransaction(inputText);
        setAuditResult(result);
      }
    } catch (err) {
      alert("Error processing financial intelligence request.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    if (level === 'High') return 'text-rose-500 bg-rose-50';
    if (level === 'Medium') return 'text-amber-500 bg-amber-50';
    return 'text-emerald-500 bg-emerald-50';
  };

  return (
    <div className={`max-w-6xl mx-auto pb-20 text-${colors.text}`}>
      <header className="mb-8">
        <div className="flex items-center space-x-4 mb-2">
          <div className={`p-3 rounded-2xl bg-${colors.primary}/10 text-${colors.primary}`}>
            <i className="fa-solid fa-chart-line text-2xl"></i>
          </div>
          <h2 className="text-4xl font-black tracking-tight">Accounting Pro HQ</h2>
        </div>
        <p className={`text-${colors.primary} opacity-70 font-bold italic`}>Advanced Financial Intelligence & GAAP Terminal.</p>
      </header>

      {/* Primary Navigation Tabs */}
      <div className="flex bg-white/80 backdrop-blur-xl p-2 rounded-[2rem] shadow-sm border border-gray-100 mb-10 sticky top-4 z-10 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => { setActiveTab('analyzer'); setInputText(''); }}
          className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black text-[10px] transition-all ${activeTab === 'analyzer' ? `bg-${colors.primary} text-white shadow-lg` : 'text-gray-400 hover:text-gray-600'}`}
        >
          <i className="fa-solid fa-calculator mr-2"></i> ANALYZER
        </button>
        <button 
          onClick={() => { setActiveTab('statements'); setInputText(''); }}
          className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black text-[10px] transition-all ${activeTab === 'statements' ? `bg-${colors.primary} text-white shadow-lg` : 'text-gray-400 hover:text-gray-600'}`}
        >
          <i className="fa-solid fa-file-invoice mr-2"></i> DRAFTER
        </button>
        <button 
          onClick={() => { setActiveTab('audit'); setInputText(''); }}
          className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black text-[10px] transition-all ${activeTab === 'audit' ? `bg-${colors.primary} text-white shadow-lg` : 'text-gray-400 hover:text-gray-600'}`}
        >
          <i className="fa-solid fa-shield-halved mr-2"></i> AI AUDIT
        </button>
        <button 
          onClick={() => { setActiveTab('rules'); setInputText(''); }}
          className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black text-[10px] transition-all ${activeTab === 'rules' ? `bg-${colors.primary} text-white shadow-lg` : 'text-gray-400 hover:text-gray-600'}`}
        >
          <i className="fa-solid fa-scale-balanced mr-2"></i> RESEARCH
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Terminal */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 flex items-center">
              <i className="fa-solid fa-terminal mr-2"></i> Financial Parameters
            </h3>
            <textarea
              className={`w-full h-48 p-5 rounded-2xl bg-gray-50 border-none outline-none font-bold text-sm focus:ring-2 focus:ring-${colors.primary} transition-all`}
              placeholder={
                activeTab === 'analyzer' ? "Sold inventory for $5k cash..." : 
                activeTab === 'statements' ? "Enter list of account balances..." : 
                activeTab === 'audit' ? "Describe the transaction you want audited..." :
                "Enter a GAAP rule or standard..."
              }
              value={inputText}
              onChange={e => setInputText(e.target.value)}
            />
            <button
              onClick={handleAction}
              disabled={loading || !inputText}
              className={`w-full mt-4 bg-${colors.primary} text-white font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center space-x-2`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-dna animate-spin"></i>
                  <span>ANALYZING...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt"></i>
                  <span>EXECUTE TERMINAL</span>
                </>
              )}
            </button>
          </div>

          {/* KPI Dashboard */}
          {statements && (
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6">Financial Health Index</h3>
              <div className="flex items-center space-x-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * (statements.healthScore || 0) / 100)} className="text-emerald-400" />
                  </svg>
                  <span className="absolute font-black text-2xl">{statements.healthScore}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase opacity-40">AI Verdict</p>
                  <p className="text-xs font-bold leading-tight">{statements.healthScore > 70 ? 'Strong Solvency' : 'Caution Advised'}</p>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                {statements.ratios.map((r, i) => (
                  <div key={i} className="flex justify-between items-center border-t border-white/10 pt-4">
                    <span className="text-[9px] font-black uppercase opacity-40">{r.name}</span>
                    <span className="font-black text-emerald-400">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Results Viewer */}
        <div className="lg:col-span-8">
          {activeTab === 'analyzer' && analysis && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                <h4 className={`text-xs font-black uppercase tracking-widest text-${colors.primary} mb-4`}>Transaction Impact Analysis</h4>
                <p className="text-sm font-medium leading-relaxed opacity-80">{analysis.analysis}</p>
                <div className="mt-6 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                   <span className="text-[10px] font-black uppercase opacity-40 mb-2 block">Ledger Flow Explanation</span>
                   <p className="text-xs italic">{analysis.financialImpact}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.entries.map((entry, idx) => (
                  <div key={idx} className="bg-white rounded-[2rem] border-2 border-gray-50 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className={`p-2 text-center text-[9px] font-black uppercase tracking-widest text-white ${entry.type === 'Debit' ? `bg-${colors.primary}` : 'bg-slate-800'}`}>
                      {entry.type}
                    </div>
                    <div className="p-6">
                      <div className="font-black text-lg">{entry.account}</div>
                      <div className={`text-2xl font-black mt-2 ${entry.type === 'Debit' ? `text-${colors.primary}` : 'text-slate-800'}`}>
                        ${entry.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && auditResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className={`bg-white p-8 rounded-[3rem] shadow-sm border-t-8 border-gray-100 overflow-hidden relative`}>
                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest ${getRiskColor(auditResult.riskLevel)}`}>
                  Risk: {auditResult.riskLevel}
                </div>
                <h4 className="text-xl font-black mb-4">Audit Intelligence Findings</h4>
                <p className="text-sm font-medium leading-relaxed mb-6">{auditResult.analysis}</p>
                
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40">System Warnings</h5>
                  {auditResult.warnings.map((w, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold">
                      <i className="fa-solid fa-triangle-exclamation mt-0.5"></i>
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Recommended Adjustment</h5>
                <div className="space-y-2">
                  {auditResult.correctEntry.map((e, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase opacity-40">{e.type}</span>
                        <span className="font-black">{e.account}</span>
                      </div>
                      <span className="font-black text-lg">${e.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'statements' && statements && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="bg-white p-10 rounded-[4rem] shadow-2xl border border-gray-100 relative overflow-hidden">
                <div className="text-center mb-10 border-b border-gray-100 pb-10">
                  <h3 className="text-3xl font-black tracking-tighter">FINANCIAL STATEMENTS</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">PROJECTION & ANALYSIS REPORT</p>
                </div>

                <div className="space-y-12">
                  <section>
                    <h4 className={`text-xs font-black uppercase tracking-widest text-${colors.primary} mb-4 border-b pb-1`}>Income Statement</h4>
                    <div className="space-y-2">
                      {statements.incomeStatement.map((line, idx) => (
                        <div key={idx} className={`flex justify-between text-sm py-1 ${line.category === 'Net' ? 'font-black border-t-2 border-gray-900 pt-2 mt-2' : ''}`}>
                          <span className={line.category === 'Net' ? '' : 'opacity-60 font-bold'}>{line.item}</span>
                          <span className="font-black">${line.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className={`text-xs font-black uppercase tracking-widest text-${colors.primary} mb-4 border-b pb-1`}>Balance Sheet Overview</h4>
                    <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black opacity-30 uppercase">Assets</p>
                        {statements.balanceSheet.filter(l => l.type === 'Asset').map((line, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="font-bold">{line.item}</span>
                            <span className="font-black">${line.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black opacity-30 uppercase">Liabilities & Equity</p>
                        {statements.balanceSheet.filter(l => l.type !== 'Asset').map((line, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="font-bold">{line.item}</span>
                            <span className="font-black">${line.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
                
                <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-gray-100 text-xs italic opacity-60 leading-relaxed">
                  {statements.summary}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && ruleResult && (
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 mb-6">
                <i className={`fa-solid fa-earth-americas text-${colors.primary}`}></i>
                <h4 className="text-xl font-black">GAAP Research Grounding</h4>
              </div>
              <div className="prose prose-sm max-w-none text-sm leading-relaxed font-medium opacity-80 whitespace-pre-wrap">
                {ruleResult.text}
              </div>
              {ruleResult.grounding && ruleResult.grounding.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-50 flex flex-wrap gap-2">
                  {ruleResult.grounding.map((chunk, idx) => chunk.web && (
                    <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[9px] font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                      <i className="fa-solid fa-link mr-1"></i> {chunk.web.title || 'Official Standard'}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Terminal Waiting State */}
          {!analysis && !statements && !ruleResult && !auditResult && !loading && (
            <div className="bg-white/40 border-4 border-dashed border-gray-200 rounded-[4rem] h-full min-h-[500px] flex flex-col items-center justify-center p-20 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-microchip text-4xl text-gray-300"></i>
              </div>
              <h3 className="text-2xl font-black text-gray-300">Terminal Awaiting Input</h3>
              <p className="text-gray-300 max-w-xs mt-2 font-bold uppercase tracking-widest text-[10px]">Provide financial data for real-time AI processing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountingTool;
