import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const requiredContracts = {
  publicRouteAxe: "all public documents have no serious or critical automated violations",
  publicRouteReflow: "all public routes preserve content at a 200 percent equivalent viewport",
  shortcutGeometry: "visible keyboard hints stay atomic at desktop and 200 percent equivalent widths",
  contentExpansion: "representative product surfaces tolerate synthetic translated-content expansion",
  forcedColorsAndReducedMotion: "all public routes retain structure in forced colors and reduced motion",
  overlayFocusReturn: "keyboard focus returns after a representative menu and dialog path",
  keyboardSkipPath: "Library and documentation expose a keyboard-first skip path",
  routeAnnouncement: "documentation announces in-app route changes without moving desktop focus",
  mobileFocusHandoff: "mobile navigation hands focus to the selected document",
  landmarkOwnership: "every public view owns one main landmark and one page heading",
};

function git(command) {
  try {
    return execFileSync("git", command, { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function count(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

export default class PlaywrightAccessibilityReporter {
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
    if (!configuredProjects.every((project) => exercisedProjects.includes(project))) {
      throw new Error("[accessibility-evidence] run the accessibility suite across every configured browser project");
    }

    const outcomes = tests.reduce(
      (counts, test) => {
        counts[test.outcome()] += 1;
        return counts;
      },
      { expected: 0, skipped: 0, unexpected: 0, flaky: 0 },
    );
    const contracts = Object.fromEntries(Object.entries(requiredContracts).map(([id, title]) => {
      const ownedTests = tests.filter((test) => test.title === title);
      if (!ownedTests.length) throw new Error(`[accessibility-evidence] required contract is missing: ${title}`);
      const ownedOutcomes = ownedTests.map((test) => test.outcome());
      const passingProjects = ownedTests.filter((test) => test.outcome() === "expected").map((test) => test.parent.project()?.name).filter(Boolean);
      return [id, {
        title,
        status: passingProjects.length > 0 && !ownedOutcomes.includes("unexpected") && !ownedOutcomes.includes("flaky") ? "passed" : "failed",
        passingProjects,
        intentionalSkips: ownedOutcomes.filter((outcome) => outcome === "skipped").length,
      }];
    }));

    const [packageJson, registry, routeSource] = await Promise.all([
      readFile(resolve("package.json"), "utf8").then(JSON.parse),
      readFile(resolve("registry.json"), "utf8").then(JSON.parse),
      readFile(resolve("tests/browser/public-routes.ts"), "utf8"),
    ]);
    const componentRoutes = registry.items.filter((item) => item.type === "registry:ui").length;
    const documentationRoutes = count(routeSource, /^\s*\["[^"]+",\s*"[^"]+",\s*"docs"\],?$/gm);
    const foundationRoutes = count(routeSource, /^\s*\["[^"]+",\s*"[^"]+",\s*"foundations"\],?$/gm);
    const patternRoutes = count(routeSource, /^\s*\["[^"]+",\s*"[^"]+",\s*"patterns"\],?$/gm);
    const publicRoutes = 1 + documentationRoutes + foundationRoutes + componentRoutes + patternRoutes;
    const output = resolve(process.env.TEUM_ACCESSIBILITY_EVIDENCE_PATH ?? "release/accessibility.json");
    const evidence = {
      schemaVersion: 1,
      generatedBy: "scripts/playwright-accessibility-reporter.mjs",
      generatedAt: new Date().toISOString(),
      command: "npm run test:a11y:evidence",
      releaseVersion: packageJson.version,
      status: result.status,
      durationMs: Math.round(result.duration),
      total: tests.length,
      passed: outcomes.expected,
      skipped: outcomes.skipped,
      failed: outcomes.unexpected,
      flaky: outcomes.flaky,
      projects: configuredProjects,
      routes: {
        public: publicRoutes,
        landing: 1,
        documentation: documentationRoutes,
        foundations: foundationRoutes,
        components: componentRoutes,
        patterns: patternRoutes,
      },
      contracts,
      environment: {
        platform: process.platform,
        architecture: process.arch,
        node: process.version,
      },
      source: {
        commit: git(["rev-parse", "HEAD"]),
        workingTreeDirty: Boolean(git(["status", "--porcelain"])),
      },
      externalGates: [
        "windows-edge-and-high-contrast",
        "physical-ios-and-android",
        "macos-increase-contrast-and-reduce-transparency",
        "human-rtl-and-verbose-translation-review",
        "independent-accessibility-review",
      ],
    };

    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  }
}
