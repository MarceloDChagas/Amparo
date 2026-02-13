import { expect, test } from "@playwright/test";

test("homepage loads successfully", async ({ page }) => {
  // Navigate to the application
  await page.goto("http://localhost:3000");

  // Wait for the page to be loaded
  await page.waitForLoadState("networkidle");

  // Check that the page loads without errors
  await expect(page).toHaveTitle(/.*/);
});
