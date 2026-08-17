# Teum completion audit and roadmap

Date: 2026-08-16
Scope: public landing, documentation, registry/package, quality evidence, open-source operations, release readiness
Method: current-run browser review at 1280 × 720, repository inspection, public GitHub inspection, and official-source research

## Decision

The landing page should not inherit the documentation workspace's density. Its job is to explain Teum, establish taste, and move an adopter to one clear next action. Use a quieter, more editorial first viewport with substantially more whitespace; keep the Linear-like density inside the live product specimen where it proves the system rather than around the specimen.

The component catalog is already broad enough. The next quality ceiling is adoption confidence: a truthful install path, consistent evidence, package interoperability, manual platform coverage, and open-source maintenance. Do not add primitives just to increase the public count.

## Current-run visual audit

1. **Public home — Good, not yet final.** The hierarchy and monochrome character are coherent. The product proof enters the first viewport early enough that the page still reads like a compact documentation intro. Give the hero roughly 70–78vh on desktop, lower the opening composition, and add 64–96px before the first proof. Later transitions should use a 96–160px editorial rhythm. Keep one primary action.
2. **Installation — Needs simplification.** The content is accurate and unusually complete, but the first-use path asks the adopter to understand too much before seeing a successful component. Split a one-minute quickstart from source ownership, pinned installs, updates, and troubleshooting.
3. **Choosing components — Strong.** The task-based adjacent-choice guidance is already a differentiator. Preserve it and deepen cross-links from relevant component pages instead of rebuilding it.
4. **Shared Detail — Strong and distinctive.** This is the clearest proof that Teum is an authored interaction system rather than a generic primitive collection. Make it the primary live evidence on the landing and in launch materials.

Reference comparison: the current OpenAI public home uses a large quiet canvas, a single dominant action, and a delayed next evidence block. Borrow that observable pacing only; do not copy its brand, assets, typography, or exact layout.

## Verified baseline

- 45 public components and 48 registry items.
- React 18.3.1 and React 19.2.8 consumer builds, TypeScript, framework-neutral CSS, and an optional Tailwind CSS v4 bridge.
- 151 source tests, 90 light/dark Storybook contract runs, 312 visual baselines, 66 public routes, and five Playwright browser/device projects.
- Immutable versioned registry artifacts, clean consumer tests, upgrade tests, package allowlisting, checksums, SBOM, release-candidate workflows, and protected `main` checks.
- Public npm publication, independent production adoption, Windows/Edge evidence, physical-device interaction evidence, and external accessibility review remain unverified and must stay labeled as gates.

## P0 — Make the current candidate internally truthful

1. **Reconcile the working tree.** Inventory the current 168 changed or untracked paths; split visual, documentation, distribution, test, and deployment changes into reviewable units without discarding owner work.
2. **Create one generated evidence manifest.** Generate version, component count, registry count, route count, test count, Storybook count, visual baseline count, browser results, artifact hashes, and generation timestamp from executable sources.
3. **Parity-check every public claim.** Fail CI when README, Compatibility, Release QA, Open-source Readiness, Accessibility Evidence, or release notes disagree with the generated manifest.
4. **Remove current evidence drift.** Update the stale 35-component/108-test readiness report, reconcile the 161-versus-181 browser count, and make the accessibility scope describe the actual 66-route coverage.
5. **Fix GitHub issue-form metadata.** Create or remove the missing `needs-triage` and `proposal` labels so the existing YAML issue forms are valid and discoverable.
6. **Align public metadata.** Keep the repository homepage, package homepage, canonical URL, registry homepage, release assets, social metadata, and Vercel project on `https://teum.minwookshin.com`; preserve the old interactions host as a path-preserving redirect.
7. **Remove split documentation surfaces.** Disable the unused wiki if it has no intentionally maintained content. Keep Discussions off until there is enough maintenance capacity to answer it.
8. **Re-run the clean-room candidate from one clean commit.** Only that commit's artifacts count as RC evidence.

## P1 — Finish the spacious public landing

