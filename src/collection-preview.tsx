import { Archive, Eye, PencilSimple, Trash, UserCircle } from "@phosphor-icons/react";
import { useState } from "react";
import type { CollectionLibraryComponentId } from "./component-catalog";
import {
  Badge,
  Breakdown,
  BulkActionBar,
  Button,
  Chart,
  ColumnManager,
  ColumnVisibilityMenu,
  Comparison,
  Cohort,
  CursorPagination,
  DataDensityControl,
  DataExportMenu,
  DataGroupMenu,
  DataResultSummary,
  DataSortMenu,
  DataState,
  DataTable,
  type DataTableColumn,
  DataToolbar,
  DateRangeFilter,
  DonutChart,
  FacetFilter,
  FilterBuilder,
  Funnel,
  type FilterField,
  Gauge,
  Heatmap,
  Histogram,
  Metric,
  Goal,
  PropertyList,
  RadarChart,
  RowActionsMenu,
  SankeyChart,
  SavedViews,
  SavedViewMenu,
  ScatterChart,
  SearchInput,
  Sparkline,
  Timeline,
  WaterfallChart,
  AuditLog,
  type AnalyticsDatum,
  type AnalyticsSeries,
  type DataDateRange,
  type DataDensity,
  type DataExportColumn,
  type DataSortValue,
  type DataViewFilter,
} from "./components/ui";

type AccountRow = {
  id: string;
  account: string;
  status: "Active" | "At risk";
  owner: string;
  arr: number;
};

const accountRows: readonly AccountRow[] = [
  { id: "CUS-104", account: "Northstar", status: "Active", owner: "Avery", arr: 84_000 },
  { id: "CUS-103", account: "Fieldwork", status: "At risk", owner: "Mina", arr: 62_400 },
  { id: "CUS-102", account: "Relay", status: "Active", owner: "Noah", arr: 48_600 },
] as const;

const accountColumns: readonly DataTableColumn<AccountRow>[] = [
  {
    id: "account",
    header: "Account",
    width: "46%",
    sortable: true,
    cell: (row) => <span className="collection-account"><strong>{row.account}</strong><small>{row.id}</small></span>,
  },
  {
    id: "status",
    header: "Status",
    width: "28%",
    cell: (row) => <Badge variant={row.status === "At risk" ? "danger" : "neutral"}>{row.status}</Badge>,
  },
  {
    id: "arr",
    header: "ARR",
    accessor: "arr",
    align: "end",
    width: "26%",
    cell: (row) => `$${Math.round(row.arr / 1_000)}k`,
  },
] as const;

const accountExportColumns: readonly DataExportColumn<AccountRow>[] = [
  { id: "account", header: "Account", value: (row) => row.account },
  { id: "status", header: "Status", value: (row) => row.status },
  { id: "owner", header: "Owner", value: (row) => row.owner },
  { id: "arr", header: "ARR", value: (row) => row.arr },
] as const;

const filterFields: readonly FilterField[] = [
  { id: "status", label: "Status", values: [{ label: "Active", value: "active" }, { label: "At risk", value: "at-risk" }] },
  { id: "owner", label: "Owner", values: [{ label: "Avery", value: "avery" }, { label: "Mina", value: "mina" }, { label: "Noah", value: "noah" }] },
] as const;

const trendData: readonly AnalyticsDatum[] = [
  { id: "mar", label: "Mar", values: { current: 74, prior: 66 } },
  { id: "apr", label: "Apr", values: { current: 79, prior: 70 } },
  { id: "may", label: "May", values: { current: 83, prior: 75 } },
  { id: "jun", label: "Jun", values: { current: 91, prior: 78 } },
  { id: "jul", label: "Jul", values: { current: 96, prior: 84 } },
  { id: "aug", label: "Aug", values: { current: 104, prior: 89 } },
] as const;

const trendSeries: readonly AnalyticsSeries[] = [
  { id: "current", label: "Current", tone: "primary" },
  { id: "prior", label: "Prior", tone: "secondary", lineStyle: "dashed" },
] as const;

function DataTablePreview() {
  return (
    <div className="collection-table-preview">
      <header><strong>Accounts</strong><span>3 records</span></header>
      <DataTable ariaLabel="Accounts" data={accountRows} columns={accountColumns} getRowId={(row) => row.id} paginate={false} />
    </div>
  );
}

function FilterBuilderPreview() {
  const [filters, setFilters] = useState<readonly DataViewFilter[]>([
    { id: "status:is", fieldId: "status", operator: "is", value: "at-risk" },
  ]);
  return (
    <div className="collection-control-surface collection-control-surface--filter">
      <span>Accounts</span>
      <FilterBuilder fields={filterFields} filters={filters} onFiltersChange={setFilters} />
    </div>
  );
}

