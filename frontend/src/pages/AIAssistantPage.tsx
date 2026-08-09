import React, { useState } from 'react';
import { sendChatMessage } from '../api';
import type { ChatMessage } from '../types';

interface AIAssistantPageProps {
  jobId: string;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ jobId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `### 🧠 Welcome to Neuro Gen AI Clinical Assistant

I am your AI Neuro Assistant, grounded in your patient's **EEG signal metrics** and **32 peer-reviewed publications** via FAISS vector retrieval.

How can I assist you with patient analysis \`${jobId || 'NGAI-2025-0812'}\`?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const res = await sendChatMessage(text, jobId);
    const botMsg: ChatMessage = { role: 'assistant', content: res.reply, sources: res.sources };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: `### 🧠 Welcome to Neuro Gen AI Clinical Assistant

Conversation restarted. How can I assist you with patient analysis \`${jobId || 'NGAI-2025-0812'}\`?`
      }
    ]);
  };

  const PRESETS = [
    { label: '🧬 Explain TAR Ratio', query: 'Explain the Theta/Alpha Ratio (TAR: 3.42) for this patient' },
    { label: '⚛️ Top Contributing Regions', query: 'Which specific brain regions contributed most to the 89.6% risk score?' },
    { label: '🛡️ Literature Evidence', query: 'What peer-reviewed literature supports frontal alpha suppression?' },
    { label: '📋 Clinical Next Steps', query: 'What are the recommended clinical follow-ups for Dr. Sarah?' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🤖 AI Neuro Assistant</span>
            <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-300">
              v2.0 Grounded
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive clinical assistant synthesizing patient features, Random Forest predictions, and FAISS RAG literature.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            Patient ID: <strong className="text-indigo-600 dark:text-indigo-400">{jobId || 'NGAI-2025-0812'}</strong>
          </div>
          <button
            onClick={handleClear}
            className="text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
          >
            🗑️ Clear Chat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Column: Preset Questions */}
        <div className="ng-card space-y-3">
          <div className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-2">
            💡 Clinical Prompts
          </div>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              disabled={loading}
              className="w-full text-left text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-900 dark:hover:bg-indigo-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 transition-all font-medium leading-snug"
            >
              {p.label}
            </button>
          ))}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Grounding Sources</div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 space-y-1 font-mono">
              <div>• Patient Waveforms</div>
              <div>• 190 PSD Features</div>
              <div>• 32 Literature Chunks</div>
              <div>• Gemini 2.0 / Ollama</div>
            </div>
          </div>
        </div>

        {/* Right Column: Chat Box */}
        <div className="md:col-span-3 ng-card flex flex-col h-[560px]">
          {/* Message History Container */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-4 rounded-2xl max-w-[85%] leading-relaxed shadow-xs relative group ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {/* Cited Literature Cards */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] space-y-2">
                      <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <span>🛡️ Retrieved Literature Citations (FAISS Vector Match):</span>
                      </div>
                      {m.sources.map((s, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                          <div className="flex justify-between font-bold text-slate-900 dark:text-white mb-1">
                            <span>{idx + 1}. {s.source}</span>
                            <span className="text-emerald-500 font-extrabold">{(s.score * 100).toFixed(0)}%</span>
                          </div>
                          <p className="text-[10.5px] text-slate-500 italic leading-snug">"{s.text}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Copy Button */}
                  {m.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(m.content, i)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 px-2 py-1 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700 shadow-xs"
                    >
                      {copiedIndex === i ? '✓ Copied' : '📋 Copy'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold animate-pulse p-2">
                <span>🧠 Assistant is analyzing patient features and querying FAISS...</span>
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Assistant about patient biomarkers, features, or literature..."
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary text-xs px-6 py-3 disabled:opacity-50"
            >
              Send 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
