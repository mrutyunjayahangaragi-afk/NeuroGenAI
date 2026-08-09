"""
GenAI Service for Neuro Gen AI 2.0
Priority: OpenRouter API → Gemini API → Ollama local → Intelligent Clinical Engine.
All configuration through environment variables — no hard-coded secrets.
100% Server-side secure execution.
"""
from __future__ import annotations
import os
import json
import logging
from typing import Optional, Tuple, Dict, Any, Generator

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
#  LOAD .env IF PRESENT
# ─────────────────────────────────────────────────────────────────────────────
try:
    from dotenv import load_dotenv
    _env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(_env_path):
        load_dotenv(_env_path)
except ImportError:
    pass

# ─────────────────────────────────────────────────────────────────────────────
#  AVAILABILITY FLAGS
# ─────────────────────────────────────────────────────────────────────────────
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

try:
    import urllib.request, urllib.error
    URLLIB_AVAILABLE = True
except ImportError:
    URLLIB_AVAILABLE = False


# ─────────────────────────────────────────────────────────────────────────────
#  CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────
def get_config() -> dict:
    return {
        "provider":             os.getenv("GENAI_PROVIDER", "auto"),
        "openrouter_api_key":   os.getenv("OPENROUTER_API_KEY", ""),
        "openrouter_model":     os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-lite-preview:free"),
        "openrouter_base_url":  os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"),
        "gemini_api_key":       os.getenv("GEMINI_API_KEY", ""),
        "gemini_model":         os.getenv("GENAI_MODEL", "gemini-2.0-flash"),
        "ollama_base_url":      os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        "ollama_model":         os.getenv("OLLAMA_MODEL", "qwen3:4b"),
        "cloudinary_url":       os.getenv("CLOUDINARY_URL", ""),
        "cloudinary_hero_url":  os.getenv("CLOUDINARY_HERO_IMAGE_URL", ""),
    }


# ─────────────────────────────────────────────────────────────────────────────
#  OPENROUTER MODEL DISCOVERY
# ─────────────────────────────────────────────────────────────────────────────
def list_openrouter_free_models() -> list[dict]:
    """Query OpenRouter API for currently available free/fast models."""
    cfg = get_config()
    url = f"{cfg['openrouter_base_url'].rstrip('/')}/models"
    try:
        import urllib.request
        req = urllib.request.Request(url, headers={"User-Agent": "NeuroGenAI/2.0"})
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            models = data.get("data", [])
            free_models = [
                {"id": m["id"], "name": m.get("name", m["id"]), "context_length": m.get("context_length", 4096)}
                for m in models if "free" in m["id"].lower() or (m.get("pricing", {}).get("prompt") == "0" and m.get("pricing", {}).get("completion") == "0")
            ]
            return free_models or [{"id": cfg["openrouter_model"], "name": "Default OpenRouter Free Model"}]
    except Exception as e:
        logger.warning(f"Could not list OpenRouter models: {e}")
        return [{"id": cfg["openrouter_model"], "name": "Default Configured Model"}]


# ─────────────────────────────────────────────────────────────────────────────
#  PROVIDER DETECTION
# ─────────────────────────────────────────────────────────────────────────────
def detect_provider() -> Tuple[str, str]:
    """
    Detect available GenAI providers in priority order:
    1. OpenRouter (if OPENROUTER_API_KEY set)
    2. Gemini API (if GEMINI_API_KEY set)
    3. Ollama (if local daemon responding)
    4. Clinical Engine Fallback
    """
    cfg = get_config()

    # Priority 1: OpenRouter
    if cfg["openrouter_api_key"]:
        model_name = cfg["openrouter_model"]
        return "openrouter", f"OpenRouter API ready ({model_name})"

    # Priority 2: Gemini
    if GEMINI_AVAILABLE and cfg["gemini_api_key"]:
        try:
            genai.configure(api_key=cfg["gemini_api_key"])
            return "gemini", f"Gemini API ready ({cfg['gemini_model']})"
        except Exception as e:
            logger.warning(f"Gemini config error: {e}")

    # Priority 3: Ollama
    try:
        import urllib.request
        url = f"{cfg['ollama_base_url'].rstrip('/')}/api/tags"
        req = urllib.request.Request(url, headers={"User-Agent": "NeuroGenAI/2.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            models = [m["name"] for m in data.get("models", [])]
            if models:
                return "ollama", f"Ollama ready — {cfg['ollama_model']} ({len(models)} installed)"
    except Exception:
        pass

    return "clinical_engine", "Clinical Synthesis Engine ready (local deterministic fallback)"


# ─────────────────────────────────────────────────────────────────────────────
#  OPENROUTER GENERATION (WITH STREAMING SUPPORT)
# ─────────────────────────────────────────────────────────────────────────────
def _generate_openrouter(prompt: str, system: str = "") -> Optional[str]:
    cfg = get_config()
    api_key = cfg["openrouter_api_key"]
    if not api_key:
        return None

    url = f"{cfg['openrouter_base_url'].rstrip('/')}/chat/completions"
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload = json.dumps({
        "model": cfg["openrouter_model"],
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 1024,
    }).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "https://neurogenai.app",
        "X-Title": "Neuro Gen AI 2.0",
        "User-Agent": "NeuroGenAI/2.0",
    }

    try:
        import urllib.request
        req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=20) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            choices = res_data.get("choices", [])
            if choices and "message" in choices[0]:
                return choices[0]["message"]["content"].strip()
    except Exception as e:
        logger.warning(f"OpenRouter request failed: {e}")
    return None

