# Teum Figma handoff

The codebase remains the source of truth until a real Figma library is created and inspected.

- `tokens/generated/figma-variables.json` contains the generated Foundation and Theme collections, Light/Dark values, variable aliases, explicit picker scopes, seven text styles, and fourteen mode-specific elevation styles.
- `figma/generated/library-manifest.json` maps all 45 public components to one deterministic page each, their behaviorally distinct states, public TypeScript exports, registry dependencies, and representative Figma variants.
- `figma/generated/build-plan.md` is the human-readable execution plan.

Run `npm run build:tokens`, `npm run build:api`, and `npm run build:figma` after changing source tokens, component APIs, registry metadata, or behavior contracts. `npm run check:figma` rejects stale output, missing state or keyboard coverage, broad `ALL_SCOPES` variables, broken aliases, and any invented remote IDs.

Remote fields intentionally remain `null` until the Figma file and nodes actually exist. Code Connect is not considered complete until components are published on a supported Figma plan and each mapping is verified against a real node ID.
