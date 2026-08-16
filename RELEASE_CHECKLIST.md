# Release checklist

The current build is an MIT-licensed public-source alpha with an unpublished npm package. Complete every open item below before publishing the package or calling the system stable.

## Legal and ownership

- [x] The owner chooses and adds an explicit open-source license.
- [x] Direct runtime dependency and font licenses are recorded.
- [x] Contributor licensing terms and a code of conduct are documented.

The source is available under MIT. Package publication, browser support, and production-readiness are separate claims and remain gated below.

## Public trust

- [x] Replace the localhost registry homepage with the canonical public project URL.
- [x] Add the public repository and issue tracker to the README.
- [x] Define a private security-advisory path and supported-version policy.
- [x] Add CI that runs `npm run quality` on the verified Node line.
- [x] Document maintainers, release ownership, and response expectations.

## Consumer verification

- [x] Install the complete registry item into a fresh Vite consumer project.
- [x] Install every individual item into the same fresh consumer project.
- [x] Install Button from the live HTTPS registry with `shadcn@latest` in a clean Vite canary and complete a production build.
- [x] Verify generated source imports and the documented system stylesheet in a consumer TypeScript and production build.
- [x] Generate deterministic SHA-256 integrity metadata for registry artifacts, copied files, public APIs, and tokens.
- [x] Add a manifest diff that flags removed or type-changed API and token contracts before an update.
- [x] Generate a content-locked versioned registry path that preserves source bytes, deterministically pins internal dependencies to the same release scope, rejects same-version rewrites, and declares the immutable cache contract.
- [x] Verify install, local source modification, staged upstream review, explicit acceptance, and the post-upgrade consumer build.
- [x] Build a private npm tarball with explicit exports and verify it in a fresh TypeScript/Vite consumer.
- [x] Build the realistic issue-workspace dogfood product exclusively through public package exports and styles.
- [x] Capture and review a 1280 x 720 light/dark baseline for all 45 component routes, all foundations, all patterns, and public documentation.
- [x] Run the automated Chromium, Firefox, WebKit, mobile Chromium, and mobile WebKit matrix.
- [x] Run branded Safari and Chrome anchor-route keyboard and zoom checks.
- [ ] Run Edge, physical touch, manual high contrast, and full-catalog branded-browser matrices.
- [x] Define automated Chromium, Firefox, WebKit, mobile Chromium, and mobile WebKit projects.
- [x] Add automated screenshot regression coverage for representative light/dark, focus, error, and loading states.
- [x] Measure bundle, Shared Detail selection, and overlay-open performance in the composed pilot/build.

## Public alpha gates

- [x] Build a realistic product slice with dense controls, overlay, Table, Toast, Shared Detail, and Undo Stack.
- [x] Add axe anchor-route checks plus automated RTL, forced-colors, reduced-motion, and 200% layout-proxy checks.
- [x] Add issue/PR templates, maintainer ownership, migration policy, release-note categories, and a non-publishing release-candidate workflow.
- [x] Complete and record Safari VoiceOver Dialog and Menu anchor review.
- [x] Complete automated long-content expansion, 24 CSS pixel effective target, touch-emulation, virtual-keyboard proxy, forced-colors, and reduced-motion checks.
- [x] Separate Edge, physical-device, operating-system contrast, and human-language review into explicit external gates with an evidence template.
- [ ] Complete physical touch, Edge, broader manual high-contrast, and human-language review.
- [x] Configure the selected canonical GitHub owner/repository and replace every placeholder/localhost publication URL.

## Version decision

- [x] Record the complete public API in the compiler-generated report and require a changelog/migration entry for contract changes.
- [x] Record the exact verified React, TypeScript, Base UI, browser, and Node evidence without turning it into a broader support promise.
- [x] Keep the package `private` through package-consumer verification; remove it only as part of an intentional publication review.
- [x] Keep production adoption explicitly unclaimed until a real project has shipped and the claim can be verified.
- [x] Add a non-publishing package-candidate workflow that can create GitHub build provenance for the tarball.

## Local RC acceptance

- [x] Freeze 45 components, 210 public exports, and 145 semantic tokens in a machine-readable contract.
- [x] Store 312 release-level light/dark visual baselines across the public shell and component Product/State specimens.
- [x] Keep `private: true`, omit every publish command, and require an exact RC SemVer for artifact assembly.
- [x] Pass the fresh `npm ci` clean-room reproduction gate.
- [x] Assemble the checksummed `0.1.0-rc.1` tarball, SBOM, registry release, integrity reports, and QA records from one clean local commit.
- [x] Assemble the checksummed `0.1.0-rc.2` tarball, SBOM, registry release, integrity reports, and QA records from one clean local commit.
- [x] Assemble the renamed and checksummed `0.1.0-rc.3` Teum tarball, SBOM, registry release, integrity reports, and QA records from one clean commit after the full visual and browser matrix passes.
- [ ] Assemble `0.1.0-rc.4` from one clean commit after the pinned-registry CLI install and full release matrix pass.
