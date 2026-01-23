
import React, { useState, useEffect } from 'react';
import { UserProfile, CalendarEvent } from '../types';

const Scheduling: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'keep'>('calendar');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('psych_assistant_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleGoogleLogin = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const mockUser: UserProfile = {
        name: "Nexus User",
        email: "user@example.com",
        picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nexus",
        isLoggedIn: true,
        theme: 'pink',
        role: 'student',
        field: 'General',
        selectedMajors: ['Accounting'], // Correct persona
        selectedCareers: ['Teaching Assistant'], // Correct persona
        customTASubject: 'Psychology', // Correct persona
        taKnowledgeBase: [],
        linkedApps: { calendar: true, keep: true },
        // Added missing properties: budget, fitness, nutrition, calendar
        moduleVisibility: {
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
          taMode: true, // Correct persona
          visionAide: true, // Correct persona
          hearingAide: false,
          cognitiveAide: false,
          dyslexiaMode: false,
          colorFilters: false,
          screenReaderOpt: false
        }
      };
      setUser(mockUser);
      localStorage.setItem('psych_assistant_user', JSON.stringify(mockUser));
      setIsSyncing(false);
      window.dispatchEvent(new Event('storage'));
    }, 1500);
  };

  const toggleLink = (app: 'calendar' | 'keep') => {
    if (!user) return;
    const updatedUser = {
      ...user,
      linkedApps: { ...user.linkedApps, [app]: !user.linkedApps[app] }
    };
    setUser(updatedUser);
    localStorage.setItem('psych_assistant_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('psych_assistant_user');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  };

  const events: CalendarEvent[] = [
    { id: '1', time: '09:00 AM', title: 'Accounting Study Group', type: 'Academic', description: '' },
    { id: '2', time: '11:30 AM', title: 'Psych 101 Office Hours', type: 'TA Duty', description: '' },
    { id: '3', time: '02:00 PM', title: 'Audit Lecture', type: 'Academic', description: '' },
    { id: '4', time: '05:00 PM', title: 'Review TA Submissions', type: 'Work', description: '' }
  ];

  const notes = [
    { title: 'Accounting Goals', content: 'Focus on GAAP revenue recognition standards this week.' },
    { title: 'Psych TA Notes', content: 'Prepare rubric for the midterm research paper.' },
    { title: 'Vision Assistant Tips', content: 'Remember to use the OCR tool for lecture hand-outs.' }
  ];

  if (!user?.isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-in fade-in zoom-in-95">
        <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-pink-100/50">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-brands fa-google text-4xl text-pink-600"></i>
          </div>
          <h2 className="text-3xl font-black text-pink-950 mb-4">Sync Your Persona</h2>
          <p className="text-pink-600 mb-8 leading-relaxed font-medium">
            Link your Google account to bridge your Accounting studies and Psychology TA schedule.
          </p>
          <button 
            onClick={handleGoogleLogin}
            disabled={isSyncing}
            className="w-full bg-white border-2 border-pink-100 hover:border-pink-300 text-pink-900 font-black py-5 px-8 rounded-3xl flex items-center justify-center space-x-4 transition-all hover:shadow-lg disabled:opacity-50 active:scale-95"
          >
            {isSyncing ? (
              <i className="fa-solid fa-circle-notch animate-spin text-pink-500"></i>
            ) : (
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="G" />
            )}
            <span>{isSyncing ? "Syncing Workspace..." : "Link Google Account"}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-black mb-2 flex items-center text-pink-950">
            <i className="fa-solid fa-calendar-check text-pink-500 mr-4"></i>
            Nexus Calendar
          </h2>
          <p className="text-pink-600/70 font-bold uppercase tracking-widest text-[10px]">Academic & Professional Sync Active</p>
        </div>
        <button onClick={handleLogout} className="text-pink-400 hover:text-rose-600 font-black text-[10px] tracking-widest uppercase bg-pink-50 hover:bg-rose-50 px-6 py-3 rounded-2xl transition-all">Disconnect</button>
      </header>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <button onClick={() => toggleLink('calendar')} className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all group ${user.linkedApps.calendar ? 'bg-pink-600 border-pink-500 text-white shadow-lg' : 'bg-white border-pink-50 text-pink-300'}`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${user.linkedApps.calendar ? 'bg-white/20' : 'bg-pink-50'}`}>
               <i className="fa-solid fa-calendar-day text-xl"></i>
            </div>
            <span className="font-black text-sm tracking-tight">Calendar</span>
          </div>
          <div className={`w-3 h-3 rounded-full ${user.linkedApps.calendar ? 'bg-pink-200 animate-pulse' : 'bg-gray-100'}`}></div>
        </button>
        <button onClick={() => toggleLink('keep')} className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all group ${user.linkedApps.keep ? 'bg-pink-600 border-pink-500 text-white shadow-lg' : 'bg-white border-pink-50 text-pink-300'}`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${user.linkedApps.keep ? 'bg-white/20' : 'bg-pink-50'}`}>
               <i className="fa-solid fa-lightbulb text-xl"></i>
            </div>
            <span className="font-black text-sm tracking-tight">Keep Notes</span>
          </div>
          <div className={`w-3 h-3 rounded-full ${user.linkedApps.keep ? 'bg-pink-200 animate-pulse' : 'bg-gray-100'}`}></div>
        </button>
      </div>

      <div className="flex bg-white/50 backdrop-blur-md p-2 rounded-[2rem] shadow-sm border border-pink-50 mb-10">
        <button onClick={() => setActiveTab('calendar')} className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${activeTab === 'calendar' ? 'bg-pink-600 text-white shadow-md' : 'text-pink-400'}`}>INTEGRATED SCHEDULE</button>
        <button onClick={() => setActiveTab('keep')} className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${activeTab === 'keep' ? 'bg-pink-600 text-white shadow-md' : 'text-pink-400'}`}>RESEARCH NOTES</button>
      </div>

      <div className="space-y-6">
        {activeTab === 'calendar' ? events.map(e => (
          <div key={e.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-pink-50 flex items-center space-x-8 hover:shadow-md transition-shadow">
            <div className="text-pink-600 font-black text-xl w-32 border-r border-pink-100 pr-6">{e.time}</div>
            <div className="flex-1">
              <h4 className="font-black text-lg text-pink-900">{e.title}</h4>
              <span className="text-[10px] uppercase font-black tracking-widest text-pink-300">{e.type}</span>
            </div>
            <div className="bg-pink-50 px-4 py-2 rounded-full">
              <i className="fa-solid fa-chevron-right text-pink-200"></i>
            </div>
          </div>
        )) : notes.map((n, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[3rem] shadow-sm border border-pink-50 hover:border-pink-200 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <i className="fa-solid fa-note-sticky text-pink-500"></i>
              <h4 className="font-black text-lg text-pink-900">{n.title}</h4>
            </div>
            <p className="text-pink-950/70 font-medium leading-relaxed">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scheduling;
