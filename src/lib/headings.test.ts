import { describe, expect, it } from "vitest";
import { getHeadings } from "./headings";

describe("getHeadings", () => {
  it("lists level-2 headings in order with rehype-slug compatible ids", () => {
    const source = [
      "## Overview",
      "Intro text.",
      "### Detail (not listed)",
      "## Problem & goals",
      "## Overview",
    ].join("\n");

    expect(getHeadings(source)).toEqual([
      { id: "overview", text: "Overview" },
      { id: "problem--goals", text: "Problem & goals" },
      { id: "overview-1", text: "Overview" },
    ]);
  });

  it("ignores lines that only look like headings inside code fences", () => {
    const source = [
      "## Setup",
      "```bash",
      "## not a heading",
      "```",
      "## Results",
    ].join("\n");

    expect(getHeadings(source).map((h) => h.text)).toEqual([
      "Setup",
      "Results",
    ]);
  });

  it("drops inline markdown from heading text", () => {
    expect(getHeadings("## Using `docker compose`")).toEqual([
      { id: "using-docker-compose", text: "Using docker compose" },
    ]);
  });
});
