import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
// Set BASE_URL to test an existing deployment (container, Vercel) instead of a local build.
const remoteUrl = process.env.BASE_URL;
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: remoteUrl ?? `http://localhost:${PORT}`,
    extraHTTPHeaders: bypassSecret
      ? { "x-vercel-protection-bypass": bypassSecret }
      : undefined,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: remoteUrl
    ? undefined
    : {
        command: `npm run build && npm run start -- -p ${PORT}`,
        port: PORT,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
