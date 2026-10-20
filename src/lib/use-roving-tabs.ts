import { useRef, useState, type KeyboardEvent } from "react";

/**
 * WAI-ARIA tabs with automatic activation: one tab in the Tab order, arrows move and select
 * (both axes, wrapping), Home/End jump. Spread `tabProps(i)` on each tab button.
 */
export function useRovingTabs(count: number, initial = 0) {
  const [selected, setSelected] = useState(initial);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    const next = (index + count) % count;
    setSelected(next);
    tabs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    const targets: Record<string, number> = {
      ArrowRight: selected + 1,
      ArrowDown: selected + 1,
      ArrowLeft: selected - 1,
      ArrowUp: selected - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    select(targets[event.key]);
  }

  function tabProps(index: number) {
    return {
      ref: (element: HTMLButtonElement | null) => {
        tabs.current[index] = element;
      },
      role: "tab" as const,
      type: "button" as const,
      "aria-selected": index === selected,
      tabIndex: index === selected ? 0 : -1,
      onClick: () => setSelected(index),
      onKeyDown,
    };
  }

  return { selected, tabProps };
}
