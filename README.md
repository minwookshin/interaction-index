# Interaction Index

A dense, monochrome component and interaction system for product interfaces. It combines a Linear-led information hierarchy with cool, translucent Codex-like materials, then makes its own identity through stable geometry, shared origin, and reversible completion.

## Status

| | Current state |
| --- | --- |
| Version | `0.1.0-alpha.0` |
| Catalog | 35 documented components |
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
| Controls | Button, Icon Button, Text Field, Number Field, Textarea, Checkbox, Radio Group, Switch, Select, Context Switcher, Combobox, Search Input, Segmented Control |
| Overlays | Tooltip, Popover, Menu, Dialog, Alert Dialog |
| Navigation | Tabs, Breadcrumbs, Pagination, Collapsible |
| Feedback | Toast, Alert, Progress, Spinner, Skeleton, Empty State |
| Data display | Badge, Avatar, Table |
| Authored interaction | Inline Edit, Action List, Shared Detail, Undo Stack |

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

The cross-browser suite is configured separately because it downloads browser binaries:

```bash
npx playwright install chromium firefox webkit
npm run test:browsers
```

## Registry

Build the shadcn-compatible artifacts:

```bash
npm run build:registry
npm run test:registry
```

Generated files live in `public/r`. Configure the hosted namespace once in a consumer:

```bash
npx shadcn@latest registry add @index=https://minwookshin.github.io/interaction-index/r/{name}.json
npx shadcn@latest add @index/button
```

Each installed component imports the shared token/reset contract and its own scoped stylesheet. The complete-system item also includes a stable application-root entry for the shared contract:

```ts
import "./styles/interaction-index.css";
```

`@index/interaction-index` contains the complete system; each component item contains its source, scoped CSS, and namespaced local dependencies. The public cascade is `index.tokens → index.base → index.components`; ordinary unlayered product CSS can override it without a specificity contest. The registry test rejects documentation-style leakage and the clean-consumer test proves a Button-only install does not carry Dialog, Table, or Shared Detail CSS. Bare dependency names intentionally are not used because the shadcn CLI resolves those against its built-in registry.

The repository can also be installed directly through shadcn without operating a separate registry server:

```bash
npx shadcn@latest add minwookshin/interaction-index/interaction-index
```

Canonical metadata points to [minwookshin/interaction-index](https://github.com/minwookshin/interaction-index). The npm package remains private and unpublished.

## Project evidence

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
- [Accessibility evidence](./ACCESSIBILITY_EVIDENCE.md)
- [Interaction and bundle performance](./INTERACTION_PERFORMANCE.md)

The remaining public-alpha evidence gaps are intentionally explicit: Edge, physical touch, manual high contrast, translated-content expansion, and catalog-wide branded-browser coverage. Chrome, Safari, and VoiceOver anchor evidence is recorded; external production adoption remains a beta/1.0 gap, not a claim.
