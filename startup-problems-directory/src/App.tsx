import { Ticker } from "./components/Ticker";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PlatformsSection } from "./components/PlatformsSection";
import { HowItWorks } from "./components/HowItWorks";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Ticker />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PlatformsSection />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
