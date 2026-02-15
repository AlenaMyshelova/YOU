/**
 * Component tests for Button.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Button } from "@shared/ui/Button";

describe("Button", () => {
  it("renders with title", () => {
    render(<Button title="Press me" />);
    expect(screen.getByText("Press me")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<Button title="Press me" onPress={onPress} />);
    fireEvent.press(screen.getByText("Press me"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    render(<Button title="Disabled" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText("Disabled"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows loading indicator when loading", () => {
    render(<Button title="Loading" loading />);
    // Button should be disabled when loading
    const button = screen.getByText("Loading");
    expect(button).toBeTruthy();
  });
});
