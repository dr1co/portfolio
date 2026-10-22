import { AppLink } from "@/components/ui/app-link";
import type { Heading } from "@/lib/headings";

/** In-page navigation to a case study's h2 sections; renders nothing without headings. */
export function TableOfContents({
  headings,
}: {
  headings: readonly Heading[];
}) {
  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page">
      <p className="font-mono text-xs tracking-wide text-muted uppercase">
        On this page
      </p>
      <ol className="mt-3 flex flex-col gap-2 border-l border-border text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <AppLink
              href={`#${heading.id}`}
              className="-ml-px block border-l border-transparent pl-3 text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              {heading.text}
            </AppLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}
