import type { Metadata } from "next";
import { LabCard } from "@/components/lab/lab-card";
import { Container } from "@/components/ui/container";
import { labDemos, labIntro } from "@/content/lab";
import { canonicalFor } from "@/lib/canonical";

export const metadata: Metadata = {
  title: "Lab",
  description: labIntro,
  alternates: canonicalFor("/lab"),
};

export default function LabPage() {
  return (
    <Container className="py-16 md:py-20">
      <p className="font-mono text-sm text-accent">{"// lab"}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        Lab
      </h1>
      <p className="mt-4 max-w-prose text-lg text-muted">{labIntro}</p>
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {labDemos.map((demo) => (
          <li key={demo.slug}>
            <LabCard demo={demo} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
