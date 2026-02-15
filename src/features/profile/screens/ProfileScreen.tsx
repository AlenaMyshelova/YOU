/**
 * ProfileScreen — user profile with posts grid.
 */
import React, { useCallback } from "react";
import { FlatList, View, Dimensions, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

import { useProfileQuery, useProfilePostsQuery } from "../api";
import { ProfileHeader } from "../components/ProfileHeader";
import { LoadingSpinner, EmptyState } from "@shared/ui";
import { useAuthStore } from "@features/auth";
import type { Post } from "@shared/types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_GAP = 2;
const ITEM_SIZE = (SCREEN_WIDTH - GRID_GAP * 2) / 3;

interface ProfileScreenProps {
  userId?: string;
}

export function ProfileScreen({ userId }: ProfileScreenProps) {
  const currentUser = useAuthStore((s) => s.user);
  const profileId = userId ?? currentUser?.id ?? "";
  const isOwnProfile = profileId === currentUser?.id;

  const { data: user, isLoading: isLoadingUser } = useProfileQuery(profileId);

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProfilePostsQuery(profileId);

  const posts = postsData?.pages.flatMap((p) => p.items) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderGridItem = useCallback(
    ({ item }: { item: Post }) => (
      <TouchableOpacity
        style={{ width: ITEM_SIZE, height: ITEM_SIZE, margin: GRID_GAP / 2 }}
      >
        <Image
          source={{ uri: item.thumbnailUrl || item.imageUrl }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </TouchableOpacity>
    ),
    [],
  );

  if (isLoadingUser) return <LoadingSpinner />;
  if (!user) return <EmptyState title="User not found" />;

  return (
    <FlatList
      data={posts}
      renderItem={renderGridItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          onEditProfile={() => {
            /* TODO: navigate to edit */
          }}
          onFollow={() => {
            /* TODO: follow mutation */
          }}
        />
      }
      ListEmptyComponent={
        <EmptyState
          title="No posts yet"
          description={
            isOwnProfile ? "Share your first photo!" : "This user hasn't posted yet."
          }
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <LoadingSpinner size="small" />
          </View>
        ) : null
      }
      className="bg-background"
    />
  );
}
