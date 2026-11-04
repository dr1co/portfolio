import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  ciJobs,
  pipelineScenarios,
  pipelineTrigger,
} from "@/content/lab-pipeline";
import { stubMatchMedia } from "@/test/match-media";
import { PipelineExplorer } from "./pipeline-explorer";

function setup({ wide = true } = {}) {
  stubMatchMedia(wide);
  const user = userEvent.setup();
  render(
    <PipelineExplorer
      trigger={pipelineTrigger}
      jobs={ciJobs}
      scenarios={pipelineScenarios}
      workflowUrl="https://github.com/someone/repo/blob/main/ci.yml"
    />,
  );
  return {
    user,
    tab: (name: string) => screen.getByRole("tab", { name: new RegExp(name) }),
    header: (name: string) =>
      screen.getByRole("button", { name: new RegExp(`^${name}`) }),
  };
}

describe("PipelineExplorer on narrow screens", () => {
  it("is an accordion: no tabs, the trigger starts expanded", () => {
    const { header } = setup({ wide: false });

    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(header("Trigger")).toHaveAttribute("aria-expanded", "true");
    expect(header("Quality")).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a job's details directly below it", async () => {
    const { user, header } = setup({ wide: false });

    await user.click(header("Publish"));

    const panel = screen.getByRole("region", { name: /Publish/ });
    expect(panel).toHaveTextContent("needs: [quality, e2e, image]");
    expect(header("Publish").compareDocumentPosition(panel)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(panel.compareDocumentPosition(header("Preview deploy"))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(header("Trigger")).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the open job when its header is pressed again", async () => {
    const { user, header } = setup({ wide: false });

    await user.click(header("Trigger"));

    expect(header("Trigger")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("reopens the trigger when the scenario changes", async () => {
    const { user, header } = setup({ wide: false });
    await user.click(header("Image"));

    await user.click(screen.getByRole("radio", { name: "Vulnerable image" }));

    expect(header("Trigger")).toHaveAttribute("aria-expanded", "true");
    expect(header("Image")).toHaveTextContent("Failed");
  });
});

describe("PipelineExplorer on wide screens", () => {
  it("lists the trigger, then every job in run order, with the trigger selected", () => {
    setup();

    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      expect.stringContaining("Trigger"),
      expect.stringContaining("Quality"),
      expect.stringContaining("E2E tests"),
      expect.stringContaining("Image"),
      expect.stringContaining("Publish"),
      expect.stringContaining("Preview deploy"),
      expect.stringContaining("Production deploy"),
    ]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      pipelineTrigger.purpose,
    );
  });

  it("keeps a single tab in the Tab order", () => {
    setup();

    expect(
      screen.getAllByRole("tab").filter((tab) => tab.tabIndex === 0),
    ).toHaveLength(1);
  });

  it("starts on push to main, with every outcome shown", () => {
    const { tab } = setup();

    expect(screen.getByRole("radio", { name: "Push to main" })).toBeChecked();
    expect(tab("Production deploy")).toHaveTextContent("Passed");
    expect(tab("Preview deploy")).toHaveTextContent("Skipped");
  });

  it("switching scenario updates the outcomes and returns to the trigger", async () => {
    const { user, tab } = setup();
    await user.click(tab("Publish"));

    await user.click(screen.getByRole("radio", { name: "Failure on main" }));

    expect(tab("E2E tests")).toHaveTextContent("Failed");
    expect(tab("Publish")).toHaveTextContent("Skipped");
    expect(tab("Trigger")).toHaveAttribute("aria-selected", "true");
  });

  it("selects a job on click and explains it", async () => {
    const { user, tab } = setup();

    await user.click(tab("Publish"));

    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "needs: [quality, e2e, image]",
    );
  });

  it("steps forward and back, with buttons disabled at the ends", async () => {
    const { user, tab } = setup();
    const previous = screen.getByRole("button", { name: "Previous job" });
    const next = screen.getByRole("button", { name: "Next job" });
    expect(previous).toBeDisabled();

    await user.click(next);
    expect(tab("Quality")).toHaveAttribute("aria-selected", "true");

    await user.click(previous);
    expect(tab("Trigger")).toHaveAttribute("aria-selected", "true");

    await user.click(tab("Production deploy"));
    expect(next).toBeDisabled();
  });
});
