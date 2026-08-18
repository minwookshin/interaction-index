import { useMemo, useState } from "react";
import {
  Badge,
  Breakdown,
  Chart,
  Cohort,
  Comparison,
  DataTable,
  DonutChart,
  type DataTableColumn,
  Funnel,
  Goal,
  Heatmap,
  Metric,
  SegmentedControl,
  Sparkline,
  Timeline,
  type AnalyticsDatum,
  type AnalyticsSeries,
  type FunnelStage,
  type TimelineItem,
} from "../components/ui";

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
const standardCurrencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "standard", maximumFractionDigits: 0 });
const currency = (value: number) => (value >= 10_000 ? compactCurrencyFormatter : standardCurrencyFormatter).format(value);
const percent = (value: number) => `${value.toFixed(1)}%`;

const channelData: readonly AnalyticsDatum[] = [
  ["Mar", 312, 168, 82], ["Apr", 338, 176, 91], ["May", 362, 194, 104],
  ["Jun", 391, 216, 116], ["Jul", 418, 238, 132], ["Aug", 446, 267, 148],
].map(([label, product, partner, outbound], index) => ({ id: `channel-${index}`, label: String(label), values: { product: Number(product), partner: Number(partner), outbound: Number(outbound) } }));

const channelSeries: readonly AnalyticsSeries[] = [
  { id: "product", label: "Product led", tone: "primary" },
  { id: "partner", label: "Partners", tone: "secondary" },
  { id: "outbound", label: "Outbound", tone: "tertiary" },
];

const activityRows = [
  { id: "create", label: "Create", values: [42, 58, 61, 54, 72, 31, 24] },
  { id: "search", label: "Search", values: [68, 74, 79, 76, 83, 45, 39] },
  { id: "automate", label: "Automate", values: [18, 24, 32, 37, 46, 22, 15] },
  { id: "share", label: "Share", values: [29, 35, 41, 44, 52, 26, 19] },
] as const;

export function AnalyticsRendererGallery() {
  return (
    <section className="teum-analytics-gallery" aria-label="Analytics renderer family">
      <header className="teum-analytics-gallery__header"><div><h3>Analytics primitives</h3><p>Metrics, trends, composition, and activity.</p></div></header>
      <div className="teum-analytics-gallery__metrics">
        <Metric label="MRR" value="$119.6k" trend={{ value: "+4.8%", label: "vs last month", direction: "up" }} visual={<Sparkline values={[82, 86, 91, 96, 105, 110, 114, 120]} decorative fill />} />
        <Metric label="Active workspaces" value="4,862" trend={{ value: "+318", label: "this month", direction: "up" }} visual={<Sparkline values={[3_910, 4_020, 4_188, 4_304, 4_472, 4_611, 4_742, 4_862]} decorative />} />
        <Metric label="Activation" value="56.9%" context="Trial workspaces" trend={{ value: "+2.1 pts", label: "vs prior period", direction: "up" }} />
      </div>
      <div className="teum-analytics-gallery__charts">
        <Chart title="Recurring revenue" description="Area is reserved for one primary ordered measure." data={revenueData.slice(-8)} series={revenueSeries} type="area" valueFormatter={(value) => currency(value)} />
        <Chart title="Acquisition mix" description="Stacked bars compare total volume and composition." data={channelData} series={channelSeries} type="stacked-bar" valueFormatter={(value) => Math.round(value).toLocaleString()} />
      </div>
      <div className="teum-analytics-gallery__details">
        <DonutChart title="Plan mix" description="Four categories form one account total." data={[
          { id: "team", label: "Team", value: 1_086, tone: "primary" },
          { id: "business", label: "Business", value: 482, tone: "secondary" },
          { id: "enterprise", label: "Enterprise", value: 196, tone: "tertiary" },
          { id: "starter", label: "Starter", value: 78, tone: "tertiary" },
        ]} valueFormatter={(value) => value.toLocaleString()} centerLabel="Accounts" />
        <Heatmap title="Feature activity" description="Median actions per active workspace." columns={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} rows={activityRows} valueFormatter={(value) => Math.round(value).toString()} />
      </div>
    </section>
  );
}

