import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, CheckCircle2, X, User } from "lucide-react";
import { useReceivedPings, useRespondToPing, useMatches } from "@/hooks/useMatches";
import { useWallet } from "@/contexts/WalletContext";
import { PingItemSkeleton, MatchItemSkeleton } from "@/components/LoadingStates";
import { PingCard } from "@/components/PingCard";
import { MatchCard } from "@/components/MatchCard";
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
                <PingCard
                  key={ping.id}
                  ping={ping}
                  onAccept={handleAcceptPing}
                  onDecline={handleDeclinePing}
                  isLoading={respondToPingMutation.isPending}
                />
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
                <MatchCard
                  key={collab.id}
                  match={collab}
                  onClick={() => navigate(`/match/${collab.id}`)}
                />
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
