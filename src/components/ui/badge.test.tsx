import { render, screen } from "@testing-library/react";
import { FlaskConical } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("conveys its state through visible text, keeping the icon decorative", () => {
    const { container } = render(<Badge icon={FlaskConical}>Simulated</Badge>);

    expect(screen.getByText("Simulated")).toBeVisible();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
