/**
 * Profile API hooks.
 */
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/lib";
import { config } from "@shared/config";
import type { User, Post, PaginatedResponse } from "@shared/types";

export const profileKeys = {
  all: ["profile"] as const,
  detail: (userId: string) => [...profileKeys.all, userId] as const,
  posts: (userId: string) => [...profileKeys.all, userId, "posts"] as const,
};

export function useProfileQuery(userId: string) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => apiClient.get<User>(`/users/${userId}`),
  });
}

export function useProfilePostsQuery(userId: string) {
  return useInfiniteQuery({
    queryKey: profileKeys.posts(userId),
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: String(config.pageSize),
        ...(pageParam ? { cursor: pageParam } : {}),
      });
      return apiClient.get<PaginatedResponse<Post>>(
        `/users/${userId}/posts?${params.toString()}`,
      );
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}
