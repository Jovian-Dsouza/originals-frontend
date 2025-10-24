# API Specification - Sideway

## Overview

This document defines the API specification for the Sideway platform, including REST endpoints, GraphQL queries, and WebSocket events for frontend integration.

## Base Configuration

- **Base URL**: `https://api.sideway.app/v1`
- **Authentication**: Bearer token (JWT)
- **Content Type**: `application/json`
- **Rate Limiting**: 1000 requests per hour per user

## Authentication

### Login/Register
```http
POST /auth/login
Content-Type: application/json

{
  "walletAddress": "0x...",
  "signature": "0x...",
  "message": "Sign this message to authenticate"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "walletAddress": "0x...",
      "profile": {
        "username": "creator_name",
        "bio": "Creator bio",
        "avatar": "ipfs_hash"
      }
    }
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Authorization: Bearer {token}
```

## Content Management

### Create Content Idea
```http
POST /content/ideas
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Content Idea Title",
  "description": "Detailed description",
  "collateral": "ipfs_hash_or_url",
  "collaboratorSlots": 3,
  "tags": ["tag1", "tag2"],
  "metadata": {
    "category": "video",
    "estimatedDuration": "10 minutes",
    "budget": "1000 ZORA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "idea_id",
    "contentCoin": "0x...",
    "payoutContract": "0x...",
    "creator": "0x...",
    "status": "open",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Content Ideas
```http
GET /content/ideas?page=1&limit=20&status=open&category=video
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ideas": [
      {
        "id": "idea_id",
        "title": "Content Idea Title",
        "description": "Description...",
        "creator": {
          "id": "creator_id",
          "username": "creator_name",
          "avatar": "ipfs_hash"
        },
        "collaboratorSlots": 3,
        "currentCollaborators": 1,
        "status": "open",
        "createdAt": "2024-01-01T00:00:00Z",
        "tags": ["tag1", "tag2"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### Get Single Content Idea
```http
GET /content/ideas/{ideaId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "idea_id",
    "title": "Content Idea Title",
    "description": "Detailed description",
    "creator": {
      "id": "creator_id",
      "username": "creator_name",
      "avatar": "ipfs_hash",
      "walletAddress": "0x..."
    },
    "contentCoin": "0x...",
    "payoutContract": "0x...",
    "collaborators": [
      {
        "id": "collab_id",
        "username": "collab_name",
        "avatar": "ipfs_hash",
        "share": 3000,
        "status": "active"
      }
    ],
    "collaboratorSlots": 3,
    "status": "open",
    "createdAt": "2024-01-01T00:00:00Z",
    "tags": ["tag1", "tag2"]
  }
}
```

## Collaboration Management

### Express Interest in Idea
```http
POST /collaborations/interest
Authorization: Bearer {token}
Content-Type: application/json

{
  "ideaId": "idea_id",
  "message": "I'm interested in collaborating on this project",
  "proposedShare": 2500,
  "portfolio": "ipfs_hash_or_url"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "collaborationId": "collab_id",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Accept Collaborator
```http
POST /collaborations/{collaborationId}/accept
Authorization: Bearer {token}
Content-Type: application/json

{
  "share": 2500,
  "message": "Welcome to the team!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "collaborationId": "collab_id",
    "status": "accepted",
    "share": 2500,
    "transactionHash": "0x...",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Reject Collaborator
```http
POST /collaborations/{collaborationId}/reject
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Not a good fit for this project"
}
```

### Get User Collaborations
```http
GET /collaborations?status=active&type=creator
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "collaborations": [
      {
        "id": "collab_id",
        "idea": {
          "id": "idea_id",
          "title": "Content Idea Title"
        },
        "collaborator": {
          "id": "collab_id",
          "username": "collab_name",
          "avatar": "ipfs_hash"
        },
        "share": 2500,
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

## Revenue and Analytics

### Get Revenue Dashboard
```http
GET /revenue/dashboard
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEarned": "1000.50",
    "pendingBalance": "250.25",
    "totalDistributed": "750.25",
    "projects": [
      {
        "ideaId": "idea_id",
        "title": "Content Idea Title",
        "totalRevenue": "500.00",
        "myShare": "350.00",
        "collaborators": 2,
        "lastPayout": "2024-01-01T00:00:00Z"
      }
    ],
    "payoutHistory": [
      {
        "id": "payout_id",
        "amount": "100.00",
        "project": "Content Idea Title",
        "timestamp": "2024-01-01T00:00:00Z",
        "transactionHash": "0x..."
      }
    ]
  }
}
```

### Get Project Revenue Details
```http
GET /revenue/projects/{ideaId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ideaId": "idea_id",
    "title": "Content Idea Title",
    "totalRevenue": "1000.00",
    "shares": [
      {
        "user": {
          "id": "user_id",
          "username": "username",
          "avatar": "ipfs_hash"
        },
        "share": 7000,
        "earned": "700.00",
        "pending": "50.00"
      },
      {
        "user": {
          "id": "collab_id",
          "username": "collab_name",
          "avatar": "ipfs_hash"
        },
        "share": 3000,
        "earned": "300.00",
        "pending": "20.00"
      }
    ],
    "payoutHistory": [
      {
        "amount": "100.00",
        "timestamp": "2024-01-01T00:00:00Z",
        "transactionHash": "0x..."
      }
    ]
  }
}
```

## User Management

### Get User Profile
```http
GET /users/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "walletAddress": "0x...",
    "username": "username",
    "bio": "User bio",
    "avatar": "ipfs_hash",
    "stats": {
      "ideasCreated": 5,
      "collaborations": 12,
      "totalEarned": "2500.00",
      "reputation": 4.5
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update User Profile
```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "new_username",
  "bio": "Updated bio",
  "avatar": "new_ipfs_hash"
}
```

### Get User Ideas
```http
GET /users/{userId}/ideas?status=active
Authorization: Bearer {token}
```

## GraphQL API

### Endpoint
```
https://api.sideway.app/graphql
```

### Schema Examples

#### Get Ideas with Collaborators
```graphql
query GetIdeas($first: Int!, $after: String) {
  ideas(first: $first, after: $after) {
    edges {
      node {
        id
        title
        description
        creator {
          id
          username
          avatar
        }
        collaborators {
          id
          username
          share
          status
        }
        status
        createdAt
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

#### Get User Dashboard
```graphql
query GetUserDashboard {
  me {
    id
    username
    avatar
    stats {
      ideasCreated
      collaborations
      totalEarned
    }
    ideas(first: 5) {
      edges {
        node {
          id
          title
          status
          totalRevenue
        }
      }
    }
    collaborations(first: 5) {
      edges {
        node {
          id
          idea {
            id
            title
          }
          share
          status
        }
      }
    }
  }
}
```

## WebSocket Events

### Connection
```javascript
const ws = new WebSocket('wss://api.sideway.app/ws');
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'jwt_token_here'
  }));
};
```

### Event Types

#### Collaboration Updates
```json
{
  "type": "collaboration_update",
  "data": {
    "collaborationId": "collab_id",
    "ideaId": "idea_id",
    "status": "accepted",
    "share": 2500,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### Revenue Updates
```json
{
  "type": "revenue_update",
  "data": {
    "ideaId": "idea_id",
    "amount": "100.00",
    "transactionHash": "0x...",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### New Ideas
```json
{
  "type": "new_idea",
  "data": {
    "ideaId": "idea_id",
    "title": "New Content Idea",
    "creator": {
      "id": "creator_id",
      "username": "creator_name"
    },
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "title",
      "reason": "Title is required"
    }
  }
}
```

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `BLOCKCHAIN_ERROR`: Smart contract interaction failed
- `INTERNAL_ERROR`: Server error

## Rate Limiting

### Limits
- **Authenticated Users**: 1000 requests/hour
- **Unauthenticated**: 100 requests/hour
- **WebSocket**: 100 messages/minute

### Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `after`: Cursor for GraphQL pagination

### Response Format
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## File Upload

### Upload Metadata
```http
POST /upload/metadata
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary data]
type: "avatar" | "collateral" | "portfolio"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hash": "ipfs_hash",
    "url": "https://ipfs.io/ipfs/ipfs_hash",
    "size": 1024000,
    "type": "image/jpeg"
  }
}
```

## Testing

### Test Environment
- **Base URL**: `https://api-test.sideway.app/v1`
- **Test Tokens**: Available in documentation
- **Mock Data**: Pre-populated test data

### Test Endpoints
```http
POST /test/reset
POST /test/seed
GET /test/data
```

---

*This API specification provides the complete interface for frontend integration. It should be updated as new features are added and requirements evolve.*
