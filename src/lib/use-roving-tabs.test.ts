import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useRovingTabs } from "./use-roving-tabs";

describe("useRovingTabs, controlled", () => {
  it("follows the selection it is given and reports clicks instead of selecting", () => {
    const onSelect = vi.fn();
    const { result, rerender } = renderHook(
      ({ selected }) => useRovingTabs(3, { selected, onSelect }),
      { initialProps: { selected: 1 } },
    );

    expect(result.current.selected).toBe(1);
    expect(result.current.tabProps(1)["aria-selected"]).toBe(true);

    act(() => result.current.tabProps(2).onClick());
    expect(onSelect).toHaveBeenCalledWith(2);
    expect(result.current.selected).toBe(1);

    rerender({ selected: 2 });
    expect(result.current.tabProps(2).tabIndex).toBe(0);
  });
});
