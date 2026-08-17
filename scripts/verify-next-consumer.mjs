import { access, readFile, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { resolve } from "node:path";
import {
  configureAndInstall,
  createExampleFixture,
  packageJson,
  readFilesContaining,
  removeFixture,
  root,
  run,
  shadcnCli,
  startRegistryServer,
} from "./adoption-test-utils.mjs";

const evidencePath = resolve(root, "release/next-quickstart.json");
const maxJourneyMs = 10 * 60 * 1000;
const registry = await startRegistryServer();
const fixture = await createExampleFixture("quickstart-next", "teum-next-");

try {
  const startedAt = performance.now();
  await configureAndInstall(fixture, registry.template);

  for (const path of [
    "src/components/ui/button.tsx",
    "src/lib/cn.ts",
    "src/styles/teum-base.css",
    "src/styles/components/button.css",
  ]) {
    await access(resolve(fixture, path)).catch(() => {
      throw new Error(`[next-adoption] CLI did not install ${path}`);
    });
  }

  await run("npm", ["run", "typecheck"], { cwd: fixture, timeout: 300_000 });
  await run("npm", ["run", "build"], { cwd: fixture, timeout: 420_000 });
  await access(resolve(fixture, ".next/BUILD_ID"));

  const builtCss = await readFilesContaining(resolve(fixture, ".next"), /\.css$/);
  const builtOutput = await readFilesContaining(resolve(fixture, ".next/server/app"), /\.(?:html|js)$/);
  if (!builtCss.includes(".teum-button") || !/--teum-radius-control:\s*9px/.test(builtCss)) {
    throw new Error("[next-adoption] production build omitted Teum Button CSS or the semantic override");
  }
  if (!builtCss.includes(':root[data-theme="dark"]') && !builtCss.includes(":root[data-theme=dark]")) {
    throw new Error("[next-adoption] production build omitted the dark theme contract");
  }
  if (!builtOutput.includes("Create issue") || !builtOutput.includes("Teum + Next.js")) {
    throw new Error("[next-adoption] prerendered output omitted the quickstart content");
  }

  const installedPackage = JSON.parse(await readFile(resolve(fixture, "package.json"), "utf8"));
  const elapsedMs = Math.round(performance.now() - startedAt);
  if (elapsedMs >= maxJourneyMs) throw new Error("[next-adoption] journey exceeded ten minutes");

  if (process.env.TEUM_NEXT_EVIDENCE === "1") {
    await writeFile(evidencePath, `${JSON.stringify({
      schemaVersion: 1,
      generatedBy: "scripts/verify-next-consumer.mjs",
      generatedAt: new Date().toISOString(),
      version: packageJson.version,
      status: "passed",
      framework: "Next.js App Router",
      frameworkVersion: installedPackage.dependencies.next,
      react: installedPackage.dependencies.react,
      fixture: "examples/quickstart-next",
      targetMs: maxJourneyMs,
      elapsedMs,
      automatedJourney: "configure pinned registry, install Button, customize one semantic role, switch theme behind a client boundary, type-check, and production-build",
      humanNoviceTimingClaim: false,
      serverComponentBoundary: "layout and page stay server-rendered; the interactive proof is an explicit client component",
      globalCssBoundary: "src/app/globals.css is imported once by the root layout",
      themeToggle: true,
      semanticOverride: "--teum-radius-control: 9px",
      commands: [
        `npx ${shadcnCli} registry add @teum-pinned=${packageJson.homepage}/r/v/${packageJson.version}/{name}.json`,
        `npx ${shadcnCli} add @teum-pinned/button`,
        "npm run typecheck",
        "npm run build",
      ],
    }, null, 2)}\n`, "utf8");
  }

  console.log(`[next-adoption] Next.js ${installedPackage.dependencies.next} installed, customized, type-checked, and built in ${elapsedMs} ms`);
} finally {
  await registry.close();
  await removeFixture(fixture);
}
