import type { EvidenceItem, VentureProfile } from "../types/startupEvaluation";

export interface CompetitorAnalysis {
  defensibilityLevel: "low" | "moderate" | "high";
  directAlternatives: string[];
  switchingCostVerdict: string;
  moatRecommendation: string;
}

export class CompetitorResearchSkill {
  name = "CompetitorResearchSkill";
  mappedDimensions = ["Defensibility", "Customer Truth", "Value Creation"];

  analyze(profile: VentureProfile, evidence: EvidenceItem[]): CompetitorAnalysis {
    const isEarly = profile.stage === "idea" || profile.stage === "prototype";
    const hasProprietaryData = profile.solution.toLowerCase().includes("proprietary") ||
      profile.solution.toLowerCase().includes("integration") ||
      profile.solution.toLowerCase().includes("verified");

    return {
      defensibilityLevel: hasProprietaryData ? "moderate" : "low",
      directAlternatives: [
        "Status quo manual spreadsheets and ad-hoc workarounds",
        "Horizontal AI tools (ChatGPT, Claude, generic assistants)",
        "Incumbent domain legacy software",
      ],
      switchingCostVerdict: isEarly
        ? "Low switching barrier today. Competitors could replicate feature set within 6 months unless integrated into daily workflow."
        : "Moderate switching barriers if integrated with customer data.",
      moatRecommendation:
        "Build deep integrations into the customer's existing system of record and create verified data assets that generalist AI models cannot scrape.",
    };
  }
}
