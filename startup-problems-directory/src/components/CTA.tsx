import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  const scrollToTop = () => {
    const el = document.getElementById('platforms');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-background pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="bg-primary rounded-[3rem] p-12 md:p-24 border-4 border-border hard-shadow text-center relative overflow-hidden"
        >
          
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-heading font-extrabold tracking-tighter mb-8 leading-tight max-w-3xl mx-auto"
            >
              Your next startup might be hiding inside someone's problem.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl font-body font-bold text-foreground/90 mb-12 max-w-2xl mx-auto"
            >
              Start exploring. Find something painful. Talk to the people experiencing it.
            </motion.p>
            
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={scrollToTop}
              className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-5 rounded-full font-heading font-extrabold text-xl uppercase tracking-wider hard-shadow hard-shadow-hover cursor-pointer"
            >
              Explore the platforms <ArrowUp className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-32 h-32 bg-blue rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000" />
        </motion.div>
      </div>
    </section>
  );
}
