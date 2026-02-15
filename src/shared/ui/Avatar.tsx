/**
 * Avatar — circular user avatar with fallback.
 */
import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";

interface AvatarProps {
  uri: string | null | undefined;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-20 h-20", text: "text-xl" },
};

export function Avatar({ uri, name, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const s = sizeMap[size];

  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={`${s.container} rounded-full ${className ?? ""}`}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
    );
  }

  return (
    <View
      className={`${s.container} rounded-full bg-muted items-center justify-center ${className ?? ""}`}
    >
      <Text className={`${s.text} font-bold text-white`}>{initials}</Text>
    </View>
  );
}
