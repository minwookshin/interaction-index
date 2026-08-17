# Quality contract

## Required

- Use documented registry items, exports, props, and semantic tokens only.
- Preserve component geometry across loading, selection, details, bulk actions, and feedback.
- Keep shareable state in URL or product state, persisted preferences in storage, and transient interaction state local.
- Give keyboard and pointer paths the same outcome.
- Keep accessible names, semantic HTML, focus return, exact values, text summaries, and chart data tables.
- Use one foreground feedback identity for sequential outcomes.
- Remove spatial travel in reduced motion.
- Verify TypeScript and a production build in the consumer.

## Forbidden

- Private selectors, undocumented props, invented exports, or invented registry items.
- Persisted selection, open overlays, pointer position, loading state, or in-flight work.
- Client-side sorting or pagination of server-owned rows.
- Toasts that require a response; Alert Dialogs for reliably reversible actions.
- Color-only meaning or charts without a textual/semantic equivalent.
- High-frequency animation on inspection, sorting, filtering, keyboard navigation, or virtual scrolling.
- Pointer focus halos or geometry-shifting feedback.
- Claims of external adoption, physical-device coverage, or production readiness without evidence.
