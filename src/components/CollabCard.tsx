import { Calendar, Coins, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface CollabCardProps {
  id: string;
  title: string;
  creator: string;
  role: string;
  share: number;
  payment: string;
  deadline: string;
  status: "open" | "shortlisted" | "signed";
}

const CollabCard = ({ title, creator, role, share, payment, deadline, status }: CollabCardProps) => {
  const statusColors = {
    open: "bg-secondary/20 text-secondary",
    shortlisted: "bg-primary/20 text-primary",
    signed: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 hover:border-primary/50 smooth-transition animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-xl">{role}</h3>
          <p className="text-sm text-muted-foreground">for "{title}"</p>
          <p className="text-xs text-muted-foreground">by @{creator}</p>
        </div>
        <Badge className={statusColors[status]}>
          {status}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
            <Coins className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Share</p>
            <p className="font-mono font-bold">{share}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pay</p>
            <p className="font-mono font-bold text-sm">{payment}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Due</p>
            <p className="font-bold text-sm">{deadline}</p>
          </div>
        </div>
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
