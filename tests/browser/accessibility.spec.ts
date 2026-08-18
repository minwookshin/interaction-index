import { expect, test } from "@playwright/test";
import axe from "axe-core";
import { publicRouteGroups, publicRoutes } from "./public-routes";

type AxeResult = { violations: Array<{ id: string; impact: string | null; description: string; nodes: unknown[] }> };

const componentRoutes = publicRouteGroups.components;

async function runAxe(page: import("@playwright/test").Page) {
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(() => (window as typeof window & { axe: { run: () => Promise<AxeResult> } }).axe.run());
}

for (const [route, heading] of [["", "Components for product interfaces."], ["button", "Button"], ["product-pilot", "Data"], ["product-patterns", "Recipes"]] as const) {
  test(route + " has no serious or critical automated accessibility violations", async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(route ? "/#" + route : "/");
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const result = await runAxe(page);
    expect(result.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical")).toEqual([]);
  });
}

test("all public documents have no serious or critical automated violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "The complete public-route scan runs once; representative routes run in every configured engine.");
  test.setTimeout(480_000);
  for (const [route, heading] of publicRoutes) {
    await page.goto(`/#${route}`);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const result = await runAxe(page);
    expect(result.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical"), route).toEqual([]);
  }
});

test("Library and documentation expose a keyboard-first skip path", async ({ page }) => {
  await page.goto("/");
  const landingSkipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(page.locator(".component-index-page").locator("a[href], button, input, [tabindex='0']").first()).toHaveClass(/teum-skip-link/);
  await landingSkipLink.focus();
  await expect(landingSkipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#component-index-content")).toBeFocused();

  await page.goto("/#button");
  await expect(page.getByRole("heading", { level: 1, name: "Button" })).toBeVisible();
  const documentationSkipLink = page.getByRole("link", { name: "Skip to documentation" });
  await expect(page.locator(".system-window--consolidated").locator("a[href], button, input, [tabindex='0']").first()).toHaveClass(/teum-skip-link/);
  await documentationSkipLink.focus();
  await expect(documentationSkipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Documentation content" })).toBeFocused();
});

test("documentation announces in-app route changes without moving desktop focus", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Desktop route changes preserve navigation focus; the mobile drawer has a separate focus handoff.");
  await page.goto("/#button");
  const routeStatus = page.locator(".system-window--consolidated > [role='status'].teum-sr-only");
  await expect(routeStatus).toHaveText("Button page loaded");
  const popoverLink = page.getByRole("link", { name: "Popover", exact: true });
  await popoverLink.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1, name: "Popover" })).toBeVisible();
  await expect(routeStatus).toHaveText("Popover page loaded");
  await expect(popoverLink).toBeFocused();
});

test("mobile navigation hands focus to the selected document", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto("/#button");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Popover", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Popover" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Documentation content" })).toBeFocused();
});

test("every public view owns one main landmark and one page heading", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "The complete landmark scan runs once; shared landmark behavior is covered in every engine.");
  test.slow();
  const routes = [["", "Components for product interfaces."], ...publicRoutes] as const;
  for (const [route, heading] of routes) {
    await page.goto(route ? `/#${route}` : "/");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toHaveCount(1);
  }
});

test("pilot preserves structure in RTL, forced colors, and reduced motion", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/#product-pilot");
  await page.evaluate(() => { document.documentElement.dir = "rtl"; });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("heading", { level: 1, name: "Data" })).toBeVisible();
  await expect(page.getByRole("button", { name: "New issue" })).toBeVisible();
});

test("documentation remains usable at a 200 percent equivalent viewport", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 720 });
  await page.goto("/#product-pilot");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Data" })).toBeVisible();
});

test("all public routes preserve content at a 200 percent equivalent viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "The complete reflow matrix runs once; the shared shell is covered in every engine.");
  test.slow();
  await page.setViewportSize({ width: 640, height: 720 });
  for (const [route, heading] of publicRoutes) {
    await page.goto(`/#${route}`);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route).toBeLessThanOrEqual(1);
  }
});

