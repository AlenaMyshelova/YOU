/**
 * TextInput — form input atom with label, error display, and icon support.
 */
import React, { forwardRef } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  type TextInputProps as RNTextInputProps,
} from "react-native";

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, error, containerClassName, className, ...props }, ref) => {
    return (
      <View className={`mb-4 ${containerClassName ?? ""}`}>
        {label && (
          <Text className="text-sm font-medium text-secondary mb-1">{label}</Text>
        )}
        <RNTextInput
          ref={ref}
          className={`border rounded-xl px-4 py-3 text-base text-secondary bg-surface ${
            error ? "border-error" : "border-border"
          } ${className ?? ""}`}
          placeholderTextColor="#8A8279"
          autoCapitalize="none"
          {...props}
        />
        {error && <Text className="text-xs text-error mt-1">{error}</Text>}
      </View>
    );
  },
);

TextInput.displayName = "TextInput";
