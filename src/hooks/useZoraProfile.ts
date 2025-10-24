import { useState, useEffect, useCallback } from 'react';
import { getProfile } from '@zoralabs/coins-sdk';

export interface ZoraProfile {
  address: string;
  name?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  discord?: string;
  telegram?: string;
  github?: string;
  linkedin?: string;
  verified?: boolean;
  followerCount?: number;
  followingCount?: number;
  coinCount?: number;
  createdAt?: string;
}

interface UseZoraProfileReturn {
  profile: ZoraProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Cache for profile data to avoid repeated API calls
const profileCache = new Map<string, { data: ZoraProfile; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useZoraProfile = (walletAddress: string | null): UseZoraProfileReturn => {
  const [profile, setProfile] = useState<ZoraProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (address: string) => {
    // Check cache first
    const cached = profileCache.get(address);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setProfile(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching Zora profile for wallet:', address);
      const profileResponse = await getProfile({
        identifier: address,
      });

      const profileData = profileResponse?.data?.profile;
      
      if (profileData) {
        // Transform the profile data to our interface
        const transformedProfile: ZoraProfile = {
          address: address,
          name: profileData.name || profileData.username,
          bio: profileData.bio,
          avatar: profileData.avatar,
          banner: profileData.banner,
          website: profileData.website,
          twitter: profileData.twitter,
          instagram: profileData.instagram,
          tiktok: profileData.tiktok,
          youtube: profileData.youtube,
          discord: profileData.discord,
          telegram: profileData.telegram,
          github: profileData.github,
          linkedin: profileData.linkedin,
          verified: profileData.verified,
          followerCount: profileData.followerCount,
          followingCount: profileData.followingCount,
          coinCount: profileData.coinCount,
          createdAt: profileData.createdAt,
        };

        // Cache the result
        profileCache.set(address, { data: transformedProfile, timestamp: Date.now() });
        
        setProfile(transformedProfile);
        console.log('Zora profile data:', transformedProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Failed to fetch Zora profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (walletAddress) {
      // Clear cache and refetch
      profileCache.delete(walletAddress);
      fetchProfile(walletAddress);
    }
  }, [walletAddress, fetchProfile]);

  useEffect(() => {
    if (walletAddress) {
      fetchProfile(walletAddress);
    } else {
      setProfile(null);
      setError(null);
    }
  }, [walletAddress, fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch,
  };
};

// Utility function to get display name for a wallet address
export const getDisplayName = (profile: ZoraProfile | null, walletAddress: string): string => {
  if (profile?.name) {
    return profile.name;
  }
  
  // Fallback to truncated wallet address
  return `@${walletAddress.slice(0, 8)}...`;
};

// Utility function to get avatar URL
export const getAvatarUrl = (profile: any): string | null => {
  console.log('Profile:', profile);
  return profile?.avatar.small || null;
};
