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
    onMutate: async ({ pingId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.receivedPings(wallet || '', {}) });
      
      // Snapshot the previous value
      const previousPings = queryClient.getQueryData(queryKeys.receivedPings(wallet || '', {}));
      
      // Optimistically update to remove the ping
      queryClient.setQueryData(queryKeys.receivedPings(wallet || '', {}), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pings: old.pings.filter((ping: any) => ping.id !== pingId)
        };
      });
      
      // Return a context object with the snapshotted value
      return { previousPings };
    },
    onError: (error: any, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPings) {
        queryClient.setQueryData(queryKeys.receivedPings(wallet || '', {}), context.previousPings);
      }
      toast.error(error.message || 'Failed to respond to ping');
    },
    onSuccess: (response, { data }) => {
      const action = data.action === 'accept' ? 'accepted' : 'declined';
      toast.success(`Ping ${action} successfully!`);
      
      // Invalidate matches query in case a new match was created
      queryClient.invalidateQueries({ queryKey: queryKeys.matches(wallet || '', {}) });
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
