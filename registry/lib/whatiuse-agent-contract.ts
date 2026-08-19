export type WhatiuseAgentRecipeId =
  | "issues-workspace"
  | "customer-directory"
  | "audit-log"
  | "saas-overview"
  | "product-usage"
  | "conversion-retention"
  | "customer-workspace"
  | "billing-usage"
  | "members-permissions";

export type WhatiuseAgentRecipeContract = {
  id: WhatiuseAgentRecipeId;
  title: string;
  domain: "data" | "analytics" | "product";
  intent: string;
  signals: readonly string[];
  registryItem: "whatiuse-data" | "whatiuse-analytics" | "whatiuse-product-patterns";
  modulePath: string;
  exportName: string;
  components: readonly string[];
  state: readonly string[];
  rules: readonly string[];
  forbidden: readonly string[];
};

export type WhatiuseAgentSelectionRule = {
  task: string;
  choose: string;
  insteadOf: readonly string[];
  when: readonly string[];
  rejectWhen: readonly string[];
};

export type WhatiuseAgentPlan = {
  recipe: WhatiuseAgentRecipeContract;
  score: number;
  matchedSignals: readonly string[];
};

export const whatiuseAgentRecipeContracts = [
  {
    id: "issues-workspace",
    title: "Issues Workspace",
    domain: "data",
    intent: "Triage, inspect, mutate, and recover issue work from one shared collection.",
    signals: ["issue triage", "issue backlog", "bulk close", "bulk assign", "undo issue", "issue workspace"],
    registryItem: "whatiuse-data",
    modulePath: "components/patterns/issues-workspace",
    exportName: "IssuesWorkspace",
    components: ["DataToolbar", "SavedViews", "FilterBuilder", "DataTable", "ColumnManager", "BulkActionBar", "SharedDetail", "ActionList", "UndoStack"],
    state: ["shareable query and filters", "stable row selection", "transient detail", "reversible mutation history"],
    rules: ["Keep the collection visible while detail opens.", "Use one selection source for table, detail, and bulk actions.", "Route reversible mutations through Undo Stack."],
    forbidden: ["Do not replace the collection with a detail route.", "Do not stack a new toast for each mutation.", "Do not clear selection before recovery finishes."],
  },
  {
    id: "customer-directory",
    title: "Customer Directory",
    domain: "data",
    intent: "Search, filter, save, share, and export a server-owned customer collection.",
    signals: ["customer directory", "renewal list", "customer export", "saved customer view", "server customer list", "customer table"],
    registryItem: "whatiuse-data",
    modulePath: "components/patterns/data-recipes",
    exportName: "CustomerDirectoryRecipe",
    components: ["SearchInput", "SavedViews", "FilterBuilder", "DateRangeFilter", "ColumnManager", "DataExportMenu", "DataTable"],
    state: ["URL-backed DataViewState", "server-owned rows", "persisted saved views", "transient selection"],
    rules: ["Derive the URL and request key from the same validated state.", "Keep column display state out of server requests.", "Export only declared columns from an explicit scope."],
    forbidden: ["Do not re-sort server-owned rows in the browser.", "Do not persist row selection.", "Do not export hidden sensitive fields."],
  },
  {
    id: "audit-log",
    title: "Audit Log",
    domain: "data",
    intent: "Inspect a large immutable event stream with date bounds, virtualization, and safe export.",
    signals: ["audit log", "security events", "immutable events", "compliance log", "event export", "activity audit"],
    registryItem: "whatiuse-data",
    modulePath: "components/patterns/data-recipes",
    exportName: "AuditLogRecipe",
    components: ["SearchInput", "FilterBuilder", "DateRangeFilter", "ColumnManager", "DataExportMenu", "DataTable"],
    state: ["shareable date and filters", "virtualized final row model", "immutable records"],
    rules: ["Virtualize the final filtered row model.", "Preserve semantic row count and indexes.", "Keep event and time context available during horizontal scroll."],
    forbidden: ["Do not expose mutation or bulk actions.", "Do not render every event at once.", "Do not treat visual row position as record identity."],
  },
  {
    id: "saas-overview",
    title: "SaaS Overview",
    domain: "analytics",
    intent: "Review recurring revenue, growth, targets, and expansion drivers in one period.",
    signals: ["mrr", "arr", "revenue overview", "recurring revenue", "expansion revenue", "revenue target"],
    registryItem: "whatiuse-analytics",
    modulePath: "components/patterns/analytics-recipes",
    exportName: "SaaSOverviewRecipe",
    components: ["Metric", "Sparkline", "Chart", "Comparison", "Goal", "Breakdown"],
    state: ["shared date range", "comparison period", "active chart datum"],
    rules: ["Use one date range and metric definition across every value.", "Keep current and previous periods comparable.", "Keep a semantic data table with the chart."],
    forbidden: ["Do not show a trend without naming its period.", "Do not encode direction with color alone.", "Do not turn every metric into an unrelated card."],
  },
  {
    id: "product-usage",
    title: "Usage & Adoption",
    domain: "analytics",
    intent: "Filter accounts, compare usage and adoption, and follow activation into the supporting records.",
    signals: ["product usage", "feature adoption", "active usage", "activation path", "usage explorer", "account adoption"],
    registryItem: "whatiuse-analytics",
    modulePath: "components/patterns/analytics-recipes",
    exportName: "ProductUsageRecipe",
    components: ["Metric", "Chart", "Breakdown", "Funnel", "Cohort", "DataToolbar", "FacetFilter", "DateRangeFilter", "DataTable"],
    state: ["local active index", "date range", "account filters", "selected feature", "selected stage", "selected account"],
    rules: ["Keep transient chart inspection local.", "Cross-filter only from explicit feature and stage selection.", "Keep account detail and its source row on one stable id."],
    forbidden: ["Do not mirror hover state into account filters.", "Do not hide exact account values behind the chart.", "Do not animate high-frequency inspection."],
  },
  {
    id: "conversion-retention",
    title: "Conversion & Retention",
    domain: "analytics",
    intent: "Trace ordered conversion stages and compare retained behavior by cohort.",
    signals: ["conversion funnel", "retention cohort", "activation funnel", "cohort retention", "signup conversion", "conversion retention"],
    registryItem: "whatiuse-analytics",
    modulePath: "components/patterns/analytics-recipes",
    exportName: "ConversionRetentionRecipe",
    components: ["Metric", "Funnel", "Chart", "Cohort", "DataTable"],
    state: ["selected funnel stage", "active trend datum", "supporting records"],
    rules: ["Keep funnel stages strictly ordered.", "Connect the selected stage to trend and supporting records.", "Expose every cohort value as text."],
    forbidden: ["Do not use a funnel for independent categories.", "Do not infer missing cohort values as zero.", "Do not make color the only retention encoding."],
  },
  {
    id: "customer-workspace",
    title: "Customer Workspace",
    domain: "product",
    intent: "Find an account, inspect health and activity, and complete a follow-up without losing the list.",
    signals: ["customer health", "account follow-up", "customer success workspace", "account health", "customer activity", "customer success"],
    registryItem: "whatiuse-product-patterns",
    modulePath: "components/patterns/product-pattern-recipes",
    exportName: "CustomerWorkspaceRecipe",
    components: ["DataToolbar", "SearchInput", "FilterBuilder", "SharedDetail", "Tabs", "Metric", "Progress", "Timeline", "Button", "Toast"],
    state: ["shareable customer filters", "selected customer", "transient detail tab", "follow-up feedback"],
    rules: ["Anchor detail to the selected customer row.", "Use one customer record for health, owner, plan, and renewal context.", "Return focus to the customer origin when detail closes."],
    forbidden: ["Do not reorder the list after a follow-up.", "Do not encode health by tone alone.", "Do not split account activity into an unrelated page."],
  },
  {
    id: "billing-usage",
    title: "Billing & Usage",
    domain: "product",
    intent: "Compare plan, usage, limits, and invoices before changing a subscription.",
    signals: ["billing usage", "plan limit", "invoice", "subscription", "payment failure", "usage limit"],
    registryItem: "whatiuse-product-patterns",
    modulePath: "components/patterns/product-pattern-recipes",
    exportName: "BillingUsageRecipe",
    components: ["SegmentedControl", "Metric", "Sparkline", "Chart", "Progress", "Alert", "DataTable", "Dialog", "Button", "Toast"],
    state: ["shared billing period", "persisted plan and limits", "active invoice", "plan review"],
    rules: ["Use the same billing period across metrics, chart, limits, and invoices.", "Keep exact consumed and allowed values visible.", "Review a plan change before committing it."],
    forbidden: ["Do not change a plan from a transient menu action.", "Do not hide payment risk behind color.", "Do not lose the billing period when an invoice opens."],
  },
  {
    id: "members-permissions",
    title: "Members & Permissions",
    domain: "product",
    intent: "Invite people, change roles, and audit access policy in one task.",
    signals: ["members permissions", "invite member", "role permissions", "access policy", "workspace roles", "permission matrix"],
    registryItem: "whatiuse-product-patterns",
    modulePath: "components/patterns/product-pattern-recipes",
    exportName: "MembersPermissionsRecipe",
    components: ["Tabs", "DataToolbar", "SearchInput", "FilterBuilder", "DataTable", "Select", "Badge", "Checkbox", "Dialog", "TextField", "Toast"],
    state: ["shareable member query", "persisted roles and grants", "invite draft", "pending role change"],
    rules: ["Show one role and invitation status per member.", "Name the member in each role control.", "Protect the last owner before a role mutation."],
    forbidden: ["Do not demote the last owner.", "Do not apply a permission change to an ambiguous selection.", "Do not reset filters when switching membership and role views."],
  },
] as const satisfies readonly WhatiuseAgentRecipeContract[];

