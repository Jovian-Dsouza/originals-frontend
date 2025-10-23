import { getCoin } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";
import type { ZoraCoinData } from "@/types/collab";

// Cache for coin data to avoid repeated API calls
const coinDataCache = new Map<string, ZoraCoinData>();

export const fetchCoinData = async (coinAddress: string): Promise<ZoraCoinData | null> => {
  // Check cache first
  if (coinDataCache.has(coinAddress)) {
    return coinDataCache.get(coinAddress)!;
  }

  try {
    const response = await getCoin({
      address: coinAddress,
      chain: base.id,
    });

    const coin = response.data?.zora20Token;
    
    if (!coin) {
      console.warn(`No coin data found for address: ${coinAddress}`);
      return null;
    }

    // Transform Zora API response to our format
    const coinData: ZoraCoinData = {
      name: coin.name || "Untitled Coin",
      symbol: coin.symbol || "COIN",
      description: coin.description || "No description available",
      totalSupply: coin.totalSupply || "0",
      marketCap: coin.marketCap || "0",
      volume24h: coin.volume24h || "0",
      creatorAddress: coin.creatorAddress || "",
      createdAt: coin.createdAt || new Date().toISOString(),
      uniqueHolders: coin.uniqueHolders || 0,
      mediaContent: {
        previewImage: coin.mediaContent?.previewImage,
      },
    };

    // Cache the result
    coinDataCache.set(coinAddress, coinData);
    
    return coinData;
  } catch (error) {
    console.error(`Failed to fetch coin data for ${coinAddress}:`, error);
    return null;
  }
};

// Batch fetch multiple coins
export const fetchMultipleCoins = async (coinAddresses: string[]): Promise<Map<string, ZoraCoinData>> => {
  const results = new Map<string, ZoraCoinData>();
  
  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < coinAddresses.length; i += batchSize) {
    const batch = coinAddresses.slice(i, i + batchSize);
    
    const promises = batch.map(async (address) => {
      const data = await fetchCoinData(address);
      if (data) {
        results.set(address, data);
      }
    });
    
    await Promise.all(promises);
    
    // Small delay between batches
    if (i + batchSize < coinAddresses.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
};

// Clear cache (useful for testing or when data might be stale)
export const clearCoinDataCache = () => {
  coinDataCache.clear();
};

// Get cached coin data without fetching
export const getCachedCoinData = (coinAddress: string): ZoraCoinData | null => {
  return coinDataCache.get(coinAddress) || null;
};
