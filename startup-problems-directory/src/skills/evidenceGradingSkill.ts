import type {
  EvidenceItem,
  ScorecardItem,
  VentureProfile,
} from "../types/startupEvaluation";
import { SCORING_WEIGHTS, TOTAL_WEIGHT } from "../framework/scoringWeights";
import { enforceEvidenceCeiling, getEvidenceLevelConfig } from "../framework/evidenceLadder";

export interface EvidenceGradingResult {
  scorecard: ScorecardItem[];
  rawScore: number;
  finalScore: number;
  penalties: string[];
  evidenceCeilingApplied: boolean;
  capReason?: string;
}

export class EvidenceGradingSkill {
  name = "EvidenceGradingSkill";
  mappedDimensions = ["Evidence Quality"];

  gradeVenture(
    profile: VentureProfile,
    normalizedEvidence: EvidenceItem[]
  ): EvidenceGradingResult {
    const penalties: string[] = [];

    // Penalty checks
    const isCustomerVague =
      !profile.targetUser || profile.targetUser.trim().length < 5 || profile.targetUser.toLowerCase().includes("everyone");
    if (isCustomerVague) {
      penalties.push("Vague customer definition: Target user is overly broad or unspecified.");
    }

    const isBuyerUnclear =
      !profile.targetBuyer || profile.targetBuyer.trim().length < 5;
    if (isBuyerUnclear) {
      penalties.push("Unclear economic buyer: The entity with budget authority is undefined.");
    }

    const hasNoBusinessModel =
      !profile.businessModel || profile.businessModel.trim().length < 5 || profile.businessModel.toLowerCase() === "tbd";
    if (hasNoBusinessModel) {
      penalties.push("No explicit business model: Revenue capture and pricing are undefined.");
    }

    const isLowEvidence = profile.evidenceLevel <= 1;
    if (isLowEvidence) {
      penalties.push("Low evidence quality: Venture operates primarily on founder belief (Level 0/1).");
    }

    const isWeakDifferentiation =
      profile.solution.length < 40 || !profile.solution.toLowerCase().includes("by");
    if (isWeakDifferentiation) {
      penalties.push("Weak differentiation: Unique solution mechanism is not clearly articulated.");
    }

    const isMissingTeamAdvantage =
      !profile.teamBackground || profile.teamBackground.trim().length < 10;
    if (isMissingTeamAdvantage) {
      penalties.push("Missing team advantage: Founding team domain insight or technical depth is unproven.");
    }

    const scorecard: ScorecardItem[] = SCORING_WEIGHTS.map((dimConfig) => {
      const dimName = dimConfig.name;
      const dimEvidence = normalizedEvidence.filter((e) => e.frameworkDimension === dimName);
      const appliedPenalties: string[] = [];

      let baseScore = 3; // Baseline = 3 (Plausible but not proven)
      let justification = "Hypothesis is plausible but lacks direct market proof.";

      // Dimension-specific scoring logic
      if (dimName === "Problem Pain") {
        if (profile.problem.length > 80) {
          baseScore = 4;
          justification = "Friction is articulated with clear operational or financial consequences.";
        } else {
          baseScore = 3;
          appliedPenalties.push("Problem description lacks quantified operational cost.");
          justification = "Problem stated, but severity and frequency are not quantified.";
        }
      } else if (dimName === "Customer Clarity") {
        if (isCustomerVague || isBuyerUnclear) {
          baseScore = 2;
          appliedPenalties.push("User and economic buyer are conflated or vague.");
          justification = "Lacks separation between daily user, budget holder, and purchase blocker.";
        } else {
          baseScore = profile.targetBuyer.toLowerCase() !== profile.targetUser.toLowerCase() ? 4 : 3;
          justification = `Identified daily user (${profile.targetUser}) and economic buyer (${profile.targetBuyer}).`;
        }
      } else if (dimName === "Value Creation") {
        baseScore = profile.solution.length > 60 ? 4 : 3;
        justification = "Measurable value proposed through time savings or direct error reduction.";
      } else if (dimName === "Value Capture") {
        if (hasNoBusinessModel) {
          baseScore = 2;
          appliedPenalties.push("No pricing model specified.");
          justification = "Monetization strategy is undefined; unvalidated value capture.";
        } else {
          baseScore = 3;
          justification = `Proposed model (${profile.businessModel}) is plausible, but willingness to pay is unproven.`;
        }
      } else if (dimName === "Why This") {
        baseScore = 4;
        justification = "Problem represents a sizable productivity or margin drain in the sector.";
      } else if (dimName === "Why Now") {
        baseScore = 4;
        justification = "Modern AI models and open API ecosystems enable turnkey deployment.";
      } else if (dimName === "Why This Team") {
        if (isMissingTeamAdvantage) {
          baseScore = 2;
          appliedPenalties.push("Team capabilities and unfair insights are missing.");
          justification = "Founding team pedigree is not specified; lacks unfair distribution or domain moat.";
        } else {
          baseScore = 3;
          justification = `Relevant technical or industry experience (${profile.teamBackground}).`;
        }
      } else if (dimName === "Execution Readiness") {
        baseScore = profile.stage === "prototype" || profile.stage === "pilot" ? 4 : 3;
        justification = `Venture operates at Stage: ${profile.stage.toUpperCase()}. Core MVP is feasible.`;
      } else if (dimName === "Timing") {
        baseScore = 4;
        justification = "Market digital readiness is favorable; industry is receptive to automation.";
      } else if (dimName === "Defensibility") {
        baseScore = 2;
        appliedPenalties.push("Vulnerable to horizontal LLMs and fast followers.");
        justification = "Early product layer is vulnerable to clone attempts without proprietary data moat.";
      } else if (dimName === "Risk Awareness") {
        baseScore = 3;
        justification = "Identified critical operational and customer validation risks.";
      } else if (dimName === "Evidence Quality") {
        const evConfig = getEvidenceLevelConfig(profile.evidenceLevel);
        baseScore = Math.min(Math.max(profile.evidenceLevel, 1), 5);
        if (profile.evidenceLevel <= 1) {
          appliedPenalties.push("Operates at founder belief level without customer discovery data.");
        }
        justification = `Currently at ${evConfig.name}. ${evConfig.requiredProof}`;
      }

      // Check evidence items for direct proof or assumptions
      const directProof = dimEvidence.filter((e) => e.evidenceType === "direct");
      const unvalidatedAssumptions = dimEvidence.filter(
        (e) => e.evidenceType === "assumption" || e.requiresCustomerValidation
      );

      const evidenceStrings = directProof.map((e) => e.claim);
      if (evidenceStrings.length === 0) {
        evidenceStrings.push(`Hypothesis formulated based on ${profile.stage} stage expectations.`);
      }

      const missingStrings = unvalidatedAssumptions.map((e) => e.claim);
      if (missingStrings.length === 0) {
        missingStrings.push("Requires structured discovery interviews to confirm buying trigger.");
      }

      return {
        dimension: dimName,
        score: baseScore,
        weight: dimConfig.weight,
        justification,
        evidence: evidenceStrings,
        missingEvidence: missingStrings,
        penaltiesApplied: appliedPenalties,
      };
    });

    const totalWeightedSum = scorecard.reduce(
      (sum, item) => sum + item.score * item.weight,
      0
    );
    const rawWeightedAverage = totalWeightedSum / TOTAL_WEIGHT;

    // Apply strict evidence ladder ceiling
    const { cappedScore, wasCapped, capReason } = enforceEvidenceCeiling(
      rawWeightedAverage,
      profile.evidenceLevel
    );

    return {
      scorecard,
      rawScore: Number(rawWeightedAverage.toFixed(1)),
      finalScore: cappedScore,
      penalties,
      evidenceCeilingApplied: wasCapped,
      capReason,
    };
  }
}
