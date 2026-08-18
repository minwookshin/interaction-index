import { expect, test } from "@playwright/test";

test("a flyout opened inside a modal remains above the modal surface", async ({ page }) => {
  await page.goto("/#dialog");
  await page.getByRole("button", { name: "Edit details" }).first().click();

  const dialog = page.getByRole("dialog", { name: "Edit component details" });
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

test("toast feedback owns the highest non-navigation layer and reveals a three-item stack", async ({ page }) => {
  await page.goto("/#toast");
  const trigger = page.getByRole("button", { name: "Show toast" });
  await trigger.click();
  await trigger.click();
  await trigger.click();

  const toaster = page.locator(".teum-toaster");
  const visibleToast = page.locator(".teum-toast:visible");
  await expect(visibleToast).toHaveCount(3);
  await expect(visibleToast.first()).toBeVisible();
  await expect(toaster).toHaveCount(1);
  await expect(toaster).toHaveCSS("z-index", "130");

  const [toastBox, viewport] = await Promise.all([
    visibleToast.first().boundingBox(),
    page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight })),
  ]);
  expect(toastBox).not.toBeNull();
  expect(Math.abs((toastBox!.x + toastBox!.width / 2) - viewport.width / 2)).toBeLessThanOrEqual(1);
});

test("product feedback keeps bounded event identities and scopes undo to its origin", async ({ page }) => {
  await page.goto("/#toast");

  await page.getByRole("button", { name: "Confirm action" }).click();
  await page.getByRole("button", { name: "Show undo" }).click();
  await page.getByRole("button", { name: "Show error" }).click();

  const visibleToast = page.locator(".teum-toast:visible");
  await expect(visibleToast).toHaveCount(3);
  const errorToast = visibleToast.filter({ hasText: "Couldn’t publish" });
  await expect(errorToast).toHaveCount(1);
  await expect(errorToast.getByRole("button", { name: "Undo" })).toHaveCount(0);
  const undoToast = visibleToast.filter({ hasText: "Component archived" });
  await expect(undoToast.getByRole("button", { name: "Undo" })).toHaveCount(1);
});

test("keyboard-opened flyouts skip spatial travel and reduced motion keeps only opacity", async ({ page }) => {
  await page.goto("/#menu");
  const trigger = page.getByRole("button", { name: "Actions" }).first();

  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("html")).toHaveAttribute("data-input-modality", "keyboard");
  const keyboardMenu = page.getByRole("menu", { name: "Actions" });
  await expect(keyboardMenu).toBeVisible();
  const keyboardDurationMs = await keyboardMenu.evaluate((element) => Math.max(...getComputedStyle(element).transitionDuration
    .split(",")
    .map((value) => value.trim())
    .map((value) => value.endsWith("ms") ? Number.parseFloat(value) : Number.parseFloat(value) * 1000)));
  expect(keyboardDurationMs).toBeLessThanOrEqual(0.02);
  await page.keyboard.press("Escape");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await trigger.click();
  const reducedMenu = page.getByRole("menu", { name: "Actions" });
  await expect(reducedMenu).toBeVisible();
  await expect(reducedMenu).toHaveCSS("transition-property", "opacity");
});

test("data-display polish keeps compact geometry optically balanced", async ({ page }) => {
  await page.goto("/#table");
  await expect(page.locator(".data-table-recipe .teum-table__body .teum-table__row").first()).toHaveCSS("height", "46px");
  await expect(page.locator(".data-table-recipe .teum-badge--strong")).toHaveCount(0);

  await page.goto("/#avatar");
  const avatar = page.locator(".primary-avatar-group .teum-avatar[data-status]").first().or(page.locator(".live-specimen .teum-avatar[data-status]").first());
  const status = avatar.locator(".teum-avatar__status");
  await expect(status).toHaveCSS("width", "12px");
  await expect(status).toHaveCSS("height", "12px");
});
