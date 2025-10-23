# Backend API Requirements for CollabFeed and Contracts

This document outlines the API endpoints required to support the CollabFeed and Contracts functionality, replacing hardcoded data with dynamic backend data.

## Authentication

For this prototype, authentication uses Zora wallet addresses. All endpoints require a Zora wallet address in the request headers.

```
X-Zora-Wallet: <zora_wallet_address>
```

**Frontend Implementation:**

```typescript
// Making API calls with Zora wallet address
const makeApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const zoraWallet = getCurrentZoraWallet(); // Get from wallet connection
  
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'X-Zora-Wallet': zoraWallet,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  return response.json();
};
```

## Data Models

### **Collaboration Post Schema**

```typescript
interface CollaborationPost {
  id: string;                    // Unique collaboration post ID
  coinAddress: string;           // Zora coin contract address
  creatorWallet: string;         // Zora wallet address of the creator
  role: string;                 // Role being offered
  paymentType: "paid" | "barter" | "both";
  credits: boolean;              // Whether credits are offered
  workStyle: "contract" | "freestyle";
  location: string;              // Work location (e.g., "Remote", "LA", "NYC")
  status: "open" | "shortlisted" | "signed" | "closed";
  collaborators: CollaboratorRole[]; // Defined collaborator roles
  createdAt: string;            // ISO date string
  updatedAt: string;            // ISO date string
  expiresAt?: string;           // Optional expiration date
}

interface CollaboratorRole {
  role: string;                 // Role title
  creatorType: "indie" | "org" | "brand";
  credits: number;              // Credit percentage (0-100)
  compensationType: "paid" | "barter" | "both";
  timeCommitment: "ongoing" | "one-time";
  jobDescription?: string;      // Optional role description
}

// Zora Coin Data (fetched from Zora SDK)
interface ZoraCoinData {
  name: string;                 // Coin name
  symbol: string;               // Coin symbol
  description: string;          // Coin description
  totalSupply: string;          // Total supply
  marketCap: string;           // Market cap
  volume24h: string;           // 24h volume
  creatorAddress: string;      // Creator wallet address
  createdAt: string;            // Creation timestamp
  uniqueHolders: number;        // Number of unique holders
  mediaContent?: {
    previewImage?: string;     // Preview image URL
  };
}
```

### **Ping/Match Schema**

```typescript
interface Ping {
  id: string;                   // Unique ping ID
  collabPostId: string;         // ID of the collaboration post
  pingedWallet: string;         // Zora wallet address of pinger
  interestedRole: string;       // Role they're interested in
  bio: string;                  // Pinger's bio
  status: "pending" | "accepted" | "declined";
  createdAt: string;           // ISO date string
  respondedAt?: string;        // ISO date string
}

interface Match {
  id: string;                   // Unique match ID
  collabPostId: string;         // Original collaboration post ID
  creatorWallet: string;         // Zora wallet address of original post creator
  collaboratorWallet: string;   // Zora wallet address of matched collaborator
  projectName: string;           // Project name
  role: string;                 // Collaborator's role
  status: "active" | "completed" | "cancelled";
  createdAt: string;            // ISO date string
  lastMessageAt: string;        // ISO date string
  unreadCount: number;          // Unread messages count
}
```

### **Message Schema**

```typescript
interface Message {
  id: string;                   // Unique message ID
  matchId: string;              // Associated match ID
  senderWallet: string;          // Zora wallet address of sender
  content: string;               // Message content
  messageType: "text" | "image" | "file" | "milestone";
  attachments?: MessageAttachment[];
  createdAt: string;             // ISO date string
  readAt?: string;               // ISO date string
}

interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}
```

## API Endpoints

### 1. Get Collaboration Feed

**Endpoint:** `GET /api/collabs/feed`

**Description:** Returns paginated collaboration posts for the discovery feed with filtering support.

