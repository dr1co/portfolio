// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy, UNROUTED_PATH } from "./proxy";

const request = (path: string) =>
  new NextRequest(new URL(path, "http://localhost:3000"));

const rewriteTarget = (path: string) => {
  const rewrite = proxy(request(path)).headers.get("x-middleware-rewrite");
  if (!rewrite) return null;
  const url = new URL(rewrite);
  return url.pathname + url.search;
};

describe("proxy", () => {
  it.each([
    ["/", "/en"],
    ["/projects", "/en/projects"],
    ["/projects/tcc-engsoftware", "/en/projects/tcc-engsoftware"],
    [
      "/projects/django-project-template",
      "/en/projects/django-project-template",
    ],
    ["/lab/pipeline", "/en/lab/pipeline"],
    ["/opengraph-image", "/en/opengraph-image"],
    ["/projects?group=ml", "/en/projects?group=ml"],
  ])("serves %s from the English route %s", (path, target) => {
    expect(rewriteTarget(path)).toBe(target);
  });

  it.each([
    ["/en", "/"],
    ["/en/", "/"],
    ["/en/projects", "/projects"],
    ["/en/lab/pipeline?x=1", "/lab/pipeline?x=1"],
  ])("redirects %s to the unprefixed URL %s", (path, target) => {
    const response = proxy(request(path));

    expect(response.status).toBe(308);
    const location = new URL(response.headers.get("location")!);
    expect(location.pathname + location.search).toBe(target);
  });

  it.each([
    "/en/opengraph-image",
    "/en/icon",
    "/en/projects/x/opengraph-image",
    "/en/opengraph-image/default",
    "/en/projects/x/opengraph-image/default",
  ])("leaves the generated metadata image URL %s alone", (path) => {
    const response = proxy(request(path));

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it.each([
    "/pt-br",
    "/pt-br/projects",
    "/pt-br/projects/tcc-engsoftware",
    "/pt-br/lab/pipeline",
    "/pt-br/opengraph-image",
  ])("serves the Portuguese URL %s as it is", (path) => {
    expect(proxy(request(path)).headers.get("x-middleware-next")).toBe("1");
  });

  it.each(["/projects/does-not-exist", "/pt-br/projects/does-not-exist"])(
    "rewrites %s (no published case study) to a path no route serves",
    (path) => {
      // Not "/404": Vercel serves that static file with a 200 when it's a rewrite target.
      // Not a single segment either: that would match app/[lang] as an unknown locale.
      expect(rewriteTarget(path)).toBe(UNROUTED_PATH);
      expect(UNROUTED_PATH).toMatch(/^\/en\/[^/]+$/);
    },
  );
});