test("visible keyboard hints stay atomic at desktop and 200 percent equivalent widths", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Shortcut geometry is a CSS contract scanned once across the full catalog.");
  test.slow();
  for (const width of [1280, 640]) {
    await page.setViewportSize({ width, height: 720 });
    for (const [route] of publicRoutes) {
      await page.goto(`/#${route}`);
      const failures = await page.locator("kbd").evaluateAll((elements) => elements.flatMap((element) => {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) return [];
        const range = document.createRange();
        range.selectNodeContents(element);
        const lines = new Set([...range.getClientRects()].map((line) => Math.round(line.top)));
        const style = getComputedStyle(element);
        return lines.size > 1 || element.scrollWidth > element.clientWidth + 1 || style.whiteSpace !== "nowrap"
          ? [{ text: element.textContent, lines: lines.size, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, whiteSpace: style.whiteSpace }]
          : [];
      }));
      expect(failures, `${route} at ${width}px`).toEqual([]);
    }
  }
});

test("representative product surfaces tolerate synthetic translated-content expansion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "The deterministic content-expansion proxy runs once in Chromium.");
  test.slow();
  const routes = [
    ["button", "Button"],
    ["dialog", "Dialog"],
    ["shared-detail", "Shared Detail"],
    ["product-pilot", "Data"],
    ["product-patterns", "Recipes"],
  ] as const;

  for (const width of [1280, 640]) {
    await page.setViewportSize({ width, height: 720 });
    for (const [route, heading] of routes) {
      await page.goto(`/#${route}`);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await page.evaluate(() => {
        const root = document.querySelector<HTMLElement>(".system-detail__scroll");
        if (!root) throw new Error("Documentation content root was not found");
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            const parent = node.parentElement;
            const text = node.textContent?.trim() ?? "";
            if (!parent || text.length < 3 || parent.closest("code, pre, kbd, script, style, svg, [aria-hidden='true']")) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        const nodes: Text[] = [];
        while (walker.nextNode()) nodes.push(walker.currentNode as Text);
        for (const node of nodes) {
          const text = node.textContent?.trim() ?? "";
          const growth = text.length <= 10 ? 1 : text.length <= 20 ? 0.8 : text.length <= 30 ? 0.6 : 0.4;
          const suffix = " localized".repeat(Math.max(1, Math.ceil((text.length * growth) / 10)));
          node.textContent = `${node.textContent}${suffix}`;
        }
      });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route} overflows at ${width}px after content expansion`).toBeLessThanOrEqual(1);
      await expect(page.locator(".system-detail__scroll")).toBeVisible();
    }
  }
});

test("all public routes retain structure in forced colors and reduced motion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "The full forced-color structure scan runs once in Chromium.");
  test.slow();
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  for (const [route, heading] of publicRoutes) {
    await page.goto(`/#${route}`);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${route} overflows in forced colors`).toBeLessThanOrEqual(1);
  }
});

test("keyboard focus returns after a representative menu and dialog path", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith("mobile-"), "The mobile projects do not expose a physical keyboard contract.");
  await page.goto("/#menu");
  const menuTrigger = page.getByRole("button", { name: /More actions/i }).first();
  await menuTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menuTrigger).toBeFocused();

  await page.goto("/#dialog");
  const dialogTrigger = page.getByRole("button", { name: /Edit details|Open dialog/i }).first();
  await dialogTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialogTrigger).toBeFocused();
});

test("component navigation starts the next document at its overview", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Desktop rail navigation has a separate mobile flow.");
  await page.goto("/#button");
  const scroller = page.locator(".system-detail__scroll");
  await scroller.evaluate((element) => { element.scrollTop = 640; });
  await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await page.getByRole("link", { name: "Popover", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Popover" })).toBeVisible();
  await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBe(0);
});
