# Teum launch kit

These are the maintained launch materials for the live `0.1.0-rc.22` public beta. The site, pinned registry, GitHub prerelease, checksums, and SBOM are published. npm remains unpublished.

## Release boundary

- The candidate maps to one clean commit and an annotated or signed prerelease tag.
- `npm run verify:rc` passes from that commit and the browser, accessibility, package, quickstart, runtime, and security evidence all name the same version.
- The live documentation and pinned registry serve that exact candidate over HTTPS.
- GitHub private vulnerability reporting works from a non-maintainer account.
- Remaining Edge, physical-device, external accessibility, and independent-adoption gates are stated without euphemism.
- The npm package stays described as unpublished until Trusted Publisher staging and an independent installation are verified.

## Prepared assets

- `announcement.md` — factual long-form release draft.
- `demo-script.md` — a 75–90 second interaction-led walkthrough.
- `assets-manifest.json` — asset ownership, dimensions, and review status.

Before publishing, replace every bracketed maintainer field, verify every link from a signed-out browser, and compare the final social card with the live landing page.
