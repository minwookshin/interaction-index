import { expect, test } from "@playwright/test";
import { publicRoutes } from "./public-routes";

test("every public documentation route renders without viewport overflow", async ({ page }) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  for (const [route, heading] of publicRoutes) {
    await page.goto(`/#${route}`);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${route} has horizontal viewport overflow`).toBeLessThanOrEqual(1);
  }

  expect(errors).toEqual([]);
});

test("installation opens with verified Vite, Next.js, and update paths", async ({ page, isMobile }) => {
  await page.goto("/#installation");

  const quickstart = page.locator("#quickstart");
  await expect(quickstart.getByRole("heading", { level: 2, name: "Choose a path" })).toBeVisible();
  await expect(quickstart.getByText("Vite — React 18 and 19", { exact: false })).toBeVisible();
  await expect(quickstart.getByText("Next.js 16.3.1", { exact: false })).toBeVisible();
  await expect(quickstart.getByText("Registry update — dry-run", { exact: false })).toBeVisible();

  await expect(page.locator("#vite").getByText("npx shadcn@4.18.0 add @teum-pinned/button", { exact: true })).toBeVisible();
  await expect(page.locator("#next").getByText("npx shadcn@4.18.0 add @teum-pinned/button", { exact: true })).toBeVisible();
  await expect(page.locator("#update").getByText("--dry-run", { exact: false })).toBeVisible();

  const overflowingCodeBlocks = await page.locator(".public-doc-code pre").evaluateAll((blocks) =>
    blocks.filter((block) => block.scrollWidth - block.clientWidth > 1).length,
  );
  expect(overflowingCodeBlocks).toBe(0);

  if (!isMobile) {
    const outline = page.getByRole("complementary", { name: "Page outline" });
    await expect(outline.getByRole("button", { name: "Choose a path" })).toHaveAttribute("aria-current", "location");
    await expect(outline.getByText("01 / 08")).toBeVisible();
  }
});

test("desktop navigation disclosures and theme persistence work", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop disclosure behavior is covered separately from the mobile drawer.");
  await page.goto("/#installation");

  const navigation = page.getByRole("complementary", { name: "Design system navigation" });
  const components = navigation.getByRole("button", { name: /^Components \d+$/ });
  await expect(components).toHaveAttribute("aria-expanded", "false");
  await components.click();
  await expect(page.getByRole("region", { name: "Component catalog" })).toBeVisible();
  await components.click();
  await expect(components).toHaveAttribute("aria-expanded", "false");

  await page.getByRole("button", { name: "Current theme: light. Switch to dark theme" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Current theme: dark. Switch to light theme" })).toBeVisible();
});

test("desktop page outline keeps the requested section current", async ({ page, isMobile }) => {
  test.skip(isMobile, "The persistent page outline is a desktop affordance.");
  await page.goto("/#product-pilot");
  const outline = page.getByRole("complementary", { name: "Page outline" });
  const auditLog = outline.getByRole("button", { name: "Audit Log" });
  await auditLog.click();
  await expect(auditLog).toHaveAttribute("aria-current", "location");
  await expect(outline.getByText("03 / 06")).toBeVisible();
  await expect(page).toHaveURL(/#product-pilot\/audit-log$/);
});

test("documentation section links open at the requested section", async ({ page, isMobile }) => {
  test.skip(isMobile, "The persistent outline is replaced by the mobile reading flow.");
  await page.goto("/#installation/troubleshooting");

  const outline = page.getByRole("complementary", { name: "Page outline" });
  const troubleshooting = outline.getByRole("button", { name: "Troubleshooting" });
  await expect(page.getByRole("heading", { level: 2, name: "Common failures" })).toBeVisible();
  await expect(troubleshooting).toHaveAttribute("aria-current", "location");
  await expect.poll(() => page.locator(".system-detail__scroll").evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
});

test("documentation search includes section labels", async ({ page, isMobile }) => {
  test.skip(isMobile, "Mobile Command K drawer behavior is covered by the navigation task.");
  await page.goto("/#button");
  const search = page.getByRole("textbox", { name: "Search documentation" });
  await search.fill("theme");
  const results = page.getByRole("region", { name: "Documentation search results" });
  await expect(results.getByRole("link", { name: "Installation" })).toBeVisible();
  await expect(results.getByRole("link", { name: "Button", exact: true })).toHaveCount(0);
});

test("component reference exposes a real registry item and compiler-derived primary export", async ({ page }) => {
  await page.goto("/#field/system-api");
  await expect(page).toHaveTitle("Field & Fieldset — Teum");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Accessible form structure/);
  await expect(page.getByText("npx shadcn@4.18.0 add @teum-pinned/field", { exact: true })).toBeVisible();
  const summary = page.getByRole("region", { name: "Field & Fieldset reference summary" });
  await expect(summary.getByText("Primary export")).toBeVisible();
  await expect(summary.getByText("Field", { exact: true })).toBeVisible();
  await expect(summary.getByText("@teum-pinned/field", { exact: true })).toBeVisible();
});

test("mobile navigation opens, routes, and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile drawer behavior only applies to mobile projects.");
  await page.goto("/#installation");

  await page.getByRole("button", { name: "Open navigation" }).click();
  const navigation = page.getByRole("complementary", { name: "Design system navigation" });
  await expect(navigation).toHaveAttribute("data-open", "true");
  const components = navigation.getByRole("button", { name: /^Components \d+$/ });
  if (await components.getAttribute("aria-expanded") === "false") await components.click();
  await page.getByRole("link", { name: "Button", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Button" })).toBeVisible();
  await expect(navigation).not.toHaveAttribute("data-open", "true");
});

test("live state inspection uses the system menu without leaving pointer focus chrome", async ({ page }) => {
  await page.goto("/#button");
  await page.getByRole("button", { name: "State", exact: true }).click();

  const trigger = page.getByRole("button", { name: /Preview state:/ });
  const restingShadow = await trigger.evaluate((element) => getComputedStyle(element).boxShadow);
  const triggerBox = await trigger.boundingBox();
  await trigger.click();

  const menu = page.getByRole("menu", { name: "Preview state: Default" });
  await expect(menu).toBeVisible();
  const menuBox = await menu.boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(menuBox).not.toBeNull();
  expect(menuBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 1);
  await expect(menu.getByRole("menuitemradio", { name: "Default", exact: true })).toHaveAttribute("aria-checked", "true");

  await menu.getByRole("menuitemradio", { name: "Pressed", exact: true }).click();
  await expect(trigger).toHaveAccessibleName("Preview state: Pressed");
  await expect(page.locator("html")).toHaveAttribute("data-input-modality", "pointer");
  await expect(trigger).toHaveCSS("outline-style", "none");
  await expect(trigger).toHaveCSS("box-shadow", restingShadow);
});

test("text-field recipe keeps a compact complete grid and quiet pointer focus", async ({ page, isMobile }) => {
  test.skip(isMobile, "The compact two-column recipe contract is a desktop layout; mobile stacking is covered by route reflow checks.");
  await page.goto("/#text-field");
  const form = page.getByRole("form", { name: "Project settings form" });
  const project = form.getByRole("textbox", { name: "Project name" });
  const identifier = form.getByRole("textbox", { name: "Identifier" });
  const workspace = form.getByRole("textbox", { name: "Workspace key" });
  const search = form.getByRole("textbox", { name: "Search", exact: true });
  const readOnly = form.getByRole("textbox", { name: "Read only" });
  const [projectBox, identifierBox, workspaceBox, searchBox, readOnlyBox] = await Promise.all([
    project.boundingBox(),
    identifier.boundingBox(),
    workspace.boundingBox(),
    search.boundingBox(),
    readOnly.boundingBox(),
  ]);

  for (const box of [projectBox, identifierBox, workspaceBox, searchBox, readOnlyBox]) expect(box).not.toBeNull();
  expect(projectBox!.width).toBeGreaterThan(identifierBox!.width * 1.8);
  expect(Math.abs(identifierBox!.y - workspaceBox!.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(searchBox!.y - readOnlyBox!.y)).toBeLessThanOrEqual(1);
  expect(identifierBox!.x).toBeLessThan(workspaceBox!.x);
  expect(searchBox!.x).toBeLessThan(readOnlyBox!.x);

  const control = search.locator("xpath=..");
  const restingBorder = await control.evaluate((element) => getComputedStyle(element).borderColor);
  await search.click();
  await expect(page.locator("html")).toHaveAttribute("data-input-modality", "pointer");
  await expect(control).toHaveCSS("border-color", restingBorder);
});
