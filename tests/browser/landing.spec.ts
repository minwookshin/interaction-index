import { expect, test } from "@playwright/test";

test("public root opens directly into the component Library", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "components i use." })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Library" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View whatiuse on GitHub" })).toHaveAttribute("href", "https://github.com/minwookshin/whatiuse");
  await expect(page.getByRole("button", { name: "Copy whatiuse install command" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "made by minwook" })).toHaveAttribute("href", "https://www.minwookshin.com/");
  await expect(page.locator(".component-index-row")).toHaveCount(39);
  await expect(page.locator('.component-index-row[data-component="kbd"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Introduction" })).toHaveCount(0);
  const wordmark = page.locator(".whatiuse-wordmark");
  await expect(wordmark).toHaveText("whatiuse");
  await expect(wordmark.locator("svg")).toHaveCount(0);
  await expect(wordmark).toHaveAttribute("aria-hidden", "true");
  await expect(wordmark).toHaveCSS("pointer-events", "none");
  await expect(page.getByRole("link", { name: "whatiuse home" })).toHaveCount(0);
});

test("the author reveal stays inline and card copy writes the exact install command", async ({ page, context, browserName }) => {
  if (browserName === "chromium") {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  }
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const identity = page.getByRole("link", { name: "@minwook — portfolio" });
  await expect(identity).toHaveAttribute("href", "https://www.minwookshin.com/");
  await expect(identity).toHaveText("@minwook");
  const headingBefore = await page.getByRole("heading", { level: 1, name: "components i use." }).boundingBox();
  const supportsHover = await page.evaluate(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  if (supportsHover) await identity.hover();
  else await identity.focus();

  const portraits = page.locator(".component-index-author__portraits img");
  await expect(portraits).toHaveCount(3);
  await expect(portraits.first()).toHaveCSS("opacity", "1");
  const portraitBoxes = await portraits.evaluateAll((images) => images.map((image) => {
    const box = image.getBoundingClientRect();
    return { width: box.width, height: box.height };
  }));
  for (const box of portraitBoxes) expect(Math.abs(box.height - box.width)).toBeLessThanOrEqual(0.5);
  expect(await page.getByRole("heading", { level: 1, name: "components i use." }).boundingBox()).toEqual(headingBefore);

  const copyButton = page.locator('.component-index-row[data-component="button"] .component-index-row__actions').getByRole("button");
  await copyButton.scrollIntoViewIfNeeded();
  await copyButton.click();
  await expect(copyButton).toHaveAttribute("aria-label", "Button install command copied");
  if (browserName === "chromium") {
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(
      "npx shadcn@4.18.0 add https://whatiuse.minwookshin.com/r/v/0.1.0-rc.38/button.json",
    );
  }

  await page.getByRole("link", { name: "Open Button code" }).click();
  const inspector = page.getByRole("dialog", { name: "Button" });
  const reactSource = inspector.getByRole("region", { name: "Button React source" });
  await expect(reactSource).not.toContainText("Loading source...");
  const expectedReactSource = await reactSource.textContent();
  const sourceCopy = inspector.locator(".component-code-inspector__copy");
  await sourceCopy.click();
  await expect(sourceCopy).toHaveAttribute("aria-label", "Button React source copied");
  if (browserName === "chromium") {
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expectedReactSource);
  }

  await inspector.getByRole("button", { name: "CSS", exact: true }).click();
  const cssSource = inspector.getByRole("region", { name: "Button CSS source" });
  const expectedCssSource = await cssSource.textContent();
  await sourceCopy.click();
  await expect(sourceCopy).toHaveAttribute("aria-label", "Button CSS source copied");
  if (browserName === "chromium") {
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expectedCssSource);
  }

  await inspector.getByRole("tab", { name: "Install" }).click();
  const installCopy = inspector.locator(".component-code-inspector__install-copy button");
  await installCopy.click();
  await expect(installCopy).toHaveAttribute("aria-label", "Button install command copied");
  if (browserName === "chromium") {
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(
      "npx shadcn@4.18.0 add https://whatiuse.minwookshin.com/r/v/0.1.0-rc.38/button.json",
    );
  }
});

