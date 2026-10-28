import type { TechnologyId } from "./technologies";

export type Skill = { tech: TechnologyId; learning?: boolean };

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
      { tech: "docker" },
      { tech: "docker-compose" },
      { tech: "github-actions" },
    ],
  },
  {
    id: "backend",
    title: "Backend & Automation",
    skills: [
      { tech: "python" },
      { tech: "django" },
      { tech: "flask" },
      { tech: "nodejs" },
      { tech: "express" },
      { tech: "bash" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    skills: [
      { tech: "postgresql" },
      { tech: "mongodb" },
      { tech: "redis" },
    ],
  },
  {
    id: "collaboration",
    title: "Development & Collaboration",
    skills: [
      { tech: "git" },
      { tech: "linux" },
      { tech: "dev-containers" }
    ],
  },
  {
    id: "learning",
    title: "Learning Next",
    learning: true,
    skills: [
      { tech: "kubernetes", learning: true },
      { tech: "terraform", learning: true },
      { tech: "aws", learning: true },
    ],
  },
];
