import React, { useState } from 'react';
import brainNeuralImg from '../assets/brain_neural.jpg';
import { uploadAndAnalyzeEEG, fetchDemoResult } from '../api';
import type { AnalysisResult } from '../types';

interface AnalyzePageProps {
  onNavigate: (page: string) => void;
  onResultLoaded: (result: AnalysisResult) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onNavigate, onResultLoaded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ALLOWED_EXTENSIONS = ['.edf', '.set', '.cnt'];
  const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024; // 200MB

  const validateFile = (file: File): boolean => {
    setErrorMsg(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMsg(`❌ Invalid EEG File Format: "${ext}". Only .edf, .set, and .cnt files are supported.`);
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(`❌ File Too Large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed size is 200MB.`);
      return false;
    }

    if (file.size === 0) {
      setErrorMsg(`❌ Corrupted File: The selected file is empty (0 bytes).`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setErrorMsg(null);
    onNavigate('Processing EEG');
    try {
      const result = await uploadAndAnalyzeEEG(selectedFile);
      onResultLoaded(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Analysis failed. Please try again.';
      setErrorMsg(`❌ ${msg}`);
      onNavigate('Analyze EEG');
    }
    setLoading(false);
  };

  const handleLoadDemo = async () => {
    setLoading(true);
    onNavigate('Processing EEG');
    const demo = await fetchDemoResult();
    onResultLoaded(demo);
    setLoading(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Subtitle */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🧠 Analyze EEG</span>
          <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold px-2.5 py-0.5 rounded-full border border-indigo-300">
            Workspace
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Upload an EEG recording to extract neural features, run the trained ML model, and generate explainable, evidence-grounded insights.
        </p>
      </div>

      {/* Main Grid: Upload Area & Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`ng-card text-center p-8 flex flex-col items-center justify-center border-2 border-dashed transition-all ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl mb-4 border border-indigo-200 dark:border-indigo-800 overflow-hidden">
              <img src={brainNeuralImg} alt="Neural Brain" className="w-full h-full object-cover" />
            </div>

            <div className="font-extrabold text-slate-900 dark:text-white text-base mb-1">
              Upload EEG File
            </div>
            <div className="text-xs text-slate-500 mb-6">
              Drag & drop your EEG recording here, or click to browse
            </div>

            <label className="btn-primary cursor-pointer text-xs px-6 py-2.5 font-bold shadow-md hover:scale-105 transition-transform">
              <span>Browse Files</span>
              <input
                type="file"
                accept=".edf,.set,.cnt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>

            <div className="text-[11px] text-slate-400 mt-6 font-mono">
              Supported Formats: <strong className="text-slate-600 dark:text-slate-300">.EDF, .SET, .CNT</strong> • Max Size: <strong className="text-slate-600 dark:text-slate-300">200MB</strong>
            </div>
          </div>

          {/* Validation Error Banner */}
          {errorMsg && (
            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 p-4 rounded-xl text-xs font-semibold flex items-center gap-3">
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Selected File Details Box */}
          {selectedFile && (
            <div className="ng-card bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-emerald-200 dark:border-emerald-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 rounded-xl flex items-center justify-center font-bold text-lg">
                    📄
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-xs">{selectedFile.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {formatFileSize(selectedFile.size)} • {selectedFile.name.split('.').pop()?.toUpperCase()} Format
                    </div>
                  </div>
                </div>

                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] px-3 py-1 rounded-full border border-emerald-300">
                  ✓ Ready for analysis
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartAnalysis}
                  disabled={loading}
                  className="btn-primary flex-1 text-xs py-3 font-bold shadow-lg"
                >
                  🚀 Analyze EEG Now
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Dataset Loader */}
          <div className="ng-card bg-slate-100/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 p-5 text-center">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Don't have an EDF file ready?</div>
            <p className="text-[11px] text-slate-500 mb-3">Load sample multi-channel EEG recording to test model inference and XAI.</p>
            <button
              onClick={handleLoadDemo}
              disabled={loading}
              className="bg-white dark:bg-slate-800 hover:bg-indigo-50 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 transition-all shadow-xs hover:scale-105"
            >
              🧪 Load Instant Demo EDF Signal Data
            </button>
          </div>
        </div>

        {/* Right Sidebar: Guidelines & Preprocessing Info */}
        <div className="space-y-4">
          <div className="ng-card space-y-3">
            <div className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              📋 Preprocessing Pipeline
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5 leading-relaxed font-mono">
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span> 19-Channel 10-20 Standard Montage
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span> 250 Hz Resampling
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span> 50 Hz IIR Notch Filter
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span> 0.5–45 Hz Bandpass Filter
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span> Welch PSD Feature Extraction
              </li>
            </ul>
          </div>

          <div className="ng-card space-y-3 bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900">
            <div className="font-bold text-xs text-indigo-950 dark:text-indigo-200">
              🔒 Privacy & Compliance
            </div>
            <p className="text-[11.5px] text-indigo-800 dark:text-indigo-300 leading-relaxed">
              EEG signal files are processed in-memory. Zero patient files are transmitted to public CDNs or third-party storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
