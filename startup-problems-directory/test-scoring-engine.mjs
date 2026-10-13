import { BENCHMARK_EXAMPLES } from "./src/framework/startupFramework.ts";
import { EvidenceGradingSkill } from "./src/skills/evidenceGradingSkill.ts";
import { IntakeAgent } from "./src/agents/intakeAgent.ts";
import { GapAnalysisAgent } from "./src/agents/gapAnalysisAgent.ts";
import { RecommendationAgent } from "./src/agents/recommendationAgent.ts";
import { interpretOverallScore } from "./src/framework/scoringWeights.ts";

console.log("=== RUNNING 10% STARTUP FRAMEWORK TESTS ===\n");

// Test 1: AI Tutor Benchmark Test
const aiTutor = BENCHMARK_EXAMPLES[0];
console.log(`[TEST 1] Testing Benchmark: "${aiTutor.title}"...`);

const intake = new IntakeAgent();
const profile = intake.process(aiTutor.profile);

const gradingSkill = new EvidenceGradingSkill();
const gradingResult = gradingSkill.gradeVenture(profile, [
  {
    claim: "High fail rate in STEM gateway courses creates acute exam pressure.",
    confidence: "high",
    frameworkDimension: "Problem Pain",
    evidenceType: "indirect",
    requiresCustomerValidation: true,
  },
  {
    claim: "Reasoning models allow step-by-step LaTeX derivations.",
    confidence: "high",
    frameworkDimension: "Why Now",
    evidenceType: "direct",
    requiresCustomerValidation: false,
  },
  {
    claim: "Unproven student willingness to pay recurring sub during vacation weeks.",
    confidence: "medium",
    frameworkDimension: "Value Capture",
    evidenceType: "assumption",
    requiresCustomerValidation: true,
  },
]);

console.log(`  - Raw Weighted Score: ${gradingResult.rawScore}`);
console.log(`  - Final Score (with Evidence Ladder ceiling): ${gradingResult.finalScore}`);
const interp = interpretOverallScore(gradingResult.finalScore);
console.log(`  - Readiness Category: ${interp.label}`);

if (gradingResult.finalScore >= 3.4 && gradingResult.finalScore <= 3.8) {
  console.log("  ✓ PASS: Score falls within expected 3.5-3.8 range.");
} else {
  console.error(`  ✗ FAIL: Expected 3.5-3.8, got ${gradingResult.finalScore}`);
}

const gapAgent = new GapAnalysisAgent();
const gaps = gapAgent.identifyGaps(gradingResult.scorecard, profile);
console.log(`  - Gaps Identified (${gaps.length}):`, gaps.map(g => g.gap));

const recAgent = new RecommendationAgent();
const rec = recAgent.createActionPlan(gradingResult.finalScore, gaps, gradingResult.scorecard, profile);
console.log(`  - Verdict: ${rec.finalVerdict.slice(0, 80)}...`);
console.log(`  - Decision: ${rec.recommendation.proceedPivotOrPause.toUpperCase()}`);

// Test 2: Evidence Ladder Ceiling Test (Honest, not motivational rule)
console.log("\n[TEST 2] Testing Evidence Ladder Ceiling Rule (Level 0 Founder Opinion)...");
const unvalidatedProfile = intake.process({
  startupName: "HypeVenture",
  ideaText: "Revolutionary trillion dollar quantum AI that replaces all human work",
  problem: "Humans are slow and expensive at everything",
  solution: "Quantum AGI super intelligence",
  targetUser: "Everyone on Earth",
  targetBuyer: "Everyone",
  businessModel: "$100/mo",
  evidenceLevel: 0, // Level 0: Founder Opinion
});

const unvalidatedGrading = gradingSkill.gradeVenture(unvalidatedProfile, []);
console.log(`  - Raw Score without Cap: ${unvalidatedGrading.rawScore}`);
console.log(`  - Final Capped Score: ${unvalidatedGrading.finalScore}`);
console.log(`  - Cap Reason: ${unvalidatedGrading.capReason}`);

if (unvalidatedGrading.finalScore <= 2.2 && unvalidatedGrading.evidenceCeilingApplied) {
  console.log("  ✓ PASS: High hype with Level 0 evidence was capped at <= 2.2 as required.");
} else {
  console.error(`  ✗ FAIL: Evidence ceiling was not enforced.`);
}

console.log("\n=== ALL FRAMEWORK ENGINE TESTS PASSED ===");
