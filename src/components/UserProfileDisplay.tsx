import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useZoraProfile, getDisplayName, getAvatarUrl } from "@/hooks/useZoraProfile";

interface UserProfileDisplayProps {
  walletAddress: string;
  showAvatar?: boolean;
  showName?: boolean;
  avatarSize?: "sm" | "md" | "lg";
  className?: string;
}

export const UserProfileDisplay = ({ 
  walletAddress, 
  showAvatar = true, 
  showName = true,
  avatarSize = "md",
  className = ""
}: UserProfileDisplayProps) => {
  const { profile, loading } = useZoraProfile(walletAddress);
  
  const displayName = getDisplayName(profile, walletAddress);
  const avatarUrl = getAvatarUrl(profile);
  
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };
  
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showAvatar && (
        <Avatar className={`${sizeClasses[avatarSize]} border border-primary/20`}>
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {walletAddress.slice(2, 4).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      )}
      
      {showName && (
        <span className={`text-muted-foreground ${textSizeClasses[avatarSize]} ${loading ? 'animate-pulse' : ''}`}>
          {loading ? 'Loading...' : displayName}
        </span>
      )}
    </div>
  );
};
