import { expect, test } from "@playwright/test";

test.skip(({ isMobile }) => !isMobile, "Touch and virtual-keyboard contracts belong to the mobile browser projects.");
import { publicRouteGroups } from "./public-routes";

test("mobile component previews preserve a 24 CSS pixel target floor", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile-"), "This contract belongs to the touch-emulation projects.");
  test.slow();

  for (const [route, heading] of publicRouteGroups.components) {
    await page.goto(`/#${route}`);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const failures = await page.locator([
      ".live-specimen__preview button",
      ".live-specimen__preview input:not([type='hidden'])",
      ".live-specimen__preview textarea",
      ".live-specimen__preview [role='button']",
      ".live-specimen__preview [role='checkbox']",
      ".live-specimen__preview [role='radio']",
      ".live-specimen__preview [role='switch']",
      ".live-specimen__preview [role='tab']",
      ".live-specimen__preview [role='spinbutton']",
    ].join(",")).evaluateAll((elements) => elements.flatMap((element) => {
      const source = element as HTMLElement;
      const sourceBox = source.getBoundingClientRect();
      if (!sourceBox.width || !sourceBox.height || getComputedStyle(source).visibility === "hidden") return [];
      if (source.tabIndex < 0 && !source.getAttribute("aria-label") && !source.textContent?.trim()) return [];

      const after = getComputedStyle(source, "::after");
      if (after.content !== "none" && after.position === "absolute") {
        const inset = (value: string) => Number.parseFloat(value) || 0;
        const pseudoWidth = sourceBox.width - inset(after.left) - inset(after.right);
        const pseudoHeight = sourceBox.height - inset(after.top) - inset(after.bottom);
        if (pseudoWidth >= 24 && pseudoHeight >= 24) return [];
      }

      const compound = source.closest<HTMLElement>([
        "label",
        ".ix-field__control",
        ".ix-date-picker__group",
        ".ix-number-field__group",
        ".ix-choice-row",
        ".ix-checkbox-option",
        ".ix-radio-option",
      ].join(","));
      const target = compound ?? source;
      const box = target.getBoundingClientRect();
      if (box.width >= 24 && box.height >= 24) return [];
      return [{
        tag: source.tagName.toLocaleLowerCase(),
        role: source.getAttribute("role"),
        name: source.getAttribute("aria-label") ?? source.textContent?.trim() ?? "",
        width: Math.round(box.width * 10) / 10,
        height: Math.round(box.height * 10) / 10,
      }];
    }));
    expect(failures, `${route} exposes undersized touch targets`).toEqual([]);
  }
});

test("touch-emulated controls complete representative field, tab, menu, and dialog paths", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile-"), "This contract belongs to the touch-emulation projects.");

  await page.goto("/#text-field");
  const field = page.getByRole("textbox", { name: "Project name" }).first();
  await field.tap();
  await field.fill("Touch contract");
  await expect(field).toHaveValue("Touch contract");

  await page.goto("/#tabs");
  await page.getByRole("tab", { name: "Activity" }).first().tap();
  await expect(page.getByText("Recent activity").first()).toBeVisible();

  await page.goto("/#menu");
  await page.getByRole("button", { name: /More actions/i }).first().tap();
  await expect(page.getByRole("menu")).toBeVisible();
  await page.getByRole("menuitem", { name: /Duplicate/ }).tap();

  await page.goto("/#dialog");
  await page.getByRole("button", { name: "Edit details" }).first().tap();
  const dialog = page.getByRole("dialog", { name: "Edit component metadata" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel" }).tap();
  await expect(dialog).not.toBeVisible();
});

test("focused text input survives a virtual-keyboard viewport proxy", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile-"), "This contract belongs to the touch-emulation projects.");
  await page.goto("/#text-field");
  const field = page.getByRole("textbox", { name: "Project name" }).first();
  await field.tap();
  await page.setViewportSize({ width: 390, height: 320 });
  await field.scrollIntoViewIfNeeded();
  const box = await field.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(320);
  await expect(field).toBeFocused();
});
