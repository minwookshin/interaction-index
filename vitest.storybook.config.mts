import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const storybookProject = async (theme: "light" | "dark") => ({
  extends: true as const,
  plugins: await storybookTest({
      configDir: path.join(dirname, ".storybook"),
      initialGlobals: { theme },
      tags: { include: ["test"], exclude: [], skip: [] },
    }),
  test: {
    name: `storybook-${theme}`,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: "chromium" as const }],
    },
  },
});

export default defineConfig({
  optimizeDeps: {
    include: ["react", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  test: {
    projects: await Promise.all([storybookProject("light"), storybookProject("dark")]),
  },
});
