import { WaveDivider } from "./WaveDivider";
import { Sticker } from "./Sticker";
import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Browse",
      desc: "Find recurring problems and pain points."
    },
    {
      id: "02",
      title: "Validate",
      desc: "Talk to the people experiencing the problem."
    },
    {
      id: "03",
      title: "Build",
      desc: "Create a solution only after understanding the problem."
    }
  ];

  return (
    <section id="how-it-works" className="bg-blue relative pt-32 pb-32">
      <WaveDivider color="var(--blue)" position="top" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        <div className="text-center max-w-4xl mx-auto mb-24 relative">
          <Sticker text="BUILD SECOND" color="pink" rotation={-5} className="-top-12 left-0 md:left-12" />
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter text-background mb-8 leading-tight text-shadow-hard"
          >
            Don't start with the idea.<br/>Start with the problem.
          </motion.h2>
          <Sticker text="FIND THE PAIN" color="yellow" rotation={8} className="bottom-0 right-0 md:right-12" delay={0.2} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-background rounded-3xl p-10 border-4 border-border hard-shadow"
            >
              <span className="inline-block bg-primary text-foreground font-heading font-extrabold text-2xl px-4 py-2 rounded-full border-2 border-border mb-6 transform -rotate-3">
                {step.id}
              </span>
              <h3 className="font-heading font-extrabold text-4xl mb-4">{step.title}</h3>
              <p className="font-body font-bold text-xl opacity-90">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <WaveDivider color="var(--background)" position="bottom" />
    </section>
  );
}