test("component catalog searches, previews, and opens code without nested group filters", async ({ page }) => {
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

  await expect(page.getByRole("button", { name: "Controls", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Overlays", exact: true })).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "Search components" })).toHaveAttribute("placeholder", "Search components");
  const popoverCard = page.locator('.component-index-row[data-component="popover"]');
  await popoverCard.scrollIntoViewIfNeeded();
  await popoverCard.getByRole("button", { name: "View", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "View options" })).toBeVisible();
  await page.keyboard.press("Escape");

  const search = page.getByRole("textbox", { name: "Search components" });
  await search.fill("toast");
  await expect(page.locator(".component-index-row")).toHaveCount(1);
  await page.getByRole("link", { name: "Open Toast code" }).click();
  await expect(page).toHaveURL(/#components\/toast$/);
  const inspector = page.getByRole("dialog", { name: "Toast" });
  await expect(inspector).toBeVisible();
  await expect(inspector.getByRole("tab", { name: "Source" })).toHaveAttribute("aria-selected", "true");
  await expect(inspector.getByRole("button", { name: "React", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(inspector.getByRole("region", { name: "Toast React source" })).toContainText('import "../../styles/whatiuse-base.css";');
  await expect(inspector.getByRole("button", { name: "Copy Toast React source" })).toBeVisible();
  await inspector.getByRole("button", { name: "CSS", exact: true }).click();
  const cssFileName = inspector.getByText("toast.css", { exact: true });
  if ((page.viewportSize()?.width ?? 0) < 600) await expect(cssFileName).toBeHidden();
  else await expect(cssFileName).toBeVisible();
  await expect(inspector.getByRole("region", { name: "Toast CSS source" })).toContainText(".whatiuse-toast");
  await expect(inspector.getByRole("button", { name: "Copy Toast CSS source" })).toBeVisible();
  await expect(inspector.getByRole("button", { name: "React Native" })).toHaveCount(0);

  await page.keyboard.press("Escape");
  await expect(inspector).toBeHidden();
  await expect(page).toHaveURL(/#components$/);
});

test("Data and Analytics collections expose live B2B primitives without Core filter noise", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/#components");

  await page.getByRole("tab", { name: "Analytics" }).click();
  await expect(page.locator(".component-index-row")).toHaveCount(17);
  await expect(page.getByRole("figure", { name: "Recurring revenue" })).toBeAttached();
  await expect(page.getByRole("textbox", { name: "Search components" })).toHaveAttribute("placeholder", "Search components");
  await page.locator('.component-index-row[data-component="sankey-chart"]').scrollIntoViewIfNeeded();

  await page.getByRole("tab", { name: "Data" }).click();
  await expect(page.locator(".component-index-row")).toHaveCount(18);
  await expect(page.getByRole("button", { name: "Controls", exact: true })).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "Search components" })).toHaveAttribute("placeholder", "Search components");
  await expect(page.locator('.component-index-row[data-component="data-table"]')).toBeInViewport();
  await expect(page.locator('.component-index-row[data-component="filter-builder"]')).toBeInViewport();
  const catalogOffset = await page.locator('.component-index-row[data-component="data-table"]').evaluate((card) => {
    const toolbar = document.querySelector<HTMLElement>(".component-index-toolbar");
    return card.getBoundingClientRect().top - (toolbar?.getBoundingClientRect().bottom ?? 0);
  });
  expect(catalogOffset).toBeGreaterThanOrEqual(20);
  expect(catalogOffset).toBeLessThanOrEqual(44);
  await expect(page.getByRole("table", { name: "Accounts" })).toBeVisible();
  await page.getByRole("link", { name: "Open Data Table code" }).click();
  await expect(page).toHaveURL(/#components\/data-table$/);
  await expect(page.getByRole("dialog", { name: "Data Table" }).getByRole("link", { name: "Accessibility & API" })).toHaveAttribute("href", "#product-pilot");
  await page.keyboard.press("Escape");

  await page.getByRole("tab", { name: "Core" }).click();
  await expect(page.locator('.component-index-row[data-component="button"]')).toBeInViewport();
  await expect(page.getByRole("textbox", { name: "Search components" })).toHaveAttribute("placeholder", "Search components");
});

test("component catalog keeps compact 16:9 previews in a two-column desktop grid", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/#components");

  const controlsGrid = page.locator(".component-index-group ul").first();
  const columnCount = () => controlsGrid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);

  await expect.poll(columnCount).toBe(2);
  const previewBox = await page.locator('.component-index-row[data-component="button"] .component-index-preview').boundingBox();
  expect(previewBox).not.toBeNull();
  expect(Math.abs((previewBox!.width / previewBox!.height) - (16 / 9))).toBeLessThanOrEqual(0.01);
  const buttonCard = page.locator('.component-index-row[data-component="button"]');
  const cardBox = await buttonCard.boundingBox();
  const copyBox = await buttonCard.getByRole("button", { name: "Copy Button install command" }).boundingBox();
  const actionBox = await buttonCard.locator(".component-index-row__actions").boundingBox();
  const previewBottom = previewBox!.y + previewBox!.height;
  expect(cardBox).not.toBeNull();
  expect(copyBox).not.toBeNull();
  expect(actionBox).not.toBeNull();
  expect(actionBox!.y - previewBottom).toBeGreaterThanOrEqual(3.5);
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
  const numberField = numberFieldCard.locator(".whatiuse-number-field");
  await expect(numberField).toBeVisible();
  const numberBox = await numberField.boundingBox();
  expect(numberBox).not.toBeNull();
  expect(numberBox!.width).toBeLessThanOrEqual(116);

  const datePickerCard = page.locator('.component-index-row[data-component="date-picker"]');
  await datePickerCard.scrollIntoViewIfNeeded();
  const dateGeometry = await datePickerCard.locator(".whatiuse-date-picker").evaluate((element) => {
    const group = element.querySelector<HTMLElement>(".whatiuse-date-picker__group")!;
    const icon = element.querySelector<SVGElement>(".whatiuse-date-picker__button svg")!;
    const segments = Array.from(element.querySelectorAll<HTMLElement>(".whatiuse-date-picker__segment"));
    const groupBox = group.getBoundingClientRect();
    const iconBox = icon.getBoundingClientRect();
    const firstVisibleEdge = Math.min(...segments.map((segment) => segment.getBoundingClientRect().left));
    return {
      width: element.getBoundingClientRect().width,
      leftInset: firstVisibleEdge - groupBox.left,
      rightInset: groupBox.right - iconBox.right,
    };
  });
  expect(dateGeometry.width).toBeCloseTo(176, 1);
  expect(Math.abs(dateGeometry.leftInset - dateGeometry.rightInset)).toBeLessThanOrEqual(0.5);

  for (const component of ["dialog", "sheet", "alert-dialog"]) {
    const overlayCard = page.locator(`.component-index-row[data-component="${component}"]`);
    await overlayCard.scrollIntoViewIfNeeded();
    const iconBox = await overlayCard.locator(".product-context__icon").boundingBox();
    const copyBox = await overlayCard.locator(".product-context__identity > div").boundingBox();
    expect(iconBox).not.toBeNull();
    expect(copyBox).not.toBeNull();
    expect(iconBox!.width).toBeCloseTo(36, 1);
    expect(iconBox!.height).toBeCloseTo(36, 1);
    expect(Math.abs((iconBox!.y + iconBox!.height / 2) - (copyBox!.y + copyBox!.height / 2))).toBeLessThanOrEqual(0.5);
  }

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
  const treeBox = await treeCard.locator(".whatiuse-tree").boundingBox();
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
  await expect(page.getByRole("heading", { level: 1, name: "components i use." })).toBeInViewport();

  await page.locator(".component-index-page").evaluate((element) => element.scrollTo({ top: 500, behavior: "instant" }));
  await expect.poll(async () => (await geometry()).centerY).toBeCloseTo(32, 1);
  const docked = await geometry();
  expect(Math.abs(docked.centerX - 640)).toBeLessThanOrEqual(0.5);
  expect(docked.width).toBeGreaterThan(56);
  expect(docked.width).toBeLessThan(64);

  await page.locator(".component-index-page").evaluate((element) => element.scrollTo({ top: 900, behavior: "instant" }));
  await expect.poll(async () => (await geometry()).width).toBeCloseTo(docked.width, 2);

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

  const previews = page.locator(".component-index-preview");
  await expect(previews.first()).toBeVisible();
  const previewCount = await previews.count();
  for (let index = 0; index < previewCount; index += 1) {
    const preview = previews.nth(index);
    await preview.scrollIntoViewIfNeeded();
    await expect(preview.locator(".component-index-preview__loading")).toHaveCount(0);
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

test("catalog assigns deliberate geometry to compact, form, and product stages", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/#components");

  const button = page.locator('.component-index-row[data-component="button"]');
  const select = page.locator('.component-index-row[data-component="select"]');
  const dialog = page.locator('.component-index-row[data-component="dialog"]');
  await expect(button).toHaveAttribute("data-stage", "compact");
  await expect(select).toHaveAttribute("data-stage", "form");
  await expect(dialog).toHaveAttribute("data-stage", "product");
  await expect(button).toHaveAttribute("data-flagship", "true");
  await expect(select).toHaveAttribute("data-flagship", "true");
  await expect(dialog).toHaveAttribute("data-flagship", "true");

  const height = async (row: typeof button) => (await row.locator(".component-index-preview").boundingBox())?.height ?? 0;
  expect(await height(button)).toBeLessThan(await height(select));
  expect(await height(select)).toBeLessThan(await height(dialog));

  await page.getByRole("tab", { name: "Data" }).click();
  await expect(page.locator('.component-index-row[data-component="data-table"]')).toHaveAttribute("data-stage", "product");
  await expect(page.locator('.component-index-row[data-component="filter-builder"]')).toHaveAttribute("data-flagship", "true");

  await page.getByRole("tab", { name: "Analytics" }).click();
  await expect(page.locator('.component-index-row[data-component="chart"]')).toHaveAttribute("data-flagship", "true");
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
  const documentationAction = await page.getByRole("link", { name: "Open documentation" }).boundingBox();
  expect(Math.abs(landing.wordmark.center - 1766 / 2), "wordmark is not centered in the viewport").toBeLessThanOrEqual(0.5);
  await expect(page.locator(".whatiuse-wordmark svg")).toHaveCount(0);
  expect(documentationAction).not.toBeNull();

  await page.getByRole("link", { name: "Open documentation" }).click();
  await expect(page).toHaveURL(/#installation$/);
  const documentation = {
    actions: await rect(".system-topbar__actions"),
  };
  const libraryReturn = await page.getByRole("link", { name: "Back to component library" }).boundingBox();
  expect(libraryReturn).not.toBeNull();

  expect(Math.abs(documentation.actions.x - landing.actions.x), "actions x coordinate moved").toBeLessThanOrEqual(0.5);
  expect(Math.abs(documentation.actions.y - landing.actions.y), "actions y coordinate moved").toBeLessThanOrEqual(0.5);
  expect(Math.abs(documentation.actions.width - landing.actions.width), "actions width changed").toBeLessThanOrEqual(0.5);
  expect(Math.abs(documentation.actions.height - landing.actions.height), "actions height changed").toBeLessThanOrEqual(0.5);
  expect(Math.abs(documentation.actions.right - landing.actions.right), "actions trailing edge moved").toBeLessThanOrEqual(0.5);
  expect(Math.abs(libraryReturn!.x - documentationAction!.x), "Library return moved out of the Documentation action slot").toBeLessThanOrEqual(0.5);
  expect(Math.abs(libraryReturn!.y - documentationAction!.y), "Library return changed the Documentation action y coordinate").toBeLessThanOrEqual(0.5);
  expect(Math.abs(libraryReturn!.width - documentationAction!.width), "Library return changed the Documentation action width").toBeLessThanOrEqual(0.5);
  expect(Math.abs(libraryReturn!.height - documentationAction!.height), "Library return changed the Documentation action height").toBeLessThanOrEqual(0.5);
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
  await expect(page.getByRole("link", { name: "View whatiuse on GitHub" })).toBeVisible();
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
