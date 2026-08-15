# Compatibility

Interaction Index is an MIT-licensed alpha. The table below records the environment verified on 2026-08-14; it is evidence, not a broad support promise.

## Verified stack

| Layer | Verified version |
| --- | --- |
| Node.js | 22.14.0 |
| React / React DOM | 19.2.0 |
| TypeScript | 7.0.2 |
| Base UI | 1.7.0 |
| Motion | 13.1.0 |
| shadcn CLI | 4.18.0 |
| Vite | 6.4.2 |
| Vitest | 4.1.10 |

The lockfile is the reproducible source for every direct and transitive version used by this verification.

## Verified behavior

- 108 component, documentation, keyboard, state, and accessibility tests.
- TypeScript strict no-emit checking and a Vite production build.
- shadcn-compatible generation for 35 individual component items and the complete system item.
- Fresh Vite consumer builds for a Button-only install and the complete-system item, in addition to the full generated registry validation.
- Consumer TypeScript and production builds with generated source, per-component CSS, the shared cascade contract, and bundled Inter variable font.
- Light and dark visual review at 1280 x 720 in the in-app Chromium browser.
- Representative pointer, keyboard, focus-return, overlay dismissal, sorting, filtering, selection, pagination, and reduced-motion paths.
- The full Playwright suite executed locally across Chromium, Firefox, WebKit, mobile Chromium, and mobile WebKit: 56 passed and 19 intentionally skipped by visual-baseline ownership and desktop/mobile gating.
- All 53 documentation routes, including the Product pilot, were checked per browser project for their expected H1, page errors, and document-level horizontal overflow.
- Desktop disclosure and theme persistence passed in Chromium, Firefox, and WebKit; mobile drawer navigation passed in Pixel 5 and iPhone 12 emulation.
- Axe anchor-route checks report no serious or critical violations on Introduction, Button, and Product pilot after correcting the subtle-text contrast token.
- The Product pilot passes automated structural checks in RTL, forced colors, reduced motion, and a 640 px viewport used as a 200% layout proxy.
- Eight cross-platform visual baselines cover light/dark entry, Button product/focus/loading, Text Field error, and Product pilot light/dark.
- Branded Chrome 151 passed Button keyboard focus and confirmed 200% zoom without content loss on macOS 26.5.2.
- Branded Safari 26.5.2 passed Button keyboard/zoom plus a live VoiceOver Dialog and Menu anchor review on macOS 26.5.2.

## Not yet verified

- Microsoft Edge; it was not installed in the current manual-test environment.
- Physical touch devices, virtual keyboards, safe areas, zoom, and narrow viewports as a complete catalog-wide matrix.
- Translated content expansion; RTL structure is automated, but semantic icon mirroring still requires manual review.
- Server rendering outside the current Vite application.
- Production usage, long-running performance, or installs outside the verified Vite consumer.

These gaps block a stable compatibility promise. Until they are closed, APIs and visual contracts may change between alpha versions.