1. Give the desktop hero a deliberate 70–78vh editorial field instead of using the documentation section rhythm.
2. Increase top breathing room and the hero-to-proof interval; allow the proof to begin below the first fold at 720px if the page remains understandable without it.
3. Keep one central `Documentation` route and one primary install/get-started action. GitHub and theme remain quiet icon actions.
4. Retain a short compatibility/trust line; move detailed matrices to documentation.
5. Keep the dense issue-workspace specimen self-contained. The specimen demonstrates compact capability; the surrounding page demonstrates restraint.
6. Use fewer, larger evidence sections: authored behavior, installation ownership, accessibility evidence, and source trust. Avoid a generic marketing-card grid.
7. Give section openings 96–160px vertical separation and maintain a readable line length rather than widening copy to fill the canvas.
8. Preserve dark mode, 200% zoom, reduced motion, and keyboard behavior in the more spacious layout.
9. Add responsive editorial compositions for 1440px, 1280px, 1024px, 768px, and 390px without turning the mobile home into stacked cards.
10. Validate persistent header coordinates across home-to-doc transitions so the wordmark, Documentation link, GitHub action, and theme action never jump.
11. Add complete title, description, canonical, Open Graph, social image, favicon, manifest, robots, sitemap, and structured-data coverage.
12. Lazy-load below-fold live proof code and heavy animation dependencies; the current documentation build is within 5,895 gzip bytes of the initial-JS budget and 81 bytes of the CSS budget.
13. Add a landing-specific Lighthouse/Core Web Vitals check and retain the existing deterministic asset budgets.

## P2 — Make first success take less than one minute

1. Put one tested command on the home and Quickstart. Never let marketing copy and the clean-consumer command diverge.
2. Choose one primary public registry path. The existing hosted namespace may remain canonical; also document the direct GitHub registry address when it is useful for source inspection.
3. After a tagged RC, publish a pinned-tag or full-SHA command beside the mutable latest command. Explain the trade-off in one sentence.
4. Show `view`, `--dry-run`, and `--diff` before source-changing installs.
5. Build a disposable quickstart fixture in CI and prove: initialize, install Button, import styles, render, typecheck, build.
6. Provide separate Plain CSS and Tailwind v4 examples while keeping CSS the source of truth.
7. Keep advanced topics below first success: namespace setup, version pinning, source updates, accepting local modifications, and complete-system installs.
8. Add copy feedback that is announced accessibly and never changes command geometry.
9. Add a compact troubleshooting matrix for path aliases, CSS order, missing providers, portals, peer versions, and local source edits.
10. Explain the copied-source contract clearly: what Teum owns, what the adopter owns, how updates are inspected, and when a diff requires manual resolution.
11. Add one minimal external-consumer example repository only when its dependency and maintenance cost can be owned.

## P3 — Make the documentation self-serve

1. Preserve the existing Choosing Components page; add context links from adjacent primitives rather than duplicating its tables.
2. For every component, keep the compact core: purpose, live preview, production example, distinct states, usage, accessibility, keyboard behavior, and API.
3. Add component-specific `When to use`, `When not to use`, anatomy, content rules, responsive behavior, and pitfalls only when they convey a real decision.
4. Generate API reference rows from exported TypeScript or parity-check them against compiler output.
5. Add search synonyms and task vocabulary so adopters can find `dropdown`, `picker`, `command`, or `notification` even when Teum uses a different canonical name.
6. Add link checking, heading checking, spelling, image-alt checking, and copyable-snippet execution to documentation CI.
7. Verify the live outline at every heading depth, including keyboard navigation and 200% zoom.
8. Add page-level Markdown or copy-for-agent output and `llms.txt` only if generated from the same current documentation source.
9. Add migration notes for each breaking RC and a concise upgrade guide for locally modified source.
10. Add documentation versioning only after more than one supported public line exists; do not prebuild an empty version switcher.
11. Give Shared Detail, Action List, and Undo Stack a connected authored-story page that explains find-and-act, inspect-without-losing-place, and mutate-and-recover.

## P4 — Harden the component and package contracts

1. Freeze each component's controlled/uncontrolled behavior, default values, event order, form participation, refs, slots, portals, and focus return.
2. Add a strict package consumer with `skipLibCheck: false`; do not let fixture convenience hide declaration problems.
3. Add a Next.js App Router consumer to test SSR, hydration, client boundaries, CSS loading, portals, and server/client import behavior.
4. Decide and document where `use client` belongs for hook- and browser-dependent files rather than allowing each consumer to discover it.
5. Test development Strict Mode and concurrent rerender paths for duplicated effects, timers, announcements, and focus restoration.
6. Verify native form reset, required/invalid states, autofill, browser password managers, and submit behavior for every form control.
7. Verify nested overlay escape order, outside interaction, scroll locking, inertness, and z-index contracts across Flyout, Modal, and Toast layers.
8. Verify RTL, translated-length, locale, timezone, date, and number behavior for relevant components.
9. Add public subpath exports or prove root-import tree shaking before an npm release; measure per-component JavaScript and CSS cost.
10. Run `publint`, `arethetypeswrong`, tarball-content, source-map, license-notice, and ESM consumer checks on the packed candidate.
11. Create a deprecation contract and changelog annotations before the first stable removal.
12. Keep prior Interaction Index artifacts immutable byte-for-byte and begin Teum-only namespace changes in the next candidate line.
13. Do not add another primitive until a product composition exposes a missing task. Possible future candidates belong in proposal issues, not the release scope.

