import { useState, useEffect } from 'react';
import { PublicNavbar } from './components/PublicNavbar';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';

import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisHistoryPage } from './pages/AnalysisHistoryPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { ResultsPage } from './pages/ResultsPage';
import { ExplainableAIPage } from './pages/ExplainableAIPage';
import { RAGEvidencePage } from './pages/RAGEvidencePage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AIReportPage } from './pages/AIReportPage';
import { SettingsPage } from './pages/SettingsPage';

import { fetchDemoResult } from './api';
import type { AnalysisResult, HistoryItem } from './types';

const DEFAULT_HISTORY: HistoryItem[] = [
  { id: 'NGAI-24-081', file: 'eeg_sample_24.set', risk: 'HIGH', risk_pct: 87.0, confidence: '87%', signal_quality: 'GOOD', date: '09 May 2025' },
  { id: 'NGAI-24-082', file: 'patient_23.edf', risk: 'MODERATE', risk_pct: 52.0, confidence: '72%', signal_quality: 'GOOD', date: '08 May 2025' },
  { id: 'NGAI-24-083', file: 'brainwave_07.set', risk: 'LOW', risk_pct: 18.0, confidence: '91%', signal_quality: 'GOOD', date: '07 May 2025' },
  { id: 'NGAI-24-084', file: 'eeg_record_21.edf', risk: 'MODERATE', risk_pct: 58.0, confidence: '68%', signal_quality: 'GOOD', date: '07 May 2025' },
];

export default function App() {
  const [activePage, setActivePage] = useState<string>('Landing Page');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(DEFAULT_HISTORY);

  useEffect(() => {
    // Preload instant demo result in background
    fetchDemoResult().then((res) => {
      setCurrentResult(res);
      const demoItem: HistoryItem = {
        id: res.job_id || 'demo_schiz',
        file: res.filename || 'sample.edf',
        risk: res.risk_pct >= 65 ? 'HIGH' : res.risk_pct >= 35 ? 'MODERATE' : 'LOW',
        risk_pct: res.risk_pct,
        confidence: `${res.ml_pct.toFixed(1)}%`,
        signal_quality: 'GOOD',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        result: res,
      };
      setHistory((prev) => [demoItem, ...prev.filter((i) => i.id !== demoItem.id)]);
    });
  }, []);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleResultLoaded = (res: AnalysisResult) => {
    setCurrentResult(res);
    const item: HistoryItem = {
      id: res.job_id,
      file: res.filename || 'uploaded_recording.edf',
      risk: res.risk_pct >= 65 ? 'HIGH' : res.risk_pct >= 35 ? 'MODERATE' : 'LOW',
      risk_pct: res.risk_pct,
      confidence: `${res.ml_pct.toFixed(1)}%`,
      signal_quality: 'GOOD',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      result: res,
    };
    setHistory((prev) => [item, ...prev.filter((i) => i.id !== item.id)]);
  };

  const isLanding = activePage === 'Landing Page';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white">
      {isLanding ? (
        /* PUBLIC LANDING PAGE VIEW (ZERO SIDEBAR / ZERO HEAVY BACKEND INITIALIZATION) */
        <div className="w-full">
          <PublicNavbar onNavigate={handleNavigate} />
          <LandingPage onNavigate={handleNavigate} />
        </div>
      ) : (
        /* APPLICATION DASHBOARD VIEW (SIDEBAR + TOPBAR + SINGLE PAGE RENDERER) */
        <div className="flex min-h-screen">
          <Sidebar activePage={activePage} onNavigate={handleNavigate} />
          
          <div className="flex-1 flex flex-col min-w-0">
            <DashboardHeader activePage={activePage} onNavigate={handleNavigate} />

            <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
              {activePage === 'Overview' && (
                <OverviewPage 
                  history={history} 
                  onNavigate={handleNavigate} 
                  onSelectResult={(res) => setCurrentResult(res)} 
                />
              )}

              {activePage === 'Analyze EEG' && (
                <AnalyzePage 
                  onNavigate={handleNavigate} 
                  onResultLoaded={handleResultLoaded} 
                />
              )}

              {activePage === 'Analysis History' && (
                <AnalysisHistoryPage 
                  history={history} 
                  onNavigate={handleNavigate} 
                  onSelectResult={(res) => setCurrentResult(res)} 
                />
              )}

              {activePage === 'Processing EEG' && (
                <ProcessingPage onNavigate={handleNavigate} />
              )}

              {activePage === 'Results' && (
                currentResult ? (
                  <ResultsPage result={currentResult} onNavigate={handleNavigate} />
                ) : (
                  <div className="ng-card text-center p-8 max-w-lg mx-auto my-12 space-y-4">
                    <div className="text-3xl">📊</div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Analysis Results Available</h2>
                    <p className="text-xs text-slate-500">Please upload an EEG file or run the instant demo to generate results.</p>
                    <button onClick={() => handleNavigate('Analyze EEG')} className="btn-primary text-xs px-6 py-2.5 font-bold">
                      🚀 Analyze EEG Now
                    </button>
                  </div>
                )
              )}

              {activePage === 'Explainable AI' && (
                <ExplainableAIPage 
                  jobId={currentResult?.job_id || 'demo_schiz'} 
                  onNavigate={handleNavigate} 
                />
              )}

              {activePage === 'RAG Evidence' && (
                <RAGEvidencePage />
              )}

              {activePage === 'AI Neuro Assistant' && (
                <AIAssistantPage jobId={currentResult?.job_id || 'demo_schiz'} />
              )}

              {activePage === 'AI Report' && (
                <AIReportPage jobId={currentResult?.job_id || 'demo_schiz'} />
              )}

              {activePage === 'Settings' && (
                <SettingsPage />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
