---
name: teum
description: Choose, install, compose, and verify Teum React and TypeScript components, product primitives, analytics, and B2B patterns. Use when building or revising a product interface with Teum; deciding between adjacent controls such as Select, Combobox, Context Switcher, Menu, Action List, Dialog, Toast, or Undo Stack; selecting a Teum Data, Analytics, or Product Pattern recipe; or auditing generated Teum code for undocumented APIs, incorrect state ownership, accessibility gaps, or forbidden composition choices.
---

# Teum

Build from Teum's public contracts. Prefer a verified product recipe over assembling primitives from scratch.

## Start with project context

Run the bundled context script before choosing or generating UI:

```bash
node <skill-directory>/scripts/context.mjs --project "$PWD" --task "<product task>"
```

The output reports the configured registry, installed Teum source, the strongest authored recipe match, its public module and export, and the pinned install command. If there is no explicit match, do not guess a recipe.

## Workflow

1. Inspect `components.json`, the existing semantic tokens, and installed Teum source. Preserve the project's React, TypeScript, CSS, aliases, and framework conventions.
2. Classify the task by data, focus, comparison, timing, and recovery—not by visual shape.
3. Use the matched authored recipe when its intent and rejection boundaries fit. Read the exact recipe in `references/catalog.json` by `id`.
4. If no recipe fits, select only documented primitives. Read `references/selection.md` for adjacent-component boundaries.
5. Install from the pinned registry before writing imports. Use the version and command returned by the context script.
6. Compose only documented exports and props from installed source. Keep product state outside visual primitives.
7. Apply the system principles: stable geometry, shared origin, and reversible completion.
8. Check every result against `references/quality.md` and the recipe's `rules` and `forbidden` arrays.
9. Run the consumer's typecheck, production build, keyboard/accessibility tests, light and dark review, and reduced-motion review.

## Installation boundaries

- Teum copies source into the consumer. Inspect and own the installed files.
- CSS variables and compiled CSS are the visual source of truth. Tailwind v4 is optional.
- Use the recipe's `registryItem`; do not install the complete system by default.
- Do not use mutable registry URLs for reproducible work.
- Never invent `@teum/*` item names. Search `references/catalog.json` or the configured registry.

## Output contract

Before editing, state the selected recipe or primitives and why. After editing, report:

- installed registry items;
- public exports used;
- state ownership and recovery behavior;
- keyboard and accessibility behavior;
- typecheck and build result;
- any unverified browser, device, or external-adoption gate.

Do not claim production readiness or external adoption from repository tests alone.
