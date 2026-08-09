import React, { useEffect, useState } from 'react';
import { searchRAG } from '../api';
import type { RAGSource } from '../types';

export const RAGEvidencePage: React.FC = () => {
  const [sources, setSources] = useState<RAGSource[]>([]);
  const [query, setQuery] = useState('schizophrenia frontal theta alpha power biomarker');

  const handleSearch = async () => {
    const res = await searchRAG(query);
    setSources(res);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Evidence Behind This Analysis</h1>
        <p className="text-xs text-slate-500">Grounded by 32 indexed research literature sources from FAISS vector search.</p>
      </div>

      <div className="flex gap-3">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search knowledge base..."
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500"
        />
        <button onClick={handleSearch} className="btn-primary text-xs px-5">
          🔍 Search Vector KB
        </button>
      </div>

      <div className="space-y-4">
        {sources.map((src, idx) => (
          <div key={idx} className="ng-card space-y-2">
            <div className="flex justify-between items-center">
              <strong className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{idx + 1}. {src.source}</strong>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-300">
                Relevance: {(src.score * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              "{src.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
