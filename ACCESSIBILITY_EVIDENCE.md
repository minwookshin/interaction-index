# Accessibility evidence

Date: 2026-08-14

## Automated

- Axe checks run on Introduction, Button, and the Product pilot and fail on serious or critical violations.
- Component tests cover accessible names, keyboard activation, focus return, validation semantics, dismissal, and live announcements where applicable.
- Playwright checks the Product pilot in reduced motion, forced colors, right-to-left direction, and a 640 px viewport used as a 200% zoom layout proxy.

Automated checks do not prove screen-reader usability or WCAG conformance.

## Manual release matrix

| Review | Status | Required evidence |
| --- | --- | --- |
| Keyboard-only anchor paths | Verified in Chrome 151 and Safari 26.5.2 | Search receives the first page focus; Dialog and Menu focus return on Escape |
| VoiceOver + Safari | Verified for Button, Dialog, and Menu anchors | Dialog title/description/control order, contained focus, Menu role and selection, Escape return |
| 200% browser zoom | Verified on Button in Chrome 151 and Safari 26.5.2 | No content loss or horizontal clipping; secondary outline collapses and navigation adapts |
| Forced colors | Automated structural pass complete; manual contrast pass pending | Visible controls, selection, focus, and status |
| Reduced motion | Automated structural pass complete | No spatial travel; state feedback remains understandable |
| RTL | Automated structural pass complete | No overflow; order and icons reviewed for meaning |
| Content expansion | Pending | 200% labels and translated-length fixtures |
| Physical touch | Devices detected; interaction pass pending | iPhone and iPad Safari touch, virtual keyboard, safe areas, and overlay dismissal |

Do not convert pending evidence into a support claim. Record the browser, OS, assistive-technology version, route, result, and defect link when each pass is completed.

## Manual session — 2026-08-14

- Environment: macOS 26.5.2 (25F84), Safari 26.5.2 (21624.2.5.11.8), Google Chrome 151.0.7922.138.
- Chrome Button route: first page Tab reached Search documentation with a visible contained focus treatment. At confirmed 200% browser zoom, the page outline collapsed, the navigation and document remained usable, and no content was clipped horizontally. Zoom was restored to 100% after review.
- Safari Button route: the native accessibility tree exposed the navigation landmark, 35 component links, heading order, Product/State toggles, named actions, state-contract groups, API table, and page outline. Keyboard focus reached Search documentation. Increased browser zoom switched to the compact shell without content loss; zoom was restored afterward.
- VoiceOver was started for the Safari review and turned off afterward. On Dialog, focus entered the named “Edit component metadata” task, Tab remained within its fields/actions, Escape closed it, and focus returned to the “Edit details” trigger. On Menu, Safari exposed a named `Actions` menu; Arrow Down selected “Duplicate ⌘D”; Escape closed it and returned focus to the `Actions` trigger.
- Physical devices detected by Xcode tooling: one iPhone on iOS 26.6 and one iPad on iPadOS 26.6. This environment cannot perform or observe their touch gestures, so detection is not recorded as a physical-device pass.
- Microsoft Edge was not installed. No Edge evidence is claimed.
