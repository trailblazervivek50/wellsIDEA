import type {
  GapItem,
  ProceedDecision,
  Recommendation,
  ScorecardItem,
  ValidationExperiment,
  VentureProfile,
} from "../types/startupEvaluation";

export class RecommendationAgent {
  name = "RecommendationAgent";

  createActionPlan(
    score: number,
    gaps: GapItem[],
    _scorecard: ScorecardItem[],
    profile: VentureProfile
  ): {
    recommendation: Recommendation;
    experiments: ValidationExperiment[];
    finalVerdict: string;
  } {
    let proceedPivotOrPause: ProceedDecision = "pause";
    if (score >= 4.0) {
      proceedPivotOrPause = "proceed";
    } else if (score >= 3.0) {
      proceedPivotOrPause = "pivot"; // Or validate gaps before building
    } else {
      proceedPivotOrPause = "pause";
    }

    const topThreeGaps = gaps.slice(0, 3).map((g) => g.gap);

    const sevenDayValidationPlan = [
      `Conduct 15 customer discovery interviews focusing strictly on the pain point and current spending.`,
      `Create a clickable wireframe or non-code concierge demo and test with 5 target users.`,
      `Set up an explicit pricing landing page or pre-order form to test customer intent before building.`,
    ];

    const thirtyDayValidationPlan = [
      `Run a blinded 2-week pilot with 3 committed organizations and measure actual usage frequency.`,
      `Collect at least 2 non-binding Letters of Intent (LOIs) or paid pre-orders from economic buyers.`,
      `Document quantified customer outcome proof (e.g. hours saved, error reduction, or dollar savings).`,
    ];

    const metricsThatWouldImproveScore = [
      "Customer discovery interview count: &ge; 15 verified economic buyers",
      "Paid pilot conversion rate: &ge; 20% of qualified trial leads",
      "Organic daily or weekly usage retention &ge; 60% over 14 consecutive days",
      "Documented economic buyer ROI: &ge; 3x proposed subscription price",
    ];

    let finalVerdict = "";
    if (score >= 4.2) {
      finalVerdict = `Strong 10% candidate. The venture demonstrates clear problem pain, defined buyers, and favorable market timing. Proceed with structured paid pilots while tracking cohort retention.`;
    } else if (score >= 3.5) {
      finalVerdict = `Promising venture with genuine market pull, but not yet a proven 10% candidate. It exhibits critical gaps in buyer clarity, defensibility, and proof of willingness to pay. De-risk these assumptions with customer discovery before scaling engineering.`;
    } else if (score >= 2.8) {
      finalVerdict = `Interesting concept but under-validated. The venture relies heavily on founder assumptions rather than empirical proof. Run 7-day discovery interviews to verify that the problem is a top-3 urgent priority.`;
    } else {
      finalVerdict = `Not ready as a venture in its current formulation. The pain point or economic buyer is too ambiguous to justify commercial capital. Re-evaluate the core customer friction.`;
    }

    const experiments: ValidationExperiment[] = [
      {
        experiment: `Conduct 15 structured discovery interviews with ${profile.targetUser} and ${profile.targetBuyer}`,
        timeline: "7-day",
        successMetric: "At least 10/15 confirm the problem is urgent and currently causes measurable financial or operational loss.",
      },
      {
        experiment: `Run an unbuilt offer test (concierge workflow or landing page pre-order) at ${profile.businessModel}`,
        timeline: "7-day",
        successMetric: "Achieve &ge; 3 commercial signups or written pilot commitments.",
      },
      {
        experiment: `Deploy a 14-day prototype pilot with 3 prospective organizations`,
        timeline: "30-day",
        successMetric: "Demonstrate &ge; 70% task completion and secure 1 conversion to paid retainer.",
      },
      {
        experiment: `Establish defensibility by building one proprietary integration or verified domain dataset`,
        timeline: "30-day",
        successMetric: "Lock in workflow switching costs that generic horizontal AI models cannot replicate.",
      },
    ];

    return {
      recommendation: {
        finalVerdict,
        topThreeGaps,
        sevenDayValidationPlan,
        thirtyDayValidationPlan,
        metricsThatWouldImproveScore,
        proceedPivotOrPause,
      },
      experiments,
      finalVerdict,
    };
  }
}
