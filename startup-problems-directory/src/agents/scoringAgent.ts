import type {
  EvidenceItem,
  ScorecardItem,
  VentureProfile,
} from "../types/startupEvaluation";
import { EvidenceGradingSkill } from "../skills/evidenceGradingSkill";

export interface ScoringResult {
  scorecard: ScorecardItem[];
  rawScore: number;
  finalScore: number;
  penalties: string[];
  evidenceCeilingApplied: boolean;
  capReason?: string;
}

export class ScoringAgent {
  name = "ScoringAgent";
  private gradingSkill: EvidenceGradingSkill;

  constructor() {
    this.gradingSkill = new EvidenceGradingSkill();
  }

  scoreVenture(profile: VentureProfile, evidence: EvidenceItem[]): ScoringResult {
    return this.gradingSkill.gradeVenture(profile, evidence);
  }
}
