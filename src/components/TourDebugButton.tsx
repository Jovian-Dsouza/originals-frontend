import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function TourDebugButton() {
  const handleReset = () => {
    localStorage.removeItem("originals-tour-completed");
    sessionStorage.setItem("from-onboarding", "true");
    window.location.href = "/";
  };

  return (
    <Button
      onClick={handleReset}
      variant="outline"
      size="sm"
      className="fixed bottom-4 left-4 z-50 opacity-50 hover:opacity-100"
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      Test Tour
    </Button>
  );
}
