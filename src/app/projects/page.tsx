import type { Metadata } from "next";
import { ProjectDirectory } from "@/components/projects/project-directory";
import { Container } from "@/components/ui/container";
import { directoryIntro, getProjectDirectory } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: directoryIntro,
};

export default function ProjectsPage() {
  return (
    <>
      <Container className="py-16 md:py-20">
        <p className="font-mono text-sm text-accent">{"// projects"}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Projects
        </h1>
        <p className="mt-4 max-w-prose text-lg text-muted">{directoryIntro}</p>
      </Container>
      <ProjectDirectory directory={getProjectDirectory()} />
    </>
  );
}
