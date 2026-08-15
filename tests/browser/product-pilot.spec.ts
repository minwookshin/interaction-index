import { expect, test } from "@playwright/test";

test("product pilot supports create, edit, archive, and recovery", async ({ page }) => {
  await page.goto("/#product-pilot");
  await expect(page.getByRole("heading", { level: 1, name: "Product pilot" })).toBeVisible();

  await page.getByRole("button", { name: "New issue" }).click();
  await page.getByRole("textbox", { name: "Title" }).fill("Verify composed product flow");
  await page.getByRole("textbox", { name: "Description" }).fill("Exercise the public system inside one realistic task.");
  await page.getByRole("button", { name: "Create issue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Verify composed product flow" })).toBeVisible();

  const issueActions = page.getByRole("button", { name: "More issue actions" });
  await expect(issueActions).toHaveCount(1);
  await issueActions.click();
  await page.getByRole("menuitem", { name: "Archive issue" }).click();
  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("heading", { name: "Verify composed product flow" })).toBeVisible();
});

test("product pilot selection responds within the interaction budget", async ({ page, isMobile }) => {
  await page.goto("/#product-pilot");
  if (isMobile) await page.getByRole("button", { name: "Back to list" }).click();
  const start = Date.now();
  await page.getByRole("button", { name: /Tune shared detail motion/ }).click();
  await expect(page.getByRole("heading", { name: "Tune shared detail motion" })).toBeVisible();
  const selectionMs = Date.now() - start;
  console.log(`[pilot-performance] shared-detail selection: ${selectionMs}ms`);
  expect(selectionMs).toBeLessThan(750);

  const overlayStart = Date.now();
  await page.getByRole("button", { name: "New issue" }).click();
  await expect(page.getByRole("dialog", { name: "Create issue" })).toBeVisible();
  const overlayMs = Date.now() - overlayStart;
  console.log(`[pilot-performance] dialog open: ${overlayMs}ms`);
  expect(overlayMs).toBeLessThan(750);
});