function DataToolbarPreview() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("all");
  const [columns, setColumns] = useState({ status: true, owner: true, arr: true });
  return (
    <div className="collection-toolbar-preview">
      <DataToolbar
        label="Account controls"
        start={<>
          <SavedViews label="View" value={view} onValueChange={setView} views={[{ id: "all", label: "All accounts" }, { id: "risk", label: "At risk" }]} />
          <SearchInput label="Search accounts" placeholder="Search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} onClear={() => setQuery("")} />
        </>}
        end={<ColumnManager columns={Object.entries(columns).map(([id, visible]) => ({ id, visible, label: id === "arr" ? "ARR" : id.charAt(0).toUpperCase() + id.slice(1) }))} onVisibilityChange={(id, visible) => setColumns((current) => ({ ...current, [id]: visible }))} />}
      />
    </div>
  );
}

function SavedViewPreview() {
  const [view, setView] = useState("all");
  return (
    <div className="collection-control-surface">
      <span>Account view</span>
      <SavedViewMenu
        value={view}
        onValueChange={setView}
        views={[
          { id: "all", label: "All accounts", count: 24, scope: "system" },
          { id: "risk", label: "At risk", count: 4, scope: "personal" },
          { id: "renewal", label: "Renewing soon", count: 7, scope: "personal" },
        ]}
      />
    </div>
  );
}

function ColumnVisibilityPreview() {
  const [columns, setColumns] = useState([
    { id: "account", label: "Account", visible: true, required: true },
    { id: "status", label: "Status", visible: true },
    { id: "owner", label: "Owner", visible: true },
    { id: "arr", label: "ARR", visible: false },
  ]);
  return (
    <div className="collection-control-surface">
      <span>{columns.filter((column) => column.visible).length} columns shown</span>
      <ColumnVisibilityMenu columns={columns} onVisibilityChange={(id, visible) => setColumns((current) => current.map((column) => column.id === id ? { ...column, visible } : column))} />
    </div>
  );
}

function FacetFilterPreview() {
  const [values, setValues] = useState<readonly string[]>(["active"]);
  return (
    <div className="collection-control-surface">
      <span>{values.length ? `${values.length} status selected` : "All statuses"}</span>
      <FacetFilter label="Status" values={values} onValuesChange={setValues} options={[
        { value: "active", label: "Active", count: 18 },
        { value: "risk", label: "At risk", count: 4 },
        { value: "paused", label: "Paused", count: 2 },
      ]} />
    </div>
  );
}

function DataSortPreview() {
  const [value, setValue] = useState<DataSortValue | null>({ id: "updated", direction: "desc" });
  return (
    <div className="collection-control-surface">
      <span>{value ? `${value.id === "updated" ? "Updated" : "ARR"}, ${value.direction === "desc" ? "newest first" : "ascending"}` : "Default order"}</span>
      <DataSortMenu value={value} onValueChange={setValue} options={[{ id: "updated", label: "Updated" }, { id: "arr", label: "ARR" }, { id: "account", label: "Account" }]} />
    </div>
  );
}

function DataGroupPreview() {
  const [value, setValue] = useState<string | null>("status");
  return (
    <div className="collection-control-surface">
      <span>{value ? `Grouped by ${value}` : "Ungrouped"}</span>
      <DataGroupMenu value={value} onValueChange={setValue} options={[{ id: "status", label: "Status" }, { id: "owner", label: "Owner" }, { id: "plan", label: "Plan" }]} />
    </div>
  );
}

function DataDensityPreview() {
  const [value, setValue] = useState<DataDensity>("default");
  return (
    <div className="collection-control-surface collection-control-surface--density">
      <span>{value.charAt(0).toUpperCase() + value.slice(1)} rows</span>
      <DataDensityControl value={value} onValueChange={setValue} />
    </div>
  );
}

function DataResultSummaryPreview() {
  return (
    <div className="collection-control-surface">
      <DataResultSummary total={248} filtered={18} selected={3} noun="account" detail="Status is Active" />
    </div>
  );
}

function BulkActionPreview() {
  const [count, setCount] = useState(3);
  return (
    <div className="collection-bulk-preview">
      {count > 0 ? <BulkActionBar count={count} noun="account" onClear={() => setCount(0)} actions={<>
        <Button size="small" variant="ghost" leadingIcon={<UserCircle />}>Assign</Button>
        <Button size="small" variant="ghost" leadingIcon={<Archive />}>Archive</Button>
      </>} /> : <Button size="small" variant="secondary" onClick={() => setCount(3)}>Select accounts</Button>}
    </div>
  );
}

