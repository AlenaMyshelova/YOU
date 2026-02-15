/**
 * ErrorBoundary — catches rendering errors and shows fallback UI.
 * Also reports to Sentry in production.
 */
import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Sentry from "@sentry/react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (!__DEV__) {
      Sentry.captureException(error, {
        extra: { componentStack: errorInfo.componentStack },
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View className="flex-1 items-center justify-center p-8 bg-background">
          <Text className="text-lg font-semibold text-secondary mb-2">
            Something went wrong
          </Text>
          <Text className="text-sm text-muted text-center mb-4">
            {__DEV__ ? this.state.error?.message : "An unexpected error occurred."}
          </Text>
          <TouchableOpacity
            onPress={this.handleRetry}
            className="bg-primary px-6 py-2.5 rounded-xl"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
