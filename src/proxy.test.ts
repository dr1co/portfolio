// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy, UNROUTED_PATH } from "./proxy";

const request = (path: string) =>
  new NextRequest(new URL(path, "http://localhost:3000"));

describe("proxy", () => {
  it("lets published case studies through", () => {
    const response = proxy(request("/projects/tcc-engsoftware"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it.each(["/projects/does-not-exist", "/projects/django-project-template"])(
    "rewrites %s (no published case study) to a path no route serves",
    (path) => {
      const response = proxy(request(path));
      const target = new URL(response.headers.get("x-middleware-rewrite")!)
        .pathname;

      // Not "/404": Vercel serves that static file with a 200 when it's a rewrite target.
      expect(target).not.toBe("/404");
      expect(target).toBe(UNROUTED_PATH);
    },
  );
});
