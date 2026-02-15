/**
 * Feed API — TanStack Query hooks for feed data.
 */
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@shared/lib";
import { config } from "@shared/config";
import type { Post, PaginatedResponse } from "@shared/types";

// ─── Query Keys ────────────────────────────────────────────
export const feedKeys = {
  all: ["feed"] as const,
  list: () => [...feedKeys.all, "list"] as const,
  detail: (id: string) => [...feedKeys.all, "detail", id] as const,
};

// ─── Infinite Feed ─────────────────────────────────────────
export function useFeedQuery() {
  return useInfiniteQuery({
    queryKey: feedKeys.list(),
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: String(config.pageSize),
        ...(pageParam ? { cursor: pageParam } : {}),
      });
      return apiClient.get<PaginatedResponse<Post>>(`/feed?${params.toString()}`);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}

// ─── Like / Unlike ─────────────────────────────────────────
export function useLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (isLiked) {
        return apiClient.delete(`/posts/${postId}/like`);
      }
      return apiClient.post(`/posts/${postId}/like`);
    },

    // Optimistic update
    onMutate: async ({ postId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: feedKeys.list() });

      const previousData = queryClient.getQueryData(feedKeys.list());

      queryClient.setQueryData(
        feedKeys.list(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: PaginatedResponse<Post>) => ({
              ...page,
              items: page.items.map((post: Post) =>
                post.id === postId
                  ? {
                      ...post,
                      isLiked: !isLiked,
                      likesCount: post.likesCount + (isLiked ? -1 : 1),
                    }
                  : post,
              ),
            })),
          };
        },
      );

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(feedKeys.list(), context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.list() });
    },
  });
}
