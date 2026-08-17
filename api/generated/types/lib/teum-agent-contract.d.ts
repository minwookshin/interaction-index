export type TeumAgentRecipeId = "issues-workspace" | "customer-directory" | "audit-log" | "saas-overview" | "product-usage" | "conversion-retention" | "customer-workspace" | "billing-usage" | "members-permissions";
export type TeumAgentRecipeContract = {
    id: TeumAgentRecipeId;
    title: string;
    domain: "data" | "analytics" | "product";
    intent: string;
    signals: readonly string[];
    registryItem: "teum-data" | "teum-analytics" | "teum-product-patterns";
    modulePath: string;
    exportName: string;
    components: readonly string[];
    state: readonly string[];
    rules: readonly string[];
    forbidden: readonly string[];
};
export type TeumAgentSelectionRule = {
    task: string;
    choose: string;
    insteadOf: readonly string[];
    when: readonly string[];
    rejectWhen: readonly string[];
};
export type TeumAgentPlan = {
    recipe: TeumAgentRecipeContract;
    score: number;
    matchedSignals: readonly string[];
};
export declare const teumAgentRecipeContracts: readonly [{
    readonly id: "issues-workspace";
    readonly title: "Issues Workspace";
    readonly domain: "data";
    readonly intent: "Triage, inspect, mutate, and recover issue work from one shared collection.";
    readonly signals: readonly ["issue triage", "issue backlog", "bulk close", "bulk assign", "undo issue", "issue workspace"];
    readonly registryItem: "teum-data";
    readonly modulePath: "components/patterns/issues-workspace";
    readonly exportName: "IssuesWorkspace";
    readonly components: readonly ["DataToolbar", "SavedViews", "FilterBuilder", "DataTable", "ColumnManager", "BulkActionBar", "SharedDetail", "ActionList", "UndoStack"];
    readonly state: readonly ["shareable query and filters", "stable row selection", "transient detail", "reversible mutation history"];
    readonly rules: readonly ["Keep the collection visible while detail opens.", "Use one selection source for table, detail, and bulk actions.", "Route reversible mutations through Undo Stack."];
    readonly forbidden: readonly ["Do not replace the collection with a detail route.", "Do not stack a new toast for each mutation.", "Do not clear selection before recovery finishes."];
}, {
    readonly id: "customer-directory";
    readonly title: "Customer Directory";
    readonly domain: "data";
    readonly intent: "Search, filter, save, share, and export a server-owned customer collection.";
    readonly signals: readonly ["customer directory", "renewal list", "customer export", "saved customer view", "server customer list", "customer table"];
    readonly registryItem: "teum-data";
    readonly modulePath: "components/patterns/data-recipes";
    readonly exportName: "CustomerDirectoryRecipe";
    readonly components: readonly ["SearchInput", "SavedViews", "FilterBuilder", "DateRangeFilter", "ColumnManager", "DataExportMenu", "DataTable"];
    readonly state: readonly ["URL-backed DataViewState", "server-owned rows", "persisted saved views", "transient selection"];
    readonly rules: readonly ["Derive the URL and request key from the same validated state.", "Keep column display state out of server requests.", "Export only declared columns from an explicit scope."];
    readonly forbidden: readonly ["Do not re-sort server-owned rows in the browser.", "Do not persist row selection.", "Do not export hidden sensitive fields."];
}, {
    readonly id: "audit-log";
    readonly title: "Audit Log";
    readonly domain: "data";
    readonly intent: "Inspect a large immutable event stream with date bounds, virtualization, and safe export.";
    readonly signals: readonly ["audit log", "security events", "immutable events", "compliance log", "event export", "activity audit"];
    readonly registryItem: "teum-data";
    readonly modulePath: "components/patterns/data-recipes";
    readonly exportName: "AuditLogRecipe";
    readonly components: readonly ["SearchInput", "FilterBuilder", "DateRangeFilter", "ColumnManager", "DataExportMenu", "DataTable"];
    readonly state: readonly ["shareable date and filters", "virtualized final row model", "immutable records"];
    readonly rules: readonly ["Virtualize the final filtered row model.", "Preserve semantic row count and indexes.", "Keep event and time context available during horizontal scroll."];
    readonly forbidden: readonly ["Do not expose mutation or bulk actions.", "Do not render every event at once.", "Do not treat visual row position as record identity."];
}, {
    readonly id: "saas-overview";
    readonly title: "SaaS Overview";
    readonly domain: "analytics";
    readonly intent: "Review recurring revenue, growth, targets, and expansion drivers in one period.";
    readonly signals: readonly ["mrr", "arr", "revenue overview", "recurring revenue", "expansion revenue", "revenue target"];
    readonly registryItem: "teum-analytics";
    readonly modulePath: "components/patterns/analytics-recipes";
    readonly exportName: "SaaSOverviewRecipe";
    readonly components: readonly ["Metric", "Sparkline", "Chart", "Comparison", "Goal", "Breakdown"];
    readonly state: readonly ["shared date range", "comparison period", "active chart datum"];
    readonly rules: readonly ["Use one date range and metric definition across every value.", "Keep current and previous periods comparable.", "Keep a semantic data table with the chart."];
    readonly forbidden: readonly ["Do not show a trend without naming its period.", "Do not encode direction with color alone.", "Do not turn every metric into an unrelated card."];
}, {
    readonly id: "product-usage";
    readonly title: "Product Usage";
    readonly domain: "analytics";
    readonly intent: "Connect active usage, feature adoption, and release events across synchronized views.";
    readonly signals: readonly ["product usage", "feature adoption", "active usage", "release event", "usage trend", "feature breakdown"];
    readonly registryItem: "teum-analytics";
    readonly modulePath: "components/patterns/analytics-recipes";
    readonly exportName: "ProductUsageRecipe";
    readonly components: readonly ["Metric", "Chart", "Breakdown", "Timeline"];
    readonly state: readonly ["shared active index", "visible series", "selected release"];
    readonly rules: readonly ["Synchronize charts through one active index.", "Keep date order stable when series are filtered.", "Map each release to one stable annotation."];
    readonly forbidden: readonly ["Do not give synchronized charts separate pointer state.", "Do not remove textual values when a series is hidden.", "Do not animate high-frequency inspection."];
}, {
    readonly id: "conversion-retention";
    readonly title: "Conversion & Retention";
    readonly domain: "analytics";
    readonly intent: "Trace ordered conversion stages and compare retained behavior by cohort.";
    readonly signals: readonly ["conversion funnel", "retention cohort", "activation funnel", "cohort retention", "signup conversion", "conversion retention"];
    readonly registryItem: "teum-analytics";
    readonly modulePath: "components/patterns/analytics-recipes";
    readonly exportName: "ConversionRetentionRecipe";
    readonly components: readonly ["Metric", "Funnel", "Chart", "Cohort", "DataTable"];
    readonly state: readonly ["selected funnel stage", "active trend datum", "supporting records"];
    readonly rules: readonly ["Keep funnel stages strictly ordered.", "Connect the selected stage to trend and supporting records.", "Expose every cohort value as text."];
    readonly forbidden: readonly ["Do not use a funnel for independent categories.", "Do not infer missing cohort values as zero.", "Do not make color the only retention encoding."];
}, {
    readonly id: "customer-workspace";
    readonly title: "Customer Workspace";
    readonly domain: "product";
    readonly intent: "Find an account, inspect health and activity, and complete a follow-up without losing the list.";
    readonly signals: readonly ["customer health", "account follow-up", "customer success workspace", "account health", "customer activity", "customer success"];
    readonly registryItem: "teum-product-patterns";
    readonly modulePath: "components/patterns/product-pattern-recipes";
    readonly exportName: "CustomerWorkspaceRecipe";
    readonly components: readonly ["DataToolbar", "SearchInput", "FilterBuilder", "SharedDetail", "Tabs", "Metric", "Progress", "Timeline", "Button", "Toast"];
    readonly state: readonly ["shareable customer filters", "selected customer", "transient detail tab", "follow-up feedback"];
    readonly rules: readonly ["Anchor detail to the selected customer row.", "Use one customer record for health, owner, plan, and renewal context.", "Return focus to the customer origin when detail closes."];
    readonly forbidden: readonly ["Do not reorder the list after a follow-up.", "Do not encode health by tone alone.", "Do not split account activity into an unrelated page."];
}, {
    readonly id: "billing-usage";
    readonly title: "Billing & Usage";
    readonly domain: "product";
    readonly intent: "Compare plan, usage, limits, and invoices before changing a subscription.";
    readonly signals: readonly ["billing usage", "plan limit", "invoice", "subscription", "payment failure", "usage limit"];
    readonly registryItem: "teum-product-patterns";
    readonly modulePath: "components/patterns/product-pattern-recipes";
    readonly exportName: "BillingUsageRecipe";
    readonly components: readonly ["SegmentedControl", "Metric", "Sparkline", "Chart", "Progress", "Alert", "DataTable", "Dialog", "Button", "Toast"];
    readonly state: readonly ["shared billing period", "persisted plan and limits", "active invoice", "plan review"];
    readonly rules: readonly ["Use the same billing period across metrics, chart, limits, and invoices.", "Keep exact consumed and allowed values visible.", "Review a plan change before committing it."];
    readonly forbidden: readonly ["Do not change a plan from a transient menu action.", "Do not hide payment risk behind color.", "Do not lose the billing period when an invoice opens."];
}, {
    readonly id: "members-permissions";
    readonly title: "Members & Permissions";
    readonly domain: "product";
    readonly intent: "Invite people, change roles, and audit access policy in one task.";
    readonly signals: readonly ["members permissions", "invite member", "role permissions", "access policy", "workspace roles", "permission matrix"];
    readonly registryItem: "teum-product-patterns";
    readonly modulePath: "components/patterns/product-pattern-recipes";
    readonly exportName: "MembersPermissionsRecipe";
    readonly components: readonly ["Tabs", "DataToolbar", "SearchInput", "FilterBuilder", "DataTable", "Select", "Badge", "Checkbox", "Dialog", "TextField", "Toast"];
    readonly state: readonly ["shareable member query", "persisted roles and grants", "invite draft", "pending role change"];
    readonly rules: readonly ["Show one role and invitation status per member.", "Name the member in each role control.", "Protect the last owner before a role mutation."];
    readonly forbidden: readonly ["Do not demote the last owner.", "Do not apply a permission change to an ambiguous selection.", "Do not reset filters when switching membership and role views."];
}];
export declare const teumAgentSelectionRules: readonly [{
    readonly task: "Choose one submitted value";
    readonly choose: "Select";
    readonly insteadOf: readonly ["Combobox", "ContextSwitcher"];
    readonly when: readonly ["The values are short and predefined."];
    readonly rejectWhen: readonly ["The list needs filtering.", "The surrounding product context changes."];
}, {
    readonly task: "Filter a large predefined list";
    readonly choose: "Combobox";
    readonly insteadOf: readonly ["Select", "SearchInput"];
    readonly when: readonly ["A known option must be selected after search."];
    readonly rejectWhen: readonly ["Free-form text is valid.", "The choice changes workspace context."];
}, {
    readonly task: "Change workspace or environment";
    readonly choose: "ContextSwitcher";
    readonly insteadOf: readonly ["Select", "Menu"];
    readonly when: readonly ["The selection changes the surrounding product context."];
    readonly rejectWhen: readonly ["The value is an ordinary form field."];
}, {
    readonly task: "Run compact contextual actions";
    readonly choose: "Menu";
    readonly insteadOf: readonly ["ActionList", "Popover"];
    readonly when: readonly ["The anchored action set is short."];
    readonly rejectWhen: readonly ["Actions need search or cross-product discovery.", "Interactive settings must remain open."];
}, {
    readonly task: "Search and run many actions";
    readonly choose: "ActionList";
    readonly insteadOf: readonly ["Menu"];
    readonly when: readonly ["The workflow is keyboard-first and the action set is large."];
    readonly rejectWhen: readonly ["The set is a small anchored menu."];
}, {
    readonly task: "Keep compact controls beside an origin";
    readonly choose: "Popover";
    readonly insteadOf: readonly ["Dialog", "Tooltip"];
    readonly when: readonly ["The controls are optional and contextual."];
    readonly rejectWhen: readonly ["The task traps focus.", "The content is only a label."];
}, {
    readonly task: "Complete a focused task";
    readonly choose: "Dialog";
    readonly insteadOf: readonly ["Popover", "AlertDialog"];
    readonly when: readonly ["The task needs temporary focused attention and can be cancelled."];
    readonly rejectWhen: readonly ["A consequential response is required.", "The task can remain inline."];
}, {
    readonly task: "Confirm an irreversible decision";
    readonly choose: "AlertDialog";
    readonly insteadOf: readonly ["Dialog", "Toast"];
    readonly when: readonly ["The decision is consequential and lacks a safe inverse."];
    readonly rejectWhen: readonly ["Undo can reliably recover the action."];
}, {
    readonly task: "Confirm transient completion";
    readonly choose: "Toast";
    readonly insteadOf: readonly ["Alert", "Dialog"];
    readonly when: readonly ["The message is brief and does not require a response."];
    readonly rejectWhen: readonly ["The status must remain visible.", "The user must choose what happens next."];
}, {
    readonly task: "Recover a reversible mutation";
    readonly choose: "UndoStack";
    readonly insteadOf: readonly ["Toast", "AlertDialog"];
    readonly when: readonly ["A reliable inverse exists."];
    readonly rejectWhen: readonly ["The inverse is lossy or unsafe."];
}, {
    readonly task: "Inspect one item without losing place";
    readonly choose: "SharedDetail";
    readonly insteadOf: readonly ["Dialog", "Separate route"];
    readonly when: readonly ["The source collection remains useful during inspection."];
    readonly rejectWhen: readonly ["The detail is a long independent task."];
}, {
    readonly task: "Compare and operate on a collection";
    readonly choose: "DataTable";
    readonly insteadOf: readonly ["Table", "Card grid"];
    readonly when: readonly ["Sort, filter, select, resize, pin, or virtualize serves the task."];
    readonly rejectWhen: readonly ["The content is short and static."];
}, {
    readonly task: "Show one bounded target";
    readonly choose: "Goal";
    readonly insteadOf: readonly ["Progress", "Chart"];
    readonly when: readonly ["A stable target and actual value are both known."];
    readonly rejectWhen: readonly ["The work is an indeterminate process.", "There is no agreed target."];
}, {
    readonly task: "Inspect ordered analytic values";
    readonly choose: "Chart";
    readonly insteadOf: readonly ["Sparkline", "Breakdown"];
    readonly when: readonly ["Exact values, comparison, and point inspection matter."];
    readonly rejectWhen: readonly ["Only direction matters.", "Categories have no meaningful order."];
}];
export declare const teumAgentForbiddenRules: readonly ["Do not invent undocumented props, exports, registry items, or private CSS selectors.", "Do not merge components because their closed shapes look similar; preserve task, focus, and recovery boundaries.", "Do not add a primitive when an existing recipe already owns the product task.", "Do not persist selection, open overlays, pointer position, loading state, or in-flight work.", "Do not place column sizing, pinning, or visual tooltip state in server requests.", "Do not use a Toast when the user must respond or when status must remain visible.", "Do not use Alert Dialog when a reliable Undo path exists.", "Do not hide exact values behind color, charts, progress fills, or iconography.", "Do not remove semantic tables or text summaries from analytic visuals.", "Do not animate high-frequency inspection, keyboard navigation, sorting, filtering, or virtual scrolling.", "Do not move focus on pointer activation; reserve visible focus treatment for keyboard navigation.", "Do not change collection geometry when detail, selection, bulk actions, loading, or feedback appears.", "Do not create a new feedback stack for sequential outcomes; update one foreground feedback identity.", "Do not claim production adoption, external review, or device coverage without evidence."];
export declare const teumAgentSystemContract: {
    readonly schemaVersion: 1;
    readonly product: "Teum";
    readonly principles: readonly ["stable geometry", "shared origin", "reversible completion"];
    readonly workflow: readonly ["inspect project", "classify task", "select recipe", "verify boundaries", "install source", "compose with public APIs", "run quality gates"];
    readonly qualityGates: readonly ["TypeScript", "production build", "keyboard path", "accessible names and semantics", "light and dark themes", "reduced motion", "no undocumented API", "no forbidden-rule violation"];
};
export declare function selectTeumRecipe(task: string): TeumAgentPlan | null;