export const whatiuseAgentSelectionRules = [
  { task: "Choose one submitted value", choose: "Select", insteadOf: ["Combobox", "ContextSwitcher"], when: ["The values are short and predefined."], rejectWhen: ["The list needs filtering.", "The surrounding product context changes."] },
  { task: "Filter a large predefined list", choose: "Combobox", insteadOf: ["Select", "SearchInput"], when: ["A known option must be selected after search."], rejectWhen: ["Free-form text is valid.", "The choice changes workspace context."] },
  { task: "Change workspace or environment", choose: "ContextSwitcher", insteadOf: ["Select", "Menu"], when: ["The selection changes the surrounding product context."], rejectWhen: ["The value is an ordinary form field."] },
  { task: "Run compact contextual actions", choose: "Menu", insteadOf: ["ActionList", "Popover"], when: ["The anchored action set is short."], rejectWhen: ["Actions need search or cross-product discovery.", "Interactive settings must remain open."] },
  { task: "Search and run many actions", choose: "ActionList", insteadOf: ["Menu"], when: ["The workflow is keyboard-first and the action set is large."], rejectWhen: ["The set is a small anchored menu."] },
  { task: "Keep compact controls beside an origin", choose: "Popover", insteadOf: ["Dialog", "Tooltip"], when: ["The controls are optional and contextual."], rejectWhen: ["The task traps focus.", "The content is only a label."] },
  { task: "Complete a focused task", choose: "Dialog", insteadOf: ["Popover", "AlertDialog"], when: ["The task needs temporary focused attention and can be cancelled."], rejectWhen: ["A consequential response is required.", "The task can remain inline."] },
  { task: "Confirm an irreversible decision", choose: "AlertDialog", insteadOf: ["Dialog", "Toast"], when: ["The decision is consequential and lacks a safe inverse."], rejectWhen: ["Undo can reliably recover the action."] },
  { task: "Confirm transient completion", choose: "Toast", insteadOf: ["Alert", "Dialog"], when: ["The message is brief and does not require a response."], rejectWhen: ["The status must remain visible.", "The user must choose what happens next."] },
  { task: "Recover a reversible mutation", choose: "UndoStack", insteadOf: ["Toast", "AlertDialog"], when: ["A reliable inverse exists."], rejectWhen: ["The inverse is lossy or unsafe."] },
  { task: "Inspect one item without losing place", choose: "SharedDetail", insteadOf: ["Dialog", "Separate route"], when: ["The source collection remains useful during inspection."], rejectWhen: ["The detail is a long independent task."] },
  { task: "Compare and operate on a collection", choose: "DataTable", insteadOf: ["Table", "Card grid"], when: ["Sort, filter, select, resize, pin, or virtualize serves the task."], rejectWhen: ["The content is short and static."] },
  { task: "Show one bounded target", choose: "Goal", insteadOf: ["Progress", "Chart"], when: ["A stable target and actual value are both known."], rejectWhen: ["The work is an indeterminate process.", "There is no agreed target."] },
  { task: "Inspect ordered analytic values", choose: "Chart", insteadOf: ["Sparkline", "Breakdown"], when: ["Exact values, comparison, and point inspection matter."], rejectWhen: ["Only direction matters.", "Categories have no meaningful order."] },
  { task: "Inspect a numeric distribution", choose: "Histogram", insteadOf: ["Chart", "Breakdown"], when: ["Continuous or bucketed values need shape, spread, and outlier inspection."], rejectWhen: ["The x-axis is an ordered time series.", "The values are unrelated categories."] },
  { task: "Inspect a relationship between two measures", choose: "ScatterChart", insteadOf: ["Chart", "Breakdown"], when: ["Both axes are continuous and correlation, clusters, or outliers matter."], rejectWhen: ["Only one measure exists.", "The x-axis is primarily time."] },
  { task: "Explain a running value bridge", choose: "WaterfallChart", insteadOf: ["BarChart", "Breakdown"], when: ["Ordered positive and negative contributions reconcile a known start and end."], rejectWhen: ["Bars are independent categories.", "The sequence does not reconcile to a meaningful total."] },
  { task: "Compare a bounded multi-axis profile", choose: "RadarChart", insteadOf: ["BarChart", "Breakdown"], when: ["A small set of normalized dimensions forms a meaningful profile."], rejectWhen: ["Exact cross-category ranking matters.", "Scales are not comparable or there are too many axes."] },
  { task: "Show one bounded current measure", choose: "Gauge", insteadOf: ["Goal", "Progress"], when: ["A single current value has an explicit minimum, maximum, and concise status meaning."], rejectWhen: ["Trend or history matters.", "The value is an indeterminate process."] },
  { task: "Inspect a small directed flow", choose: "SankeyChart", insteadOf: ["Funnel", "Flow diagram"], when: ["Named sources, destinations, and weighted transfers form a small acyclic network."], rejectWhen: ["The flow is a single ordered conversion path.", "The graph is cyclic, dense, or needs general node editing."] },
] as const satisfies readonly WhatiuseAgentSelectionRule[];

