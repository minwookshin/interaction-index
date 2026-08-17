import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45_000,
  expect: { timeout: 8_000, toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.TEUM_ACCESSIBILITY_EVIDENCE
    ? [["line"], ["./scripts/playwright-accessibility-reporter.mjs"]]
    : process.env.TEUM_BROWSER_EVIDENCE
      ? [["line"], ["./scripts/playwright-evidence-reporter.mjs"]]
    : process.env.CI
      ? [["line"], ["html", { open: "never" }]]
      : "line",
  // Font rasterization and native control rendering differ between macOS and
  // Linux. Keep an intentional baseline for each release environment instead
  // of weakening the visual-diff threshold for every platform.
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}-{platform}{ext}",
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] } },
    { name: "mobile-webkit", use: { ...devices["iPhone 12"] } },
  ],
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4174 --strictPort",
    url: "http://127.0.0.1:4174/#introduction",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
