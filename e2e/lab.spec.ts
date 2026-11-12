import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getLabPipeline } from "@/content/lab-pipeline";
import {
  describeFrame,
  resolveRun,
  runFrames,
  summarizeRun,
} from "@/lib/pipeline-run";
import { TICK_MS } from "@/lib/use-pipeline-playback";

const { jobs: ciJobs, scenarios: pipelineScenarios } = getLabPipeline("en");

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

  test("says it is a simulation", async ({ page }) => {
    await page.goto(path);

    await expect(page.getByText("Simulated").first()).toBeVisible();
    await expect(
      page.getByText("nothing here triggers anything"),
    ).toBeVisible();
  });

  test("can be explored with the keyboard alone", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chromium", "tabs are desktop");
    await page.goto(path);
    const panel = page.getByRole("tabpanel");

    await page.getByRole("radio", { name: "Push to main" }).focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("radio", { name: "Failure on main" }),
    ).toBeChecked();

    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Run" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("tab", { name: /Trigger/ })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: /E2E tests/ })).toBeFocused();
    await expect(panel).toContainText("An end-to-end test fails.");

    await page.keyboard.press("End");
    await expect(panel).toContainText("Needs publish, which was skipped.");

    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Previous job" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("tab", { name: /Preview deploy/ }),
    ).toHaveAttribute("aria-selected", "true");
  });

  test("switching scenario changes the outcomes", async ({
    page,
  }, testInfo) => {
    await page.goto(path);
    const role = testInfo.project.name === "mobile-chromium" ? "button" : "tab";
    const publish = page.getByRole(role, { name: /^Publish/ });
    await expect(publish).toContainText("Passed");

    await page.getByText("Vulnerable image").click();

    await expect(page.getByRole(role, { name: /^Image/ })).toContainText(
      "Failed",
    );
    await expect(publish).toContainText("Skipped");
  });

  test("on mobile, opens a job's details right below it", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "mobile layout");
    await page.goto(path);
    const publish = page.getByRole("button", { name: /^Publish/ });

    await publish.click();

    await expect(publish).toHaveAttribute("aria-expanded", "true");
    const details = page.getByRole("region", { name: /^Publish/ });
    await expect(details).toContainText("Needs: quality, e2e, image");
    const header = (await publish.boundingBox())!;
    const panel = (await details.boundingBox())!;
    expect(panel.y).toBeGreaterThanOrEqual(header.y + header.height);
    expect(panel.y - (header.y + header.height)).toBeLessThan(40);

    await publish.click();
    await expect(publish).toHaveAttribute("aria-expanded", "false");
    await expect(details).toHaveCount(0);
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

test.describe("pipeline explorer playback", () => {
  const path = "/lab/pipeline";
  const outcome = resolveRun(ciJobs, pipelineScenarios[0], "en");
  const frames = runFrames(ciJobs, outcome);

  test("Run plays the scenario frame by frame and announces each one", async ({
    page,
  }) => {
    await page.clock.install();
    await page.goto(path);
    const status = page.getByRole("status");

    await page.getByRole("button", { name: "Run" }).click();
    await expect(status).toHaveText(describeFrame(ciJobs, frames, 0, "en"));

    for (let frame = 1; frame < frames.length - 1; frame++) {
      await page.clock.runFor(TICK_MS);
      await expect(status).toHaveText(
        describeFrame(ciJobs, frames, frame, "en"),
      );
    }
    await page.clock.runFor(TICK_MS);
    await expect(status).toHaveText(summarizeRun(outcome, "en"));
    await expect(page.getByRole("button", { name: "Run" })).toBeVisible();
  });

  test("with reduced motion, Run shows the outcome at once", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);

    await page.getByRole("button", { name: "Run" }).click();

    await expect(page.getByRole("status")).toHaveText(
      summarizeRun(outcome, "en"),
    );
  });

  test("stepping to another job pauses the run", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chromium", "Next is desktop");
    await page.clock.install();
    await page.goto(path);
    await page.getByRole("button", { name: "Run" }).click();
    await page.clock.runFor(TICK_MS);

    await page.getByRole("button", { name: "Next job" }).click();
    await page.clock.runFor(TICK_MS * 3);

    await expect(page.getByRole("status")).toHaveText("Paused.");
    await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
  });
});

test.describe("pipeline explorer without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("shows every scenario's outcome as a table", async ({ page }) => {
    await page.goto("/lab/pipeline");

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
