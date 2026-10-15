import { expect, test } from "@playwright/test";

const html = (page: import("@playwright/test").Page) => page.locator("html");

test("first visit follows the operating system theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible();
});

test("a manual choice survives a reload", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(html(page)).toHaveAttribute("data-theme", "light");

  await page.reload();
  await expect(html(page)).toHaveAttribute("data-theme", "light");
});

test("a persisted theme is applied before first paint, without flashing the system one", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => {
    localStorage.setItem("theme", "light");
    const seen: (string | undefined)[] = [];
    (window as unknown as { __themes: typeof seen }).__themes = seen;
    new MutationObserver(() =>
      seen.push(document.documentElement?.dataset.theme),
    ).observe(document, {
      attributes: true,
      attributeFilter: ["data-theme"],
      subtree: true,
    });
    document.addEventListener("DOMContentLoaded", () =>
      seen.push(`ready:${document.documentElement.dataset.theme}`),
    );
  });

  await page.goto("/");

  const seen = await page.evaluate(
    () => (window as unknown as { __themes: string[] }).__themes,
  );
  expect(seen).toContain("ready:light");
  expect(seen).not.toContain("dark");
});
