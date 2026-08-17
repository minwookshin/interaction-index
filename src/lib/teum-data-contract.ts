export type TeumDataComponentContract = {
  id: string;
  intent: string;
  useWhen: readonly string[];
  avoidWhen: readonly string[];
  requires: readonly string[];
  states: readonly string[];
  compositionRules: readonly string[];
  accessibility: readonly string[];
};

export const teumDataComponentContracts = [
  {
    id: "data-table",
    intent: "Compare and act on structured records without hiding the underlying table semantics.",
    useWhen: ["Rows share comparable attributes.", "Sorting, selection, or bounded pagination supports a real task."],
    avoidWhen: ["Records have no meaningful shared columns.", "A short list or cards communicate the content more directly."],
    requires: ["Stable row ids", "Human-readable row labels", "Column labels", "Loading, fetching, empty, and error copy"],
    states: ["default", "sorted", "selected", "resized", "pinned", "loading", "fetching", "empty", "error", "virtualized"],
    compositionRules: ["Search and filters sit outside the table model.", "Server mode receives already processed rows and a total count.", "Column resizing commits on end.", "Bulk actions appear only after selection.", "Details preserve the selected row identity."],
    accessibility: ["Use semantic table markup.", "Give selection controls record-specific names.", "Expose sort direction with aria-sort.", "Expose resize handles as keyboard-operable separators.", "Virtual rows preserve total row count and row indexes."],
  },
  {
    id: "filter-builder",
    intent: "Turn a small set of categorical conditions into visible, removable query clauses.",
    useWhen: ["People need to combine a few known fields.", "Every active condition should remain visible."],
    avoidWhen: ["The query language is free-form or deeply nested.", "One select can express the whole choice."],
    requires: ["Field labels", "Finite values", "A controlled filter state"],
    states: ["empty", "editing", "active", "duplicate replacement", "cleared"],
    compositionRules: ["Keep active clauses next to the trigger.", "Replace an identical field/operator pair instead of duplicating it.", "Do not hide active filters inside the flyout."],
    accessibility: ["Announce additions and removals.", "Keep the trigger available after a clause is added.", "Return focus to the trigger when the flyout closes."],
  },
  {
    id: "data-toolbar",
    intent: "Keep view, search, filter, and display controls in one compact product boundary.",
    useWhen: ["Several controls operate on the same collection."],
    avoidWhen: ["A single search field is the only collection control."],
    requires: ["A primary collection label", "Start and end control groups"],
    states: ["default", "wrapped", "active query"],
    compositionRules: ["Task controls precede display controls.", "The toolbar may wrap without changing control order.", "Keyboard hints never shrink or wrap."],
    accessibility: ["Label the toolbar by collection task.", "Preserve DOM order when the toolbar wraps."],
  },
  {
    id: "bulk-action-bar",
    intent: "Expose actions that apply to the current selection without moving the collection.",
    useWhen: ["Two or more records can receive the same reversible action."],
    avoidWhen: ["The action needs record-by-record confirmation.", "Nothing is selected."],
    requires: ["Selection count", "At least one action", "A clear-selection path"],
    states: ["hidden", "visible", "busy", "error"],
    compositionRules: ["Overlay or reserve space so the table does not jump.", "Place destructive actions after neutral actions.", "Use Undo for reversible completion."],
    accessibility: ["Announce the selection count.", "Keep focus stable after an action.", "Give clear-selection an explicit label."],
  },
  {
    id: "date-range-filter",
    intent: "Apply an optional start and end boundary without hiding the active time window.",
    useWhen: ["A collection is meaningfully bounded by one date field.", "Open-ended ranges are valid."],
    avoidWhen: ["The task selects one date rather than filters a collection.", "Time-of-day precision is required."],
    requires: ["A controlled ISO date range", "An explicit apply action", "Clear validation copy"],
    states: ["empty", "draft", "preset", "partial range", "applied", "invalid", "cleared"],
    compositionRules: ["Draft changes do not mutate results until Apply.", "Presets update the draft and remain reversible.", "Keep the applied range in the trigger label."],
    accessibility: ["Both boundaries have visible labels.", "Invalid ordering is described before apply.", "Keyboard users can complete the same preset and custom paths."],
  },
  {
    id: "data-export-menu",
    intent: "Export the visible or selected records through one explicit, inspectable action.",
    useWhen: ["The product can define a truthful exported row scope.", "CSV or JSON supports a real downstream task."],
    avoidWhen: ["The export requires a background job without progress and completion handling.", "Hidden fields would leak sensitive data."],
    requires: ["Explicit export columns", "A file name", "Visible or selected row scope"],
    states: ["disabled", "visible rows", "selected rows", "complete"],
    compositionRules: ["Export only declared columns.", "Keep visible and selected scopes separate.", "Neutralize spreadsheet formula prefixes in CSV output."],
    accessibility: ["Announce the exported row count and format.", "Keep every export option keyboard reachable.", "Do not infer sensitive columns from rendered cells."],
  },
] as const satisfies readonly TeumDataComponentContract[];

