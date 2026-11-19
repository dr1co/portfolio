import { expect, test } from "@playwright/test";
import { labDemos } from "@/content/lab";
import { getCaseStudySlugs } from "@/content/projects";
import { localizePath } from "@/i18n/locales";

// Runs against any deployment: the local build, the container, Vercel previews and production.
// EXPECTED_SHA: the footer must show this commit. EXPECT_INDEXABLE=true: robots must allow indexing.
const expectedSha = process.env.EXPECTED_SHA;
const expectIndexable = process.env.EXPECT_INDEXABLE === "true";

/** Every page, by its English (unprefixed) path. */
const pagePaths = () => [
  "/",
  "/projects",
  `/projects/${getCaseStudySlugs()[0]}`,
  "/lab",
  ...labDemos.map((demo) => demo.href),
];

test.describe("smoke", { tag: "@smoke" }, () => {
  test("home page is served as English HTML with one h1", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("Portuguese home page is served as pt-BR HTML with one h1", async ({
    page,
  }) => {
    const response = await page.goto("/pt-br");

    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("projects directory and a case study are served", async ({
    request,
  }) => {
    const [slug] = getCaseStudySlugs();

    expect((await request.get("/projects")).status()).toBe(200);
    expect((await request.get(`/projects/${slug}`)).status()).toBe(200);
  });

  test("the Lab and its demos are served and labelled as simulated", async ({
    page,
  }) => {
    for (const path of ["/lab", ...labDemos.map((demo) => demo.href)]) {
      const response = await page.goto(path);

      expect(response?.status(), path).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByText("Simulated").first()).toBeVisible();
    }
  });

  test("unknown case-study slugs answer 404", async ({ request }) => {
    expect((await request.get("/projects/does-not-exist")).status()).toBe(404);
    expect((await request.get("/pt-br/projects/does-not-exist")).status()).toBe(
      404,
    );
  });

  test("indexing matches the deployment", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      expectIndexable ? /^index/ : /noindex/,
    );
  });

  test("canonical URLs, when set, point at the page itself", async ({
    page,
  }) => {
    const paths = pagePaths().flatMap((path) => [
      path,
      localizePath(path, "pt-br"),
    ]);
    for (const path of paths) {
      await page.goto(path);
      const canonical = page.locator('link[rel="canonical"]');
      if ((await canonical.count()) === 0) continue;

      const href = await canonical.getAttribute("href");
      expect(new URL(href!).pathname, `canonical of ${path}`).toBe(path);
    }
  });

  test("hreflang alternates, when set, link each page to both languages", async ({
    page,
  }) => {
    for (const path of pagePaths()) {
      await page.goto(localizePath(path, "pt-br"));
      const alternate = (lang: string) =>
        page.locator(`link[rel="alternate"][hreflang="${lang}"]`);
      if ((await alternate("en").count()) === 0) continue;

      const pathOf = async (lang: string) =>
        new URL((await alternate(lang).getAttribute("href"))!).pathname;
      expect(await pathOf("en"), `en of ${path}`).toBe(path);
      expect(await pathOf("pt-BR"), `pt-BR of ${path}`).toBe(
        localizePath(path, "pt-br"),
      );
      expect(await pathOf("x-default"), `x-default of ${path}`).toBe(path);
    }
  });

  test("sitemap.xml lists every page in both languages", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");

    const xml = await response.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      ([, url]) => new URL(url).pathname,
    );
    for (const path of pagePaths()) {
      expect(locs).toContain(path);
      expect(locs).toContain(localizePath(path, "pt-br"));
    }
  });

  test("footer shows the expected build version", async ({ page }) => {
    test.skip(!expectedSha, "EXPECTED_SHA not set");
    await page.goto("/");

    await expect(page.getByRole("contentinfo")).toContainText(
      `Version ${expectedSha!.slice(0, 7)}`,
    );
  });
});
