import { Badge } from "@/components/ui/badge";
import { UserProfileDisplay } from "@/components/UserProfileDisplay";
import { useZoraProfile, getDisplayName } from "@/hooks/useZoraProfile";
import { useWallet } from "@/contexts/WalletContext";
import { MessageCircle } from "lucide-react";
import type { Match } from "@/types/collab";

interface MatchCardProps {
  match: Match;
  onClick: () => void;
}

export const MatchCard = ({ match, onClick }: MatchCardProps) => {
  const { zoraWallet } = useWallet();
  
  // Determine which wallet is the "other user" (not the current user)
  const otherUserWallet = match.creatorWallet === zoraWallet 
    ? match.collaboratorWallet 
    : match.creatorWallet;
  
  const { profile } = useZoraProfile(otherUserWallet);
  const displayName = getDisplayName(profile, otherUserWallet);

  return (
    <div
      className="border-b border-white/10 hover:bg-muted/30 smooth-transition cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4 flex items-start gap-3">
        {/* User Avatar */}
        <UserProfileDisplay 
          walletAddress={otherUserWallet} 
          avatarSize="md"
          showName={false}
          className="flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-sm">{match.projectName}</h3>
            <span className="text-xs text-muted-foreground">
              {new Date(match.lastMessageAt).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground mb-1">
            {match.role} • {displayName}
          </p>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <MessageCircle className="h-3 w-3" />
              Last message
            </p>
            {match.unreadCount > 0 && (
              <Badge className="bg-primary text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {match.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
