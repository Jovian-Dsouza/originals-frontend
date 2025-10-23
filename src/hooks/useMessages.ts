import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { messageService } from '@/services/message.service';
import { queryKeys } from '@/lib/query-client';
import { useCurrentWalletSafe, useWallet } from '@/contexts/WalletContext';
import type {
  MessagesFilters,
  SendMessageRequest,
} from '@/types/collab';

// Hook to fetch messages for a match
export const useMessages = (matchId: string, filters: MessagesFilters = {}) => {
  const wallet = useCurrentWalletSafe();
  const { isReady } = useWallet();
  
  return useQuery({
    queryKey: queryKeys.messages(matchId, filters),
    queryFn: () => {
      if (!wallet) {
        throw new Error('No wallet connected');
      }
      return messageService.getMessages(matchId, filters, wallet);
    },
    enabled: !!wallet && !!matchId && isReady,
  });
};

// Hook to send a message
export const useSendMessage = (matchId: string) => {
  const wallet = useCurrentWalletSafe();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SendMessageRequest) => {
      if (!wallet) {
        throw new Error('No wallet connected');
      }
      return messageService.sendMessage(matchId, data, wallet);
    },
    onSuccess: () => {
      // Invalidate messages query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(matchId, {}) });
      // Also invalidate matches to update lastMessageAt and unreadCount
      queryClient.invalidateQueries({ queryKey: queryKeys.matches(wallet || '', {}) });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
};

// Hook to mark messages as read
export const useMarkAsRead = (matchId: string) => {
  const wallet = useCurrentWalletSafe();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => {
      if (!wallet) {
        throw new Error('No wallet connected');
      }
      return messageService.markAsRead(matchId, wallet);
    },
    onSuccess: () => {
      // Invalidate messages and matches queries
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(matchId, {}) });
      queryClient.invalidateQueries({ queryKey: queryKeys.matches(wallet || '', {}) });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark messages as read');
    },
  });
};
