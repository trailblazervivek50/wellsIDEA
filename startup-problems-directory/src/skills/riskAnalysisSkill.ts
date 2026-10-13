import type { EvidenceItem, VentureProfile } from "../types/startupEvaluation";

export interface RiskAnalysisResult {
  primaryKillCondition: string;
  regulatoryRisk: "none" | "moderate" | "severe";
  churnRisk: "low" | "medium" | "high";
  mitigationSprint: string;
}

export class RiskAnalysisSkill {
  name = "RiskAnalysisSkill";
  mappedDimensions = ["Why Won’t This Work", "Risk Awareness"];

  analyze(profile: VentureProfile, evidence: EvidenceItem[]): RiskAnalysisResult {
    const text = (profile.problem + " " + profile.solution + " " + profile.industry).toLowerCase();

    let primaryKillCondition = "Lack of customer urgency: users express enthusiasm but refuse to pay when presented with an invoice.";
    let regulatoryRisk: "none" | "moderate" | "severe" = "none";

    if (text.includes("legal") || text.includes("law") || text.includes("contract")) {
      primaryKillCondition = "Unauthorized practice of law (UPL) liability, model hallucination in high-stakes clauses, and conservative buyer risk-aversion.";
      regulatoryRisk = "severe";
    } else if (text.includes("health") || text.includes("medical") || text.includes("patient")) {
      primaryKillCondition = "HIPAA regulatory compliance, clinical safety liability, and entrenched hospital procurement cycles.";
      regulatoryRisk = "severe";
    } else if (text.includes("restaurant") || text.includes("hospitality")) {
      primaryKillCondition = "Kitchen operational friction: staff ignore digital screens during peak rush, and restaurant closures trigger severe churn.";
      regulatoryRisk = "moderate";
    } else if (text.includes("student") || text.includes("education") || text.includes("school")) {
      primaryKillCondition = "Extreme seasonal churn after final exams and lack of student willingness to pay without institutional subsidies.";
      regulatoryRisk = "moderate";
    }

    return {
      primaryKillCondition,
      regulatoryRisk,
      churnRisk: "high",
      mitigationSprint: "Run a 14-day pre-order pilot with milestone kill-criteria before building production infrastructure.",
    };
  }
}
