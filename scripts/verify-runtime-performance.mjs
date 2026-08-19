import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const output = resolve(root, "release/runtime-performance.json");
const vite = resolve(root, "node_modules/vite/bin/vite.js");

const budgets = {
  landingFcpMs: 1500,
  landingLcpMs: 2500,
  documentationFcpMs: 1800,
  documentationLcpMs: 2500,
  cls: 0.05,
  longestTaskMs: 250,
  documentationTransitionMs: 1500,
  sharedDetailSelectionMs: 750,
  dialogOpenMs: 750,
};

async function availablePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => error ? reject(error) : resolvePort(port));
    });
  });
}

async function waitForServer(url, child, outputLog) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`[runtime-performance] preview exited early\n${outputLog.join("")}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The preview has not bound its port yet.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 120));
  }
  throw new Error(`[runtime-performance] preview did not become ready\n${outputLog.join("")}`);
}

async function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise((resolveExit) => child.once("exit", resolveExit));
  child.kill("SIGTERM");
  const stopped = await Promise.race([
    exited.then(() => true),
    new Promise((resolveWait) => setTimeout(() => resolveWait(false), 5_000)),
  ]);
  if (!stopped && child.exitCode === null && child.signalCode === null) {
    child.kill("SIGKILL");
    await exited;
  }
}

async function installObservers(context) {
  await context.addInitScript(() => {
    const store = { cls: 0, lcp: 0, longTasks: [] };
    window.__whatiuseRuntimePerformance = store;
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) store.cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch { /* Unsupported performance-entry type. */ }
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) store.lcp = Math.max(store.lcp, entry.startTime);
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch { /* Unsupported performance-entry type. */ }
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) store.longTasks.push(entry.duration);
      }).observe({ type: "longtask", buffered: true });
    } catch { /* Unsupported performance-entry type. */ }
  });
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts?.ready;
    await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
  });
  await page.waitForTimeout(120);
}

async function pageMetrics(browser, url, heading) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
  await installObservers(context);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: heading }).waitFor({ state: "visible" });
  await settle(page);
  const metrics = await page.evaluate(() => {
    const store = window.__whatiuseRuntimePerformance ?? { cls: 0, lcp: 0, longTasks: [] };
    const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
    const navigation = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource");
    const resourceBytes = resources.reduce((sum, entry) => sum + (entry.transferSize || entry.encodedBodySize || 0), 0);
    return {
      fcpMs: Math.round(fcp),
      lcpMs: Math.round(store.lcp),
      cls: Number(store.cls.toFixed(4)),
      longestTaskMs: Math.round(Math.max(0, ...store.longTasks)),
      longTaskCount: store.longTasks.filter((duration) => duration > 50).length,
      domContentLoadedMs: Math.round(navigation?.domContentLoadedEventEnd ?? 0),
      loadMs: Math.round(navigation?.loadEventEnd ?? 0),
      resourceRequests: resources.length,
      resourceTransferBytes: Math.round(resourceBytes),
    };
  });
  await context.close();
  return metrics;
}

async function interactionMetrics(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
  await installObservers(context);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/#product-pilot`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: "Data" }).waitFor({ state: "visible" });
  await page.getByRole("button", { name: /Tune shared detail motion/ }).waitFor({ state: "visible" });
  const selectionMs = await page.evaluate(() => new Promise((resolveMetric, reject) => {
    const trigger = [...document.querySelectorAll("button")].find((button) => button.textContent?.includes("Tune shared detail motion"));
    if (!trigger) return reject(new Error("Shared Detail trigger is missing"));
    const start = performance.now();
    trigger.click();
    const inspect = () => {
      const ready = [...document.querySelectorAll("h1, h2, h3")].some((heading) => heading.textContent?.trim() === "Tune shared detail motion");
      if (ready) return resolveMetric(performance.now() - start);
      if (performance.now() - start > 2_000) return reject(new Error("Shared Detail did not commit"));
      requestAnimationFrame(inspect);
    };
    inspect();
  }));
  const dialogMs = await page.evaluate(() => new Promise((resolveMetric, reject) => {
    const trigger = [...document.querySelectorAll("button")].find((button) => button.textContent?.trim() === "New issue");
    if (!trigger) return reject(new Error("Dialog trigger is missing"));
    const start = performance.now();
    trigger.click();
    const inspect = () => {
      if (document.querySelector('[role="dialog"]')) return resolveMetric(performance.now() - start);
      if (performance.now() - start > 2_000) return reject(new Error("Dialog did not open"));
      requestAnimationFrame(inspect);
    };
    inspect();
  }));
  const longTasks = await page.evaluate(() => window.__whatiuseRuntimePerformance?.longTasks ?? []);
  await context.close();
  return {
    sharedDetailSelectionMs: Math.round(selectionMs),
    dialogOpenMs: Math.round(dialogMs),
    longestTaskMs: Math.round(Math.max(0, ...longTasks)),
  };
}

