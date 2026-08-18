import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const failures = [];

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const [manifestSource, css] = await Promise.all([
  readFile(resolve(root, "tokens/generated/token-manifest.json"), "utf8"),
  readFile(resolve(root, "src/styles.css"), "utf8"),
]);

const manifest = JSON.parse(manifestSource);
const tokenByPath = new Map(manifest.tokens.map((token) => [token.path, token]));

assert(manifest.format === "DTCG 2025.10", "Token manifest must identify the DTCG 2025.10 contract.");
assert(JSON.stringify(manifest.modes) === JSON.stringify(["light", "dark"]), "Token modes must stay ordered as light, dark.");
assert(manifest.tokens.length >= 140, "Foundation manifest unexpectedly lost token coverage.");

const requiredTokens = [
  "foundation.typography.sizes.type-metadata",
  "foundation.typography.sizes.type-label",
  "foundation.typography.sizes.type-ui",
  "foundation.typography.sizes.type-body",
  "foundation.layout.control-height-sm",
  "foundation.layout.control-height-md",
  "foundation.motion.duration.press-duration",
  "foundation.motion.duration.enter-duration",
  "foundation.motion.duration.exit-duration",
  "foundation.motion.easing.ease-out",
  "foundation.motion.easing.ease-in-out",
  "theme.surface.bg-canvas",
  "theme.surface.bg-flyout",
  "theme.foreground.fg-default",
  "theme.focus.focus-control",
  "theme.elevation.shadow-flyout",
  "theme.elevation.shadow-modal",
];

for (const path of requiredTokens) assert(tokenByPath.has(path), `Required token is missing: ${path}`);

for (const token of manifest.tokens.filter((item) => item.scope === "theme")) {
  assert(token.resolvedValues?.light !== undefined, `Theme token has no light value: ${token.path}`);
  assert(token.resolvedValues?.dark !== undefined, `Theme token has no dark value: ${token.path}`);
}

const typographyFloors = new Map([
  ["foundation.typography.sizes.type-metadata", 11],
  ["foundation.typography.sizes.type-label", 12],
  ["foundation.typography.sizes.type-ui", 13],
  ["foundation.typography.sizes.type-body", 13],
]);

for (const [path, floor] of typographyFloors) {
  const value = Number.parseFloat(tokenByPath.get(path)?.resolvedValues?.light ?? "NaN");
  assert(Number.isFinite(value) && value >= floor, `${path} must remain at or above ${floor}px.`);
}

const motionCeilings = new Map([
  ["foundation.motion.duration.press-duration", 160],
  ["foundation.motion.duration.hover-duration", 180],
  ["foundation.motion.duration.enter-duration", 220],
  ["foundation.motion.duration.exit-duration", 180],
]);

for (const [path, ceiling] of motionCeilings) {
  const value = Number.parseFloat(tokenByPath.get(path)?.resolvedValues?.light ?? "NaN");
  assert(Number.isFinite(value) && value > 0 && value <= ceiling, `${path} must stay within 1-${ceiling}ms.`);
}

assert(!/transition\s*:\s*all\b/i.test(css), "Avoid transition: all; list the animated properties explicitly.");
assert(!/\bscale\(0(?:\.0+)?\)/i.test(css), "Avoid scale(0); entry geometry must remain inspectable.");
assert(!/(?:^|[\s,:])ease-in(?:[\s,;)]|$)/m.test(css), "Standalone ease-in is not part of the motion contract.");

for (const selector of [".teum-tooltip", ".teum-popover", ".teum-menu", ".teum-select-popup", ".teum-combobox-popup", ".teum-context-switcher__popup"]) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert(new RegExp(`${escaped}[^{}]*\\{[^{}]*transform-origin\\s*:\\s*var\\(--transform-origin\\)`, "s").test(css), `${selector} must animate from the resolved anchor origin.`);
}

const reducedMotionStart = css.indexOf("@media (prefers-reduced-motion: reduce)");
const reducedMotionCss = reducedMotionStart >= 0 ? css.slice(reducedMotionStart) : "";
assert(reducedMotionCss.length > 0, "A reduced-motion contract is required.");
for (const selector of [".teum-tooltip", ".teum-popover", ".teum-menu", ".teum-dialog", ".teum-context-switcher__popup", ".teum-collapsible__panel", ".teum-collapsible__trigger svg"]) {
  assert(reducedMotionCss.includes(selector), `Reduced-motion coverage is missing ${selector}.`);
}

assert(css.includes("@media (hover: hover) and (pointer: fine)"), "Pointer-only hover motion needs an explicit capability query.");
assert(css.includes(':root[data-input-modality="keyboard"] .teum-menu'), "Keyboard-opened surfaces must bypass decorative travel.");

const expectedFinalPress = new Map([
  [".teum-button:active:not(:disabled):not([data-disabled])", 0.98],
  [".teum-checkbox:active:not([data-disabled])", 0.96],
  [".teum-context-switcher:active:not([data-disabled])", 0.985],
  [".teum-number-field__step:active", 0.96],
  [".teum-segmented-control__item:active", 0.97],
]);

for (const [selector, expected] of expectedFinalPress) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [...css.matchAll(new RegExp(`${escaped}\\s*\\{[^{}]*transform\\s*:\\s*scale\\(([^)]+)\\)`, "g"))];
  const finalValue = Number.parseFloat(matches.at(-1)?.[1] ?? "NaN");
  assert(finalValue === expected, `${selector} must end at the reviewed scale(${expected}) press contract.`);
}

if (failures.length > 0) {
  console.error(`[foundations] ${failures.length} contract failure${failures.length === 1 ? "" : "s"}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`[foundations] verified ${manifest.tokens.length} tokens, ${manifest.modes.length} themes, typography floors, motion limits, and input-aware animation contracts`);
}
