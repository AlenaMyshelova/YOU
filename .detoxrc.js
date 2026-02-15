/**
 * Detox E2E Testing Configuration — TODO
 *
 * Detox setup for end-to-end UI testing.
 * Requires: detox, detox-cli, custom Expo dev client build.
 *
 * Steps to enable:
 * 1. npm install -D detox detox-cli jest-circus
 * 2. Create Expo dev client with EAS Build
 * 3. Configure .detoxrc.js
 * 4. Write e2e specs in e2e/ folder
 *
 * @see https://wix.github.io/Detox/docs/introduction/expo
 */
module.exports = {
  testRunner: {
    args: {
      $0: "jest",
      config: "e2e/jest.config.js",
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    "ios.debug": {
      type: "ios.app",
      // TODO: Update with actual path after EAS dev-client build
      binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/instagramclone.app",
      build:
        "xcodebuild -workspace ios/instagramclone.xcworkspace -scheme instagramclone -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
    },
    "android.debug": {
      type: "android.apk",
      // TODO: Update with actual path after EAS dev-client build
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build:
        "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: { type: "iPhone 15" },
    },
    emulator: {
      type: "android.emulator",
      device: { avdName: "Pixel_4_API_34" },
    },
  },
  configurations: {
    "ios.sim.debug": {
      device: "simulator",
      app: "ios.debug",
    },
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
    },
  },
};
