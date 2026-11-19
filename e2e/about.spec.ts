import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function revealAllSections(page: Page) {
  const reveals = page.locator("[data-reveal]");
  for (const reveal of await reveals.all()) {
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveCSS("opacity", "1");
  }
}

test.describe("about page", () => {
  test("opens with the whoami workflow, then a section per job and topic", async ({
    page,
  }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", { level: 1, name: "About" }),
    ).toBeVisible();
    await expect(
      page.getByRole("list", { name: "whoami workflow" }).getByRole("listitem"),
    ).toHaveCount(4);
    await expect(page.getByRole("heading", { level: 2 })).toHaveText([
      "Who I am",
      "Experience",
      "Education",
      "Currently learning",
      "How I work",
      "Achievements",
      "Beyond the code",
      "Get in touch",
    ]);
  });

  test("jumps from a job to its section", async ({ page }) => {
    await page.goto("/about");

    await page
      .getByRole("list", { name: "whoami workflow" })
      .getByRole("link", { name: "learning" })
      .click();

    await expect(page).toHaveURL(/\/about#learning$/);
    await expect(
      page.getByRole("heading", { level: 2, name: "Currently learning" }),
    ).toBeInViewport();
  });

  test("links the thesis to its case study", async ({ page }) => {
    await page.goto("/about");

    await page
      .getByRole("link", { name: "Read the thesis case study" })
      .click();

    await expect(page).toHaveURL(/\/projects\/tcc-engsoftware$/);
  });

  test("is reachable from the navigation, which marks it as current", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "mobile-chromium") {
      await page.getByRole("button", { name: "Open menu" }).click();
    }
    await page
      .getByRole("link", { name: "About", exact: true })
      .first()
      .click();

    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator('a[aria-current="page"]').first()).toHaveText(
      "About",
    );
  });

  test("has a page-specific title", async ({ page }) => {
    await page.goto("/about");

    await expect(page).toHaveTitle("About · Adriano Matoba Lipski");
  });

  test("is translated, anchors included", async ({ page }) => {
    await page.goto("/pt-br/about");

    await expect(
      page.getByRole("heading", { level: 1, name: "Sobre" }),
    ).toBeVisible();
    await page
      .getByRole("list", { name: "workflow whoami" })
      .getByRole("link", { name: "experience" })
      .click();
    await expect(page).toHaveURL(/\/pt-br\/about#experience$/);
  });

  test("never overflows the viewport on mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "mobile layout");
    await page.goto("/about");

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`has no detectable accessibility violations in the ${colorScheme} theme`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/about");
      await revealAllSections(page);

      const results = await new AxeBuilder({ page })
        .withTags(AXE_TAGS)
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
