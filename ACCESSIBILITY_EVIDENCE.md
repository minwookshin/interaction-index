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
| Keyboard-only main product path | Pending final recorded pass | Tab order, focus visibility, focus return, Escape, undo shortcut |
| VoiceOver + Safari | Pending | Names, roles, states, reading order, dialog and menu announcements |
| 200% browser zoom | Automated proxy complete; branded-browser pass pending | No content loss, two-dimensional scrolling, or trapped controls |
| Forced colors | Automated structural pass complete; manual contrast pass pending | Visible controls, selection, focus, and status |
| Reduced motion | Automated structural pass complete | No spatial travel; state feedback remains understandable |
| RTL | Automated structural pass complete | No overflow; order and icons reviewed for meaning |
| Content expansion | Pending | 200% labels and translated-length fixtures |

Do not convert pending evidence into a support claim. Record the browser, OS, assistive-technology version, route, result, and defect link when each pass is completed.
