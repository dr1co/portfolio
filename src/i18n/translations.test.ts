import { describe, expect, it } from "vitest";
import * as lab from "@/content/lab";
import * as labPipeline from "@/content/lab-pipeline";
import * as pipeline from "@/content/pipeline";
import * as projects from "@/content/projects";
import * as skills from "@/content/skills";
import { siteConfig } from "@/lib/site-config";
import { en } from "./messages/en";
import { ptBr } from "./messages/pt-br";

/** Texts that read the same in both languages: names, and terms Brazilian developers use in English. */
const SAME_IN_BOTH = new Set([
  "GitHub",
  "LinkedIn",
  "Lab",
  "// lab",
  "// pipeline",
  "Job",
  "Frontend",
  "Machine Learning",
  "Git Push",
  "Build",
  "Deploy",
  "Quality gates",
  "Pull request",
  "pull request",
  "pull requests",
]);

function untranslatedMessages(a: unknown, b: unknown, path = ""): string[] {
  if (typeof a === "string")
    return a === b && !SAME_IN_BOTH.has(a) ? [path] : [];
  if (a === null || typeof a !== "object") return [];
  return Object.entries(a).flatMap(([key, value]) =>
    untranslatedMessages(
      value,
      (b as Record<string, unknown>)[key],
      `${path}.${key}`,
    ),
  );
}

function untranslatedContent(value: unknown): string[] {
  if (value === null || typeof value !== "object") return [];
  if ("en" in value && "pt-br" in value) {
    const { en, "pt-br": pt } = value as Record<string, string>;
    return en === pt && !SAME_IN_BOTH.has(en) ? [en] : [];
  }
  return Object.values(value).flatMap(untranslatedContent);
}

describe("Brazilian Portuguese translations", () => {
  it("translate every interface string", () => {
    expect(untranslatedMessages(en, ptBr)).toEqual([]);
  });

  it("translate every content text", () => {
    const content = [siteConfig, lab, labPipeline, pipeline, projects, skills];
    expect(content.flatMap(untranslatedContent)).toEqual([]);
  });
});
