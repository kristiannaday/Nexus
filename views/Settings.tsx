
import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../App';
import { ThemeMode, ModuleVisibility, UserProfile, SourceDocument } from '../types';

const Settings: React.FC = () => {
  const themeCtx = useContext(ThemeContext);
  const [selectedMajors, setSelectedMajors] = useState<string[]>(['Accounting']);
  const [selectedCareers, setSelectedCareers] = useState<string[]>(['Teaching Assistant']);
  const [customTASubject, setCustomTASubject] = useState("Psychology");
  const [taKnowledge, setTaKnowledge] = useState<SourceDocument[]>([]);
  
  const [newSourceTitle, setNewSourceTitle] = useState("");
  const [newSourceContent, setNewSourceContent] = useState("");
  const [isAddingSource, setIsAddingSource] = useState(false);
  
  const [visibility, setVisibility] = useState<ModuleVisibility>({
    accounting: true,
    psychology: true,
    personal: true,
    budget: true,
    fitness: true,
    nutrition: true,
    calendar: true,
    utilities: true,
    emailEditor: false, 
    docDrafter: false,  
    studentMode: true,
    careerMode: true,
    taMode: true, 
    visionAide: true,
    hearingAide: false, 
    cognitiveAide: false, 
    dyslexiaMode: false,
    colorFilters: false,
    screenReaderOpt: false,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('psych_assistant_user');
    if (savedUser) {
      const parsedUser: UserProfile = JSON.parse(savedUser);
      if (parsedUser.selectedMajors) setSelectedMajors(parsedUser.selectedMajors);
      if (parsedUser.selectedCareers) setSelectedCareers(parsedUser.selectedCareers);
      if (parsedUser.customTASubject) setCustomTASubject(parsedUser.customTASubject);
      if (parsedUser.taKnowledgeBase) setTaKnowledge(parsedUser.taKnowledgeBase || []);
      if (parsedUser.moduleVisibility) {
        setVisibility({ ...visibility, ...parsedUser.moduleVisibility });
      }
    }
  }, []);

  if (!themeCtx) return null;
  const { theme, setTheme, colors, setDyslexicMode } = themeCtx;

  const themes: { name: ThemeMode, color: string }[] = [
    { name: 'pink', color: 'bg-pink-500' },
    { name: 'rose', color: 'bg-rose-500' },
    { name: 'orange', color: 'bg-orange-500' },
    { name: 'yellow', color: 'bg-yellow-500' },
    { name: 'green', color: 'bg-green-500' },
    { name: 'blue', color: 'bg-blue-500' },
    { name: 'indigo', color: 'bg-indigo-500' },
    { name: 'purple', color: 'bg-purple-500' },
    { name: 'default', color: 'bg-slate-600' }
  ];

  const saveSettings = (v: ModuleVisibility, m: string[], c: string[], taSub: string, taK: SourceDocument[]) => {
    const savedUser = localStorage.getItem('psych_assistant_user');
    const baseUser = savedUser ? JSON.parse(savedUser) : {};
    
    const updatedUser: UserProfile = {
      ...baseUser,
      selectedMajors: m,
      selectedCareers: c,
      customTASubject: taSub,
      taKnowledgeBase: taK,
      moduleVisibility: v,
    };
    
    localStorage.setItem('psych_assistant_user', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('storage'));
    setDyslexicMode(v.dyslexiaMode);
  };

  const toggleVisibility = (key: keyof ModuleVisibility) => {
    const newV = { ...visibility, [key]: !visibility[key] };
    setVisibility(newV);
    saveSettings(newV, selectedMajors, selectedCareers, customTASubject, taKnowledge);
  };

  const toggleMajor = (major: string) => {
    const newMajors = selectedMajors.includes(major) 
      ? selectedMajors.filter(m => m !== major) 
      : [...selectedMajors, major];
    setSelectedMajors(newMajors);
    saveSettings(visibility, newMajors, selectedCareers, customTASubject, taKnowledge);
  };

  const toggleCareer = (career: string) => {
    const newCareers = selectedCareers.includes(career) 
      ? selectedCareers.filter(c => c !== career) 
      : [...selectedCareers, career];
    setSelectedCareers(newCareers);
    saveSettings(visibility, selectedMajors, newCareers, customTASubject, taKnowledge);
  };

  const addKnowledgeSource = () => {
    if (!newSourceTitle || !newSourceContent) return;
    const newDoc: SourceDocument = {
      id: Date.now().toString(),
      title: newSourceTitle,
      content: newSourceContent
    };
    const updatedK = [...taKnowledge, newDoc];
    setTaKnowledge(updatedK);
    saveSettings(visibility, selectedMajors, selectedCareers, customTASubject, updatedK);
    setNewSourceTitle("");
    setNewSourceContent("");
    setIsAddingSource(false);
  };

  const removeKnowledgeSource = (id: string) => {
    const updatedK = taKnowledge.filter(k => k.id !== id);
    setTaKnowledge(updatedK);
    saveSettings(visibility, selectedMajors, selectedCareers, customTASubject, updatedK);
  };

  const ToggleItem = ({ label, active, onToggle, icon, color }: { label: string, active: boolean, onToggle: () => void, icon?: string, color?: string }) => (
    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-100/50 transition-all hover:bg-white hover:shadow-sm">
      <div className="flex items-center space-x-3">
        {icon && <i className={`fa-solid ${icon} text-sm opacity-30 ${color || `text-${colors.primary}`}`}></i>}
        <span className="font-bold text-xs uppercase tracking-widest">{label}</span>
      </div>
      <button onClick={onToggle} className={`w-12 h-6 rounded-full p-1 transition-colors ${active ? (color?.startsWith('text-') ? `bg-${color.split('-')[1]}-600` : `bg-${colors.primary}`) : 'bg-gray-200'}`}>
        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );

  const IntelligenceConfig = () => (
    <div className="mt-8 p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100 space-y-6 animate-in slide-in-from-top-2">
        <div className="flex items-center space-x-3 mb-2">
            <i className={`fa-solid fa-brain text-${colors.primary}`}></i>
            <h4 className="font-black text-[11px] uppercase tracking-widest text-gray-400">Assistant Intelligence Configuration</h4>
        </div>
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Specialized Subject (e.g. Psychology TA Job)</label>
                <input 
                    className={`w-full p-4 rounded-xl bg-white border border-gray-100 font-bold text-sm outline-none focus:ring-1 focus:ring-${colors.primary}`} 
                    placeholder="e.g. Cognitive Psychology, Fluid Mechanics" 
                    value={customTASubject} 
                    onChange={e => {
                        setCustomTASubject(e.target.value);
                        saveSettings(visibility, selectedMajors, selectedCareers, e.target.value, taKnowledge);
                    }}
                />
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Knowledge Repository</label>
                    <button onClick={() => setIsAddingSource(!isAddingSource)} className={`text-[9px] font-black px-4 py-2 rounded-full ${isAddingSource ? 'bg-gray-200 text-gray-600' : `bg-${colors.primary} text-white shadow-sm`}`}>
                        {isAddingSource ? "CANCEL" : "+ ADD SOURCE"}
                    </button>
                </div>
                {isAddingSource && (
                    <div className="bg-white p-6 rounded-2xl border border-pink-100 space-y-3 shadow-sm">
                        <input className="w-full p-3 rounded-xl bg-gray-50 border-none font-bold text-xs outline-none" placeholder="Source Title" value={newSourceTitle} onChange={e => setNewSourceTitle(e.target.value)} />
                        <textarea className="w-full h-24 p-3 rounded-xl bg-gray-50 border-none text-xs outline-none" placeholder="Paste context documents..." value={newSourceContent} onChange={e => setNewSourceContent(e.target.value)} />
                        <button onClick={addKnowledgeSource} className={`w-full py-3 rounded-xl bg-${colors.primary} text-white font-black text-xs`}>SAVE SOURCE</button>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {taKnowledge.map(source => (
                        <div key={source.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <span className="font-bold text-[10px] truncate max-w-[150px]">{source.title}</span>
                            <button onClick={() => removeKnowledgeSource(source.id)} className="text-gray-200 hover:text-rose-500"><i className="fa-solid fa-trash-can text-[10px]"></i></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const MAJORS = [
    'Psychology', 'Accounting', 'STEM', 'Computer Science', 'Biology', 'Economics', 
    'Art History', 'Sociology', 'Political Science', 'Literature', 'Civil Engineering', 
    'Mechanical Engineering', 'Electrical Engineering', 'Chemical Engineering', 
    'Aerospace Engineering', 'Software Engineering', 'Industrial Engineering',
    'Biomedical Engineering', 'Environmental Engineering', 'Materials Engineering',
    'Nursing', 'Law', 'Architecture', 'Mathematics', 'Physics', 'Chemistry', 'Finance', 'Marketing', 'Education'
  ];
  
  const CAREERS = [
    'Teaching Assistant', 'Professor', 'Educator', 'Accountant', 'Developer', 
    'Designer', 'Executive', 'Healthcare', 'Researcher', 'Engineer', 'Project Manager', 
    'Consultant', 'Nurse', 'Lawyer', 'Architect', 'Sales', 'Marketing', 'HR', 'Legal',
    'Financial Analyst', 'Doctor', 'Physical Therapist'
  ];

  const profColorClass = theme === 'default' ? 'text-blue-600' : `text-${colors.primary}`;

  return (
    <div className={`max-w-4xl mx-auto py-12 text-${colors.text} pb-32`}>
      <header className="mb-12">
        <h2 className="text-5xl font-black mb-2 tracking-tighter">
          <span className={`text-${colors.primary}`}>Nexus</span> Settings
        </h2>
        <p className={`text-${colors.primary} font-bold italic opacity-80 text-lg`}>Nexus: your personal assistant</p>
      </header>

      {/* THEME & AESTHETICS */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
        <div className={`absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none text-${colors.primary}`}>
            <i className="fa-solid fa-palette"></i>
        </div>
        <h3 className="text-2xl font-black mb-8">Theme & Aesthetics</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              className={`group flex flex-col items-center space-y-2 transition-all p-2 rounded-2xl ${theme === t.name ? 'bg-gray-50 ring-2 ring-offset-2 ring-pink-400' : 'hover:bg-gray-50'}`}
            >
              <div className={`w-10 h-10 rounded-full ${t.color} shadow-sm transition-transform group-hover:scale-110`}></div>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{t.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* STUDENT HUB SECTION */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
        <div className={`absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none text-${colors.primary}`}>
            <i className="fa-solid fa-graduation-cap"></i>
        </div>
        
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black">Student Hub</h3>
            <ToggleItem label="Active" active={visibility.studentMode} onToggle={() => toggleVisibility('studentMode')} />
        </div>

        {visibility.studentMode && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-4">
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Select Majors (Your field of study)</p>
              <div className="flex flex-wrap gap-2">
                {MAJORS.map(major => (
                  <button
                    key={major}
                    onClick={() => toggleMajor(major)}
                    className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                      selectedMajors.includes(major) 
                      ? `bg-${colors.primary} border-${colors.primary} text-white shadow-md` 
                      : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-pink-200'
                    }`}
                  >
                    {major}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <h4 className="font-black text-sm uppercase tracking-widest">TA/RA Responsibilities</h4>
                        <p className="text-[10px] font-bold text-gray-400">Enable specialized grading and research tools</p>
                    </div>
                    <button onClick={() => toggleVisibility('taMode')} className={`w-12 h-6 rounded-full p-1 transition-colors ${visibility.taMode ? `bg-${colors.primary}` : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${visibility.taMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>
                {visibility.taMode && <IntelligenceConfig />}
            </div>
          </div>
        )}
      </section>

      {/* PROFESSIONAL HUB SECTION */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
        <div className={`absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none ${profColorClass}`}>
            <i className="fa-solid fa-briefcase"></i>
        </div>

        <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black">Professional Hub</h3>
            <ToggleItem label="Active" active={visibility.careerMode} onToggle={() => toggleVisibility('careerMode')} color={profColorClass} />
        </div>

        {visibility.careerMode && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-4">
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Select Career Focus</p>
              <div className="flex flex-wrap gap-2">
                {CAREERS.map(career => (
                  <button
                    key={career}
                    onClick={() => toggleCareer(career)}
                    className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                      selectedCareers.includes(career) 
                      ? `${theme === 'default' ? 'bg-blue-600 border-blue-600' : `bg-${colors.primary} border-${colors.primary}`} text-white shadow-md` 
                      : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-blue-200'
                    }`}
                  >
                    {career}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ToggleItem label="Email Studio" icon="fa-envelope" active={visibility.emailEditor} onToggle={() => toggleVisibility('emailEditor')} color={profColorClass} />
                <ToggleItem label="Doc Drafter" icon="fa-file-signature" active={visibility.docDrafter} onToggle={() => toggleVisibility('docDrafter')} color={profColorClass} />
                <ToggleItem label="Accounting HQ" icon="fa-calculator" active={selectedMajors.includes('Accounting') || selectedCareers.includes('Accountant')} onToggle={() => {
                  if (!selectedMajors.includes('Accounting')) toggleMajor('Accounting');
                }} color={profColorClass} />
            </div>
          </div>
        )}
      </section>

      {/* PERSONAL LIFE SECTION */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
        <div className={`absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none text-${colors.primary}`}>
            <i className="fa-solid fa-heart-pulse"></i>
        </div>
        
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black">Personal Life</h3>
            <ToggleItem label="Active" active={visibility.personal} onToggle={() => toggleVisibility('personal')} />
        </div>

        {visibility.personal && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <ToggleItem label="Calendar & Events" icon="fa-calendar" active={visibility.calendar} onToggle={() => toggleVisibility('calendar')} />
            <ToggleItem label="Finance & Budget" icon="fa-wallet" active={visibility.budget} onToggle={() => toggleVisibility('budget')} />
            <ToggleItem label="Fitness Log" icon="fa-dumbbell" active={visibility.fitness} onToggle={() => toggleVisibility('fitness')} />
            <ToggleItem label="Nutrition Tracker" icon="fa-utensils" active={visibility.nutrition} onToggle={() => toggleVisibility('nutrition')} />
          </div>
        )}
      </section>

      {/* ACCESSIBILITY SUITE SECTION */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-10">
        <div className="flex items-center mb-8">
          <i className={`fa-solid fa-universal-access mr-4 text-2xl text-${colors.primary}`}></i>
          <h3 className="text-2xl font-black">Accessibility Suite</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToggleItem label="Vision Assistant (OCR)" icon="fa-eye" active={visibility.visionAide} onToggle={() => toggleVisibility('visionAide')} />
          <ToggleItem label="Hearing Assistant (Transcript)" icon="fa-ear-listen" active={visibility.hearingAide} onToggle={() => toggleVisibility('hearingAide')} />
          <ToggleItem label="Cognitive Aide" icon="fa-brain" active={visibility.cognitiveAide} onToggle={() => toggleVisibility('cognitiveAide')} />
          <ToggleItem label="Dyslexia Optimized Font" icon="fa-font" active={visibility.dyslexiaMode} onToggle={() => toggleVisibility('dyslexiaMode')} />
          <ToggleItem label="Color Filtering & High Contrast" icon="fa-circle-half-stroke" active={visibility.colorFilters} onToggle={() => toggleVisibility('colorFilters')} />
          <ToggleItem label="Screen Reader Optimizations" icon="fa-keyboard" active={visibility.screenReaderOpt} onToggle={() => toggleVisibility('screenReaderOpt')} />
        </div>
      </section>
    </div>
  );
};

export default Settings;
