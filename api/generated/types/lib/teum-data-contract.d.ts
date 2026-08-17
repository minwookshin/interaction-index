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
export declare const teumDataComponentContracts: readonly [{
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
    readonly id: "bulk-action-bar";
    readonly intent: "Expose actions that apply to the current selection without moving the collection.";
    readonly useWhen: readonly ["Two or more records can receive the same reversible action."];
    readonly avoidWhen: readonly ["The action needs record-by-record confirmation.", "Nothing is selected."];
    readonly requires: readonly ["Selection count", "At least one action", "A clear-selection path"];
    readonly states: readonly ["hidden", "visible", "busy", "error"];
    readonly compositionRules: readonly ["Overlay or reserve space so the table does not jump.", "Place destructive actions after neutral actions.", "Use Undo for reversible completion."];
    readonly accessibility: readonly ["Announce the selection count.", "Keep focus stable after an action.", "Give clear-selection an explicit label."];
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
}];
export declare const teumDataViewStateContract: {
    readonly version: 1;
    readonly serverOwned: readonly ["query", "filters", "sorting", "pagination", "dateRange"];
    readonly viewOwned: readonly ["columnVisibility", "columnSizing", "columnPinning", "viewId"];
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
export declare const teumDataRecipeContracts: readonly [{
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
