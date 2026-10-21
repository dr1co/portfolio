import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TableOfContents } from "./table-of-contents";

describe("TableOfContents", () => {
  it("links to each section in order inside an 'On this page' navigation", () => {
    render(
      <TableOfContents
        headings={[
          { id: "overview", text: "Overview" },
          { id: "results", text: "Results" },
        ]}
      />,
    );

    const nav = screen.getByRole("navigation", { name: "On this page" });
    const links = within(nav).getAllByRole("link");
    expect(
      links.map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["Overview", "#overview"],
      ["Results", "#results"],
    ]);
  });

  it("renders nothing when there are no headings", () => {
    const { container } = render(<TableOfContents headings={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
