# MIT-Style Startup Research Agent Framework

## Goal

Build an agent system that helps entrepreneurs understand whether their startup has the traits of the roughly 10 percent of ventures that survive and scale.

The system uses Gemini in the background for research, but the research is not open-ended. Every search, question, score, and recommendation must map back to the startup framework:

- Value Loop
- 3+1 Why Test
- Four-Factor Success Fit
- Customer Truth
- Value Proposition
- Evidence Ladder
- Failure Anticipation
- 10 Percent Startup Scorecard

## Core Principle

The agent should never simply say, "This is a good idea."

It should say:

- What evidence supports the idea
- What evidence is missing
- What the framework score is
- Why each score was given
- What the startup lacks
- What the founder should validate next

## Recommended Gemini Setup

As of October 14, 2026, Google lists Gemini 3 models such as `gemini-3.8-flash`, `gemini-3.5-flash-lite`, and `gemini-3.1-flash-lite` in the Gemini API model list. Google also notes that 2.5 models are being limited for new projects and recommends newer models for new applications.

Recommended default:

```txt
Primary research model: gemini-3.5-flash-lite
Fallback model: gemini-3.8-flash
Legacy fallback if already available: gemini-2.5-flash-lite
```

Use structured JSON output so the backend receives predictable scores, evidence, citations, risks, and recommendations.

Use search grounding only where needed:

- Market size
- Competitors
- Pricing benchmarks
- Regulation
- Adoption trends
- Recent industry shifts

Do not use Gemini search for things the founder must validate directly, such as willingness to pay or actual customer pain. The agent should mark those as "requires customer validation."

## Agent Architecture

### 1. Intake Agent

Purpose: convert the founder's raw idea into a clean venture profile.

Inputs:

- Startup idea
- Target user
- Target buyer
- Problem
- Proposed solution
- Business model
- Team background
- Market/geography
- Stage: idea, prototype, pilot, revenue, scaling

Output:

```json
{
  "venture_name": "string",
  "one_line_pitch": "string",
  "target_user": "string",
  "target_buyer": "string",
  "problem": "string",
  "solution": "string",
  "business_model": "string",
  "stage": "idea | prototype | pilot | revenue | scaling",
  "unknowns": ["string"]
}
```

### 2. Framework Mapping Agent

Purpose: map the idea to the 10 Percent Startup Framework.

It creates research questions for each framework dimension.

Example:

```json
{
  "dimension": "Customer Truth",
  "research_questions": [
    "Who is the economic buyer?",
    "Who is the daily user?",
    "What alternative do they use today?",
    "What evidence exists that they will pay or switch?"
  ]
}
```

### 3. Research Agent

Purpose: use Gemini API to collect external evidence.

The Research Agent must only research questions produced by the Framework Mapping Agent.

Research categories:

- Market evidence
- Customer segment evidence
- Competitor evidence
- Pricing evidence
- Timing evidence
- Regulation and legal constraints
- Technical feasibility signals
- Funding and capital intensity signals

Research output:

```json
{
  "claim": "string",
  "evidence": "string",
  "source_url": "string",
  "confidence": "low | medium | high",
  "framework_dimension": "string",
  "notes": "string"
}
```

### 4. Scoring Agent

Purpose: score the startup using the framework.

Use a 1-5 scale.

Score meaning:

- 1 = weak or no evidence
- 2 = mostly assumptions
- 3 = plausible but not proven
- 4 = evidence-backed and promising
- 5 = strong evidence, clear advantage, low ambiguity

Scorecard:

| Dimension | Question | Weight |
|---|---|---:|
| Problem Pain | Is the problem urgent, expensive, frequent, or emotionally painful? | 1.2 |
| Customer Clarity | Do we know the user, buyer, decision-maker, and blocker? | 1.2 |
| Value Creation | Does the solution create measurable value? | 1.1 |
| Value Capture | Can the startup capture enough value to survive and grow? | 1.1 |
| Why This | Is the idea worth pursuing now? | 1.0 |
| Why Now | Is market timing favorable? | 1.0 |
| Why This Team | Does the team have unfair insight or ability? | 1.2 |
| Execution Readiness | Can the team build, sell, and iterate fast? | 1.1 |
| Timing | Is the market ready and not too early? | 1.0 |
| Defensibility | Is the startup hard to copy, replace, or outspend? | 0.9 |
| Risk Awareness | Does the team understand what can kill the venture? | 1.0 |
| Evidence Quality | Are there pilots, LOIs, revenue, retention, or direct customer proof? | 1.4 |

Final weighted score:

```txt
score = weighted_sum(dimension_score * weight) / sum(weights)
```

Interpretation:

- 4.2-5.0 = strong 10 percent candidate
- 3.5-4.1 = promising but must validate specific gaps
- 2.8-3.4 = interesting but high-risk and under-validated
- 2.0-2.7 = weak readiness; needs customer discovery
- 1.0-1.9 = not ready as a venture

### 5. Gap Analysis Agent

Purpose: explain what the startup lacks according to the framework.

