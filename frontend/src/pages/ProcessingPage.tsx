import React, { useEffect, useState } from 'react';

interface ProcessingPageProps {
  onNavigate: (page: string) => void;
}

export const ProcessingPage: React.FC<ProcessingPageProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 8) {
          clearInterval(timer);
          setTimeout(() => {
            onNavigate('Results');
          }, 400);
          return 8;
        }
        return prev + 1;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [onNavigate]);

  const STEPS = [
    { num: '01', title: 'File validation' },
    { num: '02', title: 'EEG preprocessing' },
    { num: '03', title: 'Feature extraction' },
    { num: '04', title: 'ML prediction' },
    { num: '05', title: 'Explainable AI' },
    { num: '06', title: 'RAG evidence' },
    { num: '07', title: 'Generative AI' },
    { num: '08', title: 'Complete' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>⚡ Analyzing EEG Recording</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">Executing MNE preprocessing, Random Forest scoring, and FAISS RAG retrieval.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Animated Visual Card */}
        <div className="ng-card text-center p-10 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center text-4xl mb-6 border border-indigo-200 dark:border-indigo-800 animate-pulse">
            🧠⚡
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Neural Signal Processing Pipeline</h2>
          
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-3 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-3 rounded-full transition-all duration-200"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
            Step {currentStep} of 8 — {Math.round((currentStep / 8) * 100)}%
          </div>
        </div>

        {/* 8-Stage Timeline */}
        <div className="ng-card space-y-3">
          <div className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-2">
            ⚙️ Stage Execution Progress
          </div>

          <div className="space-y-2 text-xs font-mono">
            {STEPS.map((step, idx) => {
              const stepNum = idx + 1;
              const isDone = stepNum < currentStep || currentStep === 8;
              const isCurrent = stepNum === currentStep && currentStep < 8;

              return (
                <div 
                  key={step.num}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
                      : isCurrent
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{step.num}</span>
                    <span>{step.title}</span>
                  </div>

                  <span className="font-extrabold text-[11px]">
                    {isDone ? '✓ Complete' : isCurrent ? '⟳ Processing' : '○ Waiting'}
                  </span>
                </div>
              );
            })}
          </div>

          {currentStep === 8 && (
            <button
              onClick={() => onNavigate('Results')}
              className="btn-primary w-full text-xs py-3 mt-4 font-bold shadow-lg animate-bounce"
            >
              ➡️ View Results Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
