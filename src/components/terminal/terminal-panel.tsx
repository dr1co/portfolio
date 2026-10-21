import type { ReactNode } from "react";
import { CopyButton } from "./copy-button";
import { PanelFrame } from "./panel-frame";

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
    <PanelFrame
      title={title}
      caption={caption}
      actions={
        <>
          {badge}
          {copyable && commands.length > 0 && (
            <CopyButton text={commands.join("\n")} label="Copy command" />
          )}
        </>
      }
    >
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
    </PanelFrame>
  );
}
