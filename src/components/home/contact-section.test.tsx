import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getContactLinks } from "@/lib/links";
import { ContactSection } from "./contact-section";

describe("ContactSection", () => {
  it("renders nothing when no contact link is configured", () => {
    const { container } = render(<ContactSection links={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("shows one labelled row per configured link with its readable address", () => {
    const links = getContactLinks({
      github: "https://github.com/someone",
      linkedin: "",
      email: "me@example.com",
    });
    render(<ContactSection links={links} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Get in touch" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /GitHub\s*github\.com\/someone/ }),
    ).toHaveAttribute("href", "https://github.com/someone");
    expect(
      screen.getByRole("link", { name: /Email\s*me@example\.com/ }),
    ).toHaveAttribute("href", "mailto:me@example.com");
    expect(screen.queryByText("LinkedIn")).not.toBeInTheDocument();
  });
});