## P5 — Finish accessibility and platform evidence

1. State WCAG 2.2 AA as the engineering target, not a certification claim.
2. Complete keyboard-only paths for every component and authored pattern, including focus order, focus return, and escape behavior.
3. Complete VoiceOver + Safari review for the whole high-risk set, then add NVDA with Firefox/Chrome on Windows. Treat JAWS as an additional external gate if unavailable.
4. Test Edge on Windows and Windows High Contrast.
5. Test macOS Increase Contrast and Reduce Transparency on the final candidate.
6. Test physical iPhone and Android interactions: touch, virtual keyboard, safe areas, orientation, viewport resize, and overlay dismissal.
7. Review 200% and 400% zoom, reflow, text spacing, and no-content-loss paths on high-risk documentation and component routes.
8. Human-review one verbose translation and one RTL translation, including icon direction and truncation.
9. Verify the WCAG 2.2 24×24 CSS-pixel target-size minimum or its spacing exceptions; retain larger targets where product context allows.
10. Verify drag alternatives for any authored drag behavior.
11. Keep axe/Storybook automation as the first line, not as conformance evidence; record manual sessions with OS, browser, assistive technology, route, result, and defect link.
12. Seek one independent accessibility review before a stable claim. The workflow and evidence template can be built locally; the independent result cannot be manufactured.

## P6 — Recover performance headroom

1. Profile why the current initial JavaScript is 344,105/350,000 gzip and CSS is 39,919/40,000 gzip before adding landing features.
2. Route-split documentation groups and lazy-load below-fold live specimens, syntax highlighting, and motion-heavy proofs.
3. Ensure the public home does not eagerly import the entire component catalog.
4. Measure root-package, Button-only, overlay, form, table, and complete-system bundle cost in clean consumers.
5. Make bundle size regression checks component-aware rather than measuring only the documentation application.
6. Audit unused CSS and decide whether safe component-level CSS entry points are warranted without breaking the plain-CSS ownership contract.
7. Track LCP, INP, CLS, font loading, and image behavior for home and docs; add field data only after there is real traffic and consent-aware analytics.
8. Raise budgets only when the increase is explained by measured product value, never to silence a new regression.

## P7 — Harden open-source trust and maintenance

1. Keep the existing strict branch protection, browser matrix, SBOM, checksums, and candidate attestations.
2. Pin third-party GitHub Actions to reviewed full commit SHAs and give each workflow least-privilege permissions.
3. Add dependency review on pull requests and CodeQL for relevant languages.
4. Add an OpenSSF Scorecard workflow as a security-health diagnostic; do not optimize the product for a badge or present the score as proof of safety.
5. Keep private vulnerability reporting live and test the documented contact route.
6. Use npm trusted publishing with OIDC and automatic provenance if/when publication is explicitly authorized. Do not create or retain a long-lived publish token.
7. Add CODEOWNERS only where ownership is real; avoid pretending a solo repository has a review team.
8. Make contributor setup one reproducible command, with expected Node/npm versions and a fast pre-PR check.
9. Maintain a small triage vocabulary, component-proposal template, reproducible bug template, and release-blocker label.
10. Publish support and response expectations that match actual maintainer capacity. Enable Discussions only when they can be maintained.
11. Add a proposal-to-product-proof gate so catalog growth is driven by real composition, accessibility, and API evidence.

## P8 — Build adoption evidence and launch material

1. Create one concise public README that answers what Teum is, why its authored behavior is different, how to install one component, current status, and where to read the docs.
2. Record one short, reduced-motion-safe Shared Detail → action → undo demo. Avoid a montage of generic primitives.
3. Publish three real compositions that exercise forms, data, overlays, feedback, and authored recovery behavior.
4. Create one independent consumer pilot maintained outside the Teum source tree; capture install, customization, update, and defect evidence.
5. Ask outside users to complete a scripted first-install task and component-choice task; record time, confusion, and failures rather than testimonials alone.
6. Add a feedback issue route and link it from relevant docs without turning every page into a marketing funnel.
7. Prepare release notes, migration notes, social preview, demo script, portfolio case study, and launch post from verified evidence only.
8. Never claim production adoption, broad browser support, or accessibility conformance before the corresponding evidence exists.

