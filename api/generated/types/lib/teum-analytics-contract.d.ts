export type TeumAnalyticsComponentContract = {
    id: string;
    intent: string;
    useWhen: readonly string[];
    avoidWhen: readonly string[];
    requires: readonly string[];
    states: readonly string[];
    compatibleWith: readonly string[];
    dataSchema: string;
    interactionModel: readonly string[];
    accessibility: readonly string[];
};
export declare const teumAnalyticsComponentContracts: readonly [{
    readonly id: "metric";
    readonly intent: "State one important value, its direction, and comparison context without turning a dashboard into a card grid.";
    readonly useWhen: readonly ["One value carries a clear product decision.", "The comparison period can be named."];
    readonly avoidWhen: readonly ["Several dimensions need comparison.", "The value has no stable definition or time window."];
    readonly requires: readonly ["Metric label", "Formatted value", "Named trend period when a trend is shown"];
    readonly states: readonly ["default", "trend up", "trend down", "flat", "loading"];
    readonly compatibleWith: readonly ["Sparkline", "Comparison", "Goal"];
    readonly dataSchema: "{ label, value, trend?, context?, visual? }";
    readonly interactionModel: readonly ["Static by default.", "Any linked drill-down is owned by the surrounding recipe."];
    readonly accessibility: readonly ["Trend direction is written in text and never encoded by color alone.", "Loading preserves final geometry and announces the metric label."];
}, {
    readonly id: "sparkline";
    readonly intent: "Add a compact directional trace beside a value without introducing a second chart-reading task.";
    readonly useWhen: readonly ["Exact intermediate values are secondary.", "Surrounding content already names the measure and period."];
    readonly avoidWhen: readonly ["People need exact values, comparisons, or annotations.", "The trace would be the only representation of the data."];
    readonly requires: readonly ["Ordered numeric values", "Accessible label unless decorative"];
    readonly states: readonly ["line", "area", "gaps", "empty", "decorative"];
    readonly compatibleWith: readonly ["Metric", "Comparison"];
    readonly dataSchema: "readonly (number | null)[]";
    readonly interactionModel: readonly ["Never interactive.", "Use Chart when point inspection matters."];
    readonly accessibility: readonly ["Decorative traces are hidden from assistive technology.", "Standalone traces expose a concise image label."];
}, {
    readonly id: "chart";
    readonly intent: "Compare ordered series or category magnitude through one keyboard, pointer, and table contract.";
    readonly useWhen: readonly ["Change over an ordered dimension matters.", "Exact values and comparisons need a shared visual frame.", "Grouped or stacked bars clarify category magnitude or composition."];
    readonly avoidWhen: readonly ["A ranked list communicates the task more directly.", "A part-to-whole task has fewer than seven stable categories."];
    readonly requires: readonly ["Stable datum ids", "Human labels", "Named series", "Value formatter", "Short description"];
    readonly states: readonly ["line", "area", "grouped bar", "stacked bar", "active datum", "filtered series", "annotated", "loading", "empty", "error", "data table"];
    readonly compatibleWith: readonly ["Metric", "Comparison", "Timeline", "SegmentedControl", "DateRangeFilter", "DonutChart", "Heatmap"];
    readonly dataSchema: "AnalyticsDatum[] + AnalyticsSeries[]";
    readonly interactionModel: readonly ["Pointer position and Left/Right keys share one active index.", "Home and End jump to bounds.", "Escape clears inspection.", "Enter may open the active datum.", "Visible series can be controlled to synchronize charts."];
    readonly accessibility: readonly ["The chart has a short text summary.", "A semantic HTML table is always present and can be made visible.", "A polite live region announces the active point.", "Series use labels and line patterns, not color alone."];
}, {
    readonly id: "donut-chart";
    readonly intent: "Compare a small part-to-whole set with exact values, visible shares, and one inspectable center summary.";
    readonly useWhen: readonly ["Two to six stable categories form one meaningful whole.", "Part-to-whole share is more important than small differences."];
    readonly avoidWhen: readonly ["Categories do not form one whole.", "More than six segments or close values require precise comparison.", "Negative values are possible."];
    readonly requires: readonly ["Stable segment ids", "Human labels", "Non-negative values", "Visible value formatter"];
    readonly states: readonly ["default", "active segment", "loading", "empty", "error", "data table"];
    readonly compatibleWith: readonly ["Metric", "Breakdown", "Chart"];
    readonly dataSchema: "DonutChartDatum[]";
    readonly interactionModel: readonly ["Pointer and Arrow keys share one active segment.", "Home and End jump to bounds.", "Escape clears inspection.", "Enter may open the active segment."];
    readonly accessibility: readonly ["Every segment has a visible label, value, and share.", "A semantic table preserves the source values.", "A live region announces the active segment."];
}, {
    readonly id: "heatmap";
    readonly intent: "Reveal repeated intensity patterns across two discrete dimensions without hiding the value in each cell.";
    readonly useWhen: readonly ["Rows and columns use stable, repeated intervals.", "Pattern and outlier detection matter more than exact ranking."];
    readonly avoidWhen: readonly ["The axes are continuous.", "Color strength would be the only readable value.", "A cohort-specific retention table is the actual task."];
    readonly requires: readonly ["Row ids and labels", "Column labels", "Numeric domain", "Missing-value policy", "Text formatter"];
    readonly states: readonly ["default", "active cell", "partial data", "loading", "empty", "error", "scrolling"];
    readonly compatibleWith: readonly ["Metric", "Chart", "Cohort", "Timeline"];
    readonly dataSchema: "HeatmapRow[] + column labels";
    readonly interactionModel: readonly ["Arrow keys move through the two-dimensional grid.", "Home and End move to row bounds.", "Escape clears inspection.", "Enter may open the active cell."];
    readonly accessibility: readonly ["Uses a real HTML table with row and column headers.", "Every cell exposes a text value or explicit no-data label.", "Focus and selection are not encoded by tone alone."];
}, {
    readonly id: "comparison";
    readonly intent: "Keep current, previous, and relative change in one compact definition list.";
    readonly useWhen: readonly ["Two values use the same unit and definition.", "Relative change is meaningful."];
    readonly avoidWhen: readonly ["The previous value is zero or not comparable without explanation.", "More than two periods need comparison."];
    readonly requires: readonly ["Current value", "Previous value", "Shared formatter"];
    readonly states: readonly ["increase", "decrease", "flat", "not comparable"];
    readonly compatibleWith: readonly ["Metric", "Chart"];
    readonly dataSchema: "{ current: number, previous: number }";
    readonly interactionModel: readonly ["Static by default."];
    readonly accessibility: readonly ["Direction and percentage are both text.", "Positive and negative meaning is configurable instead of inferred."];
}, {
    readonly id: "breakdown";
    readonly intent: "Rank parts of one total with labels, values, and restrained proportional bars.";
    readonly useWhen: readonly ["Categories share one unit.", "Rank and magnitude both matter."];
    readonly avoidWhen: readonly ["Spatial composition is the main task.", "There are too many categories to scan."];
    readonly requires: readonly ["Stable item ids", "Labels", "Values", "Shared formatter"];
    readonly states: readonly ["default", "selected", "compact", "empty"];
    readonly compatibleWith: readonly ["Chart", "Metric", "DataTable"];
    readonly dataSchema: "BreakdownItem[]";
    readonly interactionModel: readonly ["Static unless a recipe provides onSelect.", "Selected identity can control a detail or table filter."];
    readonly accessibility: readonly ["Every bar also has a visible label and value.", "Interactive rows are native buttons with pressed state."];
}, {
    readonly id: "goal";
    readonly intent: "Show progress toward one explicit target without hiding the actual and target values.";
    readonly useWhen: readonly ["A target is stable for the displayed period.", "Progress can be expressed on one bounded scale."];
    readonly avoidWhen: readonly ["There is no agreed target.", "Higher is not necessarily better."];
    readonly requires: readonly ["Current value", "Target value", "Shared formatter"];
    readonly states: readonly ["in progress", "complete", "over target", "zero target"];
    readonly compatibleWith: readonly ["Metric", "Comparison"];
    readonly dataSchema: "{ value: number, target: number }";
    readonly interactionModel: readonly ["Static."];
    readonly accessibility: readonly ["Uses a progressbar contract with value text.", "Actual and target values remain visible."];
}, {
    readonly id: "funnel";
    readonly intent: "Show ordered stage volume and the loss between adjacent stages.";
    readonly useWhen: readonly ["Every stage is a strict next step.", "Adjacent conversion is the decision."];
    readonly avoidWhen: readonly ["People can skip stages or move backward frequently.", "Categories are independent."];
    readonly requires: readonly ["Ordered stages", "Stable stage ids", "Non-negative values"];
    readonly states: readonly ["default", "selected", "zero stage", "single stage"];
    readonly compatibleWith: readonly ["Metric", "Breakdown", "DataTable"];
    readonly dataSchema: "FunnelStage[]";
    readonly interactionModel: readonly ["Static unless a recipe provides onSelect.", "Selection may filter supporting records."];
    readonly accessibility: readonly ["Ordered-list semantics preserve stage order.", "Every stage exposes value and adjacent conversion as text."];
}, {
    readonly id: "cohort";
    readonly intent: "Compare retention across start groups and elapsed periods in a semantic matrix.";
    readonly useWhen: readonly ["Rows share one cohort definition.", "Columns represent the same elapsed intervals."];
    readonly avoidWhen: readonly ["Calendar periods rather than elapsed periods are primary.", "Sparse records would make the matrix misleading."];
    readonly requires: readonly ["Cohort labels", "Period labels", "Normalized values", "Missing-value policy"];
    readonly states: readonly ["default", "partial row", "missing cell", "scrolling"];
    readonly compatibleWith: readonly ["Metric", "Chart", "DataTable"];
    readonly dataSchema: "CohortRow[] + period labels";
    readonly interactionModel: readonly ["The table scrolls as one keyboard-reachable region.", "Cells stay static until a product case justifies drill-down."];
    readonly accessibility: readonly ["Uses a real HTML table with row and column headers.", "Every heat cell includes a text value; tone is redundant."];
}, {
    readonly id: "timeline";
    readonly intent: "Relate dated product events to an analytic change without forcing every event onto the plot.";
    readonly useWhen: readonly ["Events have meaningful order and concise labels.", "A person may inspect one event in context."];
    readonly avoidWhen: readonly ["Events are dense enough to require filtering or a data table.", "Time is not relevant."];
    readonly requires: readonly ["Stable event ids", "Timestamps", "Labels"];
    readonly states: readonly ["default", "selected", "danger event", "empty"];
    readonly compatibleWith: readonly ["Chart", "SharedDetail", "DataTable"];
    readonly dataSchema: "TimelineItem[]";
    readonly interactionModel: readonly ["Static unless a recipe provides onSelect.", "Selection can control a chart annotation or detail pane."];
    readonly accessibility: readonly ["Uses ordered-list semantics.", "Interactive events are native buttons with pressed state."];
}];
export declare const teumAnalyticsStateContract: {
    readonly version: 1;
    readonly controlled: readonly ["date range", "comparison period", "visible series", "active datum", "selected segment"];
    readonly derived: readonly ["domain", "ticks", "percent change", "conversion", "retention strength"];
    readonly transient: readonly ["pointer position", "visual tooltip", "table disclosure"];
    readonly rules: readonly ["Transient pointer and keyboard inspection stays local to the chart being inspected.", "Adjacent charts synchronize only an explicit product selection, never raw hover state.", "Keyboard inspection updates the same state as pointer inspection without animation delay.", "Changing range or comparison clears stale active data.", "Every visual encoding has a textual value, label, or semantic table equivalent.", "Renderer choice follows the decision: line or area for change, bars for magnitude, donut for a small whole, and heatmap for repeated intensity.", "Recipes own URL and server state; visual primitives remain transport-agnostic."];
};
export declare const teumAnalyticsRecipeContracts: readonly [{
    readonly id: "saas-overview";
    readonly intent: "Review recurring revenue, growth, target progress, and expansion drivers from one calm overview.";
    readonly taskSequence: readonly ["Choose range", "Read metric", "Compare period", "Inspect point", "Open revenue detail"];
    readonly components: readonly ["Metric", "Sparkline", "Chart", "Comparison", "Goal", "Breakdown"];
    readonly invariants: readonly ["All values share the same date range.", "Current and previous periods use the same metric definition.", "Chart inspection and summary table agree."];
}, {
    readonly id: "product-usage";
    readonly intent: "Compare active usage, feature adoption, and release events without coupling transient chart inspection.";
    readonly taskSequence: readonly ["Choose range", "Filter series", "Inspect a day", "Select a release", "Review feature breakdown"];
    readonly components: readonly ["Metric", "Chart", "Breakdown", "Timeline"];
    readonly invariants: readonly ["Each chart owns its transient active point.", "Legend filtering never changes date order.", "Explicit release selection maps to one stable annotation."];
}, {
    readonly id: "conversion-retention";
    readonly intent: "Trace acquisition through activation, then compare retained behavior by cohort.";
    readonly taskSequence: readonly ["Read conversion", "Select a stage", "Inspect supporting trend", "Compare cohorts", "Open records"];
    readonly components: readonly ["Metric", "Funnel", "Chart", "Cohort", "DataTable"];
    readonly invariants: readonly ["Funnel stages are strictly ordered.", "Retention cells state values in text.", "Selected stage and supporting records share one id."];
}];
