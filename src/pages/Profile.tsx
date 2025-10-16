import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Verified, TrendingUp, Briefcase } from "lucide-react";

const Profile = () => {
  const skills = ["VFX", "3D Animation", "Motion Graphics", "Color Grading"];
  
  const stats = [
    { label: "CC Price", value: "0.08 ETH", change: "+12%" },
    { label: "Projects", value: "24", change: "+3" },
    { label: "Collabs", value: "47", change: "+8" },
  ];

  return (
    <div className="min-h-screen pb-24">
      <header className="glass-card border-b border-white/10">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Profile Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse-glow" />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                <Verified className="h-4 w-4 text-background" />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Dharma</h2>
              <p className="text-sm text-muted-foreground mb-3">
                CreatorCoin Holder • Available for Collabs
              </p>
              <div className="flex gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-xl font-bold font-mono mb-1">{stat.value}</p>
                <p className="text-xs text-secondary">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto p-4">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="collabs">Collabs</TabsTrigger>
            <TabsTrigger value="proofs">Proofs</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">Project Title {i}</h3>
                  <p className="text-sm text-muted-foreground">Published • 234 likes</p>
                </div>
                <Badge>Live</Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="collabs" className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">Collaboration {i}</h3>
                  <p className="text-sm text-muted-foreground">15% share • Active</p>
                </div>
                <Badge variant="secondary">In Progress</Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="proofs" className="text-center py-12">
            <div className="glass-card rounded-2xl p-12">
              <Verified className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-bold text-lg mb-2">CollabProofs</h3>
              <p className="text-sm text-muted-foreground">
                Your verified collaboration history will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
