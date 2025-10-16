import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Heart, Info } from "lucide-react";

const CollabFeed = () => {
  const [filter, setFilter] = useState<"all" | "open" | "shortlisted">("all");
  const [currentIndex, setCurrentIndex] = useState(0);

  const collabs = [
    {
      id: "1",
      title: "Neon Dream",
      creator: "Dharma",
      role: "VFX Artist",
      share: 15,
      payment: "0.2 ETH",
      deadline: "Dec 1",
      status: "open" as const,
      description: "Looking for a skilled VFX artist to create stunning neon effects for our cyberpunk music video.",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    },
    {
      id: "2",
      title: "Cyber Beats EP",
      creator: "Luna",
      role: "Mix Engineer",
      share: 12,
      payment: "$2.5k",
      deadline: "Nov 25",
      status: "shortlisted" as const,
      description: "Need an experienced mix engineer for our 5-track EP. Must have experience with electronic music.",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    },
    {
      id: "3",
      title: "Abstract Motion",
      creator: "Koda",
      role: "3D Animator",
      share: 18,
      payment: "0.5 ETH",
      deadline: "Dec 10",
      status: "open" as const,
      description: "Seeking a talented 3D animator to bring our abstract concepts to life with smooth, flowing animations.",
      imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800",
    },
  ];

  const filteredCollabs = filter === "all" 
    ? collabs 
    : collabs.filter(c => c.status === filter);

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
              variant={filter === "open" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setFilter("open")}
            >
              Open
            </Badge>
            <Badge
              variant={filter === "shortlisted" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setFilter("shortlisted")}
            >
              Shortlisted
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
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{collab.role}</h2>
                    <p className="text-muted-foreground mb-2">
                      {collab.title} • by @{collab.creator}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {collab.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="glass-card rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Share</p>
                      <p className="font-bold font-mono">{collab.share}%</p>
                    </div>
                    <div className="glass-card rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Payment</p>
                      <p className="font-bold font-mono text-xs">{collab.payment}</p>
                    </div>
                    <div className="glass-card rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="font-bold text-xs">{collab.deadline}</p>
                    </div>
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

      <BottomNav />
    </div>
  );
};

export default CollabFeed;