For each low-scoring dimension, the agent must produce:

- The missing element
- Why it matters
- Evidence that caused the score
- What the founder should do next
- Validation experiment

Example output:

```json
{
  "dimension": "Customer Clarity",
  "score": 2,
  "what_it_lacks": "The idea names users but not the economic buyer.",
  "why_it_matters": "A startup can have enthusiastic users and still fail if no buyer owns the budget.",
  "justification": "The founder described students as users, but did not identify whether students, parents, universities, or employers pay.",
  "next_action": "Interview 15 potential buyers and ask who owns the budget for this problem.",
  "validation_test": "Run a paid pilot offer with two buyer types and compare conversion."
}
```

### 6. Recommendation Agent

Purpose: convert the score and gaps into an action plan.

Recommendation format:

- Keep going, pivot, pause, or research more
- Top 3 missing pieces
- 7-day validation plan
- 30-day validation plan
- Key questions to ask customers
- Metrics that would improve the score

## Backend Flow

```txt
Founder Input
  -> Intake Agent
  -> Framework Mapping Agent
  -> Research Agent using Gemini
  -> Evidence Normalizer
  -> Scoring Agent
  -> Gap Analysis Agent
  -> Recommendation Agent
  -> User Report
```

## Plugin/Skill System

### Skill: Market Research

Purpose: research market size, growth, trends, and adoption timing.

Maps to:

- Why This
- Why Now
- Timing
- Value Capture

### Skill: Competitor Research

Purpose: identify alternatives, direct competitors, indirect competitors, substitutes, and incumbent behavior.

Maps to:

- Defensibility
- Value Creation
- Customer Truth

### Skill: Customer Discovery

Purpose: generate customer interview scripts, buyer maps, and validation tests.

Maps to:

- Customer Clarity
- Problem Pain
- Evidence Quality

### Skill: Business Model Analysis

Purpose: evaluate pricing, revenue model, cost structure, margins, and repeatability.

Maps to:

- Value Capture
- Evidence Quality
- Execution Readiness

### Skill: Team Fit Analysis

Purpose: assess whether the team has domain expertise, technical ability, sales ability, network access, and learning speed.

Maps to:

- Why This Team
- People
- Execution Readiness

### Skill: Risk and Failure Analysis

Purpose: identify why the startup may fail.

Maps to:

- Fourth Why: Why Won't This Work?
- Risk Awareness
- Timing
- Defensibility

### Skill: Evidence Grading

Purpose: separate assumptions from proof.

Evidence levels:

- Level 0: founder belief
- Level 1: secondary research
- Level 2: customer interviews
- Level 3: prototype usage
- Level 4: paid pilot
- Level 5: repeatable revenue or retention

Maps to:

- Evidence Quality
- Execution Readiness
- Value Creation

## Required Report Format

Every final user report should contain:

1. One-line venture summary
2. Value proposition using "We help X do Y by doing Z"
3. 3+1 Why analysis
4. Scorecard table
5. Overall readiness score
6. What the venture lacks
7. Justifications for low scores
8. Evidence found
9. Evidence still missing
10. Recommended next experiments
11. Final verdict

## Example 1: AI Tutor for Engineering Students

### One-Line Venture

An AI tutor that helps engineering students prepare for exams through personalized problem-solving practice.

### Value Proposition

We help engineering students master difficult exam concepts by generating personalized practice problems, explanations, and study plans.

### Scorecard

| Dimension | Score | Justification |
|---|---:|---|
| Problem Pain | 4 | Exam pressure is frequent and painful. |
| Customer Clarity | 3 | Users are clear, but payer may be student, parent, or university. |
| Value Creation | 4 | Potential value is measurable through time saved and grade improvement. |
| Value Capture | 3 | Subscription is possible, but willingness to pay is unproven. |
| Why This | 4 | Education support is a large market. |
| Why Now | 5 | AI adoption and model capability make this timely. |
| Why This Team | 3 | Depends on whether the team has AI plus pedagogy expertise. |
| Execution Readiness | 4 | Prototype can be built quickly. |
| Timing | 5 | Market is ready, but policy uncertainty exists. |
| Defensibility | 2 | Many AI tutoring competitors exist. |
| Risk Awareness | 4 | Key risks are trust, accuracy, cheating, and retention. |
| Evidence Quality | 2 | Needs customer interviews, pilots, and paid usage. |

Overall score: 3.6 / 5

Verdict: promising but not yet a strong 10 percent candidate.

What it lacks:

- Clear buyer
- Defensibility
- Proof of willingness to pay
- Learning outcome evidence

Next experiments:

- Interview 20 engineering students.
- Run a 2-week exam-prep pilot.
- Test willingness to pay with a real checkout page.
- Compare student performance before and after using the tool.

## Example 2: Food Waste Prediction for Restaurants

### One-Line Venture

Software that helps independent restaurants reduce food waste by predicting daily demand.

### Value Proposition

We help independent restaurants reduce food waste and improve margins by forecasting demand using sales history, local events, weather, and inventory data.

### Scorecard

