import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import PostCard from "@/components/PostCard";
import { Search, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PostFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
        { name: "Taylor", role: "Sound Designer", share: 10 },
        { name: "Morgan", role: "Colorist", share: 8 },
        { name: "Alex", role: "Editor", share: 7 },
        { name: "Jamie", role: "VFX", share: 6 },
        { name: "Chris", role: "Music", share: 5 },
        { name: "Pat", role: "Lighting", share: 4 },
        { name: "Sam", role: "Rigging", share: 3 },
        { name: "Drew", role: "Textures", share: 2 },
        { name: "Quinn", role: "Modeling", share: 2 },
      ],
    },
  ];

  const formatCollaborators = (creator: string, collaborators: any[]) => {
    const majorCollabs = collaborators.filter(c => c.share > 10);
    
    if (majorCollabs.length === 0) return creator;
    if (majorCollabs.length <= 3) {
      return `${creator} and ${majorCollabs.map(c => c.name).join(", ")}`;
    }
    return `${creator} and ${majorCollabs.length} others`;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative">
      {/* TikTok-style vertical scroll */}
      <div 
        className="snap-y snap-mandatory overflow-y-scroll h-full w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {posts.map((post, index) => (
          <div 
            key={post.id}
            className="snap-start snap-always h-screen w-full relative flex items-center justify-center"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 pb-32 z-10">
              <h2 className="text-3xl font-bold text-white mb-2">
                {post.title}
              </h2>
              <p className="text-white/90 mb-4">
                {formatCollaborators(post.creator, post.collaborators)}
              </p>
              
              <div className="flex items-center gap-6 text-white">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-white hover:text-white hover:bg-white/20"
                >
                  <Heart className="h-5 w-5" />
                  <span className="font-mono">{post.likes}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-white hover:text-white hover:bg-white/20"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-mono">{post.comments}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-white hover:text-white hover:bg-white/20"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Side Actions */}
            <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse-glow" />
                <span className="text-xs text-white">@{post.creator}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-2xl font-bold text-white">PostFeed</h1>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default PostFeed;
