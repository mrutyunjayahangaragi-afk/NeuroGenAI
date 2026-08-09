import React from 'react';
import heroBrainImg from '../assets/hero_brain.png';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold mb-6">
            ⚡ AI-Powered EEG Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            AI-Powered EEG Analysis for <span className="text-indigo-600 dark:text-indigo-400">Smarter</span><br/>Neural Insights
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-xl">
            Analyze EEG signals with machine learning, understand model predictions, retrieve supporting evidence, and generate AI-assisted insights.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('Analyze EEG')}
              className="btn-primary text-sm font-bold px-7 py-3"
            >
              Analyze EEG Now
            </button>
            <button
              onClick={() => onNavigate('Results')}
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-xs"
            >
              Explore Demo
            </button>
          </div>
        </div>

        {/* Hero Brain Visual — Vite-bundled asset import, always resolves */}
        <div className="hero-brain-container">
          <div className="hero-brain-glow-bg"></div>
          <img
            src={heroBrainImg}
            alt="AI-generated visualization of a glowing human brain representing neural EEG intelligence"
            className="hero-brain-visual relative z-10"
            loading="eager"
            width="480"
            height="480"
          />
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Core Capabilities</div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">End-to-End Neural Intelligence Pipeline</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { id: 'Processing EEG', title: 'EEG Processing', sub: 'Filtering & Welch PSD', icon: '🧬' },
            { id: 'Overview', title: 'Machine Learning', sub: 'Random Forest Classifier', icon: '⚙️' },
            { id: 'Explainable AI', title: 'Explainable AI', sub: 'TAR & Biomarker Analysis', icon: '⚛️' },
            { id: 'RAG Evidence', title: 'RAG Evidence', sub: 'FAISS Vector Search', icon: '🛡️' },
            { id: 'AI Report', title: 'Generative AI', sub: 'Clinical Report Compiler', icon: '👁️' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="ng-card text-center cursor-pointer group hover:-translate-y-1 transition-transform"
            >
              <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl text-indigo-600 mx-auto mb-3 border border-slate-200 dark:border-slate-700">
                {item.icon}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">{item.title}</div>
              <div className="text-[11px] text-slate-500 mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What is Neuro Gen AI */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="ng-card text-center p-8 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900">
          <h3 className="text-xl font-extrabold mb-4 text-indigo-950 dark:text-indigo-200">What is Neuro Gen AI?</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6">
            Neuro Gen AI is an AI-powered EEG intelligence platform that transforms raw EEG recordings into structured analysis, machine-learning predictions, explainable insights, evidence-grounded information, and AI-generated reports.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Raw EEG</span> ➔ <span>Signal Processing</span> ➔ <span>Feature Extraction</span> ➔ <span>Machine Learning</span> ➔ <span>Prediction</span> ➔ <span>Explainable AI</span> ➔ <span>RAG Evidence</span> ➔ <span>Generative AI</span> ➔ <span>Report</span>
          </div>
        </div>
      </section>

      {/* Tech Stack & Models */}
      <section id="technology" className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Technical Models</div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Models Behind Neuro Gen AI</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="ng-card border-t-4 border-indigo-600">
            <div className="font-bold text-sm text-indigo-600 mb-1">Random Forest</div>
            <div className="text-xs text-slate-500 mb-3">EEG Classifier</div>
            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <div><strong>Input:</strong> 190 PSD Features</div>
              <div><strong>Trees:</strong> 300 estimators</div>
              <div><strong>Framework:</strong> Scikit-learn</div>
            </div>
          </div>

          <div className="ng-card border-t-4 border-cyan-500">
            <div className="font-bold text-sm text-cyan-500 mb-1">all-MiniLM-L6-v2</div>
            <div className="text-xs text-slate-500 mb-3">Sentence Embeddings</div>
            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <div><strong>Dimensions:</strong> 384 dense</div>
              <div><strong>Task:</strong> RAG Semantic Search</div>
              <div><strong>Framework:</strong> Transformers</div>
            </div>
          </div>

          <div className="ng-card border-t-4 border-emerald-500">
            <div className="font-bold text-sm text-emerald-500 mb-1">FAISS IndexFlatIP</div>
            <div className="text-xs text-slate-500 mb-3">Vector Database</div>
            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <div><strong>Metric:</strong> Cosine Similarity</div>
              <div><strong>Indexed:</strong> 32 KB Chunks</div>
              <div><strong>Engine:</strong> FAISS-CPU</div>
            </div>
          </div>

          <div className="ng-card border-t-4 border-purple-500">
            <div className="font-bold text-sm text-purple-500 mb-1">Gemini 2.0 / Ollama</div>
            <div className="text-xs text-slate-500 mb-3">Generative LLM</div>
            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <div><strong>Primary:</strong> Gemini 2.0 Flash</div>
              <div><strong>Local:</strong> Ollama qwen3:4b</div>
              <div><strong>Task:</strong> Clinical Synthesis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible AI Disclaimer */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl p-6 text-center">
          <div className="font-bold text-sm text-indigo-900 dark:text-indigo-300 mb-2">🔒 Responsible Healthcare AI Standard</div>
          <p className="text-xs text-indigo-700 dark:text-indigo-400 max-w-3xl mx-auto leading-relaxed">
            Neuro Gen AI is an AI-assisted screening and research support platform. It does not provide definitive medical diagnoses and should not replace evaluation by a qualified healthcare professional.
          </p>
        </div>
      </section>

      {/* Public Footer CTA */}
      <footer className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white py-12 px-6 mt-12 text-center">
        <h2 className="text-2xl font-extrabold mb-3">Turn EEG Signals Into Understandable AI Insights</h2>
        <p className="text-xs text-indigo-100 max-w-xl mx-auto mb-6">
          Explore how Neuro Gen AI combines machine learning, explainable AI, evidence retrieval, and generative intelligence.
        </p>
        <button
          onClick={() => onNavigate('Analyze EEG')}
          className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-sm px-8 py-3 rounded-xl shadow-lg transition-transform hover:scale-105"
        >
          🚀 Get Started — Analyze EEG
        </button>
      </footer>
    </div>
  );
};
