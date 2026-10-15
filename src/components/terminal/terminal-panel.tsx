import type { ReactNode } from "react";
import { CopyButton } from "./copy-button";

/**
 * Theme-aware terminal presentation (never executes anything).
 * Lines starting with `$ ` render as prompts; `badge` labels the panel (e.g. Example, Simulated).
 * `copyable` adds a button that copies the prompt lines without their `$`.
 */
export function TerminalPanel({
  title,
  lines,
  badge,
  caption,
  copyable,
}: {
  title: string;
  lines: readonly string[];
  badge?: ReactNode;
  caption?: string;
  copyable?: boolean;
}) {
  const commands = lines
    .filter((line) => line.startsWith("$ "))
    .map((line) => line.slice(2));

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
          {badge}
          {copyable && commands.length > 0 && (
            <CopyButton text={commands.join("\n")} label="Copy command" />
          )}
        </span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        <code>
          {lines.map((line, index) =>
            line.startsWith("$ ") ? (
              <span key={index} className="block text-foreground">
                <span aria-hidden className="text-accent select-none">
                  ${" "}
                </span>
                {line.slice(2)}
              </span>
            ) : (
              <span key={index} className="block text-muted">
                {line}
              </span>
            ),
          )}
        </code>
      </pre>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
