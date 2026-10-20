import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/#pipeline");
});

test("stages can be explored with the keyboard alone", async ({ page }) => {
  const panel = page.getByRole("tabpanel");
  await page.getByRole("tab", { name: /Git Push/ }).focus();

  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Test/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(panel).toContainText("pytest");

  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: /Deploy/ })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: /Git Push/ })).toBeFocused();
});

test("the workflow excerpt expands to show YAML", async ({ page }) => {
  await page.getByText("Workflow excerpt").click();

  await expect(page.getByRole("tabpanel")).toContainText("branches: [main]");
});

test("copying a command is confirmed to the user", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  await page.getByRole("button", { name: "Copy command" }).click();

  await expect(
    page.getByRole("status").filter({ hasText: "Copied" }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "git push origin main",
  );
});
