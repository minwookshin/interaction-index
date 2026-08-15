# Changelog

This project follows Semantic Versioning once a public API is released. During `0.x`, documented APIs may still change; every breaking alpha change must be called out here.

## 0.1.0-rc.2 — 2026-08-15

### Changed

- Aligned the README, pinned registry example, compatibility record, external-gate template, and release-QA record with one RC version before public review.
- Preserved the npm publication lock while preparing a fresh, checksummed source-and-registry candidate.

### Quality

- Reuses the frozen 45-component, 210-export, and 145-token surface from RC1; no component API, token, behavior, or visual baseline changed in this metadata-only candidate.
- Passed fresh clean-room, registry, package, browser, accessibility, and release-candidate verification before assembly.

The `0.1.0-rc.2` candidate remains private at the npm boundary, unpublished, untagged, and unpushed until the remaining external gates and publication decisions are complete.

## 0.1.0-rc.1 — 2026-08-15

### Added

- DTCG token source with generated CSS, typed TypeScript, Figma handoff data, and a token-diff gate.
- Executable Storybook contracts for all 45 components in light and dark themes, including interaction, axe, and targeted Product/State visual regression coverage.
- Compiler-generated public API declarations, machine-readable metadata, a review report, and documentation export surfaces for 210 public exports.
- Field & Fieldset, Input Group, Kbd, Button Group, Toolbar, Sheet, Calendar & Date Picker, Context Menu, Tree, and Reorderable List, with composed Command Palette and Data Table recipes instead of duplicate monoliths.
- A documented Canvas, Stage, Float, Flyout, Modal, and Toast surface contract that keeps persistent structure tonal and reserves shadows for temporary elevation.
- Deterministic registry integrity metadata for every artifact and copied file, plus API and token contract hashes and a reviewable update diff.
- A private npm package candidate with explicit exports, React peer boundaries, tarball allowlisting, and a fresh TypeScript/Vite consumer test.
- A non-publishing GitHub package-candidate workflow prepared to attest the verified tarball without npm credentials.
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

- 151 source tests, 90 light/dark Storybook contract runs, and 312 release-level visual baselines passing.
- Registry verification now rejects source-wrapper drift and component/API catalog mismatches.
- The public-documentation and Product pilot flows remain covered by the current source and browser suites.
- A temporary clean consumer compiles and builds the complete generated registry item.
- Production documentation measures 343,245 gzip bytes of initial JavaScript, 479,382 gzip bytes across all JavaScript routes, and 39,983 gzip bytes CSS; advanced React Aria previews load only on their component routes. Pilot Shared Detail selection last measured 530 ms and dialog open 263 ms in the recorded full-matrix Chromium pass.
- The five-project Playwright matrix passes locally with 161 applicable checks and 324 intentional project-ownership skips. Automated long-content expansion, forced colors, reduced motion, touch target, touch path, and virtual-keyboard checks pass; Edge, physical devices, real OS contrast modes, human-language review, and full-catalog branded coverage remain external gates.

The source and mutable HTTPS registry retain their existing publication state. The `0.1.0-rc.1` npm candidate remains private, unpublished, untagged, and unpushed.

### Fixed

- Replaced the native live-state picker with the system Menu, kept it below its trigger, and reserved its quiet focus treatment for keyboard navigation.
- Removed the pointer-open focus ring from Context Menu triggers while retaining explicit keyboard focus, and corrected Reorderable List documentation to match its announced Tab-based drop-target navigation.
- Split Calendar, Tree, and Reorderable List demos from the initial documentation shell and added separate initial and total JavaScript performance budgets.
- Rebalanced the Text Field product recipe into one full-width identity field and two complete paired rows, with pointer focus no longer adding a dark container ring.
- Kept the private package candidate below its 4 MB budget by preventing Vite from duplicating the public registry inside the package build output.
- Aligned every navigation disclosure chevron to one trailing column, removed the sidebar scrollbar dead gutter while preserving scrolling, and added a deliberate nested catalog indent.
- Made Toast previews share one foreground identity and clear stale actions when feedback changes between confirmation, undo, and error.
- Stabilized Tabs panel geometry, compacted the primary Popover hierarchy, and refined Badge, Avatar, and Table rhythm in both themes.
- Centered the 326px Toast surface against Sonner's positioning container, kept one visible feedback item, and aligned the accepted 11px Avatar status indicator contract.
- Restored the mobile Product-pilot create action's accessible name while preserving its icon-only visual treatment, and separated desktop visual ownership from mobile reflow contracts.

### Breaking

- `toast` now exposes the documented Interaction Index facade (`success`, `info`, `warning`, `error`, `loading`, and `dismiss`) instead of leaking Sonner's full implementation API. Import advanced Sonner-only helpers directly from `sonner` until Interaction Index deliberately specifies them.

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
