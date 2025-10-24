// Environment configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws',
} as const;

// API Response wrapper types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Error types
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    walletAddress?: string,
    additionalHeaders?: HeadersInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
      ...options.headers,
    };

    // Add wallet header if provided
    if (walletAddress) {
      headers['X-Zora-Wallet'] = walletAddress;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error?.code || 'UNKNOWN_ERROR',
          data.error?.message || 'An unknown error occurred',
          response.status
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(
        'NETWORK_ERROR',
        error instanceof Error ? error.message : 'Network error occurred'
      );
    }
  }

  async get<T>(endpoint: string, walletAddress?: string, additionalHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' }, walletAddress, additionalHeaders);
  }

  async post<T>(endpoint: string, data?: any, walletAddress?: string, additionalHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, walletAddress, additionalHeaders);
  }

  async patch<T>(endpoint: string, data?: any, walletAddress?: string, additionalHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, walletAddress, additionalHeaders);
  }

  async delete<T>(endpoint: string, walletAddress?: string, additionalHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' }, walletAddress, additionalHeaders);
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);

// Helper function to get JWT auth headers
export const getAuthHeaders = async (): Promise<HeadersInit> => {
  try {
    // Try to get access token from Privy
    // This will be called from components that have access to Privy context
    const token = await getPrivyAccessToken();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
      };
    }
  } catch (error) {
    console.warn('Could not retrieve access token:', error);
  }
  return {};
};

// Helper function to get Privy access token
// This will be overridden by components that have access to Privy context
let getPrivyAccessToken: () => Promise<string | null> = async () => null;

export const setPrivyAccessTokenGetter = (getter: () => Promise<string | null>) => {
  getPrivyAccessToken = getter;
};

// Convenience function for authenticated requests
export const makeAuthenticatedRequest = <T>(
  endpoint: string,
  options: RequestInit = {},
  walletAddress: string
): Promise<ApiResponse<T>> => {
  return apiClient.get<T>(endpoint, walletAddress);
};