function RowActionsPreview() {
  const [lastAction, setLastAction] = useState("No action selected");
  return (
    <div className="collection-control-surface">
      <span role="status">{lastAction}</span>
      <RowActionsMenu label="Northstar actions" onAction={(action) => setLastAction(action.label)} actions={[
        { id: "open", label: "Open account", icon: <Eye /> },
        { id: "edit", label: "Edit details", icon: <PencilSimple /> },
        { id: "archive", label: "Archive", icon: <Trash />, destructive: true, separatorBefore: true },
      ]} />
    </div>
  );
}

function CursorPaginationPreview() {
  const [page, setPage] = useState(2);
  return (
    <div className="collection-control-surface collection-control-surface--pagination">
      <CursorPagination hasPrevious={page > 1} hasNext={page < 4} range={`${(page - 1) * 25 + 1}–${page * 25}`} onPrevious={() => setPage((current) => Math.max(1, current - 1))} onNext={() => setPage((current) => Math.min(4, current + 1))} />
    </div>
  );
}

function DateRangePreview() {
  const [value, setValue] = useState<DataDateRange>({ from: "2026-08-01", to: "2026-08-16" });
  return (
    <div className="collection-control-surface">
      <span>Updated</span>
      <DateRangeFilter label="Date range" value={value} onValueChange={setValue} />
    </div>
  );
}

function ExportMenuPreview() {
  const [lastExport, setLastExport] = useState("3 records");
  return (
    <div className="collection-control-surface collection-control-surface--export">
      <span role="status">{lastExport}</span>
      <DataExportMenu rows={accountRows} selectedRows={accountRows.slice(0, 1)} columns={accountExportColumns} fileName="accounts" download={false} onExport={(artifact, scope) => setLastExport(`${artifact.rowCount} ${scope === "selected" ? "selected" : "records"}`)} />
    </div>
  );
}

function PropertyListPreview() {
  return (
    <PropertyList className="collection-property-preview" items={[
      { id: "owner", label: "Owner", value: "Avery Stone" },
      { id: "plan", label: "Plan", value: "Business" },
      { id: "renewal", label: "Renewal", value: "Sep 18", description: "30 days remaining" },
    ]} />
  );
}

function AuditLogPreview() {
  const [activeId, setActiveId] = useState<string>();
  const items = [
    { id: "assigned", actor: "Mina", action: "assigned Noah", timestamp: "8m", metadata: "Owner changed" },
    { id: "plan", actor: "Noah", action: "changed the plan", timestamp: "2h", metadata: "Team → Business" },
    { id: "export", actor: "Avery", action: "exported this view", timestamp: "1d" },
  ];
  return <AuditLog className="collection-audit-preview" label="Account activity" items={items} activeId={activeId} onSelect={(item) => setActiveId(item.id === activeId ? undefined : item.id)} />;
}

function DataStatePreview() {
  const [state, setState] = useState<"empty" | "error">("empty");
  return (
    <DataState
      className="collection-data-state-preview"
      state={state}
      action={<Button size="small" variant="secondary" onClick={() => setState((current) => current === "empty" ? "error" : "empty")}>{state === "empty" ? "Show error" : "Reset"}</Button>}
    />
  );
}

function MetricPreview() {
  return (
    <Metric
      label="Monthly recurring revenue"
      value="$104k"
      trend={{ value: "+8.3%", label: "vs last month", direction: "up", sentiment: "positive" }}
      visual={<Sparkline values={[74, 79, 83, 91, 96, 104]} decorative fill />}
    />
  );
}

function SparklinePreview() {
  return (
    <div className="collection-sparkline-preview">
      <div><span>Active workspaces</span><strong>4,862</strong><small>Last 8 weeks</small></div>
      <Sparkline values={[3_910, 4_020, 4_188, 4_304, 4_472, 4_611, 4_742, 4_862]} label="Active workspaces trend" fill />
    </div>
  );
}

function ChartPreview() {
  return <Chart className="collection-chart-preview" title="Recurring revenue" data={trendData} series={trendSeries} type="area" height={168} valueFormatter={(value) => `$${value}k`} />;
}

