# Interaction Index Figma library build plan

> Generated from the DTCG tokens, TypeScript public API, registry, and component behavior contracts. Do not edit directly.

## Foundation

- 145 source tokens
- 138 Figma variables in Foundation and Theme collections
- 7 text styles
- 14 Light/Dark effect styles

## File structure

- **00 Cover** — Library identity, private-alpha status, and source-of-truth note.
- **01 Foundations** — Variables, text styles, effect styles, and usage specimens.
- **02 Button** — Button component set, anatomy, states, and code contract.
- **03 Icon Button** — Icon Button component set, anatomy, states, and code contract.
- **04 Field & Fieldset** — Field & Fieldset component set, anatomy, states, and code contract.
- **05 Input Group** — Input Group component set, anatomy, states, and code contract.
- **06 Kbd** — Kbd component set, anatomy, states, and code contract.
- **07 Button Group** — Button Group component set, anatomy, states, and code contract.
- **08 Toolbar** — Toolbar component set, anatomy, states, and code contract.
- **09 Text Field** — Text Field component set, anatomy, states, and code contract.
- **10 Textarea** — Textarea component set, anatomy, states, and code contract.
- **11 Checkbox** — Checkbox component set, anatomy, states, and code contract.
- **12 Radio Group** — Radio Group component set, anatomy, states, and code contract.
- **13 Switch** — Switch component set, anatomy, states, and code contract.
- **14 Select** — Select component set, anatomy, states, and code contract.
- **15 Context Switcher** — Context Switcher component set, anatomy, states, and code contract.
- **16 Combobox** — Combobox component set, anatomy, states, and code contract.
- **17 Search Input** — Search Input component set, anatomy, states, and code contract.
- **18 Number Field** — Number Field component set, anatomy, states, and code contract.
- **19 Calendar & Date Picker** — Calendar & Date Picker component set, anatomy, states, and code contract.
- **20 Segmented Control** — Segmented Control component set, anatomy, states, and code contract.
- **21 Tooltip** — Tooltip component set, anatomy, states, and code contract.
- **22 Popover** — Popover component set, anatomy, states, and code contract.
- **23 Menu** — Menu component set, anatomy, states, and code contract.
- **24 Context Menu** — Context Menu component set, anatomy, states, and code contract.
- **25 Dialog** — Dialog component set, anatomy, states, and code contract.
- **26 Sheet** — Sheet component set, anatomy, states, and code contract.
- **27 Alert Dialog** — Alert Dialog component set, anatomy, states, and code contract.
- **28 Tabs** — Tabs component set, anatomy, states, and code contract.
- **29 Breadcrumbs** — Breadcrumbs component set, anatomy, states, and code contract.
- **30 Pagination** — Pagination component set, anatomy, states, and code contract.
- **31 Collapsible** — Collapsible component set, anatomy, states, and code contract.
- **32 Toast** — Toast component set, anatomy, states, and code contract.
- **33 Progress** — Progress component set, anatomy, states, and code contract.
- **34 Spinner** — Spinner component set, anatomy, states, and code contract.
- **35 Skeleton** — Skeleton component set, anatomy, states, and code contract.
- **36 Alert** — Alert component set, anatomy, states, and code contract.
- **37 Empty State** — Empty State component set, anatomy, states, and code contract.
- **38 Badge** — Badge component set, anatomy, states, and code contract.
- **39 Avatar** — Avatar component set, anatomy, states, and code contract.
- **40 Table** — Table component set, anatomy, states, and code contract.
- **41 Tree** — Tree component set, anatomy, states, and code contract.
- **42 Reorderable List** — Reorderable List component set, anatomy, states, and code contract.
- **43 Inline Edit** — Inline Edit component set, anatomy, states, and code contract.
- **44 Action List** — Action List component set, anatomy, states, and code contract.
- **45 Shared Detail** — Shared Detail component set, anatomy, states, and code contract.
- **46 Undo Stack** — Undo Stack component set, anatomy, states, and code contract.
- **90 Interaction Patterns** — Shared Detail, Action List, Undo Stack, and Inline Edit compositions.
- **99 Documentation** — Release gates, accessibility scope, and Code Connect status.

## Component sets

