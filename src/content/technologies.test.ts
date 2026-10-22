import { describe, expect, it } from "vitest";
import { projects } from "./projects";
import { skillGroups } from "./skills";
import { techName, technologies } from "./technologies";

describe("technologies", () => {
  it("maps ids to their canonical display names", () => {
    expect(techName("pytorch")).toBe("PyTorch");
    expect(techName("github-actions")).toBe("GitHub Actions");
  });

  it("never gives two ids the same display name", () => {
    const names = Object.values(technologies);

    expect(new Set(names).size).toBe(names.length);
  });

  it("resolves every technology referenced by projects and skills", () => {
    const ids = [
      ...projects.flatMap((project) => project.technologies),
      ...skillGroups.flatMap((group) =>
        group.skills.map((skill) => skill.tech),
      ),
    ];

    expect(ids.filter((id) => !(id in technologies))).toEqual([]);
  });
});
