import type { TechnologyId } from "./technologies";

export type Skill = { tech: TechnologyId; learning?: boolean };

export type SkillGroup = {
  id: string;
  title: string;
  learning?: boolean;
  skills: readonly Skill[];
};

// TODO(content): review every entry before publishing — only list what you can discuss.
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
    skills: [{ tech: "python" }, { tech: "django" }, { tech: "flask" }],
  },
  {
    id: "databases",
    title: "Databases",
    skills: [{ tech: "postgresql" }],
  },
  {
    id: "collaboration",
    title: "Development & Collaboration",
    skills: [{ tech: "git" }, { tech: "linux" }, { tech: "dev-containers" }],
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
