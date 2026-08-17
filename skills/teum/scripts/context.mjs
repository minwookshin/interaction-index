#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(resolve(skillRoot, "references/catalog.json"), "utf8"));
const args = process.argv.slice(2);
const valueAfter = (flag, fallback = "") => {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : (args[index + 1] ?? fallback);
};
const project = resolve(valueAfter("--project", process.cwd()));
const task = valueAfter("--task");

async function exists(path) {
  return access(path).then(() => true, () => false);
}

const componentsPath = resolve(project, "components.json");
const components = await readFile(componentsPath, "utf8").then(JSON.parse, () => null);
const normalize = (value) => value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const normalizedTask = normalize(task);
const candidates = catalog.recipes.map((recipe) => {
  const matchedSignals = recipe.signals.filter((signal) => normalizedTask.includes(normalize(signal)));
  const score = matchedSignals.reduce((total, signal) => total + normalize(signal).split(" ").length, 0);
  return { recipe, score, matchedSignals };
}).filter((candidate) => candidate.score > 0)
  .sort((left, right) => right.score - left.score || left.recipe.id.localeCompare(right.recipe.id));
const match = candidates[0] ?? null;
const uiAlias = components?.aliases?.ui ?? "components/ui";
const libAlias = components?.aliases?.lib ?? "lib";
const installed = [];
for (const item of catalog.components) {
  const relative = item.type === "registry:ui" || item.type === "registry:component"
    ? `${uiAlias.replace(/^@\//, "src/")}/${item.id}.tsx`
    : `${libAlias.replace(/^@\//, "src/")}/${item.id}.ts`;
  if (await exists(resolve(project, relative))) installed.push(item.id);
}
const registryTemplate = `https://teum.minwookshin.com/r/v/${catalog.version}/{name}.json`;

console.log(JSON.stringify({
  schemaVersion: 1,
  project,
  configured: Boolean(components),
  aliases: components?.aliases ?? null,
  installed,
  task: task || null,
  match: match ? {
    id: match.recipe.id,
    title: match.recipe.title,
    score: match.score,
    matchedSignals: match.matchedSignals,
    registryItem: match.recipe.registryItem,
    modulePath: match.recipe.modulePath,
    exportName: match.recipe.exportName,
    components: match.recipe.components,
    rules: match.recipe.rules,
    forbidden: match.recipe.forbidden,
  } : null,
  commands: {
    connect: `npx shadcn@4.18.0 registry add @teum-pinned=${registryTemplate}`,
    install: match ? `npx shadcn@4.18.0 add @teum-pinned/${match.recipe.registryItem}` : null,
  },
}, null, 2));
