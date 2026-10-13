import type {
  GapItem,
  ScorecardItem,
  VentureProfile,
} from "../types/startupEvaluation";

export class GapAnalysisAgent {
  name = "GapAnalysisAgent";

  identifyGaps(scorecard: ScorecardItem[], profile: VentureProfile): GapItem[] {
    const lowScoring = scorecard.filter((item) => item.score <= 3);

    return lowScoring.map((item) => {
      const dim = item.dimension;

      if (dim === "Customer Clarity") {
        return {
          gap: "Unclear Economic Buyer & Procurement Path",
          frameworkDimension: dim,
          whyItMatters:
            "A startup can have passionate, active users and still fail if no budget holder signs the invoice.",
          justification: item.justification,
          nextValidationTest:
            "Interview 15 target buyers and ask who signs the software procurement budget for this problem.",
        };
      }

      if (dim === "Value Capture") {
        return {
          gap: "Unproven Willingness to Pay",
          frameworkDimension: dim,
          whyItMatters:
            "Customer praise is not product-market fit; founders must prove customers will part with money.",
          justification: item.justification,
          nextValidationTest:
            "Set up a paid landing page or pre-order test with a real Stripe checkout link.",
        };
      }

      if (dim === "Defensibility") {
        return {
          gap: "Vulnerability to Fast Followers & Incumbents",
          frameworkDimension: dim,
          whyItMatters:
            "Without proprietary data flywheels, high switching costs, or deep workflow lock-in, generic AI tools will commoditize the solution.",
          justification: item.justification,
          nextValidationTest:
            "Identify and protect one proprietary data integration or workflow habit that competitors cannot easily copy.",
        };
      }

      if (dim === "Evidence Quality") {
        return {
          gap: "Low Position on the Evidence Ladder",
          frameworkDimension: dim,
          whyItMatters:
            "Founder belief alone cannot justify engineering capital before real customer usage is documented.",
          justification: item.justification,
          nextValidationTest:
            "Climb from Level 0/1 to Level 2 by conducting 15 structured customer discovery calls without pitching solutions.",
        };
      }

      if (dim === "Problem Pain") {
        return {
          gap: "Unquantified Problem Severity",
          frameworkDimension: dim,
          whyItMatters:
            "Nice-to-have vitamins get deprioritized or cancelled during corporate budget reviews.",
          justification: item.justification,
          nextValidationTest:
            "Measure the exact hours wasted or dollars lost per month with 10 current practitioners.",
        };
      }

      if (dim === "Why This Team") {
        return {
          gap: "Unproven Domain or Distribution Advantage",
          frameworkDimension: dim,
          whyItMatters:
            "Teams without unfair distribution or domain depth struggle to acquire early customers cost-effectively.",
          justification: item.justification,
          nextValidationTest:
            "Recruit an active industry advisor or commercial co-founder with a direct network of potential buyers.",
        };
      }

      // Default gap for other low dimensions
      return {
        gap: `Under-validated assumptions in ${dim}`,
        frameworkDimension: dim,
        whyItMatters: `Startups in the top 10% consistently de-risk ${dim} before investing heavily in scaling.`,
        justification: item.justification,
        nextValidationTest: `Run a dedicated 7-day experiment to validate ${dim} with real users.`,
      };
    });
  }
}