const revenueData: readonly AnalyticsDatum[] = [
  ["Sep", 78.2, 70.4], ["Oct", 81.1, 72.8], ["Nov", 83.8, 74.2], ["Dec", 86.5, 75.6],
  ["Jan", 88.9, 77.5], ["Feb", 92.4, 79.1], ["Mar", 95.8, 81.7], ["Apr", 99.6, 83.3],
  ["May", 104.8, 85.9], ["Jun", 109.7, 88.2], ["Jul", 114.1, 91.4], ["Aug", 119.6, 94.7],
].map(([label, current, previous], index) => ({ id: `revenue-${index}`, label: String(label), values: { current: Number(current) * 1_000, previous: Number(previous) * 1_000 } }));

const revenueSeries: readonly AnalyticsSeries[] = [
  { id: "current", label: "Current period", tone: "primary" },
  { id: "previous", label: "Previous period", tone: "secondary", lineStyle: "dashed" },
];

export function SaaSOverviewRecipe() {
  const [range, setRange] = useState("12m");
  const [openedPeriod, setOpenedPeriod] = useState<string | null>(null);
  const visibleData = range === "6m" ? revenueData.slice(-6) : revenueData;
  const current = visibleData.at(-1)!.values.current as number;
  const previous = visibleData.at(-1)!.values.previous as number;

  return (
    <section className="teum-analytics-recipe" aria-label="SaaS Overview recipe">
      <header className="teum-analytics-recipe__header"><div><h3>SaaS Overview</h3><p>Revenue, retention, and expansion.</p></div><SegmentedControl size="small" label="Revenue range" value={range} onValueChange={(value) => value && setRange(value)} options={[{ value: "6m", label: "6M" }, { value: "12m", label: "12M" }]} /></header>
      <div className="teum-analytics-recipe__metrics">
        <Metric label="MRR" value={currency(current)} trend={{ value: "+4.8%", label: "vs last month", direction: "up", sentiment: "positive" }} visual={<Sparkline values={visibleData.map((datum) => datum.values.current)} decorative fill />} />
        <Metric label="Net revenue retention" value="112.4%" trend={{ value: "+1.6 pts", label: "vs last quarter", direction: "up" }} context="Expansion exceeds churn" />
        <Metric label="Paying accounts" value="1,842" trend={{ value: "+74", label: "this month", direction: "up" }} context="38 enterprise" />
      </div>
      <div className="teum-analytics-recipe__primary">
        <Chart title="Recurring revenue" description={`${range === "6m" ? "Six" : "Twelve"}-month MRR with prior-period comparison.`} data={visibleData} series={revenueSeries} type="area" annotations={[{ id: "pricing", index: Math.max(0, visibleData.length - 4), label: "Pricing update" }]} valueFormatter={(value) => currency(value)} onDatumActivate={(datum) => setOpenedPeriod(datum.label)} />
        <aside className="teum-analytics-recipe__aside" aria-label="Revenue summary">
          <Comparison label="MRR comparison" current={current} previous={previous} formatter={currency} currentLabel="Current MRR" previousLabel="Prior-period MRR" positiveDirection="up" />
          <Goal label="Annual recurring revenue target" value={1_435_200} target={1_600_000} formatter={currency} description="On pace if current monthly growth holds." />
          <Breakdown label="MRR expansion drivers" formatter={(value) => currency(value)} items={[{ id: "seats", label: "Seat expansion", value: 18_400 }, { id: "upgrades", label: "Plan upgrades", value: 11_700, tone: "secondary" }, { id: "usage", label: "Usage", value: 6_900, tone: "tertiary" }]} />
        </aside>
      </div>
      <p className="teum-analytics-recipe__status" role="status">{openedPeriod ? `${openedPeriod} revenue opened.` : "Use the chart or View data to inspect exact values."}</p>
    </section>
  );
}

const usageData: readonly AnalyticsDatum[] = Array.from({ length: 14 }, (_, index) => ({
  id: `usage-${index}`,
  label: `Aug ${index + 3}`,
  values: {
    active: 4_180 + index * 122 + Math.round(Math.sin(index * 0.9) * 170),
    sessions: 6_920 + index * 205 + Math.round(Math.cos(index * 0.7) * 260),
    automation: 620 + index * 58 + Math.round(Math.sin(index * 0.6) * 44),
    search: 1_360 + index * 42 + Math.round(Math.cos(index * 0.8) * 70),
  },
}));

