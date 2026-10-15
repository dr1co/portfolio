"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useIsMounted } from "@/lib/use-is-mounted";

/** Two-state theme switch. Icons are CSS-driven so server HTML is correct; the label settles after mount. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={mounted ? `Switch to ${next} theme` : "Toggle theme"}
      className="inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={resolvedTheme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="inline-flex"
        >
          <Sun aria-hidden className="hidden size-5 dark:block" />
          <Moon aria-hidden className="size-5 dark:hidden" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
