import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import ts from "@typescript/typescript6";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const outputRoot = resolve(root, "figma/generated");
const manifestPath = resolve(outputRoot, "library-manifest.json");
const reportPath = resolve(outputRoot, "build-plan.md");

const COMPONENT_GROUPS = [
  { name: "Controls", ids: ["button", "icon-button", "field", "input-group", "kbd", "button-group", "toolbar", "text-field", "textarea", "checkbox", "radio-group", "switch", "select", "context-switcher", "combobox", "search-input", "number-field", "date-picker", "segmented-control"] },
  { name: "Overlays", ids: ["tooltip", "popover", "menu", "context-menu", "dialog", "sheet", "alert-dialog"] },
  { name: "Navigation", ids: ["tabs", "breadcrumbs", "pagination"] },
  { name: "Disclosure", ids: ["collapsible"] },
  { name: "Feedback", ids: ["toast", "progress", "spinner", "skeleton", "alert", "empty-state"] },
  { name: "Data display", ids: ["badge", "avatar", "table", "tree"] },
  { name: "Interaction", ids: ["reorderable-list", "inline-edit", "action-list", "shared-detail", "undo-stack"] },
];

const AXIS_PROP_ALLOWLIST = new Set([
  "variant", "size", "orientation", "status", "radius", "side", "align", "live", "motionPreset",
]);

const AXIS_DEFAULTS = {
  button: { Variant: "Primary", Size: "Medium" },
  "icon-button": { Variant: "Primary", Size: "Medium" },
  "segmented-control": { Orientation: "Horizontal", Size: "Medium" },
  "radio-group": { Orientation: "Vertical" },
  badge: { Variant: "Neutral" },
  avatar: { Size: "Medium", Status: "Offline" },
  progress: { Size: "Medium" },
  spinner: { Size: "Medium" },
  alert: { Variant: "Neutral", Live: "Polite" },
  "empty-state": { Size: "Default" },
  skeleton: { Radius: "Medium" },
  "shared-detail": { "Motion Preset": "Continuity" },
};

const AXIS_BLOCKLIST = {
  table: new Set(["align"]),
};

