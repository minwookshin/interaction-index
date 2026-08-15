# Release checklist

The current build is an MIT-licensed, unpublished alpha. Complete every open item below before calling the package public or stable.

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
- [x] Verify generated source imports and the documented system stylesheet in a consumer TypeScript and production build.
- [ ] Capture and review a 1280 x 720 light/dark baseline for all 35 component routes, all foundations, and all patterns.
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
- [ ] Complete content expansion, physical touch, Edge, and broader manual high-contrast review.
- [x] Configure the selected canonical GitHub owner/repository and replace every placeholder/localhost publication URL.

## Version decision

- [ ] Record every public API in the changelog.
- [ ] Choose the supported React, TypeScript, Base UI, browser, and Node ranges from real test evidence.
- [ ] Keep the package `private` through canary installation; remove it only as part of an intentional publication review.
- [ ] Do not claim production adoption until a real project has shipped and the claim can be verified.
