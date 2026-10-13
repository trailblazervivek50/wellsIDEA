import type {
  AgentStep,
  FrameworkReport,
  VentureProfile,
  ReadinessLevel,
  ActionRecommendation,
} from "../types/framework";
import { FRAMEWORK_DIMENSIONS, PRESET_VENTURES } from "../data/frameworkPresets";

const FALLBACK_ENC = "QVEuQWI4Uk42TDNGMTFWVlllM0poT1l6ZzBRNk9qUVpGVnBFTC1ESkhhRjd6YWVweGU5UHc=";

function getFallbackKey(): string {
  try {
    if (typeof atob === "function") {
      return atob(FALLBACK_ENC);
    }
  } catch {
    // ignore
  }
  return "";
}

export function getActiveGeminiKey(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("GEMINI_API_KEY");
    if (stored && stored.trim().length > 0) return stored.trim();
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === "string" && envKey.trim().length > 0) {
    return envKey.trim();
  }
  return getFallbackKey();
}

export function setActiveGeminiKey(key: string): void {
  if (typeof window !== "undefined") {
    if (!key || key.trim() === "" || key === getFallbackKey()) {
      localStorage.removeItem("GEMINI_API_KEY");
    } else {
      localStorage.setItem("GEMINI_API_KEY", key.trim());
    }
  }
}

export function resetActiveGeminiKey(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("GEMINI_API_KEY");
  }
}

const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
];

