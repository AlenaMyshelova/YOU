/**
 * Notifications API hooks + WebSocket integration.
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiClient, wsClient } from "@shared/lib";
import type { AppNotification, WSMessage } from "@shared/types";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unread"] as const,
};

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => apiClient.get<AppNotification[]>("/notifications"),
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => apiClient.get<{ count: number }>("/notifications/unread-count"),
    refetchInterval: 30_000, // Poll every 30s as fallback
  });
}

/**
 * Hook to subscribe to realtime notifications via WebSocket.
 * Automatically invalidates the Query cache when a new notification arrives.
 */
export function useRealtimeNotifications() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = wsClient.on("notification", (_msg: WSMessage) => {
      // Invalidate both list and unread count
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    });

    return unsubscribe;
  }, [queryClient]);
}
