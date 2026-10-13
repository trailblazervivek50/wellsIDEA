export type VentureStage = "idea" | "prototype" | "pilot" | "revenue" | "scaling";

export type ConfidenceLevel = "low" | "medium" | "high";

export type EvidenceType = "direct" | "indirect" | "assumption";

export type ReadinessCategory =
  | "strong"
  | "promising"
  | "under_validated"
  | "weak"
  | "not_ready";

export type ProceedDecision = "proceed" | "pivot" | "pause";

export interface VentureProfile {
  startupName: string;
  oneLineIdea: string;
  problem: string;
  solution: string;
  targetUser: string;
  targetBuyer: string;
  businessModel: string;
  industry: string;
  geography: string;
  stage: VentureStage;
  teamBackground: string;
  unknowns: string[];
  evidenceLevel: number; // 0 to 5
}

export interface FrameworkDimension {
  name: string;
  question: string;
  weight: number;
}

export interface ResearchTask {
  frameworkDimension: string;
  questions: string[];
}

export interface EvidenceItem {
  claim: string;
  sourceUrl?: string;
  confidence: ConfidenceLevel;
  frameworkDimension: string;
  evidenceType: EvidenceType;
  requiresCustomerValidation: boolean;
}

export interface ScorecardItem {
  dimension: string;
  score: number; // 1 to 5
  weight: number;
  justification: string;
  evidence: string[];
  missingEvidence: string[];
  penaltiesApplied: string[];
}

export interface GapItem {
  gap: string;
  frameworkDimension: string;
  whyItMatters: string;
  justification: string;
  nextValidationTest: string;
}

export interface ValidationExperiment {
  experiment: string;
  timeline: "7-day" | "30-day";
  successMetric: string;
}

export interface Recommendation {
  finalVerdict: string;
  topThreeGaps: string[];
  sevenDayValidationPlan: string[];
  thirtyDayValidationPlan: string[];
  metricsThatWouldImproveScore: string[];
  proceedPivotOrPause: ProceedDecision;
}

export interface ThreePlusOneWhy {
  whyThis: string;
  whyNow: string;
  whyThisTeam: string;
  whyWontThisWork: string;
}

export interface StartupEvaluationReport {
  ventureProfile: VentureProfile;
  ventureSummary: string;
  valueProposition: string; // "We help X do Y by doing Z"
  threePlusOneWhy: ThreePlusOneWhy;
  scorecard: ScorecardItem[];
  overallScore: number; // 1.0 to 5.0
  readinessCategory: ReadinessCategory;
  readinessCategoryLabel: string;
  whatItLacks: GapItem[];
  evidenceFound: EvidenceItem[];
  evidenceMissing: string[];
  recommendedValidationExperiments: ValidationExperiment[];
  finalVerdict: string;
  recommendation: Recommendation;
  generatedAt: string;
  modelUsed: string;
}

export type EvaluationAgentStep =
  | "idle"
  | "intake"
  | "framework_mapping"
  | "gemini_research"
  | "evidence_normalization"
  | "scoring"
  | "gap_analysis"
  | "recommendation"
  | "done"
  | "error";
