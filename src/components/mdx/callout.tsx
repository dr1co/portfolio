import {
  FlaskConical,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const KINDS: Record<
  string,
  { label: string; icon: LucideIcon; className: string }
> = {
  note: { label: "Note", icon: Info, className: "border-info/50 text-info" },
  warning: {
    label: "Warning",
    icon: TriangleAlert,
    className: "border-warning/50 text-warning",
  },
  simulated: {
    label: "Simulated",
    icon: FlaskConical,
    className: "border-border text-muted",
  },
};

/** Highlighted aside for MDX. The kind is named in text next to its icon, never by color alone. */
export function Callout({
  kind = "note",
  children,
}: {
  kind?: "note" | "warning" | "simulated";
  children: ReactNode;
}) {
  const { label, icon: Icon, className } = KINDS[kind];

  return (
    <div
      role="note"
      className={cn(
        "my-6 rounded-lg border-l-4 bg-surface px-5 py-4",
        className,
      )}
    >
      <p className="flex items-center gap-2 font-mono text-sm font-semibold">
        <Icon aria-hidden className="size-4" />
        {label}
      </p>
      <div className="mt-2 text-foreground [&>p]:mt-0">{children}</div>
    </div>
  );
}
