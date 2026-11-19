import {
  siCss,
  siDevelopmentcontainers,
  siDjango,
  siDocker,
  siExpress,
  siFlask,
  siGit,
  siGithubactions,
  siGnubash,
  siHtml5,
  siKubernetes,
  siLinux,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siTailwindcss,
  siTerraform,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import type { TechnologyId } from "@/content/technologies";
import { contrastRatio } from "./contrast";

/** `--surface-elevated` per theme (checked against globals.css by tokens.test.ts). */
export const TILE_SURFACES = { light: "#f5f7f8", dark: "#202834" } as const;

/** WCAG 1.4.11 minimum for meaningful graphics. */
const MIN_CONTRAST = 3;

const ICONS: Partial<Record<TechnologyId, SimpleIcon>> = {
  bash: siGnubash,
  css: siCss,
  "dev-containers": siDevelopmentcontainers,
  django: siDjango,
  docker: siDocker,
  express: siExpress,
  flask: siFlask,
  git: siGit,
  "github-actions": siGithubactions,
  html: siHtml5,
  kubernetes: siKubernetes,
  linux: siLinux,
  mongodb: siMongodb,
  nextjs: siNextdotjs,
  nodejs: siNodedotjs,
  postgresql: siPostgresql,
  python: siPython,
  react: siReact,
  redis: siRedis,
  tailwind: siTailwindcss,
  terraform: siTerraform,
  typescript: siTypescript,
};

export type TechIcon = {
  path: string;
  /** Brand colour per theme, or `undefined` where it is too faint on a tile. */
  light?: string;
  dark?: string;
};

function readable(hex: string, surface: string): string | undefined {
  return contrastRatio(hex, surface) >= MIN_CONTRAST ? hex : undefined;
}

/** Simple Icons logo for a technology, with brand colours that stay visible in each theme. */
export function techIcon(id: TechnologyId): TechIcon | undefined {
  const icon = ICONS[id];
  if (!icon) return undefined;
  const hex = `#${icon.hex}`;
  return {
    path: icon.path,
    light: readable(hex, TILE_SURFACES.light),
    dark: readable(hex, TILE_SURFACES.dark),
  };
}
