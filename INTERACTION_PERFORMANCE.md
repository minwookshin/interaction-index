# Interaction performance evidence

Measured: 2026-08-17.
Environment: local production preview in bundled Chromium at 1280 x 720 with reduced motion enabled.

## Route-aware bundle budgets

The landing loads 78,793 bytes of initial JavaScript and 7,007 bytes of initial CSS after gzip. HTML, the Inter Latin font, initial JavaScript, and initial CSS total 134,773 bytes of critical compressed/static transfer. The route graph is intentionally split by user intent instead of forcing every adopter-facing page into one entry.

| Route graph | Latest JavaScript gzip | Release budget |
| --- | ---: | ---: |
| Landing | 78,793 bytes | 90,000 bytes |
| Documentation shell | 340,526 bytes for the documentation shell | 360,000 bytes |
| Public documentation | 362,268 bytes | 370,000 bytes |
| Product pilot | 403,361 bytes | Included in the Data surface boundary |
| Teum Data recipes | 488,668 bytes | 490,000 bytes |
| Teum Analytics recipes | 403,224 bytes | 500,000 bytes |
| Product Patterns | 410,753 bytes | 500,000 bytes |
| Heaviest Core component route | 420,254 bytes for the heaviest component route | 430,000 bytes |

The heaviest Core component route is Date Picker. Date Picker, Tree, Reorderable List, the public documentation body, Product pilot, Data, Analytics, and Product Patterns remain route-lazy. The largest emitted JavaScript chunk is 480,845 bytes raw and 109,898 bytes after gzip, below the 500,000 / 115,000 byte chunk budgets. The complete mutually exclusive route graph is 579,685 bytes of JavaScript and 53,635 bytes of CSS after gzip, below the scope-adjusted 585,000 / 55,000 byte budgets; exact files, transitive route graphs, and thresholds live in `performance-report.json`.

## Local runtime evidence

| Path | Latest observed | Release budget | Machine-readable record |
| --- | ---: | ---: | --- |
| Landing FCP / LCP | 148 ms / 148 ms | < 1,500 ms / < 2,500 ms | `release/runtime-performance.json` |
| Documentation FCP / LCP | 124 ms / 420 ms | < 1,800 ms / < 2,500 ms | `release/runtime-performance.json` |
| Maximum landing/docs CLS | 0.0132 | < 0.05 | `release/runtime-performance.json` |
| Landing to documentation | 392 ms | < 1,500 ms | `release/runtime-performance.json` |
| Select another issue and render Shared Detail | 12 ms | < 750 ms | `release/runtime-performance.json` |
| Open the New issue dialog | 10 ms | < 750 ms | `release/runtime-performance.json` |

The longest observed interaction task was 74 ms, below the 250 ms release budget. `npm run measure` rebuilds both the route-aware bundle report and runtime evidence; `npm run check:runtime-performance` rejects stale-version or failing runtime evidence.

These are repeatable local lab measurements, not field Core Web Vitals, real-device latency, or production RUM. Production p75 data, physical devices, and real-network conditions remain explicit external gates.
