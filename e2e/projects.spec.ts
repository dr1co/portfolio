import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("projects directory", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");
  });

  test("lists projects under their groups, DevOps first", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Projects" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 })).toHaveText([
      "DevOps & Delivery",
      "Machine Learning",
    ]);
    await expect(
      page.getByRole("heading", { level: 3, name: /Django Project Template/ }),
    ).toBeVisible();
  });

  test("is reachable from the navigation, which marks it as current", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "mobile-chromium") {
      await page.getByRole("button", { name: "Open menu" }).click();
    }
    await page
      .getByRole("link", { name: "Projects", exact: true })
      .first()
      .click();

    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.locator('a[aria-current="page"]').first()).toHaveText(
      "Projects",
    );
  });

  test("has a page-specific title", async ({ page }) => {
    await expect(page).toHaveTitle("Projects · Adriano Matoba Lipski");
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`has no detectable accessibility violations in the ${colorScheme} theme`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.reload();
      for (const reveal of await page.locator("[data-reveal]").all()) {
        await reveal.scrollIntoViewIfNeeded();
        await expect(reveal).toHaveCSS("opacity", "1");
      }

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }
});
