import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Heart, Info, Handshake } from "lucide-react";
import { useCollabFeed, usePingCollab } from "@/hooks/useCollabs";
import { useWallet } from "@/contexts/WalletContext";
import { CollabCardSkeleton } from "@/components/LoadingStates";
import { UserProfileDisplay } from "@/components/UserProfileDisplay";
import type { CollabFeedFilters } from "@/types/collab";

const CollabFeed = () => {
  const [filter, setFilter] = useState<"all" | "paid" | "barter" | "credits" | "contract" | "freestyle" | "remote">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardOffset, setCardOffset] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { zoraWallet, isConnected } = useWallet();
  const pingCollabMutation = usePingCollab();

  // Build API filters
  const apiFilters: CollabFeedFilters = {
    page: 1,
    limit: 20,
    ...(filter !== "all" && { filter }),
  };

  // Fetch collaboration feed from API
  const { data: feedData, isLoading, error, refetch } = useCollabFeed(apiFilters);
  
  const collabs = feedData?.collabs || [];
  const filteredCollabs = collabs;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating || !filteredCollabs[currentIndex]) return;
    
    setIsAnimating(true);
    const currentCollab = filteredCollabs[currentIndex];
    
    if (direction === 'right') {
      // Ping/Like action
      pingCollabMutation.mutate({
        collabId: currentCollab.id,
        data: {
          interestedRole: currentCollab.role,
          bio: "Interested in collaborating on this project",
        },
      });
    }
    
    // Animate card out
    setCardOffset(direction === 'left' ? -400 : 400);
    
    setTimeout(() => {
      if (currentIndex < filteredCollabs.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
      setCardOffset(0);
      setIsAnimating(false);
    }, 300);
  };

  const handleInfoToggle = () => {
    setShowInfo(!showInfo);
  };

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        setCardOffset(deltaX * 0.5); // Scale down the movement for preview
      }
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      
      if (Math.abs(deltaX) > 50) {
        handleSwipe(deltaX > 0 ? 'right' : 'left');
      } else {
        setCardOffset(0);
      }
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const currentCollab = filteredCollabs[currentIndex];

  return (
    <div className="min-h-screen pb-24 bg-background">
      <header className="sticky top-0 z-40 glass-card border-b border-white/10">
        <div className="max-w-screen-xl mx-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">CollabFeed</h1>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setFilter("all")}
            >
              All
            </Badge>
            <Badge
              variant={filter === "paid" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setFilter("paid")}
            >
              Paid
            </Badge>
            <Badge
              variant={filter === "barter" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setFilter("barter")}
            >
              Barter
            </Badge>
            <Badge
              variant={filter === "credits" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setFilter("credits")}
            >
              Credits
            </Badge>
            <Badge
              variant={filter === "contract" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setFilter("contract")}
            >
              Contract
            </Badge>
            <Badge
              variant={filter === "freestyle" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setFilter("freestyle")}
            >
              Freestyle
            </Badge>
            <Badge
              variant={filter === "remote" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setFilter("remote")}
            >
              Remote
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 h-[calc(100vh-250px)] flex items-center justify-center">
        {!isConnected ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please connect your wallet to view collaborations</p>
            <Button onClick={() => window.location.reload()}>Connect Wallet</Button>
          </div>
        ) : isLoading ? (
          <CollabCardSkeleton />
        ) : error ? (
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load collaborations</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : filteredCollabs.length > 0 ? (
          <div className="relative w-full h-full max-h-[600px]">
            {/* Tinder-style card stack */}
            {filteredCollabs.slice(currentIndex, currentIndex + 2).map((collab, index) => (
              <div
                key={collab.id}
                ref={index === 0 ? cardRef : undefined}
                className={`absolute inset-0 glass-card rounded-3xl overflow-hidden transition-all duration-300 ${
                  index === 0 ? 'z-20 scale-100' : 'z-10 scale-95 opacity-50'
                }`}
                style={{
                  transform: index === 0 
                    ? `translateX(${cardOffset}px) translateY(0) rotate(${cardOffset * 0.1}deg)` 
                    : 'translateY(10px) scale(0.95)',
                }}
                onTouchStart={index === 0 ? handleTouchStart : undefined}
              >
                {/* Card Image */}
                <div className="relative h-3/5">
                  <img
                    src={collab.media?.gatewayUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800"}
                    alt={collab.title || "Collaboration"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Role Badge */}
                  <Badge 
                    className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm"
                  >
                    {collab.role}
                  </Badge>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{collab.title || "Untitled Project"}</h2>
                    <UserProfileDisplay 
                      walletAddress={collab.creatorWallet}
                      avatarSize="sm"
                      className="text-sm"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {collab.description || "No description available"}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {collab.paymentType}
                    </Badge>
                    {collab.credits && (
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        Credits
                      </Badge>
                    )}
                    <Badge variant="outline" className="capitalize">
                      {collab.workStyle}
                    </Badge>
                    <Badge variant="outline" className="border-accent/50 text-accent">
                      {collab.location}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {/* Semi-circular Action Buttons */}
            <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center z-30">
              <div className="relative flex items-center justify-center">
                {/* Dark bar background */}
                <div className="absolute inset-0 h-2 bg-zinc-800/80 rounded-full w-80"></div>
                
                {/* Action buttons */}
                <div className="flex items-center justify-center gap-8">
                  {/* Reject Button - Semi-circle outline */}
                  {/* <button
                    onClick={() => handleSwipe('left')}
                    disabled={isAnimating}
                    className="relative group transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  >
                    <div className="w-16 h-8 border-2 border-red-500 rounded-t-full rounded-b-none bg-transparent group-hover:bg-red-500/10 transition-colors duration-200 flex items-center justify-center">
                      <X className="h-6 w-6 text-red-500 group-hover:text-red-400" />
                    </div>
                  </button> */}
                  
                  {/* Info Button - Pill shape */}
                  {/* <button
                    onClick={handleInfoToggle}
                    className="relative group transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-12 h-8 border-2 border-purple-500 rounded-full bg-transparent group-hover:bg-purple-500/10 transition-colors duration-200 flex items-center justify-center">
                      <Info className="h-4 w-4 text-purple-500 group-hover:text-purple-400" />
                    </div>
                  </button> */}
                  
                  {/* Like Button - Filled semi-circle with gradient */}
                  {/* <button
                    onClick={() => handleSwipe('right')}
                    disabled={isAnimating}
                    className="relative group transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  >
                    <div className="w-16 h-8 rounded-t-full rounded-b-none bg-gradient-to-r from-purple-500 to-blue-500 group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-200 flex items-center justify-center shadow-lg">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">No collaborations available</p>
          </div>
        )}
      </main>

      {/* Floating Create Collab Button */}
      <Link to="/create-collab" className="fixed bottom-24 right-4 z-30">
        <Button
          size="icon"
          variant="ghost"
          className="h-14 w-14 rounded-full bg-gradient-to-br from-zinc-400 via-zinc-300 to-zinc-500 hover:from-zinc-300 hover:via-zinc-200 hover:to-zinc-400 text-zinc-900 shadow-[0_8px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:scale-105 smooth-transition border border-zinc-200/50"
        >
          <Handshake className="h-5 w-5" />
        </Button>
      </Link>

      {/* Info Modal */}
      {showInfo && currentCollab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
          />
          <div className="relative glass-card rounded-3xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Project Details</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">{currentCollab.title || "Untitled Project"}</h4>
                <UserProfileDisplay 
                  walletAddress={currentCollab.creatorWallet}
                  avatarSize="md"
                  className="mb-3"
                />
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Role Required</h5>
                <Badge className="bg-primary/80 backdrop-blur-sm">
                  {currentCollab.role}
                </Badge>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Description</h5>
                <p className="text-sm text-muted-foreground">{currentCollab.description || "No description available"}</p>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Project Details</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {currentCollab.paymentType}
                  </Badge>
                  {currentCollab.credits && (
                    <Badge variant="outline" className="border-primary/50 text-primary">
                      Credits
                    </Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {currentCollab.workStyle}
                  </Badge>
                  <Badge variant="outline" className="border-accent/50 text-accent">
                    {currentCollab.location}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default CollabFeed;
