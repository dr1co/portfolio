import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("lab landing", () => {
  test("lists the Pipeline Explorer as a simulated demo", async ({ page }) => {
    await page.goto("/lab");

    await expect(
      page.getByRole("heading", { level: 1, name: "Lab" }),
    ).toBeVisible();
    const card = page.getByRole("article").filter({
      has: page.getByRole("heading", { name: "Pipeline Explorer" }),
    });
    await expect(card).toContainText("Simulated");

    await card.getByRole("link", { name: "Pipeline Explorer" }).click();
    await expect(page).toHaveURL(/\/lab\/pipeline$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Pipeline Explorer" }),
    ).toBeVisible();
  });

  test("is reachable from the navigation, which marks it as current", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "mobile-chromium") {
      await page.getByRole("button", { name: "Open menu" }).click();
    }
    await page.getByRole("link", { name: "Lab", exact: true }).first().click();

    await expect(page).toHaveURL(/\/lab$/);
    await expect(page.locator('a[aria-current="page"]').first()).toHaveText(
      "Lab",
    );
  });

  test("has a page-specific title", async ({ page }) => {
    await page.goto("/lab");

    await expect(page).toHaveTitle("Lab · Adriano Matoba Lipski");
  });
});

test.describe("pipeline explorer page", () => {
  const path = "/lab/pipeline";

  test("says it is a simulation and shows every scenario's outcome", async ({
    page,
  }) => {
    await page.goto(path);

    await expect(page.getByText("Simulated").first()).toBeVisible();
    const table = page.getByRole("table");
    await expect(table.getByRole("columnheader")).toContainText([
      "Job",
      "Push to main",
      "Pull request",
      "Failure on main",
      "Vulnerable image",
    ]);
    await expect(
      table.getByRole("row", { name: /^E2E tests/ }).getByRole("cell"),
    ).toContainText(["Passed", "Passed", "Failed", "Passed"]);
  });

  test("keeps Lab marked as the current section", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chromium", "desktop nav");
    await page.goto(path);

    await expect(
      page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "Lab" }),
    ).toHaveAttribute("aria-current", "true");
  });

  test("links back to the Lab", async ({ page }) => {
    await page.goto(path);
    await page.getByRole("link", { name: "Back to the Lab" }).click();

    await expect(page).toHaveURL(/\/lab$/);
  });

  test("has a page-specific title", async ({ page }) => {
    await page.goto(path);

    await expect(page).toHaveTitle("Pipeline Explorer · Adriano Matoba Lipski");
  });

  test("never overflows the viewport on mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "mobile layout");
    await page.goto(path);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

for (const path of ["/lab", "/lab/pipeline"]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${path} has no detectable accessibility violations in the ${colorScheme} theme`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);

      const results = await new AxeBuilder({ page })
        .withTags(AXE_TAGS)
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
