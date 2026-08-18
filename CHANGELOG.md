# Changelog

This project follows Semantic Versioning once a public API is released. During `0.x`, documented APIs may still change; every breaking pre-release change must be called out here.

## 0.1.0-rc.29 — 2026-08-18

### Refined

- Expanded the removable Badge hit area to the 24px mobile target floor without changing its compact visual silhouette.

### Quality

- Updated browser and accessibility contracts to the current Library and component-dialog labels.
- Preserved `0.1.0-rc.28` byte-for-byte and opened a new candidate so the registry source contains the mobile touch fix.

## 0.1.0-rc.28 — 2026-08-18

### Refined

- Aligned pointer press feedback with the shared motion contract and kept keyboard-opened surfaces free of decorative travel.
- Synchronized the public `whatiuse` identity, homepage metadata, and social preview with the current product surface.

### Quality

- Preserved `0.1.0-rc.27` byte-for-byte after the immutable registry gate detected source drift and opened a new candidate instead of overwriting it.
- Rebuilt release evidence from the current source while keeping publication and external-adoption claims locked.

## 0.1.0-rc.27 — 2026-08-18

### Refined

- Centered the Calendar & Date Picker field and its trigger-aligned calendar surface in the public catalog.
- Replaced the single upserted Toast preview with a bounded three-item stack that collapses by default and expands on hover or focus.
- Tightened Toast motion to short interruptible transform and opacity transitions with an opacity-only reduced-motion path.

### Quality

- Added focused assertions for unique event identities while keeping Undo scoped to its originating Toast.
- Preserved every earlier versioned registry candidate byte-for-byte and opened a new local candidate for this interaction polish.
- Kept deployment, tagging, GitHub Release creation, domain changes, and npm publication outside this pass.

## 0.1.0-rc.26 — 2026-08-18

### Refined

- Reworked all 40 public catalog previews around truthful component-owned interactions, stable specimen geometry, and direct repeat paths.
- Tightened control, overlay, navigation, feedback, and data-display composition across light, dark, and compact layouts.
- Kept the Toast preview to one upserted feedback channel and removed stale action content between variants.

### Quality

- Added focused interaction tests for controls, overlays, navigation, disclosure, and feedback previews.
- Preserved every earlier versioned registry candidate byte-for-byte and opened a new local candidate for this catalog pass.
- Kept deployment, tagging, GitHub Release creation, domain changes, and npm publication outside this pass.

## 0.1.0-rc.25 — 2026-08-17

### Fixed

- Raised quiet-button hit geometry to the 28px compact-control token on coarse pointers, eliminating a sub-pixel Chromium target-floor failure without changing desktop density.

### Quality

- Preserved the rejected `0.1.0-rc.24` preview byte-for-byte and opened a new immutable local candidate for the touch correction.
- Kept deployment, tagging, GitHub Release creation, domain changes, and npm publication outside this pass.

## 0.1.0-rc.24 — 2026-08-17

### Fixed

- Restored the shared token and accessibility foundation in Storybook so component contracts use the same 28/32/36px control geometry as adopters.
- Increased the Search Input clear action to a non-shrinking 24px target after the WCAG 2.2 target-size gate caught the previous 22px control.
- Replaced the remaining mutable component-index and interaction-demo install commands with exact CLI and immutable registry URLs.

### Quality

- Preserved `0.1.0-rc.23` byte-for-byte and opened a new local candidate for the accessibility correction.
- Rejected this preview after mobile Chromium exposed a sub-pixel 24px target-floor failure on a quiet button; `0.1.0-rc.25` supersedes it.
- Kept deployment, tagging, GitHub Release creation, domain changes, and npm publication outside this pass.

## 0.1.0-rc.23 — 2026-08-17

### Added

- Added Donut Chart and Heatmap as source-owned Analytics components with semantic text fallbacks, keyboard inspection, reduced-motion behavior, registry artifacts, and clean-consumer coverage.
- Expanded Chart with line, area, bar, and stacked-bar renderers plus explicit loading, empty, and error contracts.
- Rebuilt the public component index as a responsive 4/3/2/1-column catalog of 45 square, live component previews.

