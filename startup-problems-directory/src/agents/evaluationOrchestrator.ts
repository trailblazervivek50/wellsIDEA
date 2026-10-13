import type {
  EvaluationAgentStep,
  StartupEvaluationReport,
  ThreePlusOneWhy,
} from "../types/startupEvaluation";
import { IntakeAgent, type IntakeRawInput } from "./intakeAgent";
import { FrameworkMapperAgent } from "./frameworkMapperAgent";
import { GeminiResearchAgent } from "./geminiResearchAgent";
import { EvidenceNormalizerAgent } from "./evidenceNormalizerAgent";
import { ScoringAgent } from "./scoringAgent";
import { GapAnalysisAgent } from "./gapAnalysisAgent";
import { RecommendationAgent } from "./recommendationAgent";
import { interpretOverallScore } from "../framework/scoringWeights";
import { getGeminiModel } from "../plugins/geminiResearchPlugin";
import { RiskAnalysisSkill } from "../skills/riskAnalysisSkill";

export interface OrchestrationOptions {
  onStepProgress?: (step: EvaluationAgentStep, message: string) => void;
}

export async function orchestrateStartupEvaluation(
  input: IntakeRawInput,
  options?: OrchestrationOptions
): Promise<StartupEvaluationReport> {
  const { onStepProgress } = options || {};

  // 1. Intake Agent
  onStepProgress?.("intake", "Intake Agent: Structuring raw founder input into clean venture parameters...");
  const intakeAgent = new IntakeAgent();
  const ventureProfile = intakeAgent.process(input);
  await new Promise((r) => setTimeout(r, 200));

  // 2. Framework Mapper Agent
  onStepProgress?.("framework_mapping", "Framework Mapper: Mapping profile to 12 framework research questions...");
  const mapperAgent = new FrameworkMapperAgent();
  const researchTasks = mapperAgent.mapQuestions(ventureProfile);
  await new Promise((r) => setTimeout(r, 200));

  // 3. Gemini Research Agent
  onStepProgress?.(
    "gemini_research",
    "Gemini Research Agent: Investigating framework questions (facts vs assumptions)..."
  );
  const researchAgent = new GeminiResearchAgent();
  const rawResults = await researchAgent.conductResearch(
    researchTasks,
    ventureProfile,
    (dim, curr, total) => {
      onStepProgress?.(
        "gemini_research",
        `Gemini Research Agent: Analyzing '${dim}' (${curr}/${total})...`
      );
    }
  );

  // 4. Evidence Normalizer Agent
  onStepProgress?.("evidence_normalization", "Evidence Normalizer: Cleaning research into claims, confidence, and validation flags...");
  const normalizerAgent = new EvidenceNormalizerAgent();
  const normalizedEvidence = normalizerAgent.normalize(rawResults);
  await new Promise((r) => setTimeout(r, 200));

  // 5. Scoring Agent (Our code owns scoring logic and weights)
  onStepProgress?.("scoring", "Scoring Agent: Computing 12-dimension weighted score and evidence ceiling...");
  const scoringAgent = new ScoringAgent();
  const scoringResult = scoringAgent.scoreVenture(ventureProfile, normalizedEvidence);
  await new Promise((r) => setTimeout(r, 200));

  // 6. Gap Analysis Agent
  onStepProgress?.("gap_analysis", "Gap Analysis Agent: Pinpointing what this startup lacks for survival...");
  const gapAgent = new GapAnalysisAgent();
  const whatItLacks = gapAgent.identifyGaps(scoringResult.scorecard, ventureProfile);
  await new Promise((r) => setTimeout(r, 200));

  // 7. Recommendation Agent
  onStepProgress?.("recommendation", "Recommendation Agent: Generating 7-day & 30-day validation sprint...");
  const recAgent = new RecommendationAgent();
  const { recommendation, experiments, finalVerdict } = recAgent.createActionPlan(
    scoringResult.finalScore,
    whatItLacks,
    scoringResult.scorecard,
    ventureProfile
  );

  // 3+1 Why Analysis
  const riskSkill = new RiskAnalysisSkill();
  const riskResult = riskSkill.analyze(ventureProfile, normalizedEvidence);

  const threePlusOneWhy: ThreePlusOneWhy = {
    whyThis: `Solving ${ventureProfile.problem.slice(0, 70)} addresses an acute operational pain point with direct economic consequences.`,
    whyNow: `Modern AI reasoning APIs and digital workflows enable automated deployment without legacy integration bottlenecks.`,
    whyThisTeam: ventureProfile.teamBackground || "Team brings technical and operational focus to the sector.",
    whyWontThisWork: riskResult.primaryKillCondition,
  };

  // Value Proposition: "We help X do Y by doing Z"
  const valueProposition = `We help ${ventureProfile.targetUser} solve ${ventureProfile.problem.slice(0, 50)} by providing ${ventureProfile.solution.slice(0, 60)}.`;

  // Missing evidence summary
  const evidenceMissing = normalizedEvidence
    .filter((e) => e.requiresCustomerValidation || e.evidenceType === "assumption")
    .map((e) => e.claim)
    .slice(0, 5);

  const interpretation = interpretOverallScore(scoringResult.finalScore);

  onStepProgress?.("done", "Complete: 10% Startup Readiness Report generated.");

  return {
    ventureProfile,
    ventureSummary: ventureProfile.oneLineIdea,
    valueProposition,
    threePlusOneWhy,
    scorecard: scoringResult.scorecard,
    overallScore: scoringResult.finalScore,
    readinessCategory: interpretation.category,
    readinessCategoryLabel: interpretation.label,
    whatItLacks,
    evidenceFound: normalizedEvidence.filter((e) => e.evidenceType === "direct"),
    evidenceMissing,
    recommendedValidationExperiments: experiments,
    finalVerdict,
    recommendation,
    generatedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    modelUsed: getGeminiModel(),
  };
}