function fail(message) {
  throw new Error(`[figma] ${message}`);
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function titleCase(value) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function compact(value, limit = 360) {
  return value.length <= limit ? value : `${value.slice(0, limit - 1)}…`;
}

async function loadGuidance() {
  const source = await readFile(resolve(root, "src/component-guidance.ts"), "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`;
  const module = await import(moduleUrl);
  return { guidance: module.componentGuidance, sourceHash: hash(source) };
}

function representativeVariants(id, documentedStates, axes) {
  const stateDefault = documentedStates[0] ?? "Default";
  const axisDefaults = {};
  for (const [axis, values] of Object.entries(axes)) {
    axisDefaults[axis] = AXIS_DEFAULTS[id]?.[axis] ?? values[0];
  }
  const variants = [{ State: stateDefault, ...axisDefaults }];
  for (const state of documentedStates.slice(1)) variants.push({ State: state, ...axisDefaults });
  for (const [axis, values] of Object.entries(axes)) {
    for (const value of values) variants.push({ State: stateDefault, ...axisDefaults, [axis]: value });
  }
  const deduped = new Map(variants.map((variant) => [JSON.stringify(variant), variant]));
  return [...deduped.values()];
}

const [registrySource, apiSource, figmaTokenSource, guidanceResult] = await Promise.all([
  readFile(resolve(root, "registry.json"), "utf8"),
  readFile(resolve(root, "api/generated/public-api.json"), "utf8"),
  readFile(resolve(root, "tokens/generated/figma-variables.json"), "utf8"),
  loadGuidance(),
]);

const registry = JSON.parse(registrySource);
const api = JSON.parse(apiSource);
const figmaTokens = JSON.parse(figmaTokenSource);
const guidance = guidanceResult.guidance;
const registryItems = new Map(registry.items.filter((item) => item.type === "registry:ui").map((item) => [item.name, item]));
const componentIds = COMPONENT_GROUPS.flatMap((group) => group.ids);

const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
if (!configPath) fail("tsconfig.json was not found");
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
if (configFile.error) fail(ts.flattenDiagnosticMessageText(configFile.error.messageText, "\n"));
const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, dirname(configPath), {
  noEmit: true,
  incremental: false,
}, configPath);
const apiProgram = ts.createProgram({
  rootNames: [resolve(root, "src/components/ui/index.ts")],
  options: parsedConfig.options,
});
const apiChecker = apiProgram.getTypeChecker();

function extractAxes(id) {
  const sourcePath = resolve(root, api.components[id].source);
  const sourceFile = apiProgram.getSourceFile(sourcePath);
  const moduleSymbol = sourceFile && apiChecker.getSymbolAtLocation(sourceFile);
  if (!sourceFile || !moduleSymbol) fail(`${id} could not be inspected for Figma axes`);
  const axes = {};
  const propExports = apiChecker.getExportsOfModule(moduleSymbol).filter((symbol) => symbol.name.endsWith("Props"));
  for (const exportedSymbol of propExports) {
    const target = exportedSymbol.flags & ts.SymbolFlags.Alias ? apiChecker.getAliasedSymbol(exportedSymbol) : exportedSymbol;
    const type = apiChecker.getDeclaredTypeOfSymbol(target);
    for (const prop of apiChecker.getPropertiesOfType(type)) {
      if (!AXIS_PROP_ALLOWLIST.has(prop.name)) continue;
      if (AXIS_BLOCKLIST[id]?.has(prop.name)) continue;
      const declaration = prop.valueDeclaration ?? prop.declarations?.[0];
      if (!declaration) continue;
      const propType = apiChecker.getTypeOfSymbolAtLocation(prop, declaration);
      const parts = propType.isUnion() ? propType.types : [propType];
      const values = parts
        .filter((part) => (part.flags & ts.TypeFlags.StringLiteral) !== 0)
        .map((part) => titleCase(part.value));
      if (values.length < 2) continue;
      const axis = titleCase(prop.name);
      axes[axis] = [...new Set([...(axes[axis] ?? []), ...values])];
    }
  }
  return axes;
}

if (new Set(componentIds).size !== componentIds.length) fail("component grouping contains duplicate IDs");
if (componentIds.length !== registryItems.size) fail(`component grouping exposes ${componentIds.length} IDs while registry exposes ${registryItems.size}`);
if (api.componentCount !== registryItems.size) fail(`API manifest exposes ${api.componentCount} components while registry exposes ${registryItems.size}`);
for (const id of componentIds) {
  if (!registryItems.has(id)) fail(`${id} is missing from registry.json`);
  if (!api.components[id]) fail(`${id} is missing from api/generated/public-api.json`);
  if (!guidance[id]) fail(`${id} is missing from src/component-guidance.ts`);
}

const componentPages = componentIds.map((id, index) => {
  const registryItem = registryItems.get(id);
  const contract = guidance[id];
  const axes = extractAxes(id);
  const variants = representativeVariants(id, contract.states, axes);
  const group = COMPONENT_GROUPS.find((candidate) => candidate.ids.includes(id)).name;
  const pageNumber = String(index + 2).padStart(2, "0");
  return {
    id,
    name: registryItem.title ?? titleCase(id),
    page: `${pageNumber} ${registryItem.title ?? titleCase(id)}`,
    group,
    description: registryItem.description ?? contract.productCase,
    source: contract.source,
    maturity: contract.maturity,
    designContract: {
      productCase: contract.productCase,
      useWhen: contract.useWhen,
      avoidWhen: contract.avoidWhen,
      states: contract.states,
      keyboard: contract.keyboard,
      quality: contract.quality,
    },
    componentSet: {
      name: registryItem.title ?? titleCase(id),
      axes: { State: contract.states, ...axes },
      defaultVariant: variants[0],
      representativeVariants: variants,
      representativeVariantCount: variants.length,
      strategy: "behavior states plus one-at-a-time public code-axis coverage; avoid meaningless Cartesian products",
    },
    code: {
      source: api.components[id].source,
      sourceHash: api.components[id].sourceHash,
      declaration: api.components[id].declaration,
      publicExports: api.components[id].exports.map(({ name, kind, signature }) => ({ name, kind, signature: compact(signature) })),
      registryDependencies: registryItem.registryDependencies ?? [],
      packageDependencies: registryItem.dependencies ?? [],
    },
    figma: {
      pageId: null,
      componentSetId: null,
      publishedKey: null,
      validationScreenshot: null,
    },
    codeConnect: {
      status: "pending-published-node",
      nodeId: null,
      source: api.components[id].source,
      componentName: api.components[id].exports.find((item) => item.kind === "function")?.name ?? registryItem.title,
    },
  };
});

const pages = [
  { name: "00 Cover", purpose: "Library identity, private-alpha status, and source-of-truth note." },
  { name: "01 Foundations", purpose: "Variables, text styles, effect styles, and usage specimens." },
  ...componentPages.map((component) => ({ name: component.page, purpose: `${component.name} component set, anatomy, states, and code contract.` })),
  { name: "90 Interaction Patterns", purpose: "Shared Detail, Action List, Undo Stack, and Inline Edit compositions." },
  { name: "99 Documentation", purpose: "Release gates, accessibility scope, and Code Connect status." },
];

const manifest = {
  schemaVersion: 1,
  generatedBy: "scripts/build-figma-handoff.mjs",
  runId: "interaction-index-2026-08-14",
  file: {
    name: "Interaction Index - Design System",
    fileKey: null,
    url: null,
    selectedPlanKey: null,
    selectionRequired: true,
  },
  sourceOfTruth: {
    tokens: "tokens/interaction-index.tokens.json",
    api: "api/generated/public-api.json",
    registry: "registry.json",
    guidance: "src/component-guidance.ts",
    hashes: {
      registry: hash(registrySource),
      api: hash(apiSource),
      figmaTokens: hash(figmaTokenSource),
      guidance: guidanceResult.sourceHash,
    },
  },
  foundations: {
    collections: figmaTokens.collections,
    variables: figmaTokens.counts.variables,
    textStyles: figmaTokens.counts.textStyles,
    effectStyles: figmaTokens.counts.effectStyles,
    sourceTokens: figmaTokens.counts.sourceTokens,
  },
  pages,
  groups: COMPONENT_GROUPS,
  components: componentPages,
  interactionPatterns: [
    { id: "edit-in-place", title: "Edit in place", builtFrom: ["inline-edit"] },
    { id: "find-and-act", title: "Find and act", builtFrom: ["action-list"] },
    { id: "preserve-context", title: "Preserve context", builtFrom: ["shared-detail"] },
    { id: "recover-from-action", title: "Recover from action", builtFrom: ["undo-stack"] },
  ],
  exclusions: [
    "Perception Lab",
    "private Linear or Codex assets and implementation details",
    "unverified production adoption",
    "public npm publication before its release gates pass",
  ],
  publication: {
    sourceLicense: "MIT",
    packageStatus: "private prerelease",
    figmaLibraryStatus: "not created",
    codeConnectStatus: "not eligible until real component nodes are published on a supported Figma plan",
  },
};

const report = [
  "# Interaction Index Figma library build plan",
  "",
  "> Generated from the DTCG tokens, TypeScript public API, registry, and component behavior contracts. Do not edit directly.",
  "",
  "## Foundation",
  "",
  `- ${manifest.foundations.sourceTokens} source tokens`,
  `- ${manifest.foundations.variables} Figma variables in Foundation and Theme collections`,
  `- ${manifest.foundations.textStyles} text styles`,
  `- ${manifest.foundations.effectStyles} Light/Dark effect styles`,
  "",
  "## File structure",
  "",
  ...pages.map((page) => `- **${page.name}** — ${page.purpose}`),
  "",
  "## Component sets",
  "",
  ...componentPages.map((component) => `- **${component.name}** · ${component.group} · ${component.designContract.states.length} documented states · ${component.componentSet.representativeVariantCount} representative variants · \`${component.code.source}\``),
  "",
  "## Honest release gates",
  "",
  "- A target Figma plan and file must be selected before any remote write.",
  "- Component node IDs and published keys remain null until the nodes actually exist and are published.",
  "- Code Connect remains pending until the plan supports it and the real published nodes can be inspected.",
  "- This handoff does not claim external adoption or npm publication.",
  "",
].join("\n");

const expected = new Map([
  [manifestPath, `${JSON.stringify(manifest, null, 2)}\n`],
  [reportPath, report],
]);

for (const [path, content] of expected) {
  if (checkOnly) {
    const current = await readFile(path, "utf8").catch(() => null);
    if (current !== content) fail(`${path.slice(root.length + 1)} is stale; run npm run build:figma`);
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content, "utf8");
  }
}

console.log(`[figma] ${checkOnly ? "verified" : "generated"} ${manifest.foundations.variables} variables, ${manifest.foundations.textStyles} text styles, ${manifest.foundations.effectStyles} effect styles, and ${manifest.components.length} component specifications`);
