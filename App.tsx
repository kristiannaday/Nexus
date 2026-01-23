
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
  };
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfigs: Record<ThemeMode, ThemeContextType['colors']> = {
  pink: { primary: 'pink-500', bg: 'pink-50/40', text: 'pink-950', accent: 'pink-400', cardPrimary: 'bg-pink-500', cardSecondary: 'bg-pink-400', cardTertiary: 'bg-pink-300' },
  rose: { primary: 'rose-600', bg: 'rose-50/40', text: 'rose-950', accent: 'rose-400', cardPrimary: 'bg-rose-600', cardSecondary: 'bg-rose-500', cardTertiary: 'bg-rose-400' },
  orange: { primary: 'orange-600', bg: 'orange-50/40', text: 'orange-950', accent: 'orange-400', cardPrimary: 'bg-orange-600', cardSecondary: 'bg-amber-600', cardTertiary: 'bg-orange-400' },
  yellow: { primary: 'yellow-600', bg: 'yellow-50/40', text: 'yellow-950', accent: 'yellow-500', cardPrimary: 'bg-yellow-500', cardSecondary: 'bg-amber-500', cardTertiary: 'bg-yellow-400' },
  green: { primary: 'green-600', bg: 'green-50/40', text: 'green-950', accent: 'green-400', cardPrimary: 'bg-green-600', cardSecondary: 'bg-emerald-600', cardTertiary: 'bg-green-400' },
  blue: { primary: 'blue-600', bg: 'blue-50/40', text: 'blue-950', accent: 'blue-400', cardPrimary: 'bg-blue-600', cardSecondary: 'bg-indigo-600', cardTertiary: 'bg-blue-400' },
  indigo: { primary: 'indigo-600', bg: 'indigo-50/40', text: 'indigo-950', accent: 'indigo-400', cardPrimary: 'bg-indigo-600', cardSecondary: 'bg-violet-600', cardTertiary: 'bg-indigo-400' },
  purple: { primary: 'purple-600', bg: 'purple-50/40', text: 'purple-950', accent: 'purple-400', cardPrimary: 'bg-purple-600', cardSecondary: 'bg-fuchsia-600', cardTertiary: 'bg-purple-400' },
  default: { primary: 'slate-700', bg: 'slate-50', text: 'slate-950', accent: 'indigo-500', cardPrimary: 'bg-slate-800', cardSecondary: 'bg-slate-700', cardTertiary: 'bg-slate-600' }
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const themeCtx = useContext(ThemeContext);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const syncUser = () => {
      const saved = localStorage.getItem('psych_assistant_user');
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        const initialPersona: UserProfile = {
          name: "Nexus User",
          email: "",
          picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nexus",
          isLoggedIn: false,
          theme: 'pink',
          role: 'student',
          field: 'Accounting',
          selectedMajors: ['Accounting'],
          selectedCareers: ['Teaching Assistant'],
          customTASubject: 'Psychology',
          taKnowledgeBase: [],
          linkedApps: { calendar: false, keep: false },
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
            taMode: true,
            visionAide: true,
            hearingAide: false,
            cognitiveAide: false,
            dyslexiaMode: false,
            colorFilters: false,
            screenReaderOpt: false
          }
        };
        setUser(initialPersona);
        localStorage.setItem('psych_assistant_user', JSON.stringify(initialPersona));
      }
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    const interval = setInterval(syncUser, 1000);
    return () => {
      window.removeEventListener('storage', syncUser);
      clearInterval(interval);
    };
  }, []);

  if (!themeCtx) return null;
  const { colors } = themeCtx;
  const isActive = (path: string) => location.pathname === path;
  const activeColorClass = `text-${colors.primary}`;
  const activeBgClass = `bg-${colors.primary}/10`;

  const visibility = user?.moduleVisibility || {
    studentMode: true,
    careerMode: true,
    personal: true,
    budget: true,
    fitness: true,
    nutrition: true,
    calendar: true,
    taMode: true,
    visionAide: true
  };

  const taLabel = `${user?.customTASubject || 'Psychology'} Assistant`;
  const hasAccounting = user?.selectedMajors?.includes('Accounting') || user?.selectedCareers?.includes('Accountant');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:relative md:border-t-0 md:border-r md:w-64 md:h-screen overflow-y-auto">
      <div className="flex justify-around md:flex-col md:p-4 h-16 md:h-auto">
        <NavItem to="/" icon="fa-house" label="My Universe" active={isActive('/')} activeColor={activeColorClass} activeBg={activeBgClass} />
        
        <div className="hidden md:block my-2 border-t border-gray-50 opacity-50"></div>

        {visibility.taMode && (
          <NavItem to="/grading" icon="fa-graduation-cap" label={taLabel} active={isActive('/grading')} activeColor={activeColorClass} activeBg={activeBgClass} />
        )}
        {hasAccounting && (
          <NavItem to="/accounting" icon="fa-calculator" label="Accounting HQ" active={isActive('/accounting')} activeColor={activeColorClass} activeBg={activeBgClass} />
        )}
        {visibility.visionAide && (
          <NavItem to="/accessibility" icon="fa-eye" label="Vision Assistant" active={isActive('/accessibility')} activeColor={activeColorClass} activeBg={activeBgClass} />
        )}

        <div className="hidden md:block my-2 border-t border-gray-100 opacity-50"></div>

        {visibility.studentMode && (
          <>
            <NavItem to="/vault" icon="fa-vault" label="Vault" active={isActive('/vault')} activeColor={activeColorClass} activeBg={activeBgClass} />
            <NavItem to="/study" icon="fa-brain" label="Study Lab" active={isActive('/study')} activeColor={activeColorClass} activeBg={activeBgClass} />
          </>
        )}

        {visibility.personal && (
            <>
                {visibility.calendar && <NavItem to="/calendar" icon="fa-calendar" label="Calendar" active={isActive('/calendar')} activeColor={activeColorClass} activeBg={activeBgClass} />}
                {visibility.budget && <NavItem to="/budget" icon="fa-wallet" label="Finance" active={isActive('/budget')} activeColor={activeColorClass} activeBg={activeBgClass} />}
                {visibility.fitness && <NavItem to="/fitness" icon="fa-dumbbell" label="Fitness" active={isActive('/fitness')} activeColor={activeColorClass} activeBg={activeBgClass} />}
                {visibility.nutrition && <NavItem to="/nutrition" icon="fa-utensils" label="Nutrition" active={isActive('/nutrition')} activeColor={activeColorClass} activeBg={activeBgClass} />}
            </>
        )}
      </div>
    </nav>
  );
};

