import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

test.use({ viewport: { width: 1280, height: 720 }, colorScheme: "light", reducedMotion: "reduce" });
test.skip(({ browserName, isMobile }) => browserName !== "chromium" || isMobile, "Desktop Chromium owns the cross-platform visual baseline; other projects run behavior and reflow checks.");

async function choosePreviewState(page: Page, label: string) {
  const trigger = page.getByRole("button", { name: /Preview state:/ });
  await trigger.click();
  await page.getByRole("menuitemradio", { name: label, exact: true }).click();
  await expect(trigger).toHaveAccessibleName(`Preview state: ${label}`);
}

test("public entry remains visually stable in light and dark", async ({ page }) => {
  await page.goto("/#introduction");
  await expect(page.getByRole("heading", { level: 1, name: "Introduction" })).toBeVisible();
  await expect(page).toHaveScreenshot("introduction-light.png", { animations: "disabled", fullPage: false });

  await page.getByRole("button", { name: "Current theme: light. Switch to dark theme" }).click();
  await expect(page).toHaveScreenshot("introduction-dark.png", { animations: "disabled", fullPage: false });
});

test("component document and focus-state specimen remain visually stable", async ({ page }) => {
  await page.goto("/#button");
  await expect(page.getByRole("heading", { level: 1, name: "Button" })).toBeVisible();
  await expect(page).toHaveScreenshot("button-product-light.png", { animations: "disabled", fullPage: false });

  await page.getByRole("button", { name: "State", exact: true }).click();
  await choosePreviewState(page, "Focus");
  await expect(page).toHaveScreenshot("button-focus-light.png", { animations: "disabled", fullPage: false });

  await choosePreviewState(page, "Loading");
  await expect(page).toHaveScreenshot("button-loading-light.png", { animations: "disabled", fullPage: false });
});

test("field validation specimen remains visually stable", async ({ page }) => {
  await page.goto("/#text-field");
  await expect(page.getByRole("heading", { level: 1, name: "Text Field" })).toBeVisible();
  await page.getByRole("button", { name: "State", exact: true }).click();
  await choosePreviewState(page, "Error");
  await expect(page).toHaveScreenshot("text-field-error-light.png", { animations: "disabled", fullPage: false });
});

test("product pilot remains visually stable", async ({ page }) => {
  await page.goto("/#product-pilot");
  await expect(page.getByRole("heading", { level: 1, name: "Product pilot" })).toBeVisible();
  await expect(page).toHaveScreenshot("product-pilot-light.png", { animations: "disabled", fullPage: false });
  await page.getByRole("button", { name: "Current theme: light. Switch to dark theme" }).click();
  await expect(page).toHaveScreenshot("product-pilot-dark.png", { animations: "disabled", fullPage: false });
});
