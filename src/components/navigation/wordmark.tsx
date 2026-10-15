import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/** Text wordmark with a terminal cursor; links home. */
export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.wordmark} — home`}
      className="font-mono text-base font-semibold"
    >
      {siteConfig.wordmark}
      <span aria-hidden className="cursor-blink text-accent">
        _
      </span>
    </Link>
  );
}
