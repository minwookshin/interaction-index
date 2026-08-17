# Accessibility evidence

Date: 2026-08-17

## Automated

- Axe checks run across all 69 public routes and fail on serious or critical violations.
- Component tests cover accessible names, keyboard activation, focus return, validation semantics, dismissal, and live announcements where applicable.
- Playwright checks all 45 component routes plus the public documentation, foundation, pattern, and landing routes for 200% equivalent reflow, keyboard-hint atomicity, synthetic content expansion, forced-colors structure, reduced-motion structure, and document overflow. The Product pilot also has right-to-left and task-level keyboard coverage.
- The dedicated five-project accessibility run recorded 55 applicable checks passed and 30 intentional project-ownership skips, with zero failures or flaky results. Its ten required contracts cover route-wide axe and landmark ownership, reflow, shortcut geometry, content expansion, forced colors, reduced motion, overlay focus return, skip paths, route announcements, and compact-navigation focus handoff.
- Landing and documentation expose the first DOM focus target as a visible-on-focus skip link. In-app document changes announce the new page without stealing desktop navigation focus; compact navigation moves focus to the selected document after its drawer closes.
- [`release/accessibility.json`](./release/accessibility.json) binds the result to `0.1.0-rc.22`, the five configured browser projects, the 69-route catalog, and the exact contract owners.

Automated checks do not prove screen-reader usability or WCAG conformance.

## Manual release matrix

| Review | Status | Required evidence |
| --- | --- | --- |
| Keyboard-only anchor paths | Automated current; manual shell rerun required | Skip links precede product chrome; route changes announce; Dialog and Menu focus return on Escape |
| VoiceOver + Safari | Verified for Button, Dialog, and Menu anchors | Dialog title/description/control order, contained focus, Menu role and selection, Escape return |
| 200% browser zoom | Verified on Button in Chrome 151 and Safari 26.5.2 | No content loss or horizontal clipping; secondary outline collapses and navigation adapts |
| Forced colors | Automated structural pass complete; manual contrast pass pending | Visible controls, selection, focus, and status |
| Reduced motion | Automated structural pass complete | No spatial travel; state feedback remains understandable |
| RTL | Automated structural pass complete | No overflow; order and icons reviewed for meaning |
| Content expansion | Automated synthetic fixture complete; human translation pending | One verbose human-reviewed translation and one human-reviewed RTL translation |
| Physical touch | Devices detected; interaction pass pending | iPhone and iPad Safari touch, virtual keyboard, safe areas, and overlay dismissal |

Do not convert pending evidence into a support claim. Record the browser, OS, assistive-technology version, route, result, and defect link when each pass is completed.

## Manual session — 2026-08-14

- Environment: macOS 26.5.2 (25F84), Safari 26.5.2 (21624.2.5.11.8), Google Chrome 151.0.7922.138.
- Chrome Button route: before the 2026-08-16 skip-link change, first page Tab reached Search documentation with a visible contained focus treatment. At confirmed 200% browser zoom, the page outline collapsed, the navigation and document remained usable, and no content was clipped horizontally. Zoom was restored to 100% after review. The current skip-link-first shell is covered automatically and remains queued for the final manual RC rerun.
- Safari Button route: before the 2026-08-16 skip-link change, the native accessibility tree exposed the navigation landmark, 45 component links, heading order, Product/State toggles, named actions, state-contract groups, API table, and page outline. Keyboard focus reached Search documentation. Increased browser zoom switched to the compact shell without content loss; zoom was restored afterward. The component-level VoiceOver evidence below remains applicable; the changed shell focus order requires a final manual rerun.
- VoiceOver was started for the Safari review and turned off afterward. On Dialog, focus entered the named “Edit component metadata” task, Tab remained within its fields/actions, Escape closed it, and focus returned to the “Edit details” trigger. On Menu, Safari exposed a named `Actions` menu; Arrow Down selected “Duplicate ⌘D”; Escape closed it and returned focus to the `Actions` trigger.
- Physical devices detected by Xcode tooling: one iPhone on iOS 26.6 and one iPad on iPadOS 26.6. This environment cannot perform or observe their touch gestures, so detection is not recorded as a physical-device pass.
- Microsoft Edge was not installed. No Edge evidence is claimed.
