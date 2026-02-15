/**
 * TanStack Query client configuration.
 * @see https://tanstack.com/query/latest/docs/framework/react/reference/QueryClient
 */
import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./apiClient";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry auth errors
        if (error instanceof ApiError && error.status === 401) return false;
        if (error instanceof ApiError && error.status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // Mobile — not relevant
    },
    mutations: {
      retry: false,
    },
  },
});
