import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { resolve } from "node:path";
import {
  createExampleFixture,
  packageJson,
  removeFixture,
  root,
  run,
  shadcnCli,
  shadcnExecutable,
  startRegistryServer,
} from "./adoption-test-utils.mjs";

const evidencePath = resolve(root, "release/registry-upgrade.json");
const maxJourneyMs = 10 * 60 * 1000;
const ledger = JSON.parse(await readFile(resolve(root, "release/registry-history.json"), "utf8"));
const currentIndex = ledger.versions.findIndex((entry) => entry.version === packageJson.version);
if (currentIndex < 1) throw new Error(`[registry-upgrade] ${packageJson.version} has no prior version in the immutable ledger`);
const fromVersion = ledger.versions[currentIndex - 1].version;
const fromRegistry = await startRegistryServer(fromVersion);
const toRegistry = await startRegistryServer(packageJson.version);
const fixture = await createExampleFixture("quickstart-vite", "teum-upgrade-");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

try {
  const startedAt = performance.now();
  await run(shadcnExecutable, ["registry", "add", `@teum-pinned=${fromRegistry.template}`, "-c", fixture]);
  await run(shadcnExecutable, ["add", "@teum-pinned/button", "-y", "-c", fixture]);
  await run("npm", ["run", "build"], { cwd: fixture });

  const buttonPath = resolve(fixture, "src/components/ui/button.tsx");
  const localMarker = "// local adopter customization: preserve before explicit acceptance";
  await writeFile(buttonPath, `${await readFile(buttonPath, "utf8")}\n${localMarker}\n`, "utf8");
  const customizedSource = await readFile(buttonPath, "utf8");
  const customizedHash = sha256(customizedSource);

  await run(shadcnExecutable, ["registry", "add", `@teum-pinned=${toRegistry.template}`, "-c", fixture]);
  const dryRun = await run(shadcnExecutable, ["add", "@teum-pinned/button", "--dry-run", "-c", fixture]);
  if (sha256(await readFile(buttonPath, "utf8")) !== customizedHash) {
    throw new Error("[registry-upgrade] dry-run changed locally customized source");
  }
  if (!/button|components\/ui/i.test(`${dryRun.stdout}\n${dryRun.stderr}`)) {
    throw new Error("[registry-upgrade] dry-run did not describe the Button candidate");
  }

  const diff = await run(shadcnExecutable, ["add", "@teum-pinned/button", "--diff", "src/components/ui/button.tsx", "-c", fixture]);
  const diffOutput = `${diff.stdout}\n${diff.stderr}`;
  if (!diffOutput.includes(localMarker) && !/local adopter customization/i.test(diffOutput)) {
    throw new Error("[registry-upgrade] reviewed diff did not expose the local customization");
  }
  if (sha256(await readFile(buttonPath, "utf8")) !== customizedHash) {
    throw new Error("[registry-upgrade] diff review changed locally customized source");
  }

  await run(shadcnExecutable, ["add", "@teum-pinned/button", "--overwrite", "--yes", "-c", fixture]);
  const acceptedSource = await readFile(buttonPath, "utf8");
  if (acceptedSource.includes(localMarker)) {
    throw new Error("[registry-upgrade] explicit acceptance did not replace the reviewed local source");
  }
  await run("npm", ["run", "typecheck"], { cwd: fixture });
  await run("npm", ["run", "build"], { cwd: fixture });

  const elapsedMs = Math.round(performance.now() - startedAt);
  if (elapsedMs >= maxJourneyMs) throw new Error("[registry-upgrade] reviewed update journey exceeded ten minutes");

  if (process.env.TEUM_UPGRADE_EVIDENCE === "1") {
    await writeFile(evidencePath, `${JSON.stringify({
      schemaVersion: 1,
      generatedBy: "scripts/verify-registry-upgrade.mjs",
      generatedAt: new Date().toISOString(),
      version: packageJson.version,
      fromVersion,
      status: "passed",
      targetMs: maxJourneyMs,
      elapsedMs,
      flow: "install prior pinned source, add a local customization, inspect dry-run and file diff without writes, explicitly accept current pinned source, type-check, and build",
      humanNoviceTimingClaim: false,
      localSourcePreservedDuringReview: true,
      explicitOverwriteRequired: true,
      acceptedBuild: true,
      commands: [
        `npx ${shadcnCli} add @teum-pinned/button --dry-run`,
        `npx ${shadcnCli} add @teum-pinned/button --diff src/components/ui/button.tsx`,
        `npx ${shadcnCli} add @teum-pinned/button --overwrite --yes`,
        "npm run typecheck",
        "npm run build",
      ],
    }, null, 2)}\n`, "utf8");
  }

  console.log(`[registry-upgrade] ${fromVersion} → ${packageJson.version} preserved review, required explicit acceptance, and rebuilt in ${elapsedMs} ms`);
} finally {
  await fromRegistry.close();
  await toRegistry.close();
  await removeFixture(fixture);
}
