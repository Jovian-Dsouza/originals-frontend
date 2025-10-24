import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Verified, CheckCircle2, Clock, LogOut, Copy } from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { getProfile, getProfileCoins } from "@zoralabs/coins-sdk";
import { useWallet } from "@/contexts/WalletContext";
import { userService } from "@/services/user.service";
import type { UserProfile } from "@/types/user";

const Profile = () => {
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const { zoraWallet } = useWallet();

  // Zora profile state
  const [profileData, setProfileData] = useState<any>(null);
  const [profileCoins, setProfileCoins] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User profile state from onboarding API
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProfileLoading, setUserProfileLoading] = useState(false);



  // Fetch Zora profile and coins data
  useEffect(() => {
    const fetchZoraData = async () => {
      if (!user?.linkedAccounts || user.linkedAccounts.length === 0) {
        setError("No Zora wallet connected");
        return;
      }

      const crossAppAccount = user.linkedAccounts.find(account => account.type === 'cross_app');
      if (!crossAppAccount?.smartWallets || crossAppAccount.smartWallets.length === 0) {
        setError("No Zora wallet found");
        return;
      }

      const zoraWalletAddress = crossAppAccount.smartWallets[0].address;
      setLoading(true);
      setError(null);

      try {
        // Fetch profile data
        const profileResponse = await getProfile({
          identifier: zoraWalletAddress,
        });

        // Fetch profile coins
        const coinsResponse = await getProfileCoins({
          identifier: zoraWalletAddress,
          count: 20,
        });

        setProfileData(profileResponse?.data?.profile);
        setProfileCoins(coinsResponse?.data?.profile);
      } catch (err) {
        console.error('Error fetching Zora data:', err);
        setError("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchZoraData();
  }, [user]);

  // Fetch user profile data from onboarding API
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!zoraWallet) return;
      
      setUserProfileLoading(true);
      try {
        console.log('Fetching user profile for wallet:', zoraWallet);
        const response = await userService.checkOnboardingStatus(zoraWallet);
        
        if (response.isOnboarded && response.data) {
          setUserProfile(response.data);
          console.log('User profile loaded:', response.data);
        } else {
          console.log('User not onboarded or no profile data');
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUserProfile(null);
      } finally {
        setUserProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [zoraWallet]);


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
  
  // Dynamic stats based on Zora data and user profile
  const stats = [
    { 
      label: "CC Market Cap", 
      value: loading ? "..." : profileData?.creatorCoin?.marketCap ? 
        `$${parseFloat(profileData.creatorCoin.marketCap).toLocaleString()}` : 
        "N/A", 
      change: loading ? "..." : profileData?.creatorCoin?.marketCapDelta24h ? 
        `${parseFloat(profileData.creatorCoin.marketCapDelta24h) >= 0 ? '+' : ''}${(parseFloat(profileData.creatorCoin.marketCapDelta24h) * 100).toFixed(1)}%` : 
        "N/A" 
    },
    { 
      label: "Content", 
      value: loading ? "..." : profileCoins?.createdCoins?.count?.toString() || "0", 
      change: "+0" // Not available in Zora SDK
    },
    { 
      label: "Collabs", 
      value: userProfileLoading ? "..." : userProfile?.profileData?.collabCount?.toString() || "0",
      change: userProfileLoading ? "..." : userProfile?.profileData?.deltaCollabs ? 
        `${userProfile.profileData.deltaCollabs >= 0 ? '+' : ''}${userProfile.profileData.deltaCollabs}` : 
        "+0"
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
              {loading ? (
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
              ) : profileData?.avatar?.medium ? (
                <img 
                  src={profileData.avatar.medium} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse-glow" />
              )}
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                <Verified className="h-4 w-4 text-background" />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {loading ? (
                  <div className="h-8 w-32 bg-muted animate-pulse rounded" />
                ) : profileData?.displayName || profileData?.handle ? (
                  profileData.displayName || profileData.handle
                ) : user?.email?.address || user?.wallet?.address ? (
                  user.email?.address || `${wallets[0]?.address.slice(0, 6)}...${wallets[0]?.address.slice(-4)}`
                ) : (
                  "Dharma"
                )}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                {loading ? (
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                ) : profileData?.bio ? (
                  profileData.bio
                ) : user?.email?.address ? (
                  "Email Authenticated • Available for Collabs"
                ) : (
                  "Wallet Connected • Available for Collabs"
                )}
              </p>
              <div className="flex gap-2 flex-wrap">
                {userProfileLoading ? (
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-14 bg-muted animate-pulse rounded" />
                  </div>
                ) : (
                  <>
                    {(userProfile?.profileData?.skills || []).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {(!userProfile?.profileData?.skills || userProfile.profileData.skills.length === 0) && (
                      <p className="text-sm text-muted-foreground">No skills added yet</p>
                    )}
                  </>
                )}
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

          {/* Tab 1: Content (Profile coins) */}
          <TabsContent value="content">
            {loading ? (
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="aspect-square bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">{error}</p>
                <p className="text-sm text-muted-foreground">
                  {error.includes("wallet") ? "Connect your Zora wallet to view your profile" : "Create your Zora profile to get started"}
                </p>
              </div>
            ) : !profileCoins?.createdCoins?.edges || profileCoins.createdCoins.edges.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No content created yet</p>
                <p className="text-sm text-muted-foreground">Start creating!</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {profileCoins.createdCoins.edges.map((edge: any, index: number) => {
                  const coin = edge.node;
                  const marketCapChange = coin.marketCapDelta24h ? 
                    (parseFloat(coin.marketCapDelta24h) >= 0 ? "up" : "down") : "up";
                  
                  return (
                    <div key={coin.id || index} className="aspect-square relative group cursor-pointer">
                      {coin.mediaContent?.previewImage?.medium || coin.mediaContent?.previewImage?.small ? (
                        <img
                          src={coin.mediaContent.previewImage.medium || coin.mediaContent.previewImage.small}
                          alt={coin.name || "Content"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">{coin.name || "Content"}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center text-white">
                        <div className={`text-lg font-bold ${marketCapChange === "up" ? "text-green-500" : "text-red-500"}`}>
                          ${coin.marketCap ? parseFloat(coin.marketCap).toLocaleString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                  {userProfileLoading ? (
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                      <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-6 w-14 bg-muted animate-pulse rounded" />
                      <div className="h-6 w-18 bg-muted animate-pulse rounded" />
                    </div>
                  ) : (
                    <>
                      {(userProfile?.profileData?.skills || []).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {(!userProfile?.profileData?.skills || userProfile.profileData.skills.length === 0) && (
                        <p className="text-sm text-muted-foreground">No skills added yet</p>
                      )}
                    </>
                  )}
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
