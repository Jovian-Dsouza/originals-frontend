import { apiClient } from '@/lib/api-client';
import type {
  PingsReceivedResponse,
  RespondToPingRequest,
  RespondToPingResponse,
  MatchesResponse,
  PingsFilters,
  MatchesFilters,
} from '@/types/collab';

export const matchService = {
  // Get received pings for a wallet
  async getReceivedPings(
    walletAddress: string, 
    filters: PingsFilters = {}
  ): Promise<PingsReceivedResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = queryString 
      ? `/wallets/${walletAddress}/pings/received?${queryString}` 
      : `/wallets/${walletAddress}/pings/received`;
    
    const response = await apiClient.get<PingsReceivedResponse>(endpoint, walletAddress);
    return response.data!;
  },

  // Respond to a ping (accept or decline)
  async respondToPing(
    pingId: string, 
    data: RespondToPingRequest, 
    walletAddress: string
  ): Promise<RespondToPingResponse> {
    const response = await apiClient.post<RespondToPingResponse>(
      `/pings/${pingId}/respond`, 
      data, 
      walletAddress
    );
    return response.data!;
  },

  // Get matches for a wallet
  async getMatches(
    walletAddress: string, 
    filters: MatchesFilters = {}
  ): Promise<MatchesResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = queryString 
      ? `/wallets/${walletAddress}/matches?${queryString}` 
      : `/wallets/${walletAddress}/matches`;
    
    const response = await apiClient.get<MatchesResponse>(endpoint, walletAddress);
    return response.data!;
  },
};
