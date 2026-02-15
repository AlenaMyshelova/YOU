/**
 * Button — primary UI atom.
 * Supports variants, loading state, and disabled state.
 */
import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantStyles = {
  primary: "bg-primary",
  secondary: "bg-earth",
  outline: "border border-border bg-transparent",
  ghost: "bg-transparent",
};

const textVariantStyles = {
  primary: "text-white",
  secondary: "text-white",
  outline: "text-secondary",
  ghost: "text-primary",
};

const sizeStyles = {
  sm: "px-3 py-1.5",
  md: "px-4 py-2.5",
  lg: "px-6 py-3.5",
};

const textSizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`rounded-xl items-center justify-center flex-row ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled || loading ? "opacity-50" : ""
      } ${className ?? ""}`}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "secondary" ? "#fff" : "#4A6741"}
          className="mr-2"
        />
      )}
      <Text
        className={`font-semibold ${textVariantStyles[variant]} ${textSizeStyles[size]}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
