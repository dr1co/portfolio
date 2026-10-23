import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

async function revealAllSections(page: Page) {
  const reveals = page.locator("[data-reveal]");
  for (const reveal of await reveals.all()) {
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveCSS("opacity", "1");
  }
}

test("leads with a single headline", async ({ page }) => {
  const headings = page.getByRole("heading", { level: 1 });

  await expect(headings).toHaveCount(1);
  await expect(headings).toHaveText("From code to production.");
});

test("shows the pipeline and skills sections", async ({ page }) => {
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "How code reaches production",
    }),
  ).toBeAttached();
  await expect(
    page.getByRole("heading", { level: 2, name: "Skills by domain" }),
  ).toBeAttached();
});

test("primary action leads to the featured projects", async ({ page }) => {
  await page.getByRole("link", { name: "Explore Projects" }).click();

  await expect(page).toHaveURL(/#projects$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Featured projects" }),
  ).toBeInViewport();
});

test("secondary action leads to the contact section", async ({ page }) => {
  await page.getByRole("link", { name: "Get in touch" }).click();

  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Get in touch" }),
  ).toBeInViewport();
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`has no detectable accessibility violations in the ${colorScheme} theme`, async ({
    page,
  }) => {
    // Reload, scroll through every section and a full axe pass: ~11 s alone, past 30 s under parallel load.
    test.slow();
    await page.emulateMedia({ colorScheme });
    await page.reload();
    await revealAllSections(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

test("links from featured projects to the full directory", async ({ page }) => {
  await page.getByRole("link", { name: "View all projects" }).click();

  await expect(page).toHaveURL(/\/projects$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Projects" }),
  ).toBeVisible();
});

test("opens a featured project's case study from its card title", async ({
  page,
}) => {
  const featured = page.locator("#projects");
  await featured
    .getByRole("heading", { level: 3 })
    .getByRole("link", { name: /Financial market analysis/ })
    .click();

  await expect(page).toHaveURL(/\/projects\/tcc-engsoftware$/);
});
