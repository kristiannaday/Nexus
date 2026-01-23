
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

const UpcomingBanner: React.FC<{ events: CalendarEvent[], color: string }> = ({ events, color }) => {
  if (events.length === 0) return null;
  
  return (
    <div className={`mb-10 p-4 rounded-[2rem] bg-white border border-gray-100 shadow-sm overflow-hidden relative animate-in fade-in slide-in-from-top-4 duration-700`}>
      <div className={`absolute left-0 top-0 bottom-0 w-2 bg-${color}`}></div>
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-full bg-${color}/10 flex items-center justify-center text-${color}`}>
            <i className="fa-solid fa-bell animate-bounce"></i>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block">Upcoming Today</span>
            <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar py-1">
              {events.map(event => (
                <div key={event.id} className="flex items-center space-x-2 whitespace-nowrap">
                  <span className="font-black text-sm">{event.time}</span>
                  <span className="font-bold text-sm opacity-70">{event.title}</span>
                  <span className={`text-[8px] px-2 py-0.5 rounded-full bg-gray-100 font-black uppercase text-gray-500`}>{event.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="text-xs font-black opacity-30 hover:opacity-100 transition-opacity">DISMISS</button>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const themeCtx = useContext(ThemeContext);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sectionOrder, setSectionOrder] = useState<string[]>(['professional', 'academic', 'personal']);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
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
    taMode: false,
    visionAide: true,   
    hearingAide: false, 
    cognitiveAide: false, 
    dyslexiaMode: false,
    colorFilters: false,
    screenReaderOpt: false,
  });

  const [upcomingEvents] = useState<CalendarEvent[]>([
    { id: '1', time: '11:30 AM', title: 'Psych 349 TA Office Hours', type: 'Work', description: '' },
    { id: '2', time: '02:00 PM', title: 'Audit Lecture', type: 'Study', description: '' }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('psych_assistant_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.moduleVisibility) {
        setVisibility({ ...visibility, ...parsedUser.moduleVisibility });
      }
      if (parsedUser.dashboardOrder) {
        setSectionOrder(parsedUser.dashboardOrder);
      }
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...sectionOrder];
    const item = newOrder.splice(draggedIndex, 1)[0];
    newOrder.splice(index, 0, item);
    
    setSectionOrder(newOrder);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    if (user) {
      const updatedUser = { ...user, dashboardOrder: sectionOrder };
      setUser(updatedUser);
      localStorage.setItem('psych_assistant_user', JSON.stringify(updatedUser));
    }
  };

  if (!themeCtx) return null;
  const { theme, colors } = themeCtx;

  const baseColor = colors.primary.split('-')[0];
  const primaryCard = `bg-${baseColor}-600`;
  const secondaryCard = `bg-${baseColor}-500`;
  const tertiaryCard = `bg-${baseColor}-400`;
  const accentCard = theme === 'default' ? "bg-blue-600" : `bg-${baseColor}-600`;

  const taButtonTitle = `${user?.customTASubject || 'Psychology'} Assistant`;
  const hasAccounting = user?.selectedMajors?.includes('Accounting') || user?.selectedCareers?.includes('Accountant');

  const renderSection = (id: string, index: number) => {
    const isDragging = draggedIndex === index;
    const commonSectionProps = {
      draggable: true,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, index),
      onDragOver: (e: React.DragEvent) => handleDragOver(e, index),
      onDragEnd: handleDragEnd,
      className: `group relative transition-all duration-300 ${isDragging ? 'opacity-30 scale-95' : 'opacity-100'}`
    };

    const dragHandle = (
      <div className="absolute -left-8 top-1 hidden md:flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-20 hover:opacity-100 transition-opacity">
        <i className="fa-solid fa-grip-vertical text-xl"></i>
      </div>
    );

    if (id === 'professional' && visibility.careerMode) {
      return (
        <section key={id} {...commonSectionProps}>
          {dragHandle}
          <h2 className="text-2xl font-black mb-6 flex items-center">
            <i className={`fa-solid fa-briefcase mr-3 text-${colors.primary}`}></i> 
            Professional Hub
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibility.taMode && (
              <ActionCard 
                title={taButtonTitle} 
                desc={`Context-aware grading and AI logic for ${user?.customTASubject || 'Psychology'}.`} 
                icon="fa-check-to-slot" 
                color={primaryCard} 
                onClick={() => navigate('/grading')} 
              />
            )}
            {hasAccounting && (
              <ActionCard 
                title="Accounting HQ" 
                desc="Analyze transactions and GAAP rules." 
                icon="fa-calculator" 
                color={accentCard} 
                onClick={() => navigate('/accounting')} 
              />
            )}
            {visibility.emailEditor && <ActionCard title="Email Studio" desc="Smart drafting for correspondence." icon="fa-envelope-open-text" color={secondaryCard} onClick={() => navigate('/email-editor')} />}
            {visibility.docDrafter && <ActionCard title="Doc Drafter" desc="AI structure for documents." icon="fa-file-signature" color={tertiaryCard} onClick={() => navigate('/doc-drafter')} />}
          </div>
        </section>
      );
    }

    if (id === 'academic' && visibility.studentMode) {
      return (
        <section key={id} {...commonSectionProps}>
          {dragHandle}
          <h2 className="text-2xl font-black mb-6 flex items-center"><i className={`fa-solid fa-graduation-cap mr-3 text-${colors.primary}`}></i> Academic Hub</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard title="Study Lab" desc="Synthesize lecture notes and readings." icon="fa-laptop-code" color={primaryCard} onClick={() => navigate('/study')} />
            {visibility.visionAide && (
              <ActionCard 
                  title="Vision Assistant" 
                  desc="Visual analysis and OCR helper." 
                  icon="fa-eye" 
                  color={secondaryCard} 
                  onClick={() => navigate('/accessibility')} 
              />
            )}
            <ActionCard title="Knowledge Vault" desc="Central repository for lecture data." icon="fa-vault" color={tertiaryCard} onClick={() => navigate('/vault')} />
          </div>
        </section>
      );
    }

    if (id === 'personal' && visibility.personal) {
      return (
        <section key={id} {...commonSectionProps}>
          {dragHandle}
          <h2 className="text-2xl font-black mb-6 flex items-center"><i className={`fa-solid fa-heart-pulse mr-3 text-${colors.primary}`}></i> Personal Life</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibility.calendar && (
              <ActionCard 
                title="Calendar" 
                desc="View events and sync schedules." 
                icon="fa-calendar-day" 
                color={primaryCard} 
                onClick={() => navigate('/calendar')} 
              />
            )}
            {visibility.budget && (
              <ActionCard title="Personal Ledger" desc="Budget and spending tracker." icon="fa-wallet" color={secondaryCard} onClick={() => navigate('/budget')} />
            )}
            {(visibility.fitness || visibility.nutrition) && (
              <ActionCard 
                title="Wellness Suite" 
                desc="Track workouts and caloric intake." 
                icon="fa-dumbbell" 
                color={tertiaryCard} 
                onClick={() => navigate(visibility.fitness ? '/fitness' : '/nutrition')} 
              />
            )}
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <div className={`max-w-6xl mx-auto pb-12 text-${colors.text}`}>
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-6xl font-black mb-1 tracking-tighter">My Universe</h1>
          <p className={`text-${colors.primary} font-bold italic opacity-80 text-lg`}>Nexus: your personal assistant</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest opacity-20 mr-4">
            <i className="fa-solid fa-hand-pointer"></i>
            <span>Drag sections to reorder</span>
          </div>

          {user?.isLoggedIn && (
            <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm p-2 rounded-full border border-white shadow-sm">
               <img src={user.picture} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
               <div className="flex flex-col pr-4">
                <span className="font-bold text-[10px] uppercase tracking-widest opacity-40 text-left">Persona Active</span>
                <span className="font-black text-sm">{user.name}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <UpcomingBanner events={upcomingEvents} color={colors.primary} />

      <div className="space-y-16">
        {sectionOrder.map((sectionId, index) => renderSection(sectionId, index))}
      </div>

      <footer className="mt-20 pt-10 border-t border-gray-100 text-center opacity-40 text-sm font-bold tracking-widest uppercase">Nexus AI Platform &bull; {themeCtx.theme} Engine</footer>
    </div>
  );
};

export default Dashboard;
