# Registry updates

Teum distributes owned source. Updating is a review operation, not an automatic merge.

## Channels

- `https://interactions.minwookshin.com/r/{name}.json` is the mutable public-alpha channel.
- `public/r/manifest.json` records the version, SHA-256 digest, byte size, file-level integrity, TypeScript API hashes, and token-contract hashes for that channel.
- `https://interactions.minwookshin.com/r/v/<version>/{name}.json` is the pinned channel. Every item, the catalog, the integrity manifest, and `release.json` are copied byte-for-byte into that path.
- A version directory is write-once: rebuilding different content under an existing version fails and requires a `package.json` version bump.
- The deployed version path uses `Cache-Control: public, max-age=31536000, immutable`; the mutable alpha path stays `max-age=0, must-revalidate`.

## Review a change

Build the registry, then compare it with a previous local or remote manifest:

```bash
npm run build:registry
npm run diff:registry -- --from ./previous-manifest.json
npm run diff:registry -- --from https://example.com/r/manifest.json
```

The diff separates additive exports and tokens from removed or type-changed contracts. Artifact-only and token-value changes remain maintainer-review items because a visual or behavioral change can be breaking even when TypeScript remains compatible.

## Apply safely

1. Commit or stash consumer-owned customizations.
2. Save the current registry manifest with the product change.
3. Run the registry diff and read `CHANGELOG.md` and `MIGRATIONS.md`.
4. Re-run `shadcn add` only for the item being reviewed.
5. Review the source diff before accepting an overwrite.
6. Run the consumer's type, accessibility, interaction, and visual checks.

Teum does not promise a three-way merge for edited copied source. Local modifications stay visible in version control, and the consumer decides which upstream changes to adopt.

## Verify the upgrade contract

```bash
npm run test:consumer:upgrade
```

The clean-consumer harness installs the exact pinned base and Button payloads, builds them, applies a local source customization, and introduces a deterministic synthetic next-version candidate. It must detect the conflict, keep the consumer file unchanged, stage the upstream candidate for review, require an explicit acceptance step, and build again afterward. This proves the update contract; it is not external product adoption.
