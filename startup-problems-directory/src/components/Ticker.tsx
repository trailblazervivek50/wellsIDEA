import { motion, useAnimation } from "framer-motion";

export function Ticker() {
  const text = "Find problems. Validate demand. Build something people need. · Real problems. Real people. Real opportunities. · ";
  const controls = useAnimation();

  return (
    <div 
      className="bg-blue text-background h-10 flex items-center overflow-hidden border-b-2 border-border whitespace-nowrap relative z-50 cursor-default"
      onMouseEnter={() => controls.start({ transition: { duration: 60, ease: "linear", repeat: Infinity } })}
      onMouseLeave={() => controls.start({ transition: { duration: 20, ease: "linear", repeat: Infinity } })}
    >
      <motion.div
        className="flex whitespace-nowrap font-heading text-sm tracking-widest uppercase items-center"
        animate={controls}
        initial={{ x: "0%" }}
        onViewportEnter={() => controls.start({ x: ["0%", "-50%"], transition: { duration: 20, ease: "linear", repeat: Infinity } })}
      >
        <span className="pr-4">{text}</span>
        <span className="pr-4">{text}</span>
        <span className="pr-4">{text}</span>
        <span className="pr-4">{text}</span>
      </motion.div>
    </div>
  );
}
