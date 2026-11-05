import { onTestFinished, vi } from "vitest";

/**
 * Makes `window.matchMedia` answer every query with `matches` (or `matches(query)`) until the current
 * test ends. Returns a function that changes the answer and notifies listeners.
 */
export function stubMatchMedia(
  matches: boolean | ((query: string) => boolean),
) {
  const original = vi.mocked(window.matchMedia).getMockImplementation();
  const listeners = new Set<() => void>();
  let current = matches;

  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return typeof current === "function" ? current(query) : current;
        },
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: (_: string, listener: () => void) =>
          listeners.add(listener),
        removeEventListener: (_: string, listener: () => void) =>
          listeners.delete(listener),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  );
  onTestFinished(() => {
    if (original) vi.mocked(window.matchMedia).mockImplementation(original);
  });

  return (next: typeof matches) => {
    current = next;
    listeners.forEach((listener) => listener());
  };
}
