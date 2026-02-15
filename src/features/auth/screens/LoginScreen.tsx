/**
 * LoginScreen — email/password login with Zod validation.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, TextInput } from "@shared/ui";
import { useAuthStore } from "../store";
import { loginSchema, type LoginFormValues } from "../schemas";
import { ApiError } from "@shared/lib/apiClient";

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export function LoginScreen({ onNavigateToRegister }: LoginScreenProps) {
  const login = useAuthStore((s) => s.login);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setApiError(null);
      await login(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(
          err.status === 401
            ? "Invalid email or password"
            : "Something went wrong. Please try again.",
        );
      } else {
        setApiError("Network error. Check your connection.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-8"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-secondary text-center mb-8">YOU</Text>

        {apiError && (
          <View className="bg-error/10 p-3 rounded-lg mb-4">
            <Text className="text-error text-sm text-center">{apiError}</Text>
          </View>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoComplete="email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        <Button
          title="Log In"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          className="mt-2"
        />

        <TouchableOpacity onPress={onNavigateToRegister} className="mt-6">
          <Text className="text-center text-muted">
            Don't have an account?{" "}
            <Text className="text-primary font-semibold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
