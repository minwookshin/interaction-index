# Compatibility

Teum `0.1.0-rc.29` is an MIT-licensed, unpublished npm release candidate. The table below records the environment verified on 2026-08-18; it is evidence, not a broad support promise.

## Verified stack

| Layer | Verified version |
| --- | --- |
| Node.js | 22.14.0 |
| npm | 10.9.2 |
| React / React DOM consumer matrix | 18.3.1; 19.2.0 quickstart; 19.2.8 package compatibility |
| TypeScript | 7.0.2 |
| Base UI | 1.7.0 |
| React Aria Components | 1.20.0 |
| Internationalized Date | 3.12.3 |
| Motion | 13.1.0 |
| shadcn CLI | 4.18.0 |
| Tailwind CSS / CLI bridge | 4.3.3 |
| Vite | 6.4.3 |
| Vitest | 4.1.10 |
| Playwright | 1.62.1 |

The lockfile is the reproducible source for every direct and transitive version used by this verification.

## Verified public contract

- 45 frozen public components, 356 compiler-extracted exports, and 145 semantic tokens, plus 17 additive product components across Teum Data and Teum Analytics.
- 238 source tests across component, documentation, keyboard, state, accessibility, data, analytics, Product Pattern, and agent-contract behavior.
- 104 light/dark Storybook contract runs: 90 Core Product/State checks, eight Analytics surface checks, and six Product Pattern checks.
- 332 visual baselines: 138 full-viewport public-route screenshots, 180 isolated Core Product/State screenshots, eight Analytics surface screenshots, and six Product Pattern screenshots.
- 69 public routes: 1 landing page, 13 documentation pages, 5 foundation routes, 45 component routes, and 5 pattern routes.
- TypeScript strict no-emit checking, Storybook production build, Vite documentation build, and Sites worker contract.

## Verified distribution boundaries

- shadcn-compatible generation for every Core component, 17 product primitives, nine product recipes, shared contracts, the optional Tailwind CSS v4 bridge, and the complete-system item: 74 declared registry items.
- Deterministic SHA-256 metadata for registry JSON, copied files, compiler-extracted APIs, and semantic tokens.
- A content-locked versioned registry at `/r/v/0.1.0-rc.29/` that pins every internal dependency to the same `@teum-pinned` scope, rejects same-version rewrites, and preserves every earlier artifact.
- A fresh React + TypeScript + Vite consumer executes the documented `shadcn registry add` command, installs Button through `@teum-pinned`, type-checks, and completes a production build. The current React 18 / React 19 runs passed in 7.2 / 8.7 seconds locally; those durations are observational, not support guarantees.
- The same plain-CSS fixture resolves Button's Base UI and CSS dependencies plus the optional Tailwind bridge without installing Tailwind CSS.
- Fresh source-consumer builds for a Button-only install, every individual item, the complete system, and the staged upgrade/accept flow.
- A packed private npm candidate with explicit exports, tarball allowlisting, integrity metadata, and fresh TypeScript/Vite consumer builds against both React 18.3.1 and React 19.2.8.
- The private package entry retains a React `use client` boundary, matches all 201 runtime exports derived from the compiler-owned public surface, renders a representative tree with Node SSR, and hydrates that markup with zero recoverable mismatch errors in a fresh ESM consumer.
- A Tailwind CSS v4 clean consumer that compiles semantic utilities from `teum/tokens.css` and `teum/tailwind.css`; plain CSS remains the component styling source of truth.
- Nine product recipes cover issue management, customer data, audit history, SaaS health, product usage, conversion/retention, customer workspaces, billing/usage, and member permissions. The package dogfood boundary still forbids private source imports.
- `npm audit` reports zero known vulnerabilities for the verified lockfile.
- The production build enforces route-aware budgets for the landing, documentation shell, public documentation, Product pilot, and the heaviest component route; runtime evidence is recorded separately from field performance claims.

## Verified browser and accessibility behavior

- The five-project Playwright matrix covers Chromium, Firefox, WebKit, mobile Chromium, and mobile WebKit. The final `0.1.0-rc.29` run reported 353 applicable checks passed and 352 intentional project-ownership skips, with zero failures or flaky results.
- All 69 routes are scanned for serious/critical axe violations, 200% equivalent reflow, visible keyboard-hint atomicity, translated-content expansion, forced-colors structure, reduced-motion structure, and document overflow.
- A dedicated `0.1.0-rc.29` accessibility run recorded 55 applicable checks passed and 30 intentional project-ownership skips across the five configured browser projects, with zero failures or flaky results. The machine-readable record also owns skip paths, one-main/one-H1 structure, route announcements, and compact-navigation focus handoff.
- All 45 Product previews preserve a 24 CSS pixel effective target floor in mobile Chromium and mobile WebKit emulation.
- Text Field, Tabs, Menu, and Dialog complete representative touch paths in both mobile engines; the virtual-keyboard viewport proxy preserves field visibility and focus.
- Pointer, keyboard, focus-return, overlay dismissal, sorting, filtering, selection, pagination, RTL, responsive navigation, state-menu, layer, and authored Product-pilot paths are covered.
- Product-pilot interaction measurements stayed below the 750 ms budget in every local browser project; exact local observations are recorded in the generated browser evidence rather than presented as field performance.
- Branded Chrome 151 passed Button keyboard focus and 200% zoom without content loss on macOS 26.5.2.
- Branded Safari 26.5.2 passed Button keyboard/zoom plus a live VoiceOver Dialog and Menu anchor review on macOS 26.5.2.

## External gates not yet verified

- Microsoft Edge on Windows, including Windows High Contrast.
- Physical iOS and Android devices, real software keyboards, safe areas, orientation changes, and device zoom.
- macOS Increase Contrast and Reduce Transparency on the final candidate.
- Human review of a verbose translation and an RTL translation, including semantic icon direction.
- Framework-specific RSC and SSR integration in Next.js, Remix, or another full application runtime beyond the verified Node render/hydration fixture.
- External production adoption, long-running product performance, or an independent human-maintained product install outside the verified consumers.
- Production p75 Core Web Vitals, real-network and physical-device latency, and production RUM INP.
- npm publication and trusted-publisher configuration remain intentionally incomplete.

`RC_EXTERNAL_GATES.md` defines the exact procedures and evidence record. These gaps do not invalidate the local candidate artifact, but they block a stable compatibility promise and any claim of external production readiness.
