import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Verified, CheckCircle2, Clock, LogOut, Copy } from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect } from "react";

const Profile = () => {
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const skills = ["VFX", "3D Animation", "Motion Graphics", "Color Grading"];

  useEffect(() => {
    console.log('Privy User:', user);
    console.log('Privy Wallets:', wallets);
    
    // Print wallet addresses specifically
    if (wallets && wallets.length > 0) {
      console.log('Wallet Addresses:');
      wallets.forEach((wallet, index) => {
        console.log(`Wallet ${index + 1}:`, {
          address: wallet.address,
          walletClientType: wallet.walletClientType,
          chainId: wallet.chainId
        });
      });
    } else {
      console.log('No wallets connected');
      // If user is authenticated via email but has no wallets, try to create one
      if (user?.email?.address && !user?.wallet?.address) {
        console.log('User authenticated via email but no wallet found. Embedded wallet should be created automatically.');
      }
    }
    
    // Print email if available
    if (user?.email?.address) {
      console.log('Email Address:', user.email.address);
    }
    
    // Print wallet info from user object
    if (user?.wallet?.address) {
      console.log('User Wallet Address:', user.wallet.address);
    }
  }, [user, wallets]);


  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  const stats = [
    { label: "CC Market Cap", value: "250k $", change: "+12%" },
    { label: "Content", value: "24", change: "+3" },
    { label: "Gigs", value: "47", change: "+8" },
  ];

  const finalPosts = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
      marketCap: 234,
      marketCapChange: "up",
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
      marketCap: 567,
      marketCapChange: "down",
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400",
      marketCap: 892,
      marketCapChange: "up",
    },
    {
      id: "4",
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      marketCap: 445,
      marketCapChange: "up",
    },
    {
      id: "5",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      marketCap: 678,
      marketCapChange: "down",
    },
    {
      id: "6",
      imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
      marketCap: 523,
      marketCapChange: "up",
    },
  ];

  // Startups (Self-initiated projects)
  const myStartups = [
    {
      id: "1",
      title: "Neon Dream VFX",
      role: "VFX Artist",
      openings: 2,
      pings: 15,
      status: "Active",
    },
    {
      id: "2",
      title: "Cyber Beats Mix",
      role: "Producer",
      openings: 1,
      pings: 8,
      status: "Active",
    },
  ];

  // Ongoing collabs
  const ongoingCollabs = [
    {
      id: "1",
      project: "Urban Soundscape",
      posterName: "Alex Chen",
      posterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      posterType: "Indie Creator",
      type: "Part-time",
      duration: "Mar 2024 - Present",
      description: "Creating immersive soundscapes for urban documentary series",
      isSelfInitiated: false,
    },
    {
      id: "2",
      project: "Digital Dreams",
      posterName: "Jordan Blake",
      posterAvatar: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
      posterType: "Organization",
      type: "One-time",
      duration: "Feb 2024 - Present",
      description: "Animation work for branded content campaign",
      isSelfInitiated: false,
    },
    {
      id: "3",
      project: "Neon Empire",
      posterName: "Dharma (Self)",
      posterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
      posterType: "Self-Initiated",
      type: "Full-time",
      duration: "Jan 2024 - Present",
      description: "Cyberpunk-themed short film production",
      isSelfInitiated: true,
    },
  ];

  // Completed collabs
  const completedCollabs = [
    {
      id: "1",
      project: "Retro Vibes",
      posterName: "Taylor Swift",
      posterAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      posterType: "Indie Creator",
      type: "Full-time",
      duration: "Oct 2023 - Dec 2023",
      description: "VFX work for music video production",
      isSelfInitiated: false,
    },
    {
      id: "2",
      project: "Night City",
      posterName: "Morgan Lee",
      posterAvatar: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop",
      posterType: "Organization",
      type: "Hourly",
      duration: "Sep 2023 - Nov 2023",
      description: "Compositing for commercial advertising campaign",
      isSelfInitiated: false,
    },
    {
      id: "3",
      project: "Cosmic Dreams",
      posterName: "Dharma (Self)",
      posterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
      posterType: "Self-Initiated",
      type: "Part-time",
      duration: "Jul 2023 - Sep 2023",
      description: "Experimental 3D art series",
      isSelfInitiated: true,
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-background">
      <header className="glass-card border-b border-white/10">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
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
              <h2 className="text-2xl font-bold mb-1">
                {user?.email?.address || user?.wallet?.address ? 
                  (user.email?.address || `${wallets[0]?.address.slice(0, 6)}...${wallets[0]?.address.slice(-4)}`) : 
                  "Dharma"
                }
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                {user?.email?.address ? "Email Authenticated" : "Wallet Connected"} • Available for Collabs
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
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="professional">Pro</TabsTrigger>
          </TabsList>

          {/* Tab 1: Content (Final posts) */}
          <TabsContent value="content">
            <div className="grid grid-cols-3 gap-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {finalPosts.map((post) => (
                <div key={post.id} className="aspect-square relative group cursor-pointer">
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center text-white">
                    <div className={`text-lg font-bold ${post.marketCapChange === "up" ? "text-green-500" : "text-red-500"}`}>
                      ${post.marketCap}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Tab 3: Professional profile */}
          <TabsContent value="professional" className="space-y-6">
            {/* Wallet Information Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider">
                Wallet Information
              </h3>
              <div className="glass-card rounded-2xl p-6 space-y-4">
                {wallets.length > 0 ? (
                  wallets.map((wallet, index) => (
                    <div key={wallet.address} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
                        <div>
                          <p className="font-bold text-sm">{wallet.walletClientType}</p>
                          <p className="text-xs text-muted-foreground">
                            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(wallet.address)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No wallet connected</p>
                  </div>
                )}
                {user?.email?.address && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary to-primary" />
                      <div>
                        <p className="font-bold text-sm">Email</p>
                        <p className="text-xs text-muted-foreground">{user.email.address}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(user.email.address)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider">
                Skills
              </h3>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex gap-2 flex-wrap">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Ongoing Collabs */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider">
                Ongoing Collabs
              </h3>
              <div className="glass-card rounded-2xl p-6 space-y-6">
                {ongoingCollabs.map((collab) => (
                  <div key={collab.id} className="flex gap-4 pb-6 border-b border-white/10 last:border-b-0 last:pb-0">
                    {/* Left side: Creator info */}
                    <div className="flex-shrink-0 w-24">
                      <div className={`h-16 w-16 ${collab.posterType === 'Organization' ? 'rounded-lg' : 'rounded-full'} bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden border-2 border-primary/20`}>
                        <img src={collab.posterAvatar} alt={collab.posterName} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-bold mt-2 leading-tight">{collab.posterName}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{collab.posterType}</p>
                    </div>
                    
                    {/* Right side: Project details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base mb-1">{collab.project}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{collab.duration}</p>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{collab.description}</p>
                      <Badge variant="secondary" className="text-xs">{collab.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Collabs */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider">
                Completed Collabs
              </h3>
              <div className="glass-card rounded-2xl p-6 space-y-6">
                {completedCollabs.map((collab) => (
                  <div key={collab.id} className="flex gap-4 pb-6 border-b border-white/10 last:border-b-0 last:pb-0">
                    {/* Left side: Creator info */}
                    <div className="flex-shrink-0 w-24">
                      <div className={`h-16 w-16 ${collab.posterType === 'Organization' ? 'rounded-lg' : 'rounded-full'} bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden border-2 border-primary/20`}>
                        <img src={collab.posterAvatar} alt={collab.posterName} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-bold mt-2 leading-tight">{collab.posterName}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{collab.posterType}</p>
                    </div>
                    
                    {/* Right side: Project details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base mb-1">{collab.project}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{collab.duration}</p>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{collab.description}</p>
                      <Badge variant="secondary" className="text-xs">{collab.type}</Badge>
                    </div>
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
