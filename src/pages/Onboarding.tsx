import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Users, Building2, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"creator" | "org" | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState([50]);

  const availableSkills = [
    "VFX", "3D Animation", "Motion Graphics", "Video Editing",
    "Sound Design", "Music Production", "UI/UX", "Illustration",
    "Photography", "Creative Direction", "Color Grading", "Compositing"
  ];

  const toggleSkill = (skill: string) => {
    setSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleComplete = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 animate-float">
              Sideway
            </h1>
            <p className="text-sm text-muted-foreground">On-chain Collaboration Network</p>
          </div>

          {/* Step 1: User Type */}
          {step === 1 && (
            <div className="glass-card rounded-3xl p-8 space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Welcome to Sideway</h2>
                <p className="text-sm text-muted-foreground">Choose your path</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setUserType("creator")}
                  className={`w-full p-6 rounded-2xl border-2 smooth-transition ${
                    userType === "creator"
                      ? "border-primary bg-primary/10 glow-primary"
                      : "border-white/10 hover:border-primary/50"
                  }`}
                >
                  <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-bold mb-1">Creator / DAO</h3>
                  <p className="text-xs text-muted-foreground">
                    Independent creator or decentralized collective
                  </p>
                </button>

                <button
                  onClick={() => setUserType("org")}
                  className={`w-full p-6 rounded-2xl border-2 smooth-transition ${
                    userType === "org"
                      ? "border-secondary bg-secondary/10 glow-secondary"
                      : "border-white/10 hover:border-secondary/50"
                  }`}
                >
                  <Building2 className="h-8 w-8 mx-auto mb-3 text-secondary" />
                  <h3 className="font-bold mb-1">Organization / Studio</h3>
                  <p className="text-xs text-muted-foreground">
                    Brand, agency, or production company
                  </p>
                </button>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!userType}
                className="w-full bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Skills & Rate */}
          {step === 2 && (
            <div className="glass-card rounded-3xl p-8 space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Your Skills</h2>
                <p className="text-sm text-muted-foreground">Select what you do best</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={skills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Hourly Rate (USD)
                  </label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={hourlyRate}
                      onValueChange={setHourlyRate}
                      max={500}
                      step={5}
                      className="flex-1"
                    />
                    <span className="font-mono font-bold w-16 text-right">
                      ${hourlyRate[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={skills.length === 0}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Claim CreatorCoin */}
          {step === 3 && (
            <div className="glass-card rounded-3xl p-8 space-y-6 animate-fade-in text-center">
              <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse-glow flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-white" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Claim Your CreatorCoin</h2>
                <p className="text-sm text-muted-foreground">
                  Your on-chain identity is ready to mint
                </p>
              </div>

              <div className="glass-card rounded-2xl p-4 space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Selected Skills</span>
                  <span className="font-bold">{skills.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hourly Rate</span>
                  <span className="font-mono font-bold">${hourlyRate[0]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">User Type</span>
                  <span className="font-bold capitalize">{userType}</span>
                </div>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                Mint CreatorCoin
              </Button>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full smooth-transition ${
                  s === step ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
