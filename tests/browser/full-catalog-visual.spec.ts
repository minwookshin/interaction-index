import { expect, test } from "@playwright/test";
import { publicRoutes } from "./public-routes";

test.use({ viewport: { width: 1280, height: 720 }, colorScheme: "light", reducedMotion: "reduce" });
test.skip(({ browserName, isMobile }) => browserName !== "chromium" || isMobile, "Desktop Chromium owns the frozen RC visual baseline.");

const lazyPreviewRoutes = new Set(["date-picker", "tree", "reorderable-list"]);

for (const [route, heading, group] of publicRoutes) {
  test(`${group}/${route} matches the frozen light and dark route baseline`, async ({ page }) => {
    await page.goto(`/#${route}`);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    if (lazyPreviewRoutes.has(route)) {
      await expect(page.locator("[data-react-aria-preview-ready]").first()).toBeAttached();
    }

    await page.addStyleTag({ content: "* { caret-color: transparent !important; }" });
    await expect(page).toHaveScreenshot(`${group}-${route}-light.png`, {
      animations: "disabled",
      fullPage: false,
    });

    await page.getByRole("button", { name: "Current theme: light. Switch to dark theme" }).click();
    await expect(page.getByRole("button", { name: "Current theme: dark. Switch to light theme" })).toBeVisible();
    await expect(page).toHaveScreenshot(`${group}-${route}-dark.png`, {
      animations: "disabled",
      fullPage: false,
    });
  });
}
