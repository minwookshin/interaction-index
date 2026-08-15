# Migration policy

Teum is pre-1.0. Public APIs may change, but every breaking alpha change must be explicit and recoverable.

## Required for a breaking change

1. Add a `Breaking` entry to `CHANGELOG.md` with the first affected version.
2. Describe the old API, replacement API, and why the change is necessary.
3. Include a minimal before/after example.
4. Update registry dependencies and clean-consumer verification.
5. Keep a compatibility alias for one alpha when it is technically safe and does not preserve a defect.
6. Add a codemod only when a mechanical migration affects repeated call sites; do not promise one for every breaking change.

## Current migrations

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
