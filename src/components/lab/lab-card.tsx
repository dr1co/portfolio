import { FlaskConical, Radio } from "lucide-react";
import { AppLink } from "@/components/ui/app-link";
import { Badge } from "@/components/ui/badge";
import type { LabDemo } from "@/content/lab";
import { isHttpsUrl } from "@/lib/links";

const linkClass =
  "inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline";

/** Lab demo summary: what it teaches, whether it's simulated, and where its source lives. */
export function LabCard({ demo }: { demo: LabDemo }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent/50 hover:bg-surface-elevated">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold">
          <AppLink
            href={demo.href}
            className="hover:text-accent hover:underline"
          >
            {demo.title}
          </AppLink>
        </h2>
        {demo.mode === "simulated" ? (
          <Badge icon={FlaskConical} className="shrink-0">
            Simulated
          </Badge>
        ) : (
          <Badge icon={Radio} tone="info" className="shrink-0">
            Live
          </Badge>
        )}
      </div>
      <p className="mt-2 text-muted">{demo.summary}</p>
      <p className="mt-4">
        <span className="font-medium">Objective:</span> {demo.objective}
      </p>
      {demo.prerequisites && (
        <p className="mt-2 text-muted">
          <span className="font-medium text-foreground">Prerequisites:</span>{" "}
          {demo.prerequisites}
        </p>
      )}
      <ul aria-label="Concepts" className="mt-4 flex flex-wrap gap-2">
        {demo.concepts.map((concept) => (
          <li key={concept}>
            <Badge>{concept}</Badge>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-4 pt-6">
        <AppLink href={demo.href} className={linkClass}>
          Open the demo
        </AppLink>
        {isHttpsUrl(demo.sourceUrl) && (
          <AppLink href={demo.sourceUrl} external className={linkClass}>
            Source
          </AppLink>
        )}
      </div>
    </article>
  );
}
