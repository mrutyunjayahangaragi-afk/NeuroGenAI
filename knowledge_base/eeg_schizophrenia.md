# EEG & Schizophrenia: Clinical Reference Knowledge Base
# NeuroScan AI — RAG Knowledge Base v1.0
# Sources: peer-reviewed EEG research literature

## Overview: EEG Biomarkers in Schizophrenia

Schizophrenia is a complex neuropsychiatric disorder affecting approximately 1% of the global population. 
Electroencephalography (EEG) has emerged as a valuable non-invasive tool for detecting electrophysiological 
abnormalities associated with schizophrenia. EEG biomarkers offer objective, low-cost screening support 
that can complement clinical diagnosis. This document summarizes key evidence-based findings.

---

## 1. Alpha Band (8–13 Hz): Hypofrontality and Alpha Suppression

### Clinical Significance
Alpha oscillations are predominantly observed in the posterior regions of healthy brains during relaxed 
wakefulness, and in frontal regions during cognitive engagement. In individuals with schizophrenia, 
reduced frontal alpha power — a phenomenon called "hypofrontality" — is one of the most replicated 
EEG findings.

### Key Findings
- Frontal alpha relative power below 0.30 is a significant biomarker for schizophrenia risk
- Posterior alpha loss (below 0.40 relative power) indicates impaired sensory gating
- Alpha coherence between frontal and temporal regions is reduced in schizophrenia
- Reduced alpha amplitude correlates with negative symptoms (flat affect, alogia, avolition)
- The alpha asymmetry index (right minus left frontal alpha) is disrupted in schizophrenia

### Research Evidence
Multiple studies using resting-state EEG have demonstrated that frontal alpha suppression is associated 
with impaired executive function, working memory deficits, and prefrontal cortex hypoactivation in 
schizophrenia. The hypofrontality hypothesis suggests reduced dopaminergic activity in the prefrontal 
cortex underlies these oscillatory changes. Alpha reduction at Fz and Fp1/Fp2 electrode sites is 
consistently reported across independent cohorts.

---

## 2. Theta Band (4–8 Hz): Cognitive Slowing and Positive Symptoms

### Clinical Significance
Theta oscillations are involved in working memory encoding, hippocampal-prefrontal synchrony, and 
cognitive processing speed. Elevated theta power is one of the most consistent EEG findings in 
schizophrenia and correlates with positive symptoms including hallucinations and delusions.

### Key Findings
- Global theta power elevation is observed in approximately 70% of schizophrenia patients
- The Theta/Alpha Ratio (TAR) is a robust cognitive slowing biomarker; values > 1.0 are abnormal
- Frontal theta increase correlates with severity of positive psychotic symptoms
- Temporal theta elevation (T3, T4) is associated with auditory hallucinations
- Theta-gamma coupling is disrupted, impairing cognitive integration

### Research Evidence
The TAR (theta/alpha ratio) is used in clinical EEG research as a reliable marker of cortical 
hypoactivation. Studies show TAR values exceeding 0.70 are associated with cognitive impairment 
and psychosis-like symptoms. Temporal lobe theta asymmetry between T3 and T4 correlates with 
hemispheric processing imbalances linked to language and auditory hallucination pathophysiology.

---

## 3. Delta Band (0.5–4 Hz): Cognitive Disorganization

### Clinical Significance
Delta activity is normally observed during deep sleep or in pathological states. The presence of 
excessive delta power during waking EEG recordings suggests cortical inhibitory dysfunction and 
cognitive disorganization.

### Key Findings
- Frontal delta relative power exceeding 0.12 is a biomarker for cognitive disorganization
- Delta excess correlates with thought disorder and formal cognitive disorganization
- Elevated slow-wave activity in frontal regions indicates impaired top-down cognitive control
- The Slow-Wave Dominance Index (SWDI = (delta+theta)/(alpha+beta)) > 0.60 indicates pathological slowing

