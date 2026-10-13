import { useMemo } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface TransitionOrigin {
  x: number;
  y: number;
}

interface CirclePageTransitionProps {
  origin: TransitionOrigin;
  outgoingContent: ReactNode;
  incomingContent: ReactNode;
  onComplete: () => void;
}

export function CirclePageTransition({
  origin,
  outgoingContent,
  incomingContent,
  onComplete,
}: CirclePageTransitionProps) {
  // Compute max radius to guarantee coverage across all corners of viewport
  const maxRadius = useMemo(() => {
    if (typeof window === "undefined") return 1600;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ox = origin.x || w / 2;
    const oy = origin.y || h / 2;
    const d1 = Math.hypot(ox, oy);
    const d2 = Math.hypot(w - ox, oy);
    const d3 = Math.hypot(ox, h - oy);
    const d4 = Math.hypot(w - ox, h - oy);
    return Math.ceil(Math.max(d1, d2, d3, d4) + 80);
  }, [origin.x, origin.y]);

  const ox = origin.x || (typeof window !== "undefined" ? window.innerWidth / 2 : 700);
  const oy = origin.y || (typeof window !== "undefined" ? window.innerHeight / 2 : 400);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-50 pointer-events-none select-none">
      {/* 1. Outgoing Scene (Gently recedes with subtle depth scaling) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1, opacity: 1, filter: "brightness(1)" }}
          animate={{
            scale: 0.98,
            opacity: 0.8,
            filter: "brightness(0.96)",
          }}
          transition={{
            duration: 0.82,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full h-full"
        >
          {outgoingContent}
        </motion.div>
      </div>

      {/* 2. Incoming Scene (Revealed via expanding circular iris clipPath) */}
      <motion.div
        initial={{
          clipPath: `circle(0px at ${ox}px ${oy}px)`,
          WebkitClipPath: `circle(0px at ${ox}px ${oy}px)`,
        }}
        animate={{
          clipPath: `circle(${maxRadius}px at ${ox}px ${oy}px)`,
          WebkitClipPath: `circle(${maxRadius}px at ${ox}px ${oy}px)`,
        }}
        transition={{
          duration: 0.82,
          ease: [0.22, 1, 0.36, 1],
        }}
        onAnimationComplete={onComplete}
        className="absolute inset-0 w-full h-full z-10 overflow-y-auto bg-[#FFFBEF]"
        style={{ willChange: "clip-path" }}
      >
        <motion.div
          initial={{ scale: 0.965, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.82,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full min-h-full"
        >
          {incomingContent}
        </motion.div>
      </motion.div>

      {/* 3. Primary Leading Edge Circle Ring (Navy Border + Sunny Yellow Rim) */}
      <motion.div
        initial={{
          width: 0,
          height: 0,
          x: ox,
          y: oy,
          opacity: 1,
        }}
        animate={{
          width: maxRadius * 2,
          height: maxRadius * 2,
          x: ox - maxRadius,
          y: oy - maxRadius,
          opacity: [1, 1, 0.9, 0],
        }}
        transition={{
          duration: 0.82,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute rounded-full pointer-events-none z-30 border-[5px] border-[#141A35] shadow-[0_0_0_8px_#FFD329,0_0_36px_rgba(20,26,53,0.22)]"
        style={{ willChange: "transform, width, height, opacity" }}
      />

      {/* 4. Secondary Trailing Echo Ring (Cobalt Blue + Bubblegum Pink Accent Shockwave) */}
      <motion.div
        initial={{
          width: 0,
          height: 0,
          x: ox,
          y: oy,
          opacity: 0.85,
        }}
        animate={{
          width: Math.max(0, (maxRadius - 36) * 2),
          height: Math.max(0, (maxRadius - 36) * 2),
          x: ox - Math.max(0, maxRadius - 36),
          y: oy - Math.max(0, maxRadius - 36),
          opacity: [0.85, 0.75, 0],
        }}
        transition={{
          duration: 0.78,
          delay: 0.04,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute rounded-full pointer-events-none z-20 border-[3.5px] border-[#2450EA] shadow-[0_0_0_4px_#F4779B]"
        style={{ willChange: "transform, width, height, opacity" }}
      />
    </div>
  );
}
