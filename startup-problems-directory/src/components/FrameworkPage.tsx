import { motion, MotionConfig } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState, type ReactNode } from "react";

interface FrameworkPageProps {
  onBack: () => void;
}

interface FrameworkSectionData {
  id: string;
  label: string;
  heading: ReactNode;
  supporting?: ReactNode;
  questions?: string[];
  desktopPos: string;
  entryOffset: { x: number; y: number };
}

const frameworkSections: FrameworkSectionData[] = [
  {
    id: "01",
    label: "Entrepreneurship",
    heading: (
      <>
        <span className="text-[#E62E17]">
          You don&rsquo;t know anything
          <br />
          about{" "}
        </span>
        <span className="text-[#171A1D]">Entrepreneurship</span>
      </>
    ),
    supporting: "and want to understand what it's about",
    desktopPos: "left-[9.5%] top-[1.8%] w-[29.5%]",
    entryOffset: { x: -16, y: 24 },
  },
  {
    id: "02",
    label: "Improving things",
    heading: (
      <>
        <span className="text-[#E62E17]">
          You see something
          <br />
          that{" "}
        </span>
        <span className="text-[#171A1D]">&ldquo;Sucks&rdquo;</span>
      </>
    ),
    supporting: "and want to make it better",
    desktopPos: "left-[4.8%] top-[22%] w-[24.2%]",
    entryOffset: { x: -18, y: 24 },
  },
  {
    id: "03",
    label: "Ideas and inventions",
    heading: (
      <>
        <span className="text-[#E62E17]">
          You have an Idea
          <br />
          or{" "}
        </span>
        <span className="text-[#171A1D]">Invention</span>
      </>
    ),
    supporting: (
      <>
        and want to bring it to life in some
        <br />
        way – To Change The World
      </>
    ),
    desktopPos: "left-[36.8%] top-[15.5%] w-[22.8%]",
    entryOffset: { x: 0, y: 24 },
  },
  {
    id: "04",
    label: "Entrepreneurial motivation",
    heading: (
      <>
        <span className="text-[#E62E17]">
          Being an Entrepreneur
          <br />
          is{" "}
        </span>
        <span className="text-[#171A1D]">Glamorous</span>
      </>
    ),
    supporting: "and I can make a lot of money",
    desktopPos: "left-[5.8%] top-[40.5%] w-[26.5%]",
    entryOffset: { x: -18, y: 24 },
  },
  {
    id: "05",
    label: "Getting started",
    heading: (
      <>
        <span className="text-[#E62E17]">How Do I Start?</span>
        <br />
        <span className="text-[#171A1D]">What Do I Do?</span>
      </>
    ),
    questions: [
      "What is the Problem that I am solving?",
      "How does my Solution Solve that Problem?",
      "“Who Cares About my Idea?” Specifically Who Cares?",
      "Who is my Customer?",
      "How do I find these people?",
    ],
    desktopPos: "left-[19%] top-[59.5%] w-[32.8%]",
    entryOffset: { x: -14, y: 28 },
  },
  {
    id: "06",
    label: "Business model",
    heading: (
      <>
        <span className="text-[#E62E17]">
          How will I make money
          <br />
          so I can have a
          <br />
        </span>
        <span className="text-[#171A1D]">sustainable venture?</span>
      </>
    ),
    supporting: "this is the Business/Venture Model",
    desktopPos: "left-[60%] top-[1.5%] w-[27.5%]",
    entryOffset: { x: 16, y: 24 },
  },
  {
    id: "07",
    label: "Time and resources",
    heading: (
      <>
        <span className="text-[#E62E17]">
          How long will it take
          <br />
          to bring my solution
          <br />
          to{" "}
        </span>
        <span className="text-[#171A1D]">market?</span>
      </>
    ),
    supporting: (
      <>
        What will it cost? What resources
        <br />
        will I need – people, money etc.
      </>
    ),
    desktopPos: "left-[73%] top-[21.5%] w-[22.8%]",
    entryOffset: { x: 18, y: 24 },
  },
  {
    id: "08",
    label: "Business entity",
    heading: (
      <>
        <span className="text-[#E62E17]">
          Will I need set up some sort
          <br />
          of{" "}
        </span>
        <span className="text-[#171A1D]">entity to do all this</span>
      </>
    ),
    supporting: (
      <>
        and attract investors and people?
        <br />
        Corporation? LLC
      </>
    ),
    desktopPos: "left-[71%] top-[45.5%] w-[26.5%]",
    entryOffset: { x: 18, y: 24 },
  },
  {
    id: "09",
    label: "Protecting ideas",
    heading: (
      <>
        <span className="text-[#E62E17]">
          How Do I Keep People
          <br />
          from{" "}
        </span>
        <span className="text-[#171A1D]">Stealing my Ideas?</span>
      </>
    ),
    questions: [
      "Will I need co-founders and what will be our relationship with each other and the entity?",
      "Founders Agreement?",
      "How will I negotiate with employees, consultants, investors, strategic partners?",
    ],
    desktopPos: "left-[59.8%] top-[65.5%] w-[30.5%]",
    entryOffset: { x: 14, y: 28 },
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

// Reference-matched cubic Bézier connectors in a 1400x1000 coordinate system pointing inward toward the central CTA (center: 703, 495)
const desktopConnectors: ConnectorSpec[] = [
  // From 02 right edge -> curves right and down into upper-left of Central CTA
  buildConnector(408, 340, 468, 338, 518, 378, 548, 442),
  // From 03 bottom-center -> curves down into top-center of Central CTA
  buildConnector(656, 374, 664, 398, 670, 418, 675, 442),
  // From 04 right edge -> points right into left end of Central CTA
  buildConnector(456, 502, 474, 501, 492, 500, 510, 499),
  // From 05 top-center -> points up-right into bottom-left of Central CTA
  buildConnector(456, 610, 476, 588, 496, 566, 515, 546),
  // From 06 bottom-left -> curves left and down into top-right-center of Central CTA
  buildConnector(948, 265, 868, 290, 822, 358, 808, 442),
  // From 07 left edge -> curves left and down into upper-right of Central CTA
  buildConnector(1026, 348, 955, 346, 910, 392, 886, 454),
  // From 08 bottom-left -> curves left and up into lower-right of Central CTA
  buildConnector(1002, 596, 945, 608, 906, 578, 886, 542),
  // From 09 left edge -> curves left and up into bottom-center of Central CTA
  buildConnector(844, 772, 765, 760, 738, 668, 736, 568),
];

function DottedGrid({
  rows = 6,
  cols = 7,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <svg
      width={cols * 16}
      height={rows * 16}
      viewBox={`0 0 ${cols * 16} ${rows * 16}`}
      className={className}
      aria-hidden="true"
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => (
          <circle
            key={`${r}-${c}`}
            cx={c * 16 + 4}
            cy={r * 16 + 4}
            r="1.8"
            fill="#BFC0BD"
            opacity="0.78"
          />
        ))
      )}
    </svg>
  );
}

