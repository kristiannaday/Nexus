
import React, { useState, useEffect } from 'react';
import { FoodEntry } from '../types';

const NutritionTracker: React.FC = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [name, setName] = useState('');
  const [cal, setCal] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const targets = { cal: 2000, protein: 150, carbs: 200, fat: 60 };

  useEffect(() => {
    const saved = localStorage.getItem('assistant_nutrition');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const addEntry = () => {
    if (!name || !cal) return;
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name,
      calories: parseInt(cal),
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      date: new Date().toLocaleDateString()
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('assistant_nutrition', JSON.stringify(updated));
    setName(''); setCal(''); setProtein(''); setCarbs(''); setFat('');
  };

  const totals = entries.reduce((acc, curr) => ({
    cal: acc.cal + curr.calories,
    p: acc.p + curr.protein,
    c: acc.c + curr.carbs,
    f: acc.f + curr.fat
  }), { cal: 0, p: 0, c: 0, f: 0 });

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-pink-950 mb-2">Kitchen & Nutrition</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <MacroPill label="Calories" current={totals.cal} target={targets.cal} color="bg-pink-600" />
          <MacroPill label="Protein" current={totals.p} target={targets.protein} color="bg-pink-400" />
          <MacroPill label="Carbs" current={totals.c} target={targets.carbs} color="bg-fuchsia-400" />
          <MacroPill label="Fat" current={totals.f} target={targets.fat} color="bg-rose-400" />
        </div>
      </header>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-pink-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <input type="text" placeholder="Food Name" className="w-full p-4 rounded-2xl bg-pink-50/30 border border-pink-50 focus:ring-2 focus:ring-pink-400 outline-none text-pink-950" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <input type="number" placeholder="Cals" className="p-4 rounded-2xl bg-pink-50/30 border border-pink-50 focus:ring-2 focus:ring-pink-400 outline-none text-pink-950" value={cal} onChange={e => setCal(e.target.value)} />
          <input type="number" placeholder="P (g)" className="p-4 rounded-2xl bg-pink-50/30 border border-pink-50 focus:ring-2 focus:ring-pink-400 outline-none text-pink-950" value={protein} onChange={e => setProtein(e.target.value)} />
          <div className="grid grid-cols-2 lg:flex gap-2">
             <input type="number" placeholder="C (g)" className="w-full p-4 rounded-2xl bg-pink-50/30 border border-pink-50 focus:ring-2 focus:ring-pink-400 outline-none text-pink-950" value={carbs} onChange={e => setCarbs(e.target.value)} />
             <input type="number" placeholder="F (g)" className="w-full p-4 rounded-2xl bg-pink-50/30 border border-pink-50 focus:ring-2 focus:ring-pink-400 outline-none text-pink-950" value={fat} onChange={e => setFat(e.target.value)} />
          </div>
        </div>
        <button onClick={addEntry} className="w-full mt-4 bg-pink-600 text-white font-black py-4 rounded-2xl hover:bg-pink-700 shadow-lg">Track Meal</button>
      </div>

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-6 rounded-3xl border border-pink-50 shadow-sm flex items-center justify-between">
            <div>
              <h4 className="font-bold text-pink-900 text-lg">{entry.name}</h4>
              <div className="flex space-x-4 mt-1">
                <span className="text-xs font-black text-pink-400">{entry.protein}P</span>
                <span className="text-xs font-black text-fuchsia-400">{entry.carbs}C</span>
                <span className="text-xs font-black text-rose-400">{entry.fat}F</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-pink-600">{entry.calories}</span>
              <p className="text-[10px] font-bold text-pink-300 uppercase">Calories</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MacroPill: React.FC<{ label: string; current: number; target: number; color: string }> = ({ label, current, target, color }) => {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <div className="bg-white p-4 rounded-3xl border border-pink-50 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest text-pink-300 mb-1">{label}</p>
      <div className="flex items-end space-x-2">
        <span className="text-xl font-black text-pink-950">{current}</span>
        <span className="text-[10px] font-bold text-pink-200 mb-1">/ {target}</span>
      </div>
      <div className="w-full bg-pink-50 h-2 rounded-full mt-2 overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};

export default NutritionTracker;
