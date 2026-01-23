
import React, { useState, useEffect } from 'react';
import { BudgetEntry } from '../types';

const BudgetTracker: React.FC = () => {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    const saved = localStorage.getItem('assistant_budget');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const addEntry = () => {
    if (!desc || !amount) return;
    const newEntry: BudgetEntry = {
      id: Date.now().toString(),
      description: desc,
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleDateString()
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('assistant_budget', JSON.stringify(updated));
    setDesc('');
    setAmount('');
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('assistant_budget', JSON.stringify(updated));
  };

  const totalBalance = entries.reduce((acc, curr) => 
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
  );

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-pink-950 mb-2">My Ledger</h2>
          <p className="text-pink-600/70">Personal financial tracking in pink.</p>
        </div>
        <div className={`px-6 py-3 rounded-2xl font-black text-2xl shadow-sm border ${totalBalance >= 0 ? 'bg-pink-100 border-pink-200 text-pink-700' : 'bg-rose-100 border-rose-200 text-rose-700'}`}>
          ${totalBalance.toFixed(2)}
        </div>
      </header>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-pink-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input 
              type="text" 
              placeholder="Description (e.g., Pink Stationary)" 
              className="w-full p-4 rounded-2xl border border-pink-50 bg-pink-50/20 focus:outline-none focus:ring-2 focus:ring-pink-400 text-pink-900"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>
          <div>
            <input 
              type="number" 
              placeholder="Amount" 
              className="w-full p-4 rounded-2xl border border-pink-50 bg-pink-50/20 focus:outline-none focus:ring-2 focus:ring-pink-400 text-pink-900"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <button 
            onClick={addEntry}
            className="bg-pink-600 text-white font-bold rounded-2xl p-4 hover:bg-pink-700 transition-colors shadow-lg"
          >
            Log
          </button>
        </div>
        <div className="mt-4 flex space-x-4">
          <button 
            onClick={() => setType('expense')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${type === 'expense' ? 'bg-pink-600 text-white shadow-md' : 'bg-pink-50 text-pink-400'}`}
          >
            Expense
          </button>
          <button 
            onClick={() => setType('income')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${type === 'income' ? 'bg-pink-600 text-white shadow-md' : 'bg-pink-50 text-pink-400'}`}
          >
            Income
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-5 rounded-3xl border border-pink-50 shadow-sm flex items-center justify-between group">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${entry.type === 'income' ? 'bg-pink-50 text-pink-600' : 'bg-rose-50 text-rose-600'}`}>
                <i className={`fa-solid ${entry.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
              </div>
              <div>
                <h4 className="font-bold text-pink-950">{entry.description}</h4>
                <p className="text-xs text-pink-400 font-bold">{entry.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <span className={`font-black text-lg ${entry.type === 'income' ? 'text-pink-600' : 'text-rose-600'}`}>
                {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
              </span>
              <button 
                onClick={() => deleteEntry(entry.id)}
                className="text-pink-100 group-hover:text-rose-300 transition-colors"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetTracker;
