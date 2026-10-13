import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  Key,
  ShieldAlert,
  Flame,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type {
  VentureProfile,
  FrameworkReport,
  AgentStep,
  VentureStage,
} from "../types/framework";
import {
  PRESET_VENTURES,
  EVIDENCE_LEVELS,
} from "../data/frameworkPresets";
import {
  runFrameworkAnalysis,
  getActiveGeminiKey,
  setActiveGeminiKey,
  resetActiveGeminiKey,
} from "../services/geminiFrameworkService";

interface ResearchAgentWorkspaceProps {
  onBackToMap?: () => void;
}

export function ResearchAgentWorkspace({ onBackToMap }: ResearchAgentWorkspaceProps) {
  // Active form profile
  const [profile, setProfile] = useState<VentureProfile>(PRESET_VENTURES[0].profile);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("ai-tutor");

  // Execution state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<AgentStep>("idle");
  const [stepMessage, setStepMessage] = useState<string>("");
  const [report, setReport] = useState<FrameworkReport | null>(PRESET_VENTURES[0].cachedReport || null);

  // UI state
  const [filterScorecard, setFilterScorecard] = useState<"all" | "high" | "low">("all");
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>(getActiveGeminiKey());

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === "custom") {
      setProfile({
        name: "",
        oneLinePitch: "",
        targetUser: "",
        targetBuyer: "",
        problem: "",
        solution: "",
        businessModel: "",
        stage: "idea",
        teamBackground: "",
        evidenceLevel: 0,
      });
      setReport(null);
    } else {
      const found = PRESET_VENTURES.find((p) => p.id === presetId);
      if (found) {
        setProfile(found.profile);
        setReport(found.cachedReport || null);
      }
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setCurrentStep("intake");
    setStepMessage("Initializing MIT Startup Research Agent pipeline...");

    try {
      const generated = await runFrameworkAnalysis(profile, (step, msg) => {
        setCurrentStep(step);
        setStepMessage(msg);
      });
      setReport(generated);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      alert("Analysis failed to complete. Please check your network or API key.");
    } finally {
      setIsAnalyzing(false);
      setCurrentStep("idle");
    }
  };

  const handleSaveApiKey = () => {
    setActiveGeminiKey(apiKeyInput);
    setShowKeyModal(false);
  };

  const handleResetApiKey = () => {
    resetActiveGeminiKey();
    setApiKeyInput(getActiveGeminiKey());
    setShowKeyModal(false);
  };

  const handleCopyMarkdown = () => {
    if (!report) return;

    const md = `
# 10% Startup Readiness Framework Report
**Venture:** ${report.ventureName}
**Score:** ${report.overallScore} / 5.0 (${report.readinessLevel.toUpperCase()})
**Generated:** ${report.generatedAt} (Model: ${report.modelUsed})

## Value Proposition
${report.valueProposition}

## Executive Summary
${report.ventureSummary}

## 3+1 Why Test
- **Why This:** ${report.threePlusOneWhy.whyThis}
- **Why Now:** ${report.threePlusOneWhy.whyNow}
- **Why This Team:** ${report.threePlusOneWhy.whyThisTeam}
- **The 4th Why (Failure Anticipation):** ${report.threePlusOneWhy.whyWontThisWork}

## 12-Dimension Scorecard
${report.scorecard
  .map(
    (s) =>
      `- **${s.dimension}** [${s.score}/5, weight ${s.weight}x]: ${s.justification}\n  - *Evidence:* ${s.evidence}\n  - *Missing Evidence:* ${s.missingEvidence}\n  - *Action:* ${s.howToImprove}`
  )
  .join("\n\n")}

## What It Lacks (Critical Gaps)
${report.whatItLacks
  .map(
    (g, i) =>
      `${i + 1}. **${g.gap}** (${g.frameworkDimension})\n   - *Why It Matters:* ${g.whyItMatters}\n   - *Validation Test:* ${g.validationTest}`
  )
  .join("\n\n")}

## Recommended Validation Experiments
${report.recommendedExperiments
  .map(
    (e, i) =>
      `${i + 1}. [${e.timeline}] ${e.experiment}\n   - *Success Metric:* ${e.successMetric}`
  )
  .join("\n")}

## Must-Ask Customer Discovery Questions
${report.customerDiscoveryQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

## Final Verdict & Direction
**Action:** ${report.actionRecommendation.toUpperCase()}
${report.finalVerdict}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const filteredScorecard = report?.scorecard.filter((dim) => {
    if (filterScorecard === "high") return dim.score >= 4;
    if (filterScorecard === "low") return dim.score <= 3;
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner / Hero */}
      <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD329] border-2 border-[#141A35] font-heading font-extrabold text-xs tracking-wider uppercase text-[#141A35] shadow-[2px_2px_0_#141A35]">
                <Sparkles className="w-3.5 h-3.5" />
                MIT-STYLE RESEARCH AGENT
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2450EA] border-2 border-[#141A35] font-heading font-extrabold text-xs tracking-wider uppercase text-white shadow-[2px_2px_0_#141A35]">
                <Cpu className="w-3.5 h-3.5" />
                GEMINI 3.5 FLASH
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4779B] border-2 border-[#141A35] font-heading font-extrabold text-xs tracking-wider uppercase text-[#141A35] shadow-[2px_2px_0_#141A35]">
                10% READINESS SCORECARD
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#141A35] leading-[1.1]">
              Does your startup have what it takes to be in the top 10%?
            </h1>

            <p className="font-body text-base sm:text-lg text-[#141A35]/85 leading-relaxed max-w-2xl">
              The agent never simply says <em>&quot;This is a good idea.&quot;</em> It separates assumptions from proof, calculates a weighted 12-dimension score, pinpoints kill-conditions, and gives you a 7-day validation sprint.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
            {onBackToMap && (
              <button
                type="button"
                onClick={onBackToMap}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-[#141A35] font-heading font-bold text-xs uppercase tracking-wider text-[#141A35] hover:bg-[#FFD329] transition-colors shadow-[2px_2px_0_#141A35] cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                VIEW 9-STEP JOURNEY MAP
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFBEF] border-2 border-[#141A35] font-heading font-bold text-xs text-[#141A35] hover:bg-[#FFD329] transition-colors shadow-[2px_2px_0_#141A35] cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              API Key Configured
            </button>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-[#FFD329] border-[3px] border-[#141A35] pointer-events-none -z-0 opacity-40" />
      </div>

      {/* Preset Selector Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#141A35]">
            1. Select a Scenario or Enter Your Own Idea:
          </span>
          <span className="text-xs font-bold text-[#141A35]/60 hidden sm:inline">
            Directly from the MIT Framework Specification
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_VENTURES.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`text-left p-4 rounded-2xl border-[2.5px] border-[#141A35] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FFD329] shadow-[5px_5px_0_#141A35] -translate-y-1 font-bold"
                    : "bg-[#FFFDF5] shadow-[3px_3px_0_#141A35] hover:bg-white hover:-translate-y-0.5"
                }`}
              >
                <div className="font-heading font-extrabold text-xs text-[#141A35]/70 mb-1">
                  {preset.badge}
                </div>
                <div className="font-heading font-black text-base text-[#141A35] line-clamp-1">
                  {preset.profile.name}
                </div>
                <div className="font-body text-xs text-[#141A35]/80 line-clamp-2 mt-1">
                  {preset.profile.oneLinePitch}
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => handleSelectPreset("custom")}
            className={`text-left p-4 rounded-2xl border-[2.5px] border-[#141A35] transition-all cursor-pointer ${
              selectedPresetId === "custom"
                ? "bg-[#2450EA] text-white shadow-[5px_5px_0_#141A35] -translate-y-1 font-bold"
                : "bg-[#FFFDF5] shadow-[3px_3px_0_#141A35] hover:bg-white hover:-translate-y-0.5"
            }`}
          >
            <div className={`font-heading font-extrabold text-xs mb-1 ${selectedPresetId === "custom" ? "text-white/80" : "text-[#141A35]/70"}`}>
              ✨ Blank Canvas
            </div>
            <div className="font-heading font-black text-base line-clamp-1">
              Custom Founder Idea
            </div>
            <div className={`font-body text-xs line-clamp-2 mt-1 ${selectedPresetId === "custom" ? "text-white/90" : "text-[#141A35]/80"}`}>
              Input your raw concept and run live Gemini agent analysis.
            </div>
          </button>
        </div>
      </div>

      {/* Intake Form (Venture Profile) */}
      <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#141A35]/15 pb-4">
          <div>
            <h2 className="font-heading font-black text-2xl text-[#141A35] tracking-tight">
              2. Venture Intake Profile
            </h2>
            <p className="font-body text-sm text-[#141A35]/75">
              Converted by Intake Agent into structured venture parameters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
              Current Stage:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(["idea", "prototype", "pilot", "revenue", "scaling"] as VentureStage[]).map((stg) => (
                <button
                  key={stg}
                  type="button"
                  onClick={() => setProfile((p) => ({ ...p, stage: stg }))}
                  className={`px-2.5 py-1 rounded-lg border-2 border-[#141A35] font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    profile.stage === stg
                      ? "bg-[#2450EA] text-white shadow-[2px_2px_0_#141A35]"
                      : "bg-[#FFFBEF] text-[#141A35] hover:bg-[#FFD329]"
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
              Venture Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. TutorMesh"
              className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-sm text-[#141A35] shadow-[3px_3px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
              One-Line Pitch
            </label>
            <input
              type="text"
              value={profile.oneLinePitch}
              onChange={(e) => setProfile((p) => ({ ...p, oneLinePitch: e.target.value }))}
              placeholder="e.g. AI food waste prediction software for independent restaurants"
              className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-sm text-[#141A35] shadow-[3px_3px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
              Target User (Daily Operator)
            </label>
            <input
              type="text"
              value={profile.targetUser}
              onChange={(e) => setProfile((p) => ({ ...p, targetUser: e.target.value }))}
              placeholder="e.g. Executive chefs & prep managers"
              className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-sm text-[#141A35] shadow-[3px_3px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
              Target Buyer (Budget Holder)
            </label>
            <input
              type="text"
              value={profile.targetBuyer}
              onChange={(e) => setProfile((p) => ({ ...p, targetBuyer: e.target.value }))}
              placeholder="e.g. Restaurant owner or managing partner"
              className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-sm text-[#141A35] shadow-[3px_3px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
              The Problem (Why it Sucks)
            </label>
            <textarea
              rows={3}
              value={profile.problem}
              onChange={(e) => setProfile((p) => ({ ...p, problem: e.target.value }))}
              placeholder="What urgent, frequent, or expensive friction exists?"
              className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-sm text-[#141A35] shadow-[3px_3px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
              Proposed Solution
            </label>
            <textarea
              rows={3}
              value={profile.solution}
              onChange={(e) => setProfile((p) => ({ ...p, solution: e.target.value }))}
              placeholder="How does your solution eliminate the problem with measurable ROI?"
              className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-sm text-[#141A35] shadow-[3px_3px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
              Business Model & Pricing
            </label>
            <input
              type="text"
              value={profile.businessModel}
              onChange={(e) => setProfile((p) => ({ ...p, businessModel: e.target.value }))}
              placeholder="e.g. $149/mo subscription or 20% savings share"
              className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-sm text-[#141A35] shadow-[3px_3px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
              Team Background & Unfair Advantage
            </label>
            <input
              type="text"
              value={profile.teamBackground}
              onChange={(e) => setProfile((p) => ({ ...p, teamBackground: e.target.value }))}
              placeholder="e.g. Ex-GM restaurant operations + Senior ML Engineer"
              className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-body font-semibold text-sm text-[#141A35] shadow-[3px_3px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
            />
          </div>
        </div>

        {/* Evidence Ladder Selector */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <label className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
              Self-Reported Evidence Ladder Position:
            </label>
            <span className="font-heading font-bold text-xs text-[#2450EA]">
              Weight: 1.4x (Highest in Scorecard)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {EVIDENCE_LEVELS.map((ev) => {
              const isCurrent = profile.evidenceLevel === ev.level;
              return (
                <button
                  key={ev.level}
                  type="button"
                  onClick={() => setProfile((p) => ({ ...p, evidenceLevel: ev.level }))}
                  className={`p-2.5 text-left rounded-xl border-2 border-[#141A35] transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-[#F4779B] text-[#141A35] shadow-[3px_3px_0_#141A35] font-bold"
                      : "bg-[#FFFBEF] text-[#141A35]/80 hover:bg-white"
                  }`}
                >
                  <div className="font-heading font-black text-xs">
                    L{ev.level}
                  </div>
                  <div className="font-heading font-bold text-[11px] leading-tight line-clamp-1 mt-0.5">
                    {ev.label.split(":")[1]?.trim() || ev.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Run Action */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-[#141A35]/15">
          <div className="text-xs font-body text-[#141A35]/70 text-center sm:text-left">
            ⚡ Runs live multi-agent analysis: Intake &rarr; Framework Mapping &rarr; Gemini Research &rarr; 12-Dimension Scoring.
          </div>

          <motion.button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            whileHover={{ scale: 1.02, x: -2, y: -2 }}
            whileTap={{ scale: 0.98, x: 2, y: 2 }}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FFD329] border-[3px] border-[#141A35] font-heading font-black text-base uppercase tracking-wider text-[#141A35] shadow-[6px_6px_0_#141A35] hover:shadow-[8px_8px_0_#141A35] transition-shadow inline-flex items-center justify-center gap-3 cursor-pointer ${
              isAnalyzing ? "opacity-75 cursor-wait" : ""
            }`}
          >
            {isAnalyzing ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>EVALUATING VENTURE...</span>
              </>
            ) : (
              <>
                <span>RUN 10% FRAMEWORK RESEARCH</span>
                <ArrowRight className="w-5 h-5" strokeWidth={3} />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Live Pipeline Visualizer */}
      <AnimatePresence>
        {isAnalyzing && (
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
                  Agent Pipeline Active
                </span>
              </div>
              <span className="font-heading font-extrabold text-xs uppercase px-3 py-1 bg-[#141A35] text-white rounded-full border border-white/20">
                Stage: {currentStep}
              </span>
            </div>

            <p className="font-body text-sm font-semibold text-white/90">
              {stepMessage}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
              {[
                { id: "intake", name: "1. Intake" },
                { id: "framework_mapping", name: "2. Mapping" },
                { id: "gemini_research", name: "3. Gemini AI" },
                { id: "scoring", name: "4. Scoring" },
                { id: "gap_analysis", name: "5. Gap Analysis" },
                { id: "recommendation", name: "6. Action Plan" },
              ].map((st) => {
                const isActive = currentStep === st.id;
                return (
                  <div
                    key={st.id}
                    className={`p-2.5 rounded-xl border-2 border-[#141A35] font-heading font-extrabold text-xs text-center ${
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

      {/* Generated Report Section */}
      {report && (
        <div className="space-y-8">
          {/* Executive Verdict Hero */}
          <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] relative overflow-hidden space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-2 border-[#141A35]/15 pb-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]/60">
                    REPORT FOR:
                  </span>
                  <span className="font-heading font-black text-xl text-[#141A35]">
                    {report.ventureName}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full border border-[#141A35] bg-[#FFFBEF] font-bold text-[#141A35]">
                    {report.generatedAt}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full border border-[#141A35] bg-[#FFD329] font-extrabold text-[#141A35]">
                    Model: {report.modelUsed}
                  </span>
                </div>

                <div className="bg-[#FFFBEF] border-2 border-[#141A35] rounded-2xl p-4 shadow-[3px_3px_0_#141A35]">
                  <div className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#2450EA] mb-1">
                    Value Proposition Formulation
                  </div>
                  <div className="font-heading font-bold text-base sm:text-lg text-[#141A35]">
                    &ldquo;{report.valueProposition}&rdquo;
                  </div>
                </div>
              </div>

              {/* Big Score Block */}
              <div className="flex sm:flex-col items-center lg:items-end justify-between sm:justify-center p-4 rounded-2xl bg-[#FFFBEF] border-2 border-[#141A35] shadow-[4px_4px_0_#141A35] shrink-0 min-w-[220px]">
                <div className="text-left lg:text-right">
                  <div className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]/70">
                    10% Readiness Score
                  </div>
                  <div className="font-heading font-black text-4xl sm:text-5xl text-[#141A35] leading-none my-1">
                    {report.overallScore}
                    <span className="text-xl font-bold text-[#141A35]/60"> / 5.0</span>
                  </div>
                </div>

                <div className="mt-1">
                  {report.readinessLevel === "strong" && (
                    <span className="px-3 py-1 rounded-full bg-[#2450EA] text-white border border-[#141A35] font-heading font-extrabold text-xs uppercase tracking-wider">
                      🟢 Strong 10% Candidate
                    </span>
                  )}
                  {report.readinessLevel === "promising" && (
                    <span className="px-3 py-1 rounded-full bg-[#FFD329] text-[#141A35] border border-[#141A35] font-heading font-extrabold text-xs uppercase tracking-wider">
                      🟡 Promising (Validate Gaps)
                    </span>
                  )}
                  {report.readinessLevel === "high_risk" && (
                    <span className="px-3 py-1 rounded-full bg-[#F4779B] text-[#141A35] border border-[#141A35] font-heading font-extrabold text-xs uppercase tracking-wider">
                      🟠 High-Risk & Under-Validated
                    </span>
                  )}
                  {report.readinessLevel === "weak" && (
                    <span className="px-3 py-1 rounded-full bg-red-400 text-[#141A35] border border-[#141A35] font-heading font-extrabold text-xs uppercase tracking-wider">
                      🔴 Weak Readiness (Needs Discovery)
                    </span>
                  )}
                  {report.readinessLevel === "not_ready" && (
                    <span className="px-3 py-1 rounded-full bg-gray-300 text-[#141A35] border border-[#141A35] font-heading font-extrabold text-xs uppercase tracking-wider">
                      ⛔ Not Ready As Venture
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Verdict text */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xs uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#141A35] text-white">
                  ACTION VERDICT: {report.actionRecommendation.toUpperCase()}
                </span>
              </div>
              <p className="font-body text-base text-[#141A35]/90 leading-relaxed font-semibold">
                {report.finalVerdict}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-[#141A35] font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35] hover:bg-[#FFD329] transition-colors shadow-[2px_2px_0_#141A35] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "REPORT COPIED!" : "COPY MARKDOWN REPORT"}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-[#141A35] font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35] hover:bg-[#FFD329] transition-colors shadow-[2px_2px_0_#141A35] cursor-pointer"
              >
                PRINT / SAVE PDF
              </button>
            </div>
          </div>

          {/* 3+1 Why Test Cards */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#2450EA]" />
              <h3 className="font-heading font-black text-xl text-[#141A35] uppercase tracking-tight">
                The 3+1 Why Test
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FFFDF5] border-[2.5px] border-[#141A35] rounded-2xl p-5 shadow-[4px_4px_0_#141A35] space-y-2">
                <div className="font-heading font-black text-xs uppercase tracking-wider text-[#2450EA]">
                  1. Why This?
                </div>
                <div className="font-heading font-extrabold text-sm text-[#141A35]">
                  Is this problem urgent & worth solving?
                </div>
                <p className="font-body text-xs text-[#141A35]/80 leading-relaxed">
                  {report.threePlusOneWhy.whyThis}
                </p>
              </div>

              <div className="bg-[#FFFDF5] border-[2.5px] border-[#141A35] rounded-2xl p-5 shadow-[4px_4px_0_#141A35] space-y-2">
                <div className="font-heading font-black text-xs uppercase tracking-wider text-[#2450EA]">
                  2. Why Now?
                </div>
                <div className="font-heading font-extrabold text-sm text-[#141A35]">
                  What market or tech inflection point exists?
                </div>
                <p className="font-body text-xs text-[#141A35]/80 leading-relaxed">
                  {report.threePlusOneWhy.whyNow}
                </p>
              </div>

              <div className="bg-[#FFFDF5] border-[2.5px] border-[#141A35] rounded-2xl p-5 shadow-[4px_4px_0_#141A35] space-y-2">
                <div className="font-heading font-black text-xs uppercase tracking-wider text-[#2450EA]">
                  3. Why This Team?
                </div>
                <div className="font-heading font-extrabold text-sm text-[#141A35]">
                  What unfair insight or advantage is present?
                </div>
                <p className="font-body text-xs text-[#141A35]/80 leading-relaxed">
                  {report.threePlusOneWhy.whyThisTeam}
                </p>
              </div>

              <div className="bg-[#F4779B] border-[2.5px] border-[#141A35] rounded-2xl p-5 shadow-[4px_4px_0_#141A35] space-y-2">
                <div className="font-heading font-black text-xs uppercase tracking-wider text-[#141A35]">
                  ⚠️ 4th Why: Why Won&apos;t This Work?
                </div>
                <div className="font-heading font-extrabold text-sm text-[#141A35]">
                  Failure Anticipation & Kill-Condition
                </div>
                <p className="font-body text-xs text-[#141A35] font-semibold leading-relaxed">
                  {report.threePlusOneWhy.whyWontThisWork}
                </p>
              </div>
            </div>
          </div>

          {/* 12-Dimension Scorecard */}
          <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#141A35]/15 pb-4">
              <div>
                <h3 className="font-heading font-black text-2xl text-[#141A35] tracking-tight">
                  12-Dimension Startup Scorecard
                </h3>
                <p className="font-body text-xs text-[#141A35]/75">
                  Deterministic weighted calculation based on the MIT 10% Framework mechanics.
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
                  onClick={() => setFilterScorecard("high")}
                  className={`px-3 py-1 rounded-lg border border-[#141A35] font-heading font-extrabold text-xs transition-colors cursor-pointer ${
                    filterScorecard === "high" ? "bg-[#2450EA] text-white" : "bg-white hover:bg-[#FFFBEF]"
                  }`}
                >
                  Strengths (&ge;4)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterScorecard("low")}
                  className={`px-3 py-1 rounded-lg border border-[#141A35] font-heading font-extrabold text-xs transition-colors cursor-pointer ${
                    filterScorecard === "low" ? "bg-[#F4779B]" : "bg-white hover:bg-[#FFFBEF]"
                  }`}
                >
                  Gaps (&le;3)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScorecard?.map((dim) => {
                const isExpanded = expandedDimension === dim.dimension;
                return (
                  <div
                    key={dim.dimension}
                    className="bg-[#FFFBEF] border-2 border-[#141A35] rounded-2xl p-4 shadow-[3px_3px_0_#141A35] flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-heading font-black text-sm text-[#141A35]">
                          {dim.dimension}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-[#141A35]/30">
                            {dim.weight}x
                          </span>
                          <span
                            className={`w-7 h-7 rounded-full border-2 border-[#141A35] font-heading font-black text-xs flex items-center justify-center shadow-[1px_1px_0_#141A35] ${
                              dim.score >= 4
                                ? "bg-[#2450EA] text-white"
                                : dim.score === 3
                                ? "bg-[#FFD329] text-[#141A35]"
                                : "bg-[#F4779B] text-[#141A35]"
                            }`}
                          >
                            {dim.score}
                          </span>
                        </div>
                      </div>

                      <p className="font-body text-xs text-[#141A35]/85 font-medium leading-relaxed">
                        {dim.justification}
                      </p>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-[#141A35]/15 space-y-2 text-[11px] font-body">
                        <div>
                          <strong className="text-[#2450EA]">Evidence Found:</strong>{" "}
                          <span className="text-[#141A35]/80">{dim.evidence}</span>
                        </div>
                        <div>
                          <strong className="text-[#F4779B]">Missing Proof:</strong>{" "}
                          <span className="text-[#141A35]/80">{dim.missingEvidence}</span>
                        </div>
                        <div>
                          <strong className="text-[#141A35]">Action to Raise Score:</strong>{" "}
                          <span className="text-[#141A35]/80">{dim.howToImprove}</span>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedDimension(isExpanded ? null : dim.dimension)
                      }
                      className="inline-flex items-center gap-1 font-heading font-bold text-[11px] uppercase tracking-wider text-[#141A35] hover:text-[#2450EA] cursor-pointer pt-1"
                    >
                      <span>{isExpanded ? "Hide Details" : "Inspect Evidence & Gaps"}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What It Lacks (Critical Gaps) */}
          <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] space-y-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#F4779B]" />
              <div>
                <h3 className="font-heading font-black text-2xl text-[#141A35] tracking-tight">
                  What The Startup Lacks (Critical Gaps)
                </h3>
                <p className="font-body text-xs text-[#141A35]/75">
                  The primary reasons ventures fail to qualify for the top 10%.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.whatItLacks.map((gap, i) => (
                <div
                  key={i}
                  className="bg-[#FFFBEF] border-2 border-[#141A35] rounded-2xl p-5 shadow-[4px_4px_0_#141A35] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-extrabold text-xs uppercase px-2.5 py-0.5 rounded bg-[#F4779B] border border-[#141A35] text-[#141A35]">
                      {gap.frameworkDimension}
                    </span>
                    <span className="font-heading font-black text-xs text-[#141A35]/50">
                      GAP 0{i + 1}
                    </span>
                  </div>

                  <h4 className="font-heading font-extrabold text-base text-[#141A35]">
                    {gap.gap}
                  </h4>

                  <div className="space-y-1.5 text-xs font-body">
                    <div>
                      <strong className="text-[#141A35]">Why It Matters:</strong>{" "}
                      <span className="text-[#141A35]/80">{gap.whyItMatters}</span>
                    </div>
                    <div className="pt-1 border-t border-[#141A35]/10">
                      <strong className="text-[#2450EA]">Validation Test:</strong>{" "}
                      <span className="text-[#141A35]/80 font-medium">{gap.validationTest}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Ladder Position */}
          <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#141A35] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#2450EA]" />
                <h3 className="font-heading font-black text-xl text-[#141A35] uppercase tracking-tight">
                  MIT Evidence Ladder Position
                </h3>
              </div>
              <span className="font-heading font-bold text-xs uppercase px-3 py-1 rounded-full bg-[#FFD329] border border-[#141A35]">
                {report.evidenceLadder.currentLevelName}
              </span>
            </div>

            <p className="font-body text-xs text-[#141A35]/80 max-w-2xl">
              <strong>How to Ascend:</strong> {report.evidenceLadder.howToAscend}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
              {EVIDENCE_LEVELS.map((lvl) => {
                const isPassed = lvl.level <= report.evidenceLadder.currentLevel;
                const isCurrent = lvl.level === report.evidenceLadder.currentLevel;
                return (
                  <div
                    key={lvl.level}
                    className={`p-3 rounded-xl border-2 border-[#141A35] text-center ${
                      isCurrent
                        ? "bg-[#2450EA] text-white shadow-[3px_3px_0_#141A35] font-bold"
                        : isPassed
                        ? "bg-[#FFD329] text-[#141A35]"
                        : "bg-[#FFFBEF] text-[#141A35]/50"
                    }`}
                  >
                    <div className="font-heading font-black text-xs">Level {lvl.level}</div>
                    <div className="font-body text-[10px] line-clamp-1 mt-0.5">
                      {lvl.label.split(":")[1]?.trim()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Validation Experiments & Discovery Questions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experiments */}
            <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 shadow-[6px_6px_0_#141A35] space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2450EA]" />
                <h3 className="font-heading font-black text-xl text-[#141A35] uppercase tracking-tight">
                  Actionable Validation Sprint
                </h3>
              </div>

              <div className="space-y-3">
                {report.recommendedExperiments.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#FFFBEF] border-2 border-[#141A35] space-y-1.5 shadow-[2px_2px_0_#141A35]"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-heading font-black px-2 py-0.5 rounded border border-[#141A35] ${
                          exp.timeline === "7-day"
                            ? "bg-[#FFD329] text-[#141A35]"
                            : "bg-[#2450EA] text-white"
                        }`}
                      >
                        {exp.timeline.toUpperCase()} EXPERIMENT
                      </span>
                      <span className="text-xs font-bold text-[#141A35]/50">
                        #{idx + 1}
                      </span>
                    </div>

                    <p className="font-heading font-bold text-xs text-[#141A35]">
                      {exp.experiment}
                    </p>

                    <div className="text-[11px] font-body text-[#141A35]/80">
                      <strong>Target Metric:</strong> {exp.successMetric}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions to Ask */}
            <div className="bg-[#FFFDF5] border-[3px] border-[#141A35] rounded-3xl p-6 shadow-[6px_6px_0_#141A35] space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#F4779B]" />
                <h3 className="font-heading font-black text-xl text-[#141A35] uppercase tracking-tight">
                  Must-Ask Discovery Questions
                </h3>
              </div>

              <div className="space-y-2.5">
                {report.customerDiscoveryQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FFFBEF] border-2 border-[#141A35] flex items-start gap-2.5 shadow-[2px_2px_0_#141A35]"
                  >
                    <span className="font-heading font-black text-xs text-[#2450EA] mt-0.5 shrink-0">
                      Q{idx + 1}.
                    </span>
                    <p className="font-body text-xs font-semibold text-[#141A35] leading-relaxed">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
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
                    Gemini API Key Configuration
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

              <div className="space-y-2">
                <label className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]">
                  Active Google Gemini API Key:
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AQ.Ab8RN..."
                  className="w-full bg-[#FFFBEF] border-2 border-[#141A35] rounded-xl px-4 py-2.5 font-mono text-xs text-[#141A35] shadow-[3px_3px_0_#141A35] focus:outline-none focus:ring-2 focus:ring-[#2450EA]"
                />
                <p className="text-[11px] font-body text-[#141A35]/70">
                  Pre-configured with your supplied project key. Runs on Gemini 3.5 Flash with fallback to Gemini 3.8 Flash.
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetApiKey}
                  className="px-4 py-2 rounded-xl bg-white border-2 border-[#141A35] font-heading font-bold text-xs uppercase text-[#141A35] hover:bg-gray-100 cursor-pointer shadow-[2px_2px_0_#141A35]"
                >
                  Reset Default
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-4 py-2 rounded-xl bg-white border-2 border-[#141A35] font-heading font-bold text-xs uppercase text-[#141A35] hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    className="px-5 py-2 rounded-xl bg-[#FFD329] border-2 border-[#141A35] font-heading font-black text-xs uppercase text-[#141A35] shadow-[3px_3px_0_#141A35] hover:shadow-[4px_4px_0_#141A35] cursor-pointer"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
