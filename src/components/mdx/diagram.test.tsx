import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Diagram } from "./diagram";

const props = {
  title: "Training pipeline",
  width: 600,
  height: 120,
  nodes: [
    { id: "data", label: "Raw candles", x: 100, y: 60 },
    { id: "windows", label: "Sliding windows", x: 300, y: 60 },
    { id: "model", label: "CNN + LSTM", x: 500, y: 60 },
  ],
  edges: [
    { from: "data", to: "windows", label: "clean + scale" },
    { from: "windows", to: "model" },
  ],
};

describe("Diagram", () => {
  it("is an image named by its title", () => {
    render(<Diagram {...props} />);

    expect(
      screen.getByRole("img", { name: "Training pipeline" }),
    ).toBeInTheDocument();
  });

  it("describes every relationship in text for assistive technology", () => {
    render(<Diagram {...props} />);

    const description = screen.getByRole("list", {
      name: "Training pipeline, described",
    });
    expect(
      within(description)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual([
      "Raw candles → Sliding windows: clean + scale",
      "Sliding windows → CNN + LSTM",
    ]);
  });
});
