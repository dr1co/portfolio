import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** `false` during server render and hydration, `true` afterwards. Use to gate client-only values. */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
