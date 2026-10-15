export type Skill = { name: string; learning?: boolean };

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
      { name: "Docker" },
      { name: "Docker Compose" },
      { name: "GitHub Actions" },
    ],
  },
  {
    id: "backend",
    title: "Backend & Automation",
    skills: [{ name: "Python" }, { name: "Django" }, { name: "Flask" }],
  },
  {
    id: "databases",
    title: "Databases",
    skills: [{ name: "PostgreSQL" }],
  },
  {
    id: "collaboration",
    title: "Development & Collaboration",
    skills: [{ name: "Git" }, { name: "Linux" }, { name: "Dev Containers" }],
  },
  {
    id: "learning",
    title: "Learning Next",
    learning: true,
    skills: [
      { name: "Kubernetes", learning: true },
      { name: "Terraform", learning: true },
      { name: "AWS", learning: true },
    ],
  },
];
