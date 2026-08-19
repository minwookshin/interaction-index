# RC external gates

The local `0.1.0-rc.30` artifact may be assembled from a clean commit when automated verification passes. A stable compatibility promise or npm publication remains blocked until the applicable external gates below have dated evidence.

These are environment gates, not hidden implementation TODOs. Each gate names what local automation already proves and what still requires the real platform.

## 1. Microsoft Edge on Windows

**Automated evidence already present:** Chromium, Firefox, WebKit, mobile Chromium, and mobile WebKit projects; 1280 x 720 visual ownership in Chromium; keyboard, reflow, and forced-colors structure.

**Required external run:**

1. Use the current stable Microsoft Edge on a supported Windows release.
2. Review Introduction, Installation, Button, Text Field, Menu, Dialog, Table, Shared Detail, and Product pilot in light and dark.
3. Verify keyboard-only traversal, visible keyboard focus, overlay dismissal, focus return, 200% browser zoom, horizontal reflow, and font rendering.
4. Run Windows High Contrast in at least one light and one dark scheme on Button, Text Field, Menu, Dialog, Table, and Shared Detail.
5. Record Windows version, Edge version, candidate SHA-256, date, result, and screenshots for any variance.

**Pass condition:** no task-blocking loss of content, focus, name, state, target, or action; no serious visual hierarchy regression relative to the frozen Chromium baseline.

## 2. Physical iOS and Android

**Automated evidence already present:** 24 CSS pixel effective target-floor scan across all 45 Product previews; representative touch paths in mobile Chromium and WebKit; virtual-keyboard viewport proxy.

**Required external run:**

1. Test one current iPhone/Safari combination and one current Android/Chrome combination.
2. Verify Text Field, Number Field, Search Input, Combobox, Date Picker, Menu, Dialog, Sheet, Tabs, Toast, Reorderable List, Shared Detail, and Product pilot.
3. Exercise the real software keyboard, text selection, autofill where applicable, orientation change, safe areas, scroll locking, overlay positioning, tap dismissal, and zoom.
4. Confirm that bottom sheets, dialogs, toasts, and focused fields remain reachable while the keyboard is open.
5. Record device, OS, browser, candidate SHA-256, date, result, and media for any variance.

**Pass condition:** every primary task completes without clipped controls, unreachable actions, accidental background scroll, lost focus, or obscured content.

## 3. Operating-system accessibility modes

**Automated evidence already present:** axe across every public route; forced-colors and reduced-motion structural scans; light/dark contrast tokens; representative Safari VoiceOver Dialog and Menu review.

**Required external run:**

1. Review Windows High Contrast as part of the Edge gate.
2. Review macOS Increase Contrast and Reduce Transparency on Introduction, Button, Text Field, Menu, Dialog, Table, Shared Detail, and Product pilot.
3. Confirm that elevation is never the only boundary, muted text remains legible, current/selected state survives, and disabled state is distinguishable without disappearing.
4. Run a keyboard and screen-reader anchor pass after the visual-mode change.

**Pass condition:** hierarchy, current state, focus, errors, and actionable boundaries remain perceivable without relying on translucency or shadow alone.

## 4. Human-language and bidirectional review

**Automated evidence already present:** synthetic long-label expansion at desktop and narrow widths, document-level overflow scans, RTL structure, and atomic keyboard-hint checks.

**Required external run:**

1. Review one verbose Latin translation and one RTL translation on Introduction, Installation, Button, Text Field, Menu, Dialog, Table, Shared Detail, and Product pilot.
2. Confirm line wrapping, truncation policy, logical ordering, table overflow, icon direction, shortcut order, and overlay anchoring.
3. Treat semantic direction icons separately from decorative icons; do not mirror every icon mechanically.

**Pass condition:** content remains understandable and operable with no semantic direction error or concealed required action.

## 5. Linux visual baselines — satisfied

**Current evidence:** GitHub Actions run `32170428449` generated the complete Linux set in the project CI image on 2026-08-18. The artifact contains 340 Linux PNGs: 332 release-level baselines and eight focused browser captures. Its paths, file types, uniqueness, and counts were validated; representative landing, documentation, Core, Analytics light/dark, and Product Pattern captures were visually inspected. macOS raster output was not reused.

**Ongoing release check:** protected-branch CI reruns the catalog, Analytics, and Product Patterns visual suites against these committed Linux baselines.

**Pass condition:** 138 public-route and 194 isolated Storybook snapshots exist and pass for Linux without copying macOS raster output.

## Evidence record

Copy this block for every external run:

```text
Gate:
Candidate version: 0.1.0-rc.30
Candidate SHA-256:
Date:
Tester:
Device / OS:
Browser / assistive technology:
Routes and tasks:
Result: pass | conditional pass | fail
Defects / evidence links:
Retest:
```

An unfilled record must remain visibly unverified. It must never be converted into a support claim by inference.
