import { useState } from "react";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  X,
  Compass,
} from "lucide-react";
import { ResearchAgentWorkspace } from "./ResearchAgentWorkspace";

interface FrameworkPageProps {
  onBack: () => void;
}

type CardColor = "yellow" | "blue" | "pink" | "cream";

interface FrameworkCardData {
  id: string;
  heading: string;
  color: CardColor;
  rotation: number;
  desktopPos: string;
  mitConcept: string;
  mitInsight: string;
  suggestedTest: string;
}

const frameworkCards: FrameworkCardData[] = [
  {
    id: "01",
    heading: "You don't know anything about Entrepreneurship",
    color: "cream",
    rotation: -1.8,
    desktopPos: "left-[11%] top-[3.5%] w-[28%]",
    mitConcept: "The Value Loop & Discipline",
    mitInsight:
      "Entrepreneurship is not a lightning strike of genius; it is a systematic discipline of testing hypotheses against real market evidence.",
    suggestedTest: "Map your venture's Value Loop: Who receives value, who pays for it, and what keeps it repeating?",
  },
  {
    id: "02",
    heading: "You see something that “Sucks”",
    color: "pink",
    rotation: 1.5,
    desktopPos: "left-[4%] top-[30%] w-[27%]",
    mitConcept: "Problem Pain & Customer Truth",
    mitInsight:
      "Great startups don't invent problems—they eliminate acute, expensive, frequent, or emotionally exhausting friction that exists today.",
    suggestedTest: "Interview 15 target users. Quantify the hours wasted or dollars lost per month due to this friction.",
  },
  {
    id: "03",
    heading: "You have an Idea or Invention",
    color: "yellow",
    rotation: -0.8,
    desktopPos: "left-[36%] top-[3%] w-[28%]",
    mitConcept: "The 3+1 Why Test",
    mitInsight:
      "An invention is not a venture. You must prove Why This, Why Now, Why This Team, and anticipate Why Won't This Work.",
    suggestedTest: "Run a pre-mortem: If this venture goes bankrupt in 18 months, what was the most probable cause of death?",
  },
  {
    id: "04",
    heading: "Being an Entrepreneur is Glamorous",
    color: "blue",
    rotation: -2.2,
    desktopPos: "left-[5%] bottom-[28%] w-[27%]",
    mitConcept: "Failure Anticipation & Execution Truth",
    mitInsight:
      "Roughly 90% of ventures fail because founders build what nobody asked for. Ruthless pre-mortems prevent years of wasted effort.",
    suggestedTest: "Calculate your team's monthly runway and commit to kill criteria if customer willingness-to-pay is zero.",
  },
  {
    id: "05",
    heading: "How Do I Start? What Do I Do?",
    color: "yellow",
    rotation: 1.8,
    desktopPos: "left-[13%] bottom-[3.5%] w-[28%]",
    mitConcept: "The MIT Evidence Ladder",
    mitInsight:
      "Climb from Level 0 (founder belief) to Level 2 (discovery interviews) before writing a single line of production code.",
    suggestedTest: "Draft an interview script with 5 open-ended questions about past buying behavior—never pitch your solution.",
  },
  {
    id: "06",
    heading: "How will I make money so I can have a sustainable venture?",
    color: "pink",
    rotation: 2.1,
    desktopPos: "right-[11%] top-[3.5%] w-[28%]",
    mitConcept: "Value Capture & Unit Economics",
    mitInsight:
      "Sustainable ventures capture a predictable fraction of the measurable economic surplus they create for their economic buyers.",
    suggestedTest: "Test pricing elasticity: Compare a flat $149/mo SaaS model against a 15% savings-share model with 5 prospective buyers.",
  },
  {
    id: "07",
    heading: "How long will it take to bring my solution to market?",
    color: "cream",
    rotation: -1.6,
    desktopPos: "right-[4%] top-[30%] w-[27%]",
    mitConcept: "7-Day & 30-Day Validation Sprints",
    mitInsight:
      "Speed of customer feedback beats speed of software engineering. Validate willingness to pay using concierge tests in under 30 days.",
    suggestedTest: "Build a non-code clickable demo or paper prototype and run 5 guided customer walkthroughs within 7 days.",
  },
  {
    id: "08",
    heading: "Will I need to set up some sort of entity to do all this?",
    color: "cream",
    rotation: 1.2,
    desktopPos: "right-[5%] bottom-[28%] w-[27%]",
    mitConcept: "Legal Architecture Follows Traction",
    mitInsight:
      "Do not burn cash incorporating an expensive legal entity until customers have demonstrated willingness to sign or pay.",
    suggestedTest: "Collect 10 non-binding Letters of Intent (LOIs) or deposit commitments before hiring corporate counsel.",
  },
  {
    id: "09",
    heading: "How Do I Keep People from Stealing my Ideas?",
    color: "blue",
    rotation: -1.3,
    desktopPos: "right-[11%] bottom-[3.5%] w-[28%]",
    mitConcept: "Defensibility & Moat Construction",
    mitInsight:
      "Nobody steals raw ideas—they steal traction. Real defensibility comes from proprietary workflow integration, data network effects, and switching costs.",
    suggestedTest: "Identify the single workflow integration that makes your tool painful for a customer to abandon after 30 days.",
  },
];

