# Teum

A dense, monochrome component and interaction system for product interfaces. It combines a Linear-led information hierarchy with cool, translucent Codex-like materials, then makes its own identity through stable geometry, shared origin, and reversible completion.

## Status

| | Current state |
| --- | --- |
| Version | `0.1.0-rc.22` |
| Catalog | 45 documented components |
| Product layer | 15 primitives, 6 vertical recipes, and 3 B2B product patterns |
| Themes | Light-first; fully reviewed dark theme |
| Distribution | [Public source](https://github.com/minwookshin/teum) and HTTPS shadcn registry; npm unpublished |
| Package | MIT-licensed pre-release; APIs may change |
| License | [MIT](./LICENSE) |

The source and generated registry are public under MIT. The npm package remains private and unpublished, and there is no production-adoption claim.

## Integration modes

Teum has one visual contract and four deliberate integration surfaces:

- **React 18.2+ and React 19** — accessible behavior and composition.
- **TypeScript** — authored source, generated declarations, and strict consumer verification.
- **Plain CSS** — the framework-neutral source of truth for tokens, cascade layers, and component styles.
- **Tailwind CSS v4** — an optional semantic bridge over the same `--teum-*` variables; Tailwind is not required.

Current evaluation uses the source-owned shadcn registry. The future `teum` npm package is built and tested locally but remains unpublished.

## System

- **Foundations** — Color, Typography, Spacing, Motion, a shared Component DNA contract, and one Canvas/Stage/Float/Flyout/Modal/Toast elevation contract.
- **Components** — Interactive Product labs, locked State inspection, exact code, realistic recipes, meaningful state contracts, use/avoid guidance, accessibility contracts, compatibility, and typed APIs.
- **Choosing components** — Task, focus, and recovery boundaries for adjacent controls and surfaces that should not be merged by shape.
- **Patterns** — Working Playgrounds for Edit in place, Find and act, Preserve context, and Recover from action.
- **Teum Data** — Data Table, Filter Builder, Data Toolbar, Bulk Action Bar, Date Range Filter, and Data Export Menu, composed into Issues Workspace, Customer Directory, and Audit Log recipes.
- **Teum Analytics** — Sparkline, Metric, Chart, Comparison, Breakdown, Goal, Funnel, Cohort, and Timeline, composed into SaaS Overview, Product Usage, and Conversion & Retention recipes.
- **Product Patterns** — Customer Workspace, Billing & Usage, and Members & Permissions compose Core, Data, and Analytics into complete B2B tasks with shared state ownership and recovery contracts.

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
npm run test:a11y:evidence         # five-project accessibility matrix + release/accessibility.json
npm run test:stories:visual        # committed Product and State snapshots
npm run test:stories:visual:update # intentionally accept a reviewed visual change
npm run build:storybook            # static Storybook build
```

The visual suite captures the interactive Product composition and the complete inert State matrix separately, so offscreen state proofs cannot silently disappear from a full-page screenshot. macOS and Linux keep separate, equally strict baselines because font rasterization and native controls differ by platform. Snapshot updates are review actions, not automatic build artifacts; the Browser matrix workflow can generate a short-lived Linux baseline artifact for review.

### Public TypeScript API

The component source, documentation, registry, and emitted declarations share one checked public boundary:

```bash
npm run build:api # emit exact declarations, a review report, and documentation metadata
npm run check:api # fail when source and committed API artifacts diverge
```

The generated artifacts live in `api/generated`: exact `.d.ts` files, `public-api.json` for automation, and `public-api.md` for review. Component pages expose the same generated export surface beside a curated table of common props and defaults. Registry verification also compares every generated wrapper byte-for-byte with its source and rejects any component/API catalog mismatch.

The application uses the TypeScript 7 CLI for project type-checking. Its API extractor follows Microsoft’s recommended transition setup and uses the side-by-side `@typescript/typescript6` compatibility API because TypeScript 7.0 does not yet expose a stable programmatic compiler API.

### Tokens

`tokens/teum.tokens.json` is the source of truth for foundation and theme decisions. It follows the DTCG 2025.10 format, with light as the default value and a documented extension for dark-mode values.

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

## Quickstart

From a React + TypeScript project with `components.json`, connect the pinned release-candidate registry and add one source-owned component:

```bash
npx shadcn@4.18.0 registry add @teum-pinned=https://teum.minwookshin.com/r/v/0.1.0-rc.22/{name}.json
npx shadcn@4.18.0 add @teum-pinned/button
```

```tsx
import { Button } from "./components/ui/button";

export function App() {
  return <Button variant="primary">Create issue</Button>;
}
```

Use [`examples/quickstart-vite`](./examples/quickstart-vite) for Vite or [`examples/quickstart-next`](./examples/quickstart-next) for Next.js App Router. The repository installs and production-builds both starters; Vite is checked on React 18 and React 19, and Next keeps its layout and page server-rendered with one explicit client component for interaction.

Theme and product customization stay in semantic CSS:

```ts
document.documentElement.dataset.theme = "dark";
```

```css
:root { --teum-radius-control: 9px; }
```

Before updating copied source, inspect without writing:

```bash
npx shadcn@4.18.0 add @teum-pinned/button --dry-run
npx shadcn@4.18.0 add @teum-pinned/button --diff src/components/ui/button.tsx
```

See [Adoption](./ADOPTION.md) and [Registry updates](./REGISTRY_UPDATES.md) for the complete reviewed path.

Install the complete Teum Data slice:

```bash
npx shadcn@4.18.0 add @teum-pinned/teum-data
```

```tsx
import { IssuesWorkspace } from "./components/patterns/issues-workspace";

export function App() {
  return <IssuesWorkspace />;
}
```

The same registry block also installs `CustomerDirectoryRecipe` and `AuditLogRecipe`. Together the three recipes verify controlled and server-oriented state, compact URL serialization, persistent personal views, filtering, sorting, pagination, column sizing and pinning, 10,000-row virtualization, date ranges, selection, mutation recovery, and CSV/JSON export. The 45-component Core catalog remains unchanged.

Install the complete Teum Analytics slice:

```bash
npx shadcn@4.18.0 add @teum-pinned/teum-analytics
```

```tsx
import { SaaSOverviewRecipe } from "./components/patterns/analytics-recipes";

export function App() {
  return <SaaSOverviewRecipe />;
}
```

The same block installs `ProductUsageRecipe` and `ConversionRetentionRecipe`, nine analytics primitives, their semantic styles, and agent-readable composition contracts. Charts use native SVG and semantic table fallbacks; no chart runtime is added.

Install the complete Product Patterns slice:

```bash
npx shadcn@4.18.0 add @teum-pinned/teum-product-patterns
```

```tsx
import { CustomerWorkspaceRecipe } from "./components/patterns/product-pattern-recipes";

export function App() {
  return <CustomerWorkspaceRecipe />;
}
```

The same block installs `BillingUsageRecipe` and `MembersPermissionsRecipe`, their scoped styles, representative Core/Data/Analytics dependencies, and the machine-readable composition contract. These are reference implementations with local verification, not external production-adoption evidence.

## Agent integration

Install the machine-readable contract and all nine product recipes through the source registry:

```bash
npx shadcn@4.18.0 add @teum-pinned/teum-agent
```

The same contract is available at [`/agent/teum-agent.json`](https://teum.minwookshin.com/agent/teum-agent.json). It defines documented component-selection boundaries, nine complete product recipes, fourteen forbidden rules, and the public quality gates. The installable `teum` skill uses that contract instead of inventing component names or props.

```bash
npx skills add minwookshin/teum --skill teum --copy --yes
```

`npm run test:agent` evaluates thirty fixed B2B product requests, installs the registry contract into one clean React + TypeScript + Vite consumer, and collectively type-checks and production-builds all thirty generated task modules. This is deterministic repository evidence, not an external model benchmark or production-adoption claim.

Button imports the shared plain-CSS contract and its scoped stylesheet itself. The latest fresh Vite consumer verified the namespace command, install, TypeScript check, and production build; see [`release/quickstart.json`](./release/quickstart.json). Exact elapsed time is observational because network and package-manager caches vary.

## Teum Registry

Build the shadcn-compatible artifacts:

```bash
npm run build:registry
npm run test:registry
npm run diff:registry -- --from ./previous-manifest.json
```

Generated files live in `public/r`. Use the mutable namespace during active pre-release evaluation, or pin the exact release path for reproducible review:

```bash
npx shadcn@4.18.0 registry add @teum=https://teum.minwookshin.com/r/{name}.json
npx shadcn@4.18.0 add @teum/button

npx shadcn@4.18.0 registry add @teum-pinned=https://teum.minwookshin.com/r/v/0.1.0-rc.22/{name}.json
npx shadcn@4.18.0 add @teum-pinned/button
```

Teum owns the registry namespace, component source, tokens, APIs, and release contract. The shadcn CLI is the compatible transport that resolves and copies those files; it is not the design-system identity. A dedicated Teum CLI would be a separate future product boundary, not a relabeled command.

Existing shadcn projects can use those commands directly. A plain CSS project needs only a minimal `components.json` so the transport knows where copied files belong; the schema's `tailwind` object does not install or require Tailwind:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": { "config": "", "css": "src/index.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "components",
    "utils": "lib/utils",
    "ui": "components/ui",
    "lib": "lib",
    "hooks": "hooks"
  }
}
```

Each installed component imports the shared token/reset contract and its own scoped stylesheet. The complete-system item also includes a stable application-root entry for the shared contract:

```ts
import "./styles/teum.css";
```

`@teum/teum` contains the complete system; each component item contains its source, scoped CSS, and namespaced local dependencies. The public cascade is `teum.tokens → teum.base → teum.components`; ordinary unlayered product CSS can override it without a specificity contest. The registry test rejects documentation-style leakage and the clean-consumer test proves a Button-only install does not carry Dialog, Table, or Shared Detail CSS. Bare dependency names intentionally are not used because the shadcn CLI resolves those against its built-in registry.

Tailwind CSS v4 consumers can add the optional bridge without changing component source:

```bash
npx shadcn@4.18.0 add @teum/teum-tailwind
```

```css
@import "tailwindcss";
@import "./styles/teum-base.css";
@import "./styles/teum-tailwind.css";
```

The bridge exposes semantic utilities such as `bg-background`, `text-foreground`, `rounded-control`, and `shadow-flyout`; each resolves to the same Teum variables used by plain CSS.

`public/r/manifest.json` is the deterministic update boundary. It hashes each JSON artifact, each copied file, every public TypeScript export, and every semantic token contract. The mutable pre-release channel remains reviewable; `public/r/v/<version>` is content-locked, rewrites internal dependencies into the same-version `@teum-pinned` scope, pins external packages and the installer, rejects changed contents under an existing version, and is deployed with an immutable cache policy. An append-only history ledger checks every prior version, while release-anchored directories must also match their source commit byte-for-byte. `npm run test:registry` performs a real shadcn CLI install with only that pinned registry configured. `npm run test:consumer:upgrade` proves that a local source edit is preserved while an upstream candidate is staged for explicit acceptance. See [Registry updates](./REGISTRY_UPDATES.md).

The repository can also be installed directly through shadcn without operating a separate registry server:

```bash
npx shadcn@4.18.0 add minwookshin/teum/teum#v0.1.0-rc.22
```

Canonical metadata points to [minwookshin/teum](https://github.com/minwookshin/teum). The npm package remains private and unpublished.

The public beta program and its evidence boundary are documented in [BETA.md](./BETA.md). The repository does not convert internal fixtures into adoption claims; v1 remains blocked until an independent project installs and builds the candidate and two feedback rounds are recorded.

### Private package candidate

The repository also prepares the future package boundary without publishing it:

```bash
npm run build:package
npm run check:package
npm run test:package
```

The tarball exposes one React client-boundary entry point, typed tokens, the reviewed stylesheet, and registry JSON subpaths. React stays a peer dependency. A fresh ESM consumer type-checks and production-builds the package, renders a representative component tree with Node SSR, then hydrates it with zero recoverable mismatch errors; the machine-readable result lives in [`release/package-contract.json`](./release/package-contract.json). The source registry also installs and builds in a clean Next.js App Router consumer; that proof does not yet cover the unpublished package entry point or Remix. The package-candidate workflow can generate GitHub build provenance for the tarball, but it has no npm credential and no publish step.

## Project evidence

- [Teum Data milestone](./release/teum-data-milestone.md)
- [Teum Analytics milestone](./release/teum-analytics-milestone.md)
- [Generated release evidence](./release/evidence.md)
- [Adoption guide](./ADOPTION.md)
- [Adoption DX milestone](./release/teum-adoption-dx-milestone.md)
- [Current release-candidate notes](./release/0.1.0-rc.22.md)
- [Generated public API report](./api/generated/public-api.md)
- [Package SSR and hydration contract](./release/package-contract.json)
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