### Research Evidence
Frontal delta excess has been reported in first-episode psychosis and chronic schizophrenia. 
The combination of elevated delta and theta (slow-wave dominance) alongside suppressed alpha 
represents the "EEG triad" most strongly associated with schizophrenia in population studies. 
This pattern is thought to reflect GABA-ergic interneuron dysfunction affecting cortical network 
synchronization.

---

## 4. Beta Band (13–30 Hz): Arousal Dysregulation

### Clinical Significance
Beta oscillations are associated with active thinking, sensorimotor processing, and cortical arousal. 
Abnormal frontal beta — either elevated (hyperarousal) or reduced (hypoarousal) — is observed in 
schizophrenia and varies with medication status and symptom severity.

### Key Findings
- Frontal beta relative power outside the 0.12–0.30 range indicates arousal dysregulation
- Beta abnormality is a secondary biomarker with ~3% weight in ensemble clinical scoring
- Antipsychotic medications can normalize some beta abnormalities
- Beta reduction correlates with cognitive slowing; beta elevation with anxiety and hyperarousal
- Sensorimotor beta rhythms (mu rhythm) may show disrupted suppression during motor tasks

---

## 5. Gamma Band (30–45 Hz): Sensory Binding Deficit (NMDA Hypothesis)

### Clinical Significance
Gamma oscillations are critical for neural synchrony, sensory binding, and cognitive integration. 
The NMDA receptor hypofunction hypothesis of schizophrenia predicts disrupted gamma oscillations 
through impaired GABAergic fast-spiking interneuron function.

### Key Findings
- Reduced global gamma relative power (below 0.04) indicates impaired sensory binding
- Gamma disruption is most prominent during cognitive tasks (working memory, auditory oddball)
- Resting-state gamma reduction at 40 Hz is linked to NMDA receptor dysfunction
- Auditory steady-state response (ASSR) at 40 Hz shows consistent gamma reduction in schizophrenia
- Gamma abnormalities correlate with negative symptoms and cognitive deficits more than positive symptoms

### Research Evidence
The gamma deficit in schizophrenia is one of the most mechanistically understood biomarkers, 
linked to reduced parvalbumin-positive interneuron activity. Ketamine (NMDA antagonist) induces 
similar gamma disruptions in healthy volunteers, supporting the NMDA hypothesis. Gamma power at 
40 Hz measured during auditory stimulation is proposed as a potential biomarker for treatment response.

---

## 6. Temporal Asymmetry: Hallucination Correlate

### Clinical Significance
Left-right hemispheric asymmetry in temporal EEG power is associated with auditory processing 
lateralization. In schizophrenia, abnormal temporal asymmetry correlates with the presence and 
severity of auditory verbal hallucinations.

### Key Findings
- T3 (left temporal) / T4 (right temporal) asymmetry index > 0.15 is abnormal
- Left temporal theta/alpha ratio elevation correlates with language processing dysfunction
- Reduced left-sided superior temporal gyrus activation is linked to hearing voices
- Temporal asymmetry is a secondary biomarker with ~8% weight in ensemble scoring
- Interhemispheric coherence reduction between temporal sites is consistently reported

---

## 7. The ASZED Dataset

The ASZED (A Schizophrenia and Healthy Control EEG Dataset) contains 1,932 EDF recordings 
from patients with schizophrenia and healthy controls. Key characteristics:

- 19-channel EEG using the international 10-20 electrode placement system
- Standard electrodes: Fp1, Fp2, F7, F3, Fz, F4, F8, T3, C3, Cz, C4, T4, T5, P3, Pz, P4, T6, O1, O2
- Resting state recordings during eyes-open and eyes-closed conditions
- Binary classification: schizophrenia (class 1) vs. healthy control (class 0)
- Labels encoded in folder hierarchy: session folder "1" = schizophrenia, "2" = control

---

## 8. EEG Signal Preprocessing Standards

