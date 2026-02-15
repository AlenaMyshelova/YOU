/**
 * Post creation API hooks.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@shared/lib";
import { feedKeys } from "../feed/api";
import type { Post } from "@shared/types";

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      onProgress,
    }: {
      formData: FormData;
      onProgress?: (progress: number) => void;
    }) => {
      return apiClient.upload<Post>("/posts", formData, onProgress);
    },
    onSuccess: () => {
      // Invalidate feed to show new post
      queryClient.invalidateQueries({ queryKey: feedKeys.list() });
    },
  });
}
