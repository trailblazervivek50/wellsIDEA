import { useEffect, useRef, useMemo } from "react";
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
  const incomingRef = useRef<HTMLDivElement>(null);

  // Compute maximum radius to guarantee complete coverage across all viewport corners
  const maxRadius = useMemo(() => {
    if (typeof window === "undefined") return 1600;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ox = origin.x ?? w / 2;
    const oy = origin.y ?? h / 2;
    const d1 = Math.hypot(ox, oy);
    const d2 = Math.hypot(w - ox, oy);
    const d3 = Math.hypot(ox, h - oy);
    const d4 = Math.hypot(w - ox, h - oy);
    return Math.ceil(Math.max(d1, d2, d3, d4) + 60);
  }, [origin.x, origin.y]);

  const ox = origin.x ?? (typeof window !== "undefined" ? Math.round(window.innerWidth / 2) : 700);
  const oy = origin.y ?? (typeof window !== "undefined" ? Math.round(window.innerHeight / 2) : 400);

  useEffect(() => {
    const el = incomingRef.current;
    if (!el) {
      onComplete();
      return;
    }

    const startClip = `circle(0px at ${ox}px ${oy}px)`;
    const endClip = `circle(${maxRadius}px at ${ox}px ${oy}px)`;

    // Set initial clip style
    el.style.clipPath = startClip;
    (el.style as any).webkitClipPath = startClip;

    if (typeof el.animate === "function") {
      // GPU-composited native Web Animations API for 120fps butter-smooth expansion
      const animation = el.animate(
        [
          { clipPath: startClip },
          { clipPath: endClip },
        ],
        {
          duration: 700,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        }
      );

      animation.onfinish = () => {
        onComplete();
      };

      return () => {
        animation.cancel();
      };
    } else {
      const timer = setTimeout(onComplete, 700);
      return () => clearTimeout(timer);
    }
  }, [ox, oy, maxRadius, onComplete]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-50 pointer-events-none select-none">
      {/* 1. Outgoing Page: 100% stationary, no filters, no scaling, zero lag */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {outgoingContent}
      </div>

      {/* 2. Incoming Page: Clean circular iris wipe opening directly with NO rings */}
      <div
        ref={incomingRef}
        className="absolute inset-0 w-full h-full z-10 overflow-hidden bg-[#FFFBEF]"
        style={{
          willChange: "clip-path",
          transform: "translateZ(0)",
        }}
      >
        <div className="w-full h-full overflow-y-auto">
          {incomingContent}
        </div>
      </div>
    </div>
  );
}
