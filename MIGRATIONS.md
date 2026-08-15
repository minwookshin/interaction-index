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

None. `0.1.0-alpha.0` is the initial recorded API baseline.
