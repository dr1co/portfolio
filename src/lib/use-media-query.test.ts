import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { stubMatchMedia } from "@/test/match-media";
import { useMediaQuery } from "./use-media-query";

describe("useMediaQuery", () => {
  it("reports whether the query matches and follows changes", () => {
    const change = stubMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery("(min-width: 64rem)"));
    expect(result.current).toBe(true);

    act(() => change(false));
    expect(result.current).toBe(false);
  });
});
