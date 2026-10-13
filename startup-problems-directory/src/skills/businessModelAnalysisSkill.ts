import type { EvidenceItem, VentureProfile } from "../types/startupEvaluation";

export interface BusinessModelAnalysis {
  modelType: string;
  hasPricedOffer: boolean;
  pricingPowerRisk: string;
  unitEconomicsHealth: "untested" | "viable" | "flawed";
}

export class BusinessModelAnalysisSkill {
  name = "BusinessModelAnalysisSkill";
  mappedDimensions = ["Value Capture", "Execution Readiness"];

  analyze(profile: VentureProfile, evidence: EvidenceItem[]): BusinessModelAnalysis {
    const bm = profile.businessModel.toLowerCase();
    const hasNumbers = /\$|\d+/.test(bm);

    let modelType = "Direct Sales / Custom";
    if (bm.includes("saas") || bm.includes("subscription") || bm.includes("/mo") || bm.includes("/month")) {
      modelType = "Recurring Subscription (SaaS)";
    } else if (bm.includes("marketplace") || bm.includes("commission") || bm.includes("take rate")) {
      modelType = "Marketplace / Take-Rate";
    } else if (bm.includes("usage") || bm.includes("per")) {
      modelType = "Usage-Based / Transactional";
    }

    return {
      modelType,
      hasPricedOffer: hasNumbers,
      pricingPowerRisk: hasNumbers
        ? "Explicit pricing proposed, but willingness to pay at this tier requires direct transaction proof."
        : "Vague pricing model. Without an explicit price anchor, founders cannot validate customer economics.",
      unitEconomicsHealth: profile.evidenceLevel >= 4 ? "viable" : "untested",
    };
  }
}
