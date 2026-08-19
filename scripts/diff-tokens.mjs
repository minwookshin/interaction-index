import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { collectTokens, formatCssValue, TOKEN_SOURCE } from "./token-utils.mjs";

const root = process.cwd();
const base = process.argv[2] ?? "HEAD";
if (!/^[A-Za-z0-9_./~^:-]+$/.test(base)) throw new Error(`[tokens] invalid git reference ${base}.`);

const currentDocument = JSON.parse(await readFile(resolve(root, TOKEN_SOURCE), "utf8"));
const current = collectTokens(currentDocument);
let previous;
try {
  const source = execFileSync("git", ["show", `${base}:${TOKEN_SOURCE}`], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  previous = collectTokens(JSON.parse(source));
} catch {
  previous = collectTokens({
    $extensions: { "dev.whatiuse": { modes: ["light", "dark"] } },
    empty: { $extensions: { "dev.whatiuse": { cssPrefix: "--whatiuse-" } } },
  });
}

function snapshot(model) {
  return new Map(model.tokens.map((token) => [token.path, {
    type: token.type,
    cssVariable: token.cssVariable,
    deprecated: token.deprecated,
    values: Object.fromEntries(model.modes.map((mode) => [mode, formatCssValue(token, token.modes[mode] ?? token.value, model.byPath)])),
  }]));
}

const before = snapshot(previous);
const after = snapshot(current);
const added = [...after.keys()].filter((path) => !before.has(path));
const removed = [...before.keys()].filter((path) => !after.has(path));
const changed = [...after.keys()].filter((path) => before.has(path) && JSON.stringify(before.get(path)) !== JSON.stringify(after.get(path)));

console.log(`Token diff against ${base}`);
console.log(`Added: ${added.length} | Changed: ${changed.length} | Removed: ${removed.length}`);
for (const [label, paths] of [["ADDED", added], ["CHANGED", changed], ["REMOVED (breaking)", removed]]) {
  if (paths.length === 0) continue;
  console.log(`\n${label}`);
  paths.forEach((path) => console.log(`- ${path}`));
}

if (removed.length > 0) process.exitCode = 2;
