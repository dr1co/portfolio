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

test("the mobile menu opens, closes on Escape and on link click", async ({
  page,
}) => {
  const menu = page.getByRole("navigation", { name: "Mobile" });
  const toggle = page.getByRole("button", { name: "Open menu" });

  await toggle.click();
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await menu.getByRole("link", { name: "Contact" }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#contact$/);
});
