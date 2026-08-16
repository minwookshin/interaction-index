import { expect, test } from "@playwright/test";

const stories = [
  ["components-controls--button", "Button"],
  ["components-controls--icon-button", "Icon Button"],
  ["components-controls--field", "Field & Fieldset"],
  ["components-controls--input-group", "Input Group"],
  ["components-controls--kbd", "Kbd"],
  ["components-controls--button-group", "Button Group"],
  ["components-controls--toolbar", "Toolbar"],
  ["components-controls--text-field", "Text Field"],
  ["components-controls--textarea", "Textarea"],
  ["components-controls--checkbox", "Checkbox"],
  ["components-controls--radio-group", "Radio Group"],
  ["components-controls--switch", "Switch"],
  ["components-controls--select", "Select"],
  ["components-controls--context-switcher", "Context Switcher"],
  ["components-controls--combobox", "Combobox"],
  ["components-controls--search-input", "Search Input"],
  ["components-controls--number-field", "Number Field"],
  ["components-controls--date-picker", "Calendar & Date Picker"],
  ["components-controls--segmented-control", "Segmented Control"],
  ["components-overlays--tooltip", "Tooltip"],
  ["components-overlays--popover", "Popover"],
  ["components-overlays--menu", "Menu"],
  ["components-overlays--context-menu", "Context Menu"],
  ["components-overlays--dialog", "Dialog"],
  ["components-overlays--sheet", "Sheet"],
  ["components-overlays--alert-dialog", "Alert Dialog"],
  ["components-navigation--tabs", "Tabs"],
  ["components-navigation--breadcrumbs", "Breadcrumbs"],
  ["components-navigation--pagination", "Pagination"],
  ["components-disclosure--collapsible", "Collapsible"],
  ["components-feedback--toast", "Toast"],
  ["components-feedback--progress", "Progress"],
  ["components-feedback--spinner", "Spinner"],
  ["components-feedback--skeleton", "Skeleton"],
  ["components-feedback--alert", "Alert"],
  ["components-feedback--empty-state", "Empty State"],
  ["components-data-display--badge", "Badge"],
  ["components-data-display--avatar", "Avatar"],
  ["components-data-display--table", "Table"],
  ["components-data-display--tree", "Tree"],
  ["components-interaction--inline-edit", "Inline Edit"],
  ["components-interaction--reorderable-list", "Reorderable List"],
  ["components-interaction--action-list", "Action List"],
  ["components-interaction--shared-detail", "Shared Detail"],
  ["components-interaction--undo-stack", "Undo Stack"],
] as const;

async function openStory(page: import("@playwright/test").Page, id: string, heading: string, theme: "light" | "dark") {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await expect(page.locator(`[data-component-id="${id.split("--")[1]}"]`)).toBeVisible();
  await expect(page.locator("[data-story-ready='true']")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  const states = page.locator("[data-story-state]");
  await states.last().scrollIntoViewIfNeeded();
  await expect(states.last()).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.fonts.ready);
}

for (const [id, heading] of stories) {
  test(`${heading} state contract remains visually stable in light`, async ({ page }) => {
    await openStory(page, id, heading, "light");
    await expect(page.locator(".story-contract__stage")).toHaveScreenshot(`${id}-light-product.png`, { animations: "disabled" });
    await expect(page.locator(".story-contract__state-grid")).toHaveScreenshot(`${id}-light-states.png`, { animations: "disabled" });
  });

  test(`${heading} state contract remains visually stable in dark`, async ({ page }) => {
    await openStory(page, id, heading, "dark");
    await expect(page.locator(".story-contract__stage")).toHaveScreenshot(`${id}-dark-product.png`, { animations: "disabled" });
    await expect(page.locator(".story-contract__state-grid")).toHaveScreenshot(`${id}-dark-states.png`, { animations: "disabled" });
  });
}
