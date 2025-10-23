// Collaboration Post Types
export interface CollaborationPost {
  id: string;
  coinAddress: string;
  creatorWallet: string;
  role: string;
  paymentType: "paid" | "barter" | "both";
  credits: boolean;
  workStyle: "contract" | "freestyle";
  location: string;
  status: "open" | "shortlisted" | "signed" | "closed";
  collaborators: CollaboratorRole[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface CollaboratorRole {
  role: string;
  creatorType: "indie" | "org" | "brand";
  credits: number;
  compensationType: "paid" | "barter" | "both";
  timeCommitment: "ongoing" | "one-time";
  jobDescription?: string;
}

// Zora Coin Data (fetched from Zora SDK)
export interface ZoraCoinData {
  name: string;
  symbol: string;
  description: string;
  totalSupply: string;
  marketCap: string;
  volume24h: string;
  creatorAddress: string;
  createdAt: string;
  uniqueHolders: number;
  mediaContent?: {
    previewImage?: string;
  };
}

// Enhanced Collaboration Post with Coin Data
export interface CollaborationPostWithCoin extends CollaborationPost {
  coinData?: ZoraCoinData;
}

// Ping/Match Types
export interface Ping {
  id: string;
  collabPostId: string;
  pingedWallet: string;
  interestedRole: string;
  bio: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  respondedAt?: string;
  collabPost?: {
    coinAddress: string;
    role: string;
  };
}

export interface Match {
  id: string;
  collabPostId: string;
  creatorWallet: string;
  collaboratorWallet: string;
  projectName: string;
  role: string;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  lastMessageAt: string;
  unreadCount: number;
  otherUser?: {
    wallet: string;
  };
}

// Message Types
export interface Message {
  id: string;
  matchId: string;
  senderWallet: string;
  content: string;
  messageType: "text" | "image" | "file" | "milestone";
  attachments?: MessageAttachment[];
  createdAt: string;
  readAt?: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

// API Request Types
export interface CreateCollabRequest {
  role: string;
  paymentType: "paid" | "barter" | "both";
  credits: boolean;
  workStyle: "contract" | "freestyle";
  location: string;
  collaborators: CollaboratorRole[];
  expiresAt?: string;
}

export interface PingCollabRequest {
  interestedRole: string;
  bio: string;
}

export interface RespondToPingRequest {
  action: "accept" | "decline";
}

export interface SendMessageRequest {
  content: string;
  messageType: "text" | "image" | "file" | "milestone";
  attachments?: MessageAttachment[];
}

export interface UpdateCollabStatusRequest {
  status: "open" | "shortlisted" | "signed" | "closed";
}

// Filter Types
export interface CollabFeedFilters {
  page?: number;
  limit?: number;
  filter?: "paid" | "barter" | "credits" | "contract" | "freestyle" | "remote";
  location?: string;
  excludeUser?: string;
}

export interface PingsFilters {
  page?: number;
  limit?: number;
  status?: "pending" | "accepted" | "declined";
}

export interface MatchesFilters {
  page?: number;
  limit?: number;
  status?: "active" | "completed" | "cancelled";
}

export interface MessagesFilters {
  page?: number;
  limit?: number;
}

// API Response Types
export type CollabFeedResponse = {
  collabs: CollaborationPostWithCoin[];
  pagination: PaginationInfo;
};

export type CreateCollabResponse = {
  id: string;
  coinAddress: string;
  coinMinted: boolean;
  message: string;
};

export type PingResponse = {
  pingId: string;
  message: string;
};

export type RespondToPingResponse = {
  matchId?: string;
  action: "accepted" | "declined";
  message: string;
};

export type PingsReceivedResponse = {
  pings: Ping[];
  pagination: PaginationInfo;
};

export type MatchesResponse = {
  matches: Match[];
  pagination: PaginationInfo;
};

export type MessagesResponse = {
  messages: Message[];
  pagination: PaginationInfo;
};

export type SendMessageResponse = {
  messageId: string;
  message: string;
};

export type MarkAsReadResponse = {
  message: string;
};

export type UpdateCollabStatusResponse = {
  message: string;
};

// Re-export PaginationInfo from api-client
export type { PaginationInfo } from './api-client';
