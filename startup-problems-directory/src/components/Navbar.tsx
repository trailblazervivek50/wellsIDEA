import { Lightbulb } from "lucide-react";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      animate={{ 
        height: scrolled ? 64 : 80,
        borderBottomWidth: scrolled ? 4 : 2
      }}
      initial={{ height: 80, borderBottomWidth: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="bg-background border-border sticky top-0 z-40 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-md border-2 border-border hard-shadow transform -rotate-3">
            <Lightbulb className="w-5 h-5 text-border" strokeWidth={3} />
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tighter">PROBLEM / FINDER</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-heading font-extrabold text-sm uppercase tracking-wider">
          <button onClick={() => scrollTo('platforms')} className="hover:text-blue transition-colors">Platforms</button>
          <button onClick={() => scrollTo('how-it-works')} className="hover:text-pink transition-colors">How it works</button>
        </div>

        <button 
          onClick={() => scrollTo('platforms')}
          className={cn(
            "bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-heading font-extrabold text-sm uppercase tracking-wider",
            "hard-shadow hard-shadow-hover cursor-pointer"
          )}
        >
          Explore platforms
        </button>
      </div>
    </motion.nav>
  );
}
