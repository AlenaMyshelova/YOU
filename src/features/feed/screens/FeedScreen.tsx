/**
 * FeedScreen — infinite scroll feed with pull-to-refresh and optimistic likes.
 */
import React, { useCallback } from "react";
import { FlatList, RefreshControl, View, Text } from "react-native";

import { useFeedQuery, useLikeMutation } from "../api";
import { PostCard } from "../components/PostCard";
import { LoadingSpinner, EmptyState } from "@shared/ui";
import type { Post } from "@shared/types";

export function FeedScreen() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useFeedQuery();

  const likeMutation = useLikeMutation();

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  const handleLike = useCallback(
    (postId: string, isLiked: boolean) => {
      likeMutation.mutate({ postId, isLiked });
    },
    [likeMutation],
  );

  const handlePressUser = useCallback((_userId: string) => {
    // TODO: Navigate to profile
  }, []);

  const handlePressComments = useCallback((_postId: string) => {
    // TODO: Navigate to comments
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        onLike={handleLike}
        onPressUser={handlePressUser}
        onPressComments={handlePressComments}
      />
    ),
    [handleLike, handlePressUser, handlePressComments],
  );

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-error text-center">
          {error?.message ?? "Failed to load feed"}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      ListEmptyComponent={
        <EmptyState
          title="No posts yet"
          description="Follow people to see their posts here"
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <LoadingSpinner size="small" />
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
      className="bg-background"
    />
  );
}
