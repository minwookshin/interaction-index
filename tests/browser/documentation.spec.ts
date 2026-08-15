import { expect, test } from "@playwright/test";
import { publicRoutes } from "./public-routes";

test("every public documentation route renders without viewport overflow", async ({ page }) => {
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

test("desktop navigation disclosures and theme persistence work", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop disclosure behavior is covered separately from the mobile drawer.");
  await page.goto("/#introduction");

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
  const systemCoverage = outline.getByRole("button", { name: "System coverage" });
  await systemCoverage.click();
  await expect(systemCoverage).toHaveAttribute("aria-current", "location");
  await expect(outline.getByText("03 / 04")).toBeVisible();
});

test("mobile navigation opens, routes, and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile drawer behavior only applies to mobile projects.");
  await page.goto("/#introduction");

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
