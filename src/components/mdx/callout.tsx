import {
  FlaskConical,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { cn } from "@/lib/cn";

type Kind = "note" | "warning" | "simulated";

const KINDS: Record<Kind, { icon: LucideIcon; className: string }> = {
  note: { icon: Info, className: "border-info/50 text-info" },
  warning: {
    icon: TriangleAlert,
    className: "border-warning/50 text-warning",
  },
  simulated: {
    icon: FlaskConical,
    className: "border-border text-muted",
  },
};

/** Highlighted aside for MDX. The kind is named in text next to its icon, never by color alone. */
export function Callout({
  kind = "note",
  locale,
  children,
}: {
  kind?: Kind;
  locale: Locale;
  children: ReactNode;
}) {
  const { icon: Icon, className } = KINDS[kind];

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
        {getMessages(locale).mdx.callout[kind]}
      </p>
      <div className="mt-2 text-foreground [&>p]:mt-0">{children}</div>
    </div>
  );
}
