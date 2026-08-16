import { expect, test } from "@playwright/test";

async function measureBrowserCommit(
  page: import("@playwright/test").Page,
  triggerText: string,
  target: { kind: "heading"; text: string } | { kind: "dialog" },
) {
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
  await expect(page.getByRole("heading", { level: 1, name: "Product pilot" })).toBeVisible();

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
