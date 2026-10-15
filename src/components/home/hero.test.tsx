import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteConfig, type SiteConfig } from "@/lib/site-config";
import { Hero } from "./hero";

const withLinks = (links: Partial<SiteConfig["links"]>): SiteConfig => ({
  ...siteConfig,
  links: { github: "", linkedin: "", email: "", ...links },
});

describe("Hero", () => {
  it("leads with the headline as the page's only h1 and lists the core technologies", () => {
    render(<Hero config={withLinks({})} featuredCount={0} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "From code to production.",
    );
    expect(screen.getByText(/Adriano Matoba Lipski/)).toBeInTheDocument();
    const tags = within(
      screen.getByRole("list", { name: "Core technologies" }),
    );
    expect(
      tags.getAllByRole("listitem").map((item) => item.textContent),
    ).toEqual(["Docker", "CI/CD", "Python", "Linux"]);
  });

  it("labels the terminal panel as an example rather than live output", () => {
    render(<Hero config={withLinks({})} featuredCount={0} />);

    expect(screen.getByText("Example")).toBeInTheDocument();
  });

  it("points at the pipeline and offers no contact action when nothing else exists", () => {
    render(<Hero config={withLinks({})} featuredCount={0} />);

    expect(
      screen.getByRole("link", { name: "See the pipeline" }),
    ).toHaveAttribute("href", "#pipeline");
    expect(
      screen.queryByRole("link", { name: /Get in touch/ }),
    ).not.toBeInTheDocument();
  });

  it("uses GitHub and contact actions once those links are configured", () => {
    render(
      <Hero
        config={withLinks({
          github: "https://github.com/someone",
          email: "me@example.com",
        })}
        featuredCount={0}
      />,
    );

    expect(screen.getByRole("link", { name: /^Open GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/someone",
    );
    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "#contact",
    );
  });
});
