import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CopyButton } from "./copy-button";

describe("CopyButton", () => {
  it("copies its text and announces the result to screen readers", async () => {
    const user = userEvent.setup();
    render(<CopyButton text="docker compose up -d" label="Copy command" />);

    expect(screen.getByRole("status")).toHaveTextContent("");

    await user.click(screen.getByRole("button", { name: "Copy command" }));

    expect(await navigator.clipboard.readText()).toBe("docker compose up -d");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });
});
