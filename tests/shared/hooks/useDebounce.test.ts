/**
 * Tests for useDebounce hook.
 */
import { renderHook, act } from "@testing-library/react-native";
import { useDebounce } from "@shared/hooks/useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("debounces value changes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    });

    expect(result.current).toBe("a");

    rerender({ value: "ab" });
    expect(result.current).toBe("a"); // Still old value

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("ab"); // Now updated
  });

  it("resets timer on rapid changes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    });

    rerender({ value: "ab" });
    act(() => jest.advanceTimersByTime(100));

    rerender({ value: "abc" });
    act(() => jest.advanceTimersByTime(100));

    rerender({ value: "abcd" });
    act(() => jest.advanceTimersByTime(300));

    expect(result.current).toBe("abcd");
  });
});
