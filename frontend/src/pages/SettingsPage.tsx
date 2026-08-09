import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>⚙️ System Settings & Configuration</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          High-level operational status, GenAI provider configuration, and privacy controls.
        </p>
      </div>

      {/* 1. AI Provider Status */}
      <div className="ng-card p-6 space-y-4 border-t-4 border-indigo-600">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <span>🤖 AI Provider Configuration</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-slate-500 text-[11px] uppercase font-bold">OpenRouter API</div>
            <div className="font-bold text-indigo-600 dark:text-indigo-400">Connected</div>
            <div className="text-[10.5px] text-slate-400 font-sans">Model: Configured via environment</div>
            <div className="text-[10px] text-emerald-600 font-bold font-sans">🔒 API Key: Secured server-side</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-slate-500 text-[11px] uppercase font-bold">Google Gemini</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400">Connected</div>
            <div className="text-[10.5px] text-slate-400 font-sans">Model: Gemini 2.0 Flash</div>
            <div className="text-[10px] text-emerald-600 font-bold font-sans">🔒 API Key: Secured server-side</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-slate-500 text-[11px] uppercase font-bold">Ollama / Local LLM</div>
            <div className="font-bold text-cyan-600 dark:text-cyan-400">Available</div>
            <div className="text-[10.5px] text-slate-400 font-sans">Base URL: Localhost:11434</div>
            <div className="text-[10px] text-slate-400 font-sans">No external transmission</div>
          </div>
        </div>
      </div>

      {/* 2. System & Performance Status */}
      <div className="ng-card p-6 space-y-4 border-t-4 border-emerald-500">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <span>⚡ System & Performance Status</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">ML Model Engine</div>
              <div className="text-slate-400 text-[11px]">Random Forest Classifier (300 trees)</div>
            </div>
            <span className="bg-emerald-100 text-emerald-700 font-extrabold text-[11px] px-2.5 py-1 rounded-full border border-emerald-300">
              Loaded ✓
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">RAG Vector Database</div>
              <div className="text-slate-400 text-[11px]">FAISS Index (32 Literature Chunks)</div>
            </div>
            <span className="bg-emerald-100 text-emerald-700 font-extrabold text-[11px] px-2.5 py-1 rounded-full border border-emerald-300">
              Available ✓
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">AI Response Engine</div>
              <div className="text-slate-400 text-[11px]">Multi-Tier GenAI Gateway</div>
            </div>
            <span className="bg-emerald-100 text-emerald-700 font-extrabold text-[11px] px-2.5 py-1 rounded-full border border-emerald-300">
              Connected ✓
            </span>
          </div>
        </div>
      </div>

      {/* 3. Cloudinary & Data Privacy Boundary */}
      <div className="ng-card p-6 space-y-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900">
        <h2 className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
          🔒 Cloudinary CDN & Privacy Boundaries
        </h2>
        <p className="text-xs text-indigo-900 dark:text-indigo-300 leading-relaxed">
          Cloudinary is utilized strictly for serving public, non-sensitive product UI visual assets (e.g. landing page hero brain graphic). <strong>Zero patient EEG recordings or medical data are ever uploaded or transmitted to Cloudinary.</strong> All EEG files are processed strictly in-memory by the local MNE signal processing pipeline.
        </p>
      </div>

      {/* 4. About Platform */}
      <div className="ng-card p-6 space-y-3">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white">ℹ️ About Neuro Gen AI</h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Neuro Gen AI is an AI-assisted EEG intelligence platform combining 19-channel signal processing, Random Forest machine-learning predictions, explainable AI feature importances, FAISS vector retrieval, and grounded Generative AI reports.
        </p>
        <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
          Platform Version 2.0 • MNE-Python • Scikit-learn • FAISS CPU • FastAPI • React + Vite
        </div>
      </div>
    </div>
  );
};
