/**
 * Typed API client — centralized fetch wrapper.
 *
 * Features:
 * - Automatic access-token injection
 * - Auto-refresh on 401 (one inflight refresh at a time)
 * - Typed responses
 * - Retry with exponential backoff
 * - AbortController support
 * - Safe error handling (no token leaking)
 *
 * TODO: Replace manual types with OpenAPI-generated types.
 */
import { config } from "@shared/config";
import { tokenStorage } from "./tokenStorage";
import { logger } from "./logger";
import { handleMockRequest } from "./mockData";
import type { AuthTokens } from "@shared/types";

// ─── Types ─────────────────────────────────────────────────
interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip auth header (e.g. login/register) */
  skipAuth?: boolean;
  /** Number of retries on 5xx (default 2) */
  retries?: number;
  /** AbortSignal for cancellation */
  signal?: AbortSignal;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: unknown,
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

// ─── Refresh lock ──────────────────────────────────────────
let refreshPromise: Promise<AuthTokens> | null = null;

async function refreshTokens(): Promise<AuthTokens> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new ApiError(401, "No refresh token", null);
  }

  const res = await fetch(`${config.apiBaseUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    await tokenStorage.clearTokens();
    throw new ApiError(res.status, res.statusText, await res.json().catch(() => null));
  }

  const data = (await res.json()) as AuthTokens;
  await tokenStorage.setTokens(data.accessToken, data.refreshToken);
  return data;
}

// ─── Core request function ─────────────────────────────────
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    body,
    skipAuth = false,
    retries = 2,
    signal,
    headers: customHeaders,
    ...rest
  } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  // ─── Mock interceptor (dev only, not in tests) ─────────
  if (__DEV__ && typeof jest === "undefined") {
    const method = (rest.method as string) || "GET";
    const mockResult = handleMockRequest(method, endpoint, body);
    if (mockResult !== null) {
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 300));
      // eslint-disable-next-line no-console
      console.log(`[MOCK API] ${method} ${endpoint}`, mockResult);
      return mockResult as T;
    }

    console.warn(
      `[MOCK API] No mock for: ${method} ${endpoint} — falling through to real API`,
    );
  }

  if (!skipAuth) {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const url = endpoint.startsWith("http") ? endpoint : `${config.apiBaseUrl}${endpoint}`;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...rest,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });

      // 401 → try refresh once
      if (res.status === 401 && !skipAuth) {
        if (!refreshPromise) {
          refreshPromise = refreshTokens().finally(() => {
            refreshPromise = null;
          });
        }

        try {
          const newTokens = await refreshPromise;
          headers["Authorization"] = `Bearer ${newTokens.accessToken}`;
          // Retry the original request with new token
          const retryRes = await fetch(url, {
            ...rest,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal,
          });
          if (!retryRes.ok) {
            throw new ApiError(
              retryRes.status,
              retryRes.statusText,
              await retryRes.json().catch(() => null),
            );
          }
          return (await retryRes.json()) as T;
        } catch {
          // Refresh failed — propagate
          throw new ApiError(401, "Session expired", null);
        }
      }

      if (!res.ok) {
        throw new ApiError(
          res.status,
          res.statusText,
          await res.json().catch(() => null),
        );
      }

      // 204 No Content
      if (res.status === 204) return undefined as T;

      return (await res.json()) as T;
    } catch (err) {
      lastError = err;

      // Don't retry client errors or aborts
      if (err instanceof ApiError && err.status < 500) throw err;
      if (signal?.aborted) throw err;

      if (attempt < retries) {
        // Exponential backoff: 500ms, 1500ms
        const delay = 500 * Math.pow(3, attempt);
        await new Promise((r) => setTimeout(r, delay));
        logger.warn(`Retrying request (${attempt + 1}/${retries})`, {
          url,
          attempt,
        });
      }
    }
  }

  throw lastError;
}

// ─── Convenience methods ───────────────────────────────────
export const apiClient = {
  get: <T>(endpoint: string, opts?: RequestOptions) =>
    request<T>(endpoint, { ...opts, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(endpoint, { ...opts, method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(endpoint, { ...opts, method: "PUT", body }),

  patch: <T>(endpoint: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(endpoint, { ...opts, method: "PATCH", body }),

  delete: <T>(endpoint: string, opts?: RequestOptions) =>
    request<T>(endpoint, { ...opts, method: "DELETE" }),

  /**
   * Upload file with progress tracking.
   * Uses XMLHttpRequest for progress events (fetch doesn't support upload progress).
   */
  upload: <T>(
    endpoint: string,
    formData: FormData,
    onProgress?: (progress: number) => void,
  ): Promise<T> => {
    return new Promise(async (resolve, reject) => {
      const token = await tokenStorage.getAccessToken();
      const url = `${config.apiBaseUrl}${endpoint}`;

      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText) as T);
          } catch {
            resolve(undefined as T);
          }
        } else {
          reject(
            new ApiError(
              xhr.status,
              xhr.statusText,
              JSON.parse(xhr.responseText || "null"),
            ),
          );
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(formData);
    });
  },
};
