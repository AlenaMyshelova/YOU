/**
 * CreatePostScreen — select media, add caption, upload with progress.
 */
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Video, ResizeMode } from "expo-av";

import { Button, TextInput } from "@shared/ui";
import { useMediaPicker } from "../hooks/useMediaPicker";
import { useCreatePostMutation } from "../api";

export function CreatePostScreen() {
  const { media, isProcessing, pickFromLibrary, takePhoto, clearMedia } =
    useMediaPicker();
  const createPost = useCreatePostMutation();
  const [caption, setCaption] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async () => {
    if (!media) {
      Alert.alert("Error", "Please select a photo or video");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("mediaType", media.type);

    // React Native FormData expects this shape for file uploads
    formData.append("file", {
      uri: media.uri,
      type: media.mimeType,
      name: `post.${media.type === "image" ? "jpg" : "mp4"}`,
    } as unknown as Blob);

    try {
      await createPost.mutateAsync({
        formData,
        onProgress: setUploadProgress,
      });
      setCaption("");
      clearMedia();
      setUploadProgress(0);
      Alert.alert("Success", "Post created!");
    } catch {
      Alert.alert("Error", "Failed to create post. Please try again.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4">
      {/* Media picker buttons */}
      {!media && (
        <View className="items-center py-12">
          <Text className="text-lg font-semibold text-secondary mb-6">
            Share a moment
          </Text>
          <View className="flex-row gap-3">
            <Button
              title="📷 Camera"
              variant="outline"
              onPress={takePhoto}
              loading={isProcessing}
            />
            <Button
              title="🖼 Gallery"
              variant="outline"
              onPress={pickFromLibrary}
              loading={isProcessing}
            />
          </View>
        </View>
      )}

      {/* Preview */}
      {media && (
        <View className="mb-4">
          <View className="relative">
            {media.type === "image" ? (
              <Image
                source={{ uri: media.uri }}
                className="w-full aspect-square rounded-lg"
                contentFit="cover"
              />
            ) : (
              <Video
                source={{ uri: media.uri }}
                className="w-full aspect-square rounded-lg"
                resizeMode={ResizeMode.COVER}
                useNativeControls
                isLooping={false}
              />
            )}
            <TouchableOpacity
              onPress={clearMedia}
              className="absolute top-2 right-2 bg-black/50 rounded-full w-8 h-8 items-center justify-center"
            >
              <Text className="text-white text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Write a caption..."
            value={caption}
            onChangeText={setCaption}
            multiline
            containerClassName="mt-4"
          />

          {/* Upload progress */}
          {createPost.isPending && uploadProgress > 0 && (
            <View className="mt-2">
              <View className="bg-border rounded-full h-2 overflow-hidden">
                <View
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </View>
              <Text className="text-xs text-muted mt-1 text-center">
                Uploading {uploadProgress}%
              </Text>
            </View>
          )}

          <Button
            title="Share"
            onPress={handleSubmit}
            loading={createPost.isPending}
            className="mt-4"
          />
        </View>
      )}
    </ScrollView>
  );
}
