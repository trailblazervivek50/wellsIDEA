import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { platforms } from "../data/platforms";
import { Sticker } from "./Sticker";

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function TodaysDiscovery() {
  const dayOfYear = getDayOfYear();
  const platform = platforms[dayOfYear % platforms.length];

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }).toUpperCase();

  return (
    <div className="mb-24 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex items-center gap-4 mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tighter">
          Today's discovery
        </h2>
        <div className="h-1 flex-1 bg-border/10 rounded-full" />
      </motion.div>

      <div className="relative">
        <Sticker 
          text="TRY THIS TODAY ➔" 
          color="pink" 
          rotation={-4} 
          className="absolute -top-10 md:-top-12 -right-4 md:-right-8 z-30 shadow-[4px_4px_0_var(--border)] scale-110 md:scale-125" 
          delay={0.2}
        />
        
        <motion.a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          whileHover="hover"
          variants={{
            hover: { 
              scale: 1.03, 
              y: -4, 
              boxShadow: "8px 8px 0 var(--border)",
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }
          }}
          style={{ boxShadow: "4px 4px 0 var(--border)" }}
          className="group relative flex flex-col md:flex-row bg-blue text-background rounded-3xl border-4 border-border transform cursor-pointer overflow-hidden"
        >
          {/* Diagonal Stripes Background */}
          <div className="absolute inset-0 z-0 diagonal-stripes opacity-40 pointer-events-none" />
          
          <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-between">
            <div>
              <div className="inline-block bg-background text-foreground font-heading font-extrabold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full border-2 border-border mb-6">
                DAILY PICK · {formattedDate}
              </div>
              <h3 className="font-heading font-extrabold text-5xl md:text-7xl mb-4 tracking-tighter">
                Try {platform.name}
              </h3>
              <p className="font-body font-bold text-xl md:text-2xl opacity-90 max-w-xl leading-relaxed">
                {platform.description}
              </p>
            </div>
            
            <div className="mt-10 inline-flex self-start items-center gap-3 font-heading font-extrabold text-xl bg-background text-foreground px-6 py-3 rounded-full border-2 border-border hard-shadow">
              Explore today 
              <motion.div variants={{ hover: { x: 6 } }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </div>
          </div>

          <div className="hidden md:flex w-1/3 relative z-10 items-center justify-center p-8 bg-black/10 border-l-4 border-border/20">
             <motion.div 
               variants={{ hover: { scale: 1.1, rotate: 12 } }}
               transition={{ type: "spring", stiffness: 300, damping: 20 }}
               className="text-background opacity-80"
             >
               <Sparkles className="w-48 h-48" />
             </motion.div>
          </div>
        </motion.a>
      </div>
    </div>
  );
}
