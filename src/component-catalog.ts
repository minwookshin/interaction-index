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

export const libraryCollections = ["Core", "Data", "Analytics"] as const;
export type LibraryCollection = (typeof libraryCollections)[number];

export const dataLibraryComponents = [
  { id: "data-table", name: "Data Table", collection: "Data", description: "Sort, select, and inspect product data without moving the surrounding layout.", docsHref: "#product-pilot" },
  { id: "filter-builder", name: "Filters", collection: "Data", description: "Small visible conditions that stay attached to the list they change.", docsHref: "#product-pilot" },
  { id: "data-toolbar", name: "Data Toolbar", collection: "Data", description: "Search, view, and column controls in one compact product row.", docsHref: "#product-pilot" },
  { id: "saved-view-menu", name: "Saved Views", collection: "Data", description: "Named collection states with explicit personal-view management.", docsHref: "#product-pilot" },
  { id: "column-visibility-menu", name: "Columns", collection: "Data", description: "Visible-column choices that preserve required product context.", docsHref: "#product-pilot" },
  { id: "facet-filter", name: "Facet Filter", collection: "Data", description: "Fast multi-selection for small enumerable dimensions and counts.", docsHref: "#product-pilot" },
  { id: "data-sort-menu", name: "Sort", collection: "Data", description: "One explicit field and direction for predictable collection order.", docsHref: "#product-pilot" },
  { id: "data-group-menu", name: "Group", collection: "Data", description: "A single grouping dimension without turning the toolbar into a query builder.", docsHref: "#product-pilot" },
  { id: "data-density-control", name: "Density", collection: "Data", description: "Compact, default, and comfortable row rhythm as a user preference.", docsHref: "#product-pilot" },
  { id: "data-result-summary", name: "Result Summary", collection: "Data", description: "Visible, filtered, and selected record counts in one quiet status line.", docsHref: "#product-pilot" },
  { id: "bulk-action-bar", name: "Bulk Actions", collection: "Data", description: "Selection-aware actions that stay close to the affected records.", docsHref: "#product-pilot" },
  { id: "row-actions-menu", name: "Row Actions", collection: "Data", description: "Object-specific actions behind one consistently placed table control.", docsHref: "#product-pilot" },
  { id: "cursor-pagination", name: "Cursor Pagination", collection: "Data", description: "Previous and next traversal when total page counts are unknown or unstable.", docsHref: "#product-pilot" },
  { id: "date-range-filter", name: "Date Range", collection: "Data", description: "Preset or exact date boundaries in one small temporary surface.", docsHref: "#product-pilot" },
  { id: "data-export-menu", name: "Export", collection: "Data", description: "Download visible or selected records as CSV or JSON.", docsHref: "#product-pilot" },
  { id: "property-list", name: "Property List", collection: "Data", description: "Dense label-value metadata for inspectors, details, and settings summaries.", docsHref: "#product-pilot" },
  { id: "audit-log", name: "Audit Log", collection: "Data", description: "Chronological product events with actors, targets, time, and optional evidence.", docsHref: "#product-pilot" },
  { id: "data-state", name: "Data State", collection: "Data", description: "Stable loading, empty, and error feedback for any collection surface.", docsHref: "#product-pilot" },
] as const;

export const analyticsLibraryComponents = [
  { id: "metric", name: "Metric", collection: "Analytics", description: "A primary value with just enough trend context to make a decision.", docsHref: "#analytics" },
  { id: "sparkline", name: "Sparkline", collection: "Analytics", description: "A compact direction signal for metrics and table cells.", docsHref: "#analytics" },
  { id: "chart", name: "Chart", collection: "Analytics", description: "Line, area, bar, and stacked-bar views with keyboard inspection and semantic data.", docsHref: "#analytics" },
  { id: "histogram", name: "Histogram", collection: "Analytics", description: "A binned distribution with exact ranges, counts, and keyboard inspection.", docsHref: "#analytics" },
  { id: "scatter-chart", name: "Scatter", collection: "Analytics", description: "Two continuous measures with nearest-point inspection and a semantic source table.", docsHref: "#analytics" },
  { id: "waterfall-chart", name: "Waterfall", collection: "Analytics", description: "Sequential gains, losses, subtotals, and totals on one running-value contract.", docsHref: "#analytics" },
  { id: "donut-chart", name: "Donut", collection: "Analytics", description: "A part-to-whole view with direct segment inspection.", docsHref: "#analytics" },
  { id: "radar-chart", name: "Radar", collection: "Analytics", description: "A small multi-dimensional comparison with normalized scales and exact values.", docsHref: "#analytics" },
  { id: "gauge", name: "Gauge", collection: "Analytics", description: "One bounded measure with explicit range, current value, and optional target.", docsHref: "#analytics" },
  { id: "sankey-chart", name: "Sankey", collection: "Analytics", description: "A compact flow view with named nodes, inspectable links, and source values.", docsHref: "#analytics" },
  { id: "heatmap", name: "Heatmap", collection: "Analytics", description: "Dense two-dimensional values with pointer and keyboard parity.", docsHref: "#analytics" },
  { id: "comparison", name: "Comparison", collection: "Analytics", description: "Current, previous, and relative change in one compact semantic block.", docsHref: "#analytics" },
  { id: "breakdown", name: "Breakdown", collection: "Analytics", description: "A ranked dimension with visible values and restrained proportional context.", docsHref: "#analytics" },
  { id: "goal", name: "Goal", collection: "Analytics", description: "Progress toward one named target with readable actual and target values.", docsHref: "#analytics" },
  { id: "funnel", name: "Funnel", collection: "Analytics", description: "Ordered stage volume with explicit adjacent conversion.", docsHref: "#analytics" },
  { id: "cohort", name: "Cohort", collection: "Analytics", description: "Retention by start group and elapsed period with text in every cell.", docsHref: "#analytics" },
  { id: "timeline", name: "Timeline", collection: "Analytics", description: "Dated product events that can control one stable analytic selection.", docsHref: "#analytics" },
] as const;

export type DataLibraryComponentId = (typeof dataLibraryComponents)[number]["id"];
export type AnalyticsLibraryComponentId = (typeof analyticsLibraryComponents)[number]["id"];
export type CollectionLibraryComponentId = DataLibraryComponentId | AnalyticsLibraryComponentId;
export type PublicLibraryItemId = ComponentId | CollectionLibraryComponentId;

export type PublicLibraryItem = {
  id: PublicLibraryItemId;
  name: string;
  collection: LibraryCollection;
  description: string;
  group?: LibraryComponentGroup;
  docsHref: string;
};

export const publicLibraryItems: readonly PublicLibraryItem[] = [
  ...libraryComponents.map((component) => ({
    ...component,
    collection: "Core" as const,
    docsHref: `#${component.id}`,
  })),
  ...dataLibraryComponents,
  ...analyticsLibraryComponents,
];

export function getPublicLibraryItem(id: string | null | undefined): PublicLibraryItem | undefined {
  return publicLibraryItems.find((item) => item.id === id);
}
