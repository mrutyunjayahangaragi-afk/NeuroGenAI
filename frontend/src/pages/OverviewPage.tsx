import React from 'react';
import type { HistoryItem, AnalysisResult } from '../types';

interface OverviewPageProps {
  history: HistoryItem[];
  onNavigate: (page: string) => void;
  onSelectResult: (result: AnalysisResult) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  history,
  onNavigate,
  onSelectResult,
}) => {
  // Calculate real metrics from history
  const total = history.length;
  const highCount = history.filter((i) => i.risk === 'HIGH').length;
  const modCount = history.filter((i) => i.risk === 'MODERATE').length;
  const lowCount = history.filter((i) => i.risk === 'LOW').length;

  const handleViewItem = (item: HistoryItem) => {
    if (item.result) {
      onSelectResult(item.result);
    }
    onNavigate('Results');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🧠 Neuro Gen AI Intelligence Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time quantitative metrics computed directly from stored patient analysis sessions.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('Analyze EEG')}
            className="btn-primary text-xs py-2.5 px-5 font-bold shadow-md hover:scale-105 transition-all"
          >
            ☁️ Analyze New EEG
          </button>
          <button
            onClick={() => onNavigate('Analysis History')}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs py-2.5 px-5 rounded-xl border border-slate-300 dark:border-slate-700 transition-all hover:scale-105"
          >
            📜 View History
          </button>
          <button
            onClick={() => onNavigate('AI Neuro Assistant')}
            className="bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs py-2.5 px-5 rounded-xl border border-indigo-300 dark:border-indigo-800 transition-all hover:scale-105"
          >
            🤖 Ask AI
          </button>
        </div>
      </div>

      {/* Top 4 Calculated Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="ng-card p-6 text-center border-t-4 border-indigo-600">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Analyses</div>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-3">{total}</div>
          <div className="text-[11px] text-slate-400 mt-1">Verified Session Records</div>
        </div>

        <div className="ng-card p-6 text-center border-t-4 border-rose-500">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">High Risk Cases</div>
          <div className="text-4xl font-extrabold text-rose-500 mt-3">{highCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {total > 0 ? `${((highCount / total) * 100).toFixed(0)}% of total` : '0%'}
          </div>
        </div>

        <div className="ng-card p-6 text-center border-t-4 border-amber-500">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Moderate Risk</div>
          <div className="text-4xl font-extrabold text-amber-500 mt-3">{modCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {total > 0 ? `${((modCount / total) * 100).toFixed(0)}% of total` : '0%'}
          </div>
        </div>

        <div className="ng-card p-6 text-center border-t-4 border-emerald-500">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Low Risk Cases</div>
          <div className="text-4xl font-extrabold text-emerald-500 mt-3">{lowCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {total > 0 ? `${((lowCount / total) * 100).toFixed(0)}% of total` : '0%'}
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Analyses & Risk Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Analyses List */}
        <div className="md:col-span-2 ng-card p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>📋 Recent Patient EEG Analyses</span>
            </h2>
            <button
              onClick={() => onNavigate('Analysis History')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              View All ({history.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {history.slice(0, 5).map((item) => {
              const isHigh = item.risk === 'HIGH';
              const isMod = item.risk === 'MODERATE';

              return (
                <div
                  key={item.id}
                  onClick={() => handleViewItem(item)}
                  className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer flex flex-wrap items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-extrabold text-sm group-hover:scale-105 transition-transform">
                      🧠
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {item.file}
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-mono">
                        ID: {item.id} • {item.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${
                      isHigh ? 'bg-rose-100 text-rose-700 border border-rose-300' : isMod ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    }`}>
                      {isHigh ? '🔴 HIGH RISK' : isMod ? '🟡 MODERATE' : '🟢 LOW RISK'} ({item.risk_pct.toFixed(1)}%)
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">{item.confidence}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Distribution Bar Visualizer */}
        <div className="ng-card p-6 space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">📊 Risk Distribution Breakdown</h2>
          <p className="text-xs text-slate-500">Proportional classification breakdown across active dataset sessions.</p>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-rose-600">🔴 High Risk</span>
                <span>{highCount} ({total > 0 ? ((highCount / total) * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-3 rounded-full transition-all duration-500" style={{ width: `${total > 0 ? (highCount / total) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-amber-600">🟡 Moderate Risk</span>
                <span>{modCount} ({total > 0 ? ((modCount / total) * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-3 rounded-full transition-all duration-500" style={{ width: `${total > 0 ? (modCount / total) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-600">🟢 Low Risk</span>
                <span>{lowCount} ({total > 0 ? ((lowCount / total) * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${total > 0 ? (lowCount / total) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
