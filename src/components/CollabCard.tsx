import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface CollabCardProps {
  id: string;
  title: string;
  creator: string;
  creatorAvatar?: string;
  role: string;
  paymentType: "paid" | "barter";
  credits: boolean;
  workStyle: "contract" | "freestyle";
  location: string;
  status: "open" | "shortlisted" | "signed";
}

const CollabCard = ({ title, creator, creatorAvatar, role, paymentType, credits, workStyle, location, status }: CollabCardProps) => {
  const statusColors = {
    open: "bg-secondary/20 text-secondary",
    shortlisted: "bg-primary/20 text-primary",
    signed: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 hover:border-primary/50 smooth-transition animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={creatorAvatar} alt={creator} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {creator.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <h3 className="font-bold text-xl">@{creator}</h3>
            <p className="text-sm text-muted-foreground">{role} • "{title}"</p>
          </div>
        </div>
        <Badge className={statusColors[status]}>
          {status}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="capitalize">
          {paymentType}
        </Badge>
        {credits && (
          <Badge variant="outline" className="border-primary/50 text-primary">
            Credits
          </Badge>
        )}
        <Badge variant="outline" className="capitalize">
          {workStyle}
        </Badge>
        <Badge variant="outline" className="border-accent/50 text-accent">
          {location}
        </Badge>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 border-secondary/50 hover:bg-secondary/10 hover:border-secondary"
        >
          💫 Ping
        </Button>
        <Button className="flex-1 bg-gradient-to-r from-primary to-secondary">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default CollabCard;
