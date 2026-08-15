# Open-source readiness

Date: 2026-08-14

## Decision

Continue, but stop optimizing for component count. The current 35-component catalog is already broad enough for an alpha. The next quality gain comes from proving installation, composition, accessibility, compatibility, and maintenance in a real consumer—not from adding another row to the index.

## Current maturity

| Dimension | Evidence today | Readiness |
| --- | --- | --- |
| System identity | Stable geometry, shared origin, reversible completion, four authored interactions | Strong |
| Component breadth | 35 documented components across controls, overlays, navigation, feedback, data, and interaction | Enough for alpha |
| Documentation | Preview, code, recipes, states, usage, accessibility, API, public project guidance | Strong alpha candidate |
| Distribution | Public GitHub source, GitHub Pages workflow, granular shadcn artifacts, and clean-consumer builds | Public path configured; npm remains private and unpublished |
| Automated behavior | 108 Vitest checks plus five-engine/device Playwright matrix and a nested modal/flyout stack assertion | Strong baseline |
| Accessibility | Keyboard contracts, axe anchor routes, RTL, forced colors, reduced motion, zoom proxy, Chrome/Safari zoom, and Safari VoiceOver anchors | Edge, physical touch, manual high contrast, content expansion, and full-catalog manual coverage remain |
| Visual stability | Eight cross-platform screenshot baselines across entry, component, focus, loading, error, pilot, light, and dark states | CI-ready baseline complete |
| Adoption | Internal Product pilot composes the public API; no shipped external consumer | Composition proven, adoption unproven |
| Governance | MIT, templates, ownership, conduct, security, support, migration and release policies, release-candidate workflow | Local foundation complete; canonical public channels still missing |

## Public stages

### Public preview

The repository and documentation may be shown as an unfinished system if the status remains explicit. Do not describe it as production-ready or broadly supported.

### Public alpha

Required before asking strangers to install it:

1. **Complete** — canonical GitHub repository, issue tracker, Pages homepage/HTTPS registry workflow, and private vulnerability-reporting path are configured for `minwookshin/interaction-index`.
2. **Complete** — generated complete-system and individual registry artifacts plus Button-only and complete-system clean-consumer TypeScript/production builds.
3. **Complete** — CI-ready visual regression for entry, component product, focus, loading, error, Product pilot, light, dark, and reduced-motion configurations.
4. **Partial** — automated axe, zoom proxy, forced colors, reduced motion, and RTL pass; Chrome/Safari zoom and Safari VoiceOver Dialog/Menu anchors are recorded. Edge, physical touch, manual high contrast, content expansion, and full-catalog manual coverage remain.
5. **Complete as internal proof** — a real issue-management slice composes search, create, fields, dialog, table, toast, Shared Detail, archive, and Undo Stack. It does not count as external adoption.
6. **Complete as local alpha evidence** — gzip budgets plus recorded Shared Detail selection and dialog-open measurements. Production field data remains a beta concern.
7. **Complete locally** — issue/PR templates, maintainer ownership, generated release categories, release-candidate verification, release process, and migration policy.

### Beta

Require repeated real use, external API feedback, resolved composition problems, and a measured stability period. Component count is not a beta criterion.

### 1.0

Require a stable public API window, support-range evidence, migration tooling or codemods for breaking changes, documented maintenance policy, and verified adopter feedback.

## Highest-leverage next milestone

The public path, internal product slice, decision guide, and granular CSS boundary are now built. The highest-leverage next milestone is one independent consumer pilot followed by the remaining recorded manual accessibility matrix. The pilot already forced one real API correction: Shared Detail now accepts composed detail content while retaining its selection and motion contract.

## Adopter gap ranking

1. **Independent evidence** — the Product pilot and generated clean fixtures prove composition internally, not adoption or upgrade safety in another maintainer-owned repository.
2. **Manual evidence** — Chrome/Safari zoom and Safari VoiceOver anchors are verified, but Edge, full-catalog branded coverage, physical touch, manual high contrast, and translated-content expansion remain named release gates.
3. **Reference drift** — API prose should ultimately be generated or parity-checked against exported TypeScript.
4. **Upgrade safety** — copied-source customization needs a realistic modified-consumer fixture before beta.

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
