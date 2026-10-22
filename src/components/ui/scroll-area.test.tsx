import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollArea } from "./scroll-area";

describe("ScrollArea", () => {
  it("is a labelled region that keyboard users can focus to scroll", () => {
    render(
      <ScrollArea label="Results table">
        <table />
      </ScrollArea>,
    );

    const region = screen.getByRole("region", { name: "Results table" });
    expect(region).toHaveAttribute("tabindex", "0");
  });
});
