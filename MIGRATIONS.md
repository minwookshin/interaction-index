# Migration policy

Interaction Index is pre-1.0. Public APIs may change, but every breaking alpha change must be explicit and recoverable.

## Required for a breaking change

1. Add a `Breaking` entry to `CHANGELOG.md` with the first affected version.
2. Describe the old API, replacement API, and why the change is necessary.
3. Include a minimal before/after example.
4. Update registry dependencies and clean-consumer verification.
5. Keep a compatibility alias for one alpha when it is technically safe and does not preserve a defect.
6. Add a codemod only when a mechanical migration affects repeated call sites; do not promise one for every breaking change.

## Current migrations

### Unreleased: explicit toast facade

The registry previously re-exported Sonner's entire `toast` object by inference. Interaction Index now owns a smaller, nameable API that matches its documentation and declaration output.

```ts
// Before: implementation-specific helpers were reachable through @index/ui.
import { toast } from "@index/ui";
toast.promise(save(), { loading: "Saving…", success: "Saved" });

// After: use the stable Interaction Index notification surface.
import { toast } from "@index/ui";
toast.loading("Saving…");
toast.success("Saved");
```

If an advanced Sonner-only helper is required during alpha, import it explicitly from `sonner`. This keeps the dependency boundary visible while the Interaction Index promise contract is designed.
