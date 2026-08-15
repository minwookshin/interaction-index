# Release QA

This document records the reviewed visual and interaction evidence for the unpublished `0.1.0-rc.1` candidate. It is a release record, not a production-adoption claim.

## Frozen scope

- 45 public components.
- 210 compiler-extracted public exports.
- 145 semantic tokens.
- 66 public documentation routes: 11 documentation pages, 5 foundation routes, 45 component routes, and 5 pattern routes.
- Light is the default theme; light and dark are both release-blocking visual contracts.

`release/public-surface.freeze.json` is the machine-readable contract. `npm run check:freeze` rejects unreviewed drift.

## Visual baseline

The canonical viewport is 1280 x 720 CSS pixels in Chromium with Inter loaded, animation disabled for capture, and reduced motion enabled for deterministic screenshots.

| Surface | Coverage | Evidence |
| --- | ---: | --- |
| Public documentation shell | 66 routes x 2 themes | 132 full-viewport snapshots |
| Component Product specimen | 45 components x 2 themes | 90 isolated snapshots |
| Component State contract | 45 components x 2 themes | 90 isolated snapshots |
| Total | — | 312 snapshots |

The generated baselines live beside their Playwright specifications in `tests/browser/full-catalog-visual.spec.ts-snapshots/` and `tests/storybook/visual-regression.spec.ts-snapshots/`. Local contact sheets are generated under the ignored `artifacts/visual-qa/0.1.0-rc.1/` directory for rapid gestalt review; the source snapshots remain the reviewable test boundary.

## Review decisions

- Navigation, canvas, and page outline retain stable geometry across routes and themes.
- Product specimens are centered at their actual product density; State specimens isolate only behaviorally or visually distinct states.
- Overlay components begin closed and preserve the Canvas, Stage, Float, Flyout, Modal, and Toast layer contract.
- Persistent structure uses tone and whitespace before borders. Temporary elevation uses the shared shadow ladder.
- Button, Text Field, Menu, Dialog, Table, Shared Detail, Action List, and Undo Stack remain the visual and behavioral anchors.
- Badge, Avatar, Table, Number Field, Action List search, Tree hit areas, and documentation focus geometry received explicit optical or interaction corrections before the baseline was frozen.
- Light and dark use the same hierarchy and component anatomy; dark is not a color-inverted afterthought.

## Automated interaction evidence

- All 66 routes pass serious/critical axe checks, 200% equivalent reflow, visible keyboard-hint atomicity, translated-content expansion, forced-colors structure, and reduced-motion structure in Chromium.
- All 45 Product previews preserve a 24 CSS pixel effective target floor in mobile Chromium and mobile WebKit emulation.
- Text Field, Tabs, Menu, and Dialog complete representative touch paths in both mobile engines.
- A focused field remains visible and focused through the virtual-keyboard viewport proxy.
- The full browser suite owns keyboard, focus return, overlay dismissal, RTL, theme persistence, responsive navigation, authored pattern behavior, and Product pilot behavior.

## Local candidate evidence

- `npm run quality` passed the frozen contracts, 151 unit tests, 90 Storybook interaction tests, all 312 visual baselines, registry install and upgrade checks, private package consumers, the public-API-only dogfood app, the Sites build contract, and performance budgets in one run.
- `npm run test:clean-room` reproduced the candidate after a fresh `npm ci` in a temporary source tree and repeated the build, registry, package, consumer, dogfood, Sites, and performance gates without workspace caches.
- `npm audit` reported zero known vulnerabilities across 637 installed production, development, and optional dependencies on 2026-08-15.
- The private npm candidate contains 167 packed files, is 263,068 compressed bytes and 1,531,122 unpacked bytes, and remains blocked from publication by `private: true`.

## Manual review boundary

Screenshots and emulation do not prove physical-device behavior, Microsoft Edge branding differences, or operating-system accessibility modes. Those checks are deliberately isolated in `RC_EXTERNAL_GATES.md`; no automated result is presented as a substitute.
