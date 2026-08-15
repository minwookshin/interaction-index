import { expect, test } from "@playwright/test";
import axe from "axe-core";

type AxeResult = { violations: Array<{ id: string; impact: string | null; description: string; nodes: unknown[] }> };

async function runAxe(page: import("@playwright/test").Page) {
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(() => (window as typeof window & { axe: { run: () => Promise<AxeResult> } }).axe.run());
}

for (const [route, heading] of [["introduction", "Introduction"], ["button", "Button"], ["product-pilot", "Product pilot"]] as const) {
  test(route + " has no serious or critical automated accessibility violations", async ({ page }) => {
    await page.goto("/#" + route);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const result = await runAxe(page);
    expect(result.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical")).toEqual([]);
  });
}

test("pilot preserves structure in RTL, forced colors, and reduced motion", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/#product-pilot");
  await page.evaluate(() => { document.documentElement.dir = "rtl"; });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("heading", { level: 1, name: "Product pilot" })).toBeVisible();
  await expect(page.getByRole("button", { name: "New issue" })).toBeVisible();
});

test("documentation remains usable at a 200 percent equivalent viewport", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 720 });
  await page.goto("/#product-pilot");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Product pilot" })).toBeVisible();
});
