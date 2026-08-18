import { expect, test } from "@playwright/test";

test("public root opens directly into the component Library", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Components for product interfaces." })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Library" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View Teum on GitHub" })).toHaveAttribute("href", "https://github.com/minwookshin/teum");
  await expect(page.getByRole("button", { name: "Copy Teum install command" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "made by minwook" })).toHaveAttribute("href", "https://www.minwookshin.com/");
  await expect(page.locator(".component-index-row")).toHaveCount(39);
  await expect(page.locator('.component-index-row[data-component="kbd"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Introduction" })).toHaveCount(0);
  const wordmark = page.getByRole("link", { name: "whatiuse home" });
  await expect(wordmark).toHaveText("whatiuse");
  await expect(wordmark.locator("svg")).toHaveCount(0);
  await wordmark.click();
  await expect(page).not.toHaveURL(/#/);
});

test("component catalog filters, previews, and opens code without nesting controls", async ({ page }) => {
  await page.goto("/#components");

  await expect(page.locator(".component-index-row")).toHaveCount(39);
  await expect(page.getByRole("button", { name: "Interaction", exact: true })).toHaveCount(0);
  await expect(page.locator('.component-index-row[data-component="reorderable-list"]')).toHaveCount(0);
  await expect(page.locator('.component-index-row[data-component="inline-edit"]')).toHaveCount(0);
  await expect(page.locator('.component-index-row[data-component="action-list"]')).toHaveCount(0);
  await expect(page.locator('.component-index-row[data-component="shared-detail"]')).toHaveCount(0);
  await expect(page.locator('.component-index-row[data-component="undo-stack"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Copy Button install command" })).toBeVisible();
  await expect(page.locator(".component-index-row a button")).toHaveCount(0);

  await page.getByRole("button", { name: "Overlays", exact: true }).click();
  await expect(page.locator(".component-index-row")).toHaveCount(7);
  const popoverCard = page.locator('.component-index-row[data-component="popover"]');
  await popoverCard.scrollIntoViewIfNeeded();
  await popoverCard.getByRole("button", { name: "View", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "View options" })).toBeVisible();
  await page.keyboard.press("Escape");

  const search = page.getByRole("textbox", { name: "Search components" });
  await search.fill("toast");
  await expect(page.locator(".component-index-row")).toHaveCount(0);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(".component-index-row")).toHaveCount(1);
  await page.getByRole("link", { name: "Open Toast code" }).click();
  await expect(page).toHaveURL(/#components\/toast$/);
  const inspector = page.getByRole("dialog", { name: "Toast" });
  await expect(inspector).toBeVisible();
  await expect(inspector.getByRole("tab", { name: "Source" })).toHaveAttribute("aria-selected", "true");
  await expect(inspector.getByRole("button", { name: "Copy Toast source" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(inspector).toBeHidden();
  await expect(page).toHaveURL(/#components$/);
});

test("component catalog keeps compact 16:10 previews in a two-column desktop grid", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/#components");

  const controlsGrid = page.locator(".component-index-group ul").first();
  const columnCount = () => controlsGrid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);

  await expect.poll(columnCount).toBe(2);
  const previewBox = await page.locator('.component-index-row[data-component="button"] .component-index-preview').boundingBox();
  expect(previewBox).not.toBeNull();
  expect(Math.abs((previewBox!.width / previewBox!.height) - (16 / 10))).toBeLessThanOrEqual(0.01);
  const buttonCard = page.locator('.component-index-row[data-component="button"]');
  const cardBox = await buttonCard.boundingBox();
  const copyBox = await buttonCard.getByRole("button", { name: "Copy Button install command" }).boundingBox();
  expect(cardBox).not.toBeNull();
  expect(copyBox).not.toBeNull();
  const trailingInset = cardBox!.x + cardBox!.width - (copyBox!.x + copyBox!.width);
  const bottomInset = cardBox!.y + cardBox!.height - (copyBox!.y + copyBox!.height);
  expect(trailingInset).toBeCloseTo(bottomInset, 1);
  await page.locator('.component-index-row[data-component="button"]').hover();
  await expect(page.locator('.component-index-row[data-component="button"]')).toHaveCSS("transform", "none");

  await page.setViewportSize({ width: 900, height: 720 });
  await expect.poll(columnCount).toBe(2);

  await page.setViewportSize({ width: 760, height: 720 });
  await expect.poll(columnCount).toBe(2);

  await page.setViewportSize({ width: 759, height: 720 });
  await expect.poll(columnCount).toBe(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(columnCount).toBe(1);
});

test("compact form and tree previews stay bounded in their card stages", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/#components");

  const numberFieldCard = page.locator('.component-index-row[data-component="number-field"]');
  await numberFieldCard.scrollIntoViewIfNeeded();
  const numberField = numberFieldCard.locator(".teum-number-field");
  await expect(numberField).toBeVisible();
  const numberBox = await numberField.boundingBox();
  expect(numberBox).not.toBeNull();
  expect(numberBox!.width).toBeLessThanOrEqual(116);

  const textareaCard = page.locator('.component-index-row[data-component="textarea"]');
  await textareaCard.scrollIntoViewIfNeeded();
  const textareaStage = textareaCard.locator(".component-index-preview");
  const textarea = textareaCard.getByRole("textbox", { name: "Description" });
  await expect(textarea).toBeVisible();
  await textarea.evaluate((element) => { (element as HTMLElement).style.height = "999px"; });
  const textareaStageBox = await textareaStage.boundingBox();
  const textareaBox = await textarea.boundingBox();
  expect(textareaStageBox).not.toBeNull();
  expect(textareaBox).not.toBeNull();
  expect(textareaBox!.y + textareaBox!.height).toBeLessThanOrEqual(textareaStageBox!.y + textareaStageBox!.height + 1);

  const treeCard = page.locator('.component-index-row[data-component="tree"]');
  await treeCard.scrollIntoViewIfNeeded();
  await treeCard.getByRole("button", { name: /Components/ }).click();
  await expect(treeCard.getByText("Controls", { exact: true })).toBeVisible();
  await expect(treeCard.getByText("Data display", { exact: true })).toHaveCount(0);
  await expect(treeCard.getByText("Overlays", { exact: true })).toHaveCount(0);
  const treeStageBox = await treeCard.locator(".component-index-preview").boundingBox();
  const treeBox = await treeCard.locator(".teum-tree").boundingBox();
  expect(treeStageBox).not.toBeNull();
  expect(treeBox).not.toBeNull();
  expect(treeBox!.y + treeBox!.height).toBeLessThanOrEqual(treeStageBox!.y + treeStageBox!.height + 1);
});

test("wordmark moves from the first-viewport center into the sticky header", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const geometry = () => page.locator(".whatiuse-wordmark").evaluate((element) => {
    const box = element.getBoundingClientRect();
    return {
      centerX: box.left + box.width / 2,
      centerY: box.top + box.height / 2,
      width: box.width,
    };
  });
  const actionsBefore = await page.locator(".landing-header__actions").boundingBox();
  const initial = await geometry();
  expect(Math.abs(initial.centerX - 640)).toBeLessThanOrEqual(0.5);
  expect(initial.centerY).toBeCloseTo(360, 1);
  expect(initial.width).toBeGreaterThan(240);
  await expect(page.getByRole("heading", { level: 1, name: "Components for product interfaces." })).toBeInViewport();

  await page.locator(".component-index-page").evaluate((element) => element.scrollTo({ top: 500, behavior: "instant" }));
  await expect.poll(async () => (await geometry()).centerY).toBeCloseTo(32, 1);
  const docked = await geometry();
  expect(Math.abs(docked.centerX - 640)).toBeLessThanOrEqual(0.5);
  expect(docked.width).toBeCloseTo(60.125, 1);

  const actionsAfter = await page.locator(".landing-header__actions").boundingBox();
  expect(actionsAfter?.x).toBeCloseTo(actionsBefore!.x, 1);
  expect(actionsAfter?.y).toBeCloseTo(actionsBefore!.y, 1);
});

test("reduced motion keeps the identity in both places without spatial travel", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const docked = await page.locator(".whatiuse-wordmark").boundingBox();
  const staticHero = await page.locator(".component-index-intro__static-wordmark").boundingBox();
  expect(docked).not.toBeNull();
  expect(staticHero).not.toBeNull();
  expect(docked!.y + docked!.height / 2).toBeCloseTo(32, 1);
  expect(staticHero!.y + staticHero!.height / 2).toBeCloseTo(360, 1);

  await page.locator(".component-index-page").evaluate((element) => element.scrollTo({ top: 500, behavior: "instant" }));
  const dockedAfterScroll = await page.locator(".whatiuse-wordmark").boundingBox();
  expect(dockedAfterScroll!.y + dockedAfterScroll!.height / 2).toBeCloseTo(32, 1);
});

test("every catalog card renders its live preview inside the enlarged stage", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("requestfailed", (request) => runtimeErrors.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText ?? "failed"}`));

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/#components");

  const catalog = page.locator(".component-index-page");
  const scrollHeight = await catalog.evaluate((element) => element.scrollHeight);
  for (let top = 0; top < scrollHeight; top += 520) {
    await catalog.evaluate((element, nextTop) => element.scrollTo({ top: nextTop, behavior: "instant" }), top);
    await page.waitForTimeout(70);
  }

  await expect(page.locator(".component-index-preview__loading")).toHaveCount(0);
  const overflow = await page.locator(".component-index-preview").evaluateAll((previews) => previews.flatMap((preview) => {
    const stage = preview.getBoundingClientRect();
    const visibleChildren = Array.from(preview.children).filter((child) => (
      !child.classList.contains("component-index-preview__loading")
      && child.getAttribute("aria-hidden") !== "true"
      && child.tagName !== "INPUT"
    ));
    const exceedsStage = visibleChildren.some((child) => {
      const bounds = child.getBoundingClientRect();
      return bounds.left < stage.left - 3
        || bounds.right > stage.right + 3
        || bounds.top < stage.top - 3
        || bounds.bottom > stage.bottom + 3;
    });
    return exceedsStage ? [preview.getAttribute("data-component")] : [];
  }));

  expect(overflow).toEqual([]);
  expect(runtimeErrors).toEqual([]);
});

test("desktop public header centers the text wordmark and keeps action geometry stable", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Desktop owns the cross-route header geometry assertion.");
  await page.setViewportSize({ width: 1766, height: 900 });
  await page.goto("/");

  const rect = async (selector: string) => page.locator(selector).evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, center: box.x + box.width / 2 };
  });
  const landing = {
    wordmark: await rect(".landing-header .whatiuse-wordmark"),
    actions: await rect(".landing-header__actions"),
  };
  expect(Math.abs(landing.wordmark.center - 1766 / 2), "wordmark is not centered in the viewport").toBeLessThanOrEqual(0.5);
  await expect(page.locator(".whatiuse-wordmark svg")).toHaveCount(0);

  await page.getByRole("link", { name: "Open documentation" }).click();
  await expect(page).toHaveURL(/#installation$/);
  const documentation = {
    actions: await rect(".system-topbar__actions"),
  };

  expect(Math.abs(documentation.actions.x - landing.actions.x), "actions x coordinate moved").toBeLessThanOrEqual(0.5);
  expect(Math.abs(documentation.actions.y - landing.actions.y), "actions y coordinate moved").toBeLessThanOrEqual(0.5);
  expect(Math.abs(documentation.actions.width - landing.actions.width), "actions width changed").toBeLessThanOrEqual(0.5);
  expect(Math.abs(documentation.actions.height - landing.actions.height), "actions height changed").toBeLessThanOrEqual(0.5);
  expect(Math.abs(documentation.actions.right - landing.actions.right), "actions trailing edge moved").toBeLessThanOrEqual(0.5);
});

test("component preview and theme controls expose working states", async ({ page }) => {
  await page.goto("/");

  const buttonCard = page.locator('.component-index-row[data-component="button"]');
  await buttonCard.getByRole("button", { name: "Create issue" }).click();
  await expect(buttonCard.getByRole("button", { name: "Create issue" })).toHaveAttribute("aria-busy", "true");
  await expect(buttonCard.getByRole("button", { name: "Create issue" })).toContainText("Created", { timeout: 2_000 });

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
});

test("catalog interaction lives inside the components instead of a separate shelf", async ({ page }) => {
  await page.goto("/#components");

  const buttonCard = page.locator('.component-index-row[data-component="button"]');
  await buttonCard.getByRole("button", { name: "Create issue" }).click();
  const catalogAction = buttonCard.getByRole("button", { name: "Create issue" });
  await expect(catalogAction).toHaveAttribute("aria-busy", "true");
  await expect(catalogAction).toContainText("Created", { timeout: 2_000 });
  await expect(catalogAction).toHaveAttribute("aria-disabled", "false", { timeout: 3_000 });
  await expect(catalogAction).not.toHaveAttribute("aria-busy", "true");

  const toolbarCard = page.locator('.component-index-row[data-component="toolbar"]');
  const bold = toolbarCard.getByRole("button", { name: "Bold" });
  await expect(bold).toHaveAttribute("aria-pressed", "false");
  await bold.click();
  await expect(bold).toHaveAttribute("aria-pressed", "true");

  const badgeCard = page.locator('.component-index-row[data-component="badge"]');
  await badgeCard.scrollIntoViewIfNeeded();
  await badgeCard.getByRole("button", { name: "Remove Design filter" }).click();
  await expect(badgeCard.getByText("Design", { exact: true })).toHaveCount(0);
});

test("legacy Button interaction route resolves to the component documentation", async ({ page }) => {
  await page.goto("/#interaction-button");

  await expect(page.getByRole("heading", { level: 1, name: "Button" })).toBeVisible();
  await expect(page).toHaveURL(/#button$/);
});

test("public Library has no horizontal overflow at a compact mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const overflow = await page.locator(".component-index-page").evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("link", { name: "View Teum on GitHub" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
});

test("component catalog stacks previews without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#components");

  const overflow = await page.locator(".component-index-page").evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("textbox", { name: "Search components" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy Button install command" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Button code" })).toBeVisible();
});

test("command K does not pull the Library into documentation", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Desktop keyboard behavior is sufficient for the public entry.");
  await page.goto("/");

  await page.keyboard.press("Meta+K");
  await expect(page).not.toHaveURL(/#/);
  await expect(page.getByRole("textbox", { name: "Search documentation" })).toHaveCount(0);
});

test("landing publishes complete discovery and social metadata", async ({ page, request }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("whatiuse");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "whatiuse");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "whatiuse");
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", "whatiuse");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://whatiuse.minwookshin.com");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://whatiuse.minwookshin.com/social-preview.jpg");
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");

  for (const asset of ["/favicon.svg", "/apple-touch-icon.png", "/site.webmanifest", "/robots.txt", "/sitemap.xml", "/social-preview.jpg"]) {
    const response = await request.get(asset);
    expect(response.ok(), `${asset} should resolve`).toBe(true);
  }
});
