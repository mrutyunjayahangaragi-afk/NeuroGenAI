"""
Report Service for Neuro Gen AI 2.0
Generates structured AI clinical reports from EEG analysis results.
"""
from __future__ import annotations
import datetime
import hashlib
from typing import Optional


# ─────────────────────────────────────────────────────────────────────────────
#  REPORT GENERATOR
# ─────────────────────────────────────────────────────────────────────────────
def generate_report(
    result: dict,
    ai_summary: str = "",
    rag_sources: list[dict] | None = None,
    feature_df=None,
) -> str:
    """
    Generate a structured markdown clinical report.
    All content grounded in actual analysis — nothing fabricated.
    """
    if rag_sources is None:
        rag_sources = []

    now        = datetime.datetime.now()
    ts         = now.strftime("%Y-%m-%d %H:%M:%S")
    short_date = now.strftime("%Y%m%d_%H%M")

    # Build analysis ID from timestamp hash
    analysis_id = "NSA-" + hashlib.md5(ts.encode()).hexdigest()[:8].upper()

    risk    = result.get("risk_pct", 0.0)
    ml_pct  = result.get("ml_pct", 0.0)
    rb_pct  = result.get("rule_pct", 0.0)
    pred    = result.get("prediction", 0)
    method  = result.get("ensemble_method", "Ensemble")
    n_ch    = result.get("n_channels", 19)
    n_ep    = result.get("n_epochs", 0)
    sfreq   = result.get("sfreq", 250.0)
    dur     = result.get("duration_s", 0.0)
    is_demo = result.get("demo", False)

    # Risk classification
    if risk >= 65:
        risk_class = "HIGH RISK"
        risk_note  = "Significant biomarkers associated with schizophrenia detected."
    elif risk >= 35:
        risk_class = "MODERATE RISK"
        risk_note  = "Atypical EEG features detected; clinical evaluation recommended."
    else:
        risk_class = "LOW RISK"
        risk_note  = "EEG patterns within normal range for assessed biomarkers."

    pred_lbl = "Schizophrenia Risk" if pred == 1 else "Control / Low Risk"

    # Clinical metrics
    rb = result.get("rb_metrics", {})
    tar = rb.get("tar", 0)
    swd = rb.get("swd", 0)
    fa  = rb.get("frontal_alpha_rel", 0)
    pa  = rb.get("post_alpha_rel", 0)

    # Build rule table
    rules = result.get("rules", {})
    rule_rows = ""
    for name, rd in rules.items():
        status = "⚠️ FLAGGED" if rd["score"] > 0.5 else "✓ Normal"
        rule_rows += f"| {name} | {rd['value']} | {rd['normal_range']} | {rd['score']:.2f} | {status} |\n"

    # Band power summary from per_ch_band
    import numpy as np
    per_ch = result.get("per_ch_band", {})
    band_rows = ""
    bands = ["delta", "theta", "alpha", "beta", "gamma"]
    if per_ch:
        chs = list(per_ch.keys())
        for band in bands:
            avg = float(np.mean([per_ch[c][band] for c in chs if band in per_ch[c]]))
            band_rows += f"| {band.capitalize()} | {avg:.4f} µV²/Hz |\n"

    # Feature importance table
    feat_rows = ""
    if feature_df is not None and not feature_df.empty:
        for _, row in feature_df.head(5).iterrows():
            feat_rows += f"| {row['feature']} | {row['importance']:.4f} | {row.get('band','').capitalize()} | {row.get('region','')} |\n"

    # Sources
    ref_text = ""
    for i, src in enumerate(rag_sources, 1):
        ref_text += f"{i}. **{src['source']}** — relevance score: {src['score']:.2f}\n"
        ref_text += f"   > {src['text'][:150]}...\n\n"

    if not ref_text:
        ref_text = "*No external sources retrieved for this analysis.*\n"

    demo_banner = "\n> ⚠️ **DEMO MODE**: Results generated from synthetic data for demonstration purposes.\n" if is_demo else ""

    report = f"""# Neuro Gen AI 2.0 — Clinical Screening Report

{demo_banner}
---

## Report Metadata

| Field | Value |
|-------|-------|
| Analysis ID | `{analysis_id}` |
| Generated | {ts} |
| System | Neuro Gen AI 2.0 |

| Dataset | {'DEMO (Synthetic)' if is_demo else 'Patient EDF Upload'} |
| Report Type | AI-Assisted EEG Screening |

---

## Recording Information

| Parameter | Value |
|-----------|-------|
| Channels | {n_ch} (19-channel 10-20 system) |
| Epochs | {n_ep} |
| Sample Rate | {sfreq:.0f} Hz |
| Duration | {dur:.1f} seconds |
| Preprocessing | IIR notch 50 Hz + bandpass 0.5–45 Hz, average reference |
| PSD Method | Welch |

---

## Risk Assessment Summary

| Metric | Score |
|--------|-------|
| **Ensemble Risk Score** | **{risk:.1f}%** |
| ML Model Score | {ml_pct:.1f}% |
| Rule-Based Score | {rb_pct:.1f}% |
| Risk Classification | **{risk_class}** |
| Model Prediction | {pred_lbl} |
| Scoring Method | {method} |

> {risk_note}

---

## Clinical Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Theta/Alpha Ratio (TAR) | {tar:.3f} | {'⚠️ Elevated' if tar > 1.0 else '✓ Normal'} |
| Slow-Wave Dominance Index | {swd:.3f} | {'⚠️ Elevated' if swd > 1.0 else '✓ Normal'} |
| Frontal Alpha (relative) | {fa:.3f} | {'⚠️ Low' if fa < 0.18 else '✓ Normal'} |
| Posterior Alpha (relative) | {pa:.3f} | {'⚠️ Low' if pa < 0.25 else '✓ Normal'} |

---

## EEG Frequency Band Analysis

| Band | Average Power |
|------|--------------|
{band_rows if band_rows else "| (Feature data not available) | — |\n"}

---

## Biomarker Rule Engine Results

| Biomarker | Value | Normal Range | Score | Status |
|-----------|-------|-------------|-------|--------|
{rule_rows if rule_rows else "| (No rules computed) | — | — | — | — |\n"}

---

## Top Contributing Features (ML Model)

| Feature | Importance | Band | Region |
|---------|-----------|------|--------|
{feat_rows if feat_rows else "| (Feature importance not available) | — | — | — |\n"}

---

## AI-Generated Clinical Summary

{ai_summary if ai_summary else "*AI summary not generated — AI provider unavailable or analysis not run.*"}

---

## Evidence from Knowledge Base

{ref_text}

---

## Limitations

- This system is a **research prototype** and has not been certified as a medical device.
- Results depend on signal quality, electrode placement, and recording conditions.
- Cross-dataset generalization has not been clinically validated.
- Antipsychotic medications may alter EEG patterns and affect screening accuracy.
- EEG biomarkers for schizophrenia overlap with other neuropsychiatric conditions.
- Single-session EEG provides lower reliability than longitudinal assessment.
{'- Single-class model detected: rule-based scoring used as primary signal.' if result.get("single_class") else ''}
{'- Feature dimension mismatch detected: array was auto-padded/truncated.' if result.get("dim_mismatch") else ''}

---

## ⚠️ Medical Safety Disclaimer

**This system is an AI-assisted research and screening tool. It does NOT constitute a medical 
diagnosis and MUST NOT replace evaluation by a qualified healthcare professional (neurologist 
or psychiatrist). All findings are probabilistic risk assessments only.**

**If this screening indicates elevated risk, please refer the patient for comprehensive 
neuropsychiatric clinical assessment.**

---

*Neuro Gen AI 2.0 — EEG Neural Intelligence + Explainable AI + RAG + Generative AI*  
*Developed by Team GenAI for ENIGMA Hackathon 2.0*  
*Generated: {ts}*
"""

    return report


def get_report_filename() -> str:
    """Generate a timestamped filename for the report."""
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"neuro_gen_ai_report_{ts}.md"
