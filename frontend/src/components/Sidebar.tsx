import React from 'react';
import brainImg from '../assets/brain.png';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: 'Landing Page', label: 'Landing Page', icon: '🏠' },
  { id: 'Overview', label: 'Overview', icon: '📊' },
  { id: 'Analyze EEG', label: 'Analyze EEG', icon: '☁️' },
  { id: 'Analysis History', label: 'Analysis History', icon: '📜' },
  { id: 'Processing EEG', label: 'Processing EEG', icon: '⚡' },
  { id: 'Results', label: 'Results', icon: '📈' },
  { id: 'Explainable AI', label: 'Explainable AI', icon: '⚛️' },
  { id: 'RAG Evidence', label: 'RAG Evidence', icon: '🛡️' },
  { id: 'AI Neuro Assistant', label: 'AI Neuro Assistant', icon: '🤖' },
  { id: 'AI Report', label: 'AI Report', icon: '📄' },
  { id: 'Settings', label: 'Settings', icon: '⚙️' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-200 border-r border-slate-800 p-5 flex flex-col justify-between min-h-screen shrink-0">
      <div>
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('Landing Page')}
          className="flex items-center gap-3 pb-5 border-b border-slate-800 mb-6 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform overflow-hidden bg-transparent">
              <img src={brainImg} alt="Brain" className="w-full h-full object-contain" />
            </div>
          <div>
            <div className="font-extrabold text-lg text-white tracking-tight leading-tight">Neuro Gen AI</div>
            <div className="text-xs text-slate-400 font-medium">Neural EEG Intelligence</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-md shadow-indigo-500/25'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Developer System Status */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mb-2">Model Configuration</div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 space-y-1 leading-relaxed">
          <div className="flex items-center justify-between">
            <span>System Status:</span>
            <span className="text-emerald-400 font-bold">✓ Operational</span>
          </div>
          <div>Model: <strong className="text-slate-200">Random Forest (300 trees)</strong></div>
          <div>RAG Index: <strong className="text-slate-200">FAISS (32 chunks)</strong></div>
          <div>GenAI: <strong className="text-slate-200">Gemini 2.0 / Ollama</strong></div>
        </div>
      </div>
    </aside>
  );
};
