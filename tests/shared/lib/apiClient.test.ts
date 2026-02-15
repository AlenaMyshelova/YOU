/**
 * Tests for apiClient — core fetch wrapper.
 */
import { apiClient, ApiError } from "@shared/lib/apiClient";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock tokenStorage
jest.mock("@shared/lib/tokenStorage", () => ({
  tokenStorage: {
    getAccessToken: jest.fn().mockResolvedValue("mock-access-token"),
    getRefreshToken: jest.fn().mockResolvedValue("mock-refresh-token"),
    setTokens: jest.fn().mockResolvedValue(undefined),
    clearTokens: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("@shared/lib/logger", () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe("apiClient", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("GET requests", () => {
    it("should make a GET request with auth header", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1", name: "Test" }),
      });

      const result = await apiClient.get("/users/me");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/me"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer mock-access-token",
          }),
        }),
      );
      expect(result).toEqual({ id: "1", name: "Test" });
    });

    it("should skip auth header when skipAuth is true", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiClient.get("/public/data", { skipAuth: true });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.anything(),
          }),
        }),
      );
    });
  });

  describe("POST requests", () => {
    it("should send JSON body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await apiClient.post("/posts", { caption: "Hello" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ caption: "Hello" }),
        }),
      );
    });
  });

  describe("Error handling", () => {
    it("should throw ApiError on non-ok response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: () => Promise.resolve({ detail: "Not found" }),
      });

      await expect(apiClient.get("/nonexistent")).rejects.toThrow(ApiError);
    });

    it("should handle 204 No Content", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await apiClient.delete("/posts/1");
      expect(result).toBeUndefined();
    });
  });

  describe("Retry logic", () => {
    it("should retry on 500 errors", async () => {
      // First call: 500, second call: 200
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true }),
        });

      const result = await apiClient.get("/flaky-endpoint", {
        retries: 1,
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    }, 10000);
  });
});
