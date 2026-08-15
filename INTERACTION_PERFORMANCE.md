# Interaction performance evidence

Date: 2026-08-14
Environment: local Playwright Chromium, 1280 x 720, reduced-motion media preference.

| Path | Latest observed | Release budget | Automated assertion |
| --- | ---: | ---: | --- |
| Select another issue and render Shared Detail | 530 ms | < 750 ms | `tests/browser/product-pilot.spec.ts` |
| Open the New issue dialog | 263 ms | < 750 ms | `tests/browser/product-pilot.spec.ts` |

Production documentation bundle after gzip: 293,988 bytes JavaScript and 29,318 bytes CSS. The enforced budgets are 330,000 and 40,000 bytes respectively; exact assets are recorded in `performance-report.json`.

These are local alpha measurements, not field latency or production Core Web Vitals. Re-run them on a release candidate and investigate regressions before publication.
