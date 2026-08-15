# Changelog

This project follows Semantic Versioning once a public API is released. During `0.x`, documented APIs may still change; every breaking alpha change must be called out here.

## Unreleased

### Added

- Assistant-ui-inspired public documentation shell with collapsible navigation, global search, a concise page outline, and mobile navigation.
- Introduction, Installation, Accessibility, Browser support, Security, Contributing, Releases, and Licensing documents inside the live system.
- MIT license, third-party notices, support policy, security policy, code of conduct, and `llms.txt` discovery index.
- Playwright projects for Chromium, Firefox, WebKit, mobile Chromium, and mobile WebKit, plus quality and browser-matrix CI workflows.
- Product pilot issue-management slice with search, creation, fields, dialog, table, toast, composed Shared Detail, archive, and Undo Stack recovery.
- Active scroll-tracked page outline with current-section progress and one current-theme toggle.
- Cross-platform visual regression baselines for light, dark, focus, loading, error, and the Product pilot.
- Automated axe, RTL, forced-colors, reduced-motion, zoom-proxy, and pilot interaction-performance checks.
- Issue and pull-request templates, maintainer ownership, publication configuration, migration and release policies, release-note categories, and a non-publishing release-candidate workflow.

### Quality

- 106 automated tests passing after the public-documentation and Product pilot changes.
- A temporary clean consumer compiles and builds the complete generated registry item.
- Production documentation bundle measures 293,988 gzip bytes JavaScript and 29,318 gzip bytes CSS; pilot Shared Detail selection measured 530 ms and dialog open 263 ms in the final full-matrix Chromium pass.
- The automated Chromium, Firefox, WebKit, mobile Chromium, and mobile WebKit matrix passes locally. Chrome/Safari zoom and Safari VoiceOver Dialog/Menu anchors are manually recorded; Edge, physical touch, manual high contrast, content expansion, and full-catalog branded coverage remain gates.

No package, canonical repository, or registry endpoint has been published.

## 0.1.0-alpha.0 — 2026-08-14

### Added

- 34 documented UI components across controls, overlays, navigation, feedback, data display, and authored interactions.
- Four foundation references: Color, Typography, Spacing, and Motion.
- Four interaction Playgrounds: Edit in place, Find and act, Preserve context, and Recover from action.
- Product recipes, meaningful state contracts, use/avoid guidance, accessibility contracts, typed API tables, and copy-ready code.
- A shared Component DNA contract for 28/32/36 px controls, 6/8/10 px shape tiers, 14 px icon boxes, semantic surfaces, focus geometry, and motion timing.
- Compact, Context, and Flow specimen types so documentation geometry follows the component's actual product role.
- shadcn-compatible individual and complete-system registry artifacts with structural verification.
- Namespaced `@index` resolution plus a fresh Vite consumer canary for all 34 individual items and the complete-system item.
- Light-first cool graphite tokens and a fully reviewed dark theme.

### Changed

- Shared Detail now adapts motion to pointer, keyboard, and reduced-motion input.
- Table documentation now demonstrates real sorting, filtering, selection, empty results, and pagination.
- Product previews are interactive while State previews are inert, visually isolated inspections; focus is shown only for keyboard input or an explicit focus-state specimen.
- Button, Text Field, Menu, Dialog, Table, and Shared Detail were reworked as visual and behavioral anchors for the full system.
- Registry artifacts now ship a generated component-only stylesheet instead of the documentation workbench stylesheet, reducing the source CSS from 182,740 bytes to 60,051 bytes.
- Reduced motion preserves informative opacity feedback while removing spatial travel.

### Quality

- 102 automated tests passing at the alpha checkpoint.
- Manual 1280 x 720 visual review completed for all 34 component routes in light and dark themes, plus every foundation and pattern route.
- Production, type, registry, accessibility, keyboard, worker, and fresh-consumer builds passing.
