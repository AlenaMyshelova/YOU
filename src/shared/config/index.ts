import Constants from "expo-constants";

/**
 * App configuration — sourced from app.config.ts extra.
 * At runtime these come from EAS Secrets (never hardcoded).
 */
const extra = Constants.expoConfig?.extra ?? {};

export const config = {
  apiBaseUrl: (extra.apiBaseUrl as string) || "http://localhost:8000/api/v1",
  wsBaseUrl: (extra.wsBaseUrl as string) || "ws://localhost:8000/ws",
  sentryDsn: (extra.sentryDsn as string) || "",
  /** Access token TTL hint (seconds). Server is authoritative. */
  accessTokenTtl: 900, // 15 min
  /** Max image dimension for upload resize */
  maxImageDimension: 1080,
  /** Max video duration (seconds) */
  maxVideoDuration: 60,
  /** Pagination page size */
  pageSize: 20,
} as const;
