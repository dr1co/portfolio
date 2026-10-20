import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "mobile layout only");
  await page.goto("/");
});

test("nothing overflows the viewport horizontally", async ({ page }) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
});

test("pipeline stages stack vertically", async ({ page }) => {
  const first = await page.getByRole("tab", { name: /Git Push/ }).boundingBox();
  const second = await page.getByRole("tab", { name: /Build/ }).boundingBox();

  expect(second!.y).toBeGreaterThan(first!.y + first!.height - 1);
  expect(Math.abs(second!.x - first!.x)).toBeLessThan(2);
});

test("the menu button is hidden while Home is the only destination", async ({
  page,
}) => {
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveCount(0);
});

test.fixme("the mobile menu opens, closes on Escape and on link click", async ({
  page,
}) => {
  // Enable once a second route or a contact link exists (see MobileNav unit tests for the behaviour).
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
});
