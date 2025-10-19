import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface TourStep {
  title: string;
  body: string;
  cta: string;
  position: "center" | "bottom";
  targetRoute?: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to the Originals.",
    body: "Every post here is credited and verified.\nWatch Behind the Scenes and Final Creations from real creators — no reposts, no noise.",
    cta: "Explore the Feed →",
    position: "center",
    targetRoute: "/",
  },
  {
    title: "Where ideas collab",
    body: "Swipe through open collaborations from indie creators and production houses.\nJoin something bigger — your next credit could start here.",
    cta: "Find a Collab →",
    position: "center",
    targetRoute: "/collab",
  },
  {
    title: "Post an Idea. Mint a Movement.",
    body: "Drop your next project idea, invite collaborators, and set your own terms.\nEvery post becomes a PostCoin — a living creative contract.",
    cta: "Create Now →",
    position: "bottom",
    targetRoute: "/collab",
  },
  {
    title: "Your Creative Proof.",
    body: "This isn't a portfolio — it's your on-chain résumé.\nEvery collab, every credit, every role — verified forever.",
    cta: "View My Proof →",
    position: "center",
    targetRoute: "/profile",
  },
];

export function GuidedTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user just completed onboarding
    const checkTour = () => {
      const tourCompleted = localStorage.getItem("originals-tour-completed");
      const fromOnboarding = sessionStorage.getItem("from-onboarding");
      
      if (fromOnboarding === "true" && !tourCompleted) {
        setIsActive(true);
        sessionStorage.removeItem("from-onboarding");
      }
    };

    // Check immediately
    checkTour();

    // Also check after a short delay (in case navigation is still happening)
    const timeout = setTimeout(checkTour, 100);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Navigate to the target route if specified
      const step = tourSteps[nextStep];
      if (step.targetRoute && location.pathname !== step.targetRoute) {
        navigate(step.targetRoute);
      }
    } else {
      completeTour();
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  const completeTour = () => {
    setIsActive(false);
    localStorage.setItem("originals-tour-completed", "true");
    
    toast({
      title: "You now know the map.",
      description: "Time to make your mark.",
      duration: 4000,
    });
  };

  if (!isActive) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in" />

      {/* Tooltip Card */}
      <div
        className={`fixed z-50 w-[90vw] max-w-md animate-scale-in ${
          step.position === "center"
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            : "bottom-24 left-1/2 -translate-x-1/2"
        }`}
      >
        <div className="glass-card rounded-3xl p-8 space-y-6 relative overflow-hidden border-2 border-primary/30">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 smooth-transition"
            aria-label="Skip tour"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">{step.title}</h2>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {step.body}
            </p>

            {currentStep === 3 && (
              <p className="text-xs text-primary italic">
                "Likes fade. Credits don't."
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex gap-1.5">
              {tourSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full smooth-transition ${
                    idx === currentStep ? "w-8 bg-primary" : "w-1.5 bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              {step.cta}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default GuidedTour;