const port = await availablePort();
if (!port) throw new Error("[runtime-performance] could not allocate a preview port");
const baseUrl = `http://127.0.0.1:${port}`;
const previewOutput = [];
const preview = spawn(process.execPath, [vite, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
  cwd: root,
  env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  stdio: ["ignore", "pipe", "pipe"],
});
preview.stdout.on("data", (chunk) => previewOutput.push(chunk.toString()));
preview.stderr.on("data", (chunk) => previewOutput.push(chunk.toString()));

let browser;
try {
  await waitForServer(baseUrl, preview, previewOutput);
  browser = await chromium.launch({ headless: true });
  const [landing, documentation] = await Promise.all([
    pageMetrics(browser, `${baseUrl}/`, "components i use."),
    pageMetrics(browser, `${baseUrl}/#installation`, "Installation"),
  ]);

  const transitionContext = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
  const transitionPage = await transitionContext.newPage();
  await transitionPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await transitionPage.getByRole("heading", { level: 1, name: "components i use." }).waitFor({ state: "visible" });
  await transitionPage.evaluate(() => { window.__whatiuseTransitionStartedAt = performance.now(); });
  await transitionPage.getByRole("link", { name: "Open documentation" }).click();
  await transitionPage.getByRole("heading", { level: 1, name: "Installation" }).waitFor({ state: "visible" });
  const documentationTransitionMs = Math.round(await transitionPage.evaluate(() => performance.now() - window.__whatiuseTransitionStartedAt));
  await transitionContext.close();

  const interactions = await interactionMetrics(browser, baseUrl);
  const measurements = { landing, documentation, documentationTransitionMs, interactions };
  const failures = [];
  if (!landing.fcpMs || landing.fcpMs > budgets.landingFcpMs) failures.push(`landing FCP ${landing.fcpMs}ms`);
  if (!landing.lcpMs || landing.lcpMs > budgets.landingLcpMs) failures.push(`landing LCP ${landing.lcpMs}ms`);
  if (!documentation.fcpMs || documentation.fcpMs > budgets.documentationFcpMs) failures.push(`documentation FCP ${documentation.fcpMs}ms`);
  if (!documentation.lcpMs || documentation.lcpMs > budgets.documentationLcpMs) failures.push(`documentation LCP ${documentation.lcpMs}ms`);
  if (landing.cls > budgets.cls || documentation.cls > budgets.cls) failures.push(`CLS ${Math.max(landing.cls, documentation.cls)}`);
  if (landing.longestTaskMs > budgets.longestTaskMs || documentation.longestTaskMs > budgets.longestTaskMs) failures.push(`long task ${Math.max(landing.longestTaskMs, documentation.longestTaskMs)}ms`);
  if (documentationTransitionMs > budgets.documentationTransitionMs) failures.push(`documentation transition ${documentationTransitionMs}ms`);
  if (interactions.sharedDetailSelectionMs > budgets.sharedDetailSelectionMs) failures.push(`Shared Detail ${interactions.sharedDetailSelectionMs}ms`);
  if (interactions.dialogOpenMs > budgets.dialogOpenMs) failures.push(`Dialog ${interactions.dialogOpenMs}ms`);

  const evidence = {
    schemaVersion: 1,
    generatedBy: "scripts/verify-runtime-performance.mjs",
    generatedAt: new Date().toISOString(),
    releaseVersion: packageJson.version,
    status: failures.length ? "failed" : "passed",
    mode: "local-production-preview",
    viewport: { width: 1280, height: 720 },
    reducedMotion: true,
    budgets,
    measurements,
    environment: { platform: process.platform, architecture: process.arch, node: process.version, browser: "bundled Chromium" },
    externalGates: ["production-field-core-web-vitals", "real-network-and-device-latency", "production-rum-inp"],
  };
  await writeFile(output, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  if (failures.length) throw new Error(`[runtime-performance] budgets failed: ${failures.join(", ")}`);
  console.log(`[runtime-performance] landing FCP/LCP ${landing.fcpMs}/${landing.lcpMs}ms, docs ${documentation.fcpMs}/${documentation.lcpMs}ms, CLS ${Math.max(landing.cls, documentation.cls)}, longest task ${Math.max(landing.longestTaskMs, documentation.longestTaskMs)}ms`);
  console.log(`[runtime-performance] docs transition ${documentationTransitionMs}ms, Shared Detail ${interactions.sharedDetailSelectionMs}ms, Dialog ${interactions.dialogOpenMs}ms`);
} finally {
  await browser?.close();
  await stopChild(preview);
}
