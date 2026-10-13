import { SCORING_WEIGHTS } from "./scoringWeights";
import type { VentureProfile, FrameworkDimension } from "../types/startupEvaluation";

export const FRAMEWORK_NAME = "10 Percent Startup Readiness Framework";

export const FRAMEWORK_DIMENSIONS: FrameworkDimension[] = SCORING_WEIGHTS.map((item) => ({
  name: item.name,
  question: item.coreQuestion,
  weight: item.weight,
}));

export const FRAMEWORK_QUESTION_MAP: Record<string, string[]> = {
  "Problem Pain": [
    "Is this problem urgent, expensive, frequent, or emotionally painful?",
    "How much money or time does this friction cost the customer annually?",
    "What makeshift workarounds or competitor tools do they currently pay for?",
  ],
  "Customer Clarity": [
    "Who is the daily user?",
    "Who owns the budget (economic buyer)?",
    "Who makes the decision?",
    "Who can block adoption?",
    "What alternative is used today?",
  ],
  "Value Creation": [
    "Does the solution create measurable, quantified value or time saved?",
    "Is the outcome 10x better or 50% cheaper than the incumbent alternative?",
    "How does the customer verify that value was delivered?",
  ],
  "Value Capture": [
    "Can the startup capture enough value to survive and achieve positive unit economics?",
    "What is the proposed business model (SaaS, marketplace, transactional)?",
    "Is there evidence of customer willingness to pay the proposed price point?",
  ],
  "Why This": [
    "Is the addressable market large enough to sustain an independent venture?",
    "Is this an essential priority or a nice-to-have vitamin?",
    "Why is this specific problem worth a founder spending 5–10 years on?",
  ],
  "Why Now": [
    "What technological, regulatory, or macroeconomic shift happened in the last 12–24 months?",
    "Why was this venture impossible or unviable 3 years ago?",
    "Is the adoption window open right now?",
  ],
  "Why This Team": [
    "Does the founding team possess proprietary domain insight or rare technical capability?",
    "Do they have unfair distribution access or industry credibility?",
    "Can they out-learn and out-execute well-funded competitors?",
  ],
  "Execution Readiness": [
    "Can the team build, test, and ship the core MVP rapidly?",
    "What technical, operational, or partner integration blockers exist?",
    "How fast can they iterate based on weekly user feedback?",
  ],
  "Timing": [
    "Is the market culturally and technically ready, or is the startup too early?",
    "Are customer habits already moving in this direction?",
    "Does adoption require difficult behavioral change from conservative buyers?",
  ],
  "Defensibility": [
    "Is the solution hard to copy, clone, replace, or outspend?",
    "Does a data flywheel, high switching cost, or network effect develop over time?",
    "What stops an incumbent (or generalist AI) from offering this for free?",
  ],
  "Risk Awareness": [
    "Does the team understand what can kill the venture (pre-mortem kill-conditions)?",
    "What legal, liability, churn, or platform dependence risks exist?",
    "What is the single biggest failure mode in the first 18 months?",
  ],
  "Evidence Quality": [
    "Where does the startup sit on the Evidence Ladder (Level 0 to Level 5)?",
    "Are there customer interviews, active prototype usage, LOIs, or paid pilots?",
    "Is there objective behavioral proof instead of polite verbal encouragement?",
  ],
};

export interface BenchmarkExample {
  id: string;
  badge: string;
  title: string;
  profile: VentureProfile;
  expectedScoreRange: string;
  expectedVerdict: string;
  expectedLacks: string[];
  expectedNextTests: string[];
}

