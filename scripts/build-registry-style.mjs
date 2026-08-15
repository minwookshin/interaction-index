import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const sourcePath = resolve(root, "src/styles.css");
const tokenSourcePath = resolve(root, "src/tokens/generated.css");
const tailwindBridgeSourcePath = resolve(root, "src/teum-tailwind.css");
const registryPath = resolve(root, "registry.json");
const generatedRoot = resolve(root, "registry");
const source = await readFile(sourcePath, "utf8");
const tokenSource = await readFile(tokenSourcePath, "utf8");
const tailwindBridgeSource = await readFile(tailwindBridgeSourcePath, "utf8");
const registry = JSON.parse(await readFile(registryPath, "utf8"));
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const componentItems = registry.items.filter((item) => item.type === "registry:ui");

const generatedHeader = "/* Generated from src/styles.css. Do not edit directly. */";
const layerOrder = "@layer teum.tokens, teum.base, teum.components;";
const fontImport = source.match(/^@import\s+[^;]+;/m)?.[0] ?? "";

function packageName(specifier) {
  if (specifier.startsWith("@")) {
    const separator = specifier.indexOf("@", specifier.indexOf("/") + 1);
    return separator === -1 ? specifier : specifier.slice(0, separator);
  }
  const separator = specifier.indexOf("@");
  return separator === -1 ? specifier : specifier.slice(0, separator);
}

function versionDependency(specifier) {
  const name = packageName(specifier);
  if (name !== specifier) return specifier;
  const version = packageJson.dependencies?.[name];
  if (!version) throw new Error(`Registry dependency ${name} is not declared in package.json dependencies.`);
  return `${name}@${version}`;
}

for (const item of registry.items) {
  if (item.dependencies) item.dependencies = item.dependencies.map(versionDependency);
}

