import { readFile } from "node:fs/promises";

function fail(message) {
  throw new Error(`[figma] ${message}`);
}

const tokens = JSON.parse(await readFile("tokens/generated/figma-variables.json", "utf8"));
const library = JSON.parse(await readFile("figma/generated/library-manifest.json", "utf8"));
const registry = JSON.parse(await readFile("registry.json", "utf8"));

if (tokens.schemaVersion !== 2) fail("token handoff must use schemaVersion 2");
if (tokens.counts.sourceTokens !== 145) fail(`expected 145 source tokens, found ${tokens.counts.sourceTokens}`);
if (tokens.counts.variables !== 138 || tokens.variables.length !== 138) fail("expected 138 bindable or Dev Mode variables");
if (tokens.counts.textStyles !== 7 || tokens.textStyles.length !== 7) fail("expected 7 text styles");
if (tokens.counts.effectStyles !== 14 || tokens.effectStyles.length !== 14) fail("expected 14 Light/Dark effect styles");
if (tokens.collections.length !== 2) fail("expected Foundation and Theme variable collections");
if (tokens.collections[0].modes.join() !== "Value") fail("Foundation must have one Value mode");
if (tokens.collections[1].modes.join() !== "Light,Dark") fail("Theme must have Light and Dark modes");

const variableNames = new Set(tokens.variables.map((variable) => variable.name));
if (variableNames.size !== tokens.variables.length) fail("Figma variable names must be unique");
for (const variable of tokens.variables) {
  if (variable.scopes.includes("ALL_SCOPES")) fail(`${variable.name} uses ALL_SCOPES`);
  if (!/^var\(--teum-[a-z0-9-]+\)$/.test(variable.codeSyntax?.WEB ?? "")) fail(`${variable.name} has invalid WEB code syntax`);
  for (const value of Object.values(variable.values)) {
    if (value?.alias && !variableNames.has(value.alias)) fail(`${variable.name} aliases missing variable ${value.alias}`);
  }
}

if (new Set(tokens.textStyles.map((style) => style.name)).size !== tokens.textStyles.length) fail("text style names must be unique");
if (new Set(tokens.effectStyles.map((style) => style.name)).size !== tokens.effectStyles.length) fail("effect style names must be unique");
if (tokens.textStyles.some((style) => style.fontFamilyCandidates[0] !== "Inter")) fail("UI text styles must prefer Inter");

for (const style of tokens.effectStyles) {
  if (!style.effects.length) fail(`${style.name} has no effects`);
  for (const effect of style.effects) {
    if (!["DROP_SHADOW", "INNER_SHADOW"].includes(effect.type)) fail(`${style.name} has unsupported effect ${effect.type}`);
    for (const channel of ["r", "g", "b", "a"]) {
      if (effect.color[channel] < 0 || effect.color[channel] > 1) fail(`${style.name} has out-of-range ${channel}`);
    }
  }
}

const registryIds = registry.items.filter((item) => item.type === "registry:ui").map((item) => item.name).sort();
const libraryIds = library.components.map((component) => component.id).sort();
if (JSON.stringify(registryIds) !== JSON.stringify(libraryIds)) fail("Figma components must exactly match the registry components");
if (new Set(library.pages.map((page) => page.name)).size !== library.pages.length) fail("Figma page names must be unique");
if (library.pages.some((page) => /Perception Lab/i.test(page.name))) fail("Perception Lab must not be included");
if (library.components.some((component) => component.designContract.states.length === 0)) fail("every component needs explicit state coverage");
if (library.components.some((component) => component.designContract.keyboard.length === 0)) fail("every component needs a keyboard contract");
if (library.components.some((component) => component.componentSet.representativeVariantCount !== component.componentSet.representativeVariants.length)) fail("representative variant counts are stale");
if (library.components.find((component) => component.id === "table")?.componentSet.axes.Align) fail("Table must not expose legacy HTML align as a design axis");

const remoteReady = library.components.filter((component) => component.figma.componentSetId || component.figma.publishedKey || component.codeConnect.nodeId);
if (library.file.fileKey === null && remoteReady.length > 0) fail("remote IDs cannot exist before a real file key is recorded");
if (library.publication.figmaLibraryStatus === "not created" && library.publication.codeConnectStatus.startsWith("connected")) fail("Code Connect cannot be connected before the library exists");

console.log(`[figma] verified ${tokens.variables.length} variables, ${tokens.textStyles.length} text styles, ${tokens.effectStyles.length} effect styles, ${library.components.length} components, and honest remote publication gates`);
