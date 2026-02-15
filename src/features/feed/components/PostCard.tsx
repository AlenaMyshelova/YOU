/**
 * PostCard — single feed post component.
 */
import React, { memo } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Avatar } from "@shared/ui";
import type { Post } from "@shared/types";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface PostCardProps {
  post: Post;
  onLike: (postId: string, isLiked: boolean) => void;
  onPressUser: (userId: string) => void;
  onPressComments: (postId: string) => void;
}

export const PostCard = memo(function PostCard({
  post,
  onLike,
  onPressUser,
  onPressComments,
}: PostCardProps) {
  return (
    <View className="bg-surface mb-2">
      {/* Header */}
      <TouchableOpacity
        onPress={() => onPressUser(post.author.id)}
        className="flex-row items-center px-3 py-2"
      >
        <Avatar uri={post.author.avatarUrl} name={post.author.displayName} size="sm" />
        <Text className="ml-2 font-semibold text-secondary text-sm">
          {post.author.username}
        </Text>
      </TouchableOpacity>

      {/* Image */}
      <Image
        source={{ uri: post.imageUrl }}
        style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* Actions */}
      <View className="flex-row px-3 py-2">
        <TouchableOpacity onPress={() => onLike(post.id, post.isLiked)} className="mr-4">
          <Text className={`text-2xl ${post.isLiked ? "text-error" : "text-secondary"}`}>
            {post.isLiked ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressComments(post.id)}>
          <Text className="text-2xl text-secondary">💬</Text>
        </TouchableOpacity>
      </View>

      {/* Likes count */}
      <Text className="px-3 font-semibold text-secondary text-sm">
        {post.likesCount.toLocaleString()} likes
      </Text>

      {/* Caption */}
      {post.caption ? (
        <Text className="px-3 py-1 text-sm text-secondary">
          <Text className="font-semibold">{post.author.username} </Text>
          {post.caption}
        </Text>
      ) : null}

      {/* Comments link */}
      {post.commentsCount > 0 && (
        <TouchableOpacity onPress={() => onPressComments(post.id)} className="px-3 pb-2">
          <Text className="text-muted text-sm">
            View all {post.commentsCount} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Timestamp */}
      <Text className="px-3 pb-3 text-xs text-muted">
        {new Date(post.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );
});
