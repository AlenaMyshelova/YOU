/**
 * ProfileHeader — user info section.
 */
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar, Button } from "@shared/ui";
import type { User } from "@shared/types";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onEditProfile?: () => void;
  onFollow?: () => void;
}

export function ProfileHeader({
  user,
  isOwnProfile,
  onEditProfile,
  onFollow,
}: ProfileHeaderProps) {
  return (
    <View className="px-4 py-4 bg-surface">
      <View className="flex-row items-center">
        <Avatar uri={user.avatarUrl} name={user.displayName} size="lg" />
        <View className="flex-1 flex-row justify-around ml-4">
          <StatItem count={user.postsCount} label="Posts" />
          <StatItem count={user.followersCount} label="Followers" />
          <StatItem count={user.followingCount} label="Following" />
        </View>
      </View>

      <Text className="font-semibold text-secondary mt-3">{user.displayName}</Text>
      {user.bio ? <Text className="text-sm text-secondary mt-1">{user.bio}</Text> : null}

      <View className="mt-3">
        {isOwnProfile ? (
          <Button
            title="Edit Profile"
            variant="outline"
            size="sm"
            onPress={onEditProfile}
          />
        ) : (
          <Button
            title={user.isFollowing ? "Following" : "Follow"}
            variant={user.isFollowing ? "outline" : "primary"}
            size="sm"
            onPress={onFollow}
          />
        )}
      </View>
    </View>
  );
}

function StatItem({ count, label }: { count: number; label: string }) {
  return (
    <TouchableOpacity className="items-center">
      <Text className="font-bold text-secondary text-base">{count.toLocaleString()}</Text>
      <Text className="text-xs text-muted">{label}</Text>
    </TouchableOpacity>
  );
}
