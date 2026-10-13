export interface EvidenceLevelConfig {
  level: number;
  name: string;
  description: string;
  scoreCap: number; // Maximum overall score allowed for this evidence rung
  requiredProof: string;
}

export const EVIDENCE_LADDER: EvidenceLevelConfig[] = [
  {
    level: 0,
    name: "Level 0: Founder Opinion",
    description: "Personal beliefs, intuitive hunches, unsubstantiated assumptions.",
    scoreCap: 2.2,
    requiredProof: "Founder's own vision or personal frustration.",
  },
  {
    level: 1,
    name: "Level 1: Secondary Research",
    description: "Industry reports, competitor pricing models, market sizing charts.",
    scoreCap: 2.9,
    requiredProof: "Third-party publications, public database queries, macroeconomic trends.",
  },
  {
    level: 2,
    name: "Level 2: Customer Interviews",
    description: "At least 15 structured discovery interviews with active target users and buyers.",
    scoreCap: 3.6,
    requiredProof: "Documented interview notes, past spending data, verified workarounds.",
  },
  {
    level: 3,
    name: "Level 3: Prototype Usage",
    description: "Interactive MVP deployed in real daily workflows with active engagement.",
    scoreCap: 4.1,
    requiredProof: "Session retention, task completion rates, organic recurring usage.",
  },
  {
    level: 4,
    name: "Level 4: Paid Pilot",
    description: "Committed capital: signed pre-orders, paid pilots, or commercial LOIs.",
    scoreCap: 4.6,
    requiredProof: "Banked revenue, executed contracts, milestone pricing agreements.",
  },
  {
    level: 5,
    name: "Level 5: Repeatable Revenue",
    description: "Customer renewals, net dollar retention, and predictable sales payback.",
    scoreCap: 5.0,
    requiredProof: "Audited financial receipts, low logo churn, scalable acquisition channel.",
  },
];

export function getEvidenceLevelConfig(level: number): EvidenceLevelConfig {
  const normalized = Math.min(Math.max(Math.round(level), 0), 5);
  return EVIDENCE_LADDER[normalized] || EVIDENCE_LADDER[0];
}

export function enforceEvidenceCeiling(rawScore: number, evidenceLevel: number): {
  cappedScore: number;
  wasCapped: boolean;
  capReason?: string;
} {
  const config = getEvidenceLevelConfig(evidenceLevel);
  if (rawScore > config.scoreCap) {
    return {
      cappedScore: Number(config.scoreCap.toFixed(1)),
      wasCapped: true,
      capReason: `Score capped at ${config.scoreCap} because venture is at ${config.name}. Higher score requires climbing to Level ${config.level + 1}.`,
    };
  }
  return {
    cappedScore: Number(rawScore.toFixed(1)),
    wasCapped: false,
  };
}