### Refined

- Simplified the documentation shell and collection navigation while preserving the persistent workspace structure.
- Tightened component preview geometry, overlay focus treatment, dark-theme ownership, and Analytics/Product Pattern visual contracts.
- Kept the npm package private and this candidate local; no deployment or publication is part of this release-candidate pass.

## 0.1.0-rc.22 — 2026-08-17

### Public beta

- Added a machine-readable beta gate for the live site, GitHub prerelease, immutable registry, npm beta, independent installs, feedback rounds, external review, and the API stability window.
- Added an isolated public-package assembler and verifier while keeping the repository package private.
- Added a stage-only npm trusted-publishing workflow with no long-lived publication token.
- Added a live verifier that compares deployed registry artifacts with the candidate bytes and checks release, cache, and security-header contracts.
- Replaced the landing quickstart with an exact tag-pinned GitHub registry command that works before npm publication.

### Evidence boundary

- Public beta publication is separate from v1 readiness. Independent adoption, two feedback rounds, external support reviews, and the 28-day stability window remain open until dated evidence exists.

## 0.1.0-rc.21 — 2026-08-17

### Security

- Pinned every GitHub Action to a reviewed full commit SHA and disabled persisted checkout credentials.
- Isolated Pages deployment and package attestation permissions from dependency installation and build steps.
- Added exact candidate file allowlists, fresh staging directories, immutable registry history verification, and shared hosting security-header checks.
- Isolated clean-room verification in a no-hardlinks Git clone so nested consumer fixtures cannot mutate the owner's repository metadata.

### Quality

- Refreshed the complete package, registry, browser, accessibility, visual, and performance evidence for one reproducible public RC.
- Kept npm publication, deployment, tagging, and GitHub Release creation manual and disabled in repository scripts.

## 0.1.0-rc.20 — 2026-08-17

### Added

- Added exact Vite and Next.js App Router quickstarts for the pinned source registry.
- Added concise theme, update, migration, and troubleshooting guidance for first-time adopters.
- Added clean-consumer Adoption DX evidence for React 18, React 19, Next.js, and reviewed source updates.

### Quality

- Verified registry installation, one semantic token override, light and dark themes, strict type checking, and production builds in clean consumers.
- Verified that update dry-run and file diff do not write, while overwrite remains an explicit adopter decision.
- Kept the ten-minute target scoped to automated clean-room journeys; no independent novice timing or production adoption is claimed.

## 0.1.0-rc.19 — 2026-08-16

### Added

- Added one generated agent contract covering 69 installable registry items, nine product recipes, fourteen adjacent-component selection rules, and fourteen forbidden composition rules.
- Added an installable `teum` coding-agent skill, machine-readable registry metadata, public JSON Schema, and concise Agent integration documentation.
- Added a deterministic 30-task B2B product evaluation with required and forbidden component assertions.

### Quality

- Verified 30/30 recipe selections, zero contract violations, skill validation and project-local installation, and one clean React + TypeScript + Vite install, typecheck, and production build containing all thirty generated task modules.
- Kept the Core, Data, Analytics, and Product Patterns contracts unchanged; Goal 5 describes and validates their composition rather than introducing another visual primitive.
- Kept npm publication and deployment locked. The evaluation is internal contract evidence, not an external model benchmark or production-adoption claim.

## 0.1.0-rc.18 — 2026-08-16

### Fixed

- Added the missing accessible name for the Billing & Usage invoice action column found by the light-theme Storybook accessibility gate.

### Quality

- Preserved the rejected `rc.17` preview byte-for-byte and opened a new immutable candidate for the corrected Product Patterns registry source.

## 0.1.0-rc.17 — 2026-08-16

### Added

- Added three complete B2B product patterns: Customer Workspace, Billing & Usage, and Members & Permissions.
- Added an agent-readable Product Patterns contract covering task sequence, state ownership, invariants, failure states, accessibility, and composition boundaries.
- Added an installable `teum-product-patterns` registry block with a fresh React + TypeScript + Vite consumer proof.

### Quality

