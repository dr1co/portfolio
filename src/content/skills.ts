import type { TechnologyId } from "./technologies";

/** `since` is the year you started using it, shown as experience. Leave it out only in the learning group. */
export type Skill = { tech: TechnologyId; since?: number; note?: string };

export type SkillGroup = {
  id: string;
  title: string;
  learning?: boolean;
  skills: readonly Skill[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    id: "delivery",
    title: "Containers & Delivery",
    skills: [
      { tech: "docker", since: 2022, note: "Including Docker Compose" },
      { tech: "github-actions", since: 2025 },
    ],
  },
  {
    id: "backend",
    title: "Backend & Automation",
    skills: [
      { tech: "python", since: 2023 },
      { tech: "django", since: 2025 },
      { tech: "flask", since: 2025 },
      { tech: "nodejs", since: 2022 },
      { tech: "express", since: 2022 },
      { tech: "bash", since: 2022 },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      { tech: "react", since: 2022 },
      { tech: "nextjs", since: 2025 },
      { tech: "typescript", since: 2022 },
      { tech: "tailwind", since: 2024 },
      { tech: "html", since: 2022 },
      { tech: "css", since: 2022 },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    skills: [
      { tech: "postgresql", since: 2022 },
      { tech: "mongodb", since: 2022 },
      { tech: "redis", since: 2025 },
    ],
  },
  {
    id: "collaboration",
    title: "Development & Collaboration",
    skills: [
      { tech: "git", since: 2022 },
      { tech: "linux", since: 2022 },
      { tech: "dev-containers", since: 2022 },
    ],
  },
  {
    id: "learning",
    title: "Learning Next",
    learning: true,
    skills: [{ tech: "kubernetes" }, { tech: "terraform" }, { tech: "aws" }],
  },
];
