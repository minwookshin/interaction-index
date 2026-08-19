export type WhatiuseDataComponentContract = {
  id: string;
  intent: string;
  useWhen: readonly string[];
  avoidWhen: readonly string[];
  requires: readonly string[];
  states: readonly string[];
  compositionRules: readonly string[];
  accessibility: readonly string[];
};

export const whatiuseDataComponentContracts = [
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
    id: "saved-view-menu",
    intent: "Restore a named query and display state without restoring stale selection or in-flight work.",
    useWhen: ["People repeatedly return to the same collection configuration.", "System and personal views have distinct ownership."],
    avoidWhen: ["Only one view exists.", "The saved object is a report or dashboard rather than collection state."],
    requires: ["Stable view ids", "Visible view names", "Explicit personal-view management callbacks"],
    states: ["system view", "personal view", "selected", "save", "update", "delete"],
    compositionRules: ["Persist query and display state, never transient selection.", "Keep system views immutable.", "A deleted current view falls back to a valid system view."],
    accessibility: ["Expose the current view in the trigger name.", "Use one radio group for mutually exclusive views.", "Return focus to the trigger after selection."],
  },
  {
    id: "column-visibility-menu",
    intent: "Let people reduce or restore table columns while protecting required comparison context.",
    useWhen: ["A table has optional columns.", "Horizontal space or task focus changes by person."],
    avoidWhen: ["Every column is essential.", "Hiding columns changes the meaning of exported data without disclosure."],
    requires: ["Stable column ids", "Human labels", "Required-column flags"],
    states: ["all visible", "partially visible", "required", "reset sizing"],
    compositionRules: ["Keep at least one meaningful identity column visible.", "Visibility does not mutate source data.", "Persist the preference separately from server query state."],
    accessibility: ["Announce the visible-column count in the trigger.", "Required columns remain disabled and named.", "Checkbox state mirrors the rendered table."],
  },
  {
    id: "facet-filter",
    intent: "Filter by several values from one small enumerable dimension with visible selection count.",
    useWhen: ["The dimension has a short finite value set.", "Selecting several values is meaningful."],
    avoidWhen: ["Values are free-form or high-cardinality.", "A single choice changes context rather than filters records."],
    requires: ["Stable option values", "Labels", "Controlled selected values"],
    states: ["any", "selected", "disabled option", "cleared"],
    compositionRules: ["Counts are supporting metadata, not disabled-state logic.", "Selection order never changes the query meaning.", "Clear removes only this facet."],
    accessibility: ["Use menu checkbox semantics.", "Keep the menu open for consecutive choices.", "Name the trigger with the selected count."],
  },
  {
    id: "data-sort-menu",
    intent: "Choose one explicit collection order with a visible direction.",
    useWhen: ["A primary sort determines how people scan the collection.", "The fields have unambiguous ordering."],
    avoidWhen: ["Order is fixed by workflow.", "Several sort clauses are required and need a dedicated builder."],
    requires: ["Sortable field ids", "Field labels", "A controlled field and direction"],
    states: ["default order", "ascending", "descending", "cleared"],
    compositionRules: ["Changing the field preserves the chosen direction.", "Sorting resets page position.", "The trigger states both field and direction."],
    accessibility: ["Use separate radio groups for field and direction.", "Keep keyboard selection equivalent to pointer selection.", "Expose the resolved order in the trigger label."],
  },
  {
    id: "data-group-menu",
    intent: "Partition a collection by one stable dimension while preserving record order inside each group.",
    useWhen: ["One categorical dimension helps scanning.", "Groups remain small enough to compare."],
    avoidWhen: ["Nested pivots or aggregations are required.", "Grouping would hide essential rows by default."],
    requires: ["Groupable field ids", "Labels", "A controlled group id"],
    states: ["ungrouped", "grouped", "cleared"],
    compositionRules: ["Allow one grouping dimension in the compact control.", "Group headings do not replace table headers.", "Clearing grouping restores one continuous collection."],
    accessibility: ["Use one radio group.", "Name the active group in the trigger.", "Keep group labels available in the rendered collection semantics."],
  },
  {
    id: "data-density-control",
    intent: "Change row rhythm without changing information, order, or interaction targets.",
    useWhen: ["The same collection serves scanning and inspection tasks.", "The product can preserve accessible target sizes."],
    avoidWhen: ["Density would hide labels or actions.", "The control changes content rather than presentation."],
    requires: ["Compact, default, and comfortable token sets", "A controlled or persisted preference"],
    states: ["compact", "default", "comfortable"],
    compositionRules: ["Change row and cell rhythm only.", "Do not change column visibility or truncation rules implicitly.", "Persist density as view-owned state."],
    accessibility: ["Use a labelled single-selection control.", "Keep interactive targets at least as large as the documented control minimum.", "Do not encode the active density by motion."],
  },
  {
    id: "data-result-summary",
    intent: "State the visible result, total result, and selection counts without competing with the collection.",
    useWhen: ["Filters can change the visible count.", "Selection needs confirmation outside row checkboxes."],
    avoidWhen: ["The collection has no meaningful total.", "The same count is already announced in an adjacent heading."],
    requires: ["A non-negative total", "Optional filtered and selected counts", "A concrete noun"],
    states: ["total", "filtered", "selected", "with detail"],
    compositionRules: ["Do not repeat unchanged totals.", "Use tabular numerals.", "Supporting detail names the active scope, not the UI mechanism."],
    accessibility: ["Render as an output or status element.", "Keep the text meaningful without punctuation or color.", "Announce controlled count changes politely at the recipe level."],
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
    id: "row-actions-menu",
    intent: "Keep object-specific actions in a stable trailing position without making the whole row interactive.",
    useWhen: ["Several actions apply to exactly one record.", "Permanent row buttons would add noise."],
    avoidWhen: ["One primary action should remain visible.", "The actions apply to the current multi-row selection."],
    requires: ["A record-specific accessible name", "Stable action ids", "Explicit destructive flags"],
    states: ["closed", "open", "disabled action", "destructive action", "complete"],
    compositionRules: ["Place destructive actions last after a separator.", "Do not nest the trigger inside a clickable row.", "Completion affects only the originating record."],
    accessibility: ["Give the icon trigger a record-specific name.", "Reuse menu keyboard behavior.", "Return focus to the row trigger after closing."],
  },
  {
    id: "cursor-pagination",
    intent: "Traverse an ordered server collection when page totals are unknown, expensive, or unstable.",
    useWhen: ["The backend returns previous and next cursors.", "Stable next-page traversal matters more than random page access."],
    avoidWhen: ["People need direct access to known pages.", "Continuous loading preserves the task better."],
    requires: ["Previous and next availability", "Traversal callbacks", "Optional visible range"],
    states: ["first", "middle", "last", "loading"],
    compositionRules: ["Disable traversal while a request is in flight.", "Keep the current result visible while fetching.", "A changed query invalidates old cursors."],
    accessibility: ["Use a labelled navigation landmark.", "Keep previous and next labels explicit.", "Announce the changed range without moving focus."],
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
  {
    id: "property-list",
    intent: "Read stable object metadata as compact label-value relationships.",
    useWhen: ["A detail surface contains several short facts.", "Labels and values need repeatable alignment."],
    avoidWhen: ["Values are editable fields.", "Rows require sorting, selection, or comparison across objects."],
    requires: ["Stable item ids", "A label and value for every item"],
    states: ["one column", "two columns", "supporting description"],
    compositionRules: ["Use definition-list semantics.", "Keep values readable when labels wrap.", "Two columns collapse to one without changing reading order."],
    accessibility: ["Preserve dt and dd relationships.", "Do not use placeholder glyphs for missing values without text.", "Keep descriptions attached to their value."],
  },
  {
    id: "audit-log",
    intent: "Read immutable product events in chronological order with enough evidence to understand each change.",
    useWhen: ["Actors, actions, and timestamps are durable records.", "An event may open supporting evidence."],
    avoidWhen: ["The content is conversational activity.", "Events are mutable tasks rather than an audit trail."],
    requires: ["Stable event ids", "Actor", "Action", "Timestamp"],
    states: ["static", "selectable", "selected", "critical event"],
    compositionRules: ["Keep newest-first or oldest-first order explicit at the recipe level.", "Critical tone accompanies text.", "Selecting an event may open evidence but never mutates the log."],
    accessibility: ["Use ordered-list semantics.", "Keep actor and action as text.", "A selectable event is one button, not several nested targets."],
  },
  {
    id: "data-state",
    intent: "Reserve collection geometry while communicating loading, empty, or failed data.",
    useWhen: ["A table, list, or chart needs one shared state surface."],
    avoidWhen: ["Inline field feedback is sufficient.", "Existing content can remain visible during a background refresh."],
    requires: ["Concrete title", "Recovery or next action when one exists"],
    states: ["loading", "empty", "error"],
    compositionRules: ["Keep the state inside the owning collection frame.", "Background fetching does not replace usable data with loading.", "Error actions describe recovery, not generic dismissal."],
    accessibility: ["Loading and empty use status semantics.", "Errors use alert semantics.", "Icons stay redundant with text."],
  },
] as const satisfies readonly WhatiuseDataComponentContract[];

export const whatiuseDataViewStateContract = {
  version: 1,
  serverOwned: ["query", "filters", "sorting", "grouping", "pagination", "dateRange"],
  viewOwned: ["columnVisibility", "columnSizing", "columnPinning", "density", "viewId"],
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

export const whatiuseDataRecipeContracts = [
  issuesWorkspaceContract,
  customerDirectoryContract,
  auditLogContract,
] as const;