interface FrameworkCardProps {
  section: FrameworkSectionData;
  index: number;
  isHighlighted: boolean;
  tilted?: boolean;
  className?: string;
}

function FrameworkCard({
  section,
  index,
  isHighlighted,
  tilted = false,
  className = "",
}: FrameworkCardProps) {
  const isCompact = !section.questions;
  const baseRotate = tilted ? -4.2 : 0;

  return (
    <motion.article
      initial={{
        opacity: 0,
        x: section.entryOffset.x,
        y: section.entryOffset.y,
        scale: 0.97,
        rotate: baseRotate,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: isHighlighted ? 1.018 : 1,
        rotate: baseRotate,
      }}
      transition={{
        duration: 0.68,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
        rotate: baseRotate,
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
      }}
      className={`framework-card ${
        isCompact
          ? "px-6 py-5 xl:px-7 xl:py-6"
          : "px-6 py-5 xl:px-8 xl:py-6"
      } ${
        isHighlighted ? "ring-1 ring-[#FF321B]/50" : ""
      } ${className}`}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="font-framework-sans text-[11px] xl:text-[12px] font-bold tracking-[0.06em] text-[#171A1D]">
            {section.id}
          </span>
          <span
            className="h-[1px] w-10 bg-[#171A1D]/30"
            aria-hidden="true"
          />
        </div>

        <h2
          className={`font-framework-serif font-bold leading-[1.05] tracking-[-0.02em] ${
            isCompact
              ? "text-[clamp(18px,1.75vw,26px)] mb-2"
              : "text-[clamp(20px,1.95vw,29px)] mb-3"
          }`}
        >
          {section.heading}
        </h2>

        {section.supporting && (
          <p className="font-framework-sans font-normal text-[clamp(12px,0.95vw,14px)] text-[#171A1D]/85 leading-[1.38]">
            {section.supporting}
          </p>
        )}

        {section.questions && (
          <div className="space-y-1 font-framework-sans font-normal text-[clamp(11.5px,0.92vw,13.5px)] text-[#171A1D]/85 leading-[1.38]">
            {section.questions.map((q, qIdx) => (
              <p key={qIdx}>{q}</p>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function FrameworkPage({ onBack }: FrameworkPageProps) {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handleCentralClick = () => {
    setHighlightedIndex((prev) =>
      prev === null ? 0 : (prev + 1) % frameworkSections.length
    );
  };

  return (
    <MotionConfig reducedMotion="never">
      <div className="min-h-screen w-full bg-[#F5F2E9] text-[#171A1D] font-framework-sans relative overflow-x-hidden flex flex-col pb-12">
        {/* Background Reference-Matched Decorative Elements (z-0, behind all content) */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden z-0"
          aria-hidden="true"
        >
          {/* Top-left cropped red-orange circular outline */}
          <div className="absolute -top-28 -left-24 w-[240px] h-[240px] rounded-full border-[1.5px] border-[#FF321B]" />

          {/* Bottom-left large thin red-orange circular arc + solid red-orange circle + 3D glass sphere */}
          <div className="absolute -bottom-36 -left-32 w-[420px] h-[420px] rounded-full border-[1.5px] border-[#FF321B]" />
          <div
            className="absolute -bottom-24 -left-16 w-[250px] h-[250px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #FF6B55 0%, #FF321B 58%, #E0220C 100%)",
            }}
          />
          <div className="hidden lg:block absolute bottom-[2%] left-[9.5%] w-[110px] h-[110px] rounded-full framework-glass-sphere" />

          {/* Mid-left cropped 3D glass sphere */}
          <div className="hidden lg:block absolute top-[30%] -left-10 w-[86px] h-[86px] rounded-full framework-glass-sphere" />

          {/* Top-center 3D glass sphere (left of Card 06) */}
          <div className="hidden lg:block absolute -top-3 left-[52%] w-[78px] h-[78px] rounded-full framework-glass-sphere" />

          {/* Top-right cropped red-orange circular outline + solid red-orange circle + small glass sphere */}
          <div className="absolute -top-24 -right-24 w-[290px] h-[290px] rounded-full border-[1.5px] border-[#FF321B]" />
          <div
            className="absolute -top-14 -right-16 w-[220px] h-[220px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 35%, #FF634D 0%, #FF321B 60%, #E0220C 100%)",
            }}
          />
          <div className="hidden lg:block absolute top-[12.5%] right-[3.5%] w-[54px] h-[54px] rounded-full framework-glass-sphere" />

          {/* Bottom-right cropped 3D glass sphere */}
          <div className="hidden lg:block absolute bottom-[5%] -right-8 w-[145px] h-[145px] rounded-full framework-glass-sphere" />

          {/* Soft coral-pink ambient discs behind card edges (refracted through backdrop-filter blur) */}
          <div className="hidden lg:block absolute left-[36.5%] top-[11.5%] w-14 h-14 rounded-full bg-[#FF321B]/22 blur-[2px]" />
          <div className="hidden lg:block absolute left-[25.5%] top-[30.5%] w-14 h-14 rounded-full bg-[#FF321B]/18 blur-[2px]" />
          <div className="hidden lg:block absolute left-[82.5%] top-[14.5%] w-14 h-14 rounded-full bg-[#FF321B]/18 blur-[2px]" />

          {/* Subtle muted-grey dotted grids matching the reference */}
          <DottedGrid
            rows={7}
            cols={6}
            className="hidden md:block absolute left-[1%] top-[10%]"
          />
          <DottedGrid
            rows={6}
            cols={8}
            className="hidden lg:block absolute left-[4.5%] top-[58%]"
          />
          <DottedGrid
            rows={4}
            cols={8}
            className="hidden lg:block absolute left-[48%] bottom-[1.5%]"
          />
          <DottedGrid
            rows={7}
            cols={5}
            className="hidden md:block absolute right-[1%] top-[28%]"
          />
          <DottedGrid
            rows={4}
            cols={6}
            className="hidden lg:block absolute right-[1.5%] bottom-[1.5%]"
          />
        </div>

        {/* Discreet Upper Navigation (Flat, no glassmorphism) */}
        <header className="relative z-30 max-w-[1440px] w-full mx-auto px-4 sm:px-8 pt-4 pb-1 flex items-center justify-between">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 font-framework-sans text-xs sm:text-sm font-medium tracking-[0.14em] uppercase text-[#171A1D]/80 hover:text-[#FF321B] transition-colors cursor-pointer py-1.5 px-2 rounded-md focus-visible:outline-2 focus-visible:outline-[#171A1D]"
            aria-label="Back to Problem Finder directory"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>PROBLEM FINDER</span>
          </motion.button>

          <span className="font-framework-sans text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-[#171A1D]/55">
            ENTREPRENEURIAL JOURNEY FRAMEWORK
          </span>
        </header>

        {/* Main Content Container */}
        <main className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto px-3 sm:px-6">
          {/* ============================================================
              DESKTOP REFERENCE COMPOSITION (lg: 1024px+)
              Nine tilted frosted-glass cards arranged around the horizontal
              central red-orange CTA with progressively drawn SVG Bézier
              arrows matching the supplied reference image
          ============================================================ */}
          <div className="hidden lg:block relative w-full h-[clamp(860px,64vw,960px)] max-w-[1400px] mx-auto">
            {/* Curved Inward Red-Orange Connector Arrows (Behind cards & button) */}
            <svg
              viewBox="0 0 1400 1000"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              aria-hidden="true"
            >
              {desktopConnectors.map((conn, idx) => {
                const pathDelay = 0.22 + idx * 0.075;
                const pathDuration = 0.68;

                return (
                  <g key={idx}>
                    <motion.path
                      d={conn.d}
                      fill="none"
                      stroke="#E62E17"
                      strokeWidth="1.85"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      transition={{
                        pathLength: {
                          duration: pathDuration,
                          delay: pathDelay,
                          ease: [0.22, 1, 0.36, 1],
                        },
                        opacity: {
                          duration: 0.2,
                          delay: pathDelay,
                        },
                      }}
                    />
                    {/* Arrowhead fades in after the path is drawn */}
                    <motion.g
                      transform={`translate(${conn.endX}, ${conn.endY}) rotate(${conn.angleDeg})`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.92 }}
                      transition={{
                        duration: 0.25,
                        delay: pathDelay + pathDuration - 0.12,
                        ease: "easeOut",
                      }}
                    >
                      <path
                        d="M -9 -4.5 L 0 0 L -9 4.5"
                        fill="none"
                        stroke="#E62E17"
                        strokeWidth="1.85"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.g>
                  </g>
                );
              })}
            </svg>

            {/* Central CTA Button (Visual Anchor) */}
            <div className="absolute left-[50.2%] top-[49.5%] -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.button
                type="button"
                onClick={handleCentralClick}
                initial={{ opacity: 0, scale: 0.94, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 20,
                  delay: 0.34,
                }}
                whileHover={{
                  y: -3,
                  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                }}
                whileTap={{
                  y: 0,
                  scale: 0.985,
                  transition: { duration: 0.14 },
                }}
                className="group framework-central-cta w-[clamp(300px,25.5vw,370px)] h-[clamp(64px,5.4vw,78px)] px-7 xl:px-9 inline-flex items-center justify-center gap-2.5 text-white font-framework-sans font-normal text-[clamp(14px,1.2vw,17.5px)] tracking-[0.06em] uppercase cursor-pointer select-none whitespace-nowrap"
              >
                <span>EXPLORE THE FRAMEWORK</span>
                <span
                  className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </motion.button>
            </div>

            {/* Nine Frosted-Glass Content Cards */}
            {frameworkSections.map((section, idx) => (
              <div
                key={section.id}
                className={`absolute z-10 ${section.desktopPos}`}
              >
                <FrameworkCard
                  section={section}
                  index={idx}
                  isHighlighted={highlightedIndex === idx}
                  tilted={true}
                />
              </div>
            ))}
          </div>

          {/* ============================================================
              TABLET COMPOSITION (md to lg: 768px – 1023px)
              Preserves the central button anchor surrounded by cards and
              animated SVG connectors with adjusted widths
          ============================================================ */}
          <div className="hidden md:flex lg:hidden flex-col items-center w-full max-w-4xl mx-auto py-6 gap-5 relative">
            {/* Upper 4 cards (01, 02, 06, 07) */}
            <div className="grid grid-cols-2 gap-5 w-full relative z-10">
              {[0, 1, 5, 6].map((secIdx) => (
                <FrameworkCard
                  key={frameworkSections[secIdx].id}
                  section={frameworkSections[secIdx]}
                  index={secIdx}
                  isHighlighted={highlightedIndex === secIdx}
                />
              ))}
            </div>

            {/* Middle band: 03 & 04 on left, Central CTA in center, 08 on right */}
            <div className="grid grid-cols-3 items-center gap-5 w-full relative z-10 my-2">
              <div className="flex flex-col gap-5">
                <FrameworkCard
                  section={frameworkSections[2]}
                  index={2}
                  isHighlighted={highlightedIndex === 2}
                />
                <FrameworkCard
                  section={frameworkSections[3]}
                  index={3}
                  isHighlighted={highlightedIndex === 3}
                />
              </div>

              <div className="flex flex-col items-center justify-center py-6 relative">
                <svg
                  viewBox="0 0 260 220"
                  className="w-full h-44 pointer-events-none opacity-85"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M 130 10 L 130 62 M 130 210 L 130 158 M 10 110 L 45 110 M 250 110 L 215 110"
                    stroke="#E62E17"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.65, delay: 0.3 }}
                  />
                </svg>
                <motion.button
                  type="button"
                  onClick={handleCentralClick}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 20,
                    delay: 0.34,
                  }}
                  whileHover={{ y: -3 }}
                  whileTap={{ y: 0, scale: 0.985 }}
                  className="group absolute framework-central-cta w-full max-w-[300px] min-h-[68px] px-5 py-4 inline-flex items-center justify-center gap-2 text-white font-framework-sans font-normal text-sm tracking-[0.06em] uppercase cursor-pointer whitespace-nowrap"
                >
                  <span>EXPLORE THE FRAMEWORK</span>
                  <span
                    className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </motion.button>
              </div>

              <div>
                <FrameworkCard
                  section={frameworkSections[7]}
                  index={7}
                  isHighlighted={highlightedIndex === 7}
                />
              </div>
            </div>

            {/* Lower 2 cards (05, 09) */}
            <div className="grid grid-cols-2 gap-5 w-full relative z-10">
              <FrameworkCard
                section={frameworkSections[4]}
                index={4}
                isHighlighted={highlightedIndex === 4}
              />
              <FrameworkCard
                section={frameworkSections[8]}
                index={8}
                isHighlighted={highlightedIndex === 8}
              />
            </div>
          </div>

          {/* ============================================================
              MOBILE VERTICAL LAYOUT (< 768px)
              Readable vertical sequence with introductory heading,
              cards 01–04, prominent Central CTA, and cards 05–09
          ============================================================ */}
          <div className="flex md:hidden flex-col w-full max-w-lg mx-auto py-4 gap-4 relative z-10">
            <div className="text-center mb-1">
              <p className="font-framework-sans text-[11px] uppercase tracking-[0.22em] text-[#E62E17] font-medium mb-1">
                The Entrepreneurial Journey
              </p>
              <h1 className="font-framework-serif text-2xl font-bold text-[#171A1D]">
                Explore the Framework
              </h1>
            </div>

            {/* Cards 01–04 */}
            <div className="flex flex-col gap-4">
              {frameworkSections.slice(0, 4).map((section, idx) => (
                <FrameworkCard
                  key={section.id}
                  section={section}
                  index={idx}
                  isHighlighted={highlightedIndex === idx}
                />
              ))}
            </div>

            {/* Prominent Central CTA on Mobile between card groups */}
            <div className="my-3 flex justify-center">
              <motion.button
                type="button"
                onClick={handleCentralClick}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 20,
                  delay: 0.25,
                }}
                whileHover={{ y: -3 }}
                whileTap={{ y: 0, scale: 0.985 }}
                className="group framework-central-cta w-full max-w-[350px] min-h-[66px] px-6 py-4 inline-flex items-center justify-center gap-2.5 text-white font-framework-sans font-normal text-base tracking-[0.06em] uppercase cursor-pointer whitespace-nowrap"
              >
                <span>EXPLORE THE FRAMEWORK</span>
                <span
                  className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </motion.button>
            </div>

            {/* Cards 05–09 */}
            <div className="flex flex-col gap-4">
              {frameworkSections.slice(4).map((section, idx) => (
                <FrameworkCard
                  key={section.id}
                  section={section}
                  index={idx + 4}
                  isHighlighted={highlightedIndex === idx + 4}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}