function HistogramPreview() {
  return <Histogram className="collection-chart-preview" title="Response time" height={156} valueFormatter={(value) => `${value}`} data={[
    { id: "0-50", label: "0–50", start: 0, end: 50, value: 18 },
    { id: "50-100", label: "50–100", start: 50, end: 100, value: 42 },
    { id: "100-150", label: "100–150", start: 100, end: 150, value: 61 },
    { id: "150-200", label: "150–200", start: 150, end: 200, value: 38 },
    { id: "200-300", label: "200–300", start: 200, end: 300, value: 22 },
    { id: "300+", label: "300+", start: 300, end: 500, value: 9 },
  ]} />;
}

function ScatterPreview() {
  return <ScatterChart className="collection-chart-preview" title="Account health" height={156} xLabel="Seats" yLabel="Actions" data={[
    { id: "northstar", label: "Northstar", x: 24, y: 182 },
    { id: "relay", label: "Relay", x: 42, y: 248 },
    { id: "fieldwork", label: "Fieldwork", x: 64, y: 194, tone: "secondary" },
    { id: "acme", label: "Acme", x: 78, y: 326 },
    { id: "orbit", label: "Orbit", x: 96, y: 278, tone: "secondary" },
    { id: "plume", label: "Plume", x: 118, y: 412 },
  ]} />;
}

function WaterfallPreview() {
  return <WaterfallChart className="collection-chart-preview" title="Revenue bridge" height={156} valueFormatter={(value) => `$${value}k`} data={[
    { id: "opening", label: "Open", value: 82, kind: "total" },
    { id: "new", label: "New", value: 19 },
    { id: "expansion", label: "Expand", value: 11 },
    { id: "contraction", label: "Contract", value: -5 },
    { id: "churn", label: "Churn", value: -3 },
    { id: "closing", label: "Close", value: 104, kind: "total" },
  ]} />;
}

function DonutPreview() {
  return <DonutChart className="collection-donut-preview" title="Plan mix" centerLabel="Accounts" data={[{ id: "team", label: "Team", value: 1_086, tone: "primary" }, { id: "business", label: "Business", value: 482, tone: "secondary" }, { id: "enterprise", label: "Enterprise", value: 196, tone: "tertiary" }]} />;
}

function RadarPreview() {
  return <RadarChart className="collection-chart-preview" title="Plan comparison" height={176} axes={[
    { id: "automation", label: "Automation", max: 100 },
    { id: "governance", label: "Governance", max: 100 },
    { id: "storage", label: "Storage", max: 100 },
    { id: "support", label: "Support", max: 100 },
    { id: "sharing", label: "Sharing", max: 100 },
  ]} series={[
    { id: "team", label: "Team", values: { automation: 72, governance: 48, storage: 68, support: 54, sharing: 82 } },
    { id: "business", label: "Business", tone: "secondary", values: { automation: 88, governance: 84, storage: 78, support: 76, sharing: 91 } },
  ]} />;
}

function GaugePreview() {
  return <Gauge className="collection-chart-preview" title="Workspace capacity" height={156} value={68} max={100} label="Used" marker={{ value: 80, label: "Review" }} valueFormatter={(value) => `${value}%`} />;
}

function SankeyPreview() {
  return <SankeyChart className="collection-chart-preview" title="Signup flow" height={168} nodes={[
    { id: "visit", label: "Visited", column: 0 },
    { id: "start", label: "Started", column: 1 },
    { id: "return", label: "Returned", column: 1 },
    { id: "activate", label: "Activated", column: 2 },
    { id: "drop", label: "Dropped", column: 2 },
  ]} links={[
    { id: "visit-start", source: "visit", target: "start", value: 2164 },
    { id: "visit-return", source: "visit", target: "return", value: 842 },
    { id: "start-activate", source: "start", target: "activate", value: 1288 },
    { id: "start-drop", source: "start", target: "drop", value: 876 },
  ]} />;
}

function HeatmapPreview() {
  return <Heatmap className="collection-heatmap-preview" title="Feature activity" columns={["Mon", "Tue", "Wed", "Thu"]} rows={[{ id: "search", label: "Search", values: [68, 74, 79, 76] }, { id: "share", label: "Share", values: [29, 35, 41, 44] }, { id: "automate", label: "Automate", values: [18, 24, 32, 37] }]} />;
}

function ComparisonPreview() {
  return (
    <div className="collection-analytics-compact">
      <span>Monthly recurring revenue</span>
      <Comparison label="MRR comparison" current={104} previous={96} currentLabel="August" previousLabel="July" formatter={(value) => `$${value}k`} positiveDirection="up" />
    </div>
  );
}

