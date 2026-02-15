/**
 * NotificationItem — single notification row.
 */
import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from "@shared/ui";
import type { AppNotification } from "@shared/types";

interface NotificationItemProps {
  notification: AppNotification;
  onPress: (notification: AppNotification) => void;
}

const notificationMessages: Record<string, string> = {
  like: "liked your post",
  comment: "commented on your post",
  follow: "started following you",
  mention: "mentioned you in a comment",
};

export const NotificationItem = memo(function NotificationItem({
  notification,
  onPress,
}: NotificationItemProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(notification)}
      className={`flex-row items-center px-4 py-3 border-b border-border ${
        notification.isRead ? "bg-surface" : "bg-primary/5"
      }`}
    >
      <Avatar
        uri={notification.actor.avatarUrl}
        name={notification.actor.displayName}
        size="sm"
      />
      <View className="flex-1 ml-3">
        <Text className="text-sm text-secondary">
          <Text className="font-semibold">{notification.actor.username}</Text>{" "}
          {notificationMessages[notification.type] ?? notification.message}
        </Text>
        <Text className="text-xs text-muted mt-0.5">
          {new Date(notification.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
