/**
 * RegisterScreen — registration with Zod validation.
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
import { registerSchema, type RegisterFormValues } from "../schemas";
import { ApiError } from "@shared/lib/apiClient";

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export function RegisterScreen({ onNavigateToLogin }: RegisterScreenProps) {
  const register = useAuthStore((s) => s.register);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setApiError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...payload } = data;
      await register(payload);
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(
          err.status === 409
            ? "Email or username already taken"
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
        contentContainerClassName="flex-grow justify-center px-8 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-secondary text-center mb-8">
          Create Account
        </Text>

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
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Username"
              placeholder="johndoe"
              autoComplete="username"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.username?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="displayName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Display Name"
              placeholder="John Doe"
              autoComplete="name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.displayName?.message}
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
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Confirm Password"
              placeholder="••••••••"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <Button
          title="Sign Up"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          className="mt-2"
        />

        <TouchableOpacity onPress={onNavigateToLogin} className="mt-6">
          <Text className="text-center text-muted">
            Already have an account?{" "}
            <Text className="text-primary font-semibold">Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
