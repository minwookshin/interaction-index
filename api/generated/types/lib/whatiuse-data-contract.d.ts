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
export declare const whatiuseDataComponentContracts: readonly [{
    readonly id: "data-table";
    readonly intent: "Compare and act on structured records without hiding the underlying table semantics.";
    readonly useWhen: readonly ["Rows share comparable attributes.", "Sorting, selection, or bounded pagination supports a real task."];
    readonly avoidWhen: readonly ["Records have no meaningful shared columns.", "A short list or cards communicate the content more directly."];
    readonly requires: readonly ["Stable row ids", "Human-readable row labels", "Column labels", "Loading, fetching, empty, and error copy"];
    readonly states: readonly ["default", "sorted", "selected", "resized", "pinned", "loading", "fetching", "empty", "error", "virtualized"];
    readonly compositionRules: readonly ["Search and filters sit outside the table model.", "Server mode receives already processed rows and a total count.", "Column resizing commits on end.", "Bulk actions appear only after selection.", "Details preserve the selected row identity."];
    readonly accessibility: readonly ["Use semantic table markup.", "Give selection controls record-specific names.", "Expose sort direction with aria-sort.", "Expose resize handles as keyboard-operable separators.", "Virtual rows preserve total row count and row indexes."];
}, {
    readonly id: "filter-builder";
    readonly intent: "Turn a small set of categorical conditions into visible, removable query clauses.";
    readonly useWhen: readonly ["People need to combine a few known fields.", "Every active condition should remain visible."];
    readonly avoidWhen: readonly ["The query language is free-form or deeply nested.", "One select can express the whole choice."];
    readonly requires: readonly ["Field labels", "Finite values", "A controlled filter state"];
    readonly states: readonly ["empty", "editing", "active", "duplicate replacement", "cleared"];
    readonly compositionRules: readonly ["Keep active clauses next to the trigger.", "Replace an identical field/operator pair instead of duplicating it.", "Do not hide active filters inside the flyout."];
    readonly accessibility: readonly ["Announce additions and removals.", "Keep the trigger available after a clause is added.", "Return focus to the trigger when the flyout closes."];
}, {
    readonly id: "data-toolbar";
    readonly intent: "Keep view, search, filter, and display controls in one compact product boundary.";
    readonly useWhen: readonly ["Several controls operate on the same collection."];
    readonly avoidWhen: readonly ["A single search field is the only collection control."];
    readonly requires: readonly ["A primary collection label", "Start and end control groups"];
    readonly states: readonly ["default", "wrapped", "active query"];
    readonly compositionRules: readonly ["Task controls precede display controls.", "The toolbar may wrap without changing control order.", "Keyboard hints never shrink or wrap."];
    readonly accessibility: readonly ["Label the toolbar by collection task.", "Preserve DOM order when the toolbar wraps."];
}, {
    readonly id: "saved-view-menu";
    readonly intent: "Restore a named query and display state without restoring stale selection or in-flight work.";
    readonly useWhen: readonly ["People repeatedly return to the same collection configuration.", "System and personal views have distinct ownership."];
    readonly avoidWhen: readonly ["Only one view exists.", "The saved object is a report or dashboard rather than collection state."];
    readonly requires: readonly ["Stable view ids", "Visible view names", "Explicit personal-view management callbacks"];
    readonly states: readonly ["system view", "personal view", "selected", "save", "update", "delete"];
    readonly compositionRules: readonly ["Persist query and display state, never transient selection.", "Keep system views immutable.", "A deleted current view falls back to a valid system view."];
    readonly accessibility: readonly ["Expose the current view in the trigger name.", "Use one radio group for mutually exclusive views.", "Return focus to the trigger after selection."];
}, {
    readonly id: "column-visibility-menu";
    readonly intent: "Let people reduce or restore table columns while protecting required comparison context.";
    readonly useWhen: readonly ["A table has optional columns.", "Horizontal space or task focus changes by person."];
    readonly avoidWhen: readonly ["Every column is essential.", "Hiding columns changes the meaning of exported data without disclosure."];
    readonly requires: readonly ["Stable column ids", "Human labels", "Required-column flags"];
    readonly states: readonly ["all visible", "partially visible", "required", "reset sizing"];
    readonly compositionRules: readonly ["Keep at least one meaningful identity column visible.", "Visibility does not mutate source data.", "Persist the preference separately from server query state."];
    readonly accessibility: readonly ["Announce the visible-column count in the trigger.", "Required columns remain disabled and named.", "Checkbox state mirrors the rendered table."];
}, {
    readonly id: "facet-filter";
    readonly intent: "Filter by several values from one small enumerable dimension with visible selection count.";
    readonly useWhen: readonly ["The dimension has a short finite value set.", "Selecting several values is meaningful."];
    readonly avoidWhen: readonly ["Values are free-form or high-cardinality.", "A single choice changes context rather than filters records."];
    readonly requires: readonly ["Stable option values", "Labels", "Controlled selected values"];
    readonly states: readonly ["any", "selected", "disabled option", "cleared"];
    readonly compositionRules: readonly ["Counts are supporting metadata, not disabled-state logic.", "Selection order never changes the query meaning.", "Clear removes only this facet."];
    readonly accessibility: readonly ["Use menu checkbox semantics.", "Keep the menu open for consecutive choices.", "Name the trigger with the selected count."];
}, {
    readonly id: "data-sort-menu";
    readonly intent: "Choose one explicit collection order with a visible direction.";
    readonly useWhen: readonly ["A primary sort determines how people scan the collection.", "The fields have unambiguous ordering."];
    readonly avoidWhen: readonly ["Order is fixed by workflow.", "Several sort clauses are required and need a dedicated builder."];
    readonly requires: readonly ["Sortable field ids", "Field labels", "A controlled field and direction"];
    readonly states: readonly ["default order", "ascending", "descending", "cleared"];
    readonly compositionRules: readonly ["Changing the field preserves the chosen direction.", "Sorting resets page position.", "The trigger states both field and direction."];
    readonly accessibility: readonly ["Use separate radio groups for field and direction.", "Keep keyboard selection equivalent to pointer selection.", "Expose the resolved order in the trigger label."];
}, {
    readonly id: "data-group-menu";
    readonly intent: "Partition a collection by one stable dimension while preserving record order inside each group.";
    readonly useWhen: readonly ["One categorical dimension helps scanning.", "Groups remain small enough to compare."];
    readonly avoidWhen: readonly ["Nested pivots or aggregations are required.", "Grouping would hide essential rows by default."];
    readonly requires: readonly ["Groupable field ids", "Labels", "A controlled group id"];
    readonly states: readonly ["ungrouped", "grouped", "cleared"];
    readonly compositionRules: readonly ["Allow one grouping dimension in the compact control.", "Group headings do not replace table headers.", "Clearing grouping restores one continuous collection."];
    readonly accessibility: readonly ["Use one radio group.", "Name the active group in the trigger.", "Keep group labels available in the rendered collection semantics."];
}, {
    readonly id: "data-density-control";
    readonly intent: "Change row rhythm without changing information, order, or interaction targets.";
    readonly useWhen: readonly ["The same collection serves scanning and inspection tasks.", "The product can preserve accessible target sizes."];
    readonly avoidWhen: readonly ["Density would hide labels or actions.", "The control changes content rather than presentation."];
    readonly requires: readonly ["Compact, default, and comfortable token sets", "A controlled or persisted preference"];
    readonly states: readonly ["compact", "default", "comfortable"];
    readonly compositionRules: readonly ["Change row and cell rhythm only.", "Do not change column visibility or truncation rules implicitly.", "Persist density as view-owned state."];
    readonly accessibility: readonly ["Use a labelled single-selection control.", "Keep interactive targets at least as large as the documented control minimum.", "Do not encode the active density by motion."];
}, {
    readonly id: "data-result-summary";
    readonly intent: "State the visible result, total result, and selection counts without competing with the collection.";
    readonly useWhen: readonly ["Filters can change the visible count.", "Selection needs confirmation outside row checkboxes."];
    readonly avoidWhen: readonly ["The collection has no meaningful total.", "The same count is already announced in an adjacent heading."];
    readonly requires: readonly ["A non-negative total", "Optional filtered and selected counts", "A concrete noun"];
    readonly states: readonly ["total", "filtered", "selected", "with detail"];
    readonly compositionRules: readonly ["Do not repeat unchanged totals.", "Use tabular numerals.", "Supporting detail names the active scope, not the UI mechanism."];
    readonly accessibility: readonly ["Render as an output or status element.", "Keep the text meaningful without punctuation or color.", "Announce controlled count changes politely at the recipe level."];
}, {
    readonly id: "bulk-action-bar";
    readonly intent: "Expose actions that apply to the current selection without moving the collection.";
    readonly useWhen: readonly ["Two or more records can receive the same reversible action."];
    readonly avoidWhen: readonly ["The action needs record-by-record confirmation.", "Nothing is selected."];
    readonly requires: readonly ["Selection count", "At least one action", "A clear-selection path"];
    readonly states: readonly ["hidden", "visible", "busy", "error"];
    readonly compositionRules: readonly ["Overlay or reserve space so the table does not jump.", "Place destructive actions after neutral actions.", "Use Undo for reversible completion."];
    readonly accessibility: readonly ["Announce the selection count.", "Keep focus stable after an action.", "Give clear-selection an explicit label."];
}, {
    readonly id: "row-actions-menu";
    readonly intent: "Keep object-specific actions in a stable trailing position without making the whole row interactive.";
    readonly useWhen: readonly ["Several actions apply to exactly one record.", "Permanent row buttons would add noise."];
    readonly avoidWhen: readonly ["One primary action should remain visible.", "The actions apply to the current multi-row selection."];
    readonly requires: readonly ["A record-specific accessible name", "Stable action ids", "Explicit destructive flags"];
    readonly states: readonly ["closed", "open", "disabled action", "destructive action", "complete"];
    readonly compositionRules: readonly ["Place destructive actions last after a separator.", "Do not nest the trigger inside a clickable row.", "Completion affects only the originating record."];
    readonly accessibility: readonly ["Give the icon trigger a record-specific name.", "Reuse menu keyboard behavior.", "Return focus to the row trigger after closing."];
}, {
    readonly id: "cursor-pagination";
    readonly intent: "Traverse an ordered server collection when page totals are unknown, expensive, or unstable.";
    readonly useWhen: readonly ["The backend returns previous and next cursors.", "Stable next-page traversal matters more than random page access."];
    readonly avoidWhen: readonly ["People need direct access to known pages.", "Continuous loading preserves the task better."];
    readonly requires: readonly ["Previous and next availability", "Traversal callbacks", "Optional visible range"];
    readonly states: readonly ["first", "middle", "last", "loading"];
    readonly compositionRules: readonly ["Disable traversal while a request is in flight.", "Keep the current result visible while fetching.", "A changed query invalidates old cursors."];
    readonly accessibility: readonly ["Use a labelled navigation landmark.", "Keep previous and next labels explicit.", "Announce the changed range without moving focus."];
}, {
    readonly id: "date-range-filter";
    readonly intent: "Apply an optional start and end boundary without hiding the active time window.";
    readonly useWhen: readonly ["A collection is meaningfully bounded by one date field.", "Open-ended ranges are valid."];
    readonly avoidWhen: readonly ["The task selects one date rather than filters a collection.", "Time-of-day precision is required."];
    readonly requires: readonly ["A controlled ISO date range", "An explicit apply action", "Clear validation copy"];
    readonly states: readonly ["empty", "draft", "preset", "partial range", "applied", "invalid", "cleared"];
    readonly compositionRules: readonly ["Draft changes do not mutate results until Apply.", "Presets update the draft and remain reversible.", "Keep the applied range in the trigger label."];
    readonly accessibility: readonly ["Both boundaries have visible labels.", "Invalid ordering is described before apply.", "Keyboard users can complete the same preset and custom paths."];
}, {
    readonly id: "data-export-menu";
    readonly intent: "Export the visible or selected records through one explicit, inspectable action.";
    readonly useWhen: readonly ["The product can define a truthful exported row scope.", "CSV or JSON supports a real downstream task."];
    readonly avoidWhen: readonly ["The export requires a background job without progress and completion handling.", "Hidden fields would leak sensitive data."];
    readonly requires: readonly ["Explicit export columns", "A file name", "Visible or selected row scope"];
    readonly states: readonly ["disabled", "visible rows", "selected rows", "complete"];
    readonly compositionRules: readonly ["Export only declared columns.", "Keep visible and selected scopes separate.", "Neutralize spreadsheet formula prefixes in CSV output."];
    readonly accessibility: readonly ["Announce the exported row count and format.", "Keep every export option keyboard reachable.", "Do not infer sensitive columns from rendered cells."];
}, {
    readonly id: "property-list";
    readonly intent: "Read stable object metadata as compact label-value relationships.";
    readonly useWhen: readonly ["A detail surface contains several short facts.", "Labels and values need repeatable alignment."];
    readonly avoidWhen: readonly ["Values are editable fields.", "Rows require sorting, selection, or comparison across objects."];
    readonly requires: readonly ["Stable item ids", "A label and value for every item"];
    readonly states: readonly ["one column", "two columns", "supporting description"];
    readonly compositionRules: readonly ["Use definition-list semantics.", "Keep values readable when labels wrap.", "Two columns collapse to one without changing reading order."];
    readonly accessibility: readonly ["Preserve dt and dd relationships.", "Do not use placeholder glyphs for missing values without text.", "Keep descriptions attached to their value."];
}, {
    readonly id: "audit-log";
    readonly intent: "Read immutable product events in chronological order with enough evidence to understand each change.";
    readonly useWhen: readonly ["Actors, actions, and timestamps are durable records.", "An event may open supporting evidence."];
    readonly avoidWhen: readonly ["The content is conversational activity.", "Events are mutable tasks rather than an audit trail."];
    readonly requires: readonly ["Stable event ids", "Actor", "Action", "Timestamp"];
    readonly states: readonly ["static", "selectable", "selected", "critical event"];
    readonly compositionRules: readonly ["Keep newest-first or oldest-first order explicit at the recipe level.", "Critical tone accompanies text.", "Selecting an event may open evidence but never mutates the log."];
    readonly accessibility: readonly ["Use ordered-list semantics.", "Keep actor and action as text.", "A selectable event is one button, not several nested targets."];
}, {
    readonly id: "data-state";
    readonly intent: "Reserve collection geometry while communicating loading, empty, or failed data.";
    readonly useWhen: readonly ["A table, list, or chart needs one shared state surface."];
    readonly avoidWhen: readonly ["Inline field feedback is sufficient.", "Existing content can remain visible during a background refresh."];
    readonly requires: readonly ["Concrete title", "Recovery or next action when one exists"];
    readonly states: readonly ["loading", "empty", "error"];
    readonly compositionRules: readonly ["Keep the state inside the owning collection frame.", "Background fetching does not replace usable data with loading.", "Error actions describe recovery, not generic dismissal."];
    readonly accessibility: readonly ["Loading and empty use status semantics.", "Errors use alert semantics.", "Icons stay redundant with text."];
}];
export declare const whatiuseDataViewStateContract: {
    readonly version: 1;
    readonly serverOwned: readonly ["query", "filters", "sorting", "grouping", "pagination", "dateRange"];
    readonly viewOwned: readonly ["columnVisibility", "columnSizing", "columnPinning", "density", "viewId"];
    readonly transient: readonly ["selection", "resize draft", "fetching status", "open overlays"];
    readonly rules: readonly ["URL state and server requests derive from the same validated DataViewState.", "Server requests never include column sizing, pinning, or overlay state.", "Saved views persist query and display state, but never selection or in-flight work.", "Query, filter, sort, and date changes reset pagination to page one.", "Unknown URL and storage values are ignored instead of trusted."];
};
export declare const issuesWorkspaceContract: {
    readonly id: "issues-workspace";
    readonly intent: "Find, compare, inspect, mutate, and recover work from one shared issue collection.";
    readonly taskSequence: readonly ["Search or filter", "Sort and compare", "Select records", "Inspect one record", "Act", "Undo when needed"];
    readonly components: readonly ["DataToolbar", "SavedViews", "FilterBuilder", "DataTable", "ColumnManager", "BulkActionBar", "SharedDetail", "ActionList", "UndoStack"];
    readonly invariants: readonly ["Search, filters, table, details, and actions share one source of truth.", "Selection never changes table geometry.", "Opening detail preserves the selected row and collection position.", "Reversible mutations enter the same undo history.", "Keyboard and pointer paths complete the same task."];
};
export declare const customerDirectoryContract: {
    readonly id: "customer-directory";
    readonly intent: "Find and compare a server-owned customer collection without losing a shareable view.";
    readonly taskSequence: readonly ["Search or restore a view", "Filter renewals", "Sort the server result", "Resize or hide columns", "Select", "Export"];
    readonly components: readonly ["SearchInput", "SavedViews", "FilterBuilder", "DateRangeFilter", "ColumnManager", "DataExportMenu", "DataTable"];
    readonly invariants: readonly ["The URL, saved view, request key, and table controls share one DataViewState.", "Server mode never re-sorts or re-paginates the supplied page in the browser.", "A personal saved view can be created, updated, deleted, and restored after reload.", "Column resizing commits on release and remains keyboard operable.", "Exports contain only declared columns from the chosen scope."];
};
export declare const auditLogContract: {
    readonly id: "audit-log";
    readonly intent: "Inspect and export a large immutable event collection without rendering every row.";
    readonly taskSequence: readonly ["Choose a date range", "Search or filter", "Compare events", "Scroll", "Export"];
    readonly components: readonly ["SearchInput", "FilterBuilder", "DateRangeFilter", "ColumnManager", "DataExportMenu", "DataTable"];
    readonly invariants: readonly ["Virtualization operates on the final filtered and sorted row model.", "Semantic table identity and the total row count remain available to assistive technology.", "Pinned event and time columns preserve comparison context when the available width requires horizontal scroll.", "The audit recipe has no mutation or bulk-action affordance."];
};
export declare const whatiuseDataRecipeContracts: readonly [{
    readonly id: "issues-workspace";
    readonly intent: "Find, compare, inspect, mutate, and recover work from one shared issue collection.";
    readonly taskSequence: readonly ["Search or filter", "Sort and compare", "Select records", "Inspect one record", "Act", "Undo when needed"];
    readonly components: readonly ["DataToolbar", "SavedViews", "FilterBuilder", "DataTable", "ColumnManager", "BulkActionBar", "SharedDetail", "ActionList", "UndoStack"];
    readonly invariants: readonly ["Search, filters, table, details, and actions share one source of truth.", "Selection never changes table geometry.", "Opening detail preserves the selected row and collection position.", "Reversible mutations enter the same undo history.", "Keyboard and pointer paths complete the same task."];
}, {
    readonly id: "customer-directory";
    readonly intent: "Find and compare a server-owned customer collection without losing a shareable view.";
    readonly taskSequence: readonly ["Search or restore a view", "Filter renewals", "Sort the server result", "Resize or hide columns", "Select", "Export"];
    readonly components: readonly ["SearchInput", "SavedViews", "FilterBuilder", "DateRangeFilter", "ColumnManager", "DataExportMenu", "DataTable"];
    readonly invariants: readonly ["The URL, saved view, request key, and table controls share one DataViewState.", "Server mode never re-sorts or re-paginates the supplied page in the browser.", "A personal saved view can be created, updated, deleted, and restored after reload.", "Column resizing commits on release and remains keyboard operable.", "Exports contain only declared columns from the chosen scope."];
}, {
    readonly id: "audit-log";
    readonly intent: "Inspect and export a large immutable event collection without rendering every row.";
    readonly taskSequence: readonly ["Choose a date range", "Search or filter", "Compare events", "Scroll", "Export"];
    readonly components: readonly ["SearchInput", "FilterBuilder", "DateRangeFilter", "ColumnManager", "DataExportMenu", "DataTable"];
    readonly invariants: readonly ["Virtualization operates on the final filtered and sorted row model.", "Semantic table identity and the total row count remain available to assistive technology.", "Pinned event and time columns preserve comparison context when the available width requires horizontal scroll.", "The audit recipe has no mutation or bulk-action affordance."];
}];
