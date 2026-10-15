import { expect, test } from "@playwright/test";

test("home page is served as English HTML", async ({ request }) => {
  const response = await request.get("/");

  expect(response.status()).toBe(200);
  expect(await response.text()).toMatch(/<html[^>]*lang="en"/);
});
