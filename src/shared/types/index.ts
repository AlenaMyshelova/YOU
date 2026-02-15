/**
 * Domain types — shared across features.
 * TODO: Generate these from OpenAPI spec using `openapi-typescript`.
 * @see https://github.com/openapi-ts/openapi-typescript
 *
 * Install: npm i -D openapi-typescript
 * Generate: npx openapi-typescript http://localhost:8000/openapi.json -o src/shared/types/api.generated.ts
 */

// ─── User ──────────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  createdAt: string;
}

// ─── Auth ──────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ─── Post ──────────────────────────────────────────────────
export interface Post {
  id: string;
  author: User;
  imageUrl: string;
  thumbnailUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface CreatePostRequest {
  caption: string;
  /** base64 or URI — handled by upload logic */
  mediaUri: string;
  mediaType: "image" | "video";
}

// ─── Feed ──────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ─── Notification ──────────────────────────────────────────
export type NotificationType = "like" | "comment" | "follow" | "mention";

export interface AppNotification {
  id: string;
  type: NotificationType;
  actor: User;
  postId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ─── WebSocket ─────────────────────────────────────────────
export type WSEventType = "notification" | "chat_message" | "typing" | "presence";

export interface WSMessage<T = unknown> {
  type: WSEventType;
  payload: T;
  timestamp: string;
}

// ─── Search ────────────────────────────────────────────────
export interface SearchResult {
  users: User[];
  posts: Post[];
}
