import { useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { MessageCircle, Share2, MoreHorizontal, Camera, Lightbulb, Sparkles, Plus } from "lucide-react";
import filmStudio from "@/assets/demo/film-studio.jpg";
import musicStudio from "@/assets/demo/music-studio.jpg";
import comedyClub from "@/assets/demo/comedy-club.jpg";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const PostFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock data
  const posts = [
    {
      id: "1",
      creator: "dharma.creates",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dharma",
      imageUrl: filmStudio,
      description: "New VFX breakdown coming soon 🔥✨",
      marketCap: 234,
      marketCapChange: "up",
      comments: 45,
      collaborators: [],
      contentType: "BTS" as const,
    },
    {
      id: "2",
      creator: "luna.beats",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=luna",
      imageUrl: musicStudio,
      description: "Studio sessions with @jordan.wav 🎵",
      marketCap: 567,
      marketCapChange: "down",
      comments: 89,
      collaborators: [
        { name: "jordan.wav", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan" },
      ],
      contentType: "Release" as const,
    },
    {
      id: "3",
      creator: "koda.motion",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=koda",
      imageUrl: comedyClub,
      description: "Big team effort on this one 💫 shoutout to everyone involved",
      marketCap: 892,
      marketCapChange: "up",
      comments: 123,
      collaborators: [
        { name: "river.anim", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=river" },
        { name: "sage.comp", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sage" },
        { name: "taylor.sound", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=taylor" },
        { name: "morgan.color", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=morgan" },
        { name: "alex.edit", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" },
        { name: "jamie.vfx", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jamie" },
      ],
      contentType: "Thoughts" as const,
    },
  ];

  const getContentTypeIcon = (type: "BTS" | "Thoughts" | "Release") => {
    switch (type) {
      case "BTS":
        return Camera;
      case "Thoughts":
        return Lightbulb;
      case "Release":
        return Sparkles;
    }
  };

  const formatCreatorDisplay = (creator: string, collaborators: any[]) => {
    if (collaborators.length === 0) return creator;
    if (collaborators.length === 1) return `${creator} & ${collaborators[0].name}`;
    return `${creator} with ${collaborators.length} others`;
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

            {/* Top Creator Info */}
            <div className="absolute top-16 left-4 right-4 z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={post.avatarUrl} />
                  <AvatarFallback>{post.creator[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">
                    {formatCreatorDisplay(post.creator, post.collaborators)}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs px-2 py-0.5 flex items-center gap-1"
                  >
                    {(() => {
                      const Icon = getContentTypeIcon(post.contentType);
                      return <Icon className="h-3 w-3" />;
                    })()}
                    {post.contentType}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-20 left-0 right-0 z-10 px-4">
              {/* Description */}
              <div className="mb-4">
                <p className="text-white text-sm">
                  {post.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-sm font-bold ${post.marketCapChange === "up" ? "text-green-500" : "text-red-500"}`}>
                    ${post.marketCap}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <Share2 className="h-6 w-6" />
                  </Button>
                </div>
                <Button 
                  variant="default"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6"
                >
                  Buy
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-center bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-xl font-bold text-white">Originals</h1>
      </div>

      {/* Floating Create Button */}
      <Link to="/create-content" className="fixed bottom-28 right-4 z-30">
        <Button
          size="icon"
          variant="ghost"
          className="h-14 w-14 rounded-full bg-gradient-to-br from-zinc-400 via-zinc-300 to-zinc-500 hover:from-zinc-300 hover:via-zinc-200 hover:to-zinc-400 text-zinc-900 shadow-[0_8px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:scale-105 smooth-transition border border-zinc-200/50"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>

      <BottomNav />
    </div>
  );
};

export default PostFeed;
