"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Copies `text` to the clipboard and announces "Copied" through a polite live region for 2 seconds. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span role="status" className="font-mono text-xs text-accent">
        {copied ? "Copied" : ""}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-surface-elevated hover:text-foreground",
          copied ? "text-accent" : "text-muted",
        )}
      >
        {copied ? (
          <Check aria-hidden className="size-4" />
        ) : (
          <Copy aria-hidden className="size-4" />
        )}
      </button>
    </span>
  );
}
