import { expect, test } from "@playwright/test";

const stories = [
  ["product-patterns--customer-workspace", "Customer Workspace recipe"],
  ["product-patterns--billing-usage", "Billing and Usage recipe"],
  ["product-patterns--members-permissions", "Members and Permissions recipe"],
] as const;

for (const [id, regionName] of stories) {
  for (const theme of ["light", "dark"] as const) {
    test(`${regionName} stays visually stable in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 960 });
      await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
      const story = page.locator(".analytics-story");
      await expect(story).toBeVisible();
      await expect(page.locator("[data-story-ready='true']")).toBeVisible({ timeout: 30_000 });
      await expect(page.getByRole("region", { name: regionName })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(story).toHaveScreenshot(`${id}-${theme}.png`, { animations: "disabled", fullPage: false });
    });
  }
}
