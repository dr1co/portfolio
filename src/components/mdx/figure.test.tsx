import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Figure } from "./figure";

describe("Figure", () => {
  it("renders the image with its alt text and a visible caption", () => {
    render(
      <Figure
        src="/case-studies/demo/pipeline.png"
        alt="Training loss falling over 40 epochs"
        caption="Training and validation loss."
        width={1200}
        height={600}
      />,
    );

    expect(
      screen.getByRole("img", { name: "Training loss falling over 40 epochs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("figure", { name: "Training and validation loss." }),
    ).toBeInTheDocument();
  });
});