export const whatiuseAgentForbiddenRules = [
  "Do not invent undocumented props, exports, registry items, or private CSS selectors.",
  "Do not merge components because their closed shapes look similar; preserve task, focus, and recovery boundaries.",
  "Do not add a primitive when an existing recipe already owns the product task.",
  "Do not persist selection, open overlays, pointer position, loading state, or in-flight work.",
  "Do not place column sizing, pinning, or visual tooltip state in server requests.",
  "Do not use a Toast when the user must respond or when status must remain visible.",
  "Do not use Alert Dialog when a reliable Undo path exists.",
  "Do not hide exact values behind color, charts, progress fills, or iconography.",
  "Do not remove semantic tables or text summaries from analytic visuals.",
  "Do not animate high-frequency inspection, keyboard navigation, sorting, filtering, or virtual scrolling.",
  "Do not move focus on pointer activation; reserve visible focus treatment for keyboard navigation.",
  "Do not change collection geometry when detail, selection, bulk actions, loading, or feedback appears.",
  "Do not create a new feedback stack for sequential outcomes; update one foreground feedback identity.",
  "Do not claim production adoption, external review, or device coverage without evidence.",
] as const;

export const whatiuseAgentSystemContract = {
  schemaVersion: 1,
  product: "whatiuse",
  principles: ["stable geometry", "shared origin", "reversible completion"],
  workflow: ["inspect project", "classify task", "select recipe", "verify boundaries", "install source", "compose with public APIs", "run quality gates"],
  qualityGates: ["TypeScript", "production build", "keyboard path", "accessible names and semantics", "light and dark themes", "reduced motion", "no undocumented API", "no forbidden-rule violation"],
} as const;

const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function selectWhatiuseRecipe(task: string): WhatiuseAgentPlan | null {
  const normalizedTask = normalize(task);
  const candidates = whatiuseAgentRecipeContracts.map((recipe) => {
    const matchedSignals = recipe.signals.filter((signal) => normalizedTask.includes(normalize(signal)));
    const score = matchedSignals.reduce((total, signal) => total + normalize(signal).split(" ").length, 0);
    return { recipe, score, matchedSignals };
  }).filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.recipe.id.localeCompare(right.recipe.id));
  return candidates[0] ?? null;
}
