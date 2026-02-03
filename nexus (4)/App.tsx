
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeMode, UserProfile, ModuleVisibility } from './types';
import Dashboard from './views/Dashboard';
import AccessibilityHub from './views/AccessibilityHub';
import GradingAssistant from './views/GradingAssistant';
import StudyLab from './views/StudyLab';
import Scheduling from './views/Scheduling';
import KnowledgeVault from './views/KnowledgeVault';
import BudgetTracker from './views/BudgetTracker';
import FitnessTracker from './views/FitnessTracker';
import NutritionTracker from './views/NutritionTracker';
import AccountingTool from './views/AccountingTool';
import EngineeringTool from './views/EngineeringTool';
import HealthHQ from './views/HealthHQ';
import LegalHQ from './views/LegalHQ';
import CreativeHQ from './views/CreativeHQ';
import TechHQ from './views/TechHQ';
import BusinessHQ from './views/BusinessHQ';
import ScientificHQ from './views/ScientificHQ';
import PsychologyHQ from './views/PsychologyHQ';
import MarketingHQ from './views/MarketingHQ';
import PersonalLife from './views/PersonalLife';
import Settings from './views/Settings';
import EmailEditor from './views/EmailEditor';
import DocDrafter from './views/DocDrafter';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isDyslexicMode: boolean;
  setDyslexicMode: (v: boolean) => void;
  colors: {
    primary: string;
    bg: string;
    text: string;
    accent: string;
    cardPrimary: string;
    cardSecondary: string;
    cardTertiary: string;
    cardQuaternary: string;
  };
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfigs: Record<ThemeMode, ThemeContextType['colors']> = {
  pink: { primary: 'pink-500', bg: 'pink-50/40', text: 'pink-950', accent: 'pink-400', cardPrimary: 'bg-pink-500', cardSecondary: 'bg-pink-400', cardTertiary: 'bg-pink-300', cardQuaternary: 'bg-rose-400' },
  rose: { primary: 'rose-600', bg: 'rose-50/40', text: 'rose-950', accent: 'rose-400', cardPrimary: 'bg-rose-600', cardSecondary: 'bg-rose-500', cardTertiary: 'bg-rose-400', cardQuaternary: 'bg-pink-500' },
  orange: { primary: 'orange-600', bg: 'orange-50/40', text: 'orange-950', accent: 'orange-400', cardPrimary: 'bg-orange-600', cardSecondary: 'bg-amber-600', cardTertiary: 'bg-orange-400', cardQuaternary: 'bg-yellow-500' },
  yellow: { primary: 'yellow-600', bg: 'yellow-50/40', text: 'yellow-950', accent: 'yellow-500', cardPrimary: 'bg-yellow-500', cardSecondary: 'bg-amber-500', cardTertiary: 'bg-yellow-400', cardQuaternary: 'bg-orange-500' },
  green: { primary: 'green-600', bg: 'green-50/40', text: 'green-950', accent: 'green-400', cardPrimary: 'bg-green-600', cardSecondary: 'bg-emerald-600', cardTertiary: 'bg-green-400', cardQuaternary: 'bg-teal-500' },
  blue: { primary: 'blue-600', bg: 'blue-50/40', text: 'blue-950', accent: 'blue-400', cardPrimary: 'bg-blue-600', cardSecondary: 'bg-indigo-600', cardTertiary: 'bg-blue-400', cardQuaternary: 'bg-cyan-500' },
  indigo: { primary: 'indigo-600', bg: 'indigo-50/40', text: 'indigo-950', accent: 'indigo-400', cardPrimary: 'bg-indigo-600', cardSecondary: 'bg-violet-600', cardTertiary: 'bg-indigo-400', cardQuaternary: 'bg-blue-500' },
  purple: { primary: 'purple-600', bg: 'purple-50/40', text: 'purple-950', accent: 'purple-400', cardPrimary: 'bg-purple-600', cardSecondary: 'bg-fuchsia-600', cardTertiary: 'bg-purple-400', cardQuaternary: 'bg-violet-500' },
  default: { 
    primary: 'indigo-600', 
    bg: 'slate-50', 
    text: 'slate-900', 
    accent: 'rose-500', 
    cardPrimary: 'bg-indigo-600',    
    cardSecondary: 'bg-emerald-500', 
    cardTertiary: 'bg-amber-500',    
    cardQuaternary: 'bg-rose-500'    
  }
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const themeCtx = useContext(ThemeContext);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const syncUser = () => {
      const saved = localStorage.getItem('psych_assistant_user');
      if (saved) setUser(JSON.parse(saved));
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  if (!themeCtx) return null;
  const { colors, theme } = themeCtx;
  const isActive = (path: string) => location.pathname === path;

  // Icons are themed unless in 'default' mode where they keep their unique category colors
  const getIconColor = (path: string, baseColor: string) => {
    if (isActive(path)) return `text-${colors.primary}`;
    if (theme === 'default') return baseColor;
    return `text-${colors.primary} opacity-30`;
  };
  
  const hasEngineering = (user?.moduleVisibility?.engineeringHQ) && (user?.selectedMajors.some(m => ['Engineering', 'Architecture', 'Physics'].some(k => m.includes(k))) || user?.selectedCareers.some(c => c.includes('Engineer')));
  const hasAccounting = user?.selectedMajors.includes('Accounting') || user?.selectedCareers.includes('Accountant') || user?.selectedMajors.includes('Finance');
  const hasHealth = user?.selectedCareers.includes('Healthcare Professional') || user?.selectedMajors.some(m => ['Healthcare', 'Biology'].includes(m));
  const hasLegal = user?.selectedCareers.includes('Lawyer') || user?.selectedMajors.includes('Law');
  const hasCreative = user?.selectedCareers.includes('Designer') || user?.selectedMajors.includes('Arts');
  const hasTech = user?.selectedCareers.includes('Software Developer') || user?.selectedMajors.includes('Computer Science');
  const hasBusiness = user?.selectedCareers.includes('Business Analyst') || user?.selectedCareers.includes('Professor') || user?.selectedMajors.includes('Business');
  const hasScientific = user?.selectedMajors.includes('STEM') || user?.selectedMajors.includes('Physics') || user?.selectedMajors.includes('Biology');
  const hasPsychology = user?.selectedMajors.includes('Psychology') || user?.selectedCareers.includes('Researcher');
  const hasMarketing = user?.selectedMajors.includes('Marketing') || user?.selectedCareers.includes('Designer');

  const getAideLabel = () => {
    if (!user?.moduleVisibility) return "Accessibility";
    if (user.moduleVisibility.hearingAide && !user.moduleVisibility.visionAide) return "Hearing Aide";
    if (user.moduleVisibility.visionAide && !user.moduleVisibility.hearingAide) return "Vision Assistant";
    return "Aide Suite";
  };

  const getAideIcon = () => {
    if (user?.moduleVisibility.hearingAide && !user.moduleVisibility.visionAide) return "fa-ear-listen";
    if (user?.moduleVisibility.visionAide && !user.moduleVisibility.hearingAide) return "fa-eye";
    return "fa-universal-access";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 md:relative md:border-t-0 md:border-r md:w-64 md:h-screen overflow-y-auto">
      <div className="flex justify-around md:flex-col md:p-4 h-16 md:h-auto">
        <NavItem to="/" icon="fa-house" label="My Universe" active={isActive('/')} themeColors={colors} iconColor={getIconColor('/', `text-${colors.primary}`)} />
        <NavItem to="/personal" icon="fa-heart" label="Personal Life" active={isActive('/personal')} themeColors={colors} iconColor={getIconColor('/personal', 'text-rose-500')} />
        
        <div className="hidden md:block my-2 border-t border-gray-100 opacity-50"></div>
        
        {hasAccounting && <NavItem to="/accounting" icon="fa-calculator" label="Accounting HQ" active={isActive('/accounting')} themeColors={colors} iconColor={getIconColor('/accounting', 'text-amber-500')} />}
        {hasEngineering && <NavItem to="/engineering" icon="fa-microchip" label="Engineering HQ" active={isActive('/engineering')} themeColors={colors} iconColor={getIconColor('/engineering', 'text-blue-500')} />}
        {hasHealth && <NavItem to="/health" icon="fa-dna" label="Health HQ" active={isActive('/health')} themeColors={colors} iconColor={getIconColor('/health', 'text-teal-500')} />}
        {hasLegal && <NavItem to="/legal" icon="fa-scale-balanced" label="Legal HQ" active={isActive('/legal')} themeColors={colors} iconColor={getIconColor('/legal', 'text-purple-500')} />}
        {hasCreative && <NavItem to="/creative" icon="fa-palette" label="Creative HQ" active={isActive('/creative')} themeColors={colors} iconColor={getIconColor('/creative', 'text-pink-500')} />}
        {hasTech && <NavItem to="/tech" icon="fa-code" label="Tech HQ" active={isActive('/tech')} themeColors={colors} iconColor={getIconColor('/tech', 'text-sky-500')} />}
        {hasBusiness && <NavItem to="/business" icon="fa-briefcase" label="Business HQ" active={isActive('/business')} themeColors={colors} iconColor={getIconColor('/business', 'text-slate-500')} />}
        {hasScientific && <NavItem to="/scientific" icon="fa-flask" label="Scientific HQ" active={isActive('/scientific')} themeColors={colors} iconColor={getIconColor('/scientific', 'text-emerald-500')} />}
        {hasPsychology && <NavItem to="/psychology-hq" icon="fa-brain" label="Psychology HQ" active={isActive('/psychology-hq')} themeColors={colors} iconColor={getIconColor('/psychology-hq', 'text-violet-500')} />}
        {hasMarketing && <NavItem to="/marketing" icon="fa-bullhorn" label="Marketing HQ" active={isActive('/marketing')} themeColors={colors} iconColor={getIconColor('/marketing', 'text-orange-500')} />}
        
        <NavItem to="/accessibility" icon={getAideIcon()} label={getAideLabel()} active={isActive('/accessibility')} themeColors={colors} iconColor={getIconColor('/accessibility', `text-${colors.primary}`)} />
        
        <div className="hidden md:block my-2 border-t border-gray-100 opacity-50"></div>
        
        {user?.moduleVisibility.studentMode && (
          <>
            <NavItem to="/grading" icon="fa-graduation-cap" label="TA / RA Suite" active={isActive('/grading')} themeColors={colors} iconColor={getIconColor('/grading', 'text-emerald-500')} />
            <NavItem to="/vault" icon="fa-vault" label="Vault" active={isActive('/vault')} themeColors={colors} iconColor={getIconColor('/vault', 'text-purple-500')} />
            <NavItem to="/study" icon="fa-book-open-reader" label="Study Lab" active={isActive('/study')} themeColors={colors} iconColor={getIconColor('/study', 'text-sky-500')} />
          </>
        )}
      </div>
    </nav>
  );
};

const NavItem: React.FC<{ to: string; icon: string; label: string; active: boolean; themeColors: ThemeContextType['colors'], iconColor?: string }> = ({ to, icon, label, active, themeColors, iconColor }) => (
  <Link 
    to={to} 
    className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-4 p-2 md:p-4 rounded-xl transition-all duration-300 group ${active ? `text-${themeColors.primary} bg-${themeColors.primary}/10` : `text-gray-400 hover:text-${themeColors.primary} hover:bg-${themeColors.primary}/5`}`}
  >
    <i className={`fa-solid ${icon} text-xl w-6 text-center transition-colors ${active ? `text-${themeColors.primary}` : (iconColor || 'text-gray-400')}`}></i>
    <span className="text-[10px] md:text-sm font-black truncate max-w-[120px] tracking-tight uppercase md:normal-case">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeCtx = useContext(ThemeContext);
  const navigate = useNavigate();
  if (!themeCtx) return <>{children}</>;
  const { colors, isDyslexicMode } = themeCtx;

  return (
    <div className={`flex flex-col md:flex-row min-h-screen bg-white transition-colors duration-500 ${isDyslexicMode ? 'dyslexic-font' : ''}`}>
      <Navbar />
      <main className="flex-1 relative overflow-y-auto p-4 md:p-8">
        <button onClick={() => navigate('/settings')} className={`absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 text-${colors.primary} hover:rotate-90 transition-all duration-300 z-40 active:scale-95`}>
          <i className="fa-solid fa-gear text-xl"></i>
        </button>
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setThemeState] = useState<ThemeMode>(() => (localStorage.getItem('app_theme') as ThemeMode) || 'default');
  const [isDyslexicMode, setDyslexicMode] = useState(() => localStorage.getItem('dyslexic_mode') === 'true');

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('app_theme', t);
  };

  const updateDyslexicMode = (v: boolean) => {
    setDyslexicMode(v);
    localStorage.setItem('dyslexic_mode', v.toString());
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themeConfigs[theme], isDyslexicMode, setDyslexicMode: updateDyslexicMode }}>
      <HashRouter>
        <Layout><Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/personal" element={<PersonalLife />} />
          <Route path="/accessibility" element={<AccessibilityHub />} />
          <Route path="/grading" element={<GradingAssistant />} />
          <Route path="/study" element={<StudyLab />} />
          <Route path="/calendar" element={<Scheduling />} />
          <Route path="/vault" element={<KnowledgeVault />} />
          <Route path="/budget" element={<BudgetTracker />} />
          <Route path="/fitness" element={<FitnessTracker />} />
          <Route path="/nutrition" element={<NutritionTracker />} />
          <Route path="/accounting" element={<AccountingTool />} />
          <Route path="/engineering" element={<EngineeringTool />} />
          <Route path="/health" element={<HealthHQ />} />
          <Route path="/legal" element={<LegalHQ />} />
          <Route path="/creative" element={<CreativeHQ />} />
          <Route path="/tech" element={<TechHQ />} />
          <Route path="/business" element={<BusinessHQ />} />
          <Route path="/scientific" element={<ScientificHQ />} />
          <Route path="/psychology-hq" element={<PsychologyHQ />} />
          <Route path="/marketing" element={<MarketingHQ />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/email-editor" element={<EmailEditor />} />
          <Route path="/doc-drafter" element={<DocDrafter />} />
        </Routes></Layout>
      </HashRouter>
    </ThemeContext.Provider>
  );
};

export default App;
