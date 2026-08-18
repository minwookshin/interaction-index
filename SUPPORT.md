# Support policy

Teum is an MIT-licensed pre-release. Support claims are based on recorded tests, not browser similarity or assumed compatibility.

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
| WebKit | Automated verified | Desktop route, disclosure, theme, and overflow coverage |
| Safari 26.5.2 | Anchor routes manually verified | Button keyboard/zoom plus VoiceOver Dialog and Menu behavior passed on macOS 26.5.2 |
| Chrome 151 | Anchor route manually verified | Button keyboard focus and confirmed 200% zoom passed on macOS 26.5.2 |
| Edge | Target | Not installed in the current manual-test environment |
| Mobile Chromium | Automated verified | Pixel 5 emulation passed; physical touch, zoom, and virtual-keyboard review remains |
| Mobile WebKit | Automated verified | iPhone 12 emulation passed; physical Safari, safe-area, and overlay review remains |

Playwright emulation is an engine and responsive-behavior signal, not a substitute for branded or physical-device testing. The compatibility document records the exact evidence completed for each release.

Automated accessibility and modality evidence includes axe anchor routes, forced colors, reduced motion, RTL structure, and a 640 px zoom-layout proxy. Manual Safari/VoiceOver and Chrome zoom anchor passes are recorded in `ACCESSIBILITY_EVIDENCE.md`; Edge, physical touch, manual high contrast, and translated-content expansion remain open gates.

## Getting help

Use [public issues](https://github.com/minwookshin/whatiuse/issues) for reproducible bugs, documentation gaps, and feature proposals. Use the private process in `SECURITY.md` for vulnerabilities. General product implementation consulting is outside the open-source support contract.
