import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BuildVersion } from "./build-version";

describe("BuildVersion", () => {
  it("links the short commit SHA to the commit when a URL is available", () => {
    render(
      <BuildVersion
        info={{
          short: "4552b64",
          url: "https://github.com/x/y/commit/4552b64",
        }}
      />,
    );

    expect(
      screen.getByRole("link", {
        name: /^Version 4552b64\s*\(opens in a new tab\)$/,
      }),
    ).toHaveAttribute("href", "https://github.com/x/y/commit/4552b64");
  });

  it("shows the version as plain text without a URL", () => {
    render(<BuildVersion info={{ short: "4552b64" }} />);

    expect(screen.getByText("Version 4552b64")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
