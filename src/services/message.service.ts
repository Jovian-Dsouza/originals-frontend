import { apiClient } from '@/lib/api-client';
import type {
  MessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  MarkAsReadResponse,
  MessagesFilters,
} from '@/types/collab';

export const messageService = {
  // Get messages for a match
  async getMessages(
    matchId: string, 
    filters: MessagesFilters = {}, 
    walletAddress: string
  ): Promise<MessagesResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = queryString 
      ? `/matches/${matchId}/messages?${queryString}` 
      : `/matches/${matchId}/messages`;
    
    const response = await apiClient.get<MessagesResponse>(endpoint, walletAddress);
    return response.data!;
  },

  // Send a message in a match
  async sendMessage(
    matchId: string, 
    data: SendMessageRequest, 
    walletAddress: string
  ): Promise<SendMessageResponse> {
    const response = await apiClient.post<SendMessageResponse>(
      `/matches/${matchId}/messages`, 
      data, 
      walletAddress
    );
    return response.data!;
  },

  // Mark messages as read in a match
  async markAsRead(matchId: string, walletAddress: string): Promise<MarkAsReadResponse> {
    const response = await apiClient.post<MarkAsReadResponse>(
      `/matches/${matchId}/messages/read`, 
      {}, 
      walletAddress
    );
    return response.data!;
  },
};
