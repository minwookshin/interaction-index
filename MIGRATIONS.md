# Migration policy

Teum is pre-1.0. Public APIs may change, but every breaking alpha change must be explicit and recoverable.

## Move between candidates

1. Commit copied Teum source and product overrides.
2. Change only the `@teum-pinned` URL in `components.json` to the target candidate.
3. Read every intervening entry in `CHANGELOG.md` and this file.
4. Run `shadcn add <item> --dry-run`, then `--diff <file>`.
5. Accept with `--overwrite --yes` only after reviewing props, tokens, dependencies, behavior, and CSS.
6. Run the product's type, build, interaction, accessibility, and visual checks.

The previous pinned URL and pre-update commit are the rollback boundary. Teum does not silently rewrite historical registry artifacts.

## Required for a breaking change

1. Add a `Breaking` entry to `CHANGELOG.md` with the first affected version.
2. Describe the old API, replacement API, and why the change is necessary.
3. Include a minimal before/after example.
4. Update registry dependencies and clean-consumer verification.
5. Keep a compatibility alias for one alpha when it is technically safe and does not preserve a defect.
6. Add a codemod only when a mechanical migration affects repeated call sites; do not promise one for every breaking change.

## Current migrations

### 0.1.0-rc.25: coarse-pointer target floor

No component API changes. Quiet buttons retain their compact desktop geometry and use the existing 28px small-control token on coarse pointers so their interactive area does not fall below 24 CSS pixels after device-scale rounding.

### 0.1.0-rc.24: target-size correction

No component API changes. Search Input keeps the same props and layout contract; only its clear action grows from 22px to a non-shrinking 24px target. Storybook now loads the same shared foundation as the application and installed registry components.

### 0.1.0-rc.23: additive Analytics renderers

No existing component call site needs to change. `Chart` now accepts `type="line" | "area" | "bar" | "stacked-bar"`; the legacy `area` boolean remains available for this candidate and maps to the equivalent renderer. New work should use `type="area"` so the visual intent stays explicit.

`DonutChart` and `Heatmap` are additive exports and registry items. Adopt them only when their semantic table or text summary remains available with the visual surface.

### 0.1.0-rc.3: Interaction Index becomes Teum

The public name and distribution namespace now match one short product identity. Earlier versioned registry artifacts remain available at their original paths and are not rewritten.

| Before | Teum RC3 |
| --- | --- |
| `Interaction Index` | `Teum` |
| future package candidate `interaction-index` | `teum` |
| registry namespace `@index` | `@teum` |
| complete registry item `interaction-index` | `teum` |
| shared style `interaction-index-base.css` | `teum-base.css` |
| CSS classes `.ix-*` | `.teum-*` |
| semantic variables `--ix-*` | `--teum-*` |
| cascade layers `index.tokens`, `index.base`, `index.components` | `teum.tokens`, `teum.base`, `teum.components` |

Copied registry source is consumer-owned, so this is an explicit migration rather than a silent compatibility alias. Evaluate the Teum RC3 registry in a branch, review the generated diff, and migrate local selectors or token overrides before accepting it.

### 0.1.0-rc.1: explicit toast facade

The registry previously re-exported Sonner's entire `toast` object by inference. Interaction Index introduced a smaller, nameable API that matched its documentation and declaration output.

```ts
// Before: implementation-specific helpers were reachable through @index/ui.
import { toast } from "@index/ui";
toast.promise(save(), { loading: "Saving…", success: "Saved" });

// After: use the owned notification surface.
import { toast } from "@index/ui";
toast.loading("Saving…");
toast.success("Saved");
```

If an advanced Sonner-only helper is required during alpha, import it explicitly from `sonner`. This keeps the dependency boundary visible while the promise contract is designed.
