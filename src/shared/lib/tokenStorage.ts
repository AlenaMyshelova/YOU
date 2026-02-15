/**
 * Secure token storage.
 * Native: expo-secure-store (encrypted keychain/keystore).
 * Web: localStorage (no secure-store support on web).
 * Tokens are NEVER logged or exposed.
 * @see https://docs.expo.dev/versions/latest/sdk/securestore/
 */
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

/**
 * Web-safe storage fallback using localStorage.
 */
const webStorage = {
  async getAccessToken(): Promise<string | null> {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken(): Promise<string | null> {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  async clearTokens(): Promise<void> {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

/**
 * Native storage using expo-secure-store (loaded dynamically to avoid web crash).
 */
const nativeStorage = {
  async getAccessToken(): Promise<string | null> {
    const SecureStore = await import("expo-secure-store");
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken(): Promise<string | null> {
    const SecureStore = await import("expo-secure-store");
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    const SecureStore = await import("expo-secure-store");
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },
  async clearTokens(): Promise<void> {
    const SecureStore = await import("expo-secure-store");
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};

export const tokenStorage = Platform.OS === "web" ? webStorage : nativeStorage;
