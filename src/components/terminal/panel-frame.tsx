import type { ReactNode } from "react";

/** Window-style frame shared by terminal panels and code blocks: title bar with dots, a label, and actions on the right. */
export function PanelFrame({
  title,
  actions,
  caption,
  children,
}: {
  title: string;
  actions?: ReactNode;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex min-h-10 items-center gap-3 border-b border-border px-4 py-1">
        <span aria-hidden className="flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-2.5 rounded-full bg-border" />
          ))}
        </span>
        <span className="truncate font-mono text-xs text-muted">{title}</span>
        <span className="ml-auto flex shrink-0 items-center gap-2">
          {actions}
        </span>
      </div>
      {children}
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
