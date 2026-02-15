/**
 * EmptyState — placeholder for empty lists.
 */
import React from "react";
import { View, Text } from "react-native";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-lg font-semibold text-secondary mb-2">{title}</Text>
      {description && (
        <Text className="text-sm text-muted text-center">{description}</Text>
      )}
    </View>
  );
}
