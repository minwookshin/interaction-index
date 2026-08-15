import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const TOKEN_EXTENSION = "dev.teum";
export const TOKEN_SOURCE = "tokens/teum.tokens.json";
export const TOKEN_OUTPUTS = {
  css: "src/tokens/generated.css",
  typescript: "src/tokens/generated.ts",
  figma: "tokens/generated/figma-variables.json",
  manifest: "tokens/generated/token-manifest.json",
};

const FONT_WEIGHT_NAMES = new Set([
  "thin", "hairline", "extra-light", "ultra-light", "light", "normal", "regular", "book",
  "medium", "semi-bold", "demi-bold", "bold", "extra-bold", "ultra-bold", "black", "heavy",
  "extra-black", "ultra-black",
]);
const GENERIC_FONT_FAMILIES = new Set([
  "serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-serif",
  "ui-sans-serif", "ui-monospace", "ui-rounded", "emoji", "math", "fangsong",
]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isAlias(value) {
  return typeof value === "string" && /^\{[^{}]+\}$/.test(value);
}

function aliasPath(value) {
  return value.slice(1, -1);
}

function tokenExtension(value) {
  return isObject(value?.$extensions?.[TOKEN_EXTENSION]) ? value.$extensions[TOKEN_EXTENSION] : {};
}

function assert(condition, message) {
  if (!condition) throw new Error(`[tokens] ${message}`);
}

function validateName(name, path) {
  assert(!name.startsWith("$"), `${path}: token and group names cannot start with $.`);
  assert(!/[{}.]/.test(name), `${path}: token and group names cannot contain {, }, or .`);
}

function validateDimension(value, path) {
  assert(isObject(value), `${path}: expected a dimension object.`);
  assert(Number.isFinite(value.value), `${path}: dimension value must be finite.`);
  assert(value.unit === "px" || value.unit === "rem", `${path}: dimension unit must be px or rem.`);
}

function validateDuration(value, path) {
  assert(isObject(value), `${path}: expected a duration object.`);
  assert(Number.isFinite(value.value), `${path}: duration value must be finite.`);
  assert(value.unit === "ms" || value.unit === "s", `${path}: duration unit must be ms or s.`);
}

function validateColor(value, path) {
  if (isAlias(value)) return;
  assert(isObject(value), `${path}: expected a color object or alias.`);
  assert(["srgb", "display-p3", "oklch"].includes(value.colorSpace), `${path}: unsupported color space ${value.colorSpace}.`);
  assert(Array.isArray(value.components) && value.components.length === 3, `${path}: color requires three components.`);
  value.components.forEach((component, index) => assert(Number.isFinite(component), `${path}: color component ${index} must be finite.`));
  if (value.alpha !== undefined) assert(Number.isFinite(value.alpha) && value.alpha >= 0 && value.alpha <= 1, `${path}: alpha must be between 0 and 1.`);
  if (value.hex !== undefined) assert(/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(value.hex), `${path}: hex fallback must use six or eight digits.`);
}

function validateShadow(value, path, validateReference) {
  const layers = Array.isArray(value) ? value : [value];
  assert(layers.length > 0, `${path}: shadow needs at least one layer.`);
  layers.forEach((layer, index) => {
    const layerPath = `${path}[${index}]`;
    if (isAlias(layer)) return validateReference(layer, layerPath, "shadow");
    assert(isObject(layer), `${layerPath}: expected a shadow object or alias.`);
    if (isAlias(layer.color)) validateReference(layer.color, `${layerPath}.color`, "color");
    else validateColor(layer.color, `${layerPath}.color`);
    validateDimension(layer.offsetX, `${layerPath}.offsetX`);
    validateDimension(layer.offsetY, `${layerPath}.offsetY`);
    validateDimension(layer.blur, `${layerPath}.blur`);
    validateDimension(layer.spread, `${layerPath}.spread`);
    if (layer.inset !== undefined) assert(typeof layer.inset === "boolean", `${layerPath}.inset must be boolean.`);
  });
}

function validateTypedValue(value, type, path, validateReference) {
  if (isAlias(value)) return validateReference(value, path, type);
  switch (type) {
    case "color": return validateColor(value, path);
    case "dimension": return validateDimension(value, path);
    case "duration": return validateDuration(value, path);
    case "number": return assert(Number.isFinite(value), `${path}: number token must be finite.`);
    case "fontFamily":
      return assert(typeof value === "string" || (Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string")), `${path}: fontFamily must be a string or non-empty string array.`);
    case "fontWeight":
      return assert((Number.isFinite(value) && value >= 1 && value <= 1000) || FONT_WEIGHT_NAMES.has(value), `${path}: fontWeight must be 1-1000 or a supported keyword.`);
    case "cubicBezier":
      assert(Array.isArray(value) && value.length === 4 && value.every(Number.isFinite), `${path}: cubicBezier requires four finite numbers.`);
      assert(value[0] >= 0 && value[0] <= 1 && value[2] >= 0 && value[2] <= 1, `${path}: cubicBezier x coordinates must be between 0 and 1.`);
      return;
    case "shadow": return validateShadow(value, path, validateReference);
    default: throw new Error(`[tokens] ${path}: unsupported DTCG type ${type}.`);
  }
}

export function collectTokens(document) {
  assert(isObject(document), "source must be a JSON object.");
  const rootExtension = tokenExtension(document);
  const modes = rootExtension.modes ?? ["light", "dark"];
  assert(Array.isArray(modes) && modes.length > 0 && modes.every((mode) => typeof mode === "string"), "root extension modes must be a non-empty string array.");
  assert(modes[0] === "light", "light must remain the default token mode.");

  const tokens = [];
  function walk(node, path = [], context = {}) {
    const extension = { ...context.extension, ...tokenExtension(node) };
    const type = node.$type ?? context.type;
    for (const [name, child] of Object.entries(node)) {
      if (name.startsWith("$")) continue;
      const nextPath = [...path, name];
      validateName(name, nextPath.join("."));
      assert(isObject(child), `${nextPath.join(".")}: groups and tokens must be objects.`);
      if (Object.hasOwn(child, "$value")) {
        const childExtension = { ...extension, ...tokenExtension(child) };
        const tokenType = child.$type ?? type;
        assert(typeof tokenType === "string", `${nextPath.join(".")}: token type is required or must be inherited.`);
        const cssVariable = childExtension.cssVariable ?? `${childExtension.cssPrefix ?? "--teum-"}${name}`;
        assert(/^--[a-z0-9-]+$/.test(cssVariable), `${nextPath.join(".")}: invalid CSS variable ${cssVariable}.`);
        tokens.push({
          path: nextPath.join("."),
          name,
          type: tokenType,
          value: child.$value,
          description: child.$description ?? "",
          deprecated: child.$deprecated ?? false,
          cssVariable,
          cssUnit: childExtension.cssUnit,
          scope: childExtension.scope ?? "system",
          modes: childExtension.modeValues ?? {},
        });
      } else {
        walk(child, nextPath, { type, extension });
      }
    }
  }
  walk(document);

  const byPath = new Map(tokens.map((token) => [token.path, token]));
  assert(byPath.size === tokens.length, "token paths must be unique.");
  const cssVariables = new Set();
  tokens.forEach((token) => {
    assert(!cssVariables.has(token.cssVariable), `${token.path}: duplicate CSS variable ${token.cssVariable}.`);
    cssVariables.add(token.cssVariable);
  });

  const validateReference = (reference, path, expectedType) => {
    const target = byPath.get(aliasPath(reference));
    assert(target, `${path}: unresolved alias ${reference}.`);
    assert(target.type === expectedType, `${path}: ${reference} is ${target.type}, expected ${expectedType}.`);
  };
  tokens.forEach((token) => {
    validateTypedValue(token.value, token.type, `${token.path}.$value`, validateReference);
    for (const [mode, value] of Object.entries(token.modes)) {
      assert(modes.includes(mode), `${token.path}: unknown mode ${mode}.`);
      validateTypedValue(value, token.type, `${token.path}.$extensions.${TOKEN_EXTENSION}.modeValues.${mode}`, validateReference);
    }
    if (token.deprecated !== false) assert(token.deprecated === true || typeof token.deprecated === "string", `${token.path}: $deprecated must be boolean or string.`);
  });

  const resolveToken = (token, mode, stack = []) => {
    const value = token.modes[mode] ?? token.value;
    if (!isAlias(value)) return value;
    const targetPath = aliasPath(value);
    assert(!stack.includes(targetPath), `${token.path}: circular alias ${[...stack, targetPath].join(" -> ")}.`);
    return resolveToken(byPath.get(targetPath), mode, [...stack, token.path]);
  };
  tokens.forEach((token) => modes.forEach((mode) => resolveToken(token, mode)));
  return { document, tokens, byPath, modes, resolveToken };
}

function tidyNumber(value) {
  if (Object.is(value, -0)) return "0";
  return Number(value.toFixed(6)).toString();
}

function formatDimension(value) {
  return `${tidyNumber(value.value)}${value.unit}`;
}

function formatColor(value, byPath) {
  if (isAlias(value)) return `var(${byPath.get(aliasPath(value)).cssVariable})`;
  const alpha = value.alpha ?? 1;
  if (value.colorSpace === "oklch") {
    const [lightness, chroma, hue] = value.components.map(tidyNumber);
    return alpha === 1 ? `oklch(${lightness} ${chroma} ${hue})` : `oklch(${lightness} ${chroma} ${hue} / ${tidyNumber(alpha)})`;
  }
  if (alpha === 1 && value.hex) return value.hex.toLowerCase();
  const fn = value.colorSpace === "display-p3" ? "color(display-p3" : "rgb(";
  if (value.colorSpace === "display-p3") {
    const components = value.components.map(tidyNumber).join(" ");
    return `${fn} ${components}${alpha === 1 ? "" : ` / ${tidyNumber(alpha)}`})`;
  }
  const components = value.components.map((component) => Math.round(component * 255)).join(" ");
  return `${fn}${components}${alpha === 1 ? "" : ` / ${tidyNumber(alpha)}`})`;
}

function formatFontFamily(value) {
  const values = Array.isArray(value) ? value : [value];
  return values.map((family) => {
    if (GENERIC_FONT_FAMILIES.has(family) || /^[-a-z0-9]+$/i.test(family)) return family;
    return `"${family.replaceAll('"', '\\"')}"`;
  }).join(", ");
}

function formatShadow(value, byPath) {
  const layers = Array.isArray(value) ? value : [value];
  return layers.map((layer) => {
    if (isAlias(layer)) return `var(${byPath.get(aliasPath(layer)).cssVariable})`;
    return [
      layer.inset ? "inset" : "",
      formatDimension(layer.offsetX),
      formatDimension(layer.offsetY),
      formatDimension(layer.blur),
      formatDimension(layer.spread),
      formatColor(layer.color, byPath),
    ].filter(Boolean).join(" ");
  }).join(", ");
}

export function formatCssValue(token, value, byPath) {
  if (isAlias(value)) return `var(${byPath.get(aliasPath(value)).cssVariable})`;
  switch (token.type) {
    case "color": return formatColor(value, byPath);
    case "dimension": return formatDimension(value);
    case "duration": return `${tidyNumber(value.value)}${value.unit}`;
    case "number": return `${tidyNumber(value)}${token.cssUnit ?? ""}`;
    case "fontWeight": return String(value);
    case "fontFamily": return formatFontFamily(value);
    case "cubicBezier": return `cubic-bezier(${value.map(tidyNumber).join(", ")})`;
    case "shadow": return formatShadow(value, byPath);
    default: throw new Error(`[tokens] Cannot format ${token.path} (${token.type}) for CSS.`);
  }
}

function generatedJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function generateCss(model) {
  const base = model.tokens.map((token) => `  ${token.cssVariable}: ${formatCssValue(token, token.value, model.byPath)};`);
  const dark = model.tokens
    .filter((token) => Object.hasOwn(token.modes, "dark"))
    .map((token) => `  ${token.cssVariable}: ${formatCssValue(token, token.modes.dark, model.byPath)};`);
  return [
    "/* Generated from tokens/teum.tokens.json. Do not edit directly. */",
    "",
    ":root {",
    "  color-scheme: light;",
    "  font-family: var(--teum-font-ui);",
    "  font-synthesis: none;",
    "  font-optical-sizing: auto;",
    "  text-rendering: optimizeLegibility;",
    ...base,
    "}",
    "",
    ':root[data-theme="dark"] {',
    "  color-scheme: dark;",
    ...dark,
    "}",
    "",
  ].join("\n");
}

export function generateTypescript(model) {
  const manifest = model.tokens.map((token) => ({
    path: token.path,
    type: token.type,
    description: token.description,
    deprecated: token.deprecated,
    cssVariable: token.cssVariable,
    scope: token.scope,
    values: Object.fromEntries(model.modes.map((mode) => [mode, formatCssValue(token, token.modes[mode] ?? token.value, model.byPath)])),
    resolvedValues: Object.fromEntries(model.modes.map((mode) => [mode, formatCssValue(token, model.resolveToken(token, mode), model.byPath)])),
  }));
  const paths = manifest.map((token) => token.path);
  return [
    "/* Generated from tokens/teum.tokens.json. Do not edit directly. */",
    "",
    `export const tokenModes = ${JSON.stringify(model.modes)} as const;`,
    "export type TokenMode = (typeof tokenModes)[number];",
    `export const tokenPaths = ${JSON.stringify(paths, null, 2)} as const;`,
    "export type TokenPath = (typeof tokenPaths)[number];",
    `export const tokenManifest = ${JSON.stringify(manifest, null, 2)} as const;`,
    "export const tokenByPath = Object.fromEntries(tokenManifest.map((token) => [token.path, token])) as Record<TokenPath, (typeof tokenManifest)[number]>;",
    "export function tokenVar(path: TokenPath) {",
    "  return `var(${tokenByPath[path].cssVariable})` as const;",
    "}",
    "",
  ].join("\n");
}

function figmaType(token) {
  if (token.type === "color") return "COLOR";
  if (["dimension", "duration", "number", "fontWeight"].includes(token.type)) return "FLOAT";
  return "STRING";
}

function titleCase(value) {
  return value
    .split("-")
    .map((part) => part ? `${part[0].toUpperCase()}${part.slice(1)}` : part)
    .join(" ");
}

function linearToSrgb(value) {
  const encoded = value <= 0.0031308 ? 12.92 * value : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
  return Math.min(1, Math.max(0, encoded));
}

function oklchToSrgb([lightness, chroma, hue]) {
  const angle = hue * Math.PI / 180;
  const a = chroma * Math.cos(angle);
  const b = chroma * Math.sin(angle);
  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;
  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function figmaColor(value) {
  const alpha = value.alpha ?? 1;
  if (value.colorSpace === "srgb") {
    const [r, g, b] = value.components;
    return { r, g, b, a: alpha };
  }
  if (value.colorSpace === "oklch" && !value.hex) {
    const [r, g, b] = oklchToSrgb(value.components);
    return { r, g, b, a: alpha };
  }
  assert(value.hex, `Figma color conversion requires an sRGB hex fallback for ${value.colorSpace}.`);
  const normalized = value.hex.slice(1);
  const r = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const g = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const b = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const hexAlpha = normalized.length === 8 ? Number.parseInt(normalized.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a: alpha * hexAlpha };
}

function figmaFontFamily(value) {
  const families = Array.isArray(value) ? value : [value];
  if (families.includes("Inter Variable") || families.includes("Inter")) return "Inter";
  if (families.includes("SFMono-Regular")) return "SF Mono";
  return families.find((family) => !GENERIC_FONT_FAMILIES.has(family)) ?? families[0];
}

function figmaValue(token, mode, model) {
  const raw = token.modes[mode] ?? token.value;
  if (isAlias(raw)) return { alias: aliasPath(raw).replaceAll(".", "/") };
  if (token.type === "color") return figmaColor(raw);
  if (token.type === "dimension") return raw.unit === "rem" ? raw.value * 16 : raw.value;
  if (token.type === "duration") return raw.unit === "s" ? raw.value * 1000 : raw.value;
  if (token.type === "number" || token.type === "fontWeight") return raw;
  if (token.type === "fontFamily") return figmaFontFamily(raw);
  return formatCssValue(token, raw, model.byPath);
}

function figmaScopes(token) {
  if (token.type === "color") {
    if (token.path.includes(".palette.")) return [];
    if (token.path.includes(".foreground.")) return ["TEXT_FILL", "SHAPE_FILL"];
    if (token.path.includes(".border.")) return ["STROKE_COLOR"];
    if (token.path.endsWith("switch-track") || token.path.endsWith("switch-thumb")) return ["FRAME_FILL", "SHAPE_FILL"];
    if (token.path.includes(".focus.")) return ["STROKE_COLOR"];
    return ["FRAME_FILL", "SHAPE_FILL"];
  }
  if (token.type === "fontFamily") return ["FONT_FAMILY"];
  if (token.type === "fontWeight") return ["FONT_WEIGHT"];
  if (token.type === "dimension") {
    if (token.path.includes(".typography.sizes.type-")) return ["FONT_SIZE"];
    if (token.path.includes(".typography.sizes.line-")) return ["LINE_HEIGHT"];
    if (token.path.includes("radius")) return ["CORNER_RADIUS"];
    if (token.path.includes("focus-width")) return ["STROKE_FLOAT"];
    if (token.path.includes("space-") || token.path.includes("padding")) return ["GAP"];
    return ["WIDTH_HEIGHT"];
  }
  return [];
}

function figmaCollection(token) {
  return token.scope === "foundation" ? "Teum / Foundation" : "Teum / Theme";
}

function figmaVariable(token, model) {
  const foundation = token.scope === "foundation";
  const sourceModes = foundation ? [model.modes[0]] : model.modes;
  const scopes = figmaScopes(token);
  return {
    name: token.path.replaceAll(".", "/"),
    collection: figmaCollection(token),
    type: figmaType(token),
    description: token.description,
    scopes,
    hiddenFromPublishing: scopes.length === 0 && !token.path.includes(".palette."),
    codeSyntax: { WEB: `var(${token.cssVariable})` },
    values: Object.fromEntries(sourceModes.map((mode) => [foundation ? "Value" : titleCase(mode), figmaValue(token, mode, model)])),
    sourceType: token.type,
  };
}

function resolvedFigmaColor(value, mode, model) {
  if (!isAlias(value)) return figmaColor(value);
  const target = model.byPath.get(aliasPath(value));
  return figmaColor(model.resolveToken(target, mode));
}

function figmaEffectStyles(model) {
  return model.tokens
    .filter((token) => token.type === "shadow")
    .flatMap((token) => model.modes.map((mode) => {
      const resolved = model.resolveToken(token, mode);
      const layers = Array.isArray(resolved) ? resolved : [resolved];
      return {
        name: `Elevation/${titleCase(mode)}/${titleCase(token.name.replace(/^shadow-/, ""))}`,
        mode: titleCase(mode),
        sourceToken: token.path,
        description: token.description,
        effects: layers.map((layer) => ({
          type: layer.inset ? "INNER_SHADOW" : "DROP_SHADOW",
          color: resolvedFigmaColor(layer.color, mode, model),
          offset: { x: layer.offsetX.value, y: layer.offsetY.value },
          radius: layer.blur.value,
          spread: layer.spread.value,
          visible: true,
          blendMode: "NORMAL",
        })),
      };
    }));
}

function tokenNumber(model, path) {
  const token = model.byPath.get(path);
  assert(token, `Missing typography token ${path}.`);
  const resolved = model.resolveToken(token, model.modes[0]);
  return isObject(resolved) && "value" in resolved ? resolved.value : resolved;
}

function figmaTextStyles(model) {
  const tracking = tokenNumber(model, "foundation.typography.ui-tracking") * 100;
  const definitions = [
    ["Metadata", "metadata", "ui-weight", "Persistent metadata and supporting labels."],
    ["Label", "label", "label-weight", "Navigation, field, and control labels."],
    ["UI", "ui", "ui-weight", "Default dense product interface text."],
    ["Body", "body", "ui-weight", "Readable documentation and supporting copy."],
    ["Row", "row", "ui-weight", "Dense list and table row content."],
    ["Section", "section", "heading-weight", "Documentation section heading."],
    ["Title", "title", "heading-weight", "Page and component title."],
  ];
  return definitions.map(([name, sizeName, weightName, description]) => {
    const fontWeight = tokenNumber(model, `foundation.typography.${weightName}`);
    return {
      name: `Typography/${name}`,
      description,
      fontFamilyCandidates: ["Inter", "Inter Variable"],
      fontStyleCandidates: fontWeight >= 550 ? ["Semi Bold", "Medium", "Regular"] : ["Medium", "Regular"],
      fontWeight,
      fontSize: tokenNumber(model, `foundation.typography.sizes.type-${sizeName}`),
      lineHeight: tokenNumber(model, `foundation.typography.sizes.line-${sizeName}`),
      letterSpacing: { value: tracking, unit: "PERCENT" },
      codeSyntax: {
        fontFamily: "var(--teum-font-ui)",
        fontSize: `var(--teum-type-${sizeName})`,
        lineHeight: `var(--teum-line-${sizeName})`,
      },
    };
  });
}

export function generateFigmaManifest(model) {
  const variableTokens = model.tokens.filter((token) => token.type !== "shadow");
  const variables = variableTokens.map((token) => figmaVariable(token, model));
  const effectStyles = figmaEffectStyles(model);
  const textStyles = figmaTextStyles(model);
  return generatedJson({
    schemaVersion: 2,
    $description: "Figma library handoff generated from the DTCG source. It is deterministic input for the Figma build, not evidence that a library is published.",
    source: TOKEN_SOURCE,
    collections: [
      { name: "Teum / Foundation", modes: ["Value"] },
      { name: "Teum / Theme", modes: model.modes.map(titleCase) },
    ],
    variables,
    textStyles,
    effectStyles,
    counts: {
      sourceTokens: model.tokens.length,
      variables: variables.length,
      textStyles: textStyles.length,
      effectStyles: effectStyles.length,
    },
  });
}

export function generateTokenManifest(model) {
  return generatedJson({
    source: TOKEN_SOURCE,
    format: "DTCG 2025.10",
    modes: model.modes,
    tokens: model.tokens.map((token) => ({
      path: token.path,
      type: token.type,
      description: token.description,
      deprecated: token.deprecated,
      cssVariable: token.cssVariable,
      scope: token.scope,
      aliases: Object.fromEntries(model.modes.map((mode) => {
        const value = token.modes[mode] ?? token.value;
        return [mode, isAlias(value) ? aliasPath(value) : null];
      })),
      cssValues: Object.fromEntries(model.modes.map((mode) => [mode, formatCssValue(token, token.modes[mode] ?? token.value, model.byPath)])),
      resolvedValues: Object.fromEntries(model.modes.map((mode) => [mode, formatCssValue(token, model.resolveToken(token, mode), model.byPath)])),
    })),
  });
}

export async function readTokenDocument(root = process.cwd()) {
  return JSON.parse(await readFile(resolve(root, TOKEN_SOURCE), "utf8"));
}

export function generateOutputs(document) {
  const model = collectTokens(document);
  return {
    model,
    outputs: new Map([
      [TOKEN_OUTPUTS.css, generateCss(model)],
      [TOKEN_OUTPUTS.typescript, generateTypescript(model)],
      [TOKEN_OUTPUTS.figma, generateFigmaManifest(model)],
      [TOKEN_OUTPUTS.manifest, generateTokenManifest(model)],
    ]),
  };
}
