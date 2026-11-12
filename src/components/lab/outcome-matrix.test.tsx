import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getLabPipeline } from "@/content/lab-pipeline";
import { OutcomeMatrix } from "./outcome-matrix";

const { jobs: ciJobs, scenarios: pipelineScenarios } = getLabPipeline("en");

describe("OutcomeMatrix", () => {
  it("has a column per scenario and a row per job", () => {
    render(
      <OutcomeMatrix locale="en" jobs={ciJobs} scenarios={pipelineScenarios} />,
    );

    expect(
      screen.getAllByRole("columnheader").map((cell) => cell.textContent),
    ).toEqual(["Job", ...pipelineScenarios.map((s) => s.label)]);
    expect(
      screen.getAllByRole("rowheader").map((cell) => cell.textContent),
    ).toEqual(ciJobs.map((job) => job.label));
  });

  it("states every outcome as text, with the reason", () => {
    render(
      <OutcomeMatrix locale="en" jobs={ciJobs} scenarios={pipelineScenarios} />,
    );

    const e2e = screen.getByRole("row", { name: /E2E tests/ });
    const cells = within(e2e).getAllByRole("cell");
    expect(cells.map((cell) => cell.textContent)).toEqual([
      expect.stringContaining("Passed"),
      expect.stringContaining("Passed"),
      expect.stringContaining("Failed"),
      expect.stringContaining("Passed"),
    ]);
    expect(cells[2]).toHaveTextContent("An end-to-end test fails.");
  });
});
