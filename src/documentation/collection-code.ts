import type { CollectionLibraryComponentId } from "../component-catalog";

export const collectionComponentCode: Record<CollectionLibraryComponentId, string> = {
  "data-table": `import { DataTable } from "whatiuse";

export function AccountsTable({ rows, columns }) {
  return <DataTable ariaLabel="Accounts" data={rows} columns={columns} getRowId={(row) => row.id} />;
}`,
  "filter-builder": `import { FilterBuilder } from "whatiuse";

export function AccountFilters({ fields, filters, setFilters }) {
  return <FilterBuilder fields={fields} filters={filters} onFiltersChange={setFilters} />;
}`,
  "data-toolbar": `import { ColumnManager, DataToolbar, SearchInput } from "whatiuse";

export function AccountToolbar({ query, setQuery, columns, setColumn }) {
  return <DataToolbar label="Account controls" start={<>
    <SearchInput label="Search accounts" value={query} onChange={(event) => setQuery(event.target.value)} />
  </>} end={<ColumnManager columns={columns} onVisibilityChange={setColumn} />} />;
}`,
  "saved-view-menu": `import { SavedViewMenu } from "whatiuse";

export function AccountViews({ view, setView }) {
  return <SavedViewMenu value={view} onValueChange={setView} views={[
    { id: "all", label: "All accounts", scope: "system" },
    { id: "risk", label: "At risk", scope: "personal" },
  ]} />;
}`,
  "column-visibility-menu": `import { ColumnVisibilityMenu } from "whatiuse";

export function AccountColumns({ columns, setVisible }) {
  return <ColumnVisibilityMenu columns={columns} onVisibilityChange={setVisible} />;
}`,
  "facet-filter": `import { FacetFilter } from "whatiuse";

export function StatusFilter({ values, setValues }) {
  return <FacetFilter label="Status" values={values} onValuesChange={setValues} options={[
    { value: "active", label: "Active", count: 18 },
    { value: "risk", label: "At risk", count: 4 },
  ]} />;
}`,
  "data-sort-menu": `import { DataSortMenu } from "whatiuse";

export function AccountSort({ value, setValue }) {
  return <DataSortMenu value={value} onValueChange={setValue} options={[
    { id: "updated", label: "Updated" },
    { id: "arr", label: "ARR" },
  ]} />;
}`,
  "data-group-menu": `import { DataGroupMenu } from "whatiuse";

export function AccountGrouping({ value, setValue }) {
  return <DataGroupMenu value={value} onValueChange={setValue} options={[
    { id: "status", label: "Status" },
    { id: "owner", label: "Owner" },
  ]} />;
}`,
  "data-density-control": `import { DataDensityControl } from "whatiuse";

export function AccountDensity({ value, setValue }) {
  return <DataDensityControl value={value} onValueChange={setValue} />;
}`,
  "data-result-summary": `import { DataResultSummary } from "whatiuse";

export function AccountCount({ total, filtered, selected }) {
  return <DataResultSummary noun="account" total={total} filtered={filtered} selected={selected} />;
}`,
  "bulk-action-bar": `import { BulkActionBar, Button } from "whatiuse";

export function AccountBulkActions({ count, clear }) {
  return <BulkActionBar count={count} noun="account" onClear={clear} actions={
    <Button size="small" variant="ghost">Archive</Button>
  } />;
}`,
  "row-actions-menu": `import { RowActionsMenu } from "whatiuse";

export function AccountActions({ onAction }) {
  return <RowActionsMenu label="Account actions" actions={[
    { id: "open", label: "Open account" },
    { id: "archive", label: "Archive", destructive: true, separatorBefore: true },
  ]} onAction={onAction} />;
}`,
  "cursor-pagination": `import { CursorPagination } from "whatiuse";

export function AccountPages({ cursor, next, previous }) {
  return <CursorPagination hasPrevious={cursor.hasPrevious} hasNext={cursor.hasNext} range={cursor.label} onPrevious={previous} onNext={next} />;
}`,
  "date-range-filter": `import { DateRangeFilter } from "whatiuse";

export function UpdatedRange({ value, setValue }) {
  return <DateRangeFilter label="Updated" value={value} onValueChange={setValue} />;
}`,
  "data-export-menu": `import { DataExportMenu } from "whatiuse";

export function ExportAccounts({ rows, columns }) {
  return <DataExportMenu rows={rows} columns={columns} fileName="accounts" />;
}`,
  "property-list": `import { PropertyList } from "whatiuse";

export function AccountProperties({ account }) {
  return <PropertyList items={[
    { id: "owner", label: "Owner", value: account.owner },
    { id: "plan", label: "Plan", value: account.plan },
  ]} />;
}`,
  "audit-log": `import { AuditLog } from "whatiuse";

export function AccountHistory({ events }) {
  return <AuditLog label="Account history" items={events} />;
}`,
  "data-state": `import { Button, DataState } from "whatiuse";

export function AccountState({ retry }) {
  return <DataState state="error" action={<Button size="small" onClick={retry}>Try again</Button>} />;
}`,
  metric: `import { Metric, Sparkline } from "whatiuse";

export function RevenueMetric() {
  return <Metric label="Monthly recurring revenue" value="$104k" visual={
    <Sparkline values={[74, 79, 83, 91, 96, 104]} decorative />
  } />;
}`,
  sparkline: `import { Sparkline } from "whatiuse";

export function ActiveWorkspaceTrend() {
  return <Sparkline label="Active workspace trend" values={[3910, 4188, 4472, 4862]} fill />;
}`,
  chart: `import { Chart } from "whatiuse";

export function RevenueChart({ data, series }) {
  return <Chart title="Recurring revenue" data={data} series={series} type="area" />;
}`,
  histogram: `import { Histogram } from "whatiuse";

export function ResponseTimes({ bins }) {
  return <Histogram title="Response time" data={bins} />;
}`,
  "scatter-chart": `import { ScatterChart } from "whatiuse";

export function AccountHealth({ accounts }) {
  return <ScatterChart title="Account health" data={accounts} xLabel="Seats" yLabel="Weekly actions" />;
}`,
  "waterfall-chart": `import { WaterfallChart } from "whatiuse";

export function RevenueBridge({ changes }) {
  return <WaterfallChart title="Revenue bridge" data={changes} valueFormatter={(value) => "$" + value + "k"} />;
}`,
  "donut-chart": `import { DonutChart } from "whatiuse";

export function PlanMix({ plans }) {
  return <DonutChart title="Plan mix" centerLabel="Accounts" data={plans} />;
}`,
  "radar-chart": `import { RadarChart } from "whatiuse";

export function PlanComparison({ axes, plans }) {
  return <RadarChart title="Plan comparison" axes={axes} series={plans} />;
}`,
  gauge: `import { Gauge } from "whatiuse";

export function CapacityGauge({ usage }) {
  return <Gauge title="Workspace capacity" value={usage} max={100} label="Used" marker={{ value: 80, label: "Review" }} />;
}`,
  "sankey-chart": `import { SankeyChart } from "whatiuse";

export function SignupFlow({ nodes, links }) {
  return <SankeyChart title="Signup flow" nodes={nodes} links={links} />;
}`,
  heatmap: `import { Heatmap } from "whatiuse";

export function FeatureActivity({ columns, rows }) {
  return <Heatmap title="Feature activity" columns={columns} rows={rows} />;
}`,
  comparison: `import { Comparison } from "whatiuse";

export function RevenueComparison() {
  return <Comparison label="MRR comparison" current={104} previous={96} formatter={(value) => "$" + value + "k"} positiveDirection="up" />;
}`,
  breakdown: `import { Breakdown } from "whatiuse";

export function RevenueBreakdown({ channels, selected, setSelected }) {
  return <Breakdown label="Revenue by channel" items={channels} selectedId={selected} onSelect={(item) => setSelected(item.id)} />;
}`,
  goal: `import { Goal } from "whatiuse";

export function ActivationGoal() {
  return <Goal label="Activation goal" value={742} target={1000} />;
}`,
  funnel: `import { Funnel } from "whatiuse";

export function SignupFunnel({ stages, selected, setSelected }) {
  return <Funnel label="Signup funnel" stages={stages} selectedId={selected} onSelect={(stage) => setSelected(stage.id)} />;
}`,
  cohort: `import { Cohort } from "whatiuse";

export function RetentionCohort({ periods, rows }) {
  return <Cohort label="Weekly retention" periods={periods} rows={rows} />;
}`,
  timeline: `import { Timeline } from "whatiuse";

export function ReleaseTimeline({ events, selected, setSelected }) {
  return <Timeline label="Release events" items={events} activeId={selected} onSelect={(event) => setSelected(event.id)} />;
}`,
};
