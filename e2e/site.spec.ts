import { expect, test } from "@playwright/test";

test("unknown routes answer 404 with a way back home", async ({ page }) => {
  const response = await page.goto("/definitely-not-a-page");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL("/");
});

test("pages are not indexable unless indexing is explicitly allowed", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("pages share a title and Open Graph preview", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Adriano Matoba Lipski — DevOps & Automation");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /opengraph-image/,
  );
});

test("generated Open Graph image and icon are served as PNG", async ({
  request,
}) => {
  for (const path of ["/opengraph-image", "/icon"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toBe("image/png");
  }
});

test("keyboard users can skip straight to the main content", async ({
  page,
}) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});
