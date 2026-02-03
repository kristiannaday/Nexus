
import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../App';
import { ThemeMode, ModuleVisibility, UserProfile, SourceDocument } from '../types';

const Settings: React.FC = () => {
  const themeCtx = useContext(ThemeContext);
  const [selectedMajors, setSelectedMajors] = useState<string[]>(['Accounting']);
  const [selectedCareers, setSelectedCareers] = useState<string[]>(['Professor']);
  const [customTASubject, setCustomTASubject] = useState("Psychology");
  const [taKnowledge, setTaKnowledge] = useState<SourceDocument[]>([]);
  
  const [newSourceTitle, setNewSourceTitle] = useState("");
  const [newSourceContent, setNewSourceContent] = useState("");
  const [isAddingSource, setIsAddingSource] = useState(false);
  
  const [visibility, setVisibility] = useState<ModuleVisibility>({
    accounting: true, psychology: true, personal: true, budget: true, fitness: true,
    nutrition: true, calendar: true, utilities: true, emailEditor: false, docDrafter: false,
    studentMode: true, careerMode: true, taMode: true, visionAide: true, hearingAide: false,
    cognitiveAide: false, healthHQ: false, legalHQ: false, creativeHQ: false, techHQ: false,
    engineeringHQ: true,
    businessHQ: false, scientificHQ: false, psychologyHQ: false, marketingHQ: false,
    dyslexiaMode: false, colorFilters: false, screenReaderOpt: false,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('psych_assistant_user');
    if (savedUser) {
      const parsedUser: UserProfile = JSON.parse(savedUser);
      if (parsedUser.selectedMajors) setSelectedMajors(parsedUser.selectedMajors);
      if (parsedUser.selectedCareers) setSelectedCareers(parsedUser.selectedCareers);
      if (parsedUser.customTASubject) setCustomTASubject(parsedUser.customTASubject);
      if (parsedUser.taKnowledgeBase) setTaKnowledge(parsedUser.taKnowledgeBase || []);
      if (parsedUser.moduleVisibility) setVisibility({ ...visibility, ...parsedUser.moduleVisibility });
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
    const updatedUser: UserProfile = { ...baseUser, selectedMajors: m, selectedCareers: c, customTASubject: taSub, taKnowledgeBase: taK, moduleVisibility: v };
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
    const newMajors = selectedMajors.includes(major) ? selectedMajors.filter(m => m !== major) : [...selectedMajors, major];
    setSelectedMajors(newMajors);
    saveSettings(visibility, newMajors, selectedCareers, customTASubject, taKnowledge);
  };

  const toggleCareer = (career: string) => {
    const newCareers = selectedCareers.includes(career) ? selectedCareers.filter(c => c !== career) : [...selectedCareers, career];
    setSelectedCareers(newCareers);
    saveSettings(visibility, selectedMajors, newCareers, customTASubject, taKnowledge);
  };

  const addKnowledgeSource = () => {
    if (!newSourceTitle || !newSourceContent) return;
    const newDoc: SourceDocument = { id: Date.now().toString(), title: newSourceTitle, content: newSourceContent };
    const updatedK = [...taKnowledge, newDoc];
    setTaKnowledge(updatedK);
    saveSettings(visibility, selectedMajors, selectedCareers, customTASubject, updatedK);
    setNewSourceTitle(""); setNewSourceContent(""); setIsAddingSource(false);
  };

  const removeKnowledgeSource = (id: string) => {
    const updatedK = taKnowledge.filter(k => k.id !== id);
    setTaKnowledge(updatedK);
    saveSettings(visibility, selectedMajors, selectedCareers, customTASubject, updatedK);
  };

  const ToggleItem = ({ label, active, onToggle, icon, color }: { label: string, active: boolean, onToggle: () => void, icon?: string, color?: string }) => (
    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
      <div className="flex items-center space-x-3">
        {icon && <i className={`fa-solid ${icon} text-sm opacity-30 ${color || `text-${colors.primary}`}`}></i>}
        <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <button onClick={onToggle} className={`w-12 h-6 rounded-full p-1 transition-colors ${active ? (color?.startsWith('text-') ? `bg-${color.split('-')[1]}-600` : `bg-${colors.primary}`) : 'bg-gray-200'}`}>
        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );

  const IntelligenceConfig = () => (
    <div className="mt-8 p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100 space-y-6 animate-in slide-in-from-top-2">
        <div className="flex items-center space-x-3 mb-2">
            <i className={`fa-solid fa-brain text-emerald-600`}></i>
            <h4 className="font-black text-[11px] uppercase tracking-widest text-gray-400">TA / RA Knowledge Context</h4>
        </div>
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Assistant's Primary Subject</label>
                <input 
                    className={`w-full p-4 rounded-xl bg-white border border-gray-100 font-bold text-sm outline-none focus:ring-1 focus:ring-emerald-400`} 
                    placeholder="e.g. Cognitive Psychology" 
                    value={customTASubject} 
                    onChange={e => {
                        setCustomTASubject(e.target.value);
                        saveSettings(visibility, selectedMajors, selectedCareers, e.target.value, taKnowledge);
                    }}
                />
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Reference Repository</label>
                    <button onClick={() => setIsAddingSource(!isAddingSource)} className={`text-[9px] font-black px-4 py-2 rounded-full ${isAddingSource ? 'bg-gray-200 text-gray-600' : `bg-emerald-600 text-white shadow-sm`}`}>
                        {isAddingSource ? "CANCEL" : "+ ADD SOURCE"}
                    </button>
                </div>
                {isAddingSource && (
                    <div className="bg-white p-6 rounded-2xl border border-emerald-100 space-y-3 shadow-sm">
                        <input className="w-full p-3 rounded-xl bg-gray-50 border-none font-bold text-xs outline-none" placeholder="Source Title (e.g. Textbook Ch.1)" value={newSourceTitle} onChange={e => setNewSourceTitle(e.target.value)} />
                        <textarea className="w-full h-24 p-3 rounded-xl bg-gray-50 border-none text-xs outline-none" placeholder="Paste source text for AI context..." value={newSourceContent} onChange={e => setNewSourceContent(e.target.value)} />
                        <button onClick={addKnowledgeSource} className={`w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-xs`}>SAVE CONTEXT</button>
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

  const MAJORS = ['Psychology', 'Accounting', 'Electrical Engineering', 'Mechanical Engineering', 'STEM', 'Healthcare', 'Economics', 'Literature', 'Civil Engineering', 'Finance', 'Marketing', 'Education', 'Law', 'Arts', 'Business', 'Computer Science', 'Physics'];
  const CAREERS = ['Accountant', 'Researcher', 'Electrical Engineer', 'Mechanical Engineer', 'Healthcare Professional', 'Software Developer', 'Lawyer', 'Professor', 'Designer', 'Business Analyst'];
  const profColorClass = theme === 'default' ? 'text-indigo-600' : `text-${colors.primary}`;

  return (
    <div className={`max-w-4xl mx-auto py-12 text-${colors.text} pb-32`}>
      <header className="mb-12">
        <h2 className="text-5xl font-black mb-2 tracking-tighter">Universe Settings</h2>
        <p className={`text-${colors.primary} font-bold italic opacity-80 text-lg`}>Calibrate your Personal AI Nexus</p>
      </header>

      {/* THEME PANEL */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
        <h3 className="text-2xl font-black mb-8 flex items-center">
            <i className={`fa-solid fa-palette mr-3 ${profColorClass}`}></i>
            Visual Aesthetics
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              className={`group flex flex-col items-center space-y-2 transition-all p-2 rounded-2xl ${theme === t.name ? 'bg-gray-50 ring-2 ring-offset-2 ring-indigo-400' : 'hover:bg-gray-50'}`}
            >
              <div className={`w-10 h-10 rounded-full ${t.color} shadow-sm transition-transform group-hover:scale-110`}></div>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{t.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* PROFESSIONAL HUB SETTINGS */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black flex items-center">
                <i className={`fa-solid fa-briefcase mr-3 ${profColorClass}`}></i>
                Professional Hub
            </h3>
            <ToggleItem label="Hub Active" active={visibility.careerMode} onToggle={() => toggleVisibility('careerMode')} color={profColorClass} />
        </div>
        {visibility.careerMode && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-2">
            <div>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-4">Professional Roles</p>
              <div className="flex flex-wrap gap-2">
                {CAREERS.map(c => (
                  <button key={c} onClick={() => toggleCareer(c)} className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${selectedCareers.includes(c) ? `${theme === 'default' ? 'bg-indigo-600 border-indigo-600' : `bg-${colors.primary} border-${colors.primary}`} text-white shadow-md scale-105` : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-300'}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <ToggleItem label="Accounting HQ" icon="fa-calculator" active={visibility.accounting} onToggle={() => toggleVisibility('accounting')} color={profColorClass} />
              <ToggleItem label="Engineering HQ" icon="fa-microchip" active={visibility.engineeringHQ} onToggle={() => toggleVisibility('engineeringHQ')} color={profColorClass} />
              <ToggleItem label="Legal HQ" icon="fa-scale-balanced" active={visibility.legalHQ} onToggle={() => toggleVisibility('legalHQ')} color={profColorClass} />
              <ToggleItem label="Tech HQ" icon="fa-code" active={visibility.techHQ} onToggle={() => toggleVisibility('techHQ')} color={profColorClass} />
              <ToggleItem label="Creative HQ" icon="fa-palette" active={visibility.creativeHQ} onToggle={() => toggleVisibility('creativeHQ')} color={profColorClass} />
              <ToggleItem label="Business HQ" icon="fa-briefcase" active={visibility.businessHQ} onToggle={() => toggleVisibility('businessHQ')} color={profColorClass} />
              <ToggleItem label="Health HQ" icon="fa-dna" active={visibility.healthHQ} onToggle={() => toggleVisibility('healthHQ')} color={profColorClass} />
              <ToggleItem label="Scientific HQ" icon="fa-flask" active={visibility.scientificHQ} onToggle={() => toggleVisibility('scientificHQ')} color={profColorClass} />
              <ToggleItem label="Marketing HQ" icon="fa-bullhorn" active={visibility.marketingHQ} onToggle={() => toggleVisibility('marketingHQ')} color={profColorClass} />
              <ToggleItem label="Email Studio" icon="fa-envelope" active={visibility.emailEditor} onToggle={() => toggleVisibility('emailEditor')} color={profColorClass} />
            </div>
          </div>
        )}
      </section>

      {/* ACADEMIC HUB SETTINGS */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black flex items-center">
                <i className="fa-solid fa-graduation-cap mr-3 text-emerald-500"></i>
                Academic Hub
            </h3>
            <ToggleItem label="Hub Active" active={visibility.studentMode} onToggle={() => toggleVisibility('studentMode')} color="text-emerald-500" />
        </div>
        {visibility.studentMode && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-2">
            <div>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-4">Field of Study</p>
              <div className="flex flex-wrap gap-2">
                {MAJORS.map(m => (
                  <button key={m} onClick={() => toggleMajor(m)} className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${selectedMajors.includes(m) ? `bg-emerald-600 border-emerald-600 text-white shadow-md scale-105` : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-emerald-200'}`}>{m}</button>
                ))}
              </div>
            </div>
            <ToggleItem label="TA / RA Suite Intelligence" icon="fa-graduation-cap" active={visibility.taMode} onToggle={() => toggleVisibility('taMode')} color="text-emerald-500" />
            {visibility.taMode && <IntelligenceConfig />}
          </div>
        )}
      </section>

      {/* PERSONAL HUB SETTINGS */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black flex items-center">
                <i className="fa-solid fa-heart mr-3 text-rose-500"></i>
                Personal Life Hub
            </h3>
            <ToggleItem label="Hub Active" active={visibility.personal} onToggle={() => toggleVisibility('personal')} color="text-rose-500" />
        </div>
        {visibility.personal && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
            <ToggleItem label="Budgeting & Ledger" icon="fa-wallet" active={visibility.budget} onToggle={() => toggleVisibility('budget')} color="text-rose-500" />
            <ToggleItem label="Fitness Tracker" icon="fa-dumbbell" active={visibility.fitness} onToggle={() => toggleVisibility('fitness')} color="text-rose-500" />
            <ToggleItem label="Nutrition & Macros" icon="fa-utensils" active={visibility.nutrition} onToggle={() => toggleVisibility('nutrition')} color="text-rose-500" />
            <ToggleItem label="Calendar Sync" icon="fa-calendar-day" active={visibility.calendar} onToggle={() => toggleVisibility('calendar')} color="text-rose-500" />
          </div>
        )}
      </section>

      {/* ACCESSIBILITY SUITE SETTINGS */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
        <h3 className="text-2xl font-black mb-8 flex items-center">
            <i className="fa-solid fa-universal-access mr-3 text-purple-600"></i>
            Accessibility Suite
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToggleItem label="Vision Assistant (OCR)" icon="fa-eye" active={visibility.visionAide} onToggle={() => toggleVisibility('visionAide')} color="text-purple-600" />
          <ToggleItem label="Hearing Aide (Live Captions)" icon="fa-ear-listen" active={visibility.hearingAide} onToggle={() => toggleVisibility('hearingAide')} color="text-purple-600" />
          <ToggleItem label="Cognitive Aide" icon="fa-brain" active={visibility.cognitiveAide} onToggle={() => toggleVisibility('cognitiveAide')} color="text-purple-600" />
          <ToggleItem label="Dyslexia Optimization" icon="fa-font" active={visibility.dyslexiaMode} onToggle={() => toggleVisibility('dyslexiaMode')} color="text-purple-600" />
          <ToggleItem label="Color Filtering" icon="fa-circle-half-stroke" active={visibility.colorFilters} onToggle={() => toggleVisibility('colorFilters')} color="text-purple-600" />
          <ToggleItem label="Screen Reader Ready" icon="fa-keyboard" active={visibility.screenReaderOpt} onToggle={() => toggleVisibility('screenReaderOpt')} color="text-purple-600" />
        </div>
      </section>
    </div>
  );
};

export default Settings;
