import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Key,
  ShieldAlert,
  Flame,
  HelpCircle,
  TrendingUp,
  SlidersHorizontal,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type {
  EvaluationAgentStep,
  StartupEvaluationReport,
  VentureStage,
} from "../types/startupEvaluation";
import { BENCHMARK_EXAMPLES } from "../framework/startupFramework";
import { EVIDENCE_LADDER } from "../framework/evidenceLadder";
import { submitStartupEvaluation } from "../api/startupEvaluationApi";
import { getGeminiApiKey, getGeminiModel } from "../plugins/geminiResearchPlugin";

interface StartupEvaluationPageProps {
  onBack: () => void;
  onBackToFramework?: (origin?: { x: number; y: number }) => void;
}

export function StartupEvaluationPage({ onBack, onBackToFramework }: StartupEvaluationPageProps) {
  // Input form state
  const [ideaText, setIdeaText] = useState<string>(
    BENCHMARK_EXAMPLES[0].profile.oneLineIdea
  );
  const [startupName, setStartupName] = useState<string>(
    BENCHMARK_EXAMPLES[0].profile.startupName
  );
  const [targetUser, setTargetUser] = useState<string>(
    BENCHMARK_EXAMPLES[0].profile.targetUser
  );
  const [targetBuyer, setTargetBuyer] = useState<string>(
    BENCHMARK_EXAMPLES[0].profile.targetBuyer
  );
  const [problem, setProblem] = useState<string>(
    BENCHMARK_EXAMPLES[0].profile.problem
  );
  const [solution, setSolution] = useState<string>(
    BENCHMARK_EXAMPLES[0].profile.solution
  );
  const [businessModel, setBusinessModel] = useState<string>(
    BENCHMARK_EXAMPLES[0].profile.businessModel
  );
  const [industry, setIndustry] = useState<string>(
    BENCHMARK_EXAMPLES[0].profile.industry
  );
  const [geography, setGeography] = useState<string>(
    BENCHMARK_EXAMPLES[0].profile.geography
  );
  const [stage, setStage] = useState<VentureStage>(
    BENCHMARK_EXAMPLES[0].profile.stage
  );
  const [teamBackground, setTeamBackground] = useState<string>(
    BENCHMARK_EXAMPLES[0].profile.teamBackground
  );
  const [evidenceLevel, setEvidenceLevel] = useState<number>(
    BENCHMARK_EXAMPLES[0].profile.evidenceLevel
  );

  // UI state
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [selectedExampleId, setSelectedExampleId] = useState<string>("ai-tutor");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [agentStep, setAgentStep] = useState<EvaluationAgentStep>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [report, setReport] = useState<StartupEvaluationReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [filterScorecard, setFilterScorecard] = useState<"all" | "weak" | "strong">("all");
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  // Settings modal state
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [userApiKey, setUserApiKey] = useState<string>(getGeminiApiKey());
  const [userModel, setUserModel] = useState<string>(getGeminiModel());

  const handleSelectExample = (id: string) => {
    setSelectedExampleId(id);
    setErrorMessage(null);
    if (id === "custom") {
      setStartupName("");
      setIdeaText("");
      setProblem("");
      setSolution("");
      setTargetUser("");
      setTargetBuyer("");
      setBusinessModel("");
      setIndustry("");
      setGeography("");
      setStage("idea");
      setTeamBackground("");
      setEvidenceLevel(0);
      setReport(null);
      setShowAdvanced(true);
    } else {
      const example = BENCHMARK_EXAMPLES.find((e) => e.id === id);
      if (example) {
        setStartupName(example.profile.startupName);
        setIdeaText(example.profile.oneLineIdea);
        setProblem(example.profile.problem);
        setSolution(example.profile.solution);
        setTargetUser(example.profile.targetUser);
        setTargetBuyer(example.profile.targetBuyer);
        setBusinessModel(example.profile.businessModel);
        setIndustry(example.profile.industry);
        setGeography(example.profile.geography);
        setStage(example.profile.stage);
        setTeamBackground(example.profile.teamBackground);
        setEvidenceLevel(example.profile.evidenceLevel);
      }
    }
  };

  const handleRunEvaluation = async () => {
    if (!ideaText.trim()) {
      setErrorMessage("Please enter your startup idea before evaluating.");
      return;
    }

    setErrorMessage(null);
    setIsEvaluating(true);
    setAgentStep("intake");
    setStatusMessage("Intake Agent: Structuring startup idea parameters...");

    try {
      const result = await submitStartupEvaluation(
        {
          startupName,
          ideaText,
          problem,
          solution,
          targetUser,
          targetBuyer,
          businessModel,
          industry,
          geography,
          stage,
          teamBackground,
          evidenceLevel,
        },
        {
          onStepProgress: (step, msg) => {
            setAgentStep(step);
            setStatusMessage(msg);
          },
        }
      );

      setReport(result);
    } catch (err: any) {
      console.error("Evaluation error:", err);
      setErrorMessage(
        err?.message || "Evaluation encountered an unexpected error. Please check your network and API key."
      );
    } finally {
      setIsEvaluating(false);
      setAgentStep("idle");
    }
  };

  const handleSaveSettings = () => {
    if (typeof window !== "undefined") {
      if (userApiKey.trim()) {
        localStorage.setItem("GEMINI_API_KEY", userApiKey.trim());
      } else {
        localStorage.removeItem("GEMINI_API_KEY");
      }
      if (userModel.trim()) {
        localStorage.setItem("GEMINI_MODEL", userModel.trim());
      } else {
        localStorage.removeItem("GEMINI_MODEL");
      }
    }
    setShowKeyModal(false);
  };

  const handleCopyMarkdown = () => {
    if (!report) return;

    const md = `
# 10 Percent Startup Readiness Framework Evaluation
**Venture:** ${report.ventureProfile.startupName}
**Overall Score:** ${report.overallScore} / 5.0 (${report.readinessCategoryLabel})
**Generated:** ${report.generatedAt} (Model: ${report.modelUsed})

## Value Proposition
${report.valueProposition}

## Venture Summary
${report.ventureSummary}

## 3+1 Why Analysis
- **Why This:** ${report.threePlusOneWhy.whyThis}
- **Why Now:** ${report.threePlusOneWhy.whyNow}
- **Why This Team:** ${report.threePlusOneWhy.whyThisTeam}
- **Why Won't This Work (Failure Anticipation):** ${report.threePlusOneWhy.whyWontThisWork}

## 12-Dimension Scorecard
${report.scorecard
  .map(
    (item) =>
      `### ${item.dimension} (Score: ${item.score}/5 | Weight: ${item.weight}x)
- **Justification:** ${item.justification}
- **Evidence:** ${item.evidence.join("; ")}
- **Missing Evidence:** ${item.missingEvidence.join("; ")}
${item.penaltiesApplied.length > 0 ? `- **Penalties:** ${item.penaltiesApplied.join("; ")}` : ""}`
  )
  .join("\n\n")}

## What This Startup Lacks
${report.whatItLacks
  .map(
    (g, idx) =>
      `${idx + 1}. **${g.gap}** [${g.frameworkDimension}]
   - *Why It Matters:* ${g.whyItMatters}
   - *Next Validation Test:* ${g.nextValidationTest}`
  )
  .join("\n\n")}

## Recommended Validation Experiments
${report.recommendedValidationExperiments
  .map((e, idx) => `${idx + 1}. [${e.timeline.toUpperCase()}] ${e.experiment} (Metric: ${e.successMetric})`)
  .join("\n")}

## Final Verdict
**Decision:** ${report.recommendation.proceedPivotOrPause.toUpperCase()}
${report.finalVerdict}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const filteredScorecard = report?.scorecard.filter((item) => {
    if (filterScorecard === "weak") return item.score <= 3;
    if (filterScorecard === "strong") return item.score >= 4;
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-[#FFFBEF] text-[#141A35] font-body relative overflow-x-hidden flex flex-col">
      {/* Top Header */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between border-b-2 border-[#141A35]/15">
        <div className="flex items-center gap-2">
          {onBackToFramework && (
            <motion.button
              type="button"
              onClick={(e) => {
                const origin = { x: e.clientX, y: e.clientY };
                onBackToFramework(origin);
              }}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase text-[#141A35] hover:text-[#2450EA] transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg focus-visible:outline-3 focus-visible:outline-[#2450EA]"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.75} />
              <span>JOURNEY MAP</span>
            </motion.button>
          )}
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase text-[#141A35]/70 hover:text-[#141A35] transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg focus-visible:outline-3 focus-visible:outline-[#2450EA]"
          >
            <span>HOME</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF5] border-2 border-[#141A35] font-heading font-bold text-xs uppercase text-[#141A35] hover:bg-[#FFD329] transition-colors shadow-[2px_2px_0_#141A35] cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>GEMINI SETTINGS</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] relative overflow-hidden">
          <div className="space-y-3 max-w-3xl relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD329] border-2 border-[#141A35] font-heading font-extrabold text-xs tracking-wider uppercase text-[#141A35] shadow-[2px_2px_0_#141A35]">
                <Sparkles className="w-3.5 h-3.5" />
                10 PERCENT STARTUP READINESS FRAMEWORK
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2450EA] border-2 border-[#141A35] font-heading font-extrabold text-xs tracking-wider uppercase text-white shadow-[2px_2px_0_#141A35]">
                DETERMINISTIC SCORING ENGINE
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#141A35] leading-tight">
              Honest, evidence-backed startup evaluation.
            </h1>

            <p className="font-body text-base sm:text-lg text-[#141A35]/85 leading-relaxed">
              Gemini researches the market in the background, but our own backend strictly owns the 12-dimension scoring weights, Evidence Ladder rules, and gap analysis. <strong>No cheerleading. Pure validation.</strong>
            </p>
          </div>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#FFD329] border-[3px] border-[#141A35] pointer-events-none -z-0 opacity-30" />
        </div>

        {/* Benchmark Example Switcher */}
        <div className="space-y-2.5">
          <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
            Choose a benchmark scenario or evaluate your own idea:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BENCHMARK_EXAMPLES.map((ex) => {
              const isSelected = selectedExampleId === ex.id;
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleSelectExample(ex.id)}
                  className={`p-4 rounded-2xl border-[2.5px] border-[#141A35] text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FFD329] shadow-[5px_5px_0_#141A35] -translate-y-1 font-bold"
                      : "bg-[#FFFDF5] shadow-[3px_3px_0_#141A35] hover:bg-white hover:-translate-y-0.5"
                  }`}
                >
                  <div className="font-heading font-extrabold text-[11px] text-[#141A35]/70 mb-1">
                    {ex.badge}
                  </div>
                  <div className="font-heading font-black text-sm text-[#141A35] line-clamp-1">
                    {ex.title}
                  </div>
                  <div className="text-[11px] text-[#141A35]/80 line-clamp-2 mt-1">
                    {ex.profile.oneLineIdea}
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handleSelectExample("custom")}
              className={`p-4 rounded-2xl border-[2.5px] border-[#141A35] text-left transition-all cursor-pointer ${
                selectedExampleId === "custom"
                  ? "bg-[#2450EA] text-white shadow-[5px_5px_0_#141A35] -translate-y-1 font-bold"
                  : "bg-[#FFFDF5] shadow-[3px_3px_0_#141A35] hover:bg-white hover:-translate-y-0.5"
              }`}
            >
              <div className={`font-heading font-extrabold text-[11px] mb-1 ${selectedExampleId === "custom" ? "text-white/80" : "text-[#141A35]/70"}`}>
                ✨ Blank Slate
              </div>
              <div className="font-heading font-black text-sm line-clamp-1">
                Enter Your Own Idea
              </div>
              <div className={`text-[11px] line-clamp-2 mt-1 ${selectedExampleId === "custom" ? "text-white/90" : "text-[#141A35]/80"}`}>
                Submit any startup concept for multi-agent evaluation.
              </div>
            </button>
          </div>
        </div>

        {/* Intake Form */}
        <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] space-y-6">
          <div className="space-y-2">
            <label className="block font-heading font-extrabold text-sm uppercase tracking-wider text-[#141A35]">
              1. Startup Idea (Primary Input) *
            </label>
            <textarea
              rows={3}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="e.g. Software that helps independent restaurants reduce food waste by predicting daily demand..."
              className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-2xl p-4 font-body font-semibold text-sm sm:text-base text-[#141A35] shadow-[3px_3px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
            />
          </div>

          {/* Toggle for Advanced Fields */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-2 font-heading font-extrabold text-xs uppercase tracking-wider text-[#2450EA] hover:text-[#141A35] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{showAdvanced ? "Hide Advanced Venture Fields" : "Show Advanced Venture Fields (Recommended)"}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5 pt-2 border-t-2 border-[#141A35]/15"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                      Startup Name
                    </label>
                    <input
                      type="text"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      placeholder="e.g. FreshForecast"
                      className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-xs text-[#141A35] shadow-[2px_2px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                      Industry &amp; Geography
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="e.g. EdTech"
                        className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-3 py-2.5 font-body font-semibold text-xs text-[#141A35] shadow-[2px_2px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                      />
                      <input
                        type="text"
                        value={geography}
                        onChange={(e) => setGeography(e.target.value)}
                        placeholder="e.g. North America"
                        className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-3 py-2.5 font-body font-semibold text-xs text-[#141A35] shadow-[2px_2px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                      Target User (Daily Operator)
                    </label>
                    <input
                      type="text"
                      value={targetUser}
                      onChange={(e) => setTargetUser(e.target.value)}
                      placeholder="e.g. Undergraduate engineering students"
                      className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-xs text-[#141A35] shadow-[2px_2px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                      Target Buyer (Budget Holder)
                    </label>
                    <input
                      type="text"
                      value={targetBuyer}
                      onChange={(e) => setTargetBuyer(e.target.value)}
                      placeholder="e.g. University department head or student parents"
                      className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-xs text-[#141A35] shadow-[2px_2px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                      The Problem (Pain Point)
                    </label>
                    <textarea
                      rows={2}
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="What expensive, urgent friction exists today?"
                      className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl p-3 font-body font-semibold text-xs text-[#141A35] shadow-[2px_2px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                      Proposed Solution
                    </label>
                    <textarea
                      rows={2}
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="How does your solution eliminate this friction with measurable ROI?"
                      className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl p-3 font-body font-semibold text-xs text-[#141A35] shadow-[2px_2px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                      Business Model &amp; Pricing
                    </label>
                    <input
                      type="text"
                      value={businessModel}
                      onChange={(e) => setBusinessModel(e.target.value)}
                      placeholder="e.g. $19/mo student sub or $149/mo restaurant SaaS"
                      className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-xs text-[#141A35] shadow-[2px_2px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                      Team Background &amp; Advantage
                    </label>
                    <input
                      type="text"
                      value={teamBackground}
                      onChange={(e) => setTeamBackground(e.target.value)}
                      placeholder="e.g. 2 MIT engineering grads with ML background"
                      className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-xs text-[#141A35] shadow-[2px_2px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                    />
                  </div>
                </div>

                {/* Stage and Evidence Ladder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-1.5">
                    <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                      Current Stage
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(["idea", "prototype", "pilot", "revenue", "scaling"] as VentureStage[]).map((stg) => (
                        <button
                          key={stg}
                          type="button"
                          onClick={() => setStage(stg)}
                          className={`px-3 py-1.5 rounded-xl border-2 border-[#141A35] font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            stage === stg
                              ? "bg-[#2450EA] text-white shadow-[2px_2px_0_#141A35]"
                              : "bg-[#FFFBEF] text-[#141A35] hover:bg-[#FFD329]"
                          }`}
                        >
                          {stg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                      Evidence Ladder Position (Level 0–5)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {EVIDENCE_LADDER.map((ev) => (
                        <button
                          key={ev.level}
                          type="button"
                          onClick={() => setEvidenceLevel(ev.level)}
                          className={`p-2 text-center rounded-xl border-2 border-[#141A35] transition-all cursor-pointer ${
                            evidenceLevel === ev.level
                              ? "bg-[#F4779B] text-[#141A35] font-black shadow-[2px_2px_0_#141A35]"
                              : "bg-[#FFFBEF] text-[#141A35]/70 hover:bg-white"
                          }`}
                        >
                          <div className="text-xs font-heading font-black">L{ev.level}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t-2 border-[#141A35]/15">
            <div className="text-xs font-body text-[#141A35]/70 text-center sm:text-left">
              Evaluates against all 12 dimensions: Problem Pain, Customer Clarity, Defensibility, Evidence Ladder, and more.
            </div>

            <motion.button
              type="button"
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
              whileHover={{ scale: 1.02, x: -2, y: -2 }}
              whileTap={{ scale: 0.98, x: 2, y: 2 }}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FFD329] border-[3px] border-[#141A35] font-heading font-black text-sm sm:text-base uppercase tracking-wider text-[#141A35] shadow-[6px_6px_0_#141A35] hover:shadow-[8px_8px_0_#141A35] transition-shadow inline-flex items-center justify-center gap-2.5 cursor-pointer ${
                isEvaluating ? "opacity-75 cursor-wait" : ""
              }`}
            >
              {isEvaluating ? (
                <>
                  <RotateCcw className="w-5 h-5 animate-spin" />
                  <span>RUNNING 10% EVALUATION...</span>
                </>
              ) : (
                <>
                  <span>EVALUATE STARTUP IDEA</span>
                  <ArrowRight className="w-5 h-5" strokeWidth={3} />
                </>
              )}
            </motion.button>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-100 border-2 border-red-500 text-red-900 font-heading font-bold text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Live Multi-Agent Progress State */}
        <AnimatePresence>
          {isEvaluating && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="bg-[#2450EA] border-[3px] border-[#141A35] rounded-3xl p-6 shadow-[6px_6px_0_#141A35] text-white space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 animate-pulse text-[#FFD329]" />
                  <span className="font-heading font-black text-lg uppercase tracking-wider">
                    7-Agent Framework Pipeline Active
                  </span>
                </div>
                <span className="font-heading font-extrabold text-xs uppercase px-3 py-1 bg-[#141A35] text-white rounded-full border border-white/20">
                  {agentStep}
                </span>
              </div>

              <p className="font-body text-sm font-semibold text-white/95">
                {statusMessage}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
                {[
                  { id: "intake", name: "1. Intake" },
                  { id: "framework_mapping", name: "2. Mapping" },
                  { id: "gemini_research", name: "3. Research" },
                  { id: "evidence_normalization", name: "4. Normalize" },
                  { id: "scoring", name: "5. Scoring" },
                  { id: "gap_analysis", name: "6. Gaps" },
                  { id: "recommendation", name: "7. Action Plan" },
                ].map((st) => {
                  const isActive = agentStep === st.id;
                  return (
                    <div
                      key={st.id}
                      className={`p-2 rounded-xl border-2 border-[#141A35] font-heading font-extrabold text-xs text-center transition-all ${
                        isActive
                          ? "bg-[#FFD329] text-[#141A35] shadow-[2px_2px_0_#141A35] animate-pulse"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      {st.name}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Report */}
        {report && (
          <div className="space-y-8">
            {/* Report Header & Verdict */}
            <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-2 border-[#141A35]/15 pb-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading font-black text-xl text-[#141A35]">
                      {report.ventureProfile.startupName}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-[#141A35] bg-[#FFFBEF] font-bold text-[#141A35]">
                      {report.generatedAt}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-[#141A35] bg-[#FFD329] font-extrabold text-[#141A35]">
                      Model: {report.modelUsed}
                    </span>
                  </div>

                  <div className="bg-[#FFFBEF] border-2 border-[#141A35] rounded-2xl p-4 shadow-[2px_2px_0_#141A35]">
                    <div className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#2450EA] mb-1">
                      Value Proposition
                    </div>
                    <div className="font-heading font-bold text-base sm:text-lg text-[#141A35]">
                      &ldquo;{report.valueProposition}&rdquo;
                    </div>
                  </div>
                </div>

                {/* Score Hero */}
                <div className="p-4 rounded-2xl bg-[#FFFBEF] border-2 border-[#141A35] shadow-[4px_4px_0_#141A35] shrink-0 text-center lg:text-right min-w-[240px]">
                  <div className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]/70">
                    Overall Readiness Score
                  </div>
                  <div className="font-heading font-black text-4xl sm:text-5xl text-[#141A35] leading-none my-1">
                    {report.overallScore}
                    <span className="text-xl font-bold text-[#141A35]/60"> / 5.0</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`px-3 py-1 rounded-full border border-[#141A35] font-heading font-black text-xs uppercase tracking-wider ${
                        report.readinessCategory === "strong"
                          ? "bg-[#2450EA] text-white"
                          : report.readinessCategory === "promising"
                          ? "bg-[#FFD329] text-[#141A35]"
                          : report.readinessCategory === "under_validated"
                          ? "bg-[#F4779B] text-[#141A35]"
                          : "bg-gray-300 text-[#141A35]"
                      }`}
                    >
                      {report.readinessCategoryLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verdict Text & Actions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-xs uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#141A35] text-white">
                    VERDICT: {report.recommendation.proceedPivotOrPause.toUpperCase()}
                  </span>
                </div>
                <p className="font-body text-base text-[#141A35]/90 leading-relaxed font-semibold">
                  {report.finalVerdict}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-[#141A35] font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35] hover:bg-[#FFD329] transition-colors shadow-[2px_2px_0_#141A35] cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "REPORT COPIED!" : "COPY MARKDOWN REPORT"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-[#141A35] font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35] hover:bg-[#FFD329] transition-colors shadow-[2px_2px_0_#141A35] cursor-pointer"
                >
                  PRINT / EXPORT REPORT
                </button>
              </div>
            </div>

            {/* 3+1 Why Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#2450EA]" />
                <h3 className="font-heading font-black text-xl text-[#141A35] uppercase tracking-tight">
                  3+1 Why Analysis
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#FFFDF5] border-[2.5px] border-[#141A35] rounded-2xl p-5 shadow-[4px_4px_0_#141A35] space-y-2">
                  <div className="font-heading font-black text-xs uppercase tracking-wider text-[#2450EA]">
                    1. Why This?
                  </div>
                  <p className="font-body text-xs text-[#141A35]/85 leading-relaxed font-medium">
                    {report.threePlusOneWhy.whyThis}
                  </p>
                </div>

                <div className="bg-[#FFFDF5] border-[2.5px] border-[#141A35] rounded-2xl p-5 shadow-[4px_4px_0_#141A35] space-y-2">
                  <div className="font-heading font-black text-xs uppercase tracking-wider text-[#2450EA]">
                    2. Why Now?
                  </div>
                  <p className="font-body text-xs text-[#141A35]/85 leading-relaxed font-medium">
                    {report.threePlusOneWhy.whyNow}
                  </p>
                </div>

                <div className="bg-[#FFFDF5] border-[2.5px] border-[#141A35] rounded-2xl p-5 shadow-[4px_4px_0_#141A35] space-y-2">
                  <div className="font-heading font-black text-xs uppercase tracking-wider text-[#2450EA]">
                    3. Why This Team?
                  </div>
                  <p className="font-body text-xs text-[#141A35]/85 leading-relaxed font-medium">
                    {report.threePlusOneWhy.whyThisTeam}
                  </p>
                </div>

                <div className="bg-[#F4779B] border-[2.5px] border-[#141A35] rounded-2xl p-5 shadow-[4px_4px_0_#141A35] space-y-2">
                  <div className="font-heading font-black text-xs uppercase tracking-wider text-[#141A35]">
                    ⚠️ 4th Why: Why Won&apos;t This Work?
                  </div>
                  <p className="font-body text-xs text-[#141A35] leading-relaxed font-bold">
                    {report.threePlusOneWhy.whyWontThisWork}
                  </p>
                </div>
              </div>
            </div>

            {/* Scorecard Table */}
            <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#141A35]/15 pb-4">
                <div>
                  <h3 className="font-heading font-black text-2xl text-[#141A35] tracking-tight">
                    12-Dimension Scorecard
                  </h3>
                  <p className="font-body text-xs text-[#141A35]/75">
                    Calculated by our deterministic scoring engine using framework weights.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-xs uppercase text-[#141A35]/70 mr-1">
                    Filter:
                  </span>
                  <button
                    type="button"
                    onClick={() => setFilterScorecard("all")}
                    className={`px-3 py-1 rounded-lg border border-[#141A35] font-heading font-extrabold text-xs transition-colors cursor-pointer ${
                      filterScorecard === "all" ? "bg-[#FFD329]" : "bg-white hover:bg-[#FFFBEF]"
                    }`}
                  >
                    All (12)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterScorecard("weak")}
                    className={`px-3 py-1 rounded-lg border border-[#141A35] font-heading font-extrabold text-xs transition-colors cursor-pointer ${
                      filterScorecard === "weak" ? "bg-[#F4779B]" : "bg-white hover:bg-[#FFFBEF]"
                    }`}
                  >
                    Weak / Gaps (&le;3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterScorecard("strong")}
                    className={`px-3 py-1 rounded-lg border border-[#141A35] font-heading font-extrabold text-xs transition-colors cursor-pointer ${
                      filterScorecard === "strong" ? "bg-[#2450EA] text-white" : "bg-white hover:bg-[#FFFBEF]"
                    }`}
                  >
                    Strengths (&ge;4)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredScorecard?.map((item) => {
                  const isExpanded = expandedDimension === item.dimension;
                  return (
                    <div
                      key={item.dimension}
                      className="bg-[#FFFBEF] border-2 border-[#141A35] rounded-2xl p-4 shadow-[3px_3px_0_#141A35] flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-heading font-black text-sm text-[#141A35]">
                            {item.dimension}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-[#141A35]/30">
                              {item.weight}x
                            </span>
                            <span
                              className={`w-7 h-7 rounded-full border-2 border-[#141A35] font-heading font-black text-xs flex items-center justify-center shadow-[1px_1px_0_#141A35] ${
                                item.score >= 4
                                  ? "bg-[#2450EA] text-white"
                                  : item.score === 3
                                  ? "bg-[#FFD329] text-[#141A35]"
                                  : "bg-[#F4779B] text-[#141A35]"
                              }`}
                            >
                              {item.score}
                            </span>
                          </div>
                        </div>

                        <p className="font-body text-xs text-[#141A35]/85 leading-relaxed font-medium">
                          {item.justification}
                        </p>
                      </div>

                      {isExpanded && (
                        <div className="pt-2 border-t border-[#141A35]/15 space-y-2 text-[11px] font-body">
                          {item.penaltiesApplied.length > 0 && (
                            <div className="text-red-700 font-bold">
                              Penalty: {item.penaltiesApplied.join(", ")}
                            </div>
                          )}
                          <div>
                            <strong className="text-[#2450EA]">Evidence Found:</strong>{" "}
                            <span className="text-[#141A35]/80">{item.evidence.join("; ")}</span>
                          </div>
                          <div>
                            <strong className="text-[#F4779B]">Missing Evidence:</strong>{" "}
                            <span className="text-[#141A35]/80">{item.missingEvidence.join("; ")}</span>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDimension(isExpanded ? null : item.dimension)
                        }
                        className="inline-flex items-center gap-1 font-heading font-bold text-[11px] uppercase tracking-wider text-[#141A35] hover:text-[#2450EA] cursor-pointer pt-1"
                      >
                        <span>{isExpanded ? "Hide Details" : "Inspect Evidence & Justification"}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What This Startup Lacks */}
            <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] space-y-5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-[#F4779B]" />
                <h3 className="font-heading font-black text-2xl text-[#141A35] tracking-tight">
                  What This Startup Lacks
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.whatItLacks.map((gap, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FFFBEF] border-2 border-[#141A35] rounded-2xl p-5 shadow-[4px_4px_0_#141A35] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-extrabold text-[10px] uppercase px-2 py-0.5 rounded bg-[#F4779B] border border-[#141A35] text-[#141A35]">
                        {gap.frameworkDimension}
                      </span>
                      <span className="font-heading font-black text-xs text-[#141A35]/40">
                        GAP #{idx + 1}
                      </span>
                    </div>

                    <h4 className="font-heading font-extrabold text-base text-[#141A35]">
                      {gap.gap}
                    </h4>

                    <div className="space-y-1.5 text-xs font-body">
                      <div>
                        <strong>Why It Matters:</strong>{" "}
                        <span className="text-[#141A35]/80">{gap.whyItMatters}</span>
                      </div>
                      <div className="pt-1 border-t border-[#141A35]/10">
                        <strong className="text-[#2450EA]">Next Test:</strong>{" "}
                        <span className="text-[#141A35]/85 font-medium">{gap.nextValidationTest}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Found vs Evidence Missing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evidence Found */}
              <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 shadow-[6px_6px_0_#141A35] space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2450EA]" />
                  <h3 className="font-heading font-black text-xl text-[#141A35] uppercase tracking-tight">
                    Evidence Found
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {report.evidenceFound.length > 0 ? (
                    report.evidenceFound.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#FFFBEF] border-2 border-[#141A35] space-y-1 shadow-[2px_2px_0_#141A35]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded bg-[#FFD329] border border-[#141A35]">
                            {item.frameworkDimension}
                          </span>
                          <span className="text-[10px] font-mono uppercase text-[#141A35]/60">
                            Confidence: {item.confidence}
                          </span>
                        </div>
                        <p className="font-body text-xs font-semibold text-[#141A35]">
                          {item.claim}
                        </p>
                        {item.sourceUrl && (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#2450EA] font-bold hover:underline"
                          >
                            <span>Source Citation</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-[#FFFBEF] border border-[#141A35] text-xs text-[#141A35]/70">
                      No direct empirical evidence found yet. All claims require customer validation.
                    </div>
                  )}
                </div>
              </div>

              {/* Evidence Missing */}
              <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 shadow-[6px_6px_0_#141A35] space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#F4779B]" />
                  <h3 className="font-heading font-black text-xl text-[#141A35] uppercase tracking-tight">
                    Evidence Missing (Requires Validation)
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {report.evidenceMissing.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#FFFBEF] border-2 border-[#141A35] flex items-start gap-2.5 shadow-[2px_2px_0_#141A35]"
                    >
                      <span className="font-heading font-black text-xs text-[#F4779B] mt-0.5 shrink-0">
                        #{idx + 1}
                      </span>
                      <p className="font-body text-xs font-semibold text-[#141A35] leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Validation Experiments */}
            <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#2450EA]" />
                <h3 className="font-heading font-black text-xl text-[#141A35] uppercase tracking-tight">
                  Recommended Validation Experiments
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.recommendedValidationExperiments.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFFBEF] border-2 border-[#141A35] space-y-2 shadow-[3px_3px_0_#141A35]"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-heading font-black px-2 py-0.5 rounded border border-[#141A35] ${
                          exp.timeline === "7-day"
                            ? "bg-[#FFD329] text-[#141A35]"
                            : "bg-[#2450EA] text-white"
                        }`}
                      >
                        {exp.timeline.toUpperCase()} SPRINT
                      </span>
                      <span className="text-xs font-bold text-[#141A35]/50">
                        EXP 0{idx + 1}
                      </span>
                    </div>

                    <p className="font-heading font-extrabold text-xs sm:text-sm text-[#141A35]">
                      {exp.experiment}
                    </p>

                    <div className="text-[11px] font-body text-[#141A35]/85">
                      <strong>Success Metric:</strong> {exp.successMetric}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141A35]/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-[#FFFDF5] border-[3.5px] border-[#141A35] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[8px_8px_0_#141A35] space-y-5"
            >
              <div className="flex items-center justify-between border-b-2 border-[#141A35]/15 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#2450EA]" />
                  <h3 className="font-heading font-black text-lg text-[#141A35] uppercase">
                    Gemini Research Settings
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="font-heading font-bold text-sm text-[#141A35]/60 hover:text-[#141A35]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                    GEMINI_API_KEY
                  </label>
                  <input
                    type="password"
                    value={userApiKey}
                    onChange={(e) => setUserApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key..."
                    className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-mono text-xs text-[#141A35] shadow-[2px_2px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                  />
                  <p className="text-[11px] font-body text-[#141A35]/70">
                    Stored locally in your browser. Can also be set as an environment variable (<code>GEMINI_API_KEY</code> or <code>VITE_GEMINI_API_KEY</code>).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                    GEMINI_MODEL
                  </label>
                  <select
                    value={userModel}
                    onChange={(e) => setUserModel(e.target.value)}
                    className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-bold text-xs text-[#141A35] shadow-[2px_2px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                  >
                    <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Recommended)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Flash-Lite)</option>
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Frontier)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl bg-white border-2 border-[#141A35] font-heading font-bold text-xs uppercase text-[#141A35] hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2 rounded-xl bg-[#FFD329] border-2 border-[#141A35] font-heading font-black text-xs uppercase text-[#141A35] shadow-[3px_3px_0_#141A35] hover:shadow-[4px_4px_0_#141A35] cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