interface ConnectorSpec {
  d: string;
  endX: number;
  endY: number;
  angleDeg: number;
}

function buildConnector(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
): ConnectorSpec {
  const angleDeg = (Math.atan2(y3 - y2, x3 - x2) * 180) / Math.PI;
  return {
    d: `M ${x0} ${y0} C ${x1} ${y1}, ${x2} ${y2}, ${x3} ${y3}`,
    endX: x3,
    endY: y3,
    angleDeg,
  };
}

const desktopConnectors: ConnectorSpec[] = [
  // 01 (top-left) -> curves down-right to upper-left of CTA
  buildConnector(385, 138, 455, 195, 512, 272, 562, 342),
  // 02 (upper-mid-left) -> curves right-down to left-top of CTA
  buildConnector(352, 302, 408, 312, 448, 342, 488, 374),
  // 03 (top-center) -> curves down to top-center of CTA
  buildConnector(696, 162, 692, 222, 704, 282, 700, 340),
  // 04 (lower-mid-left) -> curves right-up to left-bottom of CTA
  buildConnector(368, 508, 418, 492, 452, 458, 488, 422),
  // 05 (bottom-left) -> curves up-right to bottom-left of CTA
  buildConnector(495, 665, 540, 592, 580, 522, 618, 454),
  // 06 (top-right) -> curves down-left to upper-right of CTA
  buildConnector(1008, 142, 942, 200, 888, 274, 838, 342),
  // 07 (upper-mid-right) -> curves left-down to right-top of CTA
  buildConnector(1028, 302, 978, 314, 944, 344, 912, 374),
  // 08 (lower-mid-right) -> curves left-up to right-bottom of CTA
  buildConnector(1020, 508, 974, 492, 942, 458, 912, 422),
  // 09 (bottom-right) -> curves up-left to bottom-right of CTA
  buildConnector(895, 665, 852, 592, 816, 522, 782, 454),
];

