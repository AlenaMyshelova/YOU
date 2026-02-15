/**
 * Auth Zustand store — manages authentication state.
 * Tokens stored ONLY in SecureStore, never in plain state.
 */
import { create } from "zustand";
import { tokenStorage } from "@shared/lib/tokenStorage";
import { apiClient } from "@shared/lib/apiClient";
import { wsClient } from "@shared/lib/wsClient";
import { queryClient } from "@shared/lib/queryClient";
import { logger } from "@shared/lib/logger";
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "@shared/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Hydrate session from SecureStore on app start */
  hydrate: () => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  hydrate: async () => {
    try {
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        set({ isLoading: false });
        return;
      }
      // Validate token by fetching current user
      const user = await apiClient.get<User>("/users/me");
      set({ user, isAuthenticated: true, isLoading: false });
      // Connect WebSocket after auth
      wsClient.connect();
    } catch {
      await tokenStorage.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (data) => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data, {
      skipAuth: true,
    });
    await tokenStorage.setTokens(
      response.tokens.accessToken,
      response.tokens.refreshToken,
    );
    set({ user: response.user, isAuthenticated: true });
    wsClient.connect();
    logger.info("User logged in");
  },

  register: async (data) => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data, {
      skipAuth: true,
    });
    await tokenStorage.setTokens(
      response.tokens.accessToken,
      response.tokens.refreshToken,
    );
    set({ user: response.user, isAuthenticated: true });
    wsClient.connect();
    logger.info("User registered");
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Best-effort server logout
    }
    wsClient.disconnect();
    await tokenStorage.clearTokens();
    queryClient.clear();
    set({ user: null, isAuthenticated: false });
    logger.info("User logged out");
  },

  setUser: (user) => set({ user }),
}));
