import React, { useState } from 'react';
import type { HistoryItem, AnalysisResult } from '../types';

interface AnalysisHistoryPageProps {
  history: HistoryItem[];
  onNavigate: (page: string) => void;
  onSelectResult: (result: AnalysisResult) => void;
}

export const AnalysisHistoryPage: React.FC<AnalysisHistoryPageProps> = ({
  history,
  onNavigate,
  onSelectResult,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'HIGH_CONF' | 'LOW_CONF'>('NEWEST');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Filter records
  let filtered = history.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.file.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || item.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  // Sort records
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'NEWEST') return b.id.localeCompare(a.id);
    if (sortBy === 'OLDEST') return a.id.localeCompare(b.id);
    if (sortBy === 'HIGH_CONF') return parseFloat(b.confidence) - parseFloat(a.confidence);
    if (sortBy === 'LOW_CONF') return parseFloat(a.confidence) - parseFloat(b.confidence);
    return 0;
  });

  // Paginate records
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleView = (item: HistoryItem) => {
    if (item.result) {
      onSelectResult(item.result);
    }
    onNavigate('Results');
  };

  const handleReport = (item: HistoryItem) => {
    if (item.result) {
      onSelectResult(item.result);
    }
    onNavigate('AI Report');
  };

  const toggleSelectCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const itemA = history.find((i) => i.id === selectedForCompare[0]);
  const itemB = history.find((i) => i.id === selectedForCompare[1]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📜 Analysis History & Comparison</span>
            <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold px-2.5 py-0.5 rounded-full border border-indigo-300">
              {history.length} Saved Records
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, inspect, or compare stored patient EEG analysis sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedForCompare.length === 2 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition-all animate-pulse"
            >
              📊 Compare Selected ({selectedForCompare.length}) →
            </button>
          )}
          <button
            onClick={() => onNavigate('Analyze EEG')}
            className="btn-primary text-xs py-2.5 px-5 font-bold shadow-md"
          >
            ☁️ Analyze New EEG
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Section */}
      {showCompareModal && itemA && itemB && (
        <div className="ng-card p-6 bg-slate-900 text-white space-y-6 border-2 border-indigo-500 shadow-2xl relative">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="font-extrabold text-base text-indigo-400 flex items-center gap-2">
              <span>⚖️ Side-by-Side Analysis Comparison</span>
            </h2>
            <button 
              onClick={() => setShowCompareModal(false)}
              className="text-xs font-bold bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-slate-300"
            >
              ✕ Close Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* Analysis A */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-indigo-400 font-bold text-sm">Recording A: {itemA.file}</div>
              <div className="space-y-1">
                <div>ID: <strong>{itemA.id}</strong></div>
                <div>Date: {itemA.date}</div>
                <div>Risk: <strong className={itemA.risk === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}>{itemA.risk} ({itemA.risk_pct.toFixed(1)}%)</strong></div>
                <div>Confidence: {itemA.confidence}</div>
                <div>Signal Quality: {itemA.signal_quality}</div>
              </div>
            </div>

            {/* Analysis B */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-cyan-400 font-bold text-sm">Recording B: {itemB.file}</div>
              <div className="space-y-1">
                <div>ID: <strong>{itemB.id}</strong></div>
                <div>Date: {itemB.date}</div>
                <div>Risk: <strong className={itemB.risk === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}>{itemB.risk} ({itemB.risk_pct.toFixed(1)}%)</strong></div>
                <div>Confidence: {itemB.confidence}</div>
                <div>Signal Quality: {itemB.signal_quality}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls: Search, Filter, Sort */}
      <div className="ng-card p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="🔍 Search by Filename or Analysis ID..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Risk Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {(['ALL', 'HIGH', 'MODERATE', 'LOW'] as const).map((r) => (
            <button
              key={r}
              onClick={() => { setRiskFilter(r); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                riskFilter === r
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {r === 'ALL' ? 'All' : r === 'HIGH' ? '🔴 High Risk' : r === 'MODERATE' ? '🟡 Moderate' : '🟢 Low'}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="HIGH_CONF">Highest Confidence</option>
            <option value="LOW_CONF">Lowest Confidence</option>
          </select>
        </div>
      </div>

      {/* Main Table / Mobile Cards */}
      {paginated.length === 0 ? (
        <div className="ng-card text-center py-16 space-y-4">
          <div className="text-4xl">📭</div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">No EEG analyses found</h2>
          <p className="text-xs text-slate-500">No stored analysis sessions matched your search or filter criteria.</p>
          <button
            onClick={() => onNavigate('Analyze EEG')}
            className="btn-primary text-xs py-2.5 px-6 font-bold"
          >
            ☁️ Analyze Your First EEG
          </button>
        </div>
      ) : (
        <div className="ng-card p-0 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold uppercase text-[10.5px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Select</th>
                  <th className="px-6 py-3.5">Analysis ID</th>
                  <th className="px-6 py-3.5">Recording File</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Risk Classification</th>
                  <th className="px-6 py-3.5">Confidence</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {paginated.map((item) => {
                  const isHigh = item.risk === 'HIGH';
                  const isMod = item.risk === 'MODERATE';
                  const isSelected = selectedForCompare.includes(item.id);
                  return (
                    <tr key={item.id} className={`hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-950/40' : ''}`}>
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectCompare(item.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">{item.id}</td>
                      <td className="px-6 py-4 font-sans font-semibold text-slate-900 dark:text-white">{item.file}</td>
                      <td className="px-6 py-4 text-slate-400">{item.date}</td>
                      <td className="px-6 py-4 font-sans">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${
                          isHigh ? 'bg-rose-100 text-rose-700 border border-rose-300' : isMod ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        }`}>
                          {isHigh ? '🔴 HIGH RISK' : isMod ? '🟡 MODERATE' : '🟢 LOW RISK'} ({item.risk_pct.toFixed(1)}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-600">{item.confidence}</td>
                      <td className="px-6 py-4 text-right space-x-2 font-sans">
                        <button
                          onClick={() => handleView(item)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow transition-all"
                        >
                          View Results
                        </button>
                        <button
                          onClick={() => handleReport(item)}
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-[11px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 transition-all"
                        >
                          Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-800 p-4 space-y-4">
            {paginated.map((item) => (
              <div key={item.id} className="pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-indigo-600">{item.id}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">{item.file}</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">{item.risk} ({item.risk_pct.toFixed(1)}%)</span>
                  <span className="text-xs font-extrabold text-indigo-600">{item.confidence}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => handleView(item)} className="btn-primary w-full text-xs py-1.5">View Results</button>
                  <button onClick={() => handleReport(item)} className="w-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs py-1.5 rounded-xl">Report</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center text-xs font-bold text-slate-500">
            <div>Page {currentPage} of {totalPages} ({filtered.length} total records)</div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
