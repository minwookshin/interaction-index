import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/#product-patterns");
  await expect(page.getByRole("heading", { level: 1, name: "Recipes" })).toBeVisible({ timeout: 15_000 });
});

test("Recipes expose three complete B2B tasks", async ({ page }) => {
  await expect(page.getByRole("region", { name: "Customer Workspace recipe" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Billing and Usage recipe" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Members and Permissions recipe" })).toBeVisible();
  await expect(page.getByText("@teum-pinned/teum-product-patterns", { exact: false })).toBeVisible();
});

test("Customer Workspace preserves list origin while completing work", async ({ page }) => {
  const recipe = page.getByRole("region", { name: "Customer Workspace recipe" });
  const search = recipe.getByRole("searchbox", { name: "Search customers" });
  await search.fill("Relay");
  const relay = recipe.getByRole("button", { name: /Relay Systems/ });
  await relay.click();
  await expect(recipe.getByRole("region", { name: "Selected customer" })).toContainText("SSO blocker");
  const complete = recipe.getByRole("button", { name: "Complete follow-up" });
  await expect(complete).toHaveCount(1);
  await complete.click();
  await expect(recipe.getByRole("button", { name: "Follow-up complete" })).toBeDisabled();
  await expect(search).toHaveValue("Relay");
});

test("Billing period updates chart without changing recipe width", async ({ page }) => {
  const recipe = page.getByRole("region", { name: "Billing and Usage recipe" });
  const initial = await recipe.boundingBox();
  await recipe.getByRole("button", { name: "90D" }).click();
  await expect(recipe.getByRole("group", { name: "API usage. 12 data points." })).toBeVisible();
  const final = await recipe.boundingBox();
  expect(Math.abs((initial?.width ?? 0) - (final?.width ?? 0))).toBeLessThanOrEqual(1);
  await recipe.getByRole("button", { name: "Manage plan" }).click();
  await expect(page.getByRole("dialog", { name: "Review Scale plan" })).toBeVisible();
});

test("Members and Permissions keeps policy and invitation in one task", async ({ page }) => {
  const recipe = page.getByRole("region", { name: "Members and Permissions recipe" });
  await recipe.getByRole("tab", { name: "Permissions" }).click();
  const permission = recipe.getByRole("checkbox", { name: "Export data for Member" });
  await permission.click();
  await expect(permission).not.toBeChecked();
  await recipe.getByRole("button", { name: "Invite member" }).click();
  await page.getByRole("textbox", { name: "Work email" }).fill("alex@northstar.co");
  await page.getByRole("button", { name: "Send invitation" }).click();
  await recipe.getByRole("tab", { name: "Members" }).click();
  await expect(recipe.getByRole("cell", { name: /Alex/ })).toBeVisible();
});

test("Product Patterns contain overflow and remove movement for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Recipes" })).toBeVisible({ timeout: 15_000 });
  for (const recipe of await page.locator(".teum-product-pattern").all()) {
    const dimensions = await recipe.evaluate((element) => ({ clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  }
  const detail = page.locator(".teum-product-pattern__customer-detail");
  await expect(detail).toHaveAttribute("data-motion-mode", "reduced");
});