function NavyDotGrid({
  rows = 5,
  cols = 6,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-2.5 pointer-events-none opacity-45 select-none ${className || ""}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 5px)`,
        gridTemplateRows: `repeat(${rows}, 5px)`,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#141A35]"
        />
      ))}
    </div>
  );
}

function CircularArrowButton({ isHovered }: { isHovered: boolean }) {
  return (
    <motion.div
      animate={{
        x: isHovered ? 2 : 0,
        y: isHovered ? -2 : 0,
        scale: isHovered ? 1.08 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#141A35] bg-white flex items-center justify-center shrink-0 shadow-[2px_2px_0_#141A35]"
      aria-hidden="true"
    >
      <ArrowUpRight
        className="w-4 h-4 text-[#141A35]"
        strokeWidth={2.75}
      />
    </motion.div>
  );
}

interface FrameworkCardProps {
  item: FrameworkCardData;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  useTilt?: boolean;
}

function FrameworkCard({
  item,
  index,
  isSelected,
  onSelect,
}: FrameworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colorStyles: Record<
    CardColor,
    { card: string; badge: string; text: string }
  > = {
    yellow: {
      card: "bg-[#FFD329] text-[#141A35]",
      badge: "bg-[#141A35] text-[#FFD329]",
      text: "text-[#141A35]",
    },
    blue: {
      card: "bg-[#2450EA] text-white",
      badge: "bg-[#FFD329] text-[#141A35]",
      text: "text-white",
    },
    pink: {
      card: "bg-[#F4779B] text-[#141A35]",
      badge: "bg-[#141A35] text-[#F4779B]",
      text: "text-[#141A35]",
    },
    cream: {
      card: "bg-[#FFFDF5] text-[#141A35]",
      badge: "bg-[#2450EA] text-white",
      text: "text-[#141A35]",
    },
  };

  const baseRotate = item.rotation;
  const hoverRotate = baseRotate * 0.4;

  return (
    <div
      className="w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        type="button"
        onClick={onSelect}
        initial={{
          opacity: 0,
          y: 22,
          scale: 0.96,
          rotate: baseRotate,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: isSelected ? 1.02 : 1,
          rotate: baseRotate,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 22,
          delay: index * 0.075,
        }}
        whileHover={{
          y: -4,
          rotate: hoverRotate,
          transition: { type: "spring", stiffness: 340, damping: 20 },
        }}
        whileTap={{
          x: 4,
          y: 4,
          scale: 0.99,
          transition: { duration: 0.1 },
        }}
        className={`framework-neo-card w-full text-left rounded-[22px] p-4 xl:p-5 cursor-pointer select-none ${
          colorStyles[item.color].card
        } ${isSelected ? "ring-3 ring-[#2450EA] ring-offset-2 ring-offset-[#FFFBEF]" : ""}`}
      >
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <span
            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border-2 border-[#141A35] font-heading font-extrabold text-xs tracking-wider shadow-[2px_2px_0_#141A35] ${
              colorStyles[item.color].badge
            }`}
          >
            {item.id}
          </span>

          <CircularArrowButton isHovered={isHovered} />
        </div>

        <h2 className="font-heading font-extrabold text-[clamp(15px,1.25vw,20px)] leading-[1.15] tracking-tight">
          {item.heading}
        </h2>
      </motion.button>
    </div>
  );
}

function CentralFrameworkCTA({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Explore the Framework"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.22,
      }}
      whileHover={{
        x: -2,
        y: -2,
        scale: 1.02,
        transition: { type: "spring", stiffness: 360, damping: 20 },
      }}
      whileTap={{
        x: 4,
        y: 4,
        scale: 0.99,
        transition: { duration: 0.1 },
      }}
      className={`group framework-neo-cta px-7 py-4 xl:px-9 xl:py-5 inline-flex items-center justify-center gap-3 font-heading font-extrabold text-[clamp(14px,1.2vw,18px)] uppercase tracking-wider cursor-pointer select-none whitespace-nowrap bg-[#FFD329] border-[3px] border-[#141A35] text-[#141A35] rounded-full shadow-[6px_6px_0_#141A35] hover:shadow-[8px_8px_0_#141A35] ${className}`}
    >
      <span>EXPLORE THE FRAMEWORK</span>
      <ArrowRight
        className="w-5 h-5 transition-transform duration-150 ease-out group-hover:translate-x-1"
        strokeWidth={3}
        aria-hidden="true"
      />
    </motion.button>
  );
}

