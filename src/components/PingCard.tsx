import { Button } from "@/components/ui/button";
import { UserProfileDisplay } from "@/components/UserProfileDisplay";
import { ExternalLink, CheckCircle2, X } from "lucide-react";
import type { Ping } from "@/types/collab";

interface PingCardProps {
  ping: Ping;
  onAccept: (pingId: string) => void;
  onDecline: (pingId: string) => void;
  isLoading?: boolean;
}

export const PingCard = ({ ping, onAccept, onDecline, isLoading = false }: PingCardProps) => {
  const handleProfileClick = () => {
    const profileUrl = `https://zora.co/@${ping.collabPost?.creatorWallet}`;
    window.open(profileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="border-b border-white/10 p-4 hover:bg-muted/20 smooth-transition">
      <div className="flex items-start gap-3 mb-3">
        {/* User Avatar */}
        <UserProfileDisplay 
          walletAddress={ping.collabPost?.creatorWallet || ''} 
          avatarSize="md"
          showName={false}
          className="flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-sm">{ping.collabPost?.title || 'Untitled Project'}</h3>
            <span className="text-xs text-muted-foreground">
              {new Date(ping.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">
            {ping.collabPost?.creatorWallet ? `@${ping.collabPost.creatorWallet.slice(0, 8)}...` : 'Unknown User'}
          </p>
          <p className="text-xs text-muted-foreground">{ping.bio}</p>
        </div>
      </div>

      <div className="flex gap-2 ml-15 mt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-7"
          onClick={() => onAccept(ping.id)}
          disabled={isLoading}
        >
          Accept
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-7"
          onClick={handleProfileClick}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Profile
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-7 text-muted-foreground"
          onClick={() => onDecline(ping.id)}
          disabled={isLoading}
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
