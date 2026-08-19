import { expect, test } from "@playwright/test";
import { publicRoutes } from "./public-routes";

test.use({ viewport: { width: 1280, height: 720 }, colorScheme: "light", reducedMotion: "reduce" });
test.skip(({ browserName, isMobile }) => browserName !== "chromium" || isMobile, "Desktop Chromium owns the frozen RC visual baseline.");

const lazyPreviewRoutes = new Set(["date-picker", "tree", "reorderable-list"]);
const lazyDocumentSelectors = new Map([
  ["product-pilot", '.pilot-workspace[aria-label="Issues Workspace"]'],
  ["analytics", '.whatiuse-analytics-recipe[aria-label="SaaS Overview recipe"]'],
  ["product-patterns", '.whatiuse-product-pattern[aria-label="Customer Workspace recipe"]'],
  ["collaboration-patterns", '.whatiuse-product-pattern[aria-label="Members and Permissions recipe"]'],
]);

for (const [route, heading, group] of publicRoutes) {
  test(`${group}/${route} matches the frozen light and dark route baseline`, async ({ page }) => {
    await page.goto(`/#${route}`);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    if (lazyPreviewRoutes.has(route)) {
      await expect(page.locator("[data-react-aria-preview-ready]").first()).toBeAttached();
    }

    const lazyDocumentSelector = lazyDocumentSelectors.get(route);
    if (lazyDocumentSelector) {
      await expect(page.locator(lazyDocumentSelector)).toBeVisible();
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