const usageSeries: readonly AnalyticsSeries[] = [
  { id: "active", label: "Daily active users", tone: "primary" },
  { id: "sessions", label: "Sessions", tone: "secondary", lineStyle: "dashed" },
];

const featureSeries: readonly AnalyticsSeries[] = [
  { id: "automation", label: "Automations", tone: "primary" },
  { id: "search", label: "Search", tone: "secondary", lineStyle: "dashed" },
];

const releaseEvents: readonly TimelineItem[] = [
  { id: "command", label: "Command menu shipped", timestamp: "Aug 7", description: "Workspace search and create actions", value: "+8.1%", tone: "accent" },
  { id: "automation", label: "Automation templates", timestamp: "Aug 12", description: "Eight starter workflows", value: "+12.6%", tone: "accent" },
  { id: "incident", label: "Search latency incident", timestamp: "Aug 15", description: "Resolved in 38 minutes", value: "−3.2%", tone: "danger" },
];

const releaseIndexes: Record<string, number> = { command: 4, automation: 9, incident: 12 };

export function ProductUsageRecipe() {
  const [releaseId, setReleaseId] = useState("automation");
  const latestDatum = usageData.at(-1)!;
  const activeRelease = releaseEvents.find((item) => item.id === releaseId)!;
  const annotationIndex = releaseIndexes[releaseId];
  const selectRelease = (item: TimelineItem) => setReleaseId(item.id);

  return (
    <section className="teum-analytics-recipe" aria-label="Product Usage recipe">
      <header className="teum-analytics-recipe__header"><div><h3>Product Usage</h3><p>Usage, features, and releases.</p></div><small>{activeRelease.timestamp}</small></header>
      <div className="teum-analytics-recipe__metrics teum-analytics-recipe__metrics--two">
        <Metric label="Daily active users" value={(latestDatum.values.active as number).toLocaleString()} trend={{ value: "+9.2%", label: "14-day change", direction: "up" }} visual={<Sparkline values={usageData.map((datum) => datum.values.active)} decorative />} />
        <Metric label="Automation adoption" value={`${((latestDatum.values.automation as number) / (latestDatum.values.active as number) * 100).toFixed(1)}%`} trend={{ value: "+3.4 pts", label: "since launch", direction: "up" }} context="Active workspaces" />
      </div>
      <div className="teum-analytics-recipe__charts">
        <Chart title="Active usage" description="Daily users and sessions." data={usageData} series={usageSeries} valueFormatter={(value) => value.toLocaleString()} annotations={[{ id: releaseId, index: annotationIndex, label: activeRelease.label, tone: releaseId === "incident" ? "danger" : "neutral" }]} />
        <Chart title="Feature events" description="Automation and search activity." data={usageData} series={featureSeries} type="bar" valueFormatter={(value) => value.toLocaleString()} />
      </div>
      <div className="teum-analytics-recipe__secondary">
        <Timeline label="Release timeline" items={releaseEvents} activeId={releaseId} onSelect={selectRelease} />
        <Breakdown label="Feature adoption" formatter={(value) => `${value}%`} items={[{ id: "search", label: "Search", value: 68 }, { id: "command", label: "Command menu", value: 54, tone: "secondary" }, { id: "automation", label: "Automations", value: 31, tone: "tertiary" }, { id: "integrations", label: "Integrations", value: 22, tone: "tertiary" }]} />
      </div>
    </section>
  );
}

const conversionStages: readonly FunnelStage[] = [
  { id: "visited", label: "Visited pricing", value: 18_420 },
  { id: "started", label: "Started trial", value: 7_360 },
  { id: "activated", label: "Activated", value: 4_188 },
  { id: "invited", label: "Invited teammate", value: 2_814 },
  { id: "paid", label: "Became paid", value: 1_742 },
];

