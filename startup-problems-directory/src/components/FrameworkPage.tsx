import { motion, MotionConfig } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import { useState } from "react";

interface FrameworkPageProps {
  onBack: () => void;
  onExploreFramework?: () => void;
}

type CardColor = "yellow" | "blue" | "pink" | "cream";

interface FrameworkCardItem {
  id: string;
  heading: string;
  color: CardColor;
  rotation: number;
  desktopPos: string;
  hasAccentStroke?: "top-left" | "top-right" | "bottom-left";
}

const frameworkCards: FrameworkCardItem[] = [
  {
    id: "01",
    heading: "You don't know anything about Entrepreneurship",
    color: "yellow",
    rotation: -1.4,
    desktopPos: "left-[2.5%] top-[3.5%] w-[26.5%]",
    hasAccentStroke: "top-left",
  },
  {
    id: "02",
    heading: "You see something that “Sucks”",
    color: "cream",
    rotation: 1.2,
    desktopPos: "left-[1.5%] top-[28.5%] w-[24%]",
  },
  {
    id: "03",
    heading: "You have an Idea or Invention",
    color: "pink",
    rotation: -1,
    desktopPos: "left-[37%] top-[2.5%] w-[25.5%]",
  },
  {
    id: "04",
    heading: "Being an Entrepreneur is Glamorous",
    color: "blue",
    rotation: -1.3,
    desktopPos: "left-[2%] top-[53.5%] w-[25%]",
  },
  {
    id: "05",
    heading: "How Do I Start? What Do I Do?",
    color: "yellow",
    rotation: 1.2,
    desktopPos: "left-[11%] bottom-[3.5%] w-[27.5%]",
    hasAccentStroke: "bottom-left",
  },
  {
    id: "06",
    heading: "How will I make money so I can have a sustainable venture?",
    color: "blue",
    rotation: 1.4,
    desktopPos: "right-[2.5%] top-[3.5%] w-[27.5%]",
    hasAccentStroke: "top-right",
  },
  {
    id: "07",
    heading: "How long will it take to bring my solution to market?",
    color: "yellow",
    rotation: -1.2,
    desktopPos: "right-[1.5%] top-[28.5%] w-[25.5%]",
  },
  {
    id: "08",
    heading: "Will I need to set up some sort of entity to do all this?",
    color: "cream",
    rotation: 1.1,
    desktopPos: "right-[2%] top-[53.5%] w-[26%]",
  },
  {
    id: "09",
    heading: "How Do I Keep People from Stealing my Ideas?",
    color: "pink",
    rotation: -1.3,
    desktopPos: "right-[11%] bottom-[3.5%] w-[28%]",
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

// Nine clean curved navy arrows in a 1400x820 coordinate system pointing from each card toward the central CTA (center: 700, 398)
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
    <svg
      width={cols * 14}
      height={rows * 14}
      viewBox={`0 0 ${cols * 14} ${rows * 14}`}
      className={className}
      aria-hidden="true"
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => (
          <circle
            key={`${r}-${c}`}
            cx={c * 14 + 4}
            cy={r * 14 + 4}
            r="2"
            fill="#141A35"
            opacity="0.22"
          />
        ))
      )}
    </svg>
  );
}

function CircularArrowButton({ isHovered }: { isHovered: boolean }) {
  return (
    <motion.span
      animate={{
        x: isHovered ? 2 : 0,
        y: isHovered ? -2 : 0,
        scale: isHovered ? 1.08 : 1,
      }}
      transition={{ type: "spring", stiffness: 360, damping: 20 }}
      className="w-8 h-8 xl:w-9 xl:h-9 rounded-full border-2 border-[#141A35] bg-[#FFFDF5] text-[#141A35] flex items-center justify-center shrink-0 shadow-[2px_2px_0_#141A35]"
      aria-hidden="true"
    >
      <ArrowUpRight className="w-4 h-4 xl:w-4.5 xl:h-4.5" strokeWidth={2.75} />
    </motion.span>
  );
}

