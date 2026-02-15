/**
 * AppProviders — wraps the app with all necessary providers.
 */
import React, { type ReactNode, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { queryClient, initSentry } from "@shared/lib";
import { ErrorBoundary } from "@shared/ui";
import { useAuthStore } from "@features/auth";
import { usePushNotifications } from "../notifications/usePushNotifications";

interface AppProvidersProps {
  children: ReactNode;
}

function AppInitializer({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  // Hydrate auth on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Setup push notifications after auth
  usePushNotifications();

  return <>{children}</>;
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    initSentry();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AppInitializer>
              <StatusBar style="auto" />
              {children}
            </AppInitializer>
          </QueryClientProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
