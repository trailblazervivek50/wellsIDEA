import type { EvidenceItem, VentureProfile } from "../types/startupEvaluation";

export interface CustomerDiscoveryAnalysis {
  buyerVsUserClarity: "clear" | "ambiguous" | "mismatched";
  urgencyLevel: "vitamin" | "painkiller" | "mission_critical";
  requiredInterviewCount: number;
  scriptQuestions: string[];
}

export class CustomerDiscoverySkill {
  name = "CustomerDiscoverySkill";
  mappedDimensions = ["Customer Clarity", "Problem Pain", "Evidence Quality"];

  analyze(profile: VentureProfile, _evidence: EvidenceItem[]): CustomerDiscoveryAnalysis {
    const isDistinctBuyer = profile.targetBuyer.toLowerCase() !== profile.targetUser.toLowerCase();
    const hasClearBuyer = Boolean(profile.targetBuyer && profile.targetBuyer.trim().length > 4);

    const clarity: "clear" | "ambiguous" | "mismatched" = !hasClearBuyer
      ? "ambiguous"
      : isDistinctBuyer
      ? "clear"
      : "clear";

    const problemLength = profile.problem.length;
    const urgency: "vitamin" | "painkiller" | "mission_critical" =
      problemLength > 80 ? "painkiller" : "vitamin";

    return {
      buyerVsUserClarity: clarity,
      urgencyLevel: urgency,
      requiredInterviewCount: profile.evidenceLevel < 2 ? 15 : 5,
      scriptQuestions: [
        `When was the last time you experienced '${profile.problem.slice(0, 40)}...', and what exact steps did you take?`,
        `How much budget or employee time did your organization spend resolving or working around this last month?`,
        `What software or manual process are you currently using, and why haven't you replaced it yet?`,
        `Who owns the credit card or procurement budget for software that solves this problem?`,
        `If this problem was 100% solved tomorrow, what metric on your report would move first?`,
      ],
    };
  }
}
