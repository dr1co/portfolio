import { isValidElement, type ComponentProps, type ReactNode } from "react";
import { CopyButton } from "@/components/terminal/copy-button";
import { PanelFrame } from "@/components/terminal/panel-frame";
import { cn } from "@/lib/cn";

type ElementProps = { children?: ReactNode; className?: string };

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<ElementProps>(node)) return textOf(node.props.children);
  return "";
}

function languageOf(children: ReactNode): string {
  const className = isValidElement<ElementProps>(children)
    ? (children.props.className ?? "")
    : "";
  return /language-(\S+)/.exec(className)?.[1] ?? "code";
}

/** MDX `pre` replacement: Shiki-highlighted code inside a panel with its language and a copy button. */
export function CodeBlock({
  children,
  className,
  ...props
}: ComponentProps<"pre">) {
  return (
    <PanelFrame
      title={languageOf(children)}
      actions={
        <CopyButton
          text={textOf(children).replace(/\n$/, "")}
          label="Copy code"
        />
      }
    >
      <pre
        {...props}
        className={cn(
          className,
          "overflow-x-auto p-4 font-mono text-sm leading-relaxed",
        )}
      >
        {children}
      </pre>
    </PanelFrame>
  );
}
