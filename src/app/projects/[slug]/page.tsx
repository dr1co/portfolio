import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CaseStudyHeader } from "@/components/projects/case-study-header";
import { TableOfContents } from "@/components/projects/table-of-contents";
import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { getCaseStudySlugs, getProject } from "@/content/projects";
import { getHeadings } from "@/lib/headings";

const caseStudyDir = join(process.cwd(), "src/content/case-studies");

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description || project.summary,
    alternates: process.env.NEXT_PUBLIC_SITE_URL
      ? { canonical: `/projects/${project.slug}` }
      : undefined,
  };
}

/** Static shell (back link) renders instantly; the slug-dependent case study streams inside Suspense. */
export default function CaseStudyPage({
  params,
}: PageProps<"/projects/[slug]">) {
  return (
    <Container className="py-12 md:py-16">
      <AppLink
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All projects
      </AppLink>
      <Suspense
        fallback={<p className="mt-8 text-muted">Loading case study…</p>}
      >
        <CaseStudy params={params} />
      </Suspense>
    </Container>
  );
}

async function CaseStudy({
  params,
}: Pick<PageProps<"/projects/[slug]">, "params">) {
  const project = getProject((await params).slug);
  if (!project?.caseStudy) notFound();

  const { default: Body } = await import(
    `@/content/case-studies/${project.caseStudy}.mdx`
  );
  const headings = getHeadings(
    readFileSync(join(caseStudyDir, `${project.caseStudy}.mdx`), "utf8"),
  );

  return (
    <>
      <div className="mt-8">
        <CaseStudyHeader project={project} />
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
        {headings.length > 0 && (
          <details className="rounded-lg border border-border bg-surface p-4 lg:hidden">
            <summary className="cursor-pointer font-mono text-sm text-muted">
              On this page
            </summary>
            <div className="mt-3">
              <TableOfContents headings={headings} />
            </div>
          </details>
        )}
        <article className="max-w-[70ch] min-w-0 [&>*:first-child]:mt-0">
          <Body />
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </>
  );
}
