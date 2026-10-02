import { platforms } from "../data/platforms";
import { PlatformCard } from "./PlatformCard";
import { Sticker } from "./Sticker";
import { TodaysDiscovery } from "./TodaysDiscovery";
import { motion } from "framer-motion";

export function PlatformsSection() {
  const getColSpan = (index: number) => {
    if (index === 0) return "col-span-1 md:col-span-2 lg:col-span-2";
    if (index === 6) return "col-span-1 md:col-span-2 lg:col-span-2";
    return "col-span-1";
  };

  return (
    <section id="platforms" className="bg-background pt-32 pb-40 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="mb-20 max-w-3xl relative">
          <Sticker text="7 PLACES" color="blue" rotation={-8} className="-top-12 -left-4" delay={0.1} />
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter mb-6 mt-8"
          >
            Start with the right places.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-body font-bold text-muted-foreground border-l-4 border-border pl-6"
          >
            Explore platforms where people share problems, needs, frustrations and opportunities.
          </motion.p>
          <Sticker text="GO LOOK 👀" color="yellow" rotation={12} className="top-12 right-0 md:right-1/4" delay={0.2} />
        </div>

        <TodaysDiscovery />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {platforms.map((platform, index) => (
            <div key={platform.id} className={getColSpan(index)}>
              <PlatformCard platform={platform} index={index} isWide={index === 0 || index === 6} />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