function splitSelectors(value) {
  const selectors = [];
  let start = 0;
  let depth = 0;
  let quote = "";

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'") quote = character;
    else if (character === "(" || character === "[") depth += 1;
    else if (character === ")" || character === "]") depth -= 1;
    else if (character === "," && depth === 0) {
      selectors.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  selectors.push(value.slice(start).trim());
  return selectors.filter(Boolean);
}

function findBoundary(css, start) {
  let quote = "";
  let comment = false;
  for (let index = start; index < css.length; index += 1) {
    const character = css[index];
    const next = css[index + 1];
    if (comment) {
      if (character === "*" && next === "/") {
        comment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === "/" && next === "*") {
      comment = true;
      index += 1;
    } else if (character === '"' || character === "'") quote = character;
    else if (character === "{" || character === ";") return index;
  }
  return css.length;
}

function findClosingBrace(css, openIndex) {
  let depth = 1;
  let quote = "";
  let comment = false;
  for (let index = openIndex + 1; index < css.length; index += 1) {
    const character = css[index];
    const next = css[index + 1];
    if (comment) {
      if (character === "*" && next === "/") {
        comment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === "/" && next === "*") {
      comment = true;
      index += 1;
    } else if (character === '"' || character === "'") quote = character;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error("Unbalanced CSS block while building registry styles.");
}

function normalizeSelector(selector) {
  return selector
    .replace(/^:root\[data-theme=(?:"dark"|'dark'|dark)\]\s+/, "")
    .trim();
}

function filterCss(css, keepSelector) {
  const output = [];
  let cursor = 0;

  while (cursor < css.length) {
    while (/\s/.test(css[cursor] ?? "")) cursor += 1;
    if (css.startsWith("/*", cursor)) {
      const commentEnd = css.indexOf("*/", cursor + 2);
      cursor = commentEnd === -1 ? css.length : commentEnd + 2;
      continue;
    }
    if (cursor >= css.length) break;

    const boundary = findBoundary(css, cursor);
    if (boundary >= css.length) break;
    const prelude = css.slice(cursor, boundary).trim();
    if (css[boundary] === ";") {
      cursor = boundary + 1;
      continue;
    }

    const closingBrace = findClosingBrace(css, boundary);
    const body = css.slice(boundary + 1, closingBrace);
    if (prelude.startsWith("@keyframes")) {
      cursor = closingBrace + 1;
      continue;
    }

    if (/^@(media|supports|container|starting-style|layer)\b/.test(prelude)) {
      const filteredBody = filterCss(body, keepSelector);
      if (filteredBody.trim()) output.push(`${prelude} {\n${filteredBody}\n}`);
    } else if (!prelude.startsWith("@")) {
      const selectors = splitSelectors(prelude).filter(keepSelector);
      if (selectors.length > 0) output.push(`${selectors.join(",\n")} {${body}}`);
    }
    cursor = closingBrace + 1;
  }

  return output.join("\n\n");
}

function collectKeyframes(css) {
  const keyframes = new Map();
  const matcher = /@keyframes\s+(teum-[a-z0-9-]+)\s*\{/g;
  let match;
  while ((match = matcher.exec(css)) !== null) {
    const openIndex = css.indexOf("{", match.index);
    const closingBrace = findClosingBrace(css, openIndex);
    keyframes.set(match[1], css.slice(match.index, closingBrace + 1));
    matcher.lastIndex = closingBrace + 1;
  }
  return keyframes;
}

const keyframes = collectKeyframes(source);
const rootSelector = (selector) => /^:root(?:\[data-theme=(?:"dark"|'dark'|dark)\])?$/.test(selector.trim());
const baseSelectors = new Set([
  "*",
  "button",
  "input",
  "textarea",
  "select",
  '[role="option"]',
  "::selection",
  ":focus-visible",
]);
const baseSelector = (selector) => {
  const normalized = normalizeSelector(selector);
  return baseSelectors.has(normalized) || normalized.startsWith(".teum-sr-only");
};

const tokenRules = filterCss(tokenSource, rootSelector);
const baseRules = filterCss(source, baseSelector);
if (!tokenRules.includes("--teum-bg-canvas") || !baseRules.includes("box-sizing")) {
  throw new Error("Registry base extraction omitted required tokens or reset rules.");
}

const baseCss = [
  generatedHeader,
  fontImport,
  layerOrder,
  `@layer teum.tokens {\n${tokenRules}\n}`,
  `@layer teum.base {\n${baseRules}\n}`,
  "",
].filter(Boolean).join("\n\n");

function classNamesFromSource(componentSource) {
  return new Set(componentSource.match(/\bteum-[a-z0-9_-]+/g) ?? []);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function componentSelector(classNames) {
  const expressions = [...classNames].map((className) => new RegExp(`^\\.${escapeRegExp(className)}(?=$|[\\s.:[#>+~])`));
  const anywhereExpressions = [...classNames].map((className) => new RegExp(`\\.${escapeRegExp(className)}(?=$|[\\s.:[#>+~])`));
  return (selector) => {
    const normalized = normalizeSelector(selector);
    if (expressions.some((expression) => expression.test(normalized))) return true;
    return normalized.startsWith("[data-slot=") && anywhereExpressions.some((expression) => expression.test(normalized));
  };
}

async function componentOutput(item) {
  const sourceComponentPath = resolve(root, `src/components/ui/${item.name}.tsx`);
  const componentSource = await readFile(sourceComponentPath, "utf8");
  const classNames = classNamesFromSource(componentSource);
  if (classNames.size === 0) throw new Error(`${item.name} does not expose an teum-* component class.`);

  let rules = filterCss(source, componentSelector(classNames));
  const requiredKeyframes = [...keyframes.entries()]
    .filter(([name]) => rules.includes(name))
    .map(([, block]) => block);
  if (requiredKeyframes.length > 0) rules = `${rules}\n\n${requiredKeyframes.join("\n\n")}`;
  if (!rules.trim()) throw new Error(`No component CSS was extracted for ${item.name}.`);

  const layeredRules = `@layer teum.components {\n${rules}\n}`;
  const componentCss = `${generatedHeader}\n\n${layerOrder}\n\n${layeredRules}\n`;
  const generatedComponentPath = resolve(generatedRoot, `styles/components/${item.name}.css`);
  const generatedSourcePath = resolve(generatedRoot, `components/ui/${item.name}.tsx`);
  await mkdir(resolve(generatedRoot, "styles/components"), { recursive: true });
  await mkdir(resolve(generatedRoot, "components/ui"), { recursive: true });
  await writeFile(generatedComponentPath, componentCss, "utf8");
  await writeFile(
    generatedSourcePath,
    `import "../../styles/teum-base.css";\nimport "../../styles/components/${item.name}.css";\n${componentSource}`,
    "utf8",
  );

  const files = [
    {
      path: `registry/components/ui/${item.name}.tsx`,
      type: "registry:ui",
      target: `components/ui/${item.name}.tsx`,
    },
    {
      path: `registry/styles/components/${item.name}.css`,
      type: "registry:style",
      target: `styles/components/${item.name}.css`,
    },
  ];

  if (item.name === "shared-detail") {
    await copyFile(
      resolve(root, "src/components/ui/shared-detail-motion.ts"),
      resolve(generatedRoot, "components/ui/shared-detail-motion.ts"),
    );
    files.splice(1, 0, {
      path: "registry/components/ui/shared-detail-motion.ts",
      type: "registry:lib",
      target: "components/ui/shared-detail-motion.ts",
    });
  }

  return { files, layeredRules, bytes: Buffer.byteLength(componentCss) };
}

await rm(generatedRoot, { recursive: true, force: true });
await mkdir(resolve(generatedRoot, "lib"), { recursive: true });
await mkdir(resolve(generatedRoot, "styles/components"), { recursive: true });
await mkdir(resolve(generatedRoot, "components/ui"), { recursive: true });

await copyFile(resolve(root, "src/lib/cn.ts"), resolve(generatedRoot, "lib/cn.ts"));
await copyFile(resolve(root, "src/lib/behavior-contract.ts"), resolve(generatedRoot, "lib/behavior-contract.ts"));
await copyFile(resolve(root, "src/components/ui/index.ts"), resolve(generatedRoot, "components/ui/index.ts"));
await writeFile(resolve(generatedRoot, "styles/teum-base.css"), baseCss, "utf8");
await writeFile(resolve(generatedRoot, "styles/teum-tailwind.css"), tailwindBridgeSource, "utf8");

const componentResults = new Map();
for (const item of componentItems) componentResults.set(item.name, await componentOutput(item));

const registryAggregator = [
  generatedHeader,
  '@import "./teum-base.css";',
  "",
].join("\n");
await writeFile(resolve(generatedRoot, "styles/teum.css"), registryAggregator, "utf8");

const expandedAggregator = [
  baseCss.trim(),
  ...componentItems.map((item) => componentResults.get(item.name).layeredRules),
].join("\n\n");
await writeFile(resolve(root, "src/teum.css"), `${expandedAggregator}\n`, "utf8");

const baseItem = registry.items.find((item) => item.name === "teum-base");
baseItem.description = "Inter, semantic monochrome tokens, global accessibility defaults, and the documented cascade contract.";
baseItem.files = [
  { path: "registry/lib/cn.ts", type: "registry:lib", target: "lib/cn.ts" },
  { path: "registry/lib/behavior-contract.ts", type: "registry:lib", target: "lib/behavior-contract.ts" },
  { path: "registry/styles/teum-base.css", type: "registry:style", target: "styles/teum-base.css" },
];

const tailwindItem = registry.items.find((item) => item.name === "teum-tailwind");
tailwindItem.description = "Optional Tailwind CSS v4 semantic utility mapping backed by the same Teum tokens.";
tailwindItem.files = [
  { path: "registry/styles/teum-tailwind.css", type: "registry:style", target: "styles/teum-tailwind.css" },
];

for (const item of componentItems) item.files = componentResults.get(item.name).files;

const completeSystem = registry.items.find((item) => item.name === "teum");
completeSystem.files = [
  ...baseItem.files,
  {
    path: "registry/styles/teum.css",
    type: "registry:style",
    target: "styles/teum.css",
  },
  ...componentItems.flatMap((item) => item.files),
  {
    path: "registry/components/ui/index.ts",
    type: "registry:ui",
    target: "components/ui/index.ts",
  },
];

await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");

const componentBytes = [...componentResults.values()].reduce((total, result) => total + result.bytes, 0);
console.log(`[registry-style] generated ${componentItems.length} scoped component styles (${componentBytes} bytes) plus ${Buffer.byteLength(baseCss)} base bytes`);
