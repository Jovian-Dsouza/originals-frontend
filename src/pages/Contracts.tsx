import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, CheckCircle2, X, User } from "lucide-react";

const Contracts = () => {
  // Pings I've received on my collab posts
  const pingsReceived = [
    {
      id: "1",
      userName: "Luna",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
      collabPost: "Neon Dream VFX",
      interestedRole: "3D Artist",
      bio: "5 years of experience in music video VFX",
      pingTime: "2h ago",
    },
    {
      id: "2",
      userName: "Koda",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Koda",
      collabPost: "Cyber Beats Mix",
      interestedRole: "Sound Designer",
      bio: "Award-winning sound designer for films",
      pingTime: "5h ago",
    },
    {
      id: "3",
      userName: "Alex",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      collabPost: "Abstract Motion",
      interestedRole: "Animator",
      bio: "Freelance animator with Netflix credits",
      pingTime: "1d ago",
    },
  ];

  // Matched/Active collaborations
  const matchedCollabs = [
    {
      id: "1",
      project: "Neon Dream",
      role: "VFX Artist",
      creator: "Dharma",
      lastMessage: "Just submitted milestone 2 for review",
      lastMessageTime: "2m ago",
      unread: 3,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dharma",
    },
    {
      id: "2",
      project: "Cyber Beats EP",
      role: "Mix Engineer",
      creator: "Luna",
      lastMessage: "Final mix is ready!",
      lastMessageTime: "1h ago",
      unread: 0,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    },
    {
      id: "3",
      project: "Abstract Motion",
      role: "Animator",
      creator: "Koda",
      lastMessage: "Can we schedule a sync call?",
      lastMessageTime: "3h ago",
      unread: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Koda",
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-background">
      <header className="sticky top-0 z-40 glass-card border-b border-white/10">
        <div className="max-w-screen-xl mx-auto p-4">
          <h1 className="text-2xl font-bold">Contracts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your collaboration matches
          </p>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto p-4">
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="received">Pings Received</TabsTrigger>
            <TabsTrigger value="matched">Matched Collabs</TabsTrigger>
          </TabsList>

          {/* Pings Received Tab */}
          <TabsContent value="received" className="space-y-3">
            {pingsReceived.map((ping) => (
              <div
                key={ping.id}
                className="border-b border-white/10 p-4 hover:bg-muted/20 smooth-transition"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={ping.userAvatar} alt={ping.userName} className="w-full h-full" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm">{ping.userName}</h3>
                      <span className="text-xs text-muted-foreground">{ping.pingTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {ping.interestedRole} • {ping.collabPost}
                    </p>
                    <p className="text-xs text-muted-foreground">{ping.bio}</p>
                  </div>
                </div>

                <div className="flex gap-2 ml-15 mt-2">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    Accept
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground">
                    Decline
                  </Button>
                </div>
              </div>
            ))}

            {pingsReceived.length === 0 && (
              <div className="glass-card rounded-2xl p-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-bold text-lg mb-2">No Pings Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Creators interested in your collabs will appear here
                </p>
              </div>
            )}
          </TabsContent>

          {/* Matched Collabs Tab */}
          <TabsContent value="matched">
            {matchedCollabs.map((collab) => (
              <div
                key={collab.id}
                className="border-b border-white/10 hover:bg-muted/30 smooth-transition cursor-pointer"
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
                      <img src={collab.avatar} alt={collab.creator} className="w-full h-full" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-secondary border-2 border-background" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold truncate">{collab.project}</h3>
                      <span className="text-xs text-muted-foreground">
                        {collab.lastMessageTime}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mb-1">
                      {collab.role} • @{collab.creator}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex items-center gap-2">
                        <MessageCircle className="h-3 w-3" />
                        {collab.lastMessage}
                      </p>
                      {collab.unread > 0 && (
                        <Badge className="bg-primary text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                          {collab.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {matchedCollabs.length === 0 && (
              <div className="glass-card rounded-2xl p-12 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-bold text-lg mb-2">No Active Collabs</h3>
                <p className="text-sm text-muted-foreground">
                  Your matched workspace channels will appear here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Contracts;