const NavItem: React.FC<{ to: string; icon: string; label: string; active: boolean; activeColor: string; activeBg: string }> = ({ to, icon, label, active, activeColor, activeBg }) => (
  <Link to={to} className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-4 p-2 md:p-4 rounded-xl transition-all ${active ? `${activeColor} ${activeBg}` : `text-gray-400 hover:text-gray-600`}`}>
    <i className={`fa-solid ${icon} text-xl w-6 text-center`}></i>
    <span className="text-[10px] md:text-sm font-bold truncate max-w-[120px]">{label}</span>
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
        <button onClick={() => navigate('/settings')} className={`absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 text-${colors.primary} hover:rotate-90 transition-all duration-300 z-40`} aria-label="Settings">
          <i className="fa-solid fa-gear text-xl"></i>
        </button>
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved as ThemeMode) || 'pink';
  });
  const [isDyslexicMode, setDyslexicMode] = useState(() => localStorage.getItem('dyslexic_mode') === 'true');

  useEffect(() => {
    // Register Service Worker for PWA/Production
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }, []);

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
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accessibility" element={<AccessibilityHub />} />
            <Route path="/grading" element={<GradingAssistant />} />
            <Route path="/study" element={<StudyLab />} />
            <Route path="/calendar" element={<Scheduling />} />
            <Route path="/vault" element={<KnowledgeVault />} />
            <Route path="/budget" element={<BudgetTracker />} />
            <Route path="/fitness" element={<FitnessTracker />} />
            <Route path="/nutrition" element={<NutritionTracker />} />
            <Route path="/accounting" element={<AccountingTool />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/email-editor" element={<EmailEditor />} />
            <Route path="/doc-drafter" element={<DocDrafter />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeContext.Provider>
  );
};

export default App;