const conversionTrend: readonly AnalyticsDatum[] = Array.from({ length: 12 }, (_, index) => ({
  id: `week-${index}`,
  label: `W${index + 1}`,
  values: Object.fromEntries(conversionStages.map((stage, stageIndex) => [stage.id, Math.round(stage.value / 12 * (0.78 + index * 0.034) * (1 - stageIndex * 0.025))])),
}));

const cohortRows = [
  { id: "aug-11", label: "Aug 11", size: 842, values: [1, .61, .48, .41, .37, .34] },
  { id: "aug-04", label: "Aug 04", size: 794, values: [1, .59, .47, .40, .36, null] },
  { id: "jul-28", label: "Jul 28", size: 766, values: [1, .57, .44, .38, null, null] },
  { id: "jul-21", label: "Jul 21", size: 721, values: [1, .55, .43, null, null, null] },
] as const;

type ConversionRecord = { id: string; account: string; stage: string; owner: string; age: string; };
const conversionRecords: readonly ConversionRecord[] = Array.from({ length: 18 }, (_, index) => ({
  id: `TRI-${String(284 - index).padStart(3, "0")}`,
  account: ["Northstar", "Fieldwork", "Relay", "Kindred", "Juniper", "Cinder"][index % 6],
  stage: conversionStages[index % conversionStages.length].id,
  owner: ["Mina", "Avery", "Noah"][index % 3],
  age: `${index + 1}d`,
}));

const conversionColumns: readonly DataTableColumn<ConversionRecord>[] = [
  { id: "account", header: "Account", accessor: "account", width: 180 },
  { id: "owner", header: "Owner", accessor: "owner", width: 120 },
  { id: "age", header: "Age", accessor: "age", width: 72, align: "end" },
  { id: "status", header: "Status", width: 104, align: "end", cell: () => <Badge variant="outline">Open</Badge> },
];

export function ConversionRetentionRecipe() {
  const [stageId, setStageId] = useState("activated");
  const stage = conversionStages.find((item) => item.id === stageId)!;
  const stageIndex = conversionStages.findIndex((item) => item.id === stageId);
  const prior = conversionStages[Math.max(0, stageIndex - 1)];
  const selectedRecords = useMemo(() => conversionRecords.filter((record) => record.stage === stageId), [stageId]);
  const selectedSeries = useMemo<readonly AnalyticsSeries[]>(() => [{ id: stageId, label: stage.label, tone: "primary" }], [stage.label, stageId]);

  return (
    <section className="teum-analytics-recipe" aria-label="Conversion and Retention recipe">
      <header className="teum-analytics-recipe__header"><div><h3>Conversion &amp; Retention</h3><p>Select a stage to update the trend and records.</p></div><small>12 weeks</small></header>
      <div className="teum-analytics-recipe__metrics teum-analytics-recipe__metrics--two">
        <Metric label="Trial to paid" value={percent(conversionStages.at(-1)!.value / conversionStages[1].value * 100)} trend={{ value: "+2.1 pts", label: "vs prior period", direction: "up" }} />
        <Metric label={`${stage.label} conversion`} value={stageIndex === 0 ? "Entry" : percent(stage.value / prior.value * 100)} context={`${stage.value.toLocaleString()} accounts`} visual={<Sparkline values={conversionTrend.map((datum) => datum.values[stageId])} decorative fill />} />
      </div>
      <div className="teum-analytics-recipe__conversion">
        <Funnel label="Signup funnel" stages={conversionStages} selectedId={stageId} onSelect={(next) => setStageId(next.id)} />
        <Chart title={`${stage.label} trend`} description="Weekly count for the selected funnel stage." data={conversionTrend} series={selectedSeries} type="bar" includeZero valueFormatter={(value) => Math.round(value).toLocaleString()} />
      </div>
      <Cohort label="Weekly workspace retention" periods={["W0", "W1", "W2", "W3", "W4", "W5"]} rows={cohortRows} />
      <div className="teum-analytics-recipe__records"><div><strong>{stage.label}</strong><span>{selectedRecords.length} sample accounts</span></div><DataTable ariaLabel={`${stage.label} accounts`} data={selectedRecords} columns={conversionColumns} getRowId={(record) => record.id} emptyTitle="No accounts" emptyDescription="No records reached this stage." /></div>
    </section>
  );
}
