import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { collabService } from '@/services/collab.service';
import { queryKeys } from '@/lib/query-client';
import { useCurrentWalletSafe, useWallet } from '@/contexts/WalletContext';
import type {
  CollabFeedFilters,
  CreateCollabRequest,
  UpdateCollabStatusRequest,
  PingCollabRequest,
} from '@/types/collab';

// Hook to fetch collaboration feed
export const useCollabFeed = (filters: CollabFeedFilters = {}) => {
  const wallet = useCurrentWalletSafe();
  const { isReady } = useWallet();
  
  return useQuery({
    queryKey: queryKeys.collabFeed(filters),
    queryFn: () => {
      if (!wallet) {
        throw new Error('No wallet connected');
      }
      return collabService.getCollabFeed(filters, wallet);
    },
    enabled: !!wallet && isReady,
  });
};

// Hook to create a new collaboration
export const useCreateCollab = () => {
  const wallet = useCurrentWalletSafe();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCollabRequest) => {
      if (!wallet) {
        throw new Error('No wallet connected');
      }
      return collabService.createCollab(data, wallet);
    },
    onSuccess: (response) => {
      toast.success('Collaboration created successfully!');
      // Invalidate and refetch collab feed
      queryClient.invalidateQueries({ queryKey: queryKeys.collabFeed({}) });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create collaboration');
    },
  });
};

// Hook to update collaboration status
export const useUpdateCollabStatus = () => {
  const wallet = useCurrentWalletSafe();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ collabId, data }: { collabId: string; data: UpdateCollabStatusRequest }) => {
      if (!wallet) {
        throw new Error('No wallet connected');
      }
      return collabService.updateCollabStatus(collabId, data, wallet);
    },
    onSuccess: (response, { collabId }) => {
      toast.success('Collaboration status updated');
      // Invalidate specific collab and feed queries
      queryClient.invalidateQueries({ queryKey: queryKeys.collab(collabId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.collabFeed({}) });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update collaboration status');
    },
  });
};

// Hook to ping a collaboration
export const usePingCollab = () => {
  const wallet = useCurrentWalletSafe();
  
  return useMutation({
    mutationFn: ({ collabId, data }: { collabId: string; data: PingCollabRequest }) => {
      if (!wallet) {
        throw new Error('No wallet connected');
      }
      return collabService.pingCollab(collabId, data, wallet);
    },
    onSuccess: (response) => {
      toast.success('Ping sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send ping');
    },
  });
};
