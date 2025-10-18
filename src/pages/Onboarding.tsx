import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Building2, Sparkles, Camera, Upload, Music, Film, Palette, PenTool, Code, Mic, FileText, Image, Dumbbell, Gamepad2 } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Onboarding = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [loginMethod, setLoginMethod] = useState<"zora" | "email" | null>(null);
  const [userType, setUserType] = useState<"indie" | "commercial" | null>(null);
  const [creativeDomains, setCreativeDomains] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("exploring");
  const [profileData, setProfileData] = useState({
    name: "",
    tagline: "",
    orgName: "",
    orgType: "",
  });

  const creativeDomainOptions = [
    { id: "film", label: "Film", subtitle: "Short films, Documentaries", icon: Film },
    { id: "music", label: "Music", subtitle: "Singer, Producer", icon: Music },
    { id: "dance", label: "Dance", subtitle: "Performer, Choreographer", icon: Dumbbell },
    { id: "photography", label: "Photography", subtitle: "Wildlife, Fashion", icon: Camera },
    { id: "fashion", label: "Fashion", subtitle: "Designer, Stylist", icon: Sparkles },
    { id: "comedy", label: "Comedy", subtitle: "Stand-up, Sketch artist", icon: Mic },
    { id: "visual", label: "Visual Arts", subtitle: "Painter, Illustrator", icon: Palette },
    { id: "writing", label: "Writing", subtitle: "Screenwriter, Poet", icon: PenTool },
    { id: "crafts", label: "Crafts & DIY", subtitle: "Makers, Builders", icon: Building2 },
    { id: "digital", label: "Digital Creators", subtitle: "Streamers, Meme-makers", icon: Gamepad2 },
  ];

  const toggleDomain = (domain: string) => {
    setCreativeDomains(prev => 
      prev.includes(domain) 
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const handleComplete = () => {
    // Simulate minting animation delay
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-2xl space-y-8">
          {/* Logo */}
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 animate-float">
              Sideway
            </h1>
            <p className="text-sm text-muted-foreground">On-chain Collaboration Network</p>
          </div>

          {/* Page 1: Welcome / Vision Intro */}
          {page === 1 && (
            <div className="glass-card rounded-3xl p-8 md:p-12 space-y-8 animate-fade-in text-center">
              <div className="relative h-32 w-32 mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse-glow opacity-50 blur-xl" />
                <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-float">
                  <Sparkles className="h-16 w-16 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold">Where careers don't need cubicles</h2>
              </div>

              <div className="grid gap-6 text-left">
                <div className="flex gap-4">
                  <div className="text-2xl">1️⃣</div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Connect with your tribe</h3>
                    <p className="text-sm text-muted-foreground">Find like-minded creators, storytellers, designers, and doers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl">2️⃣</div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Collaborate on your next big thing</h3>
                    <p className="text-sm text-muted-foreground">Credit each other. Build together. Grow faster.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl">3️⃣</div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Find gigs & opportunities</h3>
                    <p className="text-sm text-muted-foreground">Apply to paid projects or get discovered by studios & brands.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl">4️⃣</div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Build your creative reputation</h3>
                    <p className="text-sm text-muted-foreground">Earn endorsements, show off your portfolio, and get verified with on-chain cred.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => {
                    setLoginMethod("zora");
                    setPage(2);
                  }}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                  size="lg"
                >
                  Login with Zora
                </Button>
                <Button
                  onClick={() => {
                    setLoginMethod("email");
                    setPage(2);
                  }}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Login with Email
                </Button>
              </div>
            </div>
          )}

          {/* Page 2: Login Flow - Email */}
          {page === 2 && loginMethod === "email" && (
            <div className="glass-card rounded-3xl p-8 space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Mint Your Creator Coin</h2>
                <p className="text-sm text-muted-foreground">Think of this as your creative business card — and your on-chain identity.</p>
              </div>

              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary smooth-transition">
                      <Camera className="h-12 w-12 text-muted-foreground group-hover:text-primary smooth-transition" />
                    </div>
                    <div className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center cursor-pointer">
                      <Upload className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Banner Upload */}
                <div className="relative h-24 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary smooth-transition group">
                  <div className="text-center">
                    <Image className="h-8 w-8 mx-auto mb-1 text-muted-foreground group-hover:text-primary smooth-transition" />
                    <p className="text-xs text-muted-foreground">Upload banner (optional)</p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    placeholder="Your name or artist name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>

                {/* Tagline */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tagline</label>
                  <Input
                    placeholder="What you do in one line (60 chars max)"
                    maxLength={60}
                    value={profileData.tagline}
                    onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                  />
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {["gigs", "collabs", "exploring"].map((s) => (
                      <Badge
                        key={s}
                        variant={status === s ? "default" : "outline"}
                        className="cursor-pointer px-4 py-2 capitalize"
                        onClick={() => setStatus(s)}
                      >
                        {s === "gigs" ? "Open to Gigs" : s === "collabs" ? "Open to Collabs" : "Just Exploring"}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setPage(3)}
                disabled={!profileData.name || !profileData.tagline}
                className="w-full bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                Mint Creator Coin & Continue
              </Button>
            </div>
          )}

          {/* Page 2: Login Flow - Zora */}
          {page === 2 && loginMethod === "zora" && (
            <div className="glass-card rounded-3xl p-8 space-y-6 animate-fade-in text-center">
              <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse-glow flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-white animate-spin" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Connecting your Zora wallet...</h2>
                <p className="text-sm text-muted-foreground">Syncing your on-chain identity</p>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary" />
                  <div>
                    <h3 className="font-bold">Dharma.eth</h3>
                    <p className="text-xs text-muted-foreground">Creator Coin detected</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-bold">$12,450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">24h Change</span>
                  <span className="font-bold text-green-400">+12.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Posts Minted</span>
                  <span className="font-bold">42</span>
                </div>
              </div>

              <Button
                onClick={() => setPage(3)}
                className="w-full bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                Sync to Sideway Profile
              </Button>
            </div>
          )}

          {/* Page 3: Choose Your Persona */}
          {page === 3 && (
            <div className="glass-card rounded-3xl p-8 space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Who are you creating as?</h2>
                <p className="text-sm text-muted-foreground">This sets up your workspace and feed experience.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setUserType("indie")}
                  className={`p-6 rounded-2xl border-2 smooth-transition text-left ${
                    userType === "indie"
                      ? "border-primary bg-primary/10 glow-primary"
                      : "border-white/10 hover:border-primary/50"
                  }`}
                >
                  <Users className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="font-bold text-lg mb-2">🧍‍🎨 Independent Creator</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Musicians, filmmakers, designers, photographers, writers, dancers…
                  </p>
                  <span className="text-sm font-medium text-primary">Select →</span>
                </button>

                <button
                  onClick={() => setUserType("commercial")}
                  className={`p-6 rounded-2xl border-2 smooth-transition text-left ${
                    userType === "commercial"
                      ? "border-secondary bg-secondary/10 glow-secondary"
                      : "border-white/10 hover:border-secondary/50"
                  }`}
                >
                  <Building2 className="h-10 w-10 mb-4 text-secondary" />
                  <h3 className="font-bold text-lg mb-2">🏢 Commercial Creator</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Studios, labels, agencies, production houses, creative DAOs…
                  </p>
                  <span className="text-sm font-medium text-secondary">Select →</span>
                </button>
              </div>

              <Button
                onClick={() => setPage(4)}
                disabled={!userType}
                className="w-full bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Page 4A: Define Creative Identity (Indies) */}
          {page === 4 && userType === "indie" && (
            <div className="glass-card rounded-3xl p-8 space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Define Your Creative Identity</h2>
                <p className="text-sm text-muted-foreground">Select your creative domains to establish your profile.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {creativeDomainOptions.map((domain) => {
                  const Icon = domain.icon;
                  return (
                    <button
                      key={domain.id}
                      onClick={() => toggleDomain(domain.id)}
                      className={`p-4 rounded-xl border-2 smooth-transition text-left ${
                        creativeDomains.includes(domain.id)
                          ? "border-primary bg-primary/10 glow-primary"
                          : "border-white/10 hover:border-primary/30"
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${creativeDomains.includes(domain.id) ? "text-primary" : "text-muted-foreground"}`} />
                      <h3 className="font-bold text-sm mb-1">{domain.label}</h3>
                      <p className="text-xs text-muted-foreground">{domain.subtitle}</p>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={() => setPage(5)}
                disabled={creativeDomains.length === 0}
                className="w-full bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                Next: Enter Your Orbit
              </Button>
            </div>
          )}

          {/* Page 4B: Define Organization (Commercial) */}
          {page === 4 && userType === "commercial" && (
            <div className="glass-card rounded-3xl p-8 space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Define Your Organization</h2>
                <p className="text-sm text-muted-foreground">Let's set up your creative house.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Organization Name</label>
                  <Input
                    placeholder="Your studio or company name"
                    value={profileData.orgName}
                    onChange={(e) => setProfileData({ ...profileData, orgName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Organization Type</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={profileData.orgType}
                    onChange={(e) => setProfileData({ ...profileData, orgType: e.target.value })}
                  >
                    <option value="">Select type...</option>
                    <option value="production">Production House</option>
                    <option value="agency">Media Agency</option>
                    <option value="label">Music Label</option>
                    <option value="dao">DAO</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Upload Logo</label>
                  <div className="relative h-32 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary smooth-transition group">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-1 text-muted-foreground group-hover:text-primary smooth-transition" />
                      <p className="text-xs text-muted-foreground">Click to upload logo</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Primary Creative Domains</label>
                  <div className="flex flex-wrap gap-2">
                    {creativeDomainOptions.slice(0, 6).map((domain) => (
                      <Badge
                        key={domain.id}
                        variant={creativeDomains.includes(domain.id) ? "default" : "outline"}
                        className="cursor-pointer px-3 py-1"
                        onClick={() => toggleDomain(domain.id)}
                      >
                        {domain.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Website (optional)</label>
                  <Input
                    placeholder="https://yourwebsite.com"
                    type="url"
                  />
                </div>
              </div>

              <Button
                onClick={() => setPage(5)}
                disabled={!profileData.orgName || !profileData.orgType}
                className="w-full bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                Next: Enter Your Orbit
              </Button>
            </div>
          )}

          {/* Page 5: Orbit Overview */}
          {page === 5 && (
            <div className="glass-card rounded-3xl p-8 md:p-12 space-y-8 animate-fade-in text-center">
              <div className="relative h-48 w-48 mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse-glow opacity-30 blur-2xl" />
                <div className="relative h-48 w-48 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-float">
                  <Sparkles className="h-20 w-20 text-white" />
                </div>
                {/* Orbiting placeholders */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border-2 border-primary/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary/40" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-6 w-6 rounded-full bg-secondary/40" />
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-primary/30" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold">You're in the Sideway Network.</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Every idea you mint from here carries your credit forever.
                </p>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                Enter Dashboard →
              </Button>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((p) => (
              <div
                key={p}
                className={`h-2 rounded-full smooth-transition ${
                  p === page ? "w-8 bg-primary" : "w-2 bg-muted"
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
