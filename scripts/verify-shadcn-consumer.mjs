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
  shadcnExecutable,
  startRegistryServer,
} from "./adoption-test-utils.mjs";

const evidencePath = resolve(root, "release/quickstart.json");
const maxJourneyMs = 10 * 60 * 1000;
const matrices = [
  {
    label: "React 18",
    react: "18.3.1",
    reactDom: "18.3.1",
    reactTypes: "18.3.31",
    reactDomTypes: "18.3.7",
  },
  {
    label: "React 19",
    react: packageJson.devDependencies.react,
    reactDom: packageJson.devDependencies["react-dom"],
    reactTypes: packageJson.devDependencies["@types/react"],
    reactDomTypes: packageJson.devDependencies["@types/react-dom"],
  },
];

const registry = await startRegistryServer();
const results = [];

try {
  for (const matrix of matrices) {
    const fixture = await createExampleFixture("quickstart-vite", `whatiuse-vite-${matrix.react.split(".")[0]}-`);
    try {
      const fixturePackagePath = resolve(fixture, "package.json");
      const fixturePackage = JSON.parse(await readFile(fixturePackagePath, "utf8"));
      fixturePackage.dependencies.react = matrix.react;
      fixturePackage.dependencies["react-dom"] = matrix.reactDom;
      fixturePackage.devDependencies["@types/react"] = matrix.reactTypes;
      fixturePackage.devDependencies["@types/react-dom"] = matrix.reactDomTypes;
      await writeFile(fixturePackagePath, `${JSON.stringify(fixturePackage, null, 2)}\n`, "utf8");

      const startedAt = performance.now();
      await configureAndInstall(fixture, registry.template);

      for (const path of [
        "src/components/ui/button.tsx",
        "src/lib/cn.ts",
        "src/styles/whatiuse-base.css",
        "src/styles/components/button.css",
      ]) {
        await access(resolve(fixture, path)).catch(() => {
          throw new Error(`[vite-adoption] CLI did not install ${path} for ${matrix.label}`);
        });
      }

      const installedPackage = JSON.parse(await readFile(fixturePackagePath, "utf8"));
      for (const dependency of ["@base-ui/react", "@fontsource-variable/inter", "class-variance-authority", "clsx", "tailwind-merge"]) {
        if (!installedPackage.dependencies?.[dependency]) throw new Error(`[vite-adoption] CLI omitted ${dependency}`);
      }
      if (installedPackage.dependencies?.tailwindcss || installedPackage.devDependencies?.tailwindcss) {
        throw new Error("[vite-adoption] plain CSS install unexpectedly added Tailwind CSS");
      }

      await run("npm", ["run", "typecheck"], { cwd: fixture });
      await run("npm", ["run", "build"], { cwd: fixture });
      await access(resolve(fixture, "dist/index.html"));

      const builtCss = await readFilesContaining(resolve(fixture, "dist/assets"), /\.css$/);
      const builtJavaScript = await readFilesContaining(resolve(fixture, "dist/assets"), /\.js$/);
      if (!builtCss.includes(".whatiuse-button") || !/--whatiuse-radius-control:\s*9px/.test(builtCss)) {
        throw new Error(`[vite-adoption] ${matrix.label} build omitted whatiuse Button CSS or the semantic override`);
      }
      if (!builtCss.includes(':root[data-theme="dark"]') && !builtCss.includes(":root[data-theme=dark]")) {
        throw new Error(`[vite-adoption] ${matrix.label} build omitted the dark theme contract`);
      }
      if (!builtJavaScript.includes("Create issue") || !builtJavaScript.includes("dataset.theme")) {
        throw new Error(`[vite-adoption] ${matrix.label} build omitted the rendered action or theme control`);
      }

      if (matrix.label === "React 19") {
        await run(shadcnExecutable, ["add", "@whatiuse/whatiuse-tailwind", "-y", "-c", fixture]);
        await access(resolve(fixture, "src/styles/whatiuse-tailwind.css"));
      }

      const elapsedMs = Math.round(performance.now() - startedAt);
      if (elapsedMs >= maxJourneyMs) throw new Error(`[vite-adoption] ${matrix.label} journey exceeded ten minutes`);
      results.push({
        runtime: matrix.label,
        react: matrix.react,
        reactDom: matrix.reactDom,
        elapsedMs,
        typecheck: "passed",
        productionBuild: "passed",
        plainCss: true,
        themeToggle: true,
        semanticOverride: "--whatiuse-radius-control: 9px",
      });
      console.log(`[vite-adoption] ${matrix.label} installed, customized, type-checked, and built in ${elapsedMs} ms`);
    } finally {
      await removeFixture(fixture);
    }
  }

  if (process.env.WHATIUSE_QUICKSTART_EVIDENCE === "1") {
    await writeFile(evidencePath, `${JSON.stringify({
      schemaVersion: 2,
      generatedBy: "scripts/verify-shadcn-consumer.mjs",
      generatedAt: new Date().toISOString(),
      version: packageJson.version,
      status: "passed",
      framework: "Vite",
      fixture: "examples/quickstart-vite",
      targetMs: maxJourneyMs,
      automatedJourney: "configure pinned registry, install Button, customize one semantic role, switch theme, type-check, and production-build",
      humanNoviceTimingClaim: false,
      results,
      commands: [
        `npx ${shadcnCli} registry add @whatiuse=${packageJson.homepage}/r/v/${packageJson.version}/{name}.json`,
        `npx ${shadcnCli} add @whatiuse/button`,
        "npm run typecheck",
        "npm run build",
      ],
      verifiedFiles: [
        "src/components/ui/button.tsx",
        "src/lib/cn.ts",
        "src/styles/whatiuse-base.css",
        "src/styles/components/button.css",
      ],
      optionalTailwindBridgeVerified: true,
    }, null, 2)}\n`, "utf8");
  }
} finally {
  await registry.close();
}
