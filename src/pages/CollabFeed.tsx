import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import CollabCard from "@/components/CollabCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

const CollabFeed = () => {
  const [filter, setFilter] = useState<"all" | "open" | "shortlisted">("all");

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
    },
  ];

  const filteredCollabs = filter === "all" 
    ? collabs 
    : collabs.filter(c => c.status === filter);

  return (
    <div className="min-h-screen pb-24">
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

      <main className="max-w-screen-xl mx-auto p-4 space-y-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Available Opportunities
          </h2>
          <p className="text-xs text-muted-foreground">
            Swipe right to Ping • Tap to view details
          </p>
        </div>

        {filteredCollabs.map((collab) => (
          <CollabCard key={collab.id} {...collab} />
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default CollabFeed;
