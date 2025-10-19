import { useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, X, Heart, Info, Handshake } from "lucide-react";

const CollabFeed = () => {
  const [filter, setFilter] = useState<"all" | "paid" | "barter" | "credits" | "contract" | "freestyle" | "remote">("all");
  const [currentIndex, setCurrentIndex] = useState(0);

  const collabs = [
    {
      id: "1",
      title: "Neon Dream",
      creator: "Dharma",
      creatorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      role: "VFX Artist",
      paymentType: "paid" as const,
      credits: true,
      workStyle: "contract" as const,
      location: "Remote",
      status: "open" as const,
      description: "Looking for a skilled VFX artist to create stunning neon effects for our cyberpunk music video.",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    },
    {
      id: "2",
      title: "Cyber Beats EP",
      creator: "Luna",
      creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      role: "Mix Engineer",
      paymentType: "paid" as const,
      credits: false,
      workStyle: "freestyle" as const,
      location: "LA",
      status: "shortlisted" as const,
      description: "Need an experienced mix engineer for our 5-track EP. Must have experience with electronic music.",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    },
    {
      id: "3",
      title: "Abstract Motion",
      creator: "Koda",
      creatorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
      role: "3D Animator",
      paymentType: "barter" as const,
      credits: true,
      workStyle: "freestyle" as const,
      location: "Remote",
      status: "open" as const,
      description: "Seeking a talented 3D animator to bring our abstract concepts to life with smooth, flowing animations.",
      imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800",
    },
  ];

  const filteredCollabs = filter === "all" 
    ? collabs 
    : collabs.filter(c => {
        if (filter === "paid" || filter === "barter") return c.paymentType === filter;
        if (filter === "credits") return c.credits;
        if (filter === "contract" || filter === "freestyle") return c.workStyle === filter;
        if (filter === "remote") return c.location.toLowerCase() === "remote";
        return true;
      });

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Ping/Like action
      console.log('Pinged:', filteredCollabs[currentIndex].title);
    }
    if (currentIndex < filteredCollabs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
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
          
          <div className="flex gap-2 overflow-x-auto pb-2">
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
        {filteredCollabs.length > 0 ? (
          <div className="relative w-full h-full max-h-[600px]">
            {/* Tinder-style card stack */}
            {filteredCollabs.slice(currentIndex, currentIndex + 2).map((collab, index) => (
              <div
                key={collab.id}
                className={`absolute inset-0 glass-card rounded-3xl overflow-hidden transition-all duration-300 ${
                  index === 0 ? 'z-20 scale-100' : 'z-10 scale-95 opacity-50'
                }`}
                style={{
                  transform: index === 0 ? 'translateY(0) rotate(0deg)' : 'translateY(10px) scale(0.95)',
                }}
              >
                {/* Card Image */}
                <div className="relative h-3/5">
                  <img
                    src={collab.imageUrl}
                    alt={collab.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <Badge 
                    className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm"
                  >
                    {collab.status}
                  </Badge>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-14 w-14 border-2 border-primary/30">
                      <AvatarImage src={collab.creatorAvatar} alt={collab.creator} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                        {collab.creator.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">@{collab.creator}</h2>
                      <p className="text-muted-foreground">
                        {collab.role} • {collab.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {collab.description}
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

            {/* Action Buttons */}
            <div className="absolute -bottom-20 left-0 right-0 flex items-center justify-center gap-6 z-30">
              <Button
                size="lg"
                variant="outline"
                className="h-16 w-16 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-white"
                onClick={() => handleSwipe('left')}
              >
                <X className="h-8 w-8" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-12 rounded-full border-primary text-primary hover:bg-primary/10"
              >
                <Info className="h-5 w-5" />
              </Button>
              
              <Button
                size="lg"
                className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary"
                onClick={() => handleSwipe('right')}
              >
                <Heart className="h-8 w-8" />
              </Button>
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
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-110 smooth-transition shadow-lg glow-primary"
        >
          <Handshake className="h-5 w-5" />
        </Button>
      </Link>

      <BottomNav />
    </div>
  );
};

export default CollabFeed;