### Recommended Pipeline for Schizophrenia Detection
1. **Resampling**: 250 Hz standard for computational efficiency and 45 Hz Nyquist compliance
2. **Notch filter**: 50 Hz (or 60 Hz) to remove power line interference (IIR method for short recordings)
3. **Bandpass filter**: 0.5–45 Hz to retain clinically relevant frequencies (IIR method)
4. **Reference**: Average reference to minimize electrode-specific artifacts
5. **Epoching**: 1-second epochs with 50% overlap for stable feature estimation
6. **PSD**: Welch method for power spectral density (better noise averaging than FFT)
7. **Feature normalization**: StandardScaler for zero-mean unit-variance scaling

### Channel Standardization
Missing channels should be zero-padded and marked as low-quality. Channels are standardized to 
the 19-electrode 10-20 system for cross-dataset compatibility.

---

## 9. Machine Learning in EEG-Based Schizophrenia Screening

### Random Forest Performance
Random Forest classifiers achieve 78–92% accuracy in EEG-based schizophrenia classification 
when trained on spectral power features from the 10-20 system. Key advantages:
- Handles high-dimensional feature spaces (190+ features) without overfitting
- Provides feature_importances_ for explainability
- Robust to outliers and missing values
- No assumption of feature independence

### Ensemble Scoring Rationale
Combining ML model output with rule-based clinical biomarkers improves robustness:
- Pure ML may overfit to training dataset characteristics
- Rule-based scoring encodes validated clinical knowledge
- 50/50 ensemble balances data-driven and knowledge-driven approaches
- When model is single-class, rule-based score receives 80% weight

### Feature Importance in EEG Classification
Studies consistently find that frontal and temporal alpha/theta features rank highest in 
importance for schizophrenia classification. Beta and gamma features at frontal sites 
also contribute significantly to model decisions.

---

## 10. Clinical Context and Limitations

### Important Limitations of EEG-Based Screening
- EEG schizophrenia biomarkers overlap with other conditions (bipolar disorder, depression, ADHD)
- Cross-dataset generalization is not guaranteed — models may not generalize across populations
- Medication effects (antipsychotics) can normalize EEG patterns, potentially masking diagnosis
- Single-session EEG has lower reliability than longitudinal assessment
- Reference electrode choice, amplifier type, and recording environment affect results
- Age, sex, and medication status are significant confounders

### Medical Safety Statement
EEG-based AI screening systems are research and decision-support tools. They should NOT be 
used as standalone diagnostic instruments. All findings must be interpreted by qualified 
healthcare professionals (neurologists, psychiatrists) in clinical context. The AI system 
provides probabilistic risk assessment, not medical diagnosis.

### Appropriate Clinical Use Cases
- Pre-screening in primary care settings to guide specialist referral
- Research studies comparing EEG biomarkers across patient populations
- Longitudinal monitoring of treatment response in research contexts
- Educational tools for training clinicians on EEG pattern recognition

---

## 11. Key EEG Terminology

**Power Spectral Density (PSD)**: Mathematical representation of signal power distributed across frequencies  
**Welch Method**: PSD estimation technique using overlapping windows for noise reduction  
**Epoch**: A time segment of EEG data (typically 1–4 seconds) used for feature extraction  
**Notch filter**: Removes specific frequency (50/60 Hz power line noise) while preserving others  
**IIR filter**: Infinite Impulse Response filter — computationally efficient, suitable for short signals  
**Average reference**: Subtracts mean of all electrodes to reduce common-mode artifacts  
**TAR**: Theta/Alpha Ratio — cognitive slowing biomarker  
**SWDI**: Slow-Wave Dominance Index — ratio of slow to fast oscillations  
**Hypofrontality**: Reduced prefrontal cortex activity, reflected as frontal alpha suppression  
**NMDA**: N-methyl-D-aspartate receptor — key glutamate receptor whose dysfunction is implicated in schizophrenia  
**GABA**: Gamma-aminobutyric acid — primary inhibitory neurotransmitter; GABAergic interneuron dysfunction underlies gamma deficit  
**EDF**: European Data Format — standard file format for EEG recordings
