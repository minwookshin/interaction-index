import { expect, test } from "@playwright/test";

async function measureBrowserCommit(
  page: import("@playwright/test").Page,
  triggerText: string,
  target: { kind: "heading"; text: string } | { kind: "dialog" },
) {
  await page.getByRole("button", { name: new RegExp(triggerText) }).waitFor({ state: "visible" });
  return page.evaluate(({ triggerText, target }) => new Promise<number>((resolve, reject) => {
    const trigger = [...document.querySelectorAll<HTMLButtonElement>("button")]
      .find((button) => button.textContent?.includes(triggerText));
    if (!trigger) {
      reject(new Error(`Could not find the interaction trigger: ${triggerText}`));
      return;
    }

    const targetIsReady = () => {
      if (target.kind === "dialog") return Boolean(document.querySelector('[role="dialog"]'));
      return [...document.querySelectorAll<HTMLElement>("h1, h2, h3")]
        .some((heading) => heading.textContent?.trim() === target.text);
    };

    const start = performance.now();
    const deadline = start + 2_000;
    trigger.click();

    const inspect = () => {
      if (targetIsReady()) {
        resolve(performance.now() - start);
        return;
      }
      if (performance.now() >= deadline) {
        reject(new Error(`The ${target.kind} target did not commit within 2000ms`));
        return;
      }
      requestAnimationFrame(inspect);
    };

    inspect();
  }), { triggerText, target });
}

test("product pilot supports create, edit, archive, and recovery", async ({ page }) => {
  await page.goto("/#product-pilot");
  await expect(page.getByRole("heading", { level: 1, name: "Data" })).toBeVisible({ timeout: 15_000 });

  await page.getByRole("button", { name: "New issue" }).click();
  await page.getByRole("textbox", { name: "Title" }).fill("Verify composed product flow");
  await page.getByRole("textbox", { name: "Description" }).fill("Exercise the public system inside one realistic task.");
  await page.getByRole("button", { name: "Create issue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Verify composed product flow" })).toBeVisible();

  const issueActions = page.getByRole("button", { name: "More issue actions" });
  await expect(issueActions).toHaveCount(1);
  await issueActions.click();
  await page.getByRole("menuitem", { name: "Archive issue" }).click();
  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("heading", { name: "Verify composed product flow" })).toBeVisible();
});

test("product pilot selection responds within the interaction budget", async ({ page, isMobile }) => {
  await page.goto("/#product-pilot");
  if (isMobile) await page.getByRole("button", { name: "Back to list" }).click();
  const selectionMs = await measureBrowserCommit(page, "Tune shared detail motion", {
    kind: "heading",
    text: "Tune shared detail motion",
  });
  await expect(page.getByRole("heading", { name: "Tune shared detail motion" })).toBeVisible();
  console.log(`[pilot-performance] shared-detail selection: ${selectionMs}ms`);
  expect(selectionMs).toBeLessThan(750);

  const overlayMs = await measureBrowserCommit(page, "New issue", { kind: "dialog" });
  await expect(page.getByRole("dialog", { name: "Create issue" })).toBeVisible();
  console.log(`[pilot-performance] dialog open: ${overlayMs}ms`);
  expect(overlayMs).toBeLessThan(750);
});

test("authored task composes Action List, Shared Detail, and Undo Stack", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "The Command K proof path targets a hardware keyboard; the pointer trigger remains available on mobile.");
  await page.goto("/#product-pilot");
  await page.getByRole("button", { name: /Tune shared detail motion/ }).click();
  await expect(page.getByRole("heading", { name: "Tune shared detail motion" })).toBeVisible();

  await page.keyboard.press("Meta+K");
  await expect(page.getByRole("dialog", { name: "Act on INT-198" })).toBeVisible();
  const actionSearch = page.getByRole("combobox", { name: "Search actions" });
  await expect(actionSearch).toBeFocused();
  await actionSearch.fill("archive");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tune shared detail motion" })).not.toBeVisible();

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("heading", { name: "Tune shared detail motion" })).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "Choose Undo" })).toHaveAttribute("data-complete", "true");
});