def stream_openrouter_tokens(prompt: str, system: str = "") -> Generator[str, None, None]:
    """Stream response tokens chunk-by-chunk from OpenRouter SSE stream."""
    cfg = get_config()
    api_key = cfg["openrouter_api_key"]
    if not api_key:
        yield "OpenRouter API key not configured."
        return

    url = f"{cfg['openrouter_base_url'].rstrip('/')}/chat/completions"
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload = json.dumps({
        "model": cfg["openrouter_model"],
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 1024,
        "stream": True,
    }).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "https://neurogenai.app",
        "X-Title": "Neuro Gen AI 2.0",
        "User-Agent": "NeuroGenAI/2.0",
    }

    try:
        import urllib.request
        req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=30) as resp:
            for line in resp:
                line_str = line.decode("utf-8").strip()
                if line_str.startswith("data: "):
                    data_body = line_str[6:]
                    if data_body == "[DONE]":
                        break
                    try:
                        chunk = json.loads(data_body)
                        choices = chunk.get("choices", [])
                        if choices:
                            delta = choices[0].get("delta", {})
                            content = delta.get("content", "")
                            if content:
                                yield content
                    except json.JSONDecodeError:
                        continue
    except Exception as e:
        logger.warning(f"OpenRouter streaming error: {e}")
        yield f"\n[OpenRouter streaming interrupted: {e}]"


# ─────────────────────────────────────────────────────────────────────────────
#  GEMINI GENERATION
# ─────────────────────────────────────────────────────────────────────────────
def _generate_gemini(prompt: str, system: str = "") -> Optional[str]:
    cfg = get_config()
    if not GEMINI_AVAILABLE or not cfg["gemini_api_key"]:
        return None
    try:
        genai.configure(api_key=cfg["gemini_api_key"])
        model = genai.GenerativeModel(
            model_name=cfg["gemini_model"],
            system_instruction=system if system else None,
        )
        resp = model.generate_content(prompt)
        return resp.text.strip() if resp and resp.text else None
    except Exception as e:
        logger.warning(f"Gemini generation error: {e}")
        return None


# ─────────────────────────────────────────────────────────────────────────────
#  OLLAMA GENERATION
# ─────────────────────────────────────────────────────────────────────────────
def _generate_ollama(prompt: str, system: str = "") -> Optional[str]:
    cfg = get_config()
    full_prompt = f"System: {system}\n\nUser: {prompt}\n\nAssistant:" if system else prompt
    url = f"{cfg['ollama_base_url'].rstrip('/')}/api/generate"
    payload = json.dumps({"model": cfg["ollama_model"], "prompt": full_prompt, "stream": False}).encode("utf-8")
    try:
        import urllib.request
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json", "User-Agent": "NeuroGenAI/2.0"}, method="POST")
        with urllib.request.urlopen(req, timeout=40) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("response", "").strip()
    except Exception as e:
        logger.warning(f"Ollama generation error: {e}")
        return None


# ─────────────────────────────────────────────────────────────────────────────
#  UNIFIED GENERATE DISPATCHER
# ─────────────────────────────────────────────────────────────────────────────
def generate(prompt: str, system: str = "", provider: str = "auto") -> Tuple[str, str]:
    """
    Generate GenAI text with automatic fallbacks:
    OpenRouter → Gemini → Ollama → None
    Returns (text_response, provider_used)
    """
    # 1. OpenRouter
    res = _generate_openrouter(prompt, system)
    if res:
        return res, "openrouter"

    # 2. Gemini
    res = _generate_gemini(prompt, system)
    if res:
        return res, "gemini"

    # 3. Ollama
    res = _generate_ollama(prompt, system)
    if res:
        return res, "ollama"

    return "", "none"


# ─────────────────────────────────────────────────────────────────────────────
#  PROMPT HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def _system_prompt() -> str:
    return (
        "You are Neuro Gen AI, an advanced medical AI assistant specializing in quantitative EEG (qEEG) signal interpretation "
        "and neuroimaging analysis. Ground your responses strictly in the provided patient EEG metrics and retrieved FAISS literature citations. "
        "Do not invent medical facts. Provide clear, professional, structured Markdown responses with bold headings."
    )

def build_eeg_context(res: dict) -> str:
    risk_pct = res.get("risk_pct", 0.0)
    ml_pct = res.get("ml_pct", 0.0)
    rule_pct = res.get("rule_pct", 0.0)
    rb = res.get("rb_metrics", {})
    rules = res.get("rules", {})

    lines = [
        f"Ensemble Risk Score: {risk_pct:.1f}% ({'HIGH RISK' if risk_pct>=50 else 'LOW/CONTROL RISK'})",
        f"Random Forest Classifier Probability: {ml_pct:.1f}%",
        f"8-Biomarker Rule Engine Score: {rule_pct:.1f}%",
        f"Theta/Alpha Ratio (TAR): {rb.get('tar', 0):.3f} (Normal: 0.40–0.70)",
        f"Slow-Wave Dominance Index (SWD): {rb.get('swd', 0):.3f} (Normal: 0.40–0.60)",
        f"Frontal Alpha Relative Power: {rb.get('frontal_alpha_rel', 0):.3f} (Normal: >0.30)",
    ]
    for r_name, r_info in rules.items():
        lines.append(f"Rule '{r_name}': {r_info.get('value','')} (Normal: {r_info.get('normal_range','')}) -> Score {r_info.get('score',0)*100:.0f}%")
    return "\n".join(lines)

def build_assistant_prompt(user_question: str, eeg_ctx: str, rag_ctx: str) -> str:
    return (
        f"PATIENT EEG METRICS:\n{eeg_ctx}\n\n"
        f"RETRIEVED FAISS LITERATURE CITATIONS:\n{rag_ctx}\n\n"
        f"CLINICIAN QUESTION: {user_question}\n\n"
        "Provide a comprehensive, grounded clinical answer:"
    )
