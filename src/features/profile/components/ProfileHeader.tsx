/**
 * ProfileHeader — user info section.
 */
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar, Button } from "@shared/ui";
import { useAuthStore } from "@features/auth";
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
  const logout = useAuthStore((s) => s.logout);

  return (
    <View className="px-4 py-5 bg-surface border-b border-border-light">
      <View className="flex-row items-center">
        <View className="rounded-full border-2 border-primary p-0.5">
          <Avatar uri={user.avatarUrl} name={user.displayName} size="lg" />
        </View>
        <View className="flex-1 flex-row justify-around ml-4">
          <StatItem count={user.postsCount} label="Posts" />
          <StatItem count={user.followersCount} label="Followers" />
          <StatItem count={user.followingCount} label="Following" />
        </View>
      </View>

      <Text className="font-semibold text-secondary mt-3">{user.displayName}</Text>
      {user.bio ? <Text className="text-sm text-earth mt-1">{user.bio}</Text> : null}

      <View className="mt-3 gap-2">
        {isOwnProfile ? (
          <>
            <Button
              title="Edit Profile"
              variant="outline"
              size="sm"
              onPress={onEditProfile}
            />
            <Button title="Logout" variant="outline" size="sm" onPress={logout} />
          </>
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
