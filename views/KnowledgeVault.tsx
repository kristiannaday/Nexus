
import React, { useState, useEffect } from 'react';
import { KnowledgeStore, Subject } from '../types';

const KnowledgeVault: React.FC = () => {
  const [subject, setSubject] = useState<Subject>("Psychology");
  const [knowledge, setKnowledge] = useState<KnowledgeStore>({
    psychology: { lectures: "", readings: "", textbook: "" },
    accounting: { concepts: "", rules: "", practice: "" }
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('assistant_knowledge_vault');
    if (stored) setKnowledge(JSON.parse(stored));
  }, []);

  const handleSave = () => {
    localStorage.setItem('assistant_knowledge_vault', JSON.stringify(knowledge));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateField = (field: string, val: string) => {
    if (subject === 'Psychology') {
      setKnowledge({ ...knowledge, psychology: { ...knowledge.psychology, [field]: val } });
    } else {
      setKnowledge({ ...knowledge, accounting: { ...knowledge.accounting, [field]: val } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Knowledge Vault</h2>
          <div className="bg-slate-100 p-1 rounded-xl flex w-fit mt-2">
            <button 
              onClick={() => setSubject('Psychology')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${subject === 'Psychology' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-400'}`}
            >Psychology</button>
            <button 
              onClick={() => setSubject('Accounting')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${subject === 'Accounting' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >Accounting</button>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
            saved ? 'bg-green-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-900'
          }`}
        >
          {saved ? 'Saved!' : 'Update Vault'}
        </button>
      </header>

      <div className="space-y-8">
        {subject === 'Psychology' ? (
          <>
            <VaultSection 
              title="Lecture Slides" 
              placeholder="Paste Psych 349 lectures..." 
              value={knowledge.psychology.lectures} 
              onChange={val => updateField('lectures', val)} 
              icon="fa-chalkboard-user"
              color="text-pink-500"
            />
            <VaultSection 
              title="Readings" 
              placeholder="Rainey, Helen Keller, etc..." 
              value={knowledge.psychology.readings} 
              onChange={val => updateField('readings', val)} 
              icon="fa-book-open"
              color="text-pink-500"
            />
          </>
        ) : (
          <>
            <VaultSection 
              title="Key Concepts" 
              placeholder="Accrual basis, Revenue recognition..." 
              value={knowledge.accounting.concepts} 
              onChange={val => updateField('concepts', val)} 
              icon="fa-brain"
              color="text-blue-500"
            />
            <VaultSection 
              title="GAAP Rules" 
              placeholder="FASB standards, rules for entries..." 
              value={knowledge.accounting.rules} 
              onChange={val => updateField('rules', val)} 
              icon="fa-scale-balanced"
              color="text-blue-500"
            />
          </>
        )}
      </div>
    </div>
  );
};

const VaultSection: React.FC<{ title: string; placeholder: string; value: string; onChange: (v: string) => void; icon: string; color: string }> = ({ title, placeholder, value, onChange, icon, color }) => (
  <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
    <div className="flex items-center space-x-3 mb-4">
      <div className="bg-slate-50 p-2 rounded-lg"><i className={`fa-solid ${icon} ${color}`}></i></div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    </div>
    <textarea
      className="w-full h-48 p-4 rounded-2xl border border-slate-50 bg-slate-50/20 focus:ring-2 focus:ring-slate-400 focus:outline-none text-sm shadow-inner"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </section>
);

export default KnowledgeVault;
