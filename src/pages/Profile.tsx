import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Verified, CheckCircle2, Clock } from "lucide-react";

const Profile = () => {
  const skills = ["VFX", "3D Animation", "Motion Graphics", "Color Grading"];
  
  const stats = [
    { label: "CC Price", value: "0.08 ETH", change: "+12%" },
    { label: "Projects", value: "24", change: "+3" },
    { label: "Collabs", value: "47", change: "+8" },
  ];

  const finalPosts = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
      likes: 234,
      comments: 45,
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
      likes: 567,
      comments: 89,
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400",
      likes: 892,
      comments: 123,
    },
    {
      id: "4",
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      likes: 445,
      comments: 67,
    },
    {
      id: "5",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      likes: 678,
      comments: 91,
    },
    {
      id: "6",
      imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
      likes: 523,
      comments: 78,
    },
  ];

  const activePosts = [
    {
      id: "1",
      title: "Urban Soundscape",
      collaborators: ["Alex", "Jordan", "Casey"],
      status: "In Progress",
      progress: 65,
    },
    {
      id: "2",
      title: "Digital Dreams",
      collaborators: ["Taylor", "Morgan"],
      status: "Waiting",
      progress: 30,
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-background">
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
              <div className="flex gap-2 flex-wrap">
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
        <Tabs defaultValue="final" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="final">Final Posts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="professional">Pro</TabsTrigger>
          </TabsList>

          {/* Tab 1: Instagram-style grid of final posts */}
          <TabsContent value="final">
            <div className="grid grid-cols-3 gap-1">
              {finalPosts.map((post) => (
                <div key={post.id} className="aspect-square relative group cursor-pointer">
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center gap-4 text-white">
                    <span className="flex items-center gap-1 text-sm font-bold">
                      ❤️ {post.likes}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold">
                      💬 {post.comments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: Active posts with collaborators */}
          <TabsContent value="active" className="space-y-4">
            {activePosts.map((post) => (
              <div key={post.id} className="glass-card rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <Badge variant={post.status === "In Progress" ? "default" : "outline"}>
                    {post.status}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Collaborators:</p>
                  <div className="flex gap-2 flex-wrap">
                    {post.collaborators.map((name) => (
                      <Badge key={name} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-mono font-bold">{post.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${post.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Tab 3: Professional profile */}
          <TabsContent value="professional" className="space-y-6">
            {/* Zora Profile Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider">
                Zora Profile
              </h3>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary" />
                  <div>
                    <p className="font-bold">dharma.zora</p>
                    <p className="text-sm text-muted-foreground">Verified Creator</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View on Zora
                </Button>
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider">
                Skills & Rates
              </h3>
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="text-2xl font-bold font-mono">$150/hr</p>
                </div>
              </div>
            </div>

            {/* Ongoing Collaborations */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider">
                Ongoing Collaborations
              </h3>
              <div className="glass-card rounded-2xl p-6 space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Clock className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">Project {i}</p>
                      <p className="text-xs text-muted-foreground">15% share • Active</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Collaborations */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider">
                Completed Collaborations
              </h3>
              <div className="glass-card rounded-2xl p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">Collaboration {i}</p>
                      <p className="text-xs text-muted-foreground">12% share • Completed</p>
                    </div>
                    <Verified className="h-4 w-4 text-secondary" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
