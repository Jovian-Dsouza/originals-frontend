import { Heart, MessageCircle, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Collaborator {
  name: string;
  role: string;
  share: number;
}

interface PostCardProps {
  id: string;
  title: string;
  creator: string;
  imageUrl: string;
  likes: number;
  comments: number;
  collaborators: Collaborator[];
}

const PostCard = ({ title, creator, imageUrl, likes, comments, collaborators }: PostCardProps) => {
  const mainCollaborators = collaborators.filter(c => c.share > 10);

  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:scale-[1.02] smooth-transition animate-fade-in">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 smooth-transition">
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            {mainCollaborators.map((collab, i) => (
              <div key={i} className="flex items-center justify-between text-white">
                <span className="text-sm">{collab.role}</span>
                <Badge variant="secondary" className="bg-secondary/80 text-black font-mono">
                  {collab.share}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">by @{creator}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
              <Heart className="h-4 w-4" />
              <span className="font-mono text-xs">{likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 hover:text-secondary">
              <MessageCircle className="h-4 w-4" />
              <span className="font-mono text-xs">{comments}</span>
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="gap-2 border-primary/50 hover:bg-primary/10">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Buy Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
