export const components = [
  { id: "button", name: "Button", group: "Controls", description: "Compact actions with stable loading geometry and clear hierarchy." },
  { id: "icon-button", name: "Icon Button", group: "Controls", description: "Square actions that require an accessible name and contextual tooltip." },
  { id: "field", name: "Field & Fieldset", group: "Controls", description: "Accessible form structure that keeps labels, guidance, validation, and grouped choices connected." },
  { id: "input-group", name: "Input Group", group: "Controls", description: "One text-entry boundary composed with contextual addons and compact actions." },
  { id: "kbd", name: "Kbd", group: "Controls", description: "Quiet keyboard-hint notation for shortcuts, sequences, and modifier chords." },
  { id: "button-group", name: "Button Group", group: "Controls", description: "Related actions composed with shared rhythm, hierarchy, and optional joined geometry." },
  { id: "toolbar", name: "Toolbar", group: "Controls", description: "A compact set of frequently used controls with roving keyboard navigation." },
  { id: "text-field", name: "Text Field", group: "Controls", description: "Dense text entry with labels, descriptions, validation, and adornments." },
  { id: "textarea", name: "Textarea", group: "Controls", description: "Long-form input with persistent guidance, validation, and count feedback." },
  { id: "checkbox", name: "Checkbox", group: "Controls", description: "Binary or mixed selection with a generous invisible hit target." },
  { id: "radio-group", name: "Radio Group", group: "Controls", description: "A labelled, keyboard-navigable choice between mutually exclusive options." },
  { id: "switch", name: "Switch", group: "Controls", description: "Immediate settings with clear on, off, focus, and disabled states." },
  { id: "select", name: "Select", group: "Controls", description: "Compact selection from a short predefined list with native-feeling typeahead." },
  { id: "context-switcher", name: "Context Switcher", group: "Controls", description: "Rich single selection with icon, supporting context, and quiet layered elevation." },
  { id: "combobox", name: "Combobox", group: "Controls", description: "Filter and select from a larger predefined collection without free-form ambiguity." },
  { id: "search-input", name: "Search Input", group: "Controls", description: "Free-form query input with clear, loading, and keyboard-shortcut affordances." },
  { id: "number-field", name: "Number Field", group: "Controls", description: "Locale-aware numeric entry with keyboard stepping, bounds, and stable controls." },
  { id: "date-picker", name: "Calendar & Date Picker", group: "Controls", description: "Locale-aware date entry and calendar selection with one shared validation contract." },
  { id: "segmented-control", name: "Segmented Control", group: "Controls", description: "Compact single selection between peer views or presentation modes." },
  { id: "tooltip", name: "Tooltip", group: "Overlays", description: "A concise label or shortcut hint for otherwise ambiguous controls." },
  { id: "popover", name: "Popover", group: "Overlays", description: "A lightweight, non-modal surface anchored to its trigger." },
  { id: "menu", name: "Menu", group: "Overlays", description: "A keyboard-navigable set of contextual actions and toggles." },
  { id: "context-menu", name: "Context Menu", group: "Overlays", description: "Pointer and keyboard access to object-specific actions without adding permanent chrome." },
  { id: "dialog", name: "Dialog", group: "Overlays", description: "A focused modal task with trapped focus and reversible dismissal." },
  { id: "sheet", name: "Sheet", group: "Overlays", description: "An edge-aligned focused panel for compact workflows that benefit from visible page context." },
  { id: "alert-dialog", name: "Alert Dialog", group: "Overlays", description: "A blocking decision that requires a user response." },
  { id: "tabs", name: "Tabs", group: "Navigation", description: "A dense view switcher with automatic keyboard navigation." },
  { id: "breadcrumbs", name: "Breadcrumbs", group: "Navigation", description: "Compact location context with semantic current-page and collapsed-depth handling." },
  { id: "pagination", name: "Pagination", group: "Navigation", description: "Bounded page navigation for data sets where stable positions matter." },
  { id: "collapsible", name: "Collapsible", group: "Disclosure", description: "Progressively reveals supporting content without changing destinations." },
  { id: "toast", name: "Toast", group: "Feedback", description: "Brief confirmation that stays secondary to the current task." },
  { id: "progress", name: "Progress", group: "Feedback", description: "Determinate or indeterminate task completion with a screen-reader status contract." },
  { id: "spinner", name: "Spinner", group: "Feedback", description: "Compact ongoing-work feedback for controls and tightly bounded surfaces." },
  { id: "skeleton", name: "Skeleton", group: "Feedback", description: "Layout-preserving placeholder geometry for content that is expected imminently." },
  { id: "alert", name: "Alert", group: "Feedback", description: "Persistent inline feedback with an optional action and deliberate announcement policy." },
  { id: "empty-state", name: "Empty State", group: "Feedback", description: "Explains an empty collection and offers the smallest useful next step." },
  { id: "badge", name: "Badge", group: "Data display", description: "Compact metadata, category, status, and removable-filter labeling." },
  { id: "avatar", name: "Avatar", group: "Data display", description: "Person or entity identity with deterministic fallback, size, status, and grouping." },
  { id: "table", name: "Table", group: "Data display", description: "Semantic tabular structure composed into product-specific sorting, filtering, and selection." },
  { id: "tree", name: "Tree", group: "Data display", description: "Hierarchical navigation and selection with expansion, typeahead, and roving focus." },
  { id: "reorderable-list", name: "Reorderable List", group: "Interaction", description: "Pointer, touch, keyboard, and screen-reader reordering with visible drop intent." },
  { id: "inline-edit", name: "Inline Edit", group: "Interaction", description: "Edit in place while preserving line geometry and focus origin." },
  { id: "action-list", name: "Action List", group: "Interaction", description: "A filterable, keyboard-first action surface for dense workflows." },
  { id: "shared-detail", name: "Shared Detail", group: "Interaction", description: "Move from a list object to its detail without losing identity." },
  { id: "undo-stack", name: "Undo Stack", group: "Interaction", description: "Make consequential actions recoverable through a real LIFO history." },
] as const;

export type ComponentId = (typeof components)[number]["id"];
export type ComponentGroup = (typeof components)[number]["group"];

export const componentGroups = [...new Set(components.map((component) => component.group))] as readonly ComponentGroup[];

// The public Library stays focused on complete interface controls. Authored
// interactions and the supporting Kbd primitive remain installable and
// documented without taking a full specimen card in the entry catalog.
export const libraryComponents = components.filter((component) => component.group !== "Interaction" && component.id !== "kbd");
export type LibraryComponentGroup = Exclude<ComponentGroup, "Interaction">;
export const libraryComponentGroups = [...new Set(libraryComponents.map((component) => component.group))] as readonly LibraryComponentGroup[];