export const BENCHMARK_EXAMPLES: BenchmarkExample[] = [
  {
    id: "ai-tutor",
    badge: "🎓 EdTech / STEM",
    title: "AI Tutor for Engineering Students",
    profile: {
      startupName: "STEMTutor AI",
      oneLineIdea: "An AI tutor that helps engineering students prepare for exams through personalized problem-solving practice.",
      problem: "Engineering students fail calculus, physics, and circuit theory courses because human tutors cost $60/hr and generic chatbots hallucinate derivations.",
      solution: "Domain-specific AI tutor generating adaptive practice problems with verified step-by-step Socratic hints and exam study plans.",
      targetUser: "Undergraduate engineering students",
      targetBuyer: "Students (self-pay), parents, or university engineering departments",
      businessModel: "$19/month student subscription or $15k/year departmental lab license",
      industry: "Higher Education / EdTech",
      geography: "United States / Global",
      stage: "prototype",
      teamBackground: "2 MIT engineering graduates with ML research background and peer-tutoring experience",
      unknowns: [
        "Unproven student willingness to pay during non-exam periods",
        "Institutional procurement hurdles",
        "Defensibility against horizontal LLMs",
      ],
      evidenceLevel: 2,
    },
    expectedScoreRange: "3.5 to 3.8",
    expectedVerdict: "Promising but not yet a strong 10 percent candidate",
    expectedLacks: [
      "clear economic buyer",
      "proof of willingness to pay",
      "defensibility",
      "learning outcome evidence",
    ],
    expectedNextTests: [
      "interview 20 engineering students",
      "interview 5 professors or administrators",
      "run a paid landing page test",
      "run a 2-week pilot",
      "measure retention and grade improvement",
    ],
  },
  {
    id: "food-waste",
    badge: "🍽️ B2B SaaS / Hospitality",
    title: "Food Waste Prediction for Restaurants",
    profile: {
      startupName: "FreshForecast",
      oneLineIdea: "Software that helps independent restaurants reduce food waste by predicting daily demand.",
      problem: "Restaurants throw away 4–10% of purchased inventory due to inaccurate morning prep forecasting, destroying already thin 5–8% profit margins.",
      solution: "Predictive demand intelligence integrating POS sales history, reservations, local events, and weather into daily kitchen prep sheets.",
      targetUser: "Executive chefs and kitchen managers",
      targetBuyer: "Independent restaurant owners and operations directors",
      businessModel: "$149/month SaaS subscription or 20% share of verified food savings",
      industry: "Hospitality / FoodTech",
      geography: "North America",
      stage: "prototype",
      teamBackground: "Former restaurant GM + Data scientist with time-series forecasting experience",
      unknowns: [
        "Kitchen staff behavioral compliance during peak rush",
        "Legacy POS integration delays",
      ],
      evidenceLevel: 2,
    },
    expectedScoreRange: "3.8 to 4.1",
    expectedVerdict: "Strong candidate if live kitchen pilots prove measurable food cost reduction and kitchen compliance",
    expectedLacks: [
      "audited food waste weigh-in data",
      "turnkey POS integration",
      "proof of kitchen staff behavioral change",
    ],
    expectedNextTests: [
      "shadow 5 morning kitchen prep shifts",
      "run a 30-day live pilot in 5 restaurants",
      "test $99/mo vs $199/mo pricing elasticity",
    ],
  },
  {
    id: "ai-legal",
    badge: "⚖️ LegalTech / SMB",
    title: "AI Legal Assistant for Small Businesses",
    profile: {
      startupName: "JurisCheck",
      oneLineIdea: "An AI assistant that helps small businesses review contracts and identify legal risks.",
      problem: "Small business owners sign ambiguous vendor, client, and lease agreements without attorney review because legal fees ($400/hr) are unaffordable.",
      solution: "AI document analysis that flags high-risk clauses, produces plain-language summaries, and outputs attorney-ready review notes.",
      targetUser: "Small business owners and freelance agency founders",
      targetBuyer: "Small business owners",
      businessModel: "$49/contract pay-per-review or $129/month unlimited contract review subscription",
      industry: "LegalTech / Small Business",
      geography: "United States",
      stage: "idea",
      teamBackground: "Commercial contract paralegal + full-stack engineer",
      unknowns: [
        "Unauthorized practice of law (UPL) liability",
        "Hallucinated legal interpretations in high-stakes contracts",
      ],
      evidenceLevel: 1,
    },
    expectedScoreRange: "3.2 to 3.5",
    expectedVerdict: "Promising market opportunity with clear customer frustration, but legally high-risk",
    expectedLacks: [
      "regulatory & UPL compliance strategy",
      "accuracy benchmark against licensed attorneys",
      "human-in-the-loop attorney review option",
    ],
    expectedNextTests: [
      "interview 15 small business owners on past contract disputes",
      "run an accuracy evaluation on 25 real contracts scored by lawyers",
      "consult state legal ethics counsel on disclaimer positioning",
    ],
  },
];
