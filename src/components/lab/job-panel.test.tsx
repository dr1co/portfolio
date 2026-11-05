import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ciJobs,
  pipelineScenarios,
  type CiJobId,
  type Scenario,
} from "@/content/lab-pipeline";
import { resolveRun } from "@/lib/pipeline-run";
import { JobPanel } from "./job-panel";

const workflowUrl = "https://github.com/someone/repo/blob/main/ci.yml";

function renderPanel(scenarioId: Scenario["id"], jobId: CiJobId) {
  const scenario = pipelineScenarios.find((s) => s.id === scenarioId)!;
  const job = ciJobs.find((candidate) => candidate.id === jobId)!;
  render(
    <JobPanel
      job={job}
      outcome={resolveRun(ciJobs, scenario)[jobId]}
      workflowUrl={workflowUrl}
    />,
  );
}

describe("JobPanel", () => {
  it("states the simulated outcome and why", () => {
    renderPanel("failure-main", "publish");

    const heading = screen.getByRole("heading", { level: 3, name: "Publish" });
    expect(heading.parentElement).toHaveTextContent("Skipped");
    expect(
      screen.getByText(/Simulated outcome:/).parentElement,
    ).toHaveTextContent("Simulated outcome: Needs e2e, which failed.");
  });

  it("explains dependencies and event conditions in words", () => {
    renderPanel("push-main", "publish");

    expect(screen.getByText(/Needs:/).parentElement).toHaveTextContent(
      "Needs: quality, e2e, image",
    );
    expect(screen.getByText(/Runs on:/).parentElement).toHaveTextContent(
      "Runs on: pushes to main",
    );
  });

  it("lists every step with its state", () => {
    renderPanel("failure-main", "e2e");

    const steps = within(screen.getByRole("list", { name: "Steps" }));
    const items = steps.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[2]).toHaveTextContent("End-to-end tests");
    expect(items[2]).toHaveTextContent("Failed");
    expect(items[3]).toHaveTextContent("Upload Playwright report");
    expect(items[3]).toHaveTextContent("Passed");
  });

  it("quotes the job from ci.yml and links to the file", () => {
    renderPanel("push-main", "publish");

    expect(screen.getByText("Workflow excerpt")).toBeInTheDocument();
    expect(
      screen.getByText("needs: [quality, e2e, image]"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ci\.yml on GitHub/ }),
    ).toHaveAttribute("href", workflowUrl);
  });

  it("keeps the outcome hidden until the run reaches the job", () => {
    const scenario = pipelineScenarios.find((s) => s.id === "failure-main")!;
    const job = ciJobs.find((candidate) => candidate.id === "e2e")!;
    render(
      <JobPanel
        job={job}
        outcome={resolveRun(ciJobs, scenario).e2e}
        state="running"
        workflowUrl={workflowUrl}
      />,
    );

    const heading = screen.getByRole("heading", {
      level: 3,
      name: "E2E tests",
    });
    expect(heading.parentElement).toHaveTextContent("Running");
    expect(document.body).not.toHaveTextContent("Failed");
    expect(document.body).not.toHaveTextContent("An end-to-end test fails.");
    const steps = within(screen.getByRole("list", { name: "Steps" }));
    for (const item of steps.getAllByRole("listitem")) {
      expect(item).toHaveTextContent("Pending");
    }
  });

  it("never claims a real deployment happened", () => {
    renderPanel("push-main", "deploy-production");

    expect(document.body).not.toHaveTextContent(
      /deployed successfully|\blive\b/i,
    );
  });
});
