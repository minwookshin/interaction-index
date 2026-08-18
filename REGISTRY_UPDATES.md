# Registry updates

Teum distributes product-owned source. An update is a review, not an automatic merge.

## Channels

- `https://whatiuse.minwookshin.com/r/{name}.json` follows current pre-release work.
- `https://whatiuse.minwookshin.com/r/v/<version>/{name}.json` is immutable and rewrites internal dependencies to the same pinned version.
- `public/r/manifest.json` records artifact, file, API, and token hashes.

Use the mutable channel for evaluation. Use an exact pinned channel for reproducible work.

## Review in a consumer

1. Commit local component changes.
2. Point `@teum-pinned` at the target version.
3. Read `CHANGELOG.md` and `MIGRATIONS.md`.
4. Inspect the candidate without writing.
5. Accept with an explicit overwrite.
6. Run the product's checks.

```bash
npx shadcn@4.18.0 add @teum-pinned/button --dry-run
npx shadcn@4.18.0 add @teum-pinned/button --diff src/components/ui/button.tsx
npx shadcn@4.18.0 add @teum-pinned/button --overwrite --yes
npm run typecheck
npm run build
```

Dry-run and diff preserve local files. Teum does not promise an automatic three-way merge; the consumer decides how to reconcile copied source.

## Review as a maintainer

```bash
npm run build:registry
npm run diff:registry -- --from ./previous-manifest.json
npm run diff:registry -- --from https://example.com/r/manifest.json
```

The diff separates additive changes from removed or type-changed contracts. Token-value and behavior changes still require review even when TypeScript is compatible.

## Verify the contract

```bash
npm run test:adoption:update
npm run test:registry
```

The update test installs the prior immutable candidate through the real shadcn CLI, adds a local source edit, switches to the current candidate, verifies dry-run and file diff are non-writing, accepts explicitly, then type-checks and builds. It is repository-owned evidence, not external adoption.
