import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import PostCard from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const PostFeed = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const posts = [
    {
      id: "1",
      title: "Neon Dream VFX",
      creator: "Dharma",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      likes: 234,
      comments: 45,
      collaborators: [
        { name: "Alex", role: "VFX Artist", share: 15 },
        { name: "Sarah", role: "Sound Design", share: 12 },
        { name: "Mike", role: "Color Grading", share: 8 },
      ],
    },
    {
      id: "2",
      title: "Cyber Beats EP",
      creator: "Luna",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
      likes: 567,
      comments: 89,
      collaborators: [
        { name: "Jordan", role: "Producer", share: 20 },
        { name: "Casey", role: "Mix Engineer", share: 15 },
      ],
    },
    {
      id: "3",
      title: "Abstract Motion",
      creator: "Koda",
      imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800",
      likes: 892,
      comments: 123,
      collaborators: [
        { name: "River", role: "Animator", share: 18 },
        { name: "Sage", role: "Compositor", share: 12 },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-white/10">
        <div className="max-w-screen-xl mx-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sideway
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse-glow" />
              <span className="text-xs text-muted-foreground font-mono">On-chain</span>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search published works..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-white/10 focus:border-primary/50"
            />
          </div>
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-screen-xl mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Published PostCoins
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default PostFeed;
