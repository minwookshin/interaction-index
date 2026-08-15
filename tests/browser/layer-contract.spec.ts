import { expect, test } from "@playwright/test";

test("a flyout opened inside a modal remains above the modal surface", async ({ page }) => {
  await page.goto("/#dialog");
  await page.getByRole("button", { name: "Edit details" }).first().click();

  const dialog = page.getByRole("dialog", { name: "Edit component metadata" });
  await expect(dialog).toHaveAttribute("data-layer", "modal");

  await dialog.getByRole("combobox", { name: "Maturity" }).click();
  const flyout = page.locator('[data-layer="flyout"]').filter({ has: page.getByRole("option", { name: "Alpha" }) });
  await expect(flyout).toBeVisible();

  const [modalLayer, flyoutLayer] = await Promise.all([
    dialog.evaluate((element) => Number.parseInt(getComputedStyle(element).zIndex, 10)),
    flyout.locator("xpath=..").evaluate((element) => Number.parseInt(getComputedStyle(element).zIndex, 10)),
  ]);
  expect(flyoutLayer).toBeGreaterThan(modalLayer);
});

test("toast feedback owns the highest non-navigation product layer", async ({ page }) => {
  await page.goto("/#toast");
  await page.getByRole("button", { name: "Show toast" }).click();

  const toaster = page.locator(".ix-toaster");
  await expect(toaster).toBeVisible();
  await expect(page.locator(".ix-toast")).toBeVisible();
  await expect(toaster).toHaveCSS("z-index", "130");
});
