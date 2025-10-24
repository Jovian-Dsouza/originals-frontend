import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { userService } from '@/services/user.service';
import { setPrivyAccessTokenGetter } from '@/lib/api-client';
import { getProfile } from '@zoralabs/coins-sdk';

interface WalletContextType {
  zoraWallet: string | null;
  isConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isLoading: boolean;
  isReady: boolean;
  isOnboarded: boolean | null; // null = loading/unknown, true = onboarded, false = not onboarded
  onboardingError: string | null;
  checkOnboardingStatus: () => Promise<void>;
  retryOnboardingCheck: () => void;
  setOnboarded: (onboarded: boolean) => void;
  zoraProfile: any | null; // Zora profile data
  zoraProfileLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

// Mock wallet addresses for prototype (fallback)
const MOCK_WALLETS = [
  '0x1111111111111111111111111111111111111111',
  '0x2222222222222222222222222222222222222222',
  '0x3333333333333333333333333333333333333333',
];

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { user, authenticated, ready, getAccessToken } = usePrivy();
  const [zoraWallet, setZoraWallet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [zoraProfile, setZoraProfile] = useState<any | null>(null);
  const [zoraProfileLoading, setZoraProfileLoading] = useState(false);

  // Set up Privy access token getter for API client
  useEffect(() => {
    setPrivyAccessTokenGetter(async () => {
      try {
        return await getAccessToken();
      } catch (error) {
        console.warn('Could not retrieve access token:', error);
        return null;
      }
    });
  }, [getAccessToken]);

  // Debug state changes
  useEffect(() => {
    console.log('WalletContext - isOnboarded state changed to:', isOnboarded);
  }, [isOnboarded]);

  // Retry logic with exponential backoff
  const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3): Promise<any> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  };

  // Check onboarding status with retry logic
  const checkOnboardingStatus = useCallback(async () => {
    if (!zoraWallet) return;
    
    console.log('Starting onboarding status check for wallet:', zoraWallet);
    setOnboardingError(null);
    setRetryCount(0);
    
    try {
      const response = await retryWithBackoff(async () => {
        console.log('Making API call to check onboarding status...');
        return await userService.checkOnboardingStatus(zoraWallet);
      });
      
      console.log('Onboarding status response:', response);
      console.log('Setting isOnboarded to:', response.isOnboarded);
      setIsOnboarded(response.isOnboarded);
    } catch (error) {
      console.error('Onboarding status check failed:', error);
      
      // For prototype/development, if API is not available, assume user is not onboarded
      if (error instanceof Error && error.message.includes('fetch')) {
        console.log('API not available, assuming user needs onboarding');
        setIsOnboarded(false);
        setOnboardingError(null);
      } else {
        setOnboardingError(error instanceof Error ? error.message : 'Failed to check onboarding status');
        setIsOnboarded(null);
      }
    }
  }, [zoraWallet]);

  // Retry onboarding check
  const retryOnboardingCheck = () => {
    setRetryCount(prev => prev + 1);
    checkOnboardingStatus();
  };

  // Set onboarded status (used after completing onboarding)
  const setOnboarded = (onboarded: boolean) => {
    setIsOnboarded(onboarded);
    setOnboardingError(null);
  };

  // Fetch Zora profile data
  const fetchZoraProfile = useCallback(async (walletAddress: string) => {
    if (!walletAddress) return;
    
    setZoraProfileLoading(true);
    try {
      console.log('Fetching Zora profile for wallet:', walletAddress);
      const profileResponse = await getProfile({
        identifier: walletAddress,
      });
      
      const profile = profileResponse?.data?.profile;
      console.log('Zora profile data:', profile);
      setZoraProfile(profile);
    } catch (error) {
      console.error('Failed to fetch Zora profile:', error);
      setZoraProfile(null);
    } finally {
      setZoraProfileLoading(false);
    }
  }, []);

  // Extract Zora wallet from Privy user
  useEffect(() => {
    if (!ready) {
      return;
    }

    if (authenticated && user?.linkedAccounts) {
      // Look for Zora wallet in linked accounts
      const crossAppAccount = user.linkedAccounts.find(account => account.type === 'cross_app');
      
      if (crossAppAccount?.smartWallets && crossAppAccount.smartWallets.length > 0) {
        // Use the first Zora smart wallet
        const walletAddress = crossAppAccount.smartWallets[0].address;
        setZoraWallet(walletAddress);
        localStorage.setItem('zora-wallet', walletAddress);
      } else if (user.wallet?.address) {
        // Fallback to regular wallet address
        setZoraWallet(user.wallet.address);
        localStorage.setItem('zora-wallet', user.wallet.address);
      } else {
        // No wallet found, try to use mock wallet for prototype
        const mockWallet = MOCK_WALLETS[0];
        setZoraWallet(mockWallet);
        localStorage.setItem('zora-wallet', mockWallet);
      }
    } else if (authenticated && user?.wallet?.address) {
      // User is authenticated but no linked accounts, use regular wallet
      setZoraWallet(user.wallet.address);
      localStorage.setItem('zora-wallet', user.wallet.address);
    } else {
      // Check localStorage for saved wallet
      const savedWallet = localStorage.getItem('zora-wallet');
      if (savedWallet) {
        setZoraWallet(savedWallet);
      } else {
        // Use mock wallet for prototype
        const mockWallet = MOCK_WALLETS[0];
        setZoraWallet(mockWallet);
        localStorage.setItem('zora-wallet', mockWallet);
      }
    }
  }, [user, authenticated, ready]);

  // Fetch Zora profile when wallet is available
  useEffect(() => {
    if (zoraWallet && authenticated) {
      fetchZoraProfile(zoraWallet);
    }
  }, [zoraWallet, authenticated, fetchZoraProfile]);

  // Check onboarding status when wallet is available and user is authenticated
  useEffect(() => {
    if (authenticated && zoraWallet && isOnboarded === null) {
      console.log('Checking onboarding status for wallet:', zoraWallet);
      
      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('Onboarding check timeout, assuming user needs onboarding');
        setIsOnboarded(false);
      }, 10000); // 10 second timeout
      
      checkOnboardingStatus().finally(() => {
        clearTimeout(timeoutId);
      });
    }
  }, [authenticated, zoraWallet, isOnboarded, checkOnboardingStatus]);

  const connectWallet = async () => {
    setIsLoading(true);
    
    // If Privy is not authenticated, use mock wallet for prototype
    if (!authenticated) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const randomWallet = MOCK_WALLETS[Math.floor(Math.random() * MOCK_WALLETS.length)];
      setZoraWallet(randomWallet);
      localStorage.setItem('zora-wallet', randomWallet);
    }
    
    setIsLoading(false);
  };

  const disconnectWallet = () => {
    setZoraWallet(null);
    localStorage.removeItem('zora-wallet');
  };

  const value: WalletContextType = {
    zoraWallet,
    isConnected: !!zoraWallet,
    connectWallet,
    disconnectWallet,
    isLoading,
    isReady: ready,
    isOnboarded,
    onboardingError,
    checkOnboardingStatus,
    retryOnboardingCheck,
    setOnboarded,
    zoraProfile,
    zoraProfileLoading,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Hook to get current wallet address with error handling
export const useCurrentWallet = (): string => {
  const { zoraWallet } = useWallet();
  
  if (!zoraWallet) {
    throw new Error('No wallet connected. Please connect your wallet first.');
  }
  
  return zoraWallet;
};

// Hook to get current wallet address safely (returns null if not connected)
export const useCurrentWalletSafe = (): string | null => {
  const { zoraWallet } = useWallet();
  return zoraWallet;
};