- **Button** · Controls · 7 documented states · 12 representative variants · `src/components/ui/button.tsx`
- **Icon Button** · Controls · 7 documented states · 12 representative variants · `src/components/ui/icon-button.tsx`
- **Field & Fieldset** · Controls · 7 documented states · 7 representative variants · `src/components/ui/field.tsx`
- **Input Group** · Controls · 7 documented states · 13 representative variants · `src/components/ui/input-group.tsx`
- **Kbd** · Controls · 5 documented states · 5 representative variants · `src/components/ui/kbd.tsx`
- **Button Group** · Controls · 6 documented states · 7 representative variants · `src/components/ui/button-group.tsx`
- **Toolbar** · Controls · 6 documented states · 7 representative variants · `src/components/ui/toolbar.tsx`
- **Text Field** · Controls · 7 documented states · 7 representative variants · `src/components/ui/text-field.tsx`
- **Textarea** · Controls · 7 documented states · 7 representative variants · `src/components/ui/textarea.tsx`
- **Checkbox** · Controls · 7 documented states · 7 representative variants · `src/components/ui/checkbox.tsx`
- **Radio Group** · Controls · 8 documented states · 9 representative variants · `src/components/ui/radio-group.tsx`
- **Switch** · Controls · 6 documented states · 6 representative variants · `src/components/ui/switch.tsx`
- **Select** · Controls · 9 documented states · 9 representative variants · `src/components/ui/select.tsx`
- **Context Switcher** · Controls · 8 documented states · 8 representative variants · `src/components/ui/context-switcher.tsx`
- **Combobox** · Controls · 9 documented states · 9 representative variants · `src/components/ui/combobox.tsx`
- **Search Input** · Controls · 8 documented states · 8 representative variants · `src/components/ui/search-input.tsx`
- **Number Field** · Controls · 9 documented states · 9 representative variants · `src/components/ui/number-field.tsx`
- **Calendar & Date Picker** · Controls · 8 documented states · 8 representative variants · `src/components/ui/date-picker.tsx`
- **Segmented Control** · Controls · 8 documented states · 10 representative variants · `src/components/ui/segmented-control.tsx`
- **Tooltip** · Overlays · 5 documented states · 12 representative variants · `src/components/ui/tooltip.tsx`
- **Popover** · Overlays · 7 documented states · 14 representative variants · `src/components/ui/popover.tsx`
- **Menu** · Overlays · 7 documented states · 14 representative variants · `src/components/ui/menu.tsx`
- **Context Menu** · Overlays · 7 documented states · 14 representative variants · `src/components/ui/context-menu.tsx`
- **Dialog** · Overlays · 8 documented states · 8 representative variants · `src/components/ui/dialog.tsx`
- **Sheet** · Overlays · 7 documented states · 10 representative variants · `src/components/ui/sheet.tsx`
- **Alert Dialog** · Overlays · 7 documented states · 7 representative variants · `src/components/ui/alert-dialog.tsx`
- **Tabs** · Navigation · 6 documented states · 6 representative variants · `src/components/ui/tabs.tsx`
- **Breadcrumbs** · Navigation · 6 documented states · 6 representative variants · `src/components/ui/breadcrumbs.tsx`
- **Pagination** · Navigation · 7 documented states · 7 representative variants · `src/components/ui/pagination.tsx`
- **Collapsible** · Disclosure · 6 documented states · 6 representative variants · `src/components/ui/collapsible.tsx`
- **Toast** · Feedback · 7 documented states · 7 representative variants · `src/components/ui/toast.tsx`
- **Progress** · Feedback · 6 documented states · 7 representative variants · `src/components/ui/progress.tsx`
- **Spinner** · Feedback · 5 documented states · 7 representative variants · `src/components/ui/spinner.tsx`
- **Skeleton** · Feedback · 5 documented states · 7 representative variants · `src/components/ui/skeleton.tsx`
- **Alert** · Feedback · 7 documented states · 9 representative variants · `src/components/ui/alert.tsx`
- **Empty State** · Feedback · 6 documented states · 7 representative variants · `src/components/ui/empty-state.tsx`
- **Badge** · Data display · 6 documented states · 11 representative variants · `src/components/ui/badge.tsx`
- **Avatar** · Data display · 7 documented states · 12 representative variants · `src/components/ui/avatar.tsx`
- **Table** · Data display · 8 documented states · 8 representative variants · `src/components/ui/table.tsx`
- **Tree** · Data display · 7 documented states · 7 representative variants · `src/components/ui/tree.tsx`
- **Reorderable List** · Interaction · 8 documented states · 9 representative variants · `src/components/ui/reorderable-list.tsx`
- **Inline Edit** · Interaction · 8 documented states · 8 representative variants · `src/components/ui/inline-edit.tsx`
- **Action List** · Interaction · 7 documented states · 7 representative variants · `src/components/ui/action-list.tsx`
- **Shared Detail** · Interaction · 8 documented states · 15 representative variants · `src/components/ui/shared-detail.tsx`
- **Undo Stack** · Interaction · 7 documented states · 7 representative variants · `src/components/ui/undo-stack.tsx`

## Honest release gates

- A target Figma plan and file must be selected before any remote write.
- Component node IDs and published keys remain null until the nodes actually exist and are published.
- Code Connect remains pending until the plan supports it and the real published nodes can be inspected.
- This handoff does not claim external adoption or npm publication.
