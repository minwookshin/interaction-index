# Release QA

This document records the reviewed visual, interaction, and distribution evidence for the unpublished npm `0.1.0-rc.22` candidate. It is a release record, not a production-adoption claim.

## Frozen scope

- 45 public components in the frozen Core catalog and 15 additive product components across Teum Data and Teum Analytics.
- 345 compiler-extracted public exports.
- 145 semantic tokens.
- 69 public routes: 1 landing page, 13 documentation pages, 5 foundation routes, 45 component routes, and 5 pattern routes.
- Light is the default theme; light and dark are both release-blocking visual contracts.

`release/public-surface.freeze.json` is the frozen API and token contract. `release/evidence.json` is the generated coverage contract. `npm run check:freeze` and `npm run check:evidence` reject unreviewed drift.

## Visual baseline

The canonical viewport is 1280 x 720 CSS pixels in Chromium with Inter loaded, animation disabled for capture, and reduced motion enabled for deterministic screenshots.

The complete `rc.21` visual set is reviewed on macOS. Existing Linux Core baselines remain committed, but the newer documentation, Analytics, and Product Patterns pairs still require Linux CI capture and review; macOS images are not reused as Linux evidence.

| Surface | Coverage | Evidence |
| --- | ---: | --- |
| Public routes | 69 routes x 2 themes | 138 full-viewport snapshots |
| Component Product specimen | 45 components x 2 themes | 90 isolated snapshots |
| Component State contract | 45 components x 2 themes | 90 isolated snapshots |
| Analytics recipes | 3 recipes x 2 themes | 6 isolated snapshots |
| Product Patterns | 3 recipes x 2 themes | 6 isolated snapshots |
| Total | - | 330 snapshots |

The generated baselines live beside their Playwright specifications in `tests/browser/visual-regression.spec.ts-snapshots/`, `tests/browser/full-catalog-visual.spec.ts-snapshots/`, `tests/storybook/visual-regression.spec.ts-snapshots/`, and `tests/storybook/analytics-visual.spec.ts-snapshots/`. The source snapshots remain the reviewable test boundary.

## Review decisions

- Navigation, canvas, and page outline retain stable geometry across routes and themes.
- Product specimens are centered at their actual product density; State specimens isolate only behaviorally or visually distinct states.
- Overlay components begin closed and preserve the Canvas, Stage, Float, Flyout, Modal, and Toast layer contract.
- Persistent structure uses tone and whitespace before borders. Temporary elevation uses the shared shadow ladder.
- Button, Text Field, Menu, Dialog, Table, Shared Detail, Action List, and Undo Stack remain the visual and behavioral anchors.
- Badge, Avatar, Table, Number Field, Action List search, Tree hit areas, and documentation focus geometry received explicit optical or interaction corrections before the baseline was frozen.
- Light and dark use the same hierarchy and component anatomy; dark is not a color-inverted afterthought.

## Automated interaction evidence

- All 69 routes pass serious/critical axe checks, 200% equivalent reflow, visible keyboard-hint atomicity, translated-content expansion, forced-colors structure, and reduced-motion structure in Chromium.
- The dedicated five-project accessibility matrix recorded 55 applicable accessibility checks passed and 30 intentional project-ownership skips, with zero failures or flaky results. It also verifies skip paths, one-main/one-H1 ownership, SPA route announcements, and compact-navigation focus handoff.
- All 45 Product previews preserve a 24 CSS pixel effective target floor in mobile Chromium and mobile WebKit emulation.
- Text Field, Tabs, Menu, and Dialog complete representative touch paths in both mobile engines.
- A focused field remains visible and focused through the virtual-keyboard viewport proxy.
- The full browser suite owns keyboard, focus return, overlay dismissal, RTL, theme persistence, responsive navigation, authored pattern behavior, and Product pilot behavior.

## Local candidate evidence

- The `0.1.0-rc.22` local gates cover frozen contracts, 203 unit tests, 102 Storybook interaction tests, all 330 visual baselines, registry install and upgrade checks, private package consumers, the public-API-only dogfood app, the Sites build contract, and performance budgets.
- `npm run test:browsers:evidence` passed all 295 applicable checks across desktop Chromium, Firefox, WebKit, mobile Chromium, and mobile WebKit; 350 project-inapplicable combinations were explicitly skipped.
- `npm run test:clean-room` reproduced the current candidate snapshot after a fresh `npm ci`, then repeated build, registry, package, consumer, upgrade, dogfood, Sites, and performance gates without workspace caches. A clean commit is still required before assembling a distributable RC artifact.
- `npm audit` reported zero known vulnerabilities for the verified lockfile on 2026-08-17.
- The private npm candidate remains blocked from publication by `private: true`; its exact allowlisted contents and packed sizes are verified dynamically instead of copied into this package-owned document.
- Fresh package consumers pass against React 18.3.1 and React 19.2.8, and the optional Tailwind CSS 4.3.3 bridge compiles semantic utilities from the same Teum variables used by plain CSS.
- The private package entry preserves its React `use client` boundary; a fresh ESM consumer matched all 197 runtime exports derived from the compiler-owned surface, rendered a representative tree through Node SSR, and hydrated it with zero recoverable mismatch errors. `release/package-contract.json` is the machine-readable record.
- `release/accessibility.json` is the machine-readable `0.1.0-rc.22` accessibility record for all five configured browser projects and ten required contract groups.
- `performance-report.json` records route-aware bundle graphs: 78,793 bytes of landing JavaScript, 340,526 bytes for the documentation shell, 420,254 bytes for the heaviest Core component route, 488,668 bytes for Teum Data, 403,224 bytes for Teum Analytics, and 410,753 bytes for Product Patterns after gzip. The largest emitted JavaScript chunk remains below 500,000 raw bytes.
- `release/runtime-performance.json` records the latest local production-preview pass: 148 / 420 ms landing/documentation LCP, 0.0132 maximum CLS, a 392 ms landing-to-documentation transition, 12 ms Shared Detail selection, 10 ms Dialog open, and a 74 ms longest observed interaction task. These values are local lab evidence, not field Core Web Vitals.
- A fresh React + TypeScript + Vite plain-CSS fixture executes the documented namespace command, installs Button through `@teum-pinned`, type-checks, and completes a production build. The slowest current Vite run passed in 16.4 seconds locally and is preserved in `release/quickstart.json`; network and package-manager cache variance make the outcome—not the exact duration—the release gate.
- The same fixture resolves Button's same-version base dependency and optional Tailwind bridge without installing Tailwind CSS.

## Public candidate endpoint

- `https://teum.minwookshin.com` has managed TLS and an existing public deployment, but the local `0.1.0-rc.22` candidate has not been promoted in this verification pass.
- The public HTML declares `https://teum.minwookshin.com` as canonical.
- Root, Documentation, Component, and Pattern entry URLs return the SPA shell with HTTP 200; built JavaScript, CSS, mutable registry JSON, and immutable registry JSON retain their expected content types.
- The live mutable manifest and `0.1.0-rc.22` immutable endpoint must be fetched and matched to this candidate after any approved deployment; the immutable endpoint must respond with `cache-control: public, max-age=31536000, immutable`.
- `https://interactions.minwookshin.com` remains available as a compatibility host. This is release-candidate access evidence, not npm publication or independent adoption evidence.

## Manual review boundary

Screenshots and emulation do not prove physical-device behavior, Microsoft Edge branding differences, or operating-system accessibility modes. Those checks are deliberately isolated in `RC_EXTERNAL_GATES.md`; no automated result is presented as a substitute.
