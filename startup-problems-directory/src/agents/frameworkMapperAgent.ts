import type { ResearchTask, VentureProfile } from "../types/startupEvaluation";
import { FRAMEWORK_DIMENSIONS, FRAMEWORK_QUESTION_MAP } from "../framework/startupFramework";

export class FrameworkMapperAgent {
  name = "FrameworkMapperAgent";

  mapQuestions(profile: VentureProfile): ResearchTask[] {
    return FRAMEWORK_DIMENSIONS.map((dim) => {
      const baseQuestions = FRAMEWORK_QUESTION_MAP[dim.name] || [dim.question];

      // Contextualize questions with venture profile details
      const contextualized = baseQuestions.map((q) => {
        return q
          .replace("this problem", `'${profile.problem.slice(0, 50)}...'`)
          .replace("the customer", profile.targetUser || "the user")
          .replace("the economic buyer", profile.targetBuyer || "the buyer");
      });

      return {
        frameworkDimension: dim.name,
        questions: contextualized,
      };
    });
  }
}