| Dimension | Score | Justification |
|---|---:|---|
| Problem Pain | 5 | Waste directly affects margins. |
| Customer Clarity | 4 | Restaurant owners or managers are likely buyers. |
| Value Creation | 5 | Value can be measured through reduced waste and higher gross margin. |
| Value Capture | 4 | SaaS pricing or savings-share model is possible. |
| Why This | 5 | Clear economic pain. |
| Why Now | 4 | Restaurants increasingly use POS and inventory tools. |
| Why This Team | 3 | Needs restaurant operations access and data science capability. |
| Execution Readiness | 3 | Integrations with POS systems may be hard. |
| Timing | 4 | Market is digitally ready but fragmented. |
| Defensibility | 3 | Defensibility improves with proprietary data and integrations. |
| Risk Awareness | 4 | Risks include data quality, integration friction, and restaurant churn. |
| Evidence Quality | 3 | Needs pilots showing measurable savings. |

Overall score: 4.0 / 5

Verdict: strong candidate if pilots prove ROI.

What it lacks:

- Pilot data from real restaurants
- Integration strategy
- Proof that restaurants will change purchasing behavior

Next experiments:

- Run pilots with 5 restaurants.
- Measure food waste before and after.
- Test $99/month, $199/month, and savings-share pricing.
- Build one POS integration before expanding.

## Example 3: AI Legal Assistant for Small Businesses

### One-Line Venture

An AI assistant that helps small businesses review contracts and identify legal risks.

### Value Proposition

We help small business owners understand contract risk by providing plain-language summaries, red flags, and attorney-ready review notes.

### Scorecard

| Dimension | Score | Justification |
|---|---:|---|
| Problem Pain | 4 | Legal help is expensive and confusing. |
| Customer Clarity | 4 | Small business owners are clear users and buyers. |
| Value Creation | 4 | Can save time and reduce risk. |
| Value Capture | 4 | Subscription or per-document pricing is possible. |
| Why This | 4 | Large unmet need in affordable legal support. |
| Why Now | 5 | AI document analysis capability is strong. |
| Why This Team | 3 | Needs legal expertise and AI safety expertise. |
| Execution Readiness | 3 | Product can be built, but accuracy and liability are hard. |
| Timing | 4 | Market is ready but cautious. |
| Defensibility | 3 | Hard to defend without workflow, trust, or legal network. |
| Risk Awareness | 2 | Legal liability and unauthorized practice of law risk may be underestimated. |
| Evidence Quality | 2 | Needs paying pilots and attorney review validation. |

Overall score: 3.5 / 5

Verdict: promising but legally risky.

What it lacks:

- Regulatory clarity
- Accuracy benchmarks
- Attorney oversight model
- Trust strategy

Next experiments:

- Test with low-risk document categories first.
- Add attorney review option.
- Run accuracy evaluation against lawyer-labeled contracts.
- Validate whether customers pay for "review preparation" rather than legal advice.

## Gemini Prompt Template

Use this prompt for the Research Agent:

```txt
You are a startup research analyst. Research only the assigned framework dimension.

Startup:
{{venture_profile}}

Framework dimension:
{{dimension}}

Research questions:
{{research_questions}}

Rules:
- Do not give a general startup opinion.
- Return evidence only for this framework dimension.
- Separate facts from assumptions.
- Include source URLs when research uses external information.
- Mark founder-only validation questions as "requires customer validation."
- Output valid JSON matching the required schema.
```

## Scoring Prompt Template

```txt
You are scoring a startup using the 10 Percent Startup Readiness Framework.

Use only the venture profile and normalized evidence.

For every dimension:
- Give a score from 1 to 5.
- Give a short justification.
- Identify missing evidence.
- Explain what would raise the score.

Do not inflate scores because the idea sounds exciting.
Score based on evidence quality.
```

## Final Output Schema

```json
{
  "venture_summary": "string",
  "value_proposition": "string",
  "overall_score": 0,
  "readiness_level": "strong | promising | high_risk | weak | not_ready",
  "scorecard": [
    {
      "dimension": "string",
      "score": 0,
      "weight": 0,
      "justification": "string",
      "evidence": ["string"],
      "missing_evidence": ["string"],
      "how_to_improve": ["string"]
    }
  ],
  "what_it_lacks": [
    {
      "gap": "string",
      "framework_dimension": "string",
      "why_it_matters": "string",
      "next_test": "string"
    }
  ],
  "recommended_experiments": [
    {
      "experiment": "string",
      "duration": "string",
      "success_metric": "string"
    }
  ],
  "final_verdict": "string"
}
```

## Implementation Notes

- Keep Gemini behind an internal Research Agent, not directly exposed to users.
- Cache research by market, geography, and timestamp.
- Store citations with every research claim.
- Let the scoring engine be deterministic where possible.
- Use Gemini for evidence gathering and explanation, but keep scoring weights in your own backend.
- Require the agent to say "unknown" instead of inventing missing evidence.
- The highest-value output is not the score itself; it is the explanation of what the startup lacks and what to validate next.

