# Teum public beta

Teum `0.1.0-rc.22` is in public beta. The [site](https://teum.minwookshin.com), [GitHub prerelease](https://github.com/minwookshin/teum/releases/tag/v0.1.0-rc.22), and pinned registry are live. The npm package is not published. This is for real product evaluation, not a production-readiness claim.

## Try one task

Use a disposable React + TypeScript branch and install the exact candidate:

```bash
npx shadcn@4.18.0 registry add @teum-pinned=https://teum.minwookshin.com/r/v/0.1.0-rc.22/{name}.json
npx shadcn@4.18.0 view @teum-pinned/button
npx shadcn@4.18.0 add @teum-pinned/button
```

Build one real action, form value, data surface, or recovery flow. Change one semantic token, check light and dark, use the keyboard path, and run the product build.

## Report what happened

Use the repository's [Adopter feedback form](https://github.com/minwookshin/teum/issues/new?template=adopter-feedback.yml). Include the exact version, integration path, product task, environment, typecheck and production-build result, and whether the component stayed in the project. Do not include confidential product data or vulnerability details.

Teum records no usage telemetry. An evaluation counts toward v1 only when it comes from an independently maintained consumer and has dated, permissioned evidence. Private evaluations may be recorded without publishing product details.

## Promotion rule

The beta does not become v1 because a date arrives or the catalog grows. v1 requires:

- at least one independently maintained project that installs and builds the candidate;
- two completed feedback rounds with evidence-linked decisions;
- a measured API stability window;
- the remaining claimed browser, device, language, and accessibility support evidence;
- a public package and registry whose bytes match the verified release.

Current machine-readable status is generated in [`release/beta-readiness.json`](./release/beta-readiness.json). Empty evidence remains a blocker.
