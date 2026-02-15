import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Expo app.config.ts — dynamic configuration.
 * Secrets (API URLs, Sentry DSN) come from EAS Secrets or .env via process.env.
 * NEVER commit real secrets here.
 * @see https://docs.expo.dev/workflow/configuration/
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "YOU",
  slug: "YOU",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.yourcompany.you",
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: "com.yourcompany.you",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-secure-store",
    [
      "expo-notifications",
      {
        icon: "./assets/notification-icon.png",
        color: "#ffffff",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your followers.",
        cameraPermission: "The app uses the camera to let you take photos.",
      },
    ],
    [
      "@sentry/react-native/expo",
      {
        organization: process.env.SENTRY_ORG ?? "your-org",
        project: process.env.SENTRY_PROJECT ?? "YOU",
      },
    ],
  ],
  extra: {
    // Injected at build time via EAS Secrets / eas.json
    apiBaseUrl: process.env.API_BASE_URL ?? "http://localhost:8000/api/v1",
    wsBaseUrl: process.env.WS_BASE_URL ?? "ws://localhost:8000/ws",
    sentryDsn: process.env.SENTRY_DSN ?? "",
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? "YOUR_EAS_PROJECT_ID",
    },
  },
});
