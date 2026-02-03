
import React, { useState, useEffect, useContext } from 'react';
import { gradeAssistant, notebookChat } from '../services/gemini';
import { GradingResult, UserProfile, SourceDocument } from '../types';
import { ThemeContext } from '../App';

const GradingAssistant: React.FC = () => {
  const themeCtx = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState<'grading' | 'research'>('grading');
  const [subject, setSubject] = useState<string>("Psychology");
  const [assignmentType, setAssignmentType] = useState("Research Paper");
  const [rubric, setRubric] = useState("");
  const [submission, setSubmission] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [taKnowledge, setTaKnowledge] = useState<SourceDocument[]>([]);
  
  // Research state
  const [researchQuery, setResearchQuery] = useState("");
  const [researchLog, setResearchLog] = useState<{ role: 'user' | 'ai', text: string }[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('psych_assistant_user');
    if (savedUser) {
      const parsedUser: UserProfile = JSON.parse(savedUser);
      if (parsedUser.customTASubject) setSubject(parsedUser.customTASubject);
      if (parsedUser.taKnowledgeBase) setTaKnowledge(parsedUser.taKnowledgeBase);
    }
  }, []);

  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const handleGrade = async () => {
    if (!submission) return;
    setLoading(true);
    try {
      const data = await gradeAssistant(subject, assignmentType, rubric || "Class Rubric", submission, taKnowledge);
      setResult(data);
    } catch (err) {
      alert("Error grading submission.");
    } finally {
      setLoading(false);
    }
  };

  const handleResearch = async () => {
    if (!researchQuery || taKnowledge.length === 0) return;
    const q = researchQuery;
    setResearchQuery("");
    setResearchLog(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await notebookChat(q, taKnowledge);
      setResearchLog(prev => [...prev, { role: 'ai', text: res.text || "No insights found in provided sources." }]);
    } catch (err) {
      alert("Research assistance failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto text-${colors.text}`}>
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black mb-2 flex items-center">
            <i className={`fa-solid fa-graduation-cap mr-4 text-emerald-500`}></i>
            TA / RA Suite: {subject}
          </h2>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-widest ${taKnowledge.length > 0 ? `bg-emerald-600 text-white` : 'bg-gray-100 text-gray-400'}`}>
              <i className="fa-solid fa-brain mr-1.5 text-[10px]"></i>
              {taKnowledge.length} TA CONTEXT SOURCES ACTIVE
            </span>
          </div>
        </div>
      </header>

      <div className="flex bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <button 
          onClick={() => setActiveTab('grading')} 
          className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${activeTab === 'grading' ? `bg-emerald-600 text-white shadow-lg` : 'text-gray-400'}`}
        >
          <i className="fa-solid fa-check-to-slot mr-2"></i> GRADING HQ
        </button>
        <button 
          onClick={() => setActiveTab('research')} 
          className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${activeTab === 'research' ? `bg-emerald-600 text-white shadow-lg` : 'text-gray-400'}`}
        >
          <i className="fa-solid fa-microscope mr-2"></i> RESEARCH AIDE
        </button>
      </div>

      {activeTab === 'grading' ? (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-8 space-y-6 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest opacity-40 mb-2">Assignment Type</label>
              <input 
                value={assignmentType}
                onChange={(e) => setAssignmentType(e.target.value)}
                className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold text-sm outline-none"
              />
            </div>
            <div className="flex items-center">
               <div className={`p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700 leading-tight`}>
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  Nexus uses your TA Repository (slides, readings) to provide human-like feedback on student submissions.
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-widest opacity-40">Submission Text</label>
            <textarea
              className="w-full h-48 p-4 rounded-2xl bg-gray-50 border-none outline-none text-sm leading-relaxed"
              placeholder="Paste student submission..."
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
            />
          </div>

          <button
            onClick={handleGrade}
            disabled={loading || !submission}
            className={`w-full py-5 rounded-2xl bg-emerald-600 text-white font-black shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50`}
          >
            {loading ? "Analyzing Submission..." : "Grade & Feedback"}
          </button>

          {result && (
            <div className="mt-10 p-10 rounded-[3rem] bg-gray-50 border border-emerald-100 animate-in fade-in">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">Evaluation Result</h3>
                <div className={`text-3xl font-black px-6 py-2 rounded-2xl bg-white border border-emerald-200 text-emerald-600`}>
                  {result.score}
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 text-sm leading-relaxed whitespace-pre-wrap italic">
                {result.feedback}
              </div>
              <div className="mt-8 space-y-3">
                <h4 className="font-black text-xs uppercase tracking-widest opacity-40">Criteria Analysis</h4>
                {result.criteriaMet.map((c, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <i className={`fa-solid fa-circle-check text-emerald-500`}></i>
                    <span className="text-xs font-bold">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 min-h-[500px] flex flex-col animate-in fade-in slide-in-from-top-2">
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6">
            {taKnowledge.length === 0 ? (
              <div className="text-center py-20 opacity-20">
                <i className="fa-solid fa-brain text-6xl mb-4"></i>
                <p className="font-black text-sm">Add documents to your TA/RA Knowledge base in Settings to enable research assistance.</p>
              </div>
            ) : (
              researchLog.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? `bg-emerald-600 text-white` : 'bg-gray-100 text-gray-800'}`}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
            {loading && <div className="text-xs font-black opacity-30 animate-pulse">Consulting Research Assistant...</div>}
          </div>
          <div className="flex items-center space-x-4 border-t border-gray-50 pt-4">
            <input 
              className="flex-1 p-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-sm focus:ring-1 focus:ring-emerald-400"
              placeholder="Ask for research synthesis, citations, or paper drafting..."
              value={researchQuery}
              onChange={e => setResearchQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleResearch()}
            />
            <button 
              onClick={handleResearch}
              disabled={loading || taKnowledge.length === 0}
              className={`p-4 rounded-2xl bg-emerald-600 text-white shadow-lg disabled:opacity-20`}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradingAssistant;
