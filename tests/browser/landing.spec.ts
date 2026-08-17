import { expect, test } from "@playwright/test";

test("landing provides one clear route into documentation", async ({ page, isMobile }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Interfaces that stay clear through change." })).toBeVisible();
  await expect(page.getByRole("link", { name: "View Teum on GitHub" })).toHaveAttribute("href", "https://github.com/minwookshin/teum");
  await expect(page.getByRole("button", { name: "Copy Teum install command" })).toContainText("npx shadcn@4.18.0 add minwookshin/teum/teum#v0.1.0-rc.22");
  await expect(page.getByRole("link", { name: "made by minwook" })).toHaveAttribute("href", "https://www.minwookshin.com/");
  const documentationLink = isMobile
    ? page.getByRole("link", { name: "Open documentation" })
    : page.getByRole("link", { name: "Documentation", exact: true });
  if (!isMobile) await expect(documentationLink).toHaveCount(1);
  await documentationLink.click();

  await expect(page).toHaveURL(/#installation$/);
  await expect(page.getByRole("heading", { level: 1, name: "Installation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Introduction" })).toHaveCount(0);
  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Teum home" }).click();
  await expect(page).not.toHaveURL(/#/);
});

test("desktop public header keeps identical geometry across the documentation transition", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "The compact shell intentionally replaces the wordmark with its navigation trigger.");
  await page.setViewportSize({ width: 1766, height: 900 });
  await page.goto("/");

  const rect = async (selector: string) => page.locator(selector).evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right };
  });
  const landing = {
    brand: await rect(".landing-header .teum-wordmark"),
    documentation: await rect(".landing-header__documentation"),
    actions: await rect(".landing-header__actions"),
  };

  await page.getByRole("link", { name: "Open documentation" }).click();
  await expect(page).toHaveURL(/#installation$/);
  const documentation = {
    brand: await rect(".system-brand__home"),
    documentation: await rect(".system-topbar__title"),
    actions: await rect(".system-topbar__actions"),
  };

  for (const key of ["brand", "documentation", "actions"] as const) {
    expect(Math.abs(documentation[key].x - landing[key].x), `${key} x coordinate moved`).toBeLessThanOrEqual(0.5);
    expect(Math.abs(documentation[key].y - landing[key].y), `${key} y coordinate moved`).toBeLessThanOrEqual(0.5);
    expect(Math.abs(documentation[key].width - landing[key].width), `${key} width changed`).toBeLessThanOrEqual(0.5);
    expect(Math.abs(documentation[key].height - landing[key].height), `${key} height changed`).toBeLessThanOrEqual(0.5);
    expect(Math.abs(documentation[key].right - landing[key].right), `${key} trailing edge moved`).toBeLessThanOrEqual(0.5);
  }
});

test("landing proof and theme controls expose working states", async ({ page }) => {
  await page.goto("/");

  const actionListTab = page.getByRole("tab", { name: "Action List" });
  await actionListTab.click();
  await expect(actionListTab).toHaveAttribute("aria-selected", "true");

  await page.getByRole("button", { name: /Restore deleted comment focus/ }).first().click();
  await expect(page.getByRole("heading", { level: 2, name: "Restore deleted comment focus" })).toBeVisible();

  const statusControl = page.getByRole("button", { name: "Change issue status, currently Open" });
  await statusControl.click();
  await expect(page.getByRole("button", { name: "Change issue status, currently In progress" })).toBeVisible();

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
});

test("landing has no horizontal overflow at a compact mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const overflow = await page.locator(".teum-landing").evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("link", { name: "View Teum on GitHub" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
});

test("command K moves focus to documentation search", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "The compact mobile shell uses its own navigation trigger.");
  await page.goto("/");

  await page.keyboard.press("Meta+K");
  await expect(page).toHaveURL(/#installation$/);
  await expect(page.getByRole("textbox", { name: "Search documentation" })).toBeFocused();
});

test("landing publishes complete discovery and social metadata", async ({ page, request }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Teum — Interfaces that stay clear through change");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://teum.minwookshin.com");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://teum.minwookshin.com/social-preview.jpg");
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");

  for (const asset of ["/favicon.svg", "/apple-touch-icon.png", "/site.webmanifest", "/robots.txt", "/sitemap.xml", "/social-preview.jpg"]) {
    const response = await request.get(asset);
    expect(response.ok(), `${asset} should resolve`).toBe(true);
  }
});