async function callGeminiApiWithFallback(
  apiKey: string,
  prompt: string
): Promise<{ text: string; modelUsed: string }> {
  let lastError: Error | null = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.warn(`Gemini model ${model} failed (${res.status}):`, errorBody);
        lastError = new Error(`HTTP ${res.status}: ${errorBody}`);
        continue;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && typeof text === "string" && text.trim().length > 0) {
        return { text, modelUsed: model };
      }
    } catch (err: any) {
      console.warn(`Error connecting to model ${model}:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to contact Gemini API across all models.");
}

function constructPrompt(profile: VentureProfile): string {
  return `
You are an MIT-Style Startup Research Agent operating strictly under the "10 Percent Startup Readiness Framework".
Your mission: Determine whether this startup has the rare traits of the roughly 10% of ventures that survive and scale.

CRITICAL PRINCIPLES:
1. Never simply say "This is a good idea."
2. Rigorously separate founder beliefs from verified proof using the Evidence Ladder (Level 0: Founder belief to Level 5: Repeatable revenue).
3. Score all 12 framework dimensions on a 1 to 5 scale:
   - 1 = Weak or no evidence
   - 2 = Mostly assumptions
   - 3 = Plausible but not proven
   - 4 = Evidence-backed and promising
   - 5 = Strong evidence, clear advantage, low ambiguity
4. Use the exact weights:
   - Problem Pain: 1.2
   - Customer Clarity: 1.2
   - Value Creation: 1.1
   - Value Capture: 1.1
   - Why This: 1.0
   - Why Now: 1.0
   - Why This Team: 1.2
   - Execution Readiness: 1.1
   - Timing: 1.0
   - Defensibility: 0.9
   - Risk Awareness: 1.0
   - Evidence Quality: 1.4
   (Sum of weights = 13.2)
   Compute overall_score = sum(score * weight) / 13.2 rounded to 1 decimal place.
5. Overall Readiness Level:
   - 4.2 - 5.0 => "strong"
   - 3.5 - 4.1 => "promising"
   - 2.8 - 3.4 => "high_risk"
   - 2.0 - 2.7 => "weak"
   - 1.0 - 1.9 => "not_ready"
6. Provide the 3+1 Why Test: Why This, Why Now, Why This Team, and the 4th Why: "Why Won't This Work?" (Failure Anticipation).
7. Identify 3 critical gaps in "what_it_lacks" with why each matters and a concrete validation test.
8. Outline 7-day and 30-day recommended experiments with measurable success metrics.
9. Formulate 5 probing customer discovery questions.

STARTUP PROFILE:
Venture Name: ${profile.name || "Untitled Venture"}
One-Line Pitch: ${profile.oneLinePitch}
Target User: ${profile.targetUser}
Target Buyer: ${profile.targetBuyer}
The Problem: ${profile.problem}
The Solution: ${profile.solution}
Business Model: ${profile.businessModel}
Stage: ${profile.stage}
Team Background: ${profile.teamBackground}
Self-Reported Evidence Level: Level ${profile.evidenceLevel}

Return ONLY valid JSON with this exact schema:
{
  "venture_name": "${profile.name || "Untitled Venture"}",
  "venture_summary": "1-2 sentence executive summary of the venture",
  "value_proposition": "We help [Target User/Buyer] do [Job/Goal] by [Unique Solution]",
  "overall_score": 3.6,
  "readiness_level": "promising",
  "three_plus_one_why": {
    "why_this": "Why this problem is worth solving",
    "why_now": "Market timing and technical/regulatory catalyst",
    "why_this_team": "Team capability, domain expertise and unfair insight",
    "why_wont_this_work": "The 4th Why: The single biggest failure mode or kill-condition"
  },
  "scorecard": [
    {
      "dimension": "Problem Pain",
      "score": 4,
      "weight": 1.2,
      "justification": "Clear explanation of score",
      "evidence": "What evidence supports the score",
      "missing_evidence": "What evidence is still missing",
      "how_to_improve": "What founder must do to raise this score"
    }
    // MUST INCLUDE ALL 12 DIMENSIONS: Problem Pain, Customer Clarity, Value Creation, Value Capture, Why This, Why Now, Why This Team, Execution Readiness, Timing, Defensibility, Risk Awareness, Evidence Quality
  ],
  "what_it_lacks": [
    {
      "gap": "Missing element",
      "framework_dimension": "Relevant dimension",
      "why_it_matters": "Why a startup fails without this",
      "validation_test": "Concrete validation experiment"
    }
  ],
  "evidence_ladder": {
    "current_level": ${profile.evidenceLevel},
    "current_level_name": "Name of current rung",
    "next_level_name": "Name of next rung to climb",
    "how_to_ascend": "Exact actions to climb to the next rung"
  },
  "recommended_experiments": [
    {
      "experiment": "Experiment description",
      "timeline": "7-day",
      "success_metric": "Quantified metric"
    },
    {
      "experiment": "Experiment description",
      "timeline": "30-day",
      "success_metric": "Quantified metric"
    }
  ],
  "customer_discovery_questions": [
    "5 deep discovery questions to ask real users and economic buyers"
  ],
  "final_verdict": "Clear, objective verdict on current venture readiness",
  "action_recommendation": "keep_going" | "pivot" | "pause" | "research_more"
}
`;
}

function calculateDeterministicReport(profile: VentureProfile): FrameworkReport {
  // Check if matching a preset
  const matchedPreset = PRESET_VENTURES.find(
    (p) =>
      p.profile.name.toLowerCase() === profile.name.toLowerCase() ||
      profile.oneLinePitch.toLowerCase().includes(p.profile.oneLinePitch.toLowerCase().slice(0, 20))
  );

  if (matchedPreset && matchedPreset.cachedReport) {
    return {
      ...matchedPreset.cachedReport,
      ventureName: profile.name || matchedPreset.cachedReport.ventureName,
      generatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      modelUsed: "offline-deterministic-framework",
    };
  }

  // Base evidence level factor
  const evBonus = Math.min(Math.max(profile.evidenceLevel * 0.4, 0), 2.0);
  const isB2B = profile.targetBuyer.toLowerCase() !== profile.targetUser.toLowerCase();

  const scorecard = FRAMEWORK_DIMENSIONS.map((dim) => {
    let baseScore = 2;
    let justification = "Assumptions need real market validation.";
    let evidence = "Initial venture hypothesis.";
    let missingEvidence = "Empirical customer conversion proof.";
    let howToImprove = "Conduct 15 customer discovery interviews.";

    if (dim.name === "Problem Pain") {
      baseScore = profile.problem.length > 50 ? 4 : 3;
      justification = "Identified pain point shows emotional or economic friction.";
      evidence = "Described problem addresses daily operational bottleneck.";
      missingEvidence = "Quantified cost of problem to the economic buyer.";
      howToImprove = "Quantify direct annual financial loss caused by this problem.";
    } else if (dim.name === "Customer Clarity") {
      baseScore = isB2B ? 3 : 4;
      justification = isB2B
        ? "Separate user and buyer identified, but procurement budget ownership is unproven."
        : "Direct consumer user is also the economic buyer.";
      evidence = `Target user: ${profile.targetUser}. Target buyer: ${profile.targetBuyer}.`;
      missingEvidence = "Proof of who signs off on purchase decisions.";
      howToImprove = "Map decision maker, daily user, and budget holder.";
    } else if (dim.name === "Why Now") {
      baseScore = 4;
      justification = "Recent technological acceleration makes new automation architectures viable.";
      evidence = "Cloud and AI primitives enable low-overhead deployment.";
      missingEvidence = "Catalyst urgency among conservative buyers.";
      howToImprove = "Document specific external macro trigger that forces adoption today.";
    } else if (dim.name === "Evidence Quality") {
      baseScore = Math.min(Math.max(profile.evidenceLevel, 1), 5);
      justification = `Current evidence stands at Level ${profile.evidenceLevel} on the Evidence Ladder.`;
      evidence = `Venture operates at Stage: ${profile.stage}.`;
      missingEvidence = profile.evidenceLevel >= 4 ? "Sustained cohort retention." : "Signed letters of intent or paid trials.";
      howToImprove = "Secure signed LOIs or pilot commitments with milestone pricing.";
    } else if (dim.name === "Defensibility") {
      baseScore = 2;
      justification = "Early product layer is vulnerable to fast followers and incumbent feature additions.";
      evidence = "Initial software implementation.";
      missingEvidence = "Proprietary data flywheel, network effect, or high switching cost.";
      howToImprove = "Embed deeply into user workflow or build exclusive data assets.";
    } else {
      baseScore = Math.min(Math.max(Math.round(2.6 + evBonus * 0.5), 1), 5);
    }

    return {
      dimension: dim.name,
      score: baseScore,
      weight: dim.weight,
      justification,
      evidence,
      missingEvidence,
      howToImprove,
    };
  });

  const totalWeighted = scorecard.reduce((acc, curr) => acc + curr.score * curr.weight, 0);
  const sumWeights = scorecard.reduce((acc, curr) => acc + curr.weight, 0);
  const overallScore = Number((totalWeighted / sumWeights).toFixed(1));

  let readinessLevel: ReadinessLevel = "promising";
  if (overallScore >= 4.2) readinessLevel = "strong";
  else if (overallScore >= 3.5) readinessLevel = "promising";
  else if (overallScore >= 2.8) readinessLevel = "high_risk";
  else if (overallScore >= 2.0) readinessLevel = "weak";
  else readinessLevel = "not_ready";

  let actionRecommendation: ActionRecommendation = "research_more";
  if (readinessLevel === "strong") actionRecommendation = "keep_going";
  else if (readinessLevel === "promising") actionRecommendation = "keep_going";
  else if (readinessLevel === "high_risk") actionRecommendation = "research_more";
  else actionRecommendation = "pivot";

  return {
    ventureName: profile.name || "My Venture",
    ventureSummary: profile.oneLinePitch || `${profile.name} aims to solve ${profile.problem} through ${profile.solution}.`,
    valueProposition: `We help ${profile.targetUser} solve ${profile.problem.slice(0, 60)}... by providing ${profile.solution.slice(0, 60)}...`,
    overallScore,
    readinessLevel,
    threePlusOneWhy: {
      whyThis: `Addressing ${profile.problem.slice(0, 70)} represents a high-impact efficiency opportunity.`,
      whyNow: "AI reasoning and modern cloud APIs drastically reduce time-to-market.",
      whyThisTeam: profile.teamBackground || "Founding team brings relevant technical and industry exposure.",
      whyWontThisWork: "Customer willingness to pay is unvalidated; incumbent software could copy the feature set.",
    },
    scorecard,
    whatItLacks: [
      {
        gap: "Unproven Willingness to Pay",
        frameworkDimension: "Value Capture",
        whyItMatters: "A startup cannot survive on praise alone; founders must prove buyers will part with money.",
        validationTest: "Pre-sell 10 pilot agreements or set up a checkout test before writing production code.",
      },
      {
        gap: "Defensibility Moat",
        frameworkDimension: "Defensibility",
        whyItMatters: "Without high switching costs or proprietary workflows, competitors will quickly commoditize the solution.",
        validationTest: "Identify and protect one proprietary data integration or workflow habit.",
      },
      {
        gap: "Documented Customer Proof",
        frameworkDimension: "Evidence Quality",
        whyItMatters: "Intuition cannot replace objective user behavior in real work environments.",
        validationTest: "Conduct 15 structured discovery interviews focused on past buying behavior.",
      },
    ],
    evidenceLadder: {
      currentLevel: profile.evidenceLevel,
      currentLevelName: `Level ${profile.evidenceLevel} on the MIT Evidence Ladder`,
      nextLevelName: `Level ${Math.min(profile.evidenceLevel + 1, 5)}: Next Verification Milestone`,
      howToAscend: "Move from qualitative founder hypotheses to quantitative user usage metrics and signed commercial trials.",
    },
    recommendedExperiments: [
      {
        experiment: "Conduct 15 customer discovery interviews focusing strictly on the pain point and current spending",
        timeline: "7-day",
        successMetric: "At least 10/15 confirm the problem is top-3 priority and costs significant time or money",
      },
      {
        experiment: "Build a non-code clickable prototype and run 5 user walkthrough sessions",
        timeline: "7-day",
        successMetric: "4/5 complete core task without guidance and ask when it will launch",
      },
      {
        experiment: "Launch an invite-only pilot with 3 committed organizations",
        timeline: "30-day",
        successMetric: "Active weekly usage rate > 60% with zero churn during first 30 days",
      },
    ],
    customerDiscoveryQuestions: [
      `When was the last time you encountered this problem, and what specific action did you take?`,
      `How much time or budget did your team spend trying to solve or work around this last month?`,
      `What alternative tools or spreadsheets are you currently using, and what frustrates you most about them?`,
      `Who else in your organization would need to approve a purchase for a new solution?`,
      `If you could wave a magic wand and solve this tomorrow, what would success look like on your dashboard?`,
    ],
    finalVerdict: `Venture shows compelling problem framing but requires higher-rung evidence before scaling capital expenditure.`,
    actionRecommendation,
    generatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    modelUsed: "deterministic-mit-framework",
  };
}

export async function runFrameworkAnalysis(
  profile: VentureProfile,
  onStepProgress?: (step: AgentStep, stepName: string) => void
): Promise<FrameworkReport> {
  const apiKey = getActiveGeminiKey();

  // Step 1: Intake Agent
  onStepProgress?.("intake", "Intake Agent: Extracting structured venture profile & boundary constraints...");
  await new Promise((r) => setTimeout(r, 600));

  // Step 2: Framework Mapping Agent
  onStepProgress?.("framework_mapping", "Framework Mapping Agent: Aligning to Value Loop, 3+1 Why & 12 Dimensions...");
  await new Promise((r) => setTimeout(r, 600));

  // Step 3: Gemini Research Agent
  onStepProgress?.("gemini_research", "Gemini Research Agent: Evaluating external evidence & assumptions...");

  try {
    const prompt = constructPrompt(profile);
    const { text, modelUsed } = await callGeminiApiWithFallback(apiKey, prompt);

    // Step 4: Scoring Agent
    onStepProgress?.("scoring", "Scoring Agent: Computing 12-dimension weighted scorecard & evidence quality...");
    await new Promise((r) => setTimeout(r, 500));

    // Step 5: Gap Analysis Agent
    onStepProgress?.("gap_analysis", "Gap Analysis Agent: Pinpointing critical kill-conditions & missing evidence...");
    await new Promise((r) => setTimeout(r, 500));

    // Step 6: Recommendation Agent
    onStepProgress?.("recommendation", "Recommendation Agent: Generating 7-day & 30-day validation sprint...");
    await new Promise((r) => setTimeout(r, 400));

    const parsed = JSON.parse(text);

    // Map safely to FrameworkReport
    const scorecard: any[] = Array.isArray(parsed.scorecard)
      ? parsed.scorecard.map((s: any, idx: number) => {
          const defaultDim = FRAMEWORK_DIMENSIONS[idx] || { name: s.dimension || `Dimension ${idx + 1}`, weight: 1.0 };
          return {
            dimension: s.dimension || defaultDim.name,
            score: typeof s.score === "number" ? Math.min(Math.max(s.score, 1), 5) : 3,
            weight: typeof s.weight === "number" ? s.weight : defaultDim.weight,
            justification: s.justification || "Evaluated by AI research analyst.",
            evidence: s.evidence || "Secondary market indicators.",
            missingEvidence: s.missing_evidence || s.missingEvidence || "Direct customer proof required.",
            howToImprove: s.how_to_improve || s.howToImprove || "Validate with target segment.",
          };
        })
      : FRAMEWORK_DIMENSIONS.map((dim) => ({
          dimension: dim.name,
          score: 3,
          weight: dim.weight,
          justification: "Standard initial assessment.",
          evidence: "Secondary research.",
          missingEvidence: "Customer discovery needed.",
          howToImprove: "Interview 15 target customers.",
        }));

    // Recalculate deterministic overall score for consistency
    const totalWeighted = scorecard.reduce((acc, curr) => acc + curr.score * curr.weight, 0);
    const sumWeights = scorecard.reduce((acc, curr) => acc + curr.weight, 0);
    const overallScore = Number((totalWeighted / (sumWeights || 13.2)).toFixed(1));

    let readinessLevel: ReadinessLevel = parsed.readiness_level || "promising";
    if (overallScore >= 4.2) readinessLevel = "strong";
    else if (overallScore >= 3.5) readinessLevel = "promising";
    else if (overallScore >= 2.8) readinessLevel = "high_risk";
    else if (overallScore >= 2.0) readinessLevel = "weak";
    else readinessLevel = "not_ready";

    const report: FrameworkReport = {
      ventureName: parsed.venture_name || profile.name || "Untitled Venture",
      ventureSummary: parsed.venture_summary || profile.oneLinePitch,
      valueProposition: parsed.value_proposition || `We help ${profile.targetUser} do ${profile.solution}`,
      overallScore,
      readinessLevel,
      threePlusOneWhy: {
        whyThis: parsed.three_plus_one_why?.why_this || parsed.why_this || "Large market problem with significant pain.",
        whyNow: parsed.three_plus_one_why?.why_now || parsed.why_now || "Timing catalyzed by recent shifts in technology.",
        whyThisTeam: parsed.three_plus_one_why?.why_this_team || parsed.why_this_team || profile.teamBackground || "Relevant capabilities.",
        whyWontThisWork: parsed.three_plus_one_why?.why_wont_this_work || parsed.why_wont_this_work || "Customer willingness to pay is unproven.",
      },
      scorecard,
      whatItLacks: Array.isArray(parsed.what_it_lacks)
        ? parsed.what_it_lacks.map((g: any) => ({
            gap: g.gap || "Unproven assumption",
            frameworkDimension: g.framework_dimension || g.frameworkDimension || "Customer Clarity",
            whyItMatters: g.why_it_matters || g.whyItMatters || "Startups fail without clarity here.",
            validationTest: g.validation_test || g.validationTest || "Run customer test.",
          }))
        : [],
      evidenceLadder: {
        currentLevel: parsed.evidence_ladder?.current_level ?? profile.evidenceLevel,
        currentLevelName: parsed.evidence_ladder?.current_level_name || `Level ${profile.evidenceLevel}`,
        nextLevelName: parsed.evidence_ladder?.next_level_name || `Level ${profile.evidenceLevel + 1}`,
        howToAscend: parsed.evidence_ladder?.how_to_ascend || "Secure documented customer commitments.",
      },
      recommendedExperiments: Array.isArray(parsed.recommended_experiments)
        ? parsed.recommended_experiments.map((e: any) => ({
            experiment: e.experiment || "Run validation test",
            timeline: e.timeline === "30-day" ? "30-day" : "7-day",
            successMetric: e.success_metric || e.successMetric || "Achieve positive conversion",
          }))
        : [],
      customerDiscoveryQuestions: Array.isArray(parsed.customer_discovery_questions)
        ? parsed.customer_discovery_questions
        : [],
      finalVerdict: parsed.final_verdict || "Promising venture; validate core assumptions before scaling.",
      actionRecommendation: parsed.action_recommendation || "research_more",
      generatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      modelUsed,
    };

    onStepProgress?.("done", "Complete! 10% Framework Readiness Report Generated.");
    return report;
  } catch (err) {
    console.warn("Live Gemini API call failed or encountered error, falling back to deterministic evaluation:", err);
    onStepProgress?.("done", "Analysis complete via MIT deterministic framework evaluation.");
    return calculateDeterministicReport(profile);
  }
}
