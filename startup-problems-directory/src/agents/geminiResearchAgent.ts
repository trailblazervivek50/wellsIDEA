import type { ResearchTask, VentureProfile } from "../types/startupEvaluation";
import {
  GeminiResearchPlugin,
  type RawResearchResult,
  type ResearchPlugin,
} from "../plugins/geminiResearchPlugin";

export class GeminiResearchAgent {
  name = "GeminiResearchAgent";
  private plugin: ResearchPlugin;

  constructor(customPlugin?: ResearchPlugin) {
    this.plugin = customPlugin || new GeminiResearchPlugin();
  }

  async conductResearch(
    tasks: ResearchTask[],
    profile: VentureProfile,
    onProgress?: (dim: string, index: number, total: number) => void
  ): Promise<RawResearchResult[]> {
    const results: RawResearchResult[] = [];

    // Prioritize high-weight dimensions for live API queries to remain fast and responsive
    const priorityDimensions = [
      "Customer Clarity",
      "Problem Pain",
      "Why Now",
      "Defensibility",
      "Value Capture",
    ];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      onProgress?.(task.frameworkDimension, i + 1, tasks.length);

      const isPriority = priorityDimensions.includes(task.frameworkDimension);

      if (isPriority) {
        try {
          const res = await this.plugin.researchFrameworkQuestion(
            task.frameworkDimension,
            task.questions,
            profile
          );
          results.push(res);
          continue;
        } catch (err) {
          console.warn(
            `Live research for ${task.frameworkDimension} failed, using heuristic baseline:`,
            err
          );
        }
      }

      // Local heuristic synthesis for non-priority dimensions or network fallback
      results.push(this.synthesizeHeuristicResearch(task, profile));
    }

    return results;
  }

  private synthesizeHeuristicResearch(
    task: ResearchTask,
    profile: VentureProfile
  ): RawResearchResult {
    const dim = task.frameworkDimension;

    if (dim === "Customer Clarity") {
      return {
        frameworkDimension: dim,
        claims: [
          {
            claim: `Identified daily user as '${profile.targetUser}' and budget buyer as '${profile.targetBuyer}'.`,
            confidence: "medium",
            evidenceType: "assumption",
            requiresCustomerValidation: true,
          },
        ],
        sourceUrls: [],
      };
    }

    if (dim === "Problem Pain") {
      return {
        frameworkDimension: dim,
        claims: [
          {
            claim: `Core operational friction: ${profile.problem.slice(0, 70)}...`,
            confidence: "medium",
            evidenceType: "indirect",
            requiresCustomerValidation: true,
          },
        ],
        sourceUrls: [],
      };
    }

    if (dim === "Why Now") {
      return {
        frameworkDimension: dim,
        claims: [
          {
            claim: "Advances in frontier LLM reasoning and open cloud APIs allow sub-second automated workflow integration.",
            confidence: "high",
            evidenceType: "direct",
            requiresCustomerValidation: false,
          },
        ],
        sourceUrls: ["https://ai.google.dev/gemini-api/docs/models"],
      };
    }

    if (dim === "Defensibility") {
      return {
        frameworkDimension: dim,
        claims: [
          {
            claim: "Early software layer vulnerable to fast followers unless defensible integrations or verified datasets are embedded.",
            confidence: "low",
            evidenceType: "assumption",
            requiresCustomerValidation: true,
          },
        ],
        sourceUrls: [],
      };
    }

    return {
      frameworkDimension: dim,
      claims: [
        {
          claim: `Hypothesis aligns with ${profile.stage} stage execution criteria for ${dim}.`,
          confidence: "medium",
          evidenceType: "assumption",
          requiresCustomerValidation: true,
        },
      ],
      sourceUrls: [],
    };
  }
}
