# 🧠 Neuro Gen AI 2.0 — Neural EEG Intelligence Platform

> **From EEG Signal Processing to Evidence-Grounded AI Insights**  
> *AI-Assisted Neural Pattern Screening, Feature Importance, FAISS Literature RAG, & Generative Explainability*

---

## 📌 Executive Summary

Traditional EEG analysis requires deep domain expertise to interpret multi-channel spectral signals, power ratios, and regional abnormalities. **Neuro Gen AI** bridges signal processing and clinical understandability by combining:

1. **MNE-Python Signal Preprocessing**: 250Hz resampling, 50Hz notch filter, 0.5–45Hz bandpass filter, average re-referencing.
2. **Random Forest Machine Learning**: Pre-trained 300-estimator ensemble combined 50/50 with an 8-biomarker rule engine.
3. **Explainable AI (XAI)**: Feature Importance (Mean Decrease in Impurity) & anatomical region/band contribution breakdown.
4. **FAISS Literature RAG**: Vector search over 32 indexed peer-reviewed neurophysiology publications.
5. **Generative AI Gateway**: Server-side multi-model integration (OpenRouter API → Google Gemini → Ollama Local) with responsible medical safety disclaimers.

---

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.9+
- Node.js 18+ & npm

### 1. Backend Engine (FastAPI) Setup

```bash
# Clone the repository
git clone https://github.com/pranay-surya/ENIGMA_2.0__TeamGenAI.git
cd NeuroGenAI

# Set up Python virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI Backend Server (runs on http://127.0.0.1:8000)
python api.py
```

### 2. Frontend Client (Vite + React + TypeScript) Setup

```bash
# Navigate to frontend directory
cd frontend

# Install node dependencies
npm install

# Start Vite Development Server (runs on http://localhost:3000)
npm run dev
```

---

## 🏗️ System Architecture Flow

```
User / Healthcare Professional
             │
             ▼
     ┌───────────────┐
     │  Vite React UI│ (Instant <100ms client navigation)
     └───────┬───────┘
             │ Upload EEG (.edf, .set, .cnt) / Try Demo Signal
             ▼
   ┌──────────────────┐
   │ FastAPI Backend  │ (Preloaded ML Model & FAISS Index)
   └─────────┬────────┘
             │
 ┌───────────┴───────────┐
 │ 1. MNE Preprocessing  │ (250Hz, Notch 50Hz, Bandpass 0.5-45Hz)
 └───────────┬───────────┘
             │
 ┌───────────┴───────────┐
 │ 2. Feature Vectorizer │ (Welch PSD, Theta/Alpha Ratio, Band Powers)
 └───────────┬───────────┘
             │
 ┌───────────┴───────────┐
 │ 3. Random Forest (50%)│ + 8-Biomarker Rule Engine (50%)
 └───────────┬───────────┘
             │
 ┌───────────┴───────────┐
 │ 4. Feature Importance │ (MDI & Anatomical Regional Weights)
 └───────────┬───────────┘
             │
 ┌───────────┴───────────┐
 │ 5. FAISS RAG Retrieval│ (32 Literature Chunks)
 └───────────┬───────────┘
             │
 ┌───────────┴───────────┐
 │ 6. Generative AI      │ (OpenRouter / Gemini / Ollama)
 └───────────┬───────────┘
             │
             ▼
   ┌──────────────────┐
   │ AI Report & Chat │ (Markdown Clinical Screening Summary)
   └──────────────────┘
```

---

## 🎯 High-Value Features

| Feature | Description |
|---|---|
| 🧪 **Demo Mode (`Try Demo Analysis`)** | One-click real pipeline execution using preloaded sample EEG datasets (no file required for judge testing). |
| 📈 **Interactive EEG Waveform Trace** | Multi-channel interactive waveform trace with time-range selection and spectral band distribution charts. |
| ⚛️ **Explainable AI (MDI)** | Top contributing features with explicit Gini importance percentages and directional indicators (`Suppressed 📉` / `Elevated 📈`). |
| 🛡️ **FAISS Literature RAG** | Vector search over peer-reviewed research papers returning relevance scores and literature excerpts. |
| 🤖 **Contextual AI Neuro Assistant** | Grounded clinical chat assistant aware of active patient features, XAI weights, and retrieved RAG sources. |
| 📄 **Clinical Report Compiler** | Multi-section clinical screening report exportable in Markdown (.md) and Plain Text. |
| ⚖️ **Side-by-Side Comparison** | Select two historical EEG recordings to compare risk scores, model confidence, and biomarker profiles side-by-side. |

---

## 🔒 Security & Environment Configuration

Configuration is managed via `.env` on the backend server. **Zero API keys are exposed to the frontend client.**

```ini
# Copy .env.example to .env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=google/gemini-2.0-flash-lite-preview:free
GEMINI_API_KEY=your-gemini-api-key-here
OLLAMA_BASE_URL=http://localhost:11434
CLOUDINARY_URL=cloudinary://your-key:your-secret@your-cloud-name
```

---

## ⚠️ Responsible Medical Safety Disclaimer

> **Neuro Gen AI provides AI-assisted EEG analysis for screening and research support. Results do not constitute a definitive medical diagnosis and must be evaluated by a qualified healthcare professional (neurologist or clinical neurophysiologist).**