test("whatiuse Data compares, selects, mutates, and recovers the same collection", async ({ page }) => {
  await page.goto("/#product-pilot");
  await page.getByRole("tab", { name: "Cycle" }).click();

  const table = page.getByRole("table", { name: "Active cycle issues" });
  await expect(table).toBeVisible();
  const motionRow = table.getByRole("row").filter({ hasText: "Tune shared detail motion" });
  await motionRow.getByRole("checkbox", { name: /Select INT-198/ }).click();
  const bulkActions = page.getByRole("region", { name: "Bulk actions" });
  await expect(bulkActions).toContainText("1 issue selected");

  await bulkActions.getByRole("button", { name: "Archive" }).click();
  await expect(motionRow).not.toBeVisible();
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(table.getByRole("row").filter({ hasText: "Tune shared detail motion" })).toBeVisible();

  await page.getByRole("button", { name: /Saved views: All issues/ }).click();
  await page.getByRole("menuitemradio", { name: /Completed/ }).click();
  await expect(page.getByText("1 visible")).toBeVisible();
  await expect(table.getByRole("row").filter({ hasText: "Verify registry consumer" })).toBeVisible();
});

test("whatiuse Data keeps keyboard selection instant under reduced motion", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "The input-modality contract requires a physical keyboard path.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#product-pilot");
  await page.getByRole("tab", { name: "Cycle" }).click();

  const checkbox = page.getByRole("checkbox", { name: /Select INT-198/ });
  await checkbox.focus();
  await page.keyboard.press("Space");

  const bulkActions = page.getByRole("region", { name: "Bulk actions" });
  await expect(bulkActions).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-input-modality", "keyboard");
  const motion = await bulkActions.evaluate((element) => {
    const style = getComputedStyle(element);
    return { transform: style.transform, transitionDuration: style.transitionDuration };
  });
  expect(motion.transform).toBe("none");
  expect(motion.transitionDuration).toBe("0s");
});

test("Customer Directory keeps server state shareable and personal views persistent", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/#product-pilot/customer-directory");

  const search = page.getByRole("searchbox", { name: "Search customers" });
  await search.fill("Arc 12");
  await expect(page).toHaveURL(/customers-q=Arc(?:\+|%20)12/);
  await expect(page.getByRole("table", { name: "Customer Directory" }).getByRole("row")).not.toHaveCount(1);

  await page.getByRole("button", { name: "Saved views: All customers" }).click();
  await page.getByRole("menuitem", { name: "Save as new view" }).click();
  await page.getByRole("textbox", { name: "View name" }).fill("Arc review");
  await page.getByRole("button", { name: "Save view", exact: true }).click();
  await expect(page.getByRole("button", { name: "Saved views: Arc review" })).toBeVisible();

  const persisted = await page.evaluate(() => window.localStorage.getItem("whatiuse:data:customer-views:v1"));
  expect(persisted).toContain("Arc review");
  await page.reload({ waitUntil: "domcontentloaded" });
  const restoredView = page.getByRole("button", { name: "Saved views: Arc review" });
  await expect(restoredView).toBeVisible({ timeout: 45_000 });
  await restoredView.click();
  await expect(page.getByRole("menuitemradio", { name: /Arc review/ })).toBeVisible();
});

test("Audit Log virtualizes ten thousand rows and exposes export choices", async ({ page }) => {
  await page.goto("/#product-pilot/audit-log");

  const dateRange = page.getByRole("button", { name: /^Occurred:/ });
  await dateRange.click();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByText("10,000 events", { exact: true })).toBeVisible();

  const table = page.getByRole("table", { name: "Audit Log" });
  const rows = table.getByRole("row");
  const renderedBefore = await rows.count();
  expect(renderedBefore).toBeGreaterThan(8);
  expect(renderedBefore).toBeLessThan(60);
  const firstRowBefore = await rows.nth(1).innerText();

  const viewport = page.locator(".whatiuse-data-table__virtual-viewport");
  await viewport.evaluate((element) => {
    element.scrollTop = element.scrollHeight / 2;
    element.dispatchEvent(new Event("scroll", { bubbles: true }));
  });
  await expect.poll(async () => rows.nth(1).innerText()).not.toBe(firstRowBefore);
  expect(await rows.count()).toBeLessThan(60);

  await page.getByRole("button", { name: "Export", exact: true }).last().click();
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitem", { name: "Export all rows as CSV" })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Export all rows as JSON" })).toBeVisible();
});
