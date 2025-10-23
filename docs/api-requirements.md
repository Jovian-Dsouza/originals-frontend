# Backend API Requirements

This document outlines the API endpoints required to support the Profile page functionality, replacing hardcoded data with dynamic backend data.

## Authentication

The API uses **JWT Token Authentication** with Privy integration. All endpoints require a valid JWT token in the Authorization header.

### **JWT Token Authentication (Primary Method)**

```
Authorization: Bearer <jwt_token>
```

**How it works:**
1. User authenticates with Privy (wallet/email/Zora)
2. Frontend retrieves JWT access token from Privy
3. Token is included in all API requests
4. Backend validates token with Privy's verification system

### **Frontend Implementation**

```typescript
// Getting JWT token from Privy
const { user } = usePrivy();

const getAccessToken = async () => {
  try {
    // Try different methods to get access token
    if (typeof user?.getAccessToken === 'function') {
      return await user.getAccessToken();
    } else if (user?.accessToken) {
      return user.accessToken;
    } else if (typeof user?.getToken === 'function') {
      return await user.getToken();
    }
  } catch (error) {
    console.warn('Could not retrieve access token:', error);
    return null;
  }
};

// Making authenticated API calls
const makeAuthenticatedRequest = async () => {
  const accessToken = await getAccessToken();
  
  const response = await fetch('/api/users/0x123.../onboarding-status', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};
```

### **Backend Implementation**

The backend must validate JWT tokens using Privy's verification system.

#### **1. Using Privy's Node.js SDK (Recommended)**

```bash
npm install @privy-io/node
```

```javascript
const { PrivyClient } = require('@privy-io/node');

// Initialize Privy client
const privy = new PrivyClient({
  appId: process.env.PRIVY_APP_ID,
  apiKey: process.env.PRIVY_API_KEY,
});

// JWT validation middleware
const validatePrivyToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: { 
          code: 'UNAUTHORIZED', 
          message: 'No token provided' 
        }
      });
    }
    
    const accessToken = authHeader.replace('Bearer ', '');
    
    // Verify the token with Privy
    const verifiedClaims = await privy.utils().auth().verifyAuthToken(accessToken);
    
    // Add user info to request
    req.user = verifiedClaims;
    req.userId = verifiedClaims.userId;
    req.appId = verifiedClaims.appId;
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ 
      success: false,
      error: { 
        code: 'UNAUTHORIZED', 
        message: 'Invalid or expired token' 
      }
    });
  }
};

// Usage in Express routes
app.get('/api/users/:zoraWalletAddress/onboarding-status', validatePrivyToken, async (req, res) => {
  const { zoraWalletAddress } = req.params;
  const { userId } = req.user; // From verified JWT
  
  try {
    // Your business logic here
    const user = await getUserByZoraWallet(zoraWalletAddress);
    
    res.json({
      success: true,
      isOnboarded: !!user,
      data: user || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Server error' }
    });
  }
});
```

#### **2. Manual JWT Verification (Alternative)**

```bash
npm install jose
```

```javascript
const { jwtVerify, importSPKI } = require('jose');

const validatePrivyTokenManual = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No token provided' }
      });
    }
    
    const accessToken = authHeader.replace('Bearer ', '');
    
    // Import Privy's public verification key
    const verificationKey = await importSPKI(process.env.PRIVY_VERIFICATION_KEY, 'ES256');
    
    // Verify the token
    const { payload } = await jwtVerify(accessToken, verificationKey, {
      issuer: 'privy.io',
      audience: process.env.PRIVY_APP_ID,
    });
    
    req.user = payload;
    req.userId = payload.userId;
    req.appId = payload.appId;
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ 
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid token' }
    });
  }
};
```

#### **3. JWT Token Claims Structure**

Privy JWT tokens contain the following claims:

```json
{
  "iss": "privy.io",                    // Issuer
  "aud": "your-privy-app-id",          // Audience (your app ID)
  "userId": "user_123",                // Privy user ID
  "appId": "your-privy-app-id",        // Your Privy app ID
  "sessionId": "session_456",          // Session identifier
  "iat": 1640995200,                   // Issued at timestamp
  "exp": 1640998800                    // Expiration timestamp
}
```

#### **4. Environment Variables Required**

```bash
# Required environment variables for backend
PRIVY_APP_ID=your-privy-app-id
PRIVY_API_KEY=your-privy-api-key
PRIVY_VERIFICATION_KEY=your-privy-verification-key  # For manual verification
```

#### **5. Error Handling**

