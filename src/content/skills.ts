import { localize, type Localized, type Resolved } from "@/i18n/localize";
import type { Locale } from "@/i18n/locales";
import type { TechnologyId } from "./technologies";

/** `since` is the year you started using it, shown as experience. Leave it out only in the learning group. */
type SkillEntry = { tech: TechnologyId; since?: number; note?: Localized };

type SkillGroupEntry = {
  id: string;
  title: Localized;
  learning?: boolean;
  skills: readonly SkillEntry[];
};

export type Skill = Resolved<SkillEntry>;
export type SkillGroup = Resolved<SkillGroupEntry>;

export const skillGroups: readonly SkillGroupEntry[] = [
  {
    id: "delivery",
    title: { en: "Containers and Delivery", "pt-br": "Containers e Entrega" },
    skills: [
      {
        tech: "docker",
        since: 2022,
        note: {
          en: "Including Docker Compose",
          "pt-br": "Incluindo Docker Compose",
        },
      },
      { tech: "github-actions", since: 2025 },
    ],
  },
  {
    id: "backend",
    title: { en: "Backend and Automation", "pt-br": "Backend e Automação" },
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
    title: { en: "Frontend", "pt-br": "Frontend" },
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
    title: { en: "Databases", "pt-br": "Bancos de dados" },
    skills: [
      { tech: "postgresql", since: 2022 },
      { tech: "mongodb", since: 2022 },
      { tech: "redis", since: 2025 },
    ],
  },
  {
    id: "collaboration",
    title: {
      en: "Development and Collaboration",
      "pt-br": "Desenvolvimento e Colaboração",
    },
    skills: [
      { tech: "git", since: 2022 },
      { tech: "linux", since: 2022 },
      { tech: "dev-containers", since: 2022 },
    ],
  },
  {
    id: "learning",
    title: { en: "Learning Next", "pt-br": "Próximos estudos" },
    learning: true,
    skills: [{ tech: "kubernetes" }, { tech: "terraform" }, { tech: "aws" }],
  },
];

/** Skill groups with their texts in `locale`. */
export function getSkillGroups(locale: Locale): readonly SkillGroup[] {
  return localize(skillGroups, locale);
}
