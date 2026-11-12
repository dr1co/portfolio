"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Focusable graphic named `label`, with a tooltip that fades in on hover, focus or tap.
 * CSS does the showing, so it works without JavaScript; Escape hides it until the next hover or focus (WCAG 1.4.13).
 * The tooltip opens below the graphic and spans its nearest positioned ancestor.
 */
export function Tooltip({
  label,
  content,
  children,
  className,
}: {
  label: string;
  content: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  const [active, setActive] = useState({ hover: false, focus: false });
  const [dismissed, setDismissed] = useState(false);
  const listening = active.hover || active.focus;

  useEffect(() => {
    if (!listening) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDismissed(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [listening]);

  const activate = (key: keyof typeof active, value: boolean) => {
    setActive((current) => ({ ...current, [key]: value }));
    if (value) setDismissed(false);
  };

  return (
    <span
      className="group/tooltip block"
      onPointerEnter={() => activate("hover", true)}
      onPointerLeave={() => activate("hover", false)}
      onFocus={() => activate("focus", true)}
      onBlur={() => activate("focus", false)}
    >
      <span
        role="img"
        aria-label={label}
        aria-describedby={id}
        tabIndex={0}
        className={className}
      >
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className={cn(
          "invisible absolute inset-x-0 z-10 pt-2 opacity-0 transition-[opacity,visibility] duration-150 ease-out motion-reduce:transition-none",
          !dismissed &&
            "group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100 group-hover/tooltip:visible group-hover/tooltip:opacity-100",
        )}
      >
        <span className="block rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm shadow-lg">
          {content}
        </span>
      </span>
    </span>
  );
}
