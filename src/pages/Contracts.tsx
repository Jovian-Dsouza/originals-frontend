import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, CheckCircle2, X, User } from "lucide-react";
import { useReceivedPings, useRespondToPing, useMatches } from "@/hooks/useMatches";
import { useWallet } from "@/contexts/WalletContext";
import { PingItemSkeleton, MatchItemSkeleton } from "@/components/LoadingStates";
import { useNavigate } from "react-router-dom";

const Contracts = () => {
  const { zoraWallet, isConnected } = useWallet();
  const respondToPingMutation = useRespondToPing();
  const navigate = useNavigate();

  // Fetch data from API
  const { data: pingsData, isLoading: pingsLoading, error: pingsError } = useReceivedPings();
  const { data: matchesData, isLoading: matchesLoading, error: matchesError } = useMatches();

  const pingsReceived = pingsData?.pings || [];
  const matchedCollabs = matchesData?.matches || [];

  const handleAcceptPing = (pingId: string) => {
    respondToPingMutation.mutate({
      pingId,
      data: { action: "accept" },
    });
  };

  const handleDeclinePing = (pingId: string) => {
    respondToPingMutation.mutate({
      pingId,
      data: { action: "decline" },
    });
  };

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
            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Please connect your wallet to view pings</p>
              </div>
            ) : pingsLoading ? (
              <>
                <PingItemSkeleton />
                <PingItemSkeleton />
                <PingItemSkeleton />
              </>
            ) : pingsError ? (
              <div className="text-center py-8">
                <p className="text-destructive">Failed to load pings</p>
              </div>
            ) : pingsReceived.length > 0 ? (
              pingsReceived.map((ping) => (
                <div
                  key={ping.id}
                  className="border-b border-white/10 p-4 hover:bg-muted/20 smooth-transition"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                      <div className="text-white font-bold text-sm">
                        {ping.pingedWallet.slice(2, 4).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm">{ping.pingedWallet.slice(0, 8)}...</h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ping.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {ping.interestedRole} • {ping.collabPost?.role || "Collaboration"}
                      </p>
                      <p className="text-xs text-muted-foreground">{ping.bio}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-15 mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={() => handleAcceptPing(ping.id)}
                      disabled={respondToPingMutation.isPending}
                    >
                      Accept
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7 text-muted-foreground"
                      onClick={() => handleDeclinePing(ping.id)}
                      disabled={respondToPingMutation.isPending}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))
            ) : (
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
            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Please connect your wallet to view matches</p>
              </div>
            ) : matchesLoading ? (
              <>
                <MatchItemSkeleton />
                <MatchItemSkeleton />
                <MatchItemSkeleton />
              </>
            ) : matchesError ? (
              <div className="text-center py-8">
                <p className="text-destructive">Failed to load matches</p>
              </div>
            ) : matchedCollabs.length > 0 ? (
              matchedCollabs.map((collab) => (
                <div
                  key={collab.id}
                  className="border-b border-white/10 hover:bg-muted/30 smooth-transition cursor-pointer"
                  onClick={() => navigate(`/match/${collab.id}`)}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
                        <div className="text-white font-bold text-sm">
                          {collab.otherUser?.wallet.slice(2, 4).toUpperCase() || "??"}
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-secondary border-2 border-background" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold truncate">{collab.projectName}</h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(collab.lastMessageAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        {collab.role} • @{collab.otherUser?.wallet.slice(0, 8)}...
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate flex items-center gap-2">
                          <MessageCircle className="h-3 w-3" />
                          Last message
                        </p>
                        {collab.unreadCount > 0 && (
                          <Badge className="bg-primary text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                            {collab.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
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
