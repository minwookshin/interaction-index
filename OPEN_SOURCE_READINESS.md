# Open-source readiness

Date: 2026-08-18

## Decision

Continue, but stop optimizing for component count. The current 45-component catalog and 17 product primitives are broad enough for a public beta. The next quality gain comes from independent installation, repeated API feedback, manual support evidence, and a measured stability window—not another row in the index.

The machine-readable source for current counts is [`release/evidence.json`](./release/evidence.json), with a readable summary in [`release/evidence.md`](./release/evidence.md).

## Current maturity

| Dimension | Evidence today | Readiness |
| --- | --- | --- |
| System identity | Stable geometry, shared origin, reversible completion, four authored interactions | Strong |
| Component breadth | 45 documented components across controls, overlays, navigation, feedback, data, and interaction | Enough for alpha |
| Documentation | Preview, code, recipes, states, usage, accessibility, API, public project guidance | Strong alpha candidate |
| Distribution | Public GitHub source, granular shadcn artifacts, an adopter-side quickstart, and a private package candidate with client-boundary, Node SSR, and clean hydration evidence | Public path configured; npm remains private and unpublished |
| Automated behavior | 237 Vitest checks plus a five-project desktop and mobile Playwright matrix and a nested modal/flyout stack assertion | Strong baseline |
| Accessibility | Versioned five-project evidence for 69 routes, skip paths, route announcements, focus handoff, axe, RTL, forced colors, reduced motion, reflow, and content expansion; Chrome/Safari and VoiceOver anchors | Edge, physical touch, manual OS contrast/transparency modes, human translation/RTL, independent review, and full-catalog manual coverage remain |
| Visual stability | 332 release-level visual baselines per platform across all public routes, every Core Product/State contract, four Analytics surfaces, and three Product Patterns | macOS and Linux complete |
| Adoption | Internal Product pilot composes the public API; no shipped external consumer | Composition proven, adoption unproven |
| Governance | MIT, templates, ownership, conduct, security, support, migration and release policies, release-candidate workflow | Public repository, Issues, and private vulnerability reporting configured |

## Public stages

### Public preview

The repository and documentation may be shown as an unfinished system if the status remains explicit. Do not describe it as production-ready or broadly supported.

### Public alpha

Required before asking strangers to install it:

1. **Complete** — canonical GitHub repository, issue tracker, Pages homepage/HTTPS registry workflow, and private vulnerability-reporting path are configured for `minwookshin/teum`.
2. **Complete** — generated complete-system and individual registry artifacts plus Button-only and complete-system clean-consumer TypeScript/production builds.
   The documented pinned-registry quickstart is executed against a fresh React + TypeScript + Vite fixture and preserved in `release/quickstart.json`; elapsed time is reported as local observation rather than a universal promise.
   The private package candidate also preserves its React client boundary, server-renders a representative tree, and hydrates with zero recoverable mismatches in the recorded ESM consumer. This is package-contract evidence, not proof of every framework runtime.
3. **Complete** — CI-ready visual regression for entry, component product, focus, loading, error, Product pilot, light, dark, and reduced-motion configurations.
4. **Partial** — the versioned accessibility matrix recorded 55 applicable checks passed and 30 intentional project-ownership skips with zero failures or flakes; Chrome/Safari zoom and Safari VoiceOver Dialog/Menu anchors are also recorded. Edge, physical touch, manual OS contrast/transparency modes, human translation/RTL, independent review, and full-catalog manual coverage remain.
5. **Complete as internal proof** — a real issue-management slice composes search, create, fields, dialog, table, toast, Shared Detail, archive, and Undo Stack. It does not count as external adoption.
6. **Complete as local alpha evidence** — route-aware gzip budgets plus a versioned local production-preview record for FCP, LCP, CLS, transition latency, Shared Detail selection, Dialog open, and long tasks. Production p75 Core Web Vitals, real-device/network latency, and RUM remain external gates.
7. **Complete locally** — issue/PR templates, maintainer ownership, generated release categories, release-candidate verification, release process, and migration policy.

### Public beta

The verified `0.1.0-rc.29` local candidate may be offered for real evaluation only after an approved GitHub prerelease, live site, and immutable registry all point to the same reviewed commit. npm is a separate channel and must remain described as unpublished until its public beta is verifiably available.

Promotion beyond the initial beta requires repeated real use, external API feedback, resolved composition problems, and a measured stability period. Component count is not a beta criterion. The machine-readable gate is [`release/beta-readiness.json`](./release/beta-readiness.json).

### 1.0

Require a stable public API window, support-range evidence, migration tooling or codemods for breaking changes, documented maintenance policy, and verified adopter feedback.

## Highest-leverage next milestone

The public path, internal product slice, decision guide, and granular CSS boundary are now built. The highest-leverage next milestone is one independent consumer pilot followed by the remaining recorded manual accessibility matrix. The pilot already forced one real API correction: Shared Detail now accepts composed detail content while retaining its selection and motion contract.

## Adopter gap ranking

1. **Independent evidence** — the Product pilot and generated clean fixtures prove composition internally, not adoption or upgrade safety in another maintainer-owned repository.
2. **Manual evidence** — Chrome/Safari zoom and Safari VoiceOver anchors are verified, but Edge, full-catalog branded coverage, physical touch, manual high contrast, and translated-content expansion remain named release gates.
3. **Framework integration** — the package-level client boundary, Node SSR, and hydration contract pass, while full Next.js/Remix integration remains unverified.
4. **External upgrade evidence** — the local modified-consumer fixture preserves an adopter edit and stages upstream change for explicit acceptance; an independently maintained consumer has not yet exercised that path.

The public repository keeps the resulting contracts and executable checks; raw local audit captures are intentionally excluded from the source distribution.

## Estimated effort

These are focused design-engineering days, not calendar guarantees.

| Milestone | Additional effort from current state |
| --- | --- |
| Credible public alpha | Public preview is configured; remaining time is governed by manual assistive-technology and device evidence |
| Strong beta | 2–4 additional weeks, including real usage and feedback |
| Defensible 1.0 | Usually 1–3 months or longer; governed by stability and adoption rather than implementation volume |

Remaining alpha allocation: 1–2 focused days for Edge and broader branded-browser coverage, manual high contrast, content expansion, and physical-touch evidence, plus any defects those passes expose.

## Research basis

- [shadcn Registry](https://ui.shadcn.com/docs/registry/getting-started): public HTTP distribution, item metadata, namespaced dependencies, and installation contracts.
- [Base UI accessibility](https://base-ui.com/react/overview/accessibility) and [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction): accessible, composable primitives with continued focus, keyboard, browser, and assistive-technology maintenance.
- [Primer component contribution](https://primer.style/product/contribute/adding-new-components/): components mature through product use, documented use cases, accessibility review, testing, feedback, and stability—not through catalog completeness alone.
- [Storybook accessibility testing](https://storybook.js.org/docs/9/writing-tests/accessibility-testing): component states become browser-testable cases; automated accessibility catches only part of the risk and must be paired with manual review.
