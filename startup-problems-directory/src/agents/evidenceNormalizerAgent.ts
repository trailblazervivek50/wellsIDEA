import type { EvidenceItem } from "../types/startupEvaluation";
import type { RawResearchResult } from "../plugins/geminiResearchPlugin";

export class EvidenceNormalizerAgent {
  name = "EvidenceNormalizerAgent";

  normalize(rawResults: RawResearchResult[]): EvidenceItem[] {
    const items: EvidenceItem[] = [];

    for (const result of rawResults) {
      for (const claim of result.claims) {
        // Enforce strict rules: willingness to pay and buying behavior must require customer validation unless direct verified proof exists
        const claimLower = claim.claim.toLowerCase();
        const isBuyingBehavior =
          claimLower.includes("willingness to pay") ||
          claimLower.includes("buy") ||
          claimLower.includes("pricing") ||
          claimLower.includes("customer pain");

        const requiresValidation =
          claim.requiresCustomerValidation ||
          (isBuyingBehavior && claim.evidenceType !== "direct");

        const normalizedType =
          requiresValidation && claim.evidenceType === "direct"
            ? "indirect"
            : claim.evidenceType;

        items.push({
          claim: claim.claim.trim(),
          sourceUrl: claim.sourceUrl,
          confidence: claim.confidence,
          frameworkDimension: result.frameworkDimension,
          evidenceType: normalizedType,
          requiresCustomerValidation: requiresValidation,
        });
      }
    }

    return items;
  }
}
