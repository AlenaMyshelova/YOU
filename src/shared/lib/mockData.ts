/**
 * Mock data for development — enables testing the full app without a backend.
 * Active only when __DEV__ is true.
 *
 * Usage: imported by apiClient when mock mode is enabled.
 */
import type {
  User,
  Post,
  AuthResponse,
  PaginatedResponse,
  AppNotification,
} from "@shared/types";

// ─── Mock Users ────────────────────────────────────────────
const mockUsers: User[] = [
  {
    id: "user-1",
    username: "alena_dev",
    displayName: "Alena",
    avatarUrl: "https://i.pravatar.cc/150?u=alena",
    bio: "Mobile developer & UI designer ✨",
    followersCount: 1234,
    followingCount: 567,
    postsCount: 42,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "user-2",
    username: "max_photo",
    displayName: "Max Photography",
    avatarUrl: "https://i.pravatar.cc/150?u=max",
    bio: "Capturing moments 📸",
    followersCount: 8901,
    followingCount: 234,
    postsCount: 156,
    createdAt: "2023-06-20T08:00:00Z",
  },
  {
    id: "user-3",
    username: "travel_anna",
    displayName: "Anna Travels",
    avatarUrl: "https://i.pravatar.cc/150?u=anna",
    bio: "🌍 30 countries and counting",
    followersCount: 45200,
    followingCount: 890,
    postsCount: 312,
    createdAt: "2023-03-10T12:00:00Z",
  },
  {
    id: "user-4",
    username: "foodie_kate",
    displayName: "Kate's Kitchen",
    avatarUrl: "https://i.pravatar.cc/150?u=kate",
    bio: "Home cook | Food blogger 🍕",
    followersCount: 12500,
    followingCount: 445,
    postsCount: 89,
    createdAt: "2023-11-01T09:00:00Z",
  },
  {
    id: "user-5",
    username: "art_studio",
    displayName: "Art Studio",
    avatarUrl: "https://i.pravatar.cc/150?u=artstudio",
    bio: "Digital art & illustrations 🎨",
    followersCount: 6700,
    followingCount: 320,
    postsCount: 201,
    createdAt: "2024-02-05T14:00:00Z",
  },
];

// Current logged-in user
export const mockCurrentUser = mockUsers[0];

// ─── Mock Posts ────────────────────────────────────────────
const mockPosts: Post[] = [
  {
    id: "post-1",
    author: mockUsers[1],
    imageUrl: "https://picsum.photos/seed/post1/600/600",
    thumbnailUrl: "https://picsum.photos/seed/post1/150/150",
    caption: "Golden hour at the lake 🌅 #photography #nature",
    likesCount: 342,
    commentsCount: 28,
    isLiked: false,
    createdAt: "2026-02-14T08:30:00Z",
  },
  {
    id: "post-2",
    author: mockUsers[2],
    imageUrl: "https://picsum.photos/seed/post2/600/600",
    thumbnailUrl: "https://picsum.photos/seed/post2/150/150",
    caption: "Streets of Tokyo at night 🏯✨ #travel #japan",
    likesCount: 1205,
    commentsCount: 67,
    isLiked: true,
    createdAt: "2026-02-13T22:15:00Z",
  },
  {
    id: "post-3",
    author: mockUsers[3],
    imageUrl: "https://picsum.photos/seed/post3/600/600",
    thumbnailUrl: "https://picsum.photos/seed/post3/150/150",
    caption: "Homemade pasta from scratch 🍝 Recipe in bio!",
    likesCount: 567,
    commentsCount: 45,
    isLiked: false,
    createdAt: "2026-02-13T18:00:00Z",
  },
  {
    id: "post-4",
    author: mockUsers[4],
    imageUrl: "https://picsum.photos/seed/post4/600/600",
    thumbnailUrl: "https://picsum.photos/seed/post4/150/150",
    caption: "New digital portrait series — swipe for process 🎨",
    likesCount: 890,
    commentsCount: 34,
    isLiked: true,
    createdAt: "2026-02-13T14:45:00Z",
  },
  {
    id: "post-5",
    author: mockUsers[1],
    imageUrl: "https://picsum.photos/seed/post5/600/600",
    thumbnailUrl: "https://picsum.photos/seed/post5/150/150",
    caption: "Morning coffee & fog ☕",
    likesCount: 210,
    commentsCount: 12,
    isLiked: false,
    createdAt: "2026-02-12T07:00:00Z",
  },
  {
    id: "post-6",
    author: mockUsers[2],
    imageUrl: "https://picsum.photos/seed/post6/600/600",
    thumbnailUrl: "https://picsum.photos/seed/post6/150/150",
    caption: "Sunrise at Mount Fuji — worth waking up at 4am 🗻",
    likesCount: 3400,
    commentsCount: 123,
    isLiked: false,
    createdAt: "2026-02-11T05:30:00Z",
  },
  {
    id: "post-7",
    author: mockUsers[3],
    imageUrl: "https://picsum.photos/seed/post7/600/600",
    thumbnailUrl: "https://picsum.photos/seed/post7/150/150",
    caption: "Sunday brunch vibes 🥞🍓 #foodie #brunch",
    likesCount: 445,
    commentsCount: 22,
    isLiked: true,
    createdAt: "2026-02-10T11:00:00Z",
  },
  {
    id: "post-8",
    author: mockUsers[4],
    imageUrl: "https://picsum.photos/seed/post8/600/600",
    thumbnailUrl: "https://picsum.photos/seed/post8/150/150",
    caption: "Commission finished! Character design for a mobile game 🎮",
    likesCount: 1567,
    commentsCount: 89,
    isLiked: false,
    createdAt: "2026-02-09T16:20:00Z",
  },
];

