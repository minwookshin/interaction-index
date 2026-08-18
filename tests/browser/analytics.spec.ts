import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/#analytics");
  await expect(page.getByRole("heading", { level: 1, name: "Analytics" })).toBeVisible({ timeout: 15_000 });
});

test("Analytics exposes one renderer family and three complete product recipes", async ({ page }) => {
  await expect(page.getByRole("region", { name: "Analytics renderer family" })).toBeVisible();
  await expect(page.getByRole("region", { name: "SaaS Overview recipe" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Product Usage recipe" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Conversion and Retention recipe" })).toBeVisible();
  await expect(page.getByRole("table", { name: "whatiuse Analytics product primitives" })).toBeVisible();
  await expect(page.getByText("@teum-pinned/teum-analytics", { exact: false })).toBeVisible();
});

test("Renderer family shares keyboard inspection, semantic data, and source-owned chart states", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "The renderer keyboard proof requires a physical keyboard path.");
  const gallery = page.getByRole("region", { name: "Analytics renderer family" });
  await expect(gallery.locator('[data-chart-type="area"]')).toBeVisible();
  await expect(gallery.locator('[data-chart-type="stacked-bar"]')).toBeVisible();

  const donut = gallery.getByRole("group", { name: "Plan mix. 4 segments." });
  await donut.focus();
  await page.keyboard.press("ArrowRight");
  await expect(gallery.getByText(/Business\. 482\./)).toBeAttached();

  const firstCell = gallery.getByRole("button", { name: "Create, Mon, 42" });
  await firstCell.focus();
  await page.keyboard.press("ArrowRight");
  await expect(gallery.getByRole("button", { name: "Create, Tue, 58" })).toHaveAttribute("aria-pressed", "true");
});

test("SaaS Overview changes range without changing the recipe geometry", async ({ page }) => {
  const recipe = page.getByRole("region", { name: "SaaS Overview recipe" });
  const initialBox = await recipe.boundingBox();

  await recipe.getByRole("button", { name: "6M" }).click();
  await expect(recipe.getByRole("group", { name: "Recurring revenue. 6 data points." })).toBeVisible();
  await recipe.getByRole("button", { name: "12M" }).click();
  await expect(recipe.getByRole("group", { name: "Recurring revenue. 12 data points." })).toBeVisible();

  const finalBox = await recipe.boundingBox();
  expect(initialBox).not.toBeNull();
  expect(finalBox).not.toBeNull();
  expect(Math.abs((initialBox?.height ?? 0) - (finalBox?.height ?? 0))).toBeLessThanOrEqual(1);
});

test("Product Usage keeps transient chart inspection local", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "The keyboard inspection proof requires a physical keyboard path.");
  const recipe = page.getByRole("region", { name: "Product Usage recipe" });
  const usage = recipe.getByRole("group", { name: "Active usage. 14 data points." });
  await expect(recipe.locator(".teum-chart__tooltip")).toHaveCount(0);
  await usage.focus();
  await page.keyboard.press("Home");

  await expect(recipe.locator(".teum-analytics-recipe__header small")).toHaveText("Aug 12");
  await expect(recipe.locator(".teum-chart__tooltip")).toHaveCount(1);
  await expect(recipe.locator(".teum-chart__tooltip").first()).toContainText("Aug 3");
  await expect(page.locator("html")).toHaveAttribute("data-input-modality", "keyboard");

  await recipe.getByRole("button", { name: /Search latency incident/ }).click();
  await expect(recipe.locator(".teum-analytics-recipe__header small")).toHaveText("Aug 15");
  await expect(recipe.getByRole("button", { name: /Search latency incident/ })).toHaveAttribute("aria-pressed", "true");
});

test("Chart legend filtering keeps one visible series and one exact data table", async ({ page }) => {
  const recipe = page.getByRole("region", { name: "SaaS Overview recipe" });
  const previous = recipe.getByRole("button", { name: "Previous period" });
  const current = recipe.getByRole("button", { name: "Current period" });

  await previous.click();
  await expect(previous).toHaveAttribute("aria-pressed", "false");
  await expect(current).toHaveAttribute("aria-disabled", "true");
  await expect(current).toHaveAttribute("aria-pressed", "true");

  await recipe.getByRole("button", { name: "View data" }).click();
  const table = recipe.getByRole("table", { name: "Recurring revenue data" });
  await expect(table).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "Current period" })).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "Previous period" })).toHaveCount(0);
});

test("Conversion selection replaces the chart series and supporting records", async ({ page }) => {
  const recipe = page.getByRole("region", { name: "Conversion and Retention recipe" });
  const paid = recipe.getByRole("button", { name: /Became paid 1,742/ });
  await paid.click();

  await expect(paid).toHaveAttribute("aria-pressed", "true");
  await expect(recipe.getByRole("group", { name: "Became paid trend. 12 data points." })).toBeVisible();
  await expect(recipe.getByText("No data for this range.")).toHaveCount(0);
  await expect(recipe.getByRole("table", { name: "Became paid accounts" })).toBeVisible();

  const pointerFocus = await paid.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, boxShadow: style.boxShadow };
  });
  expect(pointerFocus.outlineStyle).toBe("none");
  expect(pointerFocus.boxShadow).toBe("none");
});

test("Analytics honors reduced motion and contains overflow inside its data surface", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Analytics" })).toBeVisible({ timeout: 15_000 });

  const goalIndicator = page.locator(".teum-goal__indicator").first();
  await expect(goalIndicator).toBeVisible();
  expect(await goalIndicator.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe("0s");

  for (const recipe of await page.locator(".teum-analytics-recipe").all()) {
    const dimensions = await recipe.evaluate((element) => ({ clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  }
});
