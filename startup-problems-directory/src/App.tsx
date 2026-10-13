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
import {
  CirclePageTransition,
  type TransitionOrigin,
} from "./components/CirclePageTransition";

type PageMode = "home" | "framework" | "evaluation";

interface ActiveTransition {
  fromPage: PageMode;
  toPage: PageMode;
  origin: TransitionOrigin;
}

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
  const [activeTransition, setActiveTransition] = useState<ActiveTransition | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setActiveTransition(null);
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
    setActiveTransition(null);
    window.history.pushState({ page: "home" }, "", "/");
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const navigateToFramework = (origin?: TransitionOrigin) => {
    if (currentPage === "evaluation") {
      const clickOrigin = origin || {
        x: typeof window !== "undefined" ? window.innerWidth / 2 : 700,
        y: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
      };
      window.history.pushState({ page: "framework" }, "", "/framework");
      setActiveTransition({
        fromPage: "evaluation",
        toPage: "framework",
        origin: clickOrigin,
      });
      return;
    }

    setActiveTransition(null);
    window.history.pushState({ page: "framework" }, "", "/framework");
    setCurrentPage("framework");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const navigateToEvaluation = (origin?: TransitionOrigin) => {
    const clickOrigin = origin || {
      x: typeof window !== "undefined" ? window.innerWidth / 2 : 700,
      y: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
    };

    window.history.pushState({ page: "evaluation" }, "", "/evaluation");
    setActiveTransition({
      fromPage: "framework",
      toPage: "evaluation",
      origin: clickOrigin,
    });
  };

  const handleTransitionComplete = () => {
    if (activeTransition) {
      setCurrentPage(activeTransition.toPage);
      setActiveTransition(null);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const renderPageComponent = (page: PageMode) => {
    switch (page) {
      case "evaluation":
        return (
          <StartupEvaluationPage
            onBack={navigateToHome}
            onBackToFramework={navigateToFramework}
          />
        );
      case "framework":
        return (
          <FrameworkPage
            onBack={navigateToHome}
            onExploreFramework={navigateToEvaluation}
          />
        );
      case "home":
      default:
        return (
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
        );
    }
  };

  return (
    <MotionConfig reducedMotion="never">
      {activeTransition ? (
        <CirclePageTransition
          origin={activeTransition.origin}
          outgoingContent={renderPageComponent(activeTransition.fromPage)}
          incomingContent={renderPageComponent(activeTransition.toPage)}
          onComplete={handleTransitionComplete}
        />
      ) : (
        renderPageComponent(currentPage)
      )}
    </MotionConfig>
  );
}

export default App;