**Request:**
```http
GET /api/collabs/feed?page=1&limit=20&filter=paid&location=remote
X-Zora-Wallet: 0x1234567890123456789012345678901234567890
Content-Type: application/json
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 50)
- `filter` (optional): Filter by type (`paid`, `barter`, `credits`, `contract`, `freestyle`, `remote`)
- `location` (optional): Filter by location
- `excludeUser` (optional): Exclude posts from specific user ID

**Response:**
```json
{
  "success": true,
  "data": {
    "collabs": [
      {
        "id": "collab_001",
        "coinAddress": "0x445e9c0a296068dc4257767b5ed354b77cf513de",
        "creatorWallet": "0x1234567890123456789012345678901234567890",
        "role": "Actors in negative role",
        "paymentType": "paid",
        "credits": true,
        "workStyle": "contract",
        "location": "Remote",
        "status": "open",
        "collaborators": [
          {
            "role": "Actors in negative role",
            "creatorType": "indie",
            "credits": 30,
            "compensationType": "paid",
            "timeCommitment": "one-time",
            "jobDescription": "Must be comfortable with intense dramatic scenes"
          }
        ],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "coinData": {
          "name": "Dark Short Film",
          "symbol": "DSF",
          "description": "Seeking talented actors for negative roles in our psychological thriller short film. Must be comfortable with intense dramatic scenes.",
          "totalSupply": "1000000",
          "marketCap": "5000",
          "volume24h": "250",
          "creatorAddress": "0x1234567890123456789012345678901234567890",
          "createdAt": "2024-01-15T10:30:00Z",
          "uniqueHolders": 15,
          "mediaContent": {
            "previewImage": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800"
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 2. Create Collaboration Post

**Endpoint:** `POST /api/collabs`

**Description:** Creates a new collaboration post by minting a Zora coin and storing the coin address.

**Request:**
```http
POST /api/collabs
X-Zora-Wallet: 0x1234567890123456789012345678901234567890
Content-Type: application/json

{
  "role": "Mix Engineer",
  "paymentType": "paid",
  "credits": false,
  "workStyle": "freestyle",
  "location": "LA",
  "collaborators": [
    {
      "role": "Mix Engineer",
      "creatorType": "indie",
      "credits": 25,
      "compensationType": "paid",
      "timeCommitment": "one-time",
      "jobDescription": "Must have experience with electronic music"
    }
  ],
  "expiresAt": "2024-03-15T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "collab_002",
    "coinAddress": "0x789abcdef123456789abcdef123456789abcdef1",
    "coinMinted": true,
    "message": "Collaboration post created and Zora coin minted successfully"
  }
}
```

### 3. Ping Collaboration Post

**Endpoint:** `POST /api/collabs/{collabId}/ping`

**Description:** Sends a ping/like to a collaboration post.

**Request:**
```http
POST /api/collabs/collab_001/ping
X-Zora-Wallet: 0x456789abcdef123456789abcdef123456789abcde
Content-Type: application/json

{
  "interestedRole": "3D Artist",
  "bio": "5 years of experience in music video VFX"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pingId": "ping_001",
    "message": "Ping sent successfully"
  }
}
```

### 4. Get Received Pings

**Endpoint:** `GET /api/wallets/{walletAddress}/pings/received`

**Description:** Returns pings received on user's collaboration posts.

**Request:**
```http
GET /api/wallets/0x1234567890123456789012345678901234567890/pings/received?page=1&limit=20
X-Zora-Wallet: 0x1234567890123456789012345678901234567890
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pings": [
      {
        "id": "ping_001",
        "collabPostId": "collab_001",
        "pingedWallet": "0x456789abcdef123456789abcdef123456789abcde",
        "interestedRole": "3D Artist",
        "bio": "5 years of experience in music video VFX",
        "status": "pending",
        "createdAt": "2024-01-15T12:30:00Z",
        "collabPost": {
          "coinAddress": "0x445e9c0a296068dc4257767b5ed354b77cf513de",
          "role": "3D Artist"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### 5. Respond to Ping

**Endpoint:** `POST /api/pings/{pingId}/respond`

**Description:** Accept or decline a received ping.

**Request:**
```http
POST /api/pings/ping_001/respond
X-Zora-Wallet: 0x1234567890123456789012345678901234567890
Content-Type: application/json

{
  "action": "accept"  // or "decline"
}
```

**Response (Accept):**
```json
{
  "success": true,
  "data": {
    "matchId": "match_001",
    "action": "accepted",
    "message": "Ping accepted and match created"
  }
}
```

**Response (Decline):**
```json
{
  "success": true,
  "data": {
    "action": "declined",
    "message": "Ping declined"
  }
}
```

### 6. Get Matched Collaborations

**Endpoint:** `GET /api/wallets/{walletAddress}/matches`

**Description:** Returns active matched collaborations for messaging.

**Request:**
```http
GET /api/wallets/0x1234567890123456789012345678901234567890/matches?page=1&limit=20
X-Zora-Wallet: 0x1234567890123456789012345678901234567890
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "match_001",
        "collabPostId": "collab_001",
        "creatorWallet": "0x1234567890123456789012345678901234567890",
        "collaboratorWallet": "0x456789abcdef123456789abcdef123456789abcde",
        "projectName": "Neon Dream",
        "role": "VFX Artist",
        "status": "active",
        "createdAt": "2024-01-15T14:30:00Z",
        "lastMessageAt": "2024-01-15T16:45:00Z",
        "unreadCount": 3,
        "otherUser": {
          "wallet": "0x456789abcdef123456789abcdef123456789abcde"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 2,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### 7. Get Match Messages

**Endpoint:** `GET /api/matches/{matchId}/messages`

**Description:** Returns messages for a specific match/conversation.

**Request:**
```http
GET /api/matches/match_001/messages?page=1&limit=50
X-Zora-Wallet: 0x1234567890123456789012345678901234567890
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_001",
        "matchId": "match_001",
        "senderWallet": "0x456789abcdef123456789abcdef123456789abcde",
        "content": "Just submitted milestone 2 for review",
        "messageType": "text",
        "attachments": [],
        "createdAt": "2024-01-15T16:45:00Z",
        "readAt": null
      },
      {
        "id": "msg_002",
        "matchId": "match_001",
        "senderWallet": "0x1234567890123456789012345678901234567890",
        "content": "Thanks! I'll review it and get back to you.",
        "messageType": "text",
        "attachments": [],
        "createdAt": "2024-01-15T16:50:00Z",
        "readAt": "2024-01-15T16:50:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 15,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### 8. Send Message

**Endpoint:** `POST /api/matches/{matchId}/messages`

**Description:** Sends a message in a match conversation.

**Request:**
```http
POST /api/matches/match_001/messages
X-Zora-Wallet: 0x1234567890123456789012345678901234567890
Content-Type: application/json

{
  "content": "Looking forward to working together!",
  "messageType": "text",
  "attachments": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_003",
    "message": "Message sent successfully"
  }
}
```

### 9. Mark Messages as Read

**Endpoint:** `POST /api/matches/{matchId}/messages/read`

**Description:** Marks all messages in a match as read.

**Request:**
```http
POST /api/matches/match_001/messages/read
X-Zora-Wallet: 0x1234567890123456789012345678901234567890
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Messages marked as read"
  }
}
```

### 10. Update Collaboration Post Status

**Endpoint:** `PATCH /api/collabs/{collabId}`

**Description:** Updates the status of a collaboration post.

**Request:**
```http
PATCH /api/collabs/collab_001
X-Zora-Wallet: 0x1234567890123456789012345678901234567890
Content-Type: application/json

{
  "status": "closed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Collaboration post status updated"
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing Zora wallet address"
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` - Missing or invalid Zora wallet address
- `FORBIDDEN` - Wallet doesn't have permission to access this data
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid request data
- `CONFLICT` - Resource already exists or conflict state
- `INTERNAL_ERROR` - Server error

## Real-time Features

### **WebSocket Events**

For real-time updates, implement WebSocket connections with the following events:

```typescript
// Client-side WebSocket events
interface WebSocketEvents {
  // Ping notifications
  'ping:received': {
    pingId: string;
    pingedUserName: string;
    collabPostTitle: string;
    timestamp: string;
  };
  
  // Match notifications
  'match:created': {
    matchId: string;
    projectName: string;
    collaboratorName: string;
    timestamp: string;
  };
  
  // Message notifications
  'message:received': {
    matchId: string;
    senderName: string;
    content: string;
    timestamp: string;
  };
  
  // Status updates
  'collab:status_changed': {
    collabId: string;
    newStatus: string;
    timestamp: string;
  };
}
```

### **WebSocket Connection**

```typescript
// Frontend WebSocket implementation
const connectWebSocket = (zoraWallet: string) => {
  const ws = new WebSocket(`wss://api.originals.com/ws?wallet=${zoraWallet}`);
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'ping:received':
        // Show notification for new ping
        showNotification(`New ping from ${data.pingedWallet}`);
        break;
      case 'message:received':
        // Update message count and show notification
        updateUnreadCount(data.matchId);
        break;
    }
  };
  
  return ws;
};
```

### **Zora Integration**

The backend integrates with Zora's coin system to fetch coin data dynamically. When returning collaboration posts, the backend should:

1. **Fetch Coin Data**: Use the Zora SDK to fetch coin metadata, market data, and media content
2. **Cache Coin Data**: Implement caching to avoid repeated API calls to Zora
3. **Handle Errors**: Gracefully handle cases where coin data is unavailable

**Backend Implementation Example:**

```typescript
import { getCoin } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";

// Fetch coin data for collaboration posts
const fetchCoinData = async (coinAddress: string) => {
  try {
    const response = await getCoin({
      address: coinAddress,
      chain: base.id,
    });
    
    return response.data?.zora20Token;
  } catch (error) {
    console.error(`Failed to fetch coin data for ${coinAddress}:`, error);
    return null;
  }
};

// Enhanced collaboration post with coin data
const getCollaborationFeed = async (filters: any) => {
  const collabs = await db.getCollaborationPosts(filters);
  
  // Fetch coin data for each collaboration
  const collabsWithCoinData = await Promise.all(
    collabs.map(async (collab) => {
      const coinData = await fetchCoinData(collab.coinAddress);
      return {
        ...collab,
        coinData
      };
    })
  );
  
  return collabsWithCoinData;
};
```

**Coin Data Caching:**

```typescript
// Redis cache for coin data
const CACHE_TTL = 300; // 5 minutes

const getCachedCoinData = async (coinAddress: string) => {
  const cacheKey = `coin:${coinAddress}`;
  
  // Try to get from cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from Zora if not cached
  const coinData = await fetchCoinData(coinAddress);
  
  // Cache the result
  if (coinData) {
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(coinData));
  }
  
  return coinData;
};
```

## Implementation Notes

### **Database Schema Considerations**

1. **Collaboration Posts Table:**
   - Primary key: `id`
   - Foreign key: `creator_wallet` → wallets table
   - Unique field: `coin_address` (Zora coin contract address)
   - Indexes on: `status`, `payment_type`, `work_style`, `location`, `created_at`, `coin_address`, `creator_wallet`
   - JSON field for `collaborators` array

2. **Pings Table:**
   - Primary key: `id`
   - Foreign keys: `collab_post_id`, `pinged_wallet`
   - Indexes on: `status`, `created_at`
   - Unique constraint on `(collab_post_id, pinged_wallet)`

3. **Matches Table:**
   - Primary key: `id`
   - Foreign keys: `collab_post_id`, `creator_wallet`, `collaborator_wallet`
   - Indexes on: `status`, `last_message_at`
   - Unique constraint on `(collab_post_id, collaborator_wallet)`

4. **Messages Table:**
   - Primary key: `id`
   - Foreign key: `match_id`
   - Indexes on: `created_at`, `read_at`
   - JSON field for `attachments` array

### **Performance Optimizations**

1. **Feed Generation:**
   - Implement Redis caching for frequently accessed feeds and coin data
   - Use database views for complex filtering queries
   - Pagination with cursor-based approach for better performance
   - Batch fetch coin data to minimize Zora API calls

2. **Real-time Updates:**
   - Use Redis pub/sub for WebSocket message distribution
   - Implement message queuing for offline users
   - Batch WebSocket notifications to prevent spam

3. **Search and Filtering:**
   - Consider Elasticsearch for advanced search capabilities
   - Implement full-text search on collaboration descriptions
   - Cache filter results for common queries

### **Security Considerations**

1. **Rate Limiting:**
   - Implement rate limiting on ping actions (e.g., 10 pings per hour)
   - Limit message sending frequency
   - Prevent spam on collaboration posts

2. **Content Moderation:**
   - Implement content filtering for messages and descriptions
   - Flag inappropriate collaboration posts
   - User reporting system for abuse

3. **Data Privacy:**
   - Encrypt sensitive user data
   - Implement data retention policies
   - GDPR compliance for user data deletion

### **Analytics and Monitoring**

1. **Key Metrics:**
   - Ping-to-match conversion rate
   - Average time to match
   - Message response time
   - Collaboration completion rate

2. **Monitoring:**
   - Track API response times
   - Monitor WebSocket connection health
   - Alert on high error rates
   - Database performance monitoring

### **Scalability Considerations**

1. **Horizontal Scaling:**
   - Design for microservices architecture
   - Implement database sharding by user ID
   - Use CDN for media file delivery

2. **Caching Strategy:**
   - Redis for session and real-time data
   - CDN for static assets
   - Database query result caching

3. **Message Queue:**
   - Use message queues for async processing
   - Implement retry mechanisms
   - Dead letter queues for failed messages
