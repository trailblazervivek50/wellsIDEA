import type { EvidenceItem, VentureProfile } from "../types/startupEvaluation";

export interface TeamFitAnalysis {
  technicalCapability: "strong" | "adequate" | "missing";
  domainExpertise: "founder-market-fit" | "adjacent" | "outsider";
  criticalHireNeeded: string;
}

export class TeamFitAnalysisSkill {
  name = "TeamFitAnalysisSkill";
  mappedDimensions = ["Why This Team", "People", "Execution Readiness"];

  analyze(profile: VentureProfile, _evidence: EvidenceItem[]): TeamFitAnalysis {
    const teamText = (profile.teamBackground || "").toLowerCase();

    const hasTech = teamText.includes("engineer") || teamText.includes("ml") || teamText.includes("developer") || teamText.includes("tech");
    const hasDomain = teamText.includes("founder") || teamText.includes("manager") || teamText.includes("industry") || teamText.includes("ex-") || teamText.includes("veteran");

    return {
      technicalCapability: hasTech ? "strong" : "adequate",
      domainExpertise: hasDomain ? "founder-market-fit" : "adjacent",
      criticalHireNeeded: !hasTech
        ? "Technical Co-Founder or Lead Architect"
        : !hasDomain
        ? "Domain Commercial Advisor with buyer network"
        : "Early Customer Success / Direct Sales Lead",
    };
  }
}
