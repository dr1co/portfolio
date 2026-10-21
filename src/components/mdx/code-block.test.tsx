import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CodeBlock } from "./code-block";

function renderShikiLikeBlock() {
  return render(
    <CodeBlock className="shiki" tabIndex={0}>
      <code className="language-yaml">
        <span className="line">
          <span>on</span>
          <span>:</span>
        </span>
        {"\n"}
        <span className="line">
          <span>{"  push:"}</span>
        </span>
      </code>
    </CodeBlock>,
  );
}

describe("CodeBlock", () => {
  it("labels the block with its language", () => {
    renderShikiLikeBlock();

    expect(screen.getByText("yaml")).toBeInTheDocument();
  });

  it("copies the plain code text", async () => {
    const user = userEvent.setup();
    renderShikiLikeBlock();

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    expect(await navigator.clipboard.readText()).toBe("on:\n  push:");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });
});