function ConnectingArrowsSVG({
  selectedIndex,
}: {
  selectedIndex: number | null;
}) {
  return (
    <svg
      viewBox="0 0 1400 820"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    >
      {desktopConnectors.map((conn, idx) => {
        const pathDelay = 0.18 + idx * 0.065;
        const pathDuration = 0.6;
        const isActive = selectedIndex === idx;

        return (
          <g key={idx}>
            <motion.path
              d={conn.d}
              fill="none"
              stroke="#141A35"
              strokeWidth={isActive ? "3.2" : "2.4"}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: isActive ? 1 : 0.85,
              }}
              transition={{
                pathLength: {
                  duration: pathDuration,
                  delay: pathDelay,
                  ease: [0.22, 1, 0.36, 1],
                },
                opacity: {
                  duration: 0.18,
                  delay: pathDelay,
                },
              }}
            />
            <motion.g
              transform={`translate(${conn.endX}, ${conn.endY}) rotate(${conn.angleDeg})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0.9 }}
              transition={{
                duration: 0.2,
                delay: pathDelay + pathDuration - 0.1,
                ease: "easeOut",
              }}
            >
              <path
                d="M -10 -5 L 0 0 L -10 5"
                fill="none"
                stroke="#141A35"
                strokeWidth={isActive ? "3" : "2.4"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}

export function FrameworkPage({ onBack }: FrameworkPageProps) {
  const [viewMode, setViewMode] = useState<"map" | "agent">(() => {
    if (typeof window !== "undefined" && (window.location.hash === "#agent" || window.location.search.includes("agent"))) {
      return "agent";
    }
    return "map";
  });

  const [selectedCardModal, setSelectedCardModal] = useState<FrameworkCardData | null>(null);

  const handleCardClick = (card: FrameworkCardData) => {
    setSelectedCardModal(card);
  };

  const handleLaunchAgent = () => {
    setSelectedCardModal(null);
    setViewMode("agent");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MotionConfig reducedMotion="never">
      <div className="min-h-screen w-full bg-[#FFFBEF] text-[#141A35] font-body relative overflow-x-hidden flex flex-col">
        {/* Background Decorations */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden z-0"
          aria-hidden="true"
        >
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#F4779B] border-[3px] border-[#141A35]" />
          <div className="absolute -bottom-28 -left-20 w-56 h-56 rounded-full bg-[#2450EA] border-[3px] border-[#141A35]" />
          <div className="absolute -top-24 -right-20 w-52 h-52 rounded-full bg-[#2450EA] border-[3px] border-[#141A35]" />
          <div className="absolute -bottom-28 -right-24 w-56 h-56 rounded-full bg-[#FFD329] border-[3px] border-[#141A35]" />

          <NavyDotGrid
            rows={5}
            cols={5}
            className="hidden md:block absolute left-3 top-[22%]"
          />
          <NavyDotGrid
            rows={5}
            cols={5}
            className="hidden md:block absolute right-3 top-[22%]"
          />
        </div>

        {/* Top Navigation */}
        <header className="relative z-30 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#141A35]/15">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase text-[#141A35] hover:text-[#2450EA] transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg focus-visible:outline-3 focus-visible:outline-[#2450EA]"
            aria-label="Back to Problem Finder"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.75} />
            <span>PROBLEM FINDER</span>
          </motion.button>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-[#FFFDF5] p-1 rounded-full border-2 border-[#141A35] shadow-[2px_2px_0_#141A35]">
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-full font-heading font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                viewMode === "map"
                  ? "bg-[#FFD329] text-[#141A35] shadow-[2px_2px_0_#141A35]"
                  : "text-[#141A35]/70 hover:text-[#141A35]"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              JOURNEY MAP
            </button>

            <button
              type="button"
              onClick={() => setViewMode("agent")}
              className={`px-3 py-1.5 rounded-full font-heading font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                viewMode === "agent"
                  ? "bg-[#2450EA] text-white shadow-[2px_2px_0_#141A35]"
                  : "text-[#141A35]/70 hover:text-[#141A35]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              10% RESEARCH AGENT
            </button>
          </div>

          <span className="hidden sm:inline font-heading font-extrabold text-[11px] sm:text-xs tracking-[0.16em] uppercase text-[#141A35]">
            MIT STARTUP FRAMEWORK
          </span>
        </header>

        {/* Content View: Journey Map vs Research Agent */}
        {viewMode === "agent" ? (
          <main className="relative z-10 flex-1 w-full">
            <ResearchAgentWorkspace onBackToMap={() => setViewMode("map")} />
          </main>
        ) : (
          <main className="relative z-10 flex-1 flex items-center justify-center w-full max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 py-3">
            {/* Desktop Composition */}
            <div className="hidden lg:block relative w-full h-[clamp(640px,calc(100vh-76px),840px)] max-w-[1380px] mx-auto">
              <ConnectingArrowsSVG selectedIndex={null} />

              {/* Central EXPLORE THE FRAMEWORK -> Button */}
              <div className="absolute left-1/2 top-[48.5%] -translate-x-1/2 -translate-y-1/2 z-20">
                <CentralFrameworkCTA onClick={handleLaunchAgent} />
              </div>

              {/* Nine Solid Neo-Brutalist Cards */}
              {frameworkCards.map((item, idx) => (
                <div
                  key={item.id}
                  className={`absolute z-10 ${item.desktopPos}`}
                >
                  <FrameworkCard
                    item={item}
                    index={idx}
                    isSelected={false}
                    onSelect={() => handleCardClick(item)}
                    useTilt={true}
                  />
                </div>
              ))}
            </div>

            {/* Tablet Composition */}
            <div className="hidden md:flex lg:hidden flex-col items-center w-full max-w-4xl mx-auto py-4 gap-4 relative">
              <div className="grid grid-cols-2 gap-4 w-full relative z-10">
                {[0, 2, 5, 1].map((cardIdx) => (
                  <FrameworkCard
                    key={frameworkCards[cardIdx].id}
                    item={frameworkCards[cardIdx]}
                    index={cardIdx}
                    isSelected={false}
                    onSelect={() => handleCardClick(frameworkCards[cardIdx])}
                  />
                ))}
              </div>

              <div className="my-3 flex justify-center relative z-20">
                <CentralFrameworkCTA onClick={handleLaunchAgent} />
              </div>

              <div className="grid grid-cols-2 gap-4 w-full relative z-10">
                {[6, 3, 7, 4].map((cardIdx) => (
                  <FrameworkCard
                    key={frameworkCards[cardIdx].id}
                    item={frameworkCards[cardIdx]}
                    index={cardIdx}
                    isSelected={false}
                    onSelect={() => handleCardClick(frameworkCards[cardIdx])}
                  />
                ))}
              </div>

              <div className="w-full max-w-md relative z-10">
                <FrameworkCard
                  item={frameworkCards[8]}
                  index={8}
                  isSelected={false}
                  onSelect={() => handleCardClick(frameworkCards[8])}
                />
              </div>
            </div>

            {/* Mobile Composition */}
            <div className="flex md:hidden flex-col items-center w-full max-w-md mx-auto py-4 gap-3.5 relative">
              <div className="w-full flex justify-center mb-1">
                <CentralFrameworkCTA
                  onClick={handleLaunchAgent}
                  className="w-full max-w-xs"
                />
              </div>

              {frameworkCards.map((item, idx) => (
                <div key={item.id} className="w-full">
                  <FrameworkCard
                    item={item}
                    index={idx}
                    isSelected={false}
                    onSelect={() => handleCardClick(item)}
                  />
                </div>
              ))}
            </div>
          </main>
        )}

        {/* Phase Details Modal */}
        <AnimatePresence>
          {selectedCardModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141A35]/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                className="bg-[#FFFDF5] border-[3.5px] border-[#141A35] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[8px_8px_0_#141A35] space-y-5"
              >
                <div className="flex items-center justify-between border-b-2 border-[#141A35]/15 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFD329] border-2 border-[#141A35] font-heading font-black text-xs text-[#141A35]">
                      PHASE {selectedCardModal.id}
                    </span>
                    <span className="font-heading font-extrabold text-xs uppercase text-[#2450EA]">
                      {selectedCardModal.mitConcept}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCardModal(null)}
                    className="p-1 rounded-lg border border-[#141A35] bg-white hover:bg-gray-100 cursor-pointer"
                  >
                    <X className="w-4 h-4 text-[#141A35]" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-heading font-black text-xl text-[#141A35] leading-tight">
                    {selectedCardModal.heading}
                  </h3>

                  <div className="p-4 rounded-2xl bg-[#FFFBEF] border-2 border-[#141A35] space-y-2 shadow-[2px_2px_0_#141A35]">
                    <div className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#141A35]/70">
                      MIT Framework Core Insight:
                    </div>
                    <p className="font-body text-xs sm:text-sm text-[#141A35] leading-relaxed">
                      {selectedCardModal.mitInsight}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#141A35] space-y-2 shadow-[2px_2px_0_#141A35]">
                    <div className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#2450EA]">
                      Suggested Founder Experiment:
                    </div>
                    <p className="font-body text-xs sm:text-sm text-[#141A35] font-medium leading-relaxed">
                      {selectedCardModal.suggestedTest}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCardModal(null)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border-2 border-[#141A35] font-heading font-bold text-xs uppercase text-[#141A35] hover:bg-gray-100 cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={handleLaunchAgent}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FFD329] border-2 border-[#141A35] font-heading font-black text-xs uppercase tracking-wider text-[#141A35] shadow-[3px_3px_0_#141A35] hover:shadow-[5px_5px_0_#141A35] inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>TEST IN 10% RESEARCH AGENT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
