import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("leads with a single headline", async ({ page }) => {
  const headings = page.getByRole("heading", { level: 1 });

  await expect(headings).toHaveCount(1);
  await expect(headings).toHaveText("From code to production.");
});

test("primary action falls back to the pipeline while projects and GitHub are unset", async ({
  page,
}) => {
  // Flip this expectation when featured projects or a GitHub URL are configured.
  await expect(
    page.getByRole("link", { name: "See the pipeline" }),
  ).toBeVisible();
});

test("hides the featured projects section while no project is featured", async ({
  page,
}) => {
  // Flip this expectation when content/projects.ts gets a featured entry.
  await expect(page.locator("#projects")).toHaveCount(0);
});
