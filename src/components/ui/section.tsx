import type { ReactNode } from "react";
import { Container } from "./container";
import { Reveal } from "./reveal";

/** Home page section: anchor id, mono eyebrow, `h2` title and an entrance animation. */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="py-12 md:py-20">
      <Container>
        <Reveal>
          <p className="font-mono text-sm text-accent">{eyebrow}</p>
          <h2
            id={headingId}
            className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
          >
            {title}
          </h2>
          {description && (
            <div className="mt-3 max-w-prose text-muted">{description}</div>
          )}
          <div className="mt-8">{children}</div>
        </Reveal>
      </Container>
    </section>
  );
}
