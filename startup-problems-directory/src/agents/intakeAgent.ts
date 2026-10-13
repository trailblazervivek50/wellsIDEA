import type { VentureProfile, VentureStage } from "../types/startupEvaluation";

export interface IntakeRawInput {
  startupName?: string;
  ideaText: string;
  problem?: string;
  solution?: string;
  targetUser?: string;
  targetBuyer?: string;
  businessModel?: string;
  industry?: string;
  geography?: string;
  stage?: VentureStage;
  teamBackground?: string;
  evidenceLevel?: number;
}

export class IntakeAgent {
  name = "IntakeAgent";

  process(input: IntakeRawInput): VentureProfile {
    const rawIdea = input.ideaText ? input.ideaText.trim() : "";
    const startupName = input.startupName?.trim() || this.extractStartupName(rawIdea);
    const oneLineIdea = rawIdea || `${startupName} platform`;

    const problem = input.problem?.trim() || this.extractProblem(rawIdea);
    const solution = input.solution?.trim() || this.extractSolution(rawIdea);
    const targetUser = input.targetUser?.trim() || this.inferTargetUser(rawIdea);
    const targetBuyer = input.targetBuyer?.trim() || this.inferTargetBuyer(targetUser, rawIdea);
    const businessModel = input.businessModel?.trim() || "B2B SaaS subscription (estimated)";
    const industry = input.industry?.trim() || this.inferIndustry(rawIdea);
    const geography = input.geography?.trim() || "Global / North America";
    const stage: VentureStage = input.stage || "idea";
    const teamBackground = input.teamBackground?.trim() || "Early-stage founders with domain interest";
    const evidenceLevel = typeof input.evidenceLevel === "number" ? Math.min(Math.max(input.evidenceLevel, 0), 5) : 0;

    const unknowns: string[] = [];
    if (!input.targetBuyer) unknowns.push("Economic buyer budget authority is undefined");
    if (!input.businessModel) unknowns.push("Pricing power and monetization tiers are unverified");
    if (evidenceLevel <= 1) unknowns.push("No direct customer discovery interviews conducted yet");

    return {
      startupName,
      oneLineIdea,
      problem,
      solution,
      targetUser,
      targetBuyer,
      businessModel,
      industry,
      geography,
      stage,
      teamBackground,
      unknowns,
      evidenceLevel,
    };
  }

  private extractStartupName(idea: string): string {
    const firstWords = idea.split(" ").slice(0, 3).join(" ");
    return firstWords.length > 0 ? firstWords : "My Venture";
  }

  private extractProblem(idea: string): string {
    if (idea.toLowerCase().includes("because")) {
      return idea.split(/because/i)[1].trim();
    }
    return `Customers suffer from inefficiency and manual overhead in ${idea.slice(0, 40)}.`;
  }

  private extractSolution(idea: string): string {
    if (idea.toLowerCase().includes("that")) {
      return idea.split(/that/i)[1].trim();
    }
    return `Automated digital platform providing streamlined workflow for ${idea.slice(0, 40)}.`;
  }

  private inferTargetUser(idea: string): string {
    const lower = idea.toLowerCase();
    if (lower.includes("student")) return "Undergraduate students";
    if (lower.includes("restaurant") || lower.includes("kitchen")) return "Executive chefs & kitchen managers";
    if (lower.includes("legal") || lower.includes("lawyer")) return "Small business owners & in-house counsel";
    if (lower.includes("developer") || lower.includes("engineer")) return "Software engineers & dev leads";
    return "Operations professionals";
  }

  private inferTargetBuyer(user: string, idea: string): string {
    const lower = (user + " " + idea).toLowerCase();
    if (lower.includes("student")) return "Parents, students (self-pay), or university departments";
    if (lower.includes("restaurant")) return "Restaurant owner or managing partner";
    if (lower.includes("developer")) return "VP of Engineering or CTO";
    return user;
  }

  private inferIndustry(idea: string): string {
    const lower = idea.toLowerCase();
    if (lower.includes("student") || lower.includes("tutor") || lower.includes("learn")) return "EdTech";
    if (lower.includes("food") || lower.includes("restaurant")) return "Hospitality / FoodTech";
    if (lower.includes("law") || lower.includes("legal") || lower.includes("contract")) return "LegalTech";
    if (lower.includes("health") || lower.includes("medical")) return "HealthTech";
    return "Enterprise Software";
  }
}
