
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

const PersonalLife: React.FC = () => {
  const navigate = useNavigate();
  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;
  const { colors } = themeCtx;

  const PersonalCard = ({ title, desc, icon, path, color }: { title: string, desc: string, icon: string, path: string, color: string }) => (
    <button 
      onClick={() => navigate(path)}
      className={`p-8 rounded-[3rem] text-left group transition-all transform hover:scale-[1.02] bg-white border border-gray-100 shadow-sm hover:shadow-xl flex flex-col justify-between h-[280px]`}
    >
      <div className={`p-5 rounded-2xl w-fit mb-4 transition-colors ${color} text-white shadow-lg`}>
        <i className={`fa-solid ${icon} text-3xl`}></i>
      </div>
      <div>
        <h3 className="text-2xl font-black mb-2 tracking-tight">{title}</h3>
        <p className="text-sm font-medium opacity-60 leading-relaxed">{desc}</p>
      </div>
    </button>
  );

  return (
    <div className={`max-w-6xl mx-auto pb-20 text-${colors.text}`}>
      <header className="mb-12">
        <div className="flex items-center space-x-4 mb-2">
          <div className={`p-3 rounded-2xl bg-rose-600/10 text-rose-600`}>
            <i className="fa-solid fa-heart text-2xl"></i>
          </div>
          <h2 className="text-4xl font-black tracking-tight">Personal Life</h2>
        </div>
        <p className="text-rose-600 opacity-70 font-bold italic">Manage your wellbeing, finances, and schedule.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <PersonalCard 
          title="Calendar" 
          desc="Synchronized scheduling for academic and personal events." 
          icon="fa-calendar-day" 
          path="/calendar" 
          color="bg-indigo-500" 
        />
        <PersonalCard 
          title="My Ledger" 
          desc="Track spending and income with personalized budgeting." 
          icon="fa-wallet" 
          path="/budget" 
          color="bg-rose-500" 
        />
        <PersonalCard 
          title="Gym Log" 
          desc="Workout tracking and fitness goal management." 
          icon="fa-dumbbell" 
          path="/fitness" 
          color="bg-pink-500" 
        />
        <PersonalCard 
          title="Nutrition" 
          desc="Meal logging and macronutrient tracking suite." 
          icon="fa-utensils" 
          path="/nutrition" 
          color="bg-teal-500" 
        />
      </div>

      <section className="mt-16 bg-white p-10 rounded-[4rem] border border-gray-100 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-30 mb-8 flex items-center">
            <i className="fa-solid fa-sparkles mr-2 text-rose-400"></i> Life Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-1">
                <span className="text-4xl font-black text-rose-600">$0.00</span>
                <p className="text-[10px] font-black uppercase opacity-40">Monthly Balance</p>
            </div>
            <div className="space-y-1">
                <span className="text-4xl font-black text-pink-600">0m</span>
                <p className="text-[10px] font-black uppercase opacity-40">Active Minutes</p>
            </div>
            <div className="space-y-1">
                <span className="text-4xl font-black text-teal-600">0</span>
                <p className="text-[10px] font-black uppercase opacity-40">Caloric Surplus/Deficit</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default PersonalLife;
