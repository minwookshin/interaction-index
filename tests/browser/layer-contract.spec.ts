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
  const trigger = page.getByRole("button", { name: "Show toast" });
  await trigger.click();
  await trigger.click();
  await trigger.click();

  const toaster = page.locator(".ix-toaster");
  await expect(toaster).toBeVisible();
  const visibleToast = page.locator(".ix-toast:visible");
  await expect(visibleToast).toHaveCount(1);
  await expect(toaster).toHaveCSS("z-index", "130");

  const [toastBox, viewport] = await Promise.all([
    visibleToast.boundingBox(),
    page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight })),
  ]);
  expect(toastBox).not.toBeNull();
  expect(Math.abs((toastBox!.x + toastBox!.width / 2) - viewport.width / 2)).toBeLessThanOrEqual(1);
});

test("data-display polish keeps compact geometry optically balanced", async ({ page }) => {
  await page.goto("/#table");
  await expect(page.locator(".data-table-recipe .ix-table__body .ix-table__row").first()).toHaveCSS("height", "46px");
  await expect(page.locator(".data-table-recipe .ix-badge--strong")).toHaveCount(0);

  await page.goto("/#avatar");
  const avatar = page.locator(".primary-avatar-group .ix-avatar[data-status]").first().or(page.locator(".live-specimen .ix-avatar[data-status]").first());
  const status = avatar.locator(".ix-avatar__status");
  await expect(status).toHaveCSS("width", "11px");
  await expect(status).toHaveCSS("height", "11px");
});
