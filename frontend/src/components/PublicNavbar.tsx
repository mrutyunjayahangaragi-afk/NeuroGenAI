import React from 'react';

interface PublicNavbarProps {
  onNavigate: (page: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('Landing Page')}>
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/50 rounded-full flex items-center justify-center text-xl border border-indigo-200 dark:border-indigo-800">
            🧠
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Neuro Gen AI
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button onClick={() => onNavigate('Landing Page')} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 pb-1">
            Home
          </button>
          <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 transition-colors">
            How It Works
          </a>
          <a href="#technology" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 transition-colors">
            Technology
          </a>
          
          <button 
            onClick={() => onNavigate('Analyze EEG')}
            className="btn-primary text-sm font-bold px-5 py-2"
          >
            Get Started →
          </button>
        </div>
      </div>
    </div>
  );
};
