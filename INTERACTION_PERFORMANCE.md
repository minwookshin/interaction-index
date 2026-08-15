# Interaction performance evidence

Bundle measured: 2026-08-15. Interaction timings last observed: 2026-08-14.
Environment: local Playwright Chromium, 1280 x 720, reduced-motion media preference.

| Path | Latest observed | Release budget | Automated assertion |
| --- | ---: | ---: | --- |
| Select another issue and render Shared Detail | 530 ms | < 750 ms | `tests/browser/product-pilot.spec.ts` |
| Open the New issue dialog | 263 ms | < 750 ms | `tests/browser/product-pilot.spec.ts` |

Production documentation bundle after gzip: 343,245 bytes of initial JavaScript, 479,382 bytes across all JavaScript routes, and 39,983 bytes of CSS. The enforced budgets are 350,000 initial JavaScript, 500,000 total JavaScript, and 40,000 CSS bytes. Calendar, Tree, and Reorderable List preview code is route-lazy rather than part of the initial shell; exact assets and the initial dependency set are recorded in `performance-report.json`.

These are local alpha measurements, not field latency or production Core Web Vitals. Re-run them on a release candidate and investigate regressions before publication.
