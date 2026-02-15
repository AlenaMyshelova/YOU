/**
 * LoadingSpinner — centered loading indicator.
 */
import React from "react";
import { View, ActivityIndicator } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
}

export function LoadingSpinner({
  size = "large",
  color = "#3897F0",
}: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
