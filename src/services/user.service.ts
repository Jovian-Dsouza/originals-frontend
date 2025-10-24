import { apiClient, getAuthHeaders } from '@/lib/api-client';
import type {
  OnboardingStatusResponse,
  OnboardingData,
  CompleteOnboardingResponse,
} from '@/types/user';

export const userService = {
  // Check if user has completed onboarding
  async checkOnboardingStatus(zoraWalletAddress: string): Promise<OnboardingStatusResponse> {
    const authHeaders = await getAuthHeaders();
    const response = await apiClient.get<OnboardingStatusResponse>(
      `/users/${zoraWalletAddress}/onboarding-status`,
      zoraWalletAddress,
      authHeaders
    );
    // The API client returns the entire response from the server
    // Server returns: {success: true, isOnboarded: false, data: null}
    return response;
  },

  // Complete user onboarding process
  async completeOnboarding(
    zoraWalletAddress: string, 
    data: OnboardingData
  ): Promise<CompleteOnboardingResponse> {
    const authHeaders = await getAuthHeaders();
    const response = await apiClient.post<CompleteOnboardingResponse>(
      `/users/${zoraWalletAddress}/onboard`,
      data,
      zoraWalletAddress,
      authHeaders
    );
    return response;
  },
};
