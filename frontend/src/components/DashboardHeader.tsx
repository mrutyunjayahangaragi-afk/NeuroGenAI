import React, { useState } from 'react';
import brainImg from '../assets/brain.png';

interface DashboardHeaderProps {
  activePage: string;
  onNavigate: (page: string) => void;
  aiProvider?: string;
}

const NAV_ITEMS = [
  { id: 'Overview', label: 'Overview', icon: '📊' },
  { id: 'Analyze EEG', label: 'Analyze EEG', icon: '☁️' },
  { id: 'Analysis History', label: 'History', icon: '📜' },
  { id: 'Results', label: 'Results', icon: '📈' },
  { id: 'Explainable AI', label: 'XAI', icon: '⚛️' },
  { id: 'RAG Evidence', label: 'RAG', icon: '🛡️' },
  { id: 'AI Neuro Assistant', label: 'Assistant', icon: '🤖' },
  { id: 'AI Report', label: 'Report', icon: '📄' },
  { id: 'Settings', label: 'Settings', icon: '⚙️' },
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activePage, onNavigate, aiProvider = 'ONLINE' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        {/* Left: Brand + Page */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile: Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Open Navigation Menu"
            id="mobile-menu-toggle"
          >
            <span className={`block h-0.5 w-5 bg-slate-700 dark:bg-slate-300 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 dark:bg-slate-300 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 dark:bg-slate-300 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          <div className="w-8 h-8 shrink-0 overflow-hidden">
            <img src={brainImg} alt="Brain" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white leading-tight truncate">
              Neuro Gen AI
            </h1>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold truncate block">{activePage}</span>
          </div>
        </div>

        {/* Center: Desktop Quick Nav */}
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
          {['Overview', 'Analyze EEG', 'Results', 'Explainable AI', 'RAG Evidence', 'AI Report'].map((p) => (
            <button
              key={p}
              onClick={() => onNavigate(p)}
              className={`hover:text-indigo-600 transition-colors ${
                activePage === p ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 pb-0.5' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Right: Status + Home */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden sm:block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            AI: <strong className="text-indigo-600 dark:text-indigo-400">{aiProvider.toUpperCase()}</strong>
          </div>

          <button
            onClick={() => handleNav('Landing Page')}
            className="text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all border border-slate-200"
          >
            🏠 <span className="hidden sm:inline">Home</span>
          </button>
        </div>
      </header>

      {/* Mobile Slide-Down Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-[57px] left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
                    activePage === item.id
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Neuro Gen AI 2.0</span>
              <span className="text-emerald-400 font-bold">✓ Operational</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
