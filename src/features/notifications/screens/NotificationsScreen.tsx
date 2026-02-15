/**
 * NotificationsScreen — list with realtime updates via WebSocket.
 */
import React, { useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";

import { useNotificationsQuery, useRealtimeNotifications } from "../api";
import { NotificationItem } from "../components/NotificationItem";
import { LoadingSpinner, EmptyState } from "@shared/ui";
import type { AppNotification } from "@shared/types";

export function NotificationsScreen() {
  // Subscribe to realtime notifications
  useRealtimeNotifications();

  const {
    data: notifications,
    isLoading,
    refetch,
    isRefetching,
  } = useNotificationsQuery();

  const handlePress = useCallback((notification: AppNotification) => {
    // TODO: navigate to relevant post or profile
    if (notification.postId) {
      // Navigate to post
    } else {
      // Navigate to user profile
    }
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: AppNotification }) => (
      <NotificationItem notification={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <FlatList
      data={notifications ?? []}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      ListEmptyComponent={
        <EmptyState
          title="No notifications"
          description="When someone interacts with your posts, you'll see it here"
        />
      }
      className="bg-background"
    />
  );
}
