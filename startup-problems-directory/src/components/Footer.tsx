export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-foreground text-background pt-24 pb-12 overflow-hidden border-t-4 border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 border-b-2 border-background/20 pb-16">
          <div className="font-heading font-extrabold text-[clamp(40px,8vw,120px)] leading-none tracking-tighter text-primary whitespace-nowrap transform -rotate-2">
            FIND THE PROBLEM.
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 font-heading font-extrabold text-sm uppercase tracking-wider">
            <button onClick={() => scrollTo('platforms')} className="hover:text-primary transition-colors">Platforms</button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-primary transition-colors">How it works</button>
            <a href="#" className="hover:text-primary transition-colors">About</a>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2 font-body font-bold text-background/60 text-sm">
            <p>A simple directory for startup problem discovery.</p>
            <p>© {new Date().getFullYear()}</p>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
