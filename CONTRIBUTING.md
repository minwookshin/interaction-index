# Contributing

Teum is an MIT-licensed alpha. This guide defines the quality bar for changes proposed through the canonical public repository.

## Before adding a component

A component enters the catalog only when it has a concrete product case that existing primitives cannot express clearly. Catalog size is not a goal.

Every proposed component must include:

1. A concise role and one realistic product composition.
2. Explicit “use when” and “avoid when” guidance.
3. Only behaviorally or visually distinct states—normally five to nine, never filler.
4. Keyboard, focus, disabled, validation, and accessible-name behavior where applicable.
5. Light and dark tokens with no page-specific raw color dependency.
6. Reduced-motion behavior and an interruption rule for any animated state.
7. A typed public API table and copy-ready implementation example.
8. Automated behavior and accessibility coverage proportional to risk.
9. A registry item whose local dependencies and generated artifact pass verification.
10. Visual QA at 1280 x 720 in light and dark, including an interactive state.

## Development workflow

```bash
npm install
npm run dev
npm run quality
```

`npm run quality` is the merge gate. It runs tests, builds and verifies every registry artifact, type-checks and builds the app, and verifies the worker package.

Changes that affect layout, focus, overlays, or browser APIs must also pass the relevant Playwright projects and manual matrix in `SUPPORT.md`.

## Design principles

- Preserve stable geometry across loading and state changes.
- Make spatial motion explain origin; do not make keyboard work wait for travel.
- Make consequential actions reversible when the product permits it.
- Prefer semantic composition over configurable monoliths.
- Use whitespace and hierarchy before adding another border.
- Keep Inter readable at the documented product density; persistent text may not drop below the established floor.
- Do not copy proprietary implementation details, product layouts, brand assets, or text from reference products.

## Pull-request evidence

Include the product case, affected public API, keyboard path, reduced-motion decision, tests added, and matched light/dark screenshots. Call out compatibility or registry changes explicitly. By submitting a contribution, you agree to license it under the repository's MIT license.

Open a focused issue or pull request at [minwookshin/teum](https://github.com/minwookshin/teum). Contributors must also follow `CODE_OF_CONDUCT.md`; vulnerabilities use the private process in `SECURITY.md`, never a public issue.
