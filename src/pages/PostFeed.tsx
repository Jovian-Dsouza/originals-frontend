import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Search, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const PostFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock data
  const posts = [
    {
      id: "1",
      creator: "dharma.creates",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dharma",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      description: "New VFX breakdown coming soon 🔥✨",
      likes: 234,
      comments: 45,
      collaborators: [],
    },
    {
      id: "2",
      creator: "luna.beats",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=luna",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
      description: "Studio sessions with @jordan.wav 🎵",
      likes: 567,
      comments: 89,
      collaborators: [
        { name: "jordan.wav", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan" },
      ],
    },
    {
      id: "3",
      creator: "koda.motion",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=koda",
      imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800",
      description: "Big team effort on this one 💫 shoutout to everyone involved",
      likes: 892,
      comments: 123,
      collaborators: [
        { name: "river.anim", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=river" },
        { name: "sage.comp", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sage" },
        { name: "taylor.sound", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=taylor" },
        { name: "morgan.color", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=morgan" },
        { name: "alex.edit", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" },
        { name: "jamie.vfx", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jamie" },
      ],
    },
  ];

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
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={post.avatarUrl} />
                  <AvatarFallback>{post.creator[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-white font-semibold text-sm">
                  {formatCreatorDisplay(post.creator, post.collaborators)}
                </span>
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
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <Heart className="h-6 w-6" />
                  </Button>
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
                <div className="flex items-center gap-4">
                  <Button 
                    variant="default"
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6"
                  >
                    Buy
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <Bookmark className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Likes Count */}
              <div className="mt-2">
                <p className="text-white text-xs font-semibold">{post.likes} likes</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-center bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-xl font-bold text-white">Originals</h1>
      </div>

      <BottomNav />
    </div>
  );
};

export default PostFeed;
