import type {
  EvaluationAgentStep,
  StartupEvaluationReport,
} from "../types/startupEvaluation";
import type { IntakeRawInput } from "../agents/intakeAgent";
import { orchestrateStartupEvaluation } from "../agents/evaluationOrchestrator";

export interface EvaluationApiOptions {
  onStepProgress?: (step: EvaluationAgentStep, message: string) => void;
}

export async function submitStartupEvaluation(
  input: IntakeRawInput,
  options?: EvaluationApiOptions
): Promise<StartupEvaluationReport> {
  const { onStepProgress } = options || {};

  try {
    // Attempt to invoke POST /api/startup-evaluation
    onStepProgress?.("intake", "Contacting evaluation service...");
    const res = await fetch("/api/startup-evaluation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.scorecard && typeof data.overallScore === "number") {
        onStepProgress?.("done", "Received evaluation report from server.");
        return data as StartupEvaluationReport;
      }
    }
  } catch (err) {
    console.info(
      "Backend endpoint unavailable or static environment detected. Running full agent orchestration in-process:",
      err
    );
  }

  // Graceful in-process orchestration (runs the exact same 7 agents)
  return await orchestrateStartupEvaluation(input, { onStepProgress });
}
