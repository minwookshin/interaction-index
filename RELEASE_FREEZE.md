# Release freeze

Interaction Index is frozen at 45 public components while the unpublished `0.1.0` release candidate is verified.

## Frozen surface

- No component additions or removals.
- No public prop, exported type, behavior-contract, or semantic-token rename without a changelog entry, migration note, and an intentional freeze update.
- Internal implementation fixes, visual corrections, documentation improvements, tests, and performance work remain allowed when the public contract is unchanged.
- Composed recipes such as Command Palette and Data Table stay recipes rather than becoming duplicate public component modules during this release cycle.

The machine-readable contract lives in `release/public-surface.freeze.json`. `npm run check:freeze` compares the current registry, compiler-extracted TypeScript surface, and semantic token names against that contract.

## Unfreeze rule

The catalog may change only after the current RC evidence is complete or when a release-blocking defect cannot be fixed without a public change. Any exception must include:

1. The user-facing reason.
2. A changelog entry.
3. A migration note when existing consumers can be affected.
4. Regenerated API, registry, and freeze artifacts.
5. A fresh consumer install and upgrade verification.

This freeze is a release-discipline claim, not a stable-adoption claim. All components remain pre-release until the documented manual and independent-consumer gates are complete.
