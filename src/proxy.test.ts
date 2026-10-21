// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

const request = (path: string) =>
  new NextRequest(new URL(path, "http://localhost:3000"));

describe("proxy", () => {
  it("lets published case studies through", () => {
    const response = proxy(request("/projects/tcc-engsoftware"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it.each(["/projects/does-not-exist", "/projects/django-project-template"])(
    "rewrites %s (no published case study) to the not-found page",
    (path) => {
      const response = proxy(request(path));

      expect(
        new URL(response.headers.get("x-middleware-rewrite")!).pathname,
      ).toBe("/404");
    },
  );
});
