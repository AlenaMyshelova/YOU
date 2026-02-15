/**
 * OfflinePlaceholder — shown when there's no network connectivity.
 */
import React from "react";
import { View, Text } from "react-native";

export function OfflinePlaceholder() {
  return (
    <View className="bg-error/10 px-4 py-2 items-center">
      <Text className="text-error text-sm font-medium">No internet connection</Text>
    </View>
  );
}
