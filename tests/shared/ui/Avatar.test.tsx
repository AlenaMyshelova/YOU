/**
 * Component tests for Avatar.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Avatar } from "@shared/ui/Avatar";

// Mock expo-image — must use require() inside factory to avoid out-of-scope variable error
jest.mock("expo-image", () => {
  return {
    /* eslint-disable @typescript-eslint/no-require-imports */
    Image: (props: Record<string, unknown>) =>
      require("react").createElement(require("react-native").View, {
        ...props,
        testID: "avatar-image",
      }),
    /* eslint-enable @typescript-eslint/no-require-imports */
  };
});

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
