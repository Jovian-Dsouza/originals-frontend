// PostCoin Minting API Types

export interface MintPostCoinRequest {
  // Basic project information
  title: string;               // min(1).max(200)
  description: string;         // min(10).max(2000)
  
  // Media content - REQUIRED
  media: {
    ipfsUrl: string;           // IPFS URI (e.g., "ipfs://QmHash...")
    gatewayUrl: string;        // Gateway URL for preview
    fileName: string;
    fileType: string;
    fileSize: number;
  };
  
  // Collaboration data - matches CollaborationSchema
  collaboration: {
    role: string;              // min(1).max(100)
    paymentType: "paid" | "barter" | "both";
    credits: number;           // min(0).max(100) - total credits
    workStyle: "contract" | "freestyle";
    location: string;          // min(1).max(100)
    collaborators: CollaboratorRole[];
    expiresAt?: string;        // Optional expiration date
  };
  
  // Wallet information
  creatorWallet: string;       // Must match regex: /^0x[a-fA-F0-9]{40}$/
  
  // Optional metadata
  metadata?: {
    tags?: string[];
    category?: string;
    estimatedDuration?: string;
    budget?: {
      min?: number;
      max?: number;
      currency?: string;
    };
  };
}

export interface CollaboratorRole {
  role: string;
  creatorType: "indie" | "org" | "brand";
  credits: number;             // Percentage (must total 100)
  compensationType: "paid" | "barter" | "both";
  timeCommitment: "ongoing" | "one-time";
  jobDescription?: string;
}

export interface MintPostCoinResponse {
  success: boolean;
  data: {
    collabPostId: string;      // Database ID
    coinAddress: string;        // Zora coin contract address
    coinName: string;          // Generated coin name
    coinSymbol: string;        // Generated coin symbol
    transactionHash?: string;   // Blockchain transaction hash
    zoraUrl: string;          // Zora.co URL for the coin
  };
  message: string;
  errors?: string[];
}

export interface MintPostCoinError {
  success: false;
  message: string;
  errors?: string[];
}
