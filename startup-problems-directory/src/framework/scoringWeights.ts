import type { ReadinessCategory } from "../types/startupEvaluation";

export interface DimensionWeightConfig {
  name: string;
  weight: number;
  description: string;
  coreQuestion: string;
}

export const SCORING_WEIGHTS: DimensionWeightConfig[] = [
  {
    name: "Problem Pain",
    weight: 1.2,
    description: "Urgency, frequency, emotional friction, or financial cost of the problem.",
    coreQuestion: "Is the problem urgent, expensive, frequent, or emotionally painful?",
  },
  {
    name: "Customer Clarity",
    weight: 1.2,
    description: "Distinction between daily user, economic buyer, decision maker, and blocker.",
    coreQuestion: "Do we know the user, buyer, decision-maker, and blocker?",
  },
  {
    name: "Value Creation",
    weight: 1.1,
    description: "Measurable quantified value or utility delivered to the customer.",
    coreQuestion: "Does the solution create measurable value?",
  },
  {
    name: "Value Capture",
    weight: 1.1,
    description: "Sustainable business model, pricing power, and margin structure.",
    coreQuestion: "Can the startup capture enough value to survive and grow?",
  },
  {
    name: "Why This",
    weight: 1.0,
    description: "Scale and importance of the market opportunity.",
    coreQuestion: "Is the idea worth pursuing now?",
  },
  {
    name: "Why Now",
    weight: 1.0,
    description: "Technological, regulatory, or behavioral inflection point enabling the solution.",
    coreQuestion: "Is market timing favorable?",
  },
  {
    name: "Why This Team",
    weight: 1.2,
    description: "Unfair insight, domain pedigree, technical depth, or sales ability.",
    coreQuestion: "Does the team have unfair insight or ability?",
  },
  {
    name: "Execution Readiness",
    weight: 1.1,
    description: "Speed of shipping, iteration capacity, and operational feasibility.",
    coreQuestion: "Can the team build, sell, and iterate fast?",
  },
  {
    name: "Timing",
    weight: 1.0,
    description: "Market readiness, absence of premature adoption barriers.",
    coreQuestion: "Is the market ready and not too early?",
  },
  {
    name: "Defensibility",
    weight: 0.9,
    description: "Moats, high switching costs, data flywheels, or network effects.",
    coreQuestion: "Is the startup hard to copy, replace, or outspend?",
  },
  {
    name: "Risk Awareness",
    weight: 1.0,
    description: "Understanding of kill-conditions, liability, regulatory hurdles, or churn.",
    coreQuestion: "Does the team understand what can kill the venture?",
  },
  {
    name: "Evidence Quality",
    weight: 1.4,
    description: "Rung on the Evidence Ladder (interviews, prototypes, paid pilots, revenue).",
    coreQuestion: "Are there pilots, LOIs, revenue, retention, or direct customer proof?",
  },
];

export const TOTAL_WEIGHT = SCORING_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);

export function interpretOverallScore(score: number): {
  category: ReadinessCategory;
  label: string;
  description: string;
} {
  if (score >= 4.2) {
    return {
      category: "strong",
      label: "Strong 10% Candidate",
      description: "Shows compelling evidence, clear differentiation, and strong survival traits.",
    };
  }
  if (score >= 3.5) {
    return {
      category: "promising",
      label: "Promising (Clear Gaps)",
      description: "High potential, but specific critical assumptions must be validated before scaling.",
    };
  }
  if (score >= 2.8) {
    return {
      category: "under_validated",
      label: "Interesting but Under-Validated",
      description: "Heavily reliant on founder assumptions; high execution and customer risk.",
    };
  }
  if (score >= 2.0) {
    return {
      category: "weak",
      label: "Weak Readiness",
      description: "Lacks economic buyer proof or defensibility. Needs foundational customer discovery.",
    };
  }
  return {
    category: "not_ready",
    label: "Not Ready as a Venture",
    description: "Unsubstantiated concept. High probability of failure without fundamental repositioning.",
  };
}
