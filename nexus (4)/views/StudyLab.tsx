
import React, { useState, useContext, useEffect } from 'react';
import { notebookChat, summarizeAndNotes } from '../services/gemini';
import { Note, SourceDocument } from '../types';
import { ThemeContext } from '../App';

const StudyLab: React.FC = () => {
  const themeCtx = useContext(ThemeContext);
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'sources' | 'chat' | 'kit'>('sources');
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [chatQuery, setChatQuery] = useState("");
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'ai', text: string, grounding?: any[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentKit, setCurrentKit] = useState<Partial<Note> | null>(null);

  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const addSource = () => {
    if (!newContent) return;
    const doc: SourceDocument = {
      id: Date.now().toString(),
      title: newTitle || `Untitled Source ${sources.length + 1}`,
      content: newContent
    };
    setSources([...sources, doc]);
    setNewTitle("");
    setNewContent("");
  };

  const handleChat = async () => {
    if (!chatQuery || sources.length === 0) return;
    const q = chatQuery;
    setChatQuery("");
    setChatLog(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await notebookChat(q, sources);
      setChatLog(prev => [...prev, { role: 'ai', text: res.text || "No response", grounding: res.grounding }]);
    } catch (err) {
      alert("Error generating response.");
    } finally {
      setLoading(false);
    }
  };

  const generateKitFromSources = async () => {
    if (sources.length === 0) return;
    setLoading(true);
    try {
      const combinedText = sources.map(s => s.content).join("\n\n");
      const kit = await summarizeAndNotes(combinedText);
      setCurrentKit(kit);
      setActiveTab('kit');
    } catch (err) {
      alert("Error creating study kit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-6xl mx-auto pb-12 text-${colors.text}`}>
      <header className="mb-8">
        <h2 className="text-4xl font-black mb-2 flex items-center">
          <i className={`fa-solid fa-brain mr-4 text-${colors.primary}`}></i>
          Academic Suite
        </h2>
        <p className="opacity-60 font-bold uppercase tracking-widest text-xs">Enhanced NotebookLM + Web Verification</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Source Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 h-fit">
            <h3 className="font-black text-sm uppercase tracking-widest mb-4 opacity-40">Add Knowledge Source</h3>
            <input 
              placeholder="Source Title (e.g., Lecture 4)" 
              className={`w-full p-3 rounded-xl bg-gray-50 border-none outline-none text-sm mb-3 focus:ring-1 focus:ring-${colors.primary}`}
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <textarea 
              placeholder="Paste content here..."
              className={`w-full h-32 p-3 rounded-xl bg-gray-50 border-none outline-none text-sm focus:ring-1 focus:ring-${colors.primary}`}
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
            />
            <button 
              onClick={addSource}
              className={`w-full mt-4 py-3 rounded-xl bg-${colors.primary} text-white font-black text-xs hover:opacity-90 transition-all`}
            >
              Add Source
            </button>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="font-black text-sm uppercase tracking-widest mb-4 opacity-40">Active Sources ({sources.length})</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {sources.map(s => (
                <div key={s.id} className={`p-3 rounded-xl bg-${colors.primary}/5 border border-${colors.primary}/10 flex items-center justify-between`}>
                  <div className="flex items-center space-x-3">
                    <i className={`fa-solid fa-file-lines text-${colors.primary}`}></i>
                    <span className="text-xs font-bold truncate max-w-[120px]">{s.title}</span>
                  </div>
                  <button onClick={() => setSources(sources.filter(x => x.id !== s.id))} className="text-rose-400 hover:text-rose-600">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
              {sources.length === 0 && <p className="text-[10px] text-gray-400 italic">No sources added yet.</p>}
            </div>
            {sources.length > 0 && (
              <button 
                onClick={generateKitFromSources}
                className={`w-full mt-6 py-3 rounded-xl border-2 border-${colors.primary} text-${colors.primary} font-black text-xs hover:bg-${colors.primary} hover:text-white transition-all`}
              >
                Synthesize All Sources
              </button>
            )}
          </div>
        </div>

        {/* Main Interaction Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-gray-100 shadow-sm">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${activeTab === 'chat' ? `bg-${colors.primary} text-white shadow-md` : 'text-gray-400'}`}
            >
              Interactive Chat
            </button>
            <button 
              onClick={() => setActiveTab('kit')}
              className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${activeTab === 'kit' ? `bg-${colors.primary} text-white shadow-md` : 'text-gray-400'}`}
            >
              Study Kit (Flashcards)
            </button>
          </div>

          <div className="bg-white min-h-[500px] rounded-[3rem] shadow-sm border border-gray-100 p-8">
            {activeTab === 'chat' ? (
              <div className="flex flex-col h-full space-y-6">
                <div className="flex-1 overflow-y-auto space-y-6 pr-2 max-h-[500px]">
                  {chatLog.length === 0 && (
                    <div className="text-center py-20 opacity-20">
                      <i className="fa-solid fa-comments text-6xl mb-4"></i>
                      <p className="font-black text-sm">Select sources and ask a question.<br/>Gemini will verify your notes against the web.</p>
                    </div>
                  )}
                  {chatLog.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? `bg-${colors.primary} text-white` : 'bg-gray-100 text-gray-800'}`}>
                        {m.text.split('CONTEXT CONFLICT').map((part, idx) => {
                          if (idx > 0) {
                            return (
                              <div key={idx} className="mt-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl text-amber-900 font-bold">
                                <div className="flex items-center space-x-2 mb-1">
                                  <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                                  <span className="uppercase tracking-widest text-[10px]">Context Conflict Detected</span>
                                </div>
                                CONTEXT CONFLICT {part}
                              </div>
                            );
                          }
                          return part;
                        })}
                      </div>
                      {m.grounding && m.grounding.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.grounding.map((chunk, cIdx) => chunk.web && (
                            <a 
                              key={cIdx} 
                              href={chunk.web.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] bg-white border border-gray-100 px-3 py-1 rounded-full text-blue-500 font-bold hover:bg-blue-50 transition-colors"
                            >
                              <i className="fa-solid fa-link mr-1"></i>
                              {chunk.web.title || "Web Source"}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && <div className="animate-pulse text-xs font-black opacity-30 flex items-center space-x-2">
                    <i className="fa-solid fa-globe animate-spin"></i>
                    <span>Gemini is checking the web...</span>
                  </div>}
                </div>
                <div className="pt-4 border-t border-gray-50 flex items-center space-x-4">
                  <input 
                    className={`flex-1 p-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-sm focus:ring-1 focus:ring-${colors.primary}`}
                    placeholder="Ask about your sources..."
                    value={chatQuery}
                    onChange={e => setChatQuery(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleChat()}
                  />
                  <button 
                    onClick={handleChat}
                    className={`p-4 rounded-2xl bg-${colors.primary} text-white shadow-lg`}
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in">
                {!currentKit ? (
                  <div className="text-center py-20 opacity-20">
                    <i className="fa-solid fa-vial text-6xl mb-4"></i>
                    <p className="font-black text-sm">Synthesize sources to generate study tools.</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h4 className="font-black text-lg flex items-center">
                        <i className={`fa-solid fa-quote-left mr-3 text-${colors.primary} opacity-30`}></i>
                        Summary
                      </h4>
                      <div className={`p-6 rounded-3xl bg-${colors.primary}/5 border-l-4 border-${colors.primary} italic text-sm leading-relaxed`}>
                        {currentKit.summary}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-black text-lg">Flashcards</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentKit.flashcards?.map((f, i) => (
                          <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="font-black text-xs text-gray-400 uppercase mb-2">Q: {f.question}</p>
                            <p className={`font-bold text-sm text-${colors.primary}`}>A: {f.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyLab;
