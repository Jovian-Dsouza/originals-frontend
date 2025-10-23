import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { matchService } from '@/services/match.service';
import { queryKeys } from '@/lib/query-client';
import { useCurrentWalletSafe, useWallet } from '@/contexts/WalletContext';
import type {
  PingsFilters,
  MatchesFilters,
  RespondToPingRequest,
} from '@/types/collab';

// Hook to fetch received pings
export const useReceivedPings = (filters: PingsFilters = {}) => {
  const wallet = useCurrentWalletSafe();
  const { isReady } = useWallet();
  
  return useQuery({
    queryKey: queryKeys.receivedPings(wallet || '', filters),
    queryFn: () => {
      if (!wallet) {
        throw new Error('No wallet connected');
      }
      return matchService.getReceivedPings(wallet, filters);
    },
    enabled: !!wallet && isReady,
  });
};

// Hook to respond to a ping (accept/decline)
export const useRespondToPing = () => {
  const wallet = useCurrentWalletSafe();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ pingId, data }: { pingId: string; data: RespondToPingRequest }) => {
      if (!wallet) {
        throw new Error('No wallet connected');
      }
      return matchService.respondToPing(pingId, data, wallet);
    },
    onSuccess: (response, { data }) => {
      const action = data.action === 'accept' ? 'accepted' : 'declined';
      toast.success(`Ping ${action} successfully!`);
      
      // Invalidate pings and matches queries
      queryClient.invalidateQueries({ queryKey: queryKeys.receivedPings(wallet || '', {}) });
      queryClient.invalidateQueries({ queryKey: queryKeys.matches(wallet || '', {}) });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to respond to ping');
    },
  });
};

// Hook to fetch matches
export const useMatches = (filters: MatchesFilters = {}) => {
  const wallet = useCurrentWalletSafe();
  const { isReady } = useWallet();
  
  return useQuery({
    queryKey: queryKeys.matches(wallet || '', filters),
    queryFn: () => {
      if (!wallet) {
        throw new Error('No wallet connected');
      }
      return matchService.getMatches(wallet, filters);
    },
    enabled: !!wallet && isReady,
  });
};
