import { onTestFinished, vi } from "vitest";

/**
 * Makes `window.matchMedia` report `matches` for every query until the current test ends.
 * Returns a function that changes the result and notifies listeners.
 */
export function stubMatchMedia(matches: boolean) {
  const original = vi.mocked(window.matchMedia).getMockImplementation();
  const listeners = new Set<() => void>();
  let current = matches;

  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return current;
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

  return (next: boolean) => {
    current = next;
    listeners.forEach((listener) => listener());
  };
}
