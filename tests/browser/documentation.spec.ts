import { expect, test } from "@playwright/test";

const routes = [
  ["introduction", "Introduction"],
  ["installation", "Installation"],
  ["choosing-components", "Choosing components"],
  ["product-pilot", "Product pilot"],
  ["foundations", "Foundations"],
  ["foundation-color", "Color"],
  ["foundation-typography", "Typography"],
  ["foundation-spacing", "Spacing"],
  ["foundation-motion", "Motion"],
  ["button", "Button"],
  ["icon-button", "Icon Button"],
  ["text-field", "Text Field"],
  ["textarea", "Textarea"],
  ["checkbox", "Checkbox"],
  ["radio-group", "Radio Group"],
  ["switch", "Switch"],
  ["select", "Select"],
  ["combobox", "Combobox"],
  ["search-input", "Search Input"],
  ["number-field", "Number Field"],
  ["segmented-control", "Segmented Control"],
  ["tooltip", "Tooltip"],
  ["popover", "Popover"],
  ["menu", "Menu"],
  ["dialog", "Dialog"],
  ["alert-dialog", "Alert Dialog"],
  ["tabs", "Tabs"],
  ["breadcrumbs", "Breadcrumbs"],
  ["pagination", "Pagination"],
  ["collapsible", "Collapsible"],
  ["toast", "Toast"],
  ["progress", "Progress"],
  ["spinner", "Spinner"],
  ["skeleton", "Skeleton"],
  ["alert", "Alert"],
  ["empty-state", "Empty State"],
  ["badge", "Badge"],
  ["avatar", "Avatar"],
  ["table", "Table"],
  ["inline-edit", "Inline Edit"],
  ["action-list", "Action List"],
  ["shared-detail", "Shared Detail"],
  ["undo-stack", "Undo Stack"],
  ["patterns", "Interaction patterns"],
  ["edit-in-place", "Edit in place"],
  ["find-and-act", "Find and act"],
  ["preserve-context", "Preserve context"],
  ["recover-from-action", "Recover from action"],
  ["accessibility", "Accessibility"],
  ["browser-support", "Browser support"],
  ["security", "Security"],
  ["contributing", "Contributing"],
  ["releases", "Releases"],
  ["licensing", "Licensing"],
] as const;

test("every public documentation route renders without viewport overflow", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  for (const [route, heading] of routes) {
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
  const components = navigation.getByRole("button", { name: "Components 35", exact: true });
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
  const components = navigation.getByRole("button", { name: "Components 35", exact: true });
  if (await components.getAttribute("aria-expanded") === "false") await components.click();
  await page.getByRole("link", { name: "Button", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Button" })).toBeVisible();
  await expect(navigation).not.toHaveAttribute("data-open", "true");
});
