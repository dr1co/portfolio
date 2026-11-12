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

test("English URLs typed with the /en prefix redirect to the unprefixed URL", async ({
  page,
}) => {
  const response = await page.goto("/en/projects");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL("/projects");
  await expect(
    page.getByRole("heading", { level: 1, name: "Projects" }),
  ).toBeVisible();
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

test("Open Graph tags are in the page's language", async ({ page }) => {
  await page.goto("/pt-br");

  await expect(page).toHaveTitle("Adriano Matoba Lipski — DevOps & Automação");
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "pt_BR",
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    "Adriano Matoba Lipski — DevOps & Automação",
  );
});

test("generated Open Graph images and the icon are served as PNG", async ({
  page,
  request,
}) => {
  const images: string[] = [];
  for (const path of ["/", "/pt-br"]) {
    await page.goto(path);
    const og = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    images.push(new URL(og!).pathname);
  }
  for (const path of [...images, "/icon"]) {
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