// ─── Mock Notifications ────────────────────────────────────
const mockNotifications: AppNotification[] = [
  {
    id: "notif-1",
    type: "like",
    actor: mockUsers[1],
    postId: "post-1",
    message: "liked your photo",
    isRead: false,
    createdAt: "2026-02-14T09:00:00Z",
  },
  {
    id: "notif-2",
    type: "follow",
    actor: mockUsers[2],
    message: "started following you",
    isRead: false,
    createdAt: "2026-02-14T08:00:00Z",
  },
  {
    id: "notif-3",
    type: "comment",
    actor: mockUsers[3],
    postId: "post-2",
    message: 'commented: "Amazing shot! 😍"',
    isRead: true,
    createdAt: "2026-02-13T20:00:00Z",
  },
];

// ─── Mock API Route Handler ────────────────────────────────

/**
 * Simulates API responses for dev mode.
 * Returns `null` if the endpoint is not mocked (will fall through to real API).
 */
export function handleMockRequest(
  method: string,
  endpoint: string,
  body?: unknown,
): unknown | null {
  // Small delay to simulate network
  const route = `${method.toUpperCase()} ${endpoint.split("?")[0]}`;

  // Auth
  if (route === "POST /auth/login") {
    const authResponse: AuthResponse = {
      user: mockCurrentUser,
      tokens: {
        accessToken: "mock-access-token-dev",
        refreshToken: "mock-refresh-token-dev",
      },
    };
    return authResponse;
  }

  if (route === "POST /auth/register") {
    const req = body as { username?: string; displayName?: string; email?: string };
    const authResponse: AuthResponse = {
      user: {
        ...mockCurrentUser,
        username: req?.username ?? mockCurrentUser.username,
        displayName: req?.displayName ?? mockCurrentUser.displayName,
      },
      tokens: {
        accessToken: "mock-access-token-dev",
        refreshToken: "mock-refresh-token-dev",
      },
    };
    return authResponse;
  }

  if (route === "POST /auth/logout") {
    return undefined; // 204
  }

  if (route === "POST /auth/refresh") {
    return {
      accessToken: "mock-access-token-refreshed",
      refreshToken: "mock-refresh-token-refreshed",
    };
  }

  // Current user
  if (route === "GET /users/me") {
    return mockCurrentUser;
  }

  // Feed
  if (route === "GET /feed") {
    const params = new URLSearchParams(endpoint.split("?")[1] || "");
    const cursor = params.get("cursor");
    const limit = parseInt(params.get("limit") || "20", 10);

    let startIndex = 0;
    if (cursor) {
      const cursorIndex = mockPosts.findIndex((p) => p.id === cursor);
      startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    }

    const items = mockPosts.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < mockPosts.length;

    const response: PaginatedResponse<Post> = {
      items,
      nextCursor: hasMore ? items[items.length - 1].id : null,
      hasMore,
    };
    return response;
  }

  // Like / Unlike
  if (endpoint.match(/^\/posts\/[\w-]+\/like$/)) {
    return undefined; // 204
  }

  // Create post (upload)
  if (route === "POST /posts") {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: mockCurrentUser,
      imageUrl: "https://picsum.photos/seed/newpost/600/600",
      thumbnailUrl: "https://picsum.photos/seed/newpost/150/150",
      caption: "New post",
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    return newPost;
  }

  // Notifications
  if (route === "GET /notifications") {
    const response: PaginatedResponse<AppNotification> = {
      items: mockNotifications,
      nextCursor: null,
      hasMore: false,
    };
    return response;
  }

  // User profile
  if (endpoint.match(/^\/users\/[\w-]+$/) && method.toUpperCase() === "GET") {
    const userId = endpoint.split("/").pop();
    const user = mockUsers.find((u) => u.id === userId);
    return user ?? mockUsers[1]; // fallback
  }

  // Not mocked — return null to let real API handle it
  return null;
}