- Added light and dark Storybook baselines, recipe interaction tests, automated accessibility checks, reduced-motion and reflow coverage, and a dedicated route-level performance budget.
- Kept the 45-component Core and 15-component Data/Analytics layers unchanged; Goal 4 composes those approved parts instead of adding another primitive.
- Preserved every earlier versioned registry artifact byte-for-byte and opened a new immutable candidate for the additive pattern contract.
- The generated preview was rejected before release after Storybook found an unnamed invoice action column; `rc.18` supersedes it.

## 0.1.0-rc.16 — 2026-08-16

### Added

- Added Teum Analytics v1 as an additive product layer: Sparkline, Metric, Chart, Comparison, Breakdown, Goal, Funnel, Cohort, and Timeline.
- Added SaaS Overview, Product Usage, and Conversion & Retention recipes with synchronized inspection, legend filtering, exact-value tables, cohorts, funnels, and supporting records.
- Added typed analytics data helpers and agent-readable component, state, and recipe contracts.
- Added an installable `teum-analytics` registry block and a clean React + TypeScript + Vite consumer proof.

### Quality

- Added light and dark Storybook contracts, recipe-level visual baselines, keyboard and reduced-motion browser coverage, and route-aware bundle budgets.
- Kept the 45-component Core catalog unchanged and preserved all earlier versioned registry artifacts byte-for-byte.
- Replaced the rejected `rc.15` preview with a new immutable candidate after correcting its registry and release evidence.

## 0.1.0-rc.14 — 2026-08-16

### Fixed

- Completed the standalone Data Table registry dependency graph for Button, Spinner, and the shared view-state contract.
- Added an import-to-registry-dependency integrity check for every individually installable product component, so aggregate blocks can no longer hide a missing atomic dependency.

### Quality

- Preserved `rc.13` byte-for-byte after its clean-room failure and opened a new immutable candidate for the corrected install graph.

## 0.1.0-rc.13 — 2026-08-16

### Added

- Expanded Teum Data to six public product primitives with Date Range Filter and Data Export Menu.
- Added a versioned, compact URL state codec; controlled and server-oriented request contracts; persistent personal saved views; column resizing and pinning; and CSV/JSON export helpers.
- Added Customer Directory and Audit Log alongside Issues Workspace, covering 5,000-record server data and a virtualized 10,000-event immutable collection.
- Added agent-readable component, view-state, and three-recipe contracts plus a complete registry block for the product layer.

### Quality

- Added browser coverage for shareable state, saved-view persistence, large-row virtualization, and export choices.
- Prevented deep-link navigation from programmatically scrolling the persistent application shell off-screen on narrow viewports.
- Preserved every earlier immutable registry candidate; `rc.13` is the first candidate containing the complete Teum Data v1 boundary.

## 0.1.0-rc.11 — 2026-08-16

### Quality

- Added compiler-owned runtime export and contract metadata so package, registry, and freeze checks verify the same Teum Data boundary.
- Preserved the immutable rc.10 preview and opened a new candidate rather than rewriting its generated manifest.

## 0.1.0-rc.10 — 2026-08-16

### Added

- Added Teum Data as the first product layer: Data Table, Filter Builder, Data Toolbar, Bulk Action Bar, and a composed Issues Workspace.
- Added Motion Contract v1 and an agent-readable Issues Workspace composition contract.
- Added individual registry items and a `teum-data` vertical-slice install.

### Quality

- Kept the 45-component Core catalog frozen while recording four additive product-component APIs separately.
- Added clean React + TypeScript + Vite installation proof for the complete Teum Data slice.
- Verified the Issues Workspace in light and dark themes, at 200% equivalent reflow, and across desktop and mobile Chromium, Firefox, and WebKit paths.

## 0.1.0-rc.8 — 2026-08-16

### Fixed

- Kept Toast inside Teum's documented elevation scale instead of inheriting Sonner's global maximum z-index.
- Made the Toast layer contract assert the visible feedback surface while still verifying the zero-height positioning container and single-message upsert behavior.
- Prevented the page outline from selecting the final section before a document has actually scrolled near the bottom.

### Quality

