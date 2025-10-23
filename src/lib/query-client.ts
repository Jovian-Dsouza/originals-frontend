import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  // Collab queries
  collabFeed: (filters: any) => ['collabFeed', filters] as const,
  collab: (id: string) => ['collab', id] as const,
  
  // Match queries
  receivedPings: (wallet: string, filters?: any) => ['receivedPings', wallet, filters] as const,
  matches: (wallet: string, filters?: any) => ['matches', wallet, filters] as const,
  
  // Message queries
  messages: (matchId: string, filters?: any) => ['messages', matchId, filters] as const,
  
  // Zora coin queries
  coinData: (coinAddress: string) => ['coinData', coinAddress] as const,
} as const;
