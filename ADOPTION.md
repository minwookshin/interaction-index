# Adopt Teum

Teum is an MIT-licensed pre-release. Use the source registry for evaluation; the npm package is not published.

## Ten-minute path

1. Open a React + TypeScript branch.
2. Add the exact pinned registry to `components.json`.
3. Inspect and install Button.
4. Render one real product action.
5. Override one `--teum-*` role and check light and dark.
6. Run the product build.

```bash
npx shadcn@4.18.0 registry add @teum-pinned=https://teum.minwookshin.com/r/v/0.1.0-rc.22/{name}.json
npx shadcn@4.18.0 view @teum-pinned/button
npx shadcn@4.18.0 add @teum-pinned/button
npm run build
```

Exact starters live in [`examples/quickstart-vite`](./examples/quickstart-vite) and [`examples/quickstart-next`](./examples/quickstart-next). Repository tests install, customize, type-check, and production-build both paths. That is automated evidence, not an independent first-time-user timing study.

## Choose the smallest useful surface

| Need | Start with | Add when needed |
| --- | --- | --- |
| One action | Button, Icon Button | Button Group or Toolbar for a related set |
| One form value | Field, Text Field, Select | Combobox for filtering; Context Switcher for product context |
| Temporary actions | Menu | Action List for a larger searchable set |
| Focused task | Dialog | Alert Dialog for a consequential response |
| Inspect in place | Shared Detail | Action List for discovery; Undo Stack for recovery |

## Customize

Copied source belongs to the product. Prefer semantic overrides before editing component CSS.

```css
:root {
  --teum-radius-control: 9px;
}
```

Set `data-theme="dark"` on the document root for dark mode. Keep product overrides unlayered so they follow Teum's `tokens → base → components` contract without specificity escalation.

## Update

Commit local edits, point `@teum-pinned` at the next exact candidate, then review before writing:

```bash
npx shadcn@4.18.0 add @teum-pinned/button --dry-run
npx shadcn@4.18.0 add @teum-pinned/button --diff src/components/ui/button.tsx
npx shadcn@4.18.0 add @teum-pinned/button --overwrite --yes
```

Read `CHANGELOG.md` and `MIGRATIONS.md`, run product checks, and keep the previous commit and pinned URL as rollback boundaries.

## Evidence and feedback

Keep the install command, elapsed time, changed files, token overrides, keyboard path, and update diff in the adopting repository. Teum sends no usage telemetry.

Use the [Adopter feedback form](https://github.com/minwookshin/teum/issues/new?template=adopter-feedback.yml) for non-sensitive findings, **Bug report** for reproducible defects, and `SECURITY.md` for private vulnerability reporting. External adoption counts only with dated, permissioned evidence from an independently maintained consumer whose typecheck and production build pass.

For public v1 credit, add a consumer repository, commit, or CI URL to the form. A maintainer reviews and closes accepted reports; an open issue or an unchecked self-report never increments the gate.
