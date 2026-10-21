import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Callout } from "./callout";

describe("Callout", () => {
  it.each([
    ["note", "Note"],
    ["warning", "Warning"],
    ["simulated", "Simulated"],
  ] as const)("states its %s kind in text, not only color", (kind, label) => {
    render(<Callout kind={kind}>Body text.</Callout>);

    const callout = screen.getByRole("note");
    expect(callout).toHaveTextContent(label);
    expect(callout).toHaveTextContent("Body text.");
  });
});
