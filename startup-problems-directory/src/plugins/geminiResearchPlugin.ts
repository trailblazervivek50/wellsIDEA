import type {
  ConfidenceLevel,
  EvidenceType,
  VentureProfile,
} from "../types/startupEvaluation";

declare const process: any;

export interface RawResearchClaim {
  claim: string;
  sourceUrl?: string;
  confidence: ConfidenceLevel;
  evidenceType: EvidenceType;
  requiresCustomerValidation: boolean;
  notes?: string;
}

export interface RawResearchResult {
  frameworkDimension: string;
  claims: RawResearchClaim[];
  rawText?: string;
  sourceUrls: string[];
}

export interface ResearchPlugin {
  name: string;
  researchFrameworkQuestion(
    dimension: string,
    questions: string[],
    ventureProfile: VentureProfile
  ): Promise<RawResearchResult>;
  summarizeEvidence(results: RawResearchResult[]): Promise<string>;
  extractCitations(results: RawResearchResult[]): string[];
  classifyConfidence(claim: string, evidenceType: EvidenceType): ConfidenceLevel;
}

const DEFAULT_MODEL = "gemini-3.5-flash-lite";

export function getGeminiApiKey(): string {
  // 1. Process environment (server-side)
  if (typeof process !== "undefined" && process.env) {
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  }
  // 2. Vite environment (client-side)
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv?.VITE_GEMINI_API_KEY) return metaEnv.VITE_GEMINI_API_KEY.trim();
    if (metaEnv?.GEMINI_API_KEY) return metaEnv.GEMINI_API_KEY.trim();
  } catch {
    // ignore
  }
  // 3. LocalStorage override
  if (typeof window !== "undefined" && window.localStorage) {
    const stored = window.localStorage.getItem("GEMINI_API_KEY");
    if (stored && stored.trim().length > 0) return stored.trim();
  }
  return "";
}

export function getGeminiModel(): string {
  if (typeof process !== "undefined" && process.env?.GEMINI_MODEL) {
    return process.env.GEMINI_MODEL.trim();
  }
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv?.VITE_GEMINI_MODEL) return metaEnv.VITE_GEMINI_MODEL.trim();
    if (metaEnv?.GEMINI_MODEL) return metaEnv.GEMINI_MODEL.trim();
  } catch {
    // ignore
  }
  if (typeof window !== "undefined" && window.localStorage) {
    const stored = window.localStorage.getItem("GEMINI_MODEL");
    if (stored && stored.trim().length > 0) return stored.trim();
  }
  return DEFAULT_MODEL;
}

export class GeminiResearchPlugin implements ResearchPlugin {
  name = "GeminiResearchPlugin";

  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || getGeminiApiKey();
    this.model = model || getGeminiModel();
  }

  async researchFrameworkQuestion(
    dimension: string,
    questions: string[],
    ventureProfile: VentureProfile
  ): Promise<RawResearchResult> {
    const activeKey = this.apiKey || getGeminiApiKey();
    if (!activeKey) {
      throw new Error(
        "GEMINI_API_KEY is missing. Please configure GEMINI_API_KEY in your environment (.env) or via the Settings modal."
      );
    }

    const formattedProfile = JSON.stringify(
      {
        startupName: ventureProfile.startupName,
        oneLineIdea: ventureProfile.oneLineIdea,
        problem: ventureProfile.problem,
        solution: ventureProfile.solution,
        targetUser: ventureProfile.targetUser,
        targetBuyer: ventureProfile.targetBuyer,
        businessModel: ventureProfile.businessModel,
        industry: ventureProfile.industry,
        geography: ventureProfile.geography,
        stage: ventureProfile.stage,
        teamBackground: ventureProfile.teamBackground,
        selfReportedEvidenceLevel: ventureProfile.evidenceLevel,
      },
      null,
      2
    );

    const prompt = `You are a startup research analyst. Research only the assigned framework dimension.

Startup:
${formattedProfile}

Framework dimension:
${dimension}

Research questions:
${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Rules:
- Do not give a general startup opinion.
- Return evidence only for this framework dimension.
- Separate facts from assumptions.
- Include source URLs where available.
- Mark willingness to pay, customer pain, and buying behavior as requiring customer validation unless direct evidence exists.
- Output valid JSON only.

JSON schema:
{
  "claims": [
    {
      "claim": "Clear concise research finding or assumption",
      "sourceUrl": "https://... or empty string if internal/assumption",
      "confidence": "low" | "medium" | "high",
      "evidenceType": "direct" | "indirect" | "assumption",
      "requiresCustomerValidation": boolean,
      "notes": "Short justification or validation caveat"
    }
  ]
}`;

    const candidateModels = [
      this.model,
      "gemini-3.5-flash-lite",
      "gemini-3.8-flash",
      "gemini-3.1-flash-lite",
    ];

    let lastError: Error | null = null;

    for (const m of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${activeKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`Gemini model ${m} returned HTTP ${res.status}: ${errText}`);
          lastError = new Error(`HTTP ${res.status}: ${errText}`);
          continue;
        }

        const data = await res.json();
        const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!outputText) {
          throw new Error("Empty response body from Gemini model");
        }

        const parsed = JSON.parse(outputText);
        const claims: RawResearchClaim[] = Array.isArray(parsed.claims)
          ? parsed.claims.map((c: any) => ({
              claim: String(c.claim || "Unverified hypothesis"),
              sourceUrl: c.sourceUrl ? String(c.sourceUrl) : undefined,
              confidence: this.validateConfidence(c.confidence),
              evidenceType: this.validateEvidenceType(c.evidenceType),
              requiresCustomerValidation: Boolean(c.requiresCustomerValidation),
              notes: c.notes ? String(c.notes) : undefined,
            }))
          : [];

        const sourceUrls = claims
          .map((c) => c.sourceUrl)
          .filter((u): u is string => Boolean(u && u.startsWith("http")));

        return {
          frameworkDimension: dimension,
          claims,
          rawText: outputText,
          sourceUrls,
        };
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error(`Gemini research failed for dimension ${dimension}`);
  }

  async summarizeEvidence(results: RawResearchResult[]): Promise<string> {
    const totalClaims = results.reduce((sum, r) => sum + r.claims.length, 0);
    const validatedCount = results.reduce(
      (sum, r) => sum + r.claims.filter((c) => c.evidenceType === "direct").length,
      0
    );
    const assumptionCount = results.reduce(
      (sum, r) => sum + r.claims.filter((c) => c.evidenceType === "assumption").length,
      0
    );
    return `Evaluated ${totalClaims} research claims across ${results.length} framework dimensions (${validatedCount} direct evidence items, ${assumptionCount} critical assumptions requiring founder validation).`;
  }

  extractCitations(results: RawResearchResult[]): string[] {
    const set = new Set<string>();
    for (const r of results) {
      for (const u of r.sourceUrls) {
        if (u) set.add(u);
      }
    }
    return Array.from(set);
  }

  classifyConfidence(_claim: string, evidenceType: EvidenceType): ConfidenceLevel {
    if (evidenceType === "direct") return "high";
    if (evidenceType === "indirect") return "medium";
    return "low";
  }

  private validateConfidence(val: any): ConfidenceLevel {
    if (val === "high" || val === "medium" || val === "low") return val;
    return "medium";
  }

  private validateEvidenceType(val: any): EvidenceType {
    if (val === "direct" || val === "indirect" || val === "assumption") return val;
    return "assumption";
  }
}
