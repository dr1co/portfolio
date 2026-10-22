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

test.describe("case study", () => {
  const path = "/projects/tcc-engsoftware";

  test("opens from its card and shows the project header", async ({ page }) => {
    await page.goto("/projects");
    await page
      .getByRole("link", { name: /Financial market analysis/ })
      .first()
      .click();

    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Financial market analysis/,
      }),
    ).toBeVisible();
    await expect(page.getByText("Machine Learning").first()).toBeVisible();
  });

  test("table of contents jumps to its sections", async ({
    page,
  }, testInfo) => {
    await page.goto(path);
    if (testInfo.project.name === "mobile-chromium") {
      await page.getByText("On this page").first().click();
    }
    const toc = page
      .getByRole("navigation", { name: "On this page" })
      .filter({ visible: true });

    await toc.getByRole("link", { name: "Evidence and links" }).click();

    await expect(page).toHaveURL(/#evidence-and-links$/);
    await expect(
      page.getByRole("heading", { level: 2, name: "Evidence and links" }),
    ).toBeInViewport();
  });

  test("keeps Projects marked as the current section", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chromium", "desktop nav");
    await page.goto(path);

    await expect(
      page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "Projects" }),
    ).toHaveAttribute("aria-current", "true");
  });

  test("links back to the directory", async ({ page }) => {
    await page.goto(path);
    await page.getByRole("link", { name: "All projects" }).click();

    await expect(page).toHaveURL(/\/projects$/);
  });

  test("has its own title and Open Graph image", async ({ page, request }) => {
    await page.goto(path);

    await expect(page).toHaveTitle(
      /^Financial market analysis.* · Adriano Matoba Lipski$/,
    );
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage).toContain(`${path}/opengraph-image`);
    const image = await request.get(new URL(ogImage!).pathname);
    expect(image.headers()["content-type"]).toBe("image/png");
  });

  test("unknown case studies answer 404", async ({ page }) => {
    const response = await page.goto("/projects/does-not-exist");

    expect(response?.status()).toBe(404);
  });

  test("projects without a case study answer 404", async ({ page }) => {
    const response = await page.goto("/projects/django-project-template");

    expect(response?.status()).toBe(404);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`has no detectable accessibility violations in the ${colorScheme} theme`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }
});

test("case study never overflows the viewport on mobile", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "mobile layout only");
  await page.goto("/projects/tcc-engsoftware");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
