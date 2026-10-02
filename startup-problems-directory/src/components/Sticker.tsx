import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface StickerProps {
  text: string;
  color: 'yellow' | 'blue' | 'pink' | 'cream';
  rotation: number;
  className?: string;
  delay?: number;
}

export function Sticker({ text, color, rotation, className, delay = 0 }: StickerProps) {
  const bgColor = {
    yellow: "bg-primary text-foreground",
    blue: "bg-blue text-background",
    pink: "bg-pink text-foreground",
    cream: "bg-background text-foreground"
  }[color];

  return (
    <motion.div
      initial={{ y: -30, opacity: 0, scale: 0.7, rotate: rotation - 15 }}
      whileInView={{ y: 0, opacity: 1, scale: 1, rotate: rotation }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        rotate: [rotation, rotation - 6, rotation + 6, rotation],
        scale: 1.05
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: delay
      }}
      className={cn(
        "absolute inline-flex items-center justify-center px-4 py-2 font-heading font-extrabold uppercase text-sm tracking-wider",
        "border-2 border-border rounded-full hard-shadow z-10 cursor-pointer",
        bgColor,
        className
      )}
    >
      {text}
    </motion.div>
  );
}
