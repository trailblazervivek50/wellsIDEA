export type VentureStage = "idea" | "prototype" | "pilot" | "revenue" | "scaling";

export type ReadinessLevel = "strong" | "promising" | "high_risk" | "weak" | "not_ready";

export type ActionRecommendation = "keep_going" | "pivot" | "pause" | "research_more";

export interface VentureProfile {
  name: string;
  oneLinePitch: string;
  targetUser: string;
  targetBuyer: string;
  problem: string;
  solution: string;
  businessModel: string;
  stage: VentureStage;
  teamBackground: string;
  evidenceLevel: number; // 0 to 5
}

export interface ScorecardDimension {
  dimension: string;
  score: number; // 1-5
  weight: number;
  justification: string;
  evidence: string;
  missingEvidence: string;
  howToImprove: string;
}

export interface ThreePlusOneWhy {
  whyThis: string;
  whyNow: string;
  whyThisTeam: string;
  whyWontThisWork: string; // The 4th Why (Failure Anticipation)
}

export interface VentureGap {
  gap: string;
  frameworkDimension: string;
  whyItMatters: string;
  validationTest: string;
}

export interface EvidenceLadderStatus {
  currentLevel: number; // 0-5
  currentLevelName: string;
  nextLevelName: string;
  howToAscend: string;
}

export interface ValidationExperiment {
  experiment: string;
  timeline: "7-day" | "30-day";
  successMetric: string;
}

export interface FrameworkReport {
  ventureName: string;
  ventureSummary: string;
  valueProposition: string;
  overallScore: number; // 1.0 to 5.0
  readinessLevel: ReadinessLevel;
  threePlusOneWhy: ThreePlusOneWhy;
  scorecard: ScorecardDimension[];
  whatItLacks: VentureGap[];
  evidenceLadder: EvidenceLadderStatus;
  recommendedExperiments: ValidationExperiment[];
  customerDiscoveryQuestions: string[];
  finalVerdict: string;
  actionRecommendation: ActionRecommendation;
  generatedAt: string;
  modelUsed: string;
}

export type AgentStep = 
  | "idle"
  | "intake"
  | "framework_mapping"
  | "gemini_research"
  | "scoring"
  | "gap_analysis"
  | "recommendation"
  | "done"
  | "error";
