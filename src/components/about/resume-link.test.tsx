import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResumeLink } from "./resume-link";

describe("ResumeLink", () => {
  it("links to the résumé PDF in a new tab", () => {
    render(<ResumeLink locale="en" href="/resume/cv-en.pdf" />);

    expect(
      screen.getByRole("link", { name: /^Download my résumé \(PDF\)/ }),
    ).toHaveAttribute("href", "/resume/cv-en.pdf");
  });

  it("renders nothing while no résumé is set", () => {
    const { container } = render(<ResumeLink locale="en" href="" />);

    expect(container).toBeEmptyDOMElement();
  });
});
