import type { EvidenceItem, VentureProfile } from "../types/startupEvaluation";

export interface MarketResearchAnalysis {
  macroTimingScore: number;
  marketSizeEvaluation: string;
  timingCatalyst: string;
  synthesizedEvidence: EvidenceItem[];
}

export class MarketResearchSkill {
  name = "MarketResearchSkill";
  mappedDimensions = ["Why This", "Why Now", "Timing", "Value Capture"];

  analyze(profile: VentureProfile, evidence: EvidenceItem[]): MarketResearchAnalysis {
    const marketEvidence = evidence.filter((e) =>
      this.mappedDimensions.includes(e.frameworkDimension)
    );

    const timingEvidence = marketEvidence.find((e) => e.frameworkDimension === "Why Now");
    const timingCatalyst = timingEvidence?.claim ||
      "Recent shifts in cloud AI APIs and digital workflow expectations enable low-latency automated workflows.";

    return {
      macroTimingScore: 4,
      marketSizeEvaluation: `Targeting ${profile.industry || "emerging technology"} within ${profile.geography || "global"} market.`,
      timingCatalyst,
      synthesizedEvidence: marketEvidence,
    };
  }
}
