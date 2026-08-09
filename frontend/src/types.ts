export interface RuleDetail {
  score: number;
  value: string;
  normal_range: string;
  finding: string;
  weight: number;
}

export interface RuleBasedMetrics {
  rules: Record<string, RuleDetail>;
  rule_pct: number;
  tar: number;
  swd: number;
  frontal_alpha_rel: number;
  post_alpha_rel: number;
}

export interface BenchmarkMetrics {
  preprocessing_ms: number;
  feature_extraction_ms: number;
  inference_ms: number;
  total_ms: number;
  cached: boolean;
}

export interface AnalysisResult {
  job_id: string;
  filename?: string;
  prediction: number;
  risk_pct: number;
  ml_pct: number;
  rule_pct: number;
  ensemble_method: string;
  rules: Record<string, RuleDetail>;
  rb_metrics: RuleBasedMetrics;
  per_ch_band: Record<string, Record<string, number>>;
  freqs: number[];
  n_channels: number;
  n_epochs: number;
  sfreq: number;
  duration_s: number;
  single_class: boolean;
  demo: boolean;
  benchmark: BenchmarkMetrics;
}

export interface HistoryItem {
  id: string;
  file: string;
  risk: 'HIGH' | 'MODERATE' | 'LOW';
  risk_pct: number;
  confidence: string;
  signal_quality: string;
  date: string;
  result?: AnalysisResult;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  band: string;
  region: string;
}

export interface ExplainabilityPayload {
  job_id: string;
  risk_pct: number;
  top_features: FeatureImportance[];
  band_contributions: Record<string, number>;
  region_contributions: Record<string, number>;
  text_explanation: string;
}

export interface RAGSource {
  text: string;
  source: string;
  score: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: RAGSource[];
}