## P9 — Stabilize toward 1.0

1. Hold an API stabilization window after the first public RC and classify every change as fix, additive, deprecation, or breaking.
2. Maintain semver, release notes, immutable registry tags, and tested upgrade paths.
3. Provide codemods only for repeated breaking migrations that can be transformed safely.
4. Define supported React, TypeScript, browser, and primitive ranges from tested evidence rather than optimistic peer ranges.
5. Resolve real consumer composition failures before adding catalog breadth.
6. Require at least one independent maintained install and a meaningful real-use period before calling the system stable.
7. Confirm that ongoing triage, security response, dependency updates, and release maintenance fit the owner's capacity.

## What can and cannot be completed solo

Most engineering and design work through a strong public RC can be completed locally: landing, docs, registry, tests, package consumers, CI, security workflows, evidence generation, performance, and the manual macOS checks available in this environment.

The following cannot truthfully be completed alone in this environment: independent adoption, independent accessibility review, Windows/Edge evidence without the platform, physical iOS/Android gesture evidence without observable device control, user-task research, npm account/trusted-publisher activation, and final publication approval. Build the harness and exact evidence record for each, then stop at the gate until the real evidence exists.

## Practical sequence and effort

| Pass | Outcome | Focused effort estimate |
| --- | --- | --- |
| 1 | Truthful, clean RC base | 1–2 design-engineering days |
| 2 | Spacious final landing + performance headroom | 1–2 days |
| 3 | One-minute install and self-serve docs | 1–2 days |
| 4 | Package, SSR, API, and upgrade hardening | 2–4 days |
| 5 | Accessibility and cross-platform evidence available locally | 2–4 days |
| 6 | Security, governance, launch assets, final visual QA | 1–3 days |

A strong public RC is approximately 8–15 focused design-engineering days from the current working tree, plus defects discovered during verification. A defensible beta still needs real external use; a stable 1.0 is governed by stability and maintenance evidence and will usually take one to three months or longer, not by how fast another component can be implemented.

## Release gates

### Strong public RC

- Clean, reproducible candidate commit and artifacts.
- No evidence drift.
- Final landing, docs, dark/light, 200% zoom, reduced motion, and catalog visual QA.
- One-minute tested install path.
- Strict consumers, SSR/Next evidence, registry upgrade evidence, and package diagnostics.
- Security workflows and least-privilege Actions.
- All locally available manual evidence recorded; unavailable external gates explicit.

### Public beta

- At least one independent maintained consumer.
- Repeated install/update/customization evidence.
- External API and documentation feedback resolved.
- Remaining high-risk platform/accessibility evidence complete or support range narrowed honestly.
- A measured stabilization period with no unresolved release-blocking defects.

### Stable 1.0

- Stable public API window and tested support matrix.
- Breaking-change and migration policy proven by at least one real upgrade.
- Independent adoption and accessibility evidence.
- Sustainable triage, security, dependency, and release operations.

## Official research basis

- OpenAI public home: quiet content-led canvas and delayed evidence pacing, used only as an observable visual-quality reference — https://openai.com/
- shadcn GitHub Registries: direct public-repository installs, validation, refs, `view`, `--dry-run`, and `--diff` — https://ui.shadcn.com/docs/registry/github
- Primer documentation: concise production-quality examples, component decisions, pitfalls, anatomy, responsive behavior, and accessibility guidance — https://primer.style/product/contribute/documentation/
- Storybook accessibility testing: automated axe checks are a first line and do not replace real-device/manual review — https://storybook.js.org/docs/writing-tests/accessibility-testing
- WCAG 2.2: current W3C target including focus not obscured, dragging alternatives, and 24px minimum target-size criteria — https://www.w3.org/TR/WCAG22/
- GitHub dependency review: pull-request dependency-change and known-vulnerability enforcement — https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-dependency-changes-in-a-pull-request
- npm trusted publishing and provenance: OIDC publication without long-lived tokens and automatic provenance for eligible public packages — https://docs.npmjs.com/trusted-publishers/
- OpenSSF Scorecard: open-source security-health diagnostics, not a substitute for a security review — https://github.com/ossf/scorecard

## Saved evidence

- `01-teum-home-light.jpg`
- `02-openai-home-reference.jpg`
- `03-teum-installation-light.jpg`
- `04-teum-choosing-light.jpg`
- `05-teum-shared-detail-light.jpg`
