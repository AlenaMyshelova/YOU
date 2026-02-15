/**
 * Component tests for Avatar.
 */
import React from "react";
import { View } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { Avatar } from "@shared/ui/Avatar";

// Mock expo-image
jest.mock("expo-image", () => ({
  Image: (props: Record<string, unknown>) => {
    return <View {...props} testID="avatar-image" />;
  },
}));

describe("Avatar", () => {
  it("renders initials when no URI provided", () => {
    render(<Avatar uri={null} name="John Doe" />);
    expect(screen.getByText("JD")).toBeTruthy();
  });

  it("renders single initial for single word name", () => {
    render(<Avatar uri={null} name="John" />);
    expect(screen.getByText("J")).toBeTruthy();
  });

  it("renders image when URI is provided", () => {
    render(<Avatar uri="https://example.com/avatar.jpg" name="Jane" />);
    expect(screen.getByTestId("avatar-image")).toBeTruthy();
  });
});