function BreakdownPreview() {
  const [selectedId, setSelectedId] = useState("direct");
  return (
    <div className="collection-analytics-list">
      <span>Revenue by channel</span>
      <Breakdown
        label="Revenue by channel"
        selectedId={selectedId}
        onSelect={(item) => setSelectedId(item.id)}
        formatter={(value) => `$${value}k`}
        items={[
          { id: "direct", label: "Direct", value: 62, detail: "59.6%" },
          { id: "partners", label: "Partners", value: 27, detail: "26.0%", tone: "secondary" },
          { id: "self-serve", label: "Self-serve", value: 15, detail: "14.4%", tone: "tertiary" },
        ]}
      />
    </div>
  );
}

function GoalPreview() {
  return (
    <div className="collection-analytics-compact">
      <Goal label="Activation goal" value={742} target={1000} formatter={(value) => value.toLocaleString()} description="258 workspaces remaining" />
    </div>
  );
}

function FunnelPreview() {
  const [selectedId, setSelectedId] = useState("activated");
  return (
    <div className="collection-analytics-list">
      <Funnel
        label="Signup funnel"
        selectedId={selectedId}
        onSelect={(stage) => setSelectedId(stage.id)}
        stages={[
          { id: "visited", label: "Visited", value: 4820 },
          { id: "started", label: "Started", value: 2164 },
          { id: "activated", label: "Activated", value: 1288 },
        ]}
      />
    </div>
  );
}

function CohortPreview() {
  return (
    <Cohort
      className="collection-cohort-preview"
      label="Weekly retention"
      periods={["W0", "W1", "W2", "W3"]}
      rows={[
        { id: "jul-21", label: "Jul 21", size: 248, values: [1, .64, .48, .41] },
        { id: "jul-28", label: "Jul 28", size: 274, values: [1, .69, .53, null] },
        { id: "aug-04", label: "Aug 4", size: 312, values: [1, .71, null, null] },
      ]}
    />
  );
}

function TimelinePreview() {
  const [activeId, setActiveId] = useState("workspace");
  const items = [
    { id: "workspace", label: "Workspace templates", timestamp: "Aug 12", description: "Release 2.8", value: "+4.2%", tone: "accent" as const },
    { id: "imports", label: "Faster imports", timestamp: "Aug 5", description: "Release 2.7", value: "+1.8%" },
    { id: "billing", label: "Billing update", timestamp: "Jul 29", description: "Release 2.6" },
  ];
  return <Timeline className="collection-timeline-preview" label="Release timeline" items={items} activeId={activeId} onSelect={(item) => setActiveId(item.id)} />;
}

export function CollectionPreviewFor({ id }: { id: CollectionLibraryComponentId }) {
  if (id === "data-table") return <DataTablePreview />;
  if (id === "filter-builder") return <FilterBuilderPreview />;
  if (id === "data-toolbar") return <DataToolbarPreview />;
  if (id === "saved-view-menu") return <SavedViewPreview />;
  if (id === "column-visibility-menu") return <ColumnVisibilityPreview />;
  if (id === "facet-filter") return <FacetFilterPreview />;
  if (id === "data-sort-menu") return <DataSortPreview />;
  if (id === "data-group-menu") return <DataGroupPreview />;
  if (id === "data-density-control") return <DataDensityPreview />;
  if (id === "data-result-summary") return <DataResultSummaryPreview />;
  if (id === "bulk-action-bar") return <BulkActionPreview />;
  if (id === "row-actions-menu") return <RowActionsPreview />;
  if (id === "cursor-pagination") return <CursorPaginationPreview />;
  if (id === "date-range-filter") return <DateRangePreview />;
  if (id === "data-export-menu") return <ExportMenuPreview />;
  if (id === "property-list") return <PropertyListPreview />;
  if (id === "audit-log") return <AuditLogPreview />;
  if (id === "data-state") return <DataStatePreview />;
  if (id === "metric") return <MetricPreview />;
  if (id === "sparkline") return <SparklinePreview />;
  if (id === "chart") return <ChartPreview />;
  if (id === "histogram") return <HistogramPreview />;
  if (id === "scatter-chart") return <ScatterPreview />;
  if (id === "waterfall-chart") return <WaterfallPreview />;
  if (id === "donut-chart") return <DonutPreview />;
  if (id === "radar-chart") return <RadarPreview />;
  if (id === "gauge") return <GaugePreview />;
  if (id === "sankey-chart") return <SankeyPreview />;
  if (id === "heatmap") return <HeatmapPreview />;
  if (id === "comparison") return <ComparisonPreview />;
  if (id === "breakdown") return <BreakdownPreview />;
  if (id === "goal") return <GoalPreview />;
  if (id === "funnel") return <FunnelPreview />;
  if (id === "cohort") return <CohortPreview />;
  return <TimelinePreview />;
}
