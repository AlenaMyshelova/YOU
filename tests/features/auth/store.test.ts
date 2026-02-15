/**
 * Tests for auth store (Zustand).
 */
import { useAuthStore } from "@features/auth/store";
import { tokenStorage } from "@shared/lib/tokenStorage";
import { apiClient } from "@shared/lib/apiClient";
import { wsClient } from "@shared/lib/wsClient";

// Mock dependencies
jest.mock("@shared/lib/tokenStorage", () => ({
  tokenStorage: {
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    setTokens: jest.fn().mockResolvedValue(undefined),
    clearTokens: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("@shared/lib/apiClient", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, msg: string) {
      super(msg);
      this.status = status;
    }
  },
}));

jest.mock("@shared/lib/wsClient", () => ({
  wsClient: {
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
}));

jest.mock("@shared/lib/queryClient", () => ({
  queryClient: {
    clear: jest.fn(),
  },
}));

jest.mock("@shared/lib/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

const mockUser = {
  id: "user-1",
  username: "testuser",
  displayName: "Test User",
  avatarUrl: null,
  bio: "",
  followersCount: 0,
  followingCount: 0,
  postsCount: 0,
  createdAt: "2025-01-01",
};

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store between tests
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });
    jest.clearAllMocks();
  });

  describe("hydrate", () => {
    it("should set user when token exists and is valid", async () => {
      (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue("valid-token");
      (apiClient.get as jest.Mock).mockResolvedValue(mockUser);

      await useAuthStore.getState().hydrate();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(wsClient.connect).toHaveBeenCalled();
    });

    it("should clear state when no token exists", async () => {
      (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue(null);

      await useAuthStore.getState().hydrate();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("should clear tokens when validation fails", async () => {
      (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue("expired-token");
      (apiClient.get as jest.Mock).mockRejectedValue(new Error("401"));

      await useAuthStore.getState().hydrate();

      expect(tokenStorage.clearTokens).toHaveBeenCalled();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe("login", () => {
    it("should store tokens and set user on successful login", async () => {
      const authResponse = {
        user: mockUser,
        tokens: {
          accessToken: "new-access",
          refreshToken: "new-refresh",
        },
      };
      (apiClient.post as jest.Mock).mockResolvedValue(authResponse);

      await useAuthStore
        .getState()
        .login({ email: "test@test.com", password: "password123" });

      expect(tokenStorage.setTokens).toHaveBeenCalledWith("new-access", "new-refresh");
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(wsClient.connect).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should clear everything on logout", async () => {
      // Set initial authenticated state
      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
      });

      (apiClient.post as jest.Mock).mockResolvedValue(undefined);

      await useAuthStore.getState().logout();

      expect(wsClient.disconnect).toHaveBeenCalled();
      expect(tokenStorage.clearTokens).toHaveBeenCalled();
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
