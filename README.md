# Interaction Index

A dense, monochrome component and interaction system for product interfaces. It combines a Linear-led information hierarchy with cool, translucent Codex-like materials, then makes its own identity through stable geometry, shared origin, and reversible completion.

## Status

| | Current state |
| --- | --- |
| Version | `0.1.0-rc.2` |
| Catalog | 45 documented components |
| Themes | Light-first; fully reviewed dark theme |
| Distribution | [Public source](https://github.com/minwookshin/interaction-index) and HTTPS shadcn registry; npm unpublished |
| Package | MIT-licensed alpha; APIs may change |
| License | [MIT](./LICENSE) |

The source and generated registry are public under MIT. The npm package remains private and unpublished, and there is no production-adoption claim.

## System

- **Foundations** — Color, Typography, Spacing, Motion, a shared Component DNA contract, and one Canvas/Stage/Float/Flyout/Modal/Toast elevation contract.
- **Components** — Interactive Product labs, locked State inspection, exact code, realistic recipes, meaningful state contracts, use/avoid guidance, accessibility contracts, compatibility, and typed APIs.
- **Choosing components** — Task, focus, and recovery boundaries for adjacent controls and surfaces that should not be merged by shape.
- **Patterns** — Working Playgrounds for Edit in place, Find and act, Preserve context, and Recover from action.
- **Product pilot** — A compact issue-management workspace that composes search, fields, dialog, table, toast, Shared Detail, and Undo Stack into one working task flow.

### Components

| Group | Components |
| --- | --- |
| Controls | Button, Icon Button, Field & Fieldset, Input Group, Kbd, Button Group, Toolbar, Text Field, Number Field, Calendar & Date Picker, Textarea, Checkbox, Radio Group, Switch, Select, Context Switcher, Combobox, Search Input, Segmented Control |
| Overlays | Tooltip, Popover, Menu, Context Menu, Dialog, Sheet, Alert Dialog |
| Navigation | Tabs, Breadcrumbs, Pagination, Collapsible |
| Feedback | Toast, Alert, Progress, Spinner, Skeleton, Empty State |
| Data display | Badge, Avatar, Table, Tree |
| Authored interaction | Reorderable List, Inline Edit, Action List, Shared Detail, Undo Stack |

The authored interaction layer documents input, origin, enter, active, exit, interruption, keyboard, and reduced-motion behavior in code. Table stays a semantic primitive; sorting, filtering, selection, empty results, and pagination are documented as a product recipe rather than hidden inside a monolith.

## Documentation model

Every component route follows one reading order:

1. **Overview** — role and product intent.
2. **Preview** — a centered, resettable Product lab plus an inert State inspection lab.
3. **Show code** — the specimen’s implementation, collapsed by default.
4. **Examples** — variants, sizes, content pressure, and product recipes.
5. **State contract** — only genuinely distinct states.
6. **Usage** — explicit use and avoid decisions.
7. **Accessibility** — keyboard behavior and review criteria.
8. **API** — supported props, types, defaults, purpose, and confidence limits.

Pattern Playgrounds add a real composition, short task sequence, Replay, keyboard behavior, and the authored behavior contract.

Preview geometry follows three deliberate specimen types instead of one universal empty canvas:

- **Compact** — isolated, small controls that need optical inspection.
- **Context** — components shown inside a plausible product decision.
- **Flow** — authored interactions whose spatial continuity and recovery behavior need room to unfold.

## Development

```bash
npm install
npm run dev
npm run quality
```

`npm run quality` runs the complete automated suite, builds and verifies the registry, type-checks and builds the application, and verifies the worker output.

### Executable component contracts

Storybook is the isolated review and regression surface for all 45 public components. Every story renders the same Product preview and state source used by the documentation, then verifies its state count, keyboard-relevant behavior, accessibility tree, and light/dark theme contract.

```bash
npm run storybook                  # isolated local review surface
npm run test:stories               # 45 light + 45 dark interaction and axe checks
npm run test:stories:visual        # committed Product and State snapshots
npm run test:stories:visual:update # intentionally accept a reviewed visual change
npm run build:storybook            # static Storybook build
```

The visual suite captures the interactive Product composition and the complete inert State matrix separately, so offscreen state proofs cannot silently disappear from a full-page screenshot. Snapshot updates are review actions, not automatic build artifacts.

### Public TypeScript API

The component source, documentation, registry, and emitted declarations share one checked public boundary:

```bash
npm run build:api # emit exact declarations, a review report, and documentation metadata
npm run check:api # fail when source and committed API artifacts diverge
```

The generated artifacts live in `api/generated`: exact `.d.ts` files, `public-api.json` for automation, and `public-api.md` for review. Component pages expose the same generated export surface beside a curated table of common props and defaults. Registry verification also compares every generated wrapper byte-for-byte with its source and rejects any component/API catalog mismatch.

The application uses the TypeScript 7 CLI for project type-checking. Its API extractor follows Microsoft’s recommended transition setup and uses the side-by-side `@typescript/typescript6` compatibility API because TypeScript 7.0 does not yet expose a stable programmatic compiler API.

### Tokens

`tokens/interaction-index.tokens.json` is the source of truth for foundation and theme decisions. It follows the DTCG 2025.10 format, with light as the default value and a documented extension for dark-mode values.

```bash
npm run build:tokens   # generate CSS, typed TypeScript, and the Figma handoff manifest
npm run check:tokens   # fail when committed generated files are stale
npm run diff:tokens    # classify added, changed, and removed token paths against HEAD
npm run build:figma    # generate the 45-component Figma library execution contract
npm run check:figma    # reject token, component, state, page, or remote-ID drift
```

Generated files are committed so the documentation, registry, consumer CSS, TypeScript API, and Figma handoff can be reviewed in the same change. `tokens/generated/figma-variables.json` defines scoped Foundation and Theme variables plus text and effect styles, while `figma/generated/library-manifest.json` maps all 45 components to their Figma build contract. These files are deterministic handoff artifacts only; they do not claim that a Figma library has been created, published, or connected to code.

The cross-browser suite is configured separately because it downloads browser binaries:

```bash
npx playwright install chromium firefox webkit
npm run test:browsers
```

## Index Registry

Build the shadcn-compatible artifacts:

```bash
npm run build:registry
npm run test:registry
npm run diff:registry -- --from ./previous-manifest.json
```

Generated files live in `public/r`. Use the mutable namespace during active alpha evaluation, or pin the exact release path for reproducible review:

```bash
npx shadcn@latest registry add @index=https://minwookshin.github.io/interaction-index/r/{name}.json
npx shadcn@latest add @index/button

npx shadcn@latest registry add @index-pinned=https://minwookshin.github.io/interaction-index/r/v/0.1.0-rc.2/{name}.json
npx shadcn@latest add @index-pinned/button
```

Interaction Index owns the registry namespace, component source, tokens, APIs, and release contract. The shadcn CLI is the compatible transport that resolves and copies those files; it is not the design-system identity. A dedicated Index CLI would be a separate future product boundary, not a relabeled command.

Each installed component imports the shared token/reset contract and its own scoped stylesheet. The complete-system item also includes a stable application-root entry for the shared contract:

```ts
import "./styles/interaction-index.css";
```

`@index/interaction-index` contains the complete system; each component item contains its source, scoped CSS, and namespaced local dependencies. The public cascade is `index.tokens → index.base → index.components`; ordinary unlayered product CSS can override it without a specificity contest. The registry test rejects documentation-style leakage and the clean-consumer test proves a Button-only install does not carry Dialog, Table, or Shared Detail CSS. Bare dependency names intentionally are not used because the shadcn CLI resolves those against its built-in registry.

`public/r/manifest.json` is the deterministic update boundary. It hashes each JSON artifact, each copied file, every public TypeScript export, and every semantic token contract. The mutable alpha channel remains reviewable; `public/r/v/<version>` is byte-for-byte pinned, rejects changed contents under an existing version, and is deployed with an immutable cache policy. `npm run test:consumer:upgrade` proves that a local source edit is preserved while an upstream candidate is staged for explicit acceptance. See [Registry updates](./REGISTRY_UPDATES.md).

The repository can also be installed directly through shadcn without operating a separate registry server:

```bash
npx shadcn@latest add minwookshin/interaction-index/interaction-index
```

Canonical metadata points to [minwookshin/interaction-index](https://github.com/minwookshin/interaction-index). The npm package remains private and unpublished.

### Private package candidate

The repository also prepares the future package boundary without publishing it:

```bash
npm run build:package
npm run check:package
npm run test:package
```

The tarball exposes one React entry point, typed tokens, the reviewed stylesheet, and registry JSON subpaths. React stays a peer dependency. The package-candidate workflow can generate GitHub build provenance for the tarball, but it has no npm credential and no publish step.

## Project evidence

- [Generated public API report](./api/generated/public-api.md)
- [Compatibility](./COMPATIBILITY.md)
- [Browser and support policy](./SUPPORT.md)
- [Security policy](./SECURITY.md)
- [Contributing quality bar](./CONTRIBUTING.md)
- [Code of conduct](./CODE_OF_CONDUCT.md)
- [MIT license](./LICENSE)
- [Third-party notices](./THIRD_PARTY_NOTICES.md)
- [Changelog](./CHANGELOG.md)
- [Release checklist](./RELEASE_CHECKLIST.md)
- [Release process](./RELEASE_PROCESS.md)
- [Migration policy](./MIGRATIONS.md)
- [Maintainers](./MAINTAINERS.md)
- [Publication configuration](./PUBLICATION.md)
- [Registry update policy](./REGISTRY_UPDATES.md)
- [Accessibility evidence](./ACCESSIBILITY_EVIDENCE.md)
- [Interaction and bundle performance](./INTERACTION_PERFORMANCE.md)

The remaining public-alpha evidence gaps are intentionally explicit: Edge, physical touch, manual high contrast, translated-content expansion, and catalog-wide branded-browser coverage. Chrome, Safari, and VoiceOver anchor evidence is recorded; external production adoption remains a beta/1.0 gap, not a claim.
