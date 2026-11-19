import { expect, type Page } from "@playwright/test";

/**
 * Waits until React has hydrated the page. Keys pressed earlier reach the server HTML, whose tabs and
 * radios don't react yet. The theme toggle's label settles on mount, so it marks hydration.
 */
export async function waitForHydration(page: Page) {
  await expect(
    page.getByRole("button", { name: /^(Switch to|Mudar para)/ }),
  ).toBeAttached();
}
