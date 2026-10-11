import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Ticker } from "./components/Ticker";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PlatformsSection } from "./components/PlatformsSection";
import { HowItWorks } from "./components/HowItWorks";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { FrameworkPage } from "./components/FrameworkPage";

function isFrameworkLocation(): boolean {
  const path = window.location.pathname.replace(/\/+$/, "");
  const hash = window.location.hash;
  return (
    path === "/framework" ||
    hash === "#/framework" ||
    hash === "#framework"
  );
}

function App() {
  const [showFramework, setShowFramework] = useState<boolean>(() =>
    isFrameworkLocation()
  );

  useEffect(() => {
    const handlePopState = () => {
      setShowFramework(isFrameworkLocation());
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const navigateToFramework = () => {
    window.history.pushState({ page: "framework" }, "", "/framework");
    setShowFramework(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const navigateToHome = () => {
    window.history.pushState({ page: "home" }, "", "/");
    setShowFramework(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <MotionConfig reducedMotion="never">
      {showFramework ? (
        <FrameworkPage onBack={navigateToHome} />
      ) : (
        <div className="min-h-screen flex flex-col">
          <Ticker />
          <Navbar onExploreFramework={navigateToFramework} />
          <main className="flex-1">
            <Hero />
            <PlatformsSection />
            <HowItWorks />
            <CTA />
          </main>
          <Footer />
        </div>
      )}
    </MotionConfig>
  );
}

export default App;
