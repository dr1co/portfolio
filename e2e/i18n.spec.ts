import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { getCaseStudySlugs } from "@/content/projects";

async function revealAllSections(page: Page) {
  for (const reveal of await page.locator("[data-reveal]").all()) {
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveCSS("opacity", "1");
  }
}

test("declares the page language on <html>", async ({ page }) => {
  await page.goto("/lab");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.goto("/pt-br/lab");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lab");
});

test("switches to the same page in the other language and back", async ({
  page,
}) => {
  await page.goto("/lab/pipeline");

  await page.getByRole("link", { name: "PT — Ver em português" }).click();
  await expect(page).toHaveURL(/\/pt-br\/lab\/pipeline$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Explorador de Pipeline",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");

  await page.getByRole("link", { name: "EN — View in English" }).click();
  await expect(page).toHaveURL(/\/lab\/pipeline$/);
  await expect(page).not.toHaveURL(/pt-br/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Pipeline Explorer",
  );
});

test("keeps links in Portuguese while browsing", async ({ page }) => {
  await page.goto("/pt-br");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Do código à produção.",
  );

  const viewAll = page.getByRole("link", { name: "Ver todos os projetos" });
  await viewAll.scrollIntoViewIfNeeded();
  await viewAll.click();

  await expect(page).toHaveURL(/\/pt-br\/projects$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Projetos");
});

test("switches language without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/projects");

  await expect(
    page.getByRole("link", { name: "PT — Ver em português" }),
  ).toHaveAttribute("href", "/pt-br/projects");
  await context.close();
});

test("case studies are written in the page's language", async ({ page }) => {
  await page.goto("/pt-br/projects/tcc-engsoftware");

  const heading = page.getByRole("heading", { level: 2, name: "Visão geral" });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveAttribute("id", "visão-geral");
  await expect(page.locator('a[href="#visão-geral"]').first()).toBeAttached();

  await page.getByRole("link", { name: "EN — View in English" }).click();
  await expect(page).toHaveURL(/\/projects\/tcc-engsoftware$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Overview" }),
  ).toBeVisible();
});

const [slug] = getCaseStudySlugs();
const portuguesePaths = [
  "/pt-br",
  "/pt-br/projects",
  `/pt-br/projects/${slug}`,
  "/pt-br/lab",
  "/pt-br/lab/pipeline",
];

for (const path of portuguesePaths) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${path} has no detectable accessibility violations in the ${colorScheme} theme`, async ({
      page,
    }) => {
      test.slow();
      await page.emulateMedia({ colorScheme });
      await page.goto(path);
      await revealAllSections(page);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }
}
