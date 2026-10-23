import { expect, test } from "@playwright/test";
import { getCaseStudySlugs } from "@/content/projects";

// Runs against any deployment: the local build, the container, Vercel previews and production.
// EXPECTED_SHA: the footer must show this commit. EXPECT_INDEXABLE=true: robots must allow indexing.
const expectedSha = process.env.EXPECTED_SHA;
const expectIndexable = process.env.EXPECT_INDEXABLE === "true";

test.describe("smoke", { tag: "@smoke" }, () => {
  test("home page is served as English HTML with one h1", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("projects directory and a case study are served", async ({
    request,
  }) => {
    const [slug] = getCaseStudySlugs();

    expect((await request.get("/projects")).status()).toBe(200);
    expect((await request.get(`/projects/${slug}`)).status()).toBe(200);
  });

  test("unknown case-study slugs answer 404", async ({ request }) => {
    expect((await request.get("/projects/does-not-exist")).status()).toBe(404);
  });

  test("indexing matches the deployment", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      expectIndexable ? /^index/ : /noindex/,
    );
  });

  test("footer shows the expected build version", async ({ page }) => {
    test.skip(!expectedSha, "EXPECTED_SHA not set");
    await page.goto("/");

    await expect(page.getByRole("contentinfo")).toContainText(
      `Version ${expectedSha!.slice(0, 7)}`,
    );
  });
});
