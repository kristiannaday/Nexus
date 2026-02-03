
import React, { useState, useEffect } from 'react';
import { ExerciseEntry } from '../types';

const FitnessTracker: React.FC = () => {
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<'Low' | 'Moderate' | 'High'>('Moderate');

  useEffect(() => {
    const saved = localStorage.getItem('assistant_fitness');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const addEntry = () => {
    if (!type || !duration) return;
    const newEntry: ExerciseEntry = {
      id: Date.now().toString(),
      type,
      duration: parseInt(duration),
      intensity,
      date: new Date().toLocaleDateString()
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('assistant_fitness', JSON.stringify(updated));
    setType('');
    setDuration('');
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('assistant_fitness', JSON.stringify(updated));
  };

  const totalMinutes = entries.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-pink-950 mb-2">Gym Log</h2>
          <p className="text-pink-600/70">Stay consistent and track your energy.</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-1">Active Mins</p>
          <div className="px-6 py-2 rounded-full bg-pink-500 text-white font-black text-xl shadow-lg">
            {totalMinutes}m
          </div>
        </div>
      </header>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-pink-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-pink-400 mb-2">Activity Type</label>
            <input 
              type="text" 
              placeholder="e.g. Yoga, Pilates" 
              className="w-full p-4 rounded-2xl border border-pink-50 bg-pink-50/20 focus:ring-2 focus:ring-pink-400 outline-none text-pink-950"
              value={type}
              onChange={e => setType(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-pink-400 mb-2">Duration (mins)</label>
            <input 
              type="number" 
              placeholder="Minutes" 
              className="w-full p-4 rounded-2xl border border-pink-50 bg-pink-50/20 focus:ring-2 focus:ring-pink-400 outline-none text-pink-950"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-pink-400 mb-2">Intensity</label>
            <select 
              className="w-full p-4 rounded-2xl border border-pink-50 bg-pink-50/20 focus:ring-2 focus:ring-pink-400 outline-none font-bold text-pink-900"
              value={intensity}
              onChange={e => setIntensity(e.target.value as any)}
            >
              <option value="Low">Low Intensity</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High Power</option>
            </select>
          </div>
        </div>
        <button 
          onClick={addEntry}
          className="w-full mt-6 bg-pink-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-pink-700 transition-all flex items-center justify-center space-x-2"
        >
          <i className="fa-solid fa-heart-pulse"></i>
          <span>Save Workout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-6 rounded-3xl border border-pink-50 shadow-sm relative group overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-2 ${entry.intensity === 'High' ? 'bg-pink-800' : entry.intensity === 'Moderate' ? 'bg-pink-500' : 'bg-pink-300'}`}></div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-bold text-pink-900">{entry.type}</h4>
                <p className="text-sm font-medium text-pink-400">{entry.date}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-pink-600">{entry.duration}m</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FitnessTracker;