export const teumDataViewStateContract = {
  version: 1,
  serverOwned: ["query", "filters", "sorting", "pagination", "dateRange"],
  viewOwned: ["columnVisibility", "columnSizing", "columnPinning", "viewId"],
  transient: ["selection", "resize draft", "fetching status", "open overlays"],
  rules: [
    "URL state and server requests derive from the same validated DataViewState.",
    "Server requests never include column sizing, pinning, or overlay state.",
    "Saved views persist query and display state, but never selection or in-flight work.",
    "Query, filter, sort, and date changes reset pagination to page one.",
    "Unknown URL and storage values are ignored instead of trusted.",
  ],
} as const;

export const issuesWorkspaceContract = {
  id: "issues-workspace",
  intent: "Find, compare, inspect, mutate, and recover work from one shared issue collection.",
  taskSequence: ["Search or filter", "Sort and compare", "Select records", "Inspect one record", "Act", "Undo when needed"],
  components: ["DataToolbar", "SavedViews", "FilterBuilder", "DataTable", "ColumnManager", "BulkActionBar", "SharedDetail", "ActionList", "UndoStack"],
  invariants: [
    "Search, filters, table, details, and actions share one source of truth.",
    "Selection never changes table geometry.",
    "Opening detail preserves the selected row and collection position.",
    "Reversible mutations enter the same undo history.",
    "Keyboard and pointer paths complete the same task.",
  ],
} as const;

export const customerDirectoryContract = {
  id: "customer-directory",
  intent: "Find and compare a server-owned customer collection without losing a shareable view.",
  taskSequence: ["Search or restore a view", "Filter renewals", "Sort the server result", "Resize or hide columns", "Select", "Export"],
  components: ["SearchInput", "SavedViews", "FilterBuilder", "DateRangeFilter", "ColumnManager", "DataExportMenu", "DataTable"],
  invariants: [
    "The URL, saved view, request key, and table controls share one DataViewState.",
    "Server mode never re-sorts or re-paginates the supplied page in the browser.",
    "A personal saved view can be created, updated, deleted, and restored after reload.",
    "Column resizing commits on release and remains keyboard operable.",
    "Exports contain only declared columns from the chosen scope.",
  ],
} as const;

export const auditLogContract = {
  id: "audit-log",
  intent: "Inspect and export a large immutable event collection without rendering every row.",
  taskSequence: ["Choose a date range", "Search or filter", "Compare events", "Scroll", "Export"],
  components: ["SearchInput", "FilterBuilder", "DateRangeFilter", "ColumnManager", "DataExportMenu", "DataTable"],
  invariants: [
    "Virtualization operates on the final filtered and sorted row model.",
    "Semantic table identity and the total row count remain available to assistive technology.",
    "Pinned event and time columns preserve comparison context when the available width requires horizontal scroll.",
    "The audit recipe has no mutation or bulk-action affordance.",
  ],
} as const;

export const teumDataRecipeContracts = [
  issuesWorkspaceContract,
  customerDirectoryContract,
  auditLogContract,
] as const;
