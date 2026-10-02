import { motion } from "framer-motion";
import { Sticker } from "./Sticker";
import { Search, Target, Lightbulb, ArrowDown } from "lucide-react";
import { WaveDivider } from "./WaveDivider";

export function Hero() {
  const words = ["Find problems", "worth", "solving."];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-primary pt-16 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-12">
        
        {/* Text Content */}
        <div className="flex-1 z-10 w-full relative">
          <Sticker 
            text="START HERE ➔" 
            color="pink" 
            rotation={-6} 
            className="-top-8 left-4 md:-left-4" 
            delay={0.8}
          />
          <h1 className="text-[clamp(56px,10vw,150px)] leading-[0.9] tracking-tighter mb-8 font-heading font-extrabold relative">
            {words.map((word, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.6, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                  delay: i * 0.08
                }}
                className={word === "worth" ? "text-blue relative inline-block" : "block"}
              >
                {word}
                {word === "worth" && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="absolute -bottom-2 left-0 right-0 h-4 bg-background border-2 border-border origin-left -z-10 transform -rotate-2"
                  />
                )}
              </motion.div>
            ))}
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl font-body font-bold mb-10 max-w-xl text-foreground/90 border-l-4 border-border pl-6 py-2"
          >
            A curated collection of platforms that help you discover real problems, customer pain points and startup opportunities.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={() => scrollTo('platforms')}
              className="bg-foreground text-background px-8 py-4 rounded-xl font-heading font-extrabold text-lg uppercase tracking-wider hard-shadow hard-shadow-hover flex items-center gap-2 cursor-pointer"
            >
              Explore platforms <ArrowDown className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scrollTo('how-it-works')}
              className="bg-background text-foreground px-8 py-4 rounded-xl font-heading font-extrabold text-lg uppercase tracking-wider hard-shadow hard-shadow-hover cursor-pointer"
            >
              How it works
            </button>
          </motion.div>
        </div>

        {/* Visual Composition */}
        <div className="flex-1 w-full h-[400px] md:h-[600px] relative hidden md:block mt-12 md:mt-0">
          <motion.div
            initial={{ rotate: -8, scale: 0.85 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.6 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Base abstract shape */}
            <div className="absolute w-[80%] h-[80%] bg-background rounded-3xl border-4 border-border hard-shadow transform rotate-3 z-0" />
            
            {/* Floating Card 1 */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-1/4 -left-8 bg-blue p-6 rounded-2xl border-2 border-border hard-shadow z-10 transform -rotate-6 max-w-[200px]"
            >
              <Search className="w-8 h-8 text-background mb-4" />
              <div className="h-2 w-full bg-background/50 rounded-full mb-2" />
              <div className="h-2 w-3/4 bg-background/50 rounded-full" />
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 -right-4 bg-pink p-6 rounded-2xl border-2 border-border hard-shadow z-10 transform rotate-6 max-w-[200px]"
            >
              <Target className="w-8 h-8 text-foreground mb-4" />
              <div className="h-2 w-full bg-foreground/50 rounded-full mb-2" />
              <div className="h-2 w-1/2 bg-foreground/50 rounded-full" />
            </motion.div>

            {/* Main center graphic */}
            <div className="relative z-20 bg-background p-8 rounded-full border-4 border-border hard-shadow flex items-center justify-center transform -rotate-6">
              <Lightbulb className="w-24 h-24 text-primary" strokeWidth={2} />
              <Sticker text="REAL PROBLEMS" color="blue" rotation={8} className="-bottom-4 -right-12" delay={0.9} />
              <Sticker text="NO RANDOM IDEAS" color="yellow" rotation={-12} className="-top-6 -left-16" delay={1.0} />
            </div>
            
          </motion.div>
        </div>
      </div>
      
      <WaveDivider color="var(--background)" position="bottom" />
    </section>
  );
}
