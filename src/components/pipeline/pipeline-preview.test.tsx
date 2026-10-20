import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { pipelineStages } from "@/content/pipeline";
import { PipelinePreview } from "./pipeline-preview";

function setup() {
  const user = userEvent.setup();
  render(<PipelinePreview stages={pipelineStages} />);
  return {
    user,
    tab: (name: string) => screen.getByRole("tab", { name: new RegExp(name) }),
  };
}

describe("PipelinePreview", () => {
  it("lists the five stages as tabs with the first one selected", () => {
    setup();

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(5);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "git push origin main",
    );
  });

  it("keeps a single tab in the Tab order", () => {
    setup();

    expect(
      screen.getAllByRole("tab").filter((tab) => tab.tabIndex === 0),
    ).toHaveLength(1);
  });

  it("selects a stage on click and shows its command", async () => {
    const { user, tab } = setup();

    await user.click(tab("Publish Image"));

    expect(tab("Publish Image")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "docker push ghcr.io/<owner>/app:$GIT_SHA",
    );
  });

  it("moves selection with arrow keys, wrapping at both ends", async () => {
    const { user, tab } = setup();
    tab("Git Push").focus();

    await user.keyboard("{ArrowRight}");
    expect(tab("Build")).toHaveFocus();
    expect(tab("Build")).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(tab("Deploy")).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(tab("Git Push")).toHaveFocus();
  });

  it("jumps to the first and last stage with Home and End", async () => {
    const { user, tab } = setup();
    tab("Git Push").focus();

    await user.keyboard("{End}");
    expect(tab("Deploy")).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Home}");
    expect(tab("Git Push")).toHaveAttribute("aria-selected", "true");
  });

  it("never claims a real deployment happened", async () => {
    const { user, tab } = setup();

    await user.click(tab("Deploy"));

    expect(screen.getByRole("tabpanel")).not.toHaveTextContent(
      /deployed successfully/i,
    );
  });
});
