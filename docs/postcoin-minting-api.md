# PostCoin Minting API Specification

## Endpoint: POST /api/collabs/mint-postcoin

### Purpose
Creates a new collaboration post and mints a corresponding PostCoin on Zora Protocol.

### Request Body

```typescript
interface MintPostCoinRequest {
  // Basic project information
  title: string;
  description: string;
  
  // Media content
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
  creatorWallet: string;       // Creator's wallet address
  
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

interface CollaboratorRole {
  role: string;
  creatorType: "indie" | "org" | "brand";
  credits: number;             // Percentage (must total 100)
  compensationType: "paid" | "barter" | "both";
  timeCommitment: "ongoing" | "one-time";
  jobDescription?: string;
}
```

### Response

```typescript
interface MintPostCoinResponse {
  success: boolean;
  data: {
    collabPostId: string;      // Database ID
    coinAddress: string;       // Zora coin contract address
    coinName: string;          // Generated coin name
    coinSymbol: string;        // Generated coin symbol
    transactionHash?: string; // Blockchain transaction hash
    zoraUrl: string;          // Zora.co URL for the coin
  };
  message: string;
  errors?: string[];
}
```

### Example Request

```json
{
  "title": "Epic Sci-Fi Short Film",
  "description": "Looking for talented VFX artists and sound designers to collaborate on an ambitious sci-fi short film project.",
  "media": {
    "ipfsUrl": "ipfs://QmYourHashHere",
    "gatewayUrl": "https://gateway.pinata.cloud/ipfs/QmYourHashHere",
    "fileName": "project-concept.jpg",
    "fileType": "image/jpeg",
    "fileSize": 2048576
  },
  "collaboration": {
    "role": "Film Director",
    "paymentType": "both",
    "credits": 100,
    "workStyle": "freestyle",
    "location": "Remote",
    "collaborators": [
      {
        "role": "VFX Artist",
        "creatorType": "indie",
        "credits": 30,
        "compensationType": "paid",
        "timeCommitment": "ongoing",
        "jobDescription": "Create stunning visual effects for space scenes"
      },
      {
        "role": "Sound Designer",
        "creatorType": "indie",
        "credits": 25,
        "compensationType": "barter",
        "timeCommitment": "one-time",
        "jobDescription": "Design immersive audio experience"
      },
      {
        "role": "Cinematographer",
        "creatorType": "org",
        "credits": 45,
        "compensationType": "both",
        "timeCommitment": "ongoing",
        "jobDescription": "Capture cinematic shots and lighting"
      }
    ],
    "expiresAt": "2024-12-31T23:59:59Z"
  },
  "creatorWallet": "0x1234567890abcdef1234567890abcdef12345678",
  "metadata": {
    "tags": ["film", "sci-fi", "vfx", "collaboration"],
    "category": "film-production",
    "estimatedDuration": "3-6 months",
    "budget": {
      "min": 5000,
      "max": 15000,
      "currency": "USD"
    }
  }
}
```

### Example Response

```json
{
  "success": true,
  "data": {
    "collabPostId": "collab_abc123def456",
    "coinAddress": "0x9876543210fedcba9876543210fedcba98765432",
    "coinName": "Epic Sci-Fi Short Film",
    "coinSymbol": "SCIFI",
    "transactionHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "zoraUrl": "https://zora.co/collect/base:0x9876543210fedcba9876543210fedcba98765432"
  },
  "message": "PostCoin minted successfully! Your collaboration is now live."
}
```

## Backend Implementation Flow

### 1. Validation
- Validate request data structure
- Ensure credits total 100%
- Verify wallet address format
- Check IPFS URL accessibility

### 2. Database Operations
- Create collaboration post record
- Store media metadata
- Save collaborator roles and requirements

### 3. Zora Integration
- Generate unique coin name and symbol
- Create Zora coin with metadata:
  - Name: Project title
  - Symbol: Generated from title (e.g., "EPIC" for "Epic Sci-Fi Film")
  - Description: Project description
  - Image: IPFS gateway URL
  - Creator: Wallet address

### 4. Blockchain Transaction
- Mint initial supply of coins
- Set up royalty structure based on credits
- Configure transfer restrictions if needed

### 5. Response
- Return success with coin details
- Provide Zora.co URL for sharing
- Log transaction for tracking

## Error Handling

### Common Error Responses

```typescript
// Validation Error
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Credits must total exactly 100%",
    "Invalid wallet address format",
    "IPFS URL is not accessible"
  ]
}

// Zora Integration Error
{
  "success": false,
  "message": "Failed to mint PostCoin",
  "errors": [
    "Zora API error: Insufficient funds",
    "Transaction failed: Gas limit exceeded"
  ]
}

// Database Error
{
  "success": false,
  "message": "Failed to create collaboration post",
  "errors": [
    "Database connection error"
  ]
}
```

## Security Considerations

1. **Wallet Verification**: Verify wallet ownership through signature
2. **Rate Limiting**: Prevent spam minting
3. **Content Moderation**: Scan IPFS content for inappropriate material
4. **Gas Optimization**: Estimate gas costs before transaction
5. **Error Recovery**: Handle partial failures gracefully

## Integration Notes

- This API should be called after successful IPFS upload
- Frontend should handle loading states during minting process
- Consider implementing retry logic for failed transactions
- Store transaction receipts for audit purposes
