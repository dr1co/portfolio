import type { ReactNode } from "react";

/** A section of the about page: anchor id (shown as a mono eyebrow, matching the job strip), `h2` title and content. */
export function AboutTopic({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId}>
      <p aria-hidden className="font-mono text-sm text-accent">
        {`// ${id}`}
      </p>
      <h2
        id={headingId}
        className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
      >
        {title}
      </h2>
      <div className="mt-6 flex flex-col gap-4">{children}</div>
    </section>
  );
}
