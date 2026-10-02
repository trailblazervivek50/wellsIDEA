import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles, Hash } from "lucide-react";
import { cn } from "../lib/utils";
import type { Platform } from "../data/platforms";
import { useRef, useEffect, useState } from "react";

interface PlatformCardProps {
  platform: Platform;
  index: number;
  isWide?: boolean;
}

export function PlatformCard({ platform, index, isWide }: PlatformCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);
  
  const moveX = useTransform(mouseXSpring, [-0.5, 0.5], ["-4px", "4px"]);
  const moveY = useTransform(mouseYSpring, [-0.5, 0.5], ["-4px", "4px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isTouch) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct);
      y.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const bgColors = {
    yellow: "bg-primary text-foreground",
    blue: "bg-blue text-background",
    pink: "bg-pink text-foreground",
    cream: "bg-background text-foreground"
  };

  const numberColors = {
    yellow: "text-foreground/30",
    blue: "text-background/30",
    pink: "text-foreground/30",
    cream: "text-muted-foreground/30"
  };

  return (
    <motion.a
      ref={ref}
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ y: 40, opacity: 0, rotate: platform.rotation }}
      whileInView={{ y: 0, opacity: 1, rotate: platform.rotation }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        scale: 1.025,
        y: -6,
        rotate: 0,
        boxShadow: "7px 7px 0 var(--border)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      transition={{ 
        delay: index * 0.07, 
        type: "spring",
        stiffness: 260,
        damping: 22
      }}
      style={
        isHovered && !isTouch
          ? { rotateX, rotateY, x: moveX, y: moveY }
          : { rotateX: 0, rotateY: 0, x: 0, y: 0 }
      }
      className={cn(
        "group h-full flex flex-col justify-between p-8 md:p-10 rounded-[2rem] border-2 border-border relative overflow-hidden",
        bgColors[platform.color],
        isWide && "md:flex-row md:items-end md:gap-8"
      )}
    >
      <div className={cn("flex justify-between items-start relative z-10 w-full", isWide && "md:flex-col md:h-full md:w-auto")}>
        <span className={cn("font-heading font-extrabold text-6xl tracking-tighter leading-none mb-12", numberColors[platform.color])}>
          {platform.id}
        </span>
        <motion.div 
          animate={{ x: isHovered ? 6 : 0, scale: isHovered ? 1.12 : 1, rotate: isHovered ? 5 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-14 h-14 rounded-full border-2 border-border bg-background flex items-center justify-center hard-shadow group-hover:bg-primary transition-colors"
        >
          <ArrowUpRight className="w-7 h-7 text-foreground" />
        </motion.div>
      </div>
      
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0.88, y: isHovered ? 0 : 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn("relative z-10 mt-8", isWide && "md:mt-0 md:flex-1")}
      >
        <h3 className={cn("font-heading font-extrabold mb-4 group-hover:underline underline-offset-4 decoration-4", isWide ? "text-4xl md:text-5xl" : "text-3xl")}>
          {platform.name}
        </h3>
        <p className="font-body font-bold text-lg md:text-xl opacity-90 max-w-sm leading-relaxed">
          {platform.description}
        </p>
      </motion.div>

      {/* Decorative Icon */}
      <motion.div 
        animate={{ scale: isHovered ? 1.12 : 1, rotate: isHovered ? 5 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none"
      >
        {index % 2 === 0 ? (
          <Sparkles className="w-56 h-56" />
        ) : (
          <Hash className="w-56 h-56" />
        )}
      </motion.div>
    </motion.a>
  );
}
