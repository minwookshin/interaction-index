import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

function git(command) {
  try {
    return execFileSync("git", command, { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

export default class PlaywrightEvidenceReporter {
  suite;
  config;

  printsToStdio() {
    return false;
  }

  onBegin(config, suite) {
    this.config = config;
    this.suite = suite;
  }

  async onEnd(result) {
    const tests = this.suite?.allTests() ?? [];
    const configuredProjects = this.config?.projects.map((project) => project.name) ?? [];
    const exercisedProjects = [...new Set(tests.map((test) => test.parent.project()?.name).filter(Boolean))];
    const isFullMatrix = configuredProjects.every((project) => exercisedProjects.includes(project));
    if (!isFullMatrix) return;

    const outcomes = tests.reduce(
      (counts, test) => {
        counts[test.outcome()] += 1;
        return counts;
      },
      { expected: 0, skipped: 0, unexpected: 0, flaky: 0 },
    );
    const packageJson = JSON.parse(await readFile(resolve("package.json"), "utf8"));
    const output = resolve(process.env.WHATIUSE_BROWSER_EVIDENCE_PATH ?? "release/browser-matrix.json");
    const evidence = {
      schemaVersion: 1,
      generatedBy: "scripts/playwright-evidence-reporter.mjs",
      generatedAt: new Date().toISOString(),
      command: `npm run test:browsers:evidence -- --workers=${this.config?.workers ?? "auto"}`,
      releaseVersion: packageJson.version,
      status: result.status,
      durationMs: Math.round(result.duration),
      total: tests.length,
      passed: outcomes.expected,
      skipped: outcomes.skipped,
      failed: outcomes.unexpected,
      flaky: outcomes.flaky,
      projects: configuredProjects,
      environment: {
        platform: process.platform,
        architecture: process.arch,
        node: process.version,
      },
      source: {
        commit: git(["rev-parse", "HEAD"]),
        workingTreeDirty: Boolean(git(["status", "--porcelain"])),
      },
    };

    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  }
}
