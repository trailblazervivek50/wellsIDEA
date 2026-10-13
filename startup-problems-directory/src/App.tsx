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
import { StartupEvaluationPage } from "./components/StartupEvaluationPage";

type PageMode = "home" | "framework" | "evaluation";

function getInitialPage(): PageMode {
  const path = window.location.pathname.replace(/\/+$/, "");
  const hash = window.location.hash;

  if (
    path === "/evaluation" ||
    hash === "#/evaluation" ||
    hash === "#evaluation"
  ) {
    return "evaluation";
  }

  if (
    path === "/framework" ||
    hash === "#/framework" ||
    hash === "#framework"
  ) {
    return "framework";
  }

  return "home";
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageMode>(() => getInitialPage());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const navigateToHome = () => {
    window.history.pushState({ page: "home" }, "", "/");
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const navigateToFramework = () => {
    window.history.pushState({ page: "framework" }, "", "/framework");
    setCurrentPage("framework");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const navigateToEvaluation = () => {
    window.history.pushState({ page: "evaluation" }, "", "/evaluation");
    setCurrentPage("evaluation");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <MotionConfig reducedMotion="never">
      {currentPage === "evaluation" ? (
        <StartupEvaluationPage
          onBack={navigateToHome}
          onBackToFramework={navigateToFramework}
        />
      ) : currentPage === "framework" ? (
        <FrameworkPage
          onBack={navigateToHome}
          onExploreFramework={navigateToEvaluation}
        />
      ) : (
        <div className="min-h-screen flex flex-col">
          <Ticker />
          <Navbar onExploreFramework={navigateToFramework} />
          <main className="flex-1">
            <Hero onExploreFramework={navigateToFramework} />
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
