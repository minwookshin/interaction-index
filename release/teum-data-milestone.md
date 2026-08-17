# Teum Data milestone

Candidate: `0.1.0-rc.14`
Status: locally verified, unpublished

## Scope

- 45-component Teum Core, unchanged
- Data Table, Filter Builder, Data Toolbar, and Bulk Action Bar
- Date Range Filter and Data Export Menu
- Controlled and server-oriented view state with compact URL serialization
- Persistent saved views, column resize and pinning, pagination, and virtualized rows
- Issues Workspace, Customer Directory, and Audit Log recipes
- Motion Contract v1
- Agent-readable component, view-state, and composition contracts

## Verified

- 176 unit tests
- 45 Core and 6 product-component API modules
- 285 public TypeScript exports and 165 runtime exports
- 312 light and dark visual baselines per platform
- 50 applicable accessibility checks, 30 intentional project skips, and ten required contracts
- 234 applicable browser checks and 336 intentional project skips across desktop Chromium, Firefox, WebKit, mobile Chromium, and mobile WebKit
- React 18 and React 19 package consumers
- package SSR and zero-error hydration
- pinned Button install and complete Teum Data install in fresh React + TypeScript + Vite projects
- 5,000-record server-style data and 10,000-row virtualization browser paths
- route-aware bundle and local production-preview performance budgets
- immutable registry history through `0.1.0-rc.14`

Machine-readable install proof: [`teum-data-install.json`](./teum-data-install.json).

## Still external

- independent adoption
- physical-device and Edge review
- independent accessibility review
- tag, GitHub release, or npm publication
