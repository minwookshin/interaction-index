# Compatibility

Teum `0.1.0-rc.3` is an MIT-licensed, unpublished release candidate. The table below records the environment verified on 2026-08-15; it is evidence, not a broad support promise.

## Verified stack

| Layer | Verified version |
| --- | --- |
| Node.js | 22.14.0 |
| npm | 10.9.2 |
| React / React DOM consumer matrix | 18.3.1 and 19.2.8 |
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

- 45 frozen public components, 210 compiler-extracted exports, and 145 semantic tokens.
- 151 source tests across component, documentation, keyboard, state, and accessibility behavior.
- 90 light/dark Storybook Product/State contract runs for all 45 components.
- 312 visual baselines: 132 full-viewport public-route screenshots plus 180 isolated Product/State screenshots.
- 66 public routes: 11 documentation pages, 5 foundation routes, 45 component routes, and 5 pattern routes.
- TypeScript strict no-emit checking, Storybook production build, Vite documentation build, and Sites worker contract.

## Verified distribution boundaries

- shadcn-compatible generation for every component, the shared base, the optional Tailwind CSS v4 bridge, and the complete-system item: 48 declared items plus the generated registry catalog.
- Deterministic SHA-256 metadata for registry JSON, copied files, compiler-extracted APIs, and semantic tokens.
- A byte-locked versioned registry at `/r/v/0.1.0-rc.3/` that rejects same-version rewrites while preserving every earlier versioned Interaction Index artifact.
- Fresh source-consumer builds for a Button-only install, every individual item, the complete system, and the staged upgrade/accept flow.
- A packed private npm candidate with explicit exports, tarball allowlisting, integrity metadata, and fresh TypeScript/Vite consumer builds against both React 18.3.1 and React 19.2.8.
- A Tailwind CSS v4 clean consumer that compiles semantic utilities from `teum/tokens.css` and `teum/tailwind.css`; plain CSS remains the component styling source of truth.
- A realistic issue workspace built only from `teum` and `teum/styles.css`; no private source imports are permitted by its verifier.
- `npm audit` reports zero known vulnerabilities for the verified lockfile.

## Verified browser and accessibility behavior

- The five-project Playwright matrix covers Chromium, Firefox, WebKit, mobile Chromium, and mobile WebKit. The final run reported 161 applicable checks passed and 324 intentional project-ownership skips.
- All 66 routes are scanned for serious/critical axe violations, 200% equivalent reflow, visible keyboard-hint atomicity, translated-content expansion, forced-colors structure, reduced-motion structure, and document overflow.
- All 45 Product previews preserve a 24 CSS pixel effective target floor in mobile Chromium and mobile WebKit emulation.
- Text Field, Tabs, Menu, and Dialog complete representative touch paths in both mobile engines; the virtual-keyboard viewport proxy preserves field visibility and focus.
- Pointer, keyboard, focus-return, overlay dismissal, sorting, filtering, selection, pagination, RTL, responsive navigation, state-menu, layer, and authored Product-pilot paths are covered.
- Product-pilot interaction measurements stayed below the 750 ms budget in every local browser project; the recorded slowest run was 576 ms for Shared Detail selection and 315 ms for Dialog open in mobile WebKit.
- Branded Chrome 151 passed Button keyboard focus and 200% zoom without content loss on macOS 26.5.2.
- Branded Safari 26.5.2 passed Button keyboard/zoom plus a live VoiceOver Dialog and Menu anchor review on macOS 26.5.2.

## External gates not yet verified

- Microsoft Edge on Windows, including Windows High Contrast.
- Physical iOS and Android devices, real software keyboards, safe areas, orientation changes, and device zoom.
- macOS Increase Contrast and Reduce Transparency on the final candidate.
- Human review of a verbose translation and an RTL translation, including semantic icon direction.
- Server rendering outside the current Vite application.
- External production adoption, long-running product performance, or independent installs outside the verified consumers.
- npm publication, trusted-publisher configuration, remote provenance attestation, a public release tag, or a GitHub Release for this candidate.

`RC_EXTERNAL_GATES.md` defines the exact procedures and evidence record. These gaps do not invalidate the local candidate artifact, but they block a stable compatibility promise and any claim of external production readiness.
