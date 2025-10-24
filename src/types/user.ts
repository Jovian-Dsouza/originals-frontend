// User onboarding types matching API requirements

export interface OnboardingStatusResponse {
  success: boolean;
  isOnboarded: boolean;
  data?: {
    userId: string;
    userType: "indie" | "commercial";
    creativeDomains: string[];
    status: "available" | "gigs" | "collabs" | "exploring";
    profileData: {
      name: string;
      tagline: string;
      orgName?: string | null;
      orgType?: string | null;
      collabCount: number;
      deltaCollabs: number;
      skills: string[];
    };
    walletAddress?: string | null;
    zoraWalletAddress: string;
    onboardedAt: string;
  } | null;
}

export interface OnboardingData {
  userType: "indie" | "commercial";
  creativeDomains: string[];
  status: "available" | "gigs" | "collabs" | "exploring";
  profileData: {
    name: string;
    tagline: string;
    orgName?: string;
    orgType?: string;
    skills: string[];
  };
  walletAddress?: string | null;
  zoraWalletAddress: string;
}

export interface CompleteOnboardingResponse {
  success: boolean;
  data: {
    userId: string;
    isOnboarded: boolean;
    message: string;
  };
}

// User profile types
export interface UserProfile {
  userId: string;
  userType: "indie" | "commercial";
  creativeDomains: string[];
  status: "available" | "gigs" | "collabs" | "exploring";
  profileData: {
    name: string;
    tagline: string;
    orgName?: string | null;
    orgType?: string | null;
    collabCount: number;
    deltaCollabs: number;
    skills: string[];
  };
  walletAddress?: string | null;
  zoraWalletAddress: string;
  onboardedAt: string;
}
