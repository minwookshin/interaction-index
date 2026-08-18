# Teum Analytics milestone

Candidate: `0.1.0-rc.25`
Status: implementation and local release-candidate verification complete; npm unpublished and candidate undeployed

## Scope

- Eleven analytics primitives
- Three composed product recipes
- Native SVG rendering and semantic exact-value tables
- Local keyboard inspection, explicit shared selection, legend filtering, reduced motion, loading, empty, and overflow contracts
- Typed public API and agent-readable component and recipe metadata
- Atomic registry items plus one complete `teum-analytics` install

## Public-surface migration

- `DonutChart` and `Heatmap` are additive source-registry components. Existing imports do not need to change.
- `Chart` adds the `type` prop with `line`, `area`, `bar`, and `stacked-bar` renderers. The existing `area` prop remains supported and is deprecated in favor of `type="area"`.
- `Chart` adds explicit `error` and `showGrid` props. Existing defaults remain unchanged.
- `Button` adds an optional `loadingLabel`. Existing button calls remain source-compatible, while the loader now keeps stable internal geometry between rest and loading states.
- Analytics helpers add band positioning and stacked-domain calculation. Existing point and domain helpers remain available.
- Because the npm package remains unpublished, this freeze update records an additive release-candidate contract rather than a migration imposed on published consumers.

## Evidence boundary

Unit, Storybook, browser, accessibility, visual, registry, package, and clean-consumer evidence is generated locally and bound to the candidate. It does not claim independent adoption, external accessibility review, physical-device coverage, npm publication, or deployment of this candidate.
