# Draft announcement — Teum public beta (`0.1.0-rc.22`)

Teum is an open-source React component and interaction system for compact product interfaces.

It starts with accessible, source-owned components, then goes further on the moments where product state changes: finding an action, inspecting without losing place, editing in context, and recovering from a mutation. Stable geometry, shared origin, and reversible completion are the behavior rules that hold those moments together.

The current release candidate includes:

- 45 documented Core components and 15 product primitives;
- framework-neutral CSS variables and scoped component CSS;
- an optional Tailwind CSS v4 bridge over the same semantic roles;
- light and dark themes;
- component state, keyboard, accessibility, API, and product-composition documentation;
- four authored interaction Playgrounds, three Data workflows, three Analytics workflows, three Product Patterns, and one internal issue-workspace pilot;
- agent-readable selection, composition, and prohibition contracts evaluated against 30 fixed product tasks;
- a shadcn-compatible source registry with a pinned release path.

Try one component from a disposable React + TypeScript branch:

```bash
npx shadcn@4.18.0 registry add @teum-pinned=https://teum.minwookshin.com/r/v/0.1.0-rc.22/{name}.json
npx shadcn@4.18.0 add @teum-pinned/button
```

Documentation: https://teum.minwookshin.com

Source: https://github.com/minwookshin/teum

This is a public beta, not a production-readiness claim. APIs may change; independent adoption, broader physical-device review, and external accessibility review are still open evidence gates. npm remains unpublished until its separately verified beta channel is live.

Made by Minwook Shin — https://minwookshin.com