interface FrameworkCardProps {
  item: FrameworkCardItem;
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
  useTilt = false,
}: FrameworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colorStyles: Record<CardColor, { card: string; badge: string }> = {
    yellow: {
      card: "bg-[#FFD329] text-[#141A35]",
      badge: "bg-[#FFFDF5] text-[#141A35]",
    },
    blue: {
      card: "bg-[#2450EA] text-[#FFFDF5]",
      badge: "bg-[#FFD329] text-[#141A35]",
    },
    pink: {
      card: "bg-[#F4779B] text-[#141A35]",
      badge: "bg-[#FFFDF5] text-[#141A35]",
    },
    cream: {
      card: "bg-[#FFFDF5] text-[#141A35]",
      badge: "bg-[#FFD329] text-[#141A35]",
    },
  };

  const baseRotate = useTilt ? item.rotation : 0;
  const hoverRotate = useTilt ? item.rotation * 0.35 : 0;

  return (
    <div className="relative">
      {/* Subtle navy accent strokes near selected cards */}
      {useTilt && item.hasAccentStroke === "top-left" && (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          className="absolute -top-5 -left-5 pointer-events-none"
          aria-hidden="true"
        >
          <path
            d="M 6 22 L 16 8 M 14 24 L 24 14"
            stroke="#141A35"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      )}
      {useTilt && item.hasAccentStroke === "top-right" && (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          className="absolute -top-5 -right-5 pointer-events-none"
          aria-hidden="true"
        >
          <path
            d="M 6 12 L 20 6 M 10 20 L 22 14"
            stroke="#141A35"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      )}
      {useTilt && item.hasAccentStroke === "bottom-left" && (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          className="absolute -bottom-5 -left-5 pointer-events-none"
          aria-hidden="true"
        >
          <path
            d="M 8 6 L 18 20 M 18 6 L 24 15"
            stroke="#141A35"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      <motion.button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Stage ${item.id}: ${item.heading}`}
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
      className={`group framework-neo-cta px-7 py-4 xl:px-9 xl:py-5 inline-flex items-center justify-center gap-3 font-heading font-extrabold text-[clamp(14px,1.2vw,18px)] uppercase tracking-wider cursor-pointer select-none whitespace-nowrap ${className}`}
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

export function FrameworkPage({ onBack, onExploreFramework }: FrameworkPageProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCycleFramework = () => {
    if (onExploreFramework) {
      onExploreFramework();
      return;
    }
    setSelectedIndex((prev) =>
      prev === null ? 0 : (prev + 1) % frameworkCards.length
    );
  };

  return (
    <MotionConfig reducedMotion="never">
      <div className="min-h-screen w-full bg-[#FFFBEF] text-[#141A35] font-body relative overflow-x-hidden flex flex-col">
        {/* Background Decorations (Behind content, clipped to viewport) */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden z-0"
          aria-hidden="true"
        >
          {/* Cropped Blue & Pink Corner Circles with Navy Outlines */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#F4779B] border-[3px] border-[#141A35]" />
          <div className="absolute -bottom-28 -left-20 w-56 h-56 rounded-full bg-[#2450EA] border-[3px] border-[#141A35]" />
          <div className="absolute -top-24 -right-20 w-52 h-52 rounded-full bg-[#2450EA] border-[3px] border-[#141A35]" />
          <div className="absolute -bottom-28 -right-24 w-56 h-56 rounded-full bg-[#FFD329] border-[3px] border-[#141A35]" />

          {/* Small Navy Dot Patterns Near Canvas Edges */}
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
          <NavyDotGrid
            rows={4}
            cols={7}
            className="hidden lg:block absolute left-[45%] bottom-2"
          />
        </div>

        {/* Compact Top Navigation */}
        <header className="relative z-30 w-full max-w-[1440px] mx-auto px-4 sm:px-8 h-13 flex items-center justify-between border-b-2 border-[#141A35]/15">
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

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-heading font-extrabold text-[11px] sm:text-xs tracking-[0.16em] uppercase text-[#141A35]">
              ENTREPRENEURIAL JOURNEY FRAMEWORK
            </span>
            {onExploreFramework && (
              <button
                type="button"
                onClick={onExploreFramework}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD329] border-2 border-[#141A35] font-heading font-extrabold text-[11px] uppercase tracking-wider text-[#141A35] shadow-[2px_2px_0_#141A35] hover:bg-[#2450EA] hover:text-white transition-colors cursor-pointer"
              >
                <span>10% EVALUATION</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </header>

        {/* Main Responsive Framework Canvas */}
        <main className="relative z-10 flex-1 flex items-center justify-center w-full max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 py-3">
          {/* ============================================================
              DESKTOP COMPOSITION (lg: 1024px+)
              Fits comfortably within a 100vh desktop viewport while
              allowing natural vertical scroll on shorter screens
          ============================================================ */}
          <div className="hidden lg:block relative w-full h-[clamp(640px,calc(100vh-76px),840px)] max-w-[1380px] mx-auto">
            {/* Curved Navy Connector Arrows */}
            <ConnectingArrowsSVG selectedIndex={selectedIndex} />

            {/* Central EXPLORE THE FRAMEWORK -> Button */}
            <div className="absolute left-1/2 top-[48.5%] -translate-x-1/2 -translate-y-1/2 z-20">
              <CentralFrameworkCTA onClick={handleCycleFramework} />
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
                  isSelected={selectedIndex === idx}
                  onSelect={() => setSelectedIndex(idx)}
                  useTilt={true}
                />
              </div>
            ))}
          </div>

          {/* ============================================================
              TABLET COMPOSITION (md to lg: 768px – 1023px)
          ============================================================ */}
          <div className="hidden md:flex lg:hidden flex-col items-center w-full max-w-4xl mx-auto py-4 gap-4 relative">
            <div className="grid grid-cols-2 gap-4 w-full relative z-10">
              {[0, 2, 5, 1].map((cardIdx) => (
                <FrameworkCard
                  key={frameworkCards[cardIdx].id}
                  item={frameworkCards[cardIdx]}
                  index={cardIdx}
                  isSelected={selectedIndex === cardIdx}
                  onSelect={() => setSelectedIndex(cardIdx)}
                />
              ))}
            </div>

            <div className="my-3 flex justify-center relative z-20">
              <CentralFrameworkCTA onClick={handleCycleFramework} />
            </div>

            <div className="grid grid-cols-2 gap-4 w-full relative z-10">
              {[6, 3, 7, 4].map((cardIdx) => (
                <FrameworkCard
                  key={frameworkCards[cardIdx].id}
                  item={frameworkCards[cardIdx]}
                  index={cardIdx}
                  isSelected={selectedIndex === cardIdx}
                  onSelect={() => setSelectedIndex(cardIdx)}
                />
              ))}
            </div>

            <div className="w-full max-w-md relative z-10">
              <FrameworkCard
                item={frameworkCards[8]}
                index={8}
                isSelected={selectedIndex === 8}
                onSelect={() => setSelectedIndex(8)}
              />
            </div>
          </div>

          {/* ============================================================
              MOBILE VERTICAL LAYOUT (< 768px)
              Clean vertical sequence with accessible Central CTA
          ============================================================ */}
          <div className="flex md:hidden flex-col w-full max-w-md mx-auto py-3 gap-3.5 relative z-10">
            <div className="flex flex-col gap-3.5">
              {frameworkCards.slice(0, 4).map((item, idx) => (
                <FrameworkCard
                  key={item.id}
                  item={item}
                  index={idx}
                  isSelected={selectedIndex === idx}
                  onSelect={() => setSelectedIndex(idx)}
                />
              ))}
            </div>

            <div className="my-2 flex justify-center">
              <CentralFrameworkCTA
                onClick={handleCycleFramework}
                className="w-full max-w-[340px]"
              />
            </div>

            <div className="flex flex-col gap-3.5">
              {frameworkCards.slice(4).map((item, idx) => (
                <FrameworkCard
                  key={item.id}
                  item={item}
                  index={idx + 4}
                  isSelected={selectedIndex === idx + 4}
                  onSelect={() => setSelectedIndex(idx + 4)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}
