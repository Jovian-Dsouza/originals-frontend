import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ZoraCoinData } from "@/types/collab";

interface CoinInfoProps {
  coinData?: ZoraCoinData;
  isLoading?: boolean;
  showMarketData?: boolean;
  className?: string;
}

export const CoinInfo = ({ 
  coinData, 
  isLoading = false, 
  showMarketData = true,
  className = "" 
}: CoinInfoProps) => {
  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        {showMarketData && (
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-18" />
          </div>
        )}
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-muted-foreground text-sm">No coin data available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Coin Header */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {coinData.symbol.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm truncate">{coinData.name}</h3>
          <p className="text-xs text-muted-foreground">
            @{coinData.creatorAddress.slice(0, 8)}...
          </p>
        </div>
      </div>

      {/* Description */}
      {coinData.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {coinData.description}
        </p>
      )}

      {/* Market Data */}
      {showMarketData && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {coinData.uniqueHolders} holders
          </Badge>
          {coinData.marketCap && coinData.marketCap !== "0" && (
            <Badge variant="outline" className="text-xs">
              MC: {formatNumber(coinData.marketCap)}
            </Badge>
          )}
          {coinData.volume24h && coinData.volume24h !== "0" && (
            <Badge variant="outline" className="text-xs">
              Vol: {formatNumber(coinData.volume24h)}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to format large numbers
const formatNumber = (value: string): string => {
  const num = parseFloat(value);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(2);
};

// Compact version for cards
export const CoinInfoCompact = ({ 
  coinData, 
  isLoading = false,
  className = "" 
}: Omit<CoinInfoProps, 'showMarketData'>) => {
  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className={`text-xs text-muted-foreground ${className}`}>
        No coin data
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar className="h-6 w-6 border border-primary/20">
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
          {coinData.symbol.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs font-medium truncate">{coinData.name}</span>
    </div>
  );
};