- Refreshed the intentionally more spacious landing-page baseline and added a semantic first-section assertion for the Installation scroll spy.
- Preserved `0.1.0-rc.7` byte-for-byte and opened a new immutable candidate for the corrected public Toast CSS.

## 0.1.0-rc.7 — 2026-08-16

### Security

- Pinned public shadcn commands, versioned-registry package dependencies, and GitHub Actions to reviewed exact versions or commit SHAs.
- Isolated Pages and attestation authority from build steps, disabled persisted checkout credentials, and added reviewed dependency-update automation.
- Added an append-only history ledger for every immutable registry directory plus source-commit comparison for anchored releases.
- Added consistent hosting security headers, route-specific cache contracts, and a hard 404 boundary for missing registry artifacts.

### Quality

- Made package and RC assembly use fresh staging directories, exact file allowlists, checksums, and atomic finalization.
- Added an adopter evaluation guide, structured feedback form, current-candidate release notes, and launch drafts that preserve the unpublished and adoption-unproven status.
- Kept npm publication locked; candidate generation and attestation remain non-publishing workflows.

## 0.1.0-rc.6 — 2026-08-16

### Changed

- Split the public landing route from the documentation application so the first viewport loads a small editorial shell while the full component workbench remains lazy.
- Added an adopter-side pinned-registry quickstart, readable wrapped commands, installation troubleshooting, section-aware search, section deep links, and accurate per-component registry references.
- Replaced display-name-derived import guesses with compiler-derived primary exports in component reference pages.

### Quality

- Added machine-readable quickstart evidence from a fresh React + TypeScript + Vite consumer and made the release summary reject missing or stale install proof.
- Preserved explicit React client boundaries in the package and copied registry source, then added a fresh-consumer Node SSR and zero-recoverable-error hydration gate.
- Began a new immutable candidate because React client-boundary and package-consumer contract work changes generated source; every earlier versioned registry artifact remains byte-for-byte preserved.

## 0.1.0-rc.5 — 2026-08-16

### Changed

- Moved the canonical Teum documentation and mutable registry origin to `https://teum.minwookshin.com` while retaining every earlier versioned registry artifact byte-for-byte.
- Made the landing-to-documentation header share one viewport coordinate contract so the wordmark, centered Documentation entry, GitHub action, and theme action no longer move during the transition.

## 0.1.0-rc.4 — 2026-08-15

### Fixed

- Made the immutable registry dependency graph self-contained: versioned artifacts rewrite internal `@teum/*` dependencies to the same-version `@teum-pinned/*` scope instead of reaching back into the mutable channel.
- Added the missing tested `@base-ui/react` dependency to the Button registry item.

### Quality

- Added a real shadcn CLI clean-consumer gate that configures only the pinned registry, installs Button and its transitive base files, verifies declared packages, and installs the optional Tailwind bridge without adding Tailwind to the plain CSS fixture.
- Added separate mutable-source and pinned-manifest digests so integrity metadata matches the bytes served by each channel.
- Preserved `0.1.0-rc.3` byte-for-byte; it remains available as historical prerelease evidence but is superseded for pinned installation.

## 0.1.0-rc.3 — 2026-08-15

### Changed

- Renamed the public system from Interaction Index to Teum, including the future npm package candidate, registry namespace, CSS class prefix, token prefix, and cascade layers.
- Set `https://interactions.minwookshin.com` as the canonical documentation and registry origin while preserving the portfolio's Interaction Index URL as the product's existing entry point.
- Expanded the peer contract to React 18.2+ and React 19, with clean TypeScript/Vite consumers for both major lines.
- Kept framework-neutral CSS as the styling source of truth and added an optional Tailwind CSS v4 semantic-token bridge.

### Distribution

- The active registry uses `@teum`, `teum-base`, `teum-tailwind`, and the complete `teum` item.
- The future npm package name is `teum`; it remains private and unpublished until npm ownership, trusted publishing, and external install gates are complete.
- Versioned Interaction Index registry artifacts from earlier candidates remain byte-for-byte preserved. Teum begins a new immutable namespace with this candidate.

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
