# Teum open-source quality audit

Date: 2026-08-16

## Scope

Current public landing, installation flow, component reference, light and dark themes, top-bar tooltips, public registry entry path, and GitHub trust surface.

## Evidence

- `01-landing-light-desktop.png` — public landing at 1280x720
- `02-installation-light.png` — first-use documentation
- `03-button-light.png` — component decision/reference page
- `04-github-tooltip-light.png` — GitHub action tooltip
- `05-button-dark.png` — component reference in dark mode
- `06-theme-tooltip-dark.png` — theme action tooltip

## Flow health

1. **Landing entry — Strong.** The first viewport communicates the product, stack, and documentation action with a quiet and coherent visual hierarchy.
2. **Installation and first success — Needs work.** The current namespaced hero command assumes registry configuration. In a clean directory, `npx shadcn@latest view @teum/button` fails with an unknown-registry error. The GitHub registry forms `minwookshin/teum/button` and `minwookshin/teum/teum` both resolve successfully.
3. **Component selection and reference — Good.** The live specimen, state coverage, accessibility, and API sequence is credible. The next gain is clearer decision guidance and more editorial separation, not more specimen padding.
4. **Theme and tooltip behavior — Visually strong; semantics need verification.** Keep the current compact tooltips. Explicitly verify focus disclosure, `aria-describedby`, tooltip role, Escape behavior, and reduced motion; a visual capture alone cannot prove assistive-technology behavior.

## Objective verdict

- Visual system quality: approximately 8/10.
- Open-source adoption readiness: approximately 6/10.
- The main gap is not another component. It is a trustworthy path from landing page to successful install to a visible working example.

## Recommended order

### P0 — first-use trust

1. Replace or qualify the hero install command. Either use the verified GitHub registry one-liner or show registry configuration before the `@teum/button` command.
2. Synchronize the deployed rc, GitHub README, repository homepage, version, domain, and release notes before promotion.
3. Add a clean-room smoke test that installs from the exact public command rendered on the landing page and imports one component in React 18 and React 19 fixtures.
4. Put a minimal rendered success example immediately after installation; move integrity, update, and pinned-reference details into advanced documentation.

### P1 — adopter decisions

5. Surface short choice guides for adjacent components: Select / Combobox / Context Switcher, Menu / Action List, Dialog / Alert Dialog, and Toast / Undo Stack.
6. Add anatomy, content rules, do/don't guidance, and real composition examples to the adoption anchors: Button, Field, Select, Dialog, Toast, and Table.
7. Keep component pages sequential and live, but make the opening answer three questions quickly: when to use it, when not to use it, and what it owns.

### P1 — visual and accessibility polish

8. Increase documentation-content top padding and section rhythm by roughly one 12–16px step. Keep the 30–32px navigation and 28/32px control density unchanged.
9. Add slightly more separation between the landing compatibility row and the first product proof. The hero itself already has sufficient space.
10. Audit dark-theme secondary text and disabled states for contrast without brightening the whole interface.
11. Verify tooltips, flyouts, focus-visible behavior, 200% zoom, high contrast, reduced motion, keyboard-only navigation, screen readers, and touch on physical devices. Label untested gates honestly.

### P2 — public open-source confidence

12. Shorten the README top section to product promise, screenshot, working install, and first example; link operational detail into documentation.
13. Align a tagged rc release and changelog with the deployed site, then provide bug and reproduction templates plus a small first-contribution path.
14. Create one small independent example app that consumes only the public registry output. Do not describe the internal product pilot as external adoption.
15. Promote only after three proofs exist: clean public install, a real mini-app composition, and feedback from at least one outside tester.

## Spacing contract

- Increase whitespace in page introductions, between major sections, and around meaningful evidence blocks.
- Keep catalog rows, component controls, state specimens, menus, and tables dense.
- Prefer a readable 62–68 character body measure rather than using extra card padding.
- Do not introduce more borders or decorative containers to create separation.

## Reference systems

- shadcn registry: source ownership, namespaced and GitHub registry installation, review/diff workflow
- Base UI: concise product contract, accessibility and composition
- React Aria: interaction parity across input methods, internationalization, semantic testing
- Primer: anatomy, use cases, variants, do/don't, content and accessibility guidance
- Radix Primitives: predictable typed APIs and incremental adoption

## Evidence limits

This audit inspected representative routes and current screenshots plus clean-registry resolution. It does not prove full WCAG conformance, physical-device behavior, third-party adoption, or production use. Those remain explicit release gates.
