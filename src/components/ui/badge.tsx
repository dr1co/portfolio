import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const TONES = {
  neutral: "border-border text-muted",
  accent: "border-accent/40 text-accent",
  info: "border-info/40 text-info",
  warning: "border-warning/40 text-warning",
};

/** Small mono label. State badges pass an `icon`, but the text always carries the meaning. */
export function Badge({
  children,
  icon: Icon,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  icon?: LucideIcon;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs",
        TONES[tone],
        className,
      )}
    >
      {Icon && <Icon aria-hidden className="size-3.5" />}
      {children}
    </span>
  );
}
