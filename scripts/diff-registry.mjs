import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const exec = promisify(execFile);
const args = process.argv.slice(2);
const valueFor = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};
const jsonOutput = args.includes("--json");
const fromValue = valueFor("--from");
const toValue = valueFor("--to") ?? "public/r/manifest.json";

async function readManifest(value) {
  if (/^https:\/\//.test(value)) {
    const response = await fetch(value, { cache: "no-store" });
    if (!response.ok) throw new Error(`[registry-diff] ${value} returned ${response.status}`);
    return response.json();
  }
  return JSON.parse(await readFile(value, "utf8"));
}

async function previousManifest() {
  if (fromValue) return { label: fromValue, manifest: await readManifest(fromValue) };
  try {
    const { stdout } = await exec("git", ["show", "HEAD:public/r/manifest.json"], { maxBuffer: 32 * 1024 * 1024 });
    return { label: "HEAD:public/r/manifest.json", manifest: JSON.parse(stdout) };
  } catch {
    return null;
  }
}

const previous = await previousManifest();
const next = await readManifest(toValue);
if (!previous) {
  const result = {
    baseline: true,
    to: toValue,
    version: next.version,
    summary: "No prior manifest exists. This is the registry integrity baseline.",
  };
  console.log(jsonOutput ? JSON.stringify(result, null, 2) : `[registry-diff] ${result.summary}`);
  process.exit(0);
}

const changes = [];
const beforeArtifacts = previous.manifest.artifacts ?? {};
const afterArtifacts = next.artifacts ?? {};
for (const name of [...new Set([...Object.keys(beforeArtifacts), ...Object.keys(afterArtifacts)])].sort()) {
  const before = beforeArtifacts[name];
  const after = afterArtifacts[name];
  if (!before) changes.push({ severity: "additive", area: "artifact", name, change: "added" });
  else if (!after) changes.push({ severity: "breaking", area: "artifact", name, change: "removed" });
  else if (before.sha256 !== after.sha256) changes.push({ severity: "review", area: "artifact", name, change: "content changed" });
}

const beforeApi = previous.manifest.api?.components ?? {};
const afterApi = next.api?.components ?? {};
for (const component of [...new Set([...Object.keys(beforeApi), ...Object.keys(afterApi)])].sort()) {
  const beforeExports = beforeApi[component]?.exports ?? {};
  const afterExports = afterApi[component]?.exports ?? {};
  for (const name of [...new Set([...Object.keys(beforeExports), ...Object.keys(afterExports)])].sort()) {
    const before = beforeExports[name];
    const after = afterExports[name];
    if (!before) changes.push({ severity: "additive", area: "api", name: `${component}/${name}`, change: "export added" });
    else if (!after) changes.push({ severity: "breaking", area: "api", name: `${component}/${name}`, change: "export removed" });
    else if (before.typeHash !== after.typeHash) changes.push({ severity: "breaking", area: "api", name: `${component}/${name}`, change: "public type changed" });
  }
}

const beforeTokens = previous.manifest.tokens?.entries ?? {};
const afterTokens = next.tokens?.entries ?? {};
for (const name of [...new Set([...Object.keys(beforeTokens), ...Object.keys(afterTokens)])].sort()) {
  const before = beforeTokens[name];
  const after = afterTokens[name];
  if (!before) changes.push({ severity: "additive", area: "token", name, change: "added" });
  else if (!after) changes.push({ severity: "breaking", area: "token", name, change: "removed" });
  else if (before.type !== after.type || before.cssVariable !== after.cssVariable) changes.push({ severity: "breaking", area: "token", name, change: "contract changed" });
  else if (before.valueHash !== after.valueHash) changes.push({ severity: "review", area: "token", name, change: "value changed" });
}

const rank = { breaking: 0, review: 1, additive: 2 };
changes.sort((left, right) => rank[left.severity] - rank[right.severity] || left.area.localeCompare(right.area) || left.name.localeCompare(right.name));
const result = {
  baseline: false,
  from: previous.label,
  to: toValue,
  versions: { before: previous.manifest.version, after: next.version },
  recommendation: changes.some((item) => item.severity === "breaking")
    ? "breaking-change-review"
    : changes.some((item) => item.severity === "review")
      ? "maintainer-review"
      : changes.length > 0
        ? "additive-release"
        : "no-change",
  changes,
};

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`# Registry diff\n\nFrom: ${previous.label}\nTo: ${toValue}\nVersions: ${result.versions.before} -> ${result.versions.after}\nDecision: ${result.recommendation}\n`);
  if (changes.length === 0) console.log("No artifact, API, or token contract changes detected.");
  else {
    console.log("| Severity | Area | Contract | Change |\n| --- | --- | --- | --- |");
    for (const item of changes) console.log(`| ${item.severity} | ${item.area} | ${item.name} | ${item.change} |`);
  }
}
