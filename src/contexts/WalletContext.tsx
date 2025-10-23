import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface WalletContextType {
  zoraWallet: string | null;
  isConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isLoading: boolean;
  isReady: boolean;
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
  const { user, authenticated, ready } = usePrivy();
  const [zoraWallet, setZoraWallet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
