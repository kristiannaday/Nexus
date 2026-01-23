
import React, { useState, useEffect, useContext } from 'react';
import { gradeAssistant } from '../services/gemini';
import { GradingResult, UserProfile, SourceDocument } from '../types';
import { ThemeContext } from '../App';

const GradingAssistant: React.FC = () => {
  const themeCtx = useContext(ThemeContext);
  const [subject, setSubject] = useState<string>("Psychology");
  const [assignmentType, setAssignmentType] = useState("Research Paper");
  const [rubric, setRubric] = useState("");
  const [submission, setSubmission] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [taKnowledge, setTaKnowledge] = useState<SourceDocument[]>([]);

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

  return (
    <div className={`max-w-4xl mx-auto text-${colors.text}`}>
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black mb-2 flex items-center">
            <i className={`fa-solid fa-graduation-cap mr-4 text-${colors.primary}`}></i>
            Grading HQ: {subject}
          </h2>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-widest ${taKnowledge.length > 0 ? `bg-${colors.primary} text-white` : 'bg-gray-100 text-gray-400'}`}>
              <i className="fa-solid fa-brain mr-1.5 text-[10px]"></i>
              {taKnowledge.length} SOURCES ACTIVE
            </span>
            <p className="opacity-60 text-[10px] font-black uppercase tracking-widest">
              Context remembered from Settings
            </p>
          </div>
        </div>
      </header>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest opacity-40 mb-2">Assignment Type</label>
            <input 
              value={assignmentType}
              onChange={(e) => setAssignmentType(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold text-sm focus:ring-1 focus:ring-pink-400 outline-none"
            />
          </div>
          <div className="flex items-center">
             <div className={`p-4 rounded-2xl bg-${colors.primary}/5 border border-${colors.primary}/10 text-[10px] font-bold text-${colors.primary} leading-tight`}>
                <i className="fa-solid fa-info-circle mr-2"></i>
                Nexus automatically applies your saved rubrics and slides from Settings to ensure consistent grading.
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-black uppercase tracking-widest opacity-40">Submission Text</label>
          <textarea
            className="w-full h-48 p-4 rounded-2xl bg-gray-50 border-none outline-none text-sm leading-relaxed"
            placeholder="Paste the student's work here..."
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
          />
        </div>

        <button
          onClick={handleGrade}
          disabled={loading || !submission}
          className={`w-full py-5 rounded-2xl bg-${colors.primary} text-white font-black shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50`}
        >
          {loading ? "Analyzing Context..." : "Grade Submission"}
        </button>
      </div>

      {result && (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black">Evaluation Result</h3>
            <div className={`text-3xl font-black px-6 py-2 rounded-2xl bg-${colors.primary}/10 text-${colors.primary}`}>
              {result.score}
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-sm leading-relaxed whitespace-pre-wrap italic">
            {result.feedback}
          </div>
          <div className="mt-8 space-y-3">
            <h4 className="font-black text-xs uppercase tracking-widest opacity-40">Criteria Analysis</h4>
            {result.criteriaMet.map((c, i) => (
              <div key={i} className="flex items-center space-x-3">
                <i className={`fa-solid fa-circle-check text-${colors.primary}`}></i>
                <span className="text-xs font-bold">{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradingAssistant;
