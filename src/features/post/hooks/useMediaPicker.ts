/**
 * useMediaPicker — select and compress images/videos.
 * @see https://docs.expo.dev/versions/latest/sdk/imagepicker/
 */
import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { config } from "@shared/config";
import { logger } from "@shared/lib";

interface MediaAsset {
  uri: string;
  type: "image" | "video";
  width: number;
  height: number;
  mimeType: string;
}

export function useMediaPicker() {
  const [media, setMedia] = useState<MediaAsset | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickFromLibrary = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      logger.warn("Media library permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      videoMaxDuration: config.maxVideoDuration,
    });

    if (result.canceled || !result.assets[0]) return;
    await processAsset(result.assets[0]);
  }, []);

  const takePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      logger.warn("Camera permission denied");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;
    await processAsset(result.assets[0]);
  }, []);

  const processAsset = async (asset: ImagePicker.ImagePickerAsset) => {
    setIsProcessing(true);
    try {
      const isVideo = asset.type === "video";

      if (isVideo) {
        setMedia({
          uri: asset.uri,
          type: "video",
          width: asset.width,
          height: asset.height,
          mimeType: asset.mimeType ?? "video/mp4",
        });
      } else {
        // Resize image if larger than max dimension
        const maxDim = config.maxImageDimension;
        const needsResize = asset.width > maxDim || asset.height > maxDim;

        let finalUri = asset.uri;
        let finalWidth = asset.width;
        let finalHeight = asset.height;

        if (needsResize) {
          const scale = maxDim / Math.max(asset.width, asset.height);
          const manipulated = await ImageManipulator.manipulateAsync(
            asset.uri,
            [
              {
                resize: {
                  width: Math.round(asset.width * scale),
                  height: Math.round(asset.height * scale),
                },
              },
            ],
            {
              compress: 0.8,
              format: ImageManipulator.SaveFormat.JPEG,
            },
          );
          finalUri = manipulated.uri;
          finalWidth = manipulated.width;
          finalHeight = manipulated.height;
        }

        setMedia({
          uri: finalUri,
          type: "image",
          width: finalWidth,
          height: finalHeight,
          mimeType: "image/jpeg",
        });
      }
    } catch (err) {
      logger.error("Failed to process media", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearMedia = useCallback(() => setMedia(null), []);

  return { media, isProcessing, pickFromLibrary, takePhoto, clearMedia };
}
