
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, ModuleVisibility, CalendarEvent } from '../types';
import { ThemeContext } from '../App';

const ActionCard: React.FC<{ title: string; desc: string; icon: string; color: string; onClick: () => void }> = ({ title, desc, icon, color, onClick }) => (
  <button
    onClick={onClick}
    className={`p-6 rounded-[2.5rem] text-left transition-all transform hover:scale-[1.03] shadow-sm hover:shadow-xl ${color} text-white w-full h-full flex flex-col justify-between min-h-[190px] border-4 border-white`}
  >
    <div className="bg-white/20 p-4 rounded-2xl w-fit mb-4 backdrop-blur-md">
      <i className={`fa-solid ${icon} text-3xl`}></i>
    </div>
    <div>
      <h3 className="text-xl font-black mb-1 leading-tight">{title}</h3>
      <p className="text-white/80 text-xs font-medium">{desc}</p>
    </div>
  </button>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const themeCtx = useContext(ThemeContext);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sectionOrder, setSectionOrder] = useState<string[]>(['professional', 'academic', 'personal', 'accessibility']);
  
  const [visibility, setVisibility] = useState<ModuleVisibility>({
    accounting: true, psychology: true, personal: true, budget: true, fitness: true,
    nutrition: true, calendar: true, utilities: true, emailEditor: false, docDrafter: false,
    studentMode: true, careerMode: true, taMode: false, visionAide: true, hearingAide: false,
    cognitiveAide: false, healthHQ: false, legalHQ: false, creativeHQ: false, techHQ: false, 
    engineeringHQ: true,
    businessHQ: false,
    scientificHQ: false, psychologyHQ: false, marketingHQ: false,
    dyslexiaMode: false, colorFilters: false, screenReaderOpt: false,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('psych_assistant_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.moduleVisibility) setVisibility({ ...visibility, ...parsedUser.moduleVisibility });
      if (parsedUser.dashboardOrder) setSectionOrder(parsedUser.dashboardOrder);
    }
  }, []);

  if (!themeCtx) return null;
  const { colors, theme } = themeCtx;

  const profColor = theme === 'default' ? 'bg-indigo-600' : colors.cardPrimary;
  const acadColor = theme === 'default' ? 'bg-emerald-500' : colors.cardSecondary;
  const persColor = theme === 'default' ? 'bg-rose-500' : colors.cardQuaternary;
  const aideColor = theme === 'default' ? 'bg-purple-600' : colors.cardTertiary;
  
  const hasAccounting = user?.selectedMajors?.includes('Accounting') || user?.selectedCareers?.includes('Accountant') || user?.selectedMajors.includes('Finance');
  const hasEngineering = visibility.engineeringHQ && (user?.selectedMajors.some(m => ['Engineering', 'Architecture', 'Physics'].some(k => m.includes(k))) || user?.selectedCareers.some(c => c.includes('Engineer')));
  const hasHealth = user?.selectedCareers.includes('Healthcare Professional') || user?.selectedMajors.some(m => ['Healthcare', 'Biology'].includes(m));
  const hasLegal = user?.selectedCareers.includes('Lawyer') || user?.selectedMajors.includes('Law');
  const hasCreative = user?.selectedCareers.includes('Designer') || user?.selectedMajors.some(m => ['Arts', 'Creative'].includes(m));
  const hasTech = user?.selectedCareers.includes('Software Developer') || user?.selectedMajors.includes('Computer Science');
  const hasBusiness = user?.selectedCareers.includes('Business Analyst') || user?.selectedMajors.includes('Business');
  const hasScientific = user?.selectedMajors.includes('STEM') || user?.selectedMajors.includes('Physics') || user?.selectedMajors.includes('Biology');
  const hasPsychologyPro = user?.selectedMajors.includes('Psychology') || user?.selectedCareers.includes('Researcher');
  const hasMarketing = user?.selectedMajors.includes('Marketing') || user?.selectedCareers.includes('Designer');

  const renderSection = (id: string) => {
    if (id === 'professional' && visibility.careerMode) {
      return (
        <section key={id}>
          <h2 className="text-2xl font-black mb-6 flex items-center">
            <i className={`fa-solid fa-briefcase mr-3 ${theme === 'default' ? 'text-indigo-600' : `text-${colors.primary}`}`}></i> 
            Professional Hub
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hasAccounting && <ActionCard title="Accounting HQ" desc="Audit transactions and GAAP research." icon="fa-calculator" color={profColor} onClick={() => navigate('/accounting')} />}
            {hasEngineering && <ActionCard title="Engineering HQ" desc="Math derivations, circuit analysis, and technical logic." icon="fa-microchip" color={profColor} onClick={() => navigate('/engineering')} />}
            {hasHealth && <ActionCard title="Health HQ" desc="Clinical dictionary and anatomical atlas." icon="fa-dna" color={profColor} onClick={() => navigate('/health')} />}
            {hasLegal && <ActionCard title="Legal HQ" desc="Case research and statute summaries." icon="fa-scale-balanced" color={profColor} onClick={() => navigate('/legal')} />}
            {hasCreative && <ActionCard title="Creative HQ" desc="Moodboards and creative brief logic." icon="fa-palette" color={profColor} onClick={() => navigate('/creative')} />}
            {hasTech && <ActionCard title="Tech HQ" desc="Architecture diagrams and code auditing." icon="fa-code" color={profColor} onClick={() => navigate('/tech')} />}
            {hasBusiness && <ActionCard title="Business HQ" desc="Market SWOT and competitive analysis." icon="fa-briefcase" color={profColor} onClick={() => navigate('/business')} />}
            {hasScientific && <ActionCard title="Scientific HQ" desc="Advanced research and data lookup." icon="fa-flask" color={profColor} onClick={() => navigate('/scientific')} />}
            {hasPsychologyPro && <ActionCard title="Psychology HQ" desc="DSM-5 lookup and clinical methodology." icon="fa-brain" color={profColor} onClick={() => navigate('/psychology-hq')} />}
            {hasMarketing && <ActionCard title="Marketing HQ" desc="Strategy, personas, and campaign briefs." icon="fa-bullhorn" color={profColor} onClick={() => navigate('/marketing')} />}
            {visibility.emailEditor && <ActionCard title="Email Studio" desc="Smart professional drafting." icon="fa-envelope-open-text" color={profColor} onClick={() => navigate('/email-editor')} />}
          </div>
        </section>
      );
    }

    if (id === 'academic' && visibility.studentMode) {
      return (
        <section key={id}>
          <h2 className="text-2xl font-black mb-6 flex items-center">
            <i className={`fa-solid fa-graduation-cap mr-3 ${theme === 'default' ? 'text-emerald-500' : `text-${colors.primary}`}`}></i> 
            Academic Hub
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibility.taMode && (
              <ActionCard 
                title={`${user?.customTASubject || 'Psychology'} TA / RA`} 
                desc="Context-aware grading, research assistance, and feedback." 
                icon="fa-graduation-cap" 
                color={acadColor} 
                onClick={() => navigate('/grading')} 
              />
            )}
            <ActionCard title="Study Lab" desc="Synthesize lecture notes and readings." icon="fa-laptop-code" color={acadColor} onClick={() => navigate('/study')} />
            <ActionCard title="Knowledge Vault" desc="Central data repository." icon="fa-vault" color={acadColor} onClick={() => navigate('/vault')} />
          </div>
        </section>
      );
    }

    if (id === 'personal' && visibility.personal) {
      return (
        <section key={id}>
          <h2 className="text-2xl font-black mb-6 flex items-center">
            <i className={`fa-solid fa-heart mr-3 ${theme === 'default' ? 'text-rose-500' : `text-${colors.primary}`}`}></i> 
            Personal Universe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard title="Personal Life" desc="Manage health, finance, and schedule." icon="fa-heart" color={persColor} onClick={() => navigate('/personal')} />
            <ActionCard title="Calendar" desc="Integrated schedule sync." icon="fa-calendar-day" color={persColor} onClick={() => navigate('/calendar')} />
          </div>
        </section>
      );
    }

    if (id === 'accessibility') {
      const hasAnyAide = visibility.visionAide || visibility.hearingAide || visibility.cognitiveAide;
      if (!hasAnyAide) return null;

      return (
        <section key={id}>
          <h2 className="text-2xl font-black mb-6 flex items-center">
            <i className={`fa-solid fa-universal-access mr-3 ${theme === 'default' ? 'text-purple-600' : `text-${colors.primary}`}`}></i> 
            Accessibility Suite
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard title="Accessibility Hub" desc="Manage all vision, hearing, and cognitive tools." icon="fa-universal-access" color={aideColor} onClick={() => navigate('/accessibility')} />
            {visibility.visionAide && <ActionCard title="Vision Assistant" desc="AI-powered OCR and object description." icon="fa-eye" color={aideColor} onClick={() => navigate('/accessibility')} />}
            {visibility.hearingAide && <ActionCard title="Hearing Aide" desc="Real-time transcription and environmental alerts." icon="fa-ear-listen" color={aideColor} onClick={() => navigate('/accessibility')} />}
          </div>
        </section>
      );
    }
    return null;
  };

  return (
    <div className={`max-w-6xl mx-auto pb-12 text-${colors.text}`}>
      <header className="mb-8">
        <h1 className="text-6xl font-black mb-1 tracking-tighter">My Universe</h1>
        <p className={`text-${colors.primary} font-bold italic opacity-80 text-lg`}>Nexus: your personal assistant</p>
      </header>
      <div className="space-y-16">
        {sectionOrder.map(renderSection)}
      </div>
    </div>
  );
};

export default Dashboard;