All endpoints should return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` - Missing or invalid JWT token
- `FORBIDDEN` - Valid token but insufficient permissions
- `NOT_FOUND` - User not found
- `INTERNAL_ERROR` - Server error

## API Endpoints

### 1. Check User Onboarding Status

**Endpoint:** `GET /api/users/{zoraWalletAddress}/onboarding-status`

**Description:** Checks if a user has completed the onboarding process.

**Request:**
```http
GET /api/users/0xabcd1234...efgh5678/onboarding-status
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (User Onboarded):**
```json
{
  "success": true,
  "isOnboarded": true,
  "data": {
    "userId": "user_123",
    "userType": "indie",
    "creativeDomains": ["film", "music"],
    "status": "available",
    "profileData": {
      "name": "John Doe",
      "tagline": "Creative filmmaker",
      "orgName": null,
      "orgType": null
    },
    "walletAddress": "0x1234...5678",
    "zoraWalletAddress": "0xabcd...efgh",
    "onboardedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (User Not Onboarded):**
```json
{
  "success": true,
  "isOnboarded": false,
  "data": null
}
```

### 2. Complete User Onboarding

**Endpoint:** `POST /api/users/{zoraWalletAddress}/onboard`

**Description:** Completes the user onboarding process with profile data.

**Request:**
```http
POST /api/users/0xabcd1234...efgh5678/onboard
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "userType": "indie",
  "creativeDomains": ["film", "music", "photography"],
  "status": "available",
  "profileData": {
    "name": "John Doe",
    "tagline": "Creative filmmaker and photographer",
    "orgName": "",
    "orgType": ""
  },
  "walletAddress": "0x1234...5678",
  "zoraWalletAddress": "0xabcd...efgh"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "isOnboarded": true,
    "profileCreated": true,
    "message": "Onboarding completed successfully"
  }
}
```

**Onboarding Data Schema:**
```typescript
interface OnboardingData {
  userType: "indie" | "commercial";
  creativeDomains: string[];  // Array of domain IDs
  status: "gigs" | "collabs" | "exploring";
  profileData: {
    name: string;
    tagline: string;
    orgName?: string;  // For commercial users
    orgType?: string;  // For commercial users
  };
  walletAddress?: string | null;
  zoraWalletAddress?: string | null;
}
```

### 3. Get User Profile Stats

**Endpoint:** `GET /api/users/{userId}/profile`

**Description:** Returns user collaboration statistics and profile information.

**Request:**
```http
GET /api/users/0xabcd1234...efgh5678/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "collabCount": 6,
    "deltaCollabs": 2,
    "skills": ["VFX", "3D Animation", "Motion Graphics", "Color Grading"],
    "status": "available",
    "bio": "Email Authenticated • Available for Collabs",
    "displayName": "Dharma"
  }
}
```

**Response Schema:**
```typescript
interface UserProfileStats {
  collabCount: number;        // Total number of collaborations
  deltaCollabs: number;       // Change in collabs (positive/negative)
  skills: string[];          // Array of user skills
  status: "available" | "busy" | "unavailable";
  bio: string;               // User bio text
  displayName: string;       // User display name
}
```

### 4. Get Ongoing Collaborations

**Endpoint:** `GET /api/users/{userId}/collabs/ongoing`

**Description:** Returns array of ongoing collaborations for the user.

**Request:**
```http
GET /api/users/0xabcd1234...efgh5678/collabs/ongoing
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "collab_001",
      "project": "Urban Soundscape",
      "posterName": "Alex Chen",
      "posterAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      "posterType": "Indie Creator",
      "type": "Part-time",
      "duration": "Mar 2024 - Present",
      "description": "Creating immersive soundscapes for urban documentary series",
      "isSelfInitiated": false,
      "startDate": "2024-03-01",
      "status": "active"
    },
    {
      "id": "collab_002",
      "project": "Digital Dreams",
      "posterName": "Jordan Blake",
      "posterAvatar": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
      "posterType": "Organization",
      "type": "One-time",
      "duration": "Feb 2024 - Present",
      "description": "Animation work for branded content campaign",
      "isSelfInitiated": false,
      "startDate": "2024-02-15",
      "status": "active"
    }
  ]
}
```

### 5. Get Completed Collaborations

**Endpoint:** `GET /api/users/{userId}/collabs/completed`

**Description:** Returns array of completed collaborations for the user.

**Request:**
```http
GET /api/users/0xabcd1234...efgh5678/collabs/completed
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "collab_003",
      "project": "Retro Vibes",
      "posterName": "Taylor Swift",
      "posterAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      "posterType": "Indie Creator",
      "type": "Full-time",
      "duration": "Oct 2023 - Dec 2023",
      "description": "VFX work for music video production",
      "isSelfInitiated": false,
      "startDate": "2023-10-01",
      "endDate": "2023-12-31",
      "status": "completed"
    }
  ]
}
```

**Collaboration Schema:**
```typescript
interface Collaboration {
  id: string;                    // Unique collaboration ID
  project: string;               // Project name
  posterName: string;            // Name of the collaboration poster
  posterAvatar: string;         // URL to poster's avatar image
  posterType: "Indie Creator" | "Organization" | "Self-Initiated";
  type: "Full-time" | "Part-time" | "One-time" | "Hourly";
  duration: string;              // Human-readable duration string
  description: string;           // Project description
  isSelfInitiated: boolean;      // Whether user initiated this collaboration
  startDate: string;            // ISO date string
  endDate?: string;             // ISO date string (for completed collabs)
  status: "active" | "completed" | "cancelled";
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` - Missing or invalid authentication
- `NOT_FOUND` - User not found
- `FORBIDDEN` - User doesn't have permission to access this data
- `INTERNAL_ERROR` - Server error

## Implementation Notes

1. **Onboarding Flow:** 
   - After Privy authentication, always check onboarding status first
   - If user is onboarded, redirect to main app
   - If not onboarded, show onboarding flow
   - Store onboarding completion timestamp for analytics

2. **User Identification:**
   - Use Zora wallet address as primary identifier for all users
   - JWT tokens contain Privy user ID for backend validation
   - Backend validates JWT tokens and maps to Zora wallet addresses
   - Support both email and wallet authentication methods through Privy

3. **Caching:** Consider implementing caching for collaboration data with appropriate TTL
4. **Pagination:** For users with many collaborations, implement pagination
5. **Real-time Updates:** Consider WebSocket integration for real-time collaboration status updates
6. **Image Optimization:** Ensure poster avatars are optimized and cached
7. **Rate Limiting:** Implement rate limiting to prevent abuse

## Database Considerations

The backend should maintain the following data relationships:
- Users table with profile information and onboarding status
- Onboarding data table linked to users
- Collaborations table with foreign key to users
- Skills table with many-to-many relationship to users
- Collaboration status tracking for real-time updates
- User authentication mapping (email/wallet to user ID)
