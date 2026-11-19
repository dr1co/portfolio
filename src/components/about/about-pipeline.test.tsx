import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutPipeline } from "./about-pipeline";

function jobs() {
  render(<AboutPipeline locale="en" age={30} />);
  return within(
    screen.getByRole("list", { name: "whoami workflow" }),
  ).getAllByRole("listitem");
}

describe("AboutPipeline", () => {
  it("links each job, in order, to its section on the about page", () => {
    const links = jobs().map((job) => within(job).getByRole("link"));

    expect(links.map((link) => link.textContent)).toEqual([
      "whoami",
      "experience",
      "education",
      "learning",
    ]);
    expect(links[1]).toHaveAttribute("href", "/about#experience");
  });

  it("shows each job's state as text", () => {
    expect(
      jobs().map(
        (job) =>
          within(job).getByText(/^(Passed|Running|Pending)$/).textContent,
      ),
    ).toEqual(["Passed", "Running", "Running", "Pending"]);
  });

  it("never spins a running job's icon", () => {
    jobs();

    expect(document.querySelector("[class*='animate-spin']")).toBeNull();
  });

  it("introduces whoami with the nickname, age and location", () => {
    const [whoami] = jobs();

    expect(whoami).toHaveTextContent(
      "Drico, 30 years old, Ponta Grossa, Brazil",
    );
  });
});
