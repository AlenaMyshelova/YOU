/**
 * Push notification setup with expo-notifications.
 * @see https://docs.expo.dev/push-notifications/overview/
 */
import { useEffect } from "react";
import { Platform } from "react-native";
import { logger } from "@shared/lib";

/**
 * Hook to initialize push notifications.
 * No-op on web — expo-notifications is not supported there.
 */
export function usePushNotifications() {
  useEffect(() => {
    if (Platform.OS === "web") return;

    // Dynamically import to avoid loading native modules on web
    Promise.all([
      import("expo-notifications"),
      import("expo-device"),
      import("expo-constants"),
      import("@shared/lib"),
    ])
      .then(([Notifications, Device, Constants, { apiClient }]) => {
        // Configure notification display when app is in foreground
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });

        // Register
        registerForPushNotifications(Notifications, Device, Constants, apiClient);

        // Handle notifications received while app is foregrounded
        const notifSub = Notifications.addNotificationReceivedListener((notification) => {
          logger.debug("Notification received", {
            title: notification.request.content.title,
          });
        });

        const responseSub = Notifications.addNotificationResponseReceivedListener(
          (response) => {
            const data = response.notification.request.content.data;
            logger.debug("Notification tapped", { data });
          },
        );

        // Store cleanup refs
        cleanupRef.notifSub = notifSub;
        cleanupRef.responseSub = responseSub;
        cleanupRef.removeSubscription = Notifications.removeNotificationSubscription;
      })
      .catch((err) => {
        logger.warn("Push notifications not available", err);
      });

    const cleanupRef: {
      notifSub?: { remove: () => void };
      responseSub?: { remove: () => void };
      removeSubscription?: (sub: { remove: () => void }) => void;
    } = {};

    return () => {
      if (cleanupRef.removeSubscription) {
        if (cleanupRef.notifSub) cleanupRef.removeSubscription(cleanupRef.notifSub);
        if (cleanupRef.responseSub) cleanupRef.removeSubscription(cleanupRef.responseSub);
      }
    };
  }, []);
}

/* eslint-disable @typescript-eslint/consistent-type-imports */
async function registerForPushNotifications(
  Notifications: Awaited<typeof import("expo-notifications")>,
  Device: Awaited<typeof import("expo-device")>,
  Constants: Awaited<typeof import("expo-constants")>,
  apiClient: { post: <T>(url: string, body?: unknown) => Promise<T> },
): Promise<string | null> {
  /* eslint-enable @typescript-eslint/consistent-type-imports */
  if (!Device.isDevice) {
    logger.warn("Push notifications require a physical device");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    logger.warn("Push notification permission not granted");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const projectId = Constants.default.expoConfig?.extra?.eas?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  try {
    await apiClient.post("/users/me/push-token", {
      token: tokenData.data,
      platform: Platform.OS,
    });
  } catch (err) {
    logger.error("Failed to register push token", err);
  }

  return tokenData.data;
}
