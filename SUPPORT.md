# Support policy

Interaction Index is an MIT-licensed alpha. Support claims are based on recorded tests, not browser similarity or assumed compatibility.

## Support levels

| Level | Meaning |
| --- | --- |
| Verified | Automated coverage and the relevant manual review passed for the current release. |
| Target | The platform is part of the intended support matrix but still has an open release gate. |
| Not supported | The platform is outside the current contract or has a known blocking defect. |

## Intended browser matrix

| Platform | Current level | Release requirement |
| --- | --- | --- |
| Chromium | Automated verified | Desktop route, disclosure, theme, and overflow coverage |
| Firefox | Automated verified | Desktop route, disclosure, theme, and overflow coverage; manual focus/overlay review remains |
| WebKit | Automated verified | Desktop route, disclosure, theme, and overflow coverage; manual Safari review remains |
| Chrome / Edge | Target | Branded smoke test after Chromium passes |
| Mobile Chromium | Automated verified | Pixel 5 emulation passed; physical touch, zoom, and virtual-keyboard review remains |
| Mobile WebKit | Automated verified | iPhone 12 emulation passed; physical Safari, safe-area, and overlay review remains |

Playwright emulation is an engine and responsive-behavior signal, not a substitute for branded Safari or physical-device testing. The compatibility document records the exact evidence completed for each release.

Automated accessibility and modality evidence currently includes axe anchor routes, forced colors, reduced motion, RTL structure, and a 640 px zoom-layout proxy. Manual VoiceOver, branded-browser zoom/high-contrast, content expansion, and physical touch remain public-alpha gates.

## Getting help

Use [public issues](https://github.com/minwookshin/interaction-index/issues) for reproducible bugs, documentation gaps, and feature proposals. Use the private process in `SECURITY.md` for vulnerabilities. General product implementation consulting is outside the open-source support contract.
