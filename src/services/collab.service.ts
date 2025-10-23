import { apiClient } from '@/lib/api-client';
import type {
  CollabFeedResponse,
  CreateCollabRequest,
  CreateCollabResponse,
  UpdateCollabStatusRequest,
  UpdateCollabStatusResponse,
  PingCollabRequest,
  PingResponse,
  CollabFeedFilters,
} from '@/types/collab';

export const collabService = {
  // Get collaboration feed with filters
  async getCollabFeed(filters: CollabFeedFilters = {}, walletAddress: string): Promise<CollabFeedResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.filter) params.append('filter', filters.filter);
    if (filters.location) params.append('location', filters.location);
    if (filters.excludeUser) params.append('excludeUser', filters.excludeUser);

    const queryString = params.toString();
    const endpoint = queryString ? `/collabs/feed?${queryString}` : '/collabs/feed';
    
    const response = await apiClient.get<CollabFeedResponse>(endpoint, walletAddress);
    return response.data!;
  },

  // Create a new collaboration post
  async createCollab(data: CreateCollabRequest, walletAddress: string): Promise<CreateCollabResponse> {
    const response = await apiClient.post<CreateCollabResponse>('/collabs', data, walletAddress);
    return response.data!;
  },

  // Update collaboration post status
  async updateCollabStatus(
    collabId: string, 
    data: UpdateCollabStatusRequest, 
    walletAddress: string
  ): Promise<UpdateCollabStatusResponse> {
    const response = await apiClient.patch<UpdateCollabStatusResponse>(
      `/collabs/${collabId}`, 
      data, 
      walletAddress
    );
    return response.data!;
  },

  // Ping a collaboration post
  async pingCollab(collabId: string, data: PingCollabRequest, walletAddress: string): Promise<PingResponse> {
    const response = await apiClient.post<PingResponse>(`/collabs/${collabId}/ping`, data, walletAddress);
    return response.data!;
  },
};
