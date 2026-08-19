import { useMemo, useState } from "react";
import {
  Badge,
  Breakdown,
  Chart,
  Cohort,
  Comparison,
  DataExportMenu,
  DataResultSummary,
  DataTable,
  DataToolbar,
  DateRangeFilter,
  DonutChart,
  type DataTableColumn,
  FacetFilter,
  Funnel,
  Goal,
  Heatmap,
  Metric,
  PropertyList,
  SavedViewMenu,
  SearchInput,
  SegmentedControl,
  Sparkline,
  type AnalyticsDatum,
  type AnalyticsSeries,
  type FunnelStage,
} from "../components/ui";
import type { DataExportColumn } from "../lib/data-export";
import type { DataDateRange } from "../lib/data-view-state";

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
    <section className="whatiuse-analytics-gallery" aria-label="Analytics renderer family">
      <div className="whatiuse-analytics-gallery__metrics">
        <Metric label="MRR" value="$119.6k" trend={{ value: "+4.8%", label: "vs last month", direction: "up" }} visual={<Sparkline values={[82, 86, 91, 96, 105, 110, 114, 120]} decorative fill />} />
        <Metric label="Active workspaces" value="4,862" trend={{ value: "+318", label: "this month", direction: "up" }} visual={<Sparkline values={[3_910, 4_020, 4_188, 4_304, 4_472, 4_611, 4_742, 4_862]} decorative />} />
        <Metric label="Activation" value="56.9%" context="Trial workspaces" trend={{ value: "+2.1 pts", label: "vs prior period", direction: "up" }} />
      </div>
      <div className="whatiuse-analytics-gallery__charts">
        <Chart title="Recurring revenue" description="Area is reserved for one primary ordered measure." data={revenueData.slice(-8)} series={revenueSeries} type="area" valueFormatter={(value) => currency(value)} />
        <Chart title="Acquisition mix" description="Stacked bars compare total volume and composition." data={channelData} series={channelSeries} type="stacked-bar" valueFormatter={(value) => Math.round(value).toLocaleString()} />
      </div>
      <div className="whatiuse-analytics-gallery__details">
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
    <section className="whatiuse-analytics-recipe" aria-label="SaaS Overview recipe">
      <header className="whatiuse-analytics-recipe__header"><div><h3>SaaS Overview</h3><p>Revenue, retention, and expansion.</p></div><SegmentedControl size="small" label="Revenue range" value={range} onValueChange={(value) => value && setRange(value)} options={[{ value: "6m", label: "6M" }, { value: "12m", label: "12M" }]} /></header>
      <div className="whatiuse-analytics-recipe__metrics">
        <Metric label="MRR" value={currency(current)} trend={{ value: "+4.8%", label: "vs last month", direction: "up", sentiment: "positive" }} visual={<Sparkline values={visibleData.map((datum) => datum.values.current)} decorative fill />} />
        <Metric label="Net revenue retention" value="112.4%" trend={{ value: "+1.6 pts", label: "vs last quarter", direction: "up" }} context="Expansion exceeds churn" />
        <Metric label="Paying accounts" value="1,842" trend={{ value: "+74", label: "this month", direction: "up" }} context="38 enterprise" />
      </div>
      <div className="whatiuse-analytics-recipe__primary">
        <Chart title="Recurring revenue" description={`${range === "6m" ? "Six" : "Twelve"}-month MRR with prior-period comparison.`} data={visibleData} series={revenueSeries} type="area" annotations={[{ id: "pricing", index: Math.max(0, visibleData.length - 4), label: "Pricing update" }]} valueFormatter={(value) => currency(value)} onDatumActivate={(datum) => setOpenedPeriod(datum.label)} />
        <aside className="whatiuse-analytics-recipe__aside" aria-label="Revenue summary">
          <Comparison label="MRR comparison" current={current} previous={previous} formatter={currency} currentLabel="Current MRR" previousLabel="Prior-period MRR" positiveDirection="up" />
          <Goal label="Annual recurring revenue target" value={1_435_200} target={1_600_000} formatter={currency} description="On pace if current monthly growth holds." />
          <Breakdown label="MRR expansion drivers" formatter={(value) => currency(value)} items={[{ id: "seats", label: "Seat expansion", value: 18_400 }, { id: "upgrades", label: "Plan upgrades", value: 11_700, tone: "secondary" }, { id: "usage", label: "Usage", value: 6_900, tone: "tertiary" }]} />
        </aside>
      </div>
      <p className="whatiuse-analytics-recipe__status" role="status">{openedPeriod ? `${openedPeriod} revenue opened.` : "Use the chart or View data to inspect exact values."}</p>
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

type UsageAccount = {
  id: string;
  account: string;
  plan: "Team" | "Business" | "Enterprise";
  status: "Active" | "At risk" | "Trial";
  stage: "visited" | "started" | "activated" | "invited" | "paid";
  activeUsers: number;
  adoption: number;
  features: readonly string[];
  lastSeen: string;
};

const usageAccounts: readonly UsageAccount[] = [
  { id: "ACC-184", account: "Northstar", plan: "Enterprise", status: "Active", stage: "paid", activeUsers: 284, adoption: 92, features: ["automation", "search"], lastSeen: "4m" },
  { id: "ACC-176", account: "Fieldwork", plan: "Business", status: "Active", stage: "paid", activeUsers: 126, adoption: 78, features: ["command", "search"], lastSeen: "14m" },
  { id: "ACC-168", account: "Relay", plan: "Team", status: "Trial", stage: "invited", activeUsers: 44, adoption: 63, features: ["search"], lastSeen: "32m" },
  { id: "ACC-159", account: "Kindred", plan: "Business", status: "At risk", stage: "activated", activeUsers: 68, adoption: 51, features: ["automation"], lastSeen: "2h" },
  { id: "ACC-151", account: "Juniper", plan: "Enterprise", status: "Active", stage: "paid", activeUsers: 197, adoption: 86, features: ["integrations", "automation"], lastSeen: "7m" },
  { id: "ACC-147", account: "Cinder", plan: "Team", status: "Active", stage: "activated", activeUsers: 39, adoption: 57, features: ["command"], lastSeen: "1h" },
  { id: "ACC-138", account: "Atlas", plan: "Enterprise", status: "At risk", stage: "invited", activeUsers: 111, adoption: 42, features: ["automation", "integrations"], lastSeen: "3h" },
  { id: "ACC-129", account: "Willow", plan: "Business", status: "Active", stage: "paid", activeUsers: 96, adoption: 74, features: ["search", "command"], lastSeen: "24m" },
  { id: "ACC-121", account: "Acme", plan: "Team", status: "Trial", stage: "started", activeUsers: 18, adoption: 28, features: ["search"], lastSeen: "6h" },
  { id: "ACC-114", account: "Marble", plan: "Business", status: "Active", stage: "activated", activeUsers: 73, adoption: 66, features: ["automation", "command"], lastSeen: "48m" },
  { id: "ACC-106", account: "Lantern", plan: "Enterprise", status: "Active", stage: "paid", activeUsers: 154, adoption: 81, features: ["integrations", "search"], lastSeen: "11m" },
  { id: "ACC-098", account: "Paper", plan: "Business", status: "At risk", stage: "started", activeUsers: 29, adoption: 35, features: ["command"], lastSeen: "8h" },
];

const usageFeatureOptions = [
  { id: "search", label: "Search" },
  { id: "command", label: "Command" },
  { id: "automation", label: "Automations" },
  { id: "integrations", label: "Integrations" },
] as const;

const usageViews = [
  { id: "all", label: "All accounts", description: "No account filters", count: usageAccounts.length, scope: "system" as const },
  { id: "at-risk", label: "At risk", description: "Needs follow-up", count: usageAccounts.filter((account) => account.status === "At risk").length, scope: "system" as const },
  { id: "enterprise", label: "Enterprise", description: "Largest workspaces", count: usageAccounts.filter((account) => account.plan === "Enterprise").length, scope: "system" as const },
] as const;

const usageRangePresets = [
  { id: "seven-days", label: "7 days", getValue: () => ({ from: "2026-08-10", to: "2026-08-16" }) },
  { id: "fourteen-days", label: "14 days", getValue: () => ({ from: "2026-08-03", to: "2026-08-16" }) },
] as const;

const usageTableColumns: readonly DataTableColumn<UsageAccount>[] = [
  { id: "account", header: "Account", accessor: "account", sortable: true, width: 174 },
  { id: "plan", header: "Plan", accessor: "plan", sortable: true, width: 112 },
  { id: "status", header: "Status", accessor: "status", width: 100, cell: (account) => <Badge variant={account.status === "Trial" ? "outline" : "neutral"}>{account.status}</Badge> },
  { id: "activeUsers", header: "Users", accessor: "activeUsers", sortable: true, sortType: "basic", align: "end", width: 78 },
  { id: "adoption", header: "Adoption", accessor: "adoption", sortable: true, sortType: "basic", align: "end", width: 94, cell: (account) => `${account.adoption}%` },
  { id: "lastSeen", header: "Seen", accessor: "lastSeen", align: "end", width: 68 },
];

const usageExportColumns: readonly DataExportColumn<UsageAccount>[] = [
  { id: "account", header: "Account", value: "account" },
  { id: "plan", header: "Plan", value: "plan" },
  { id: "status", header: "Status", value: "status" },
  { id: "activeUsers", header: "Active users", value: "activeUsers" },
  { id: "adoption", header: "Adoption", value: "adoption" },
  { id: "lastSeen", header: "Last seen", value: "lastSeen" },
];

function daysInRange(range: DataDateRange) {
  if (!range.from || !range.to) return usageData.length;
  const from = Date.parse(`${range.from}T12:00:00Z`);
  const to = Date.parse(`${range.to}T12:00:00Z`);
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return usageData.length;
  return Math.min(usageData.length, Math.max(1, Math.round((to - from) / 86_400_000) + 1));
}

export function ProductUsageRecipe() {
  const [dateRange, setDateRange] = useState<DataDateRange>({ from: "2026-08-03", to: "2026-08-16" });
  const [search, setSearch] = useState("");
  const [statusValues, setStatusValues] = useState<readonly string[]>([]);
  const [planValues, setPlanValues] = useState<readonly string[]>([]);
  const [viewId, setViewId] = useState("all");
  const [featureId, setFeatureId] = useState("all");
  const [stageId, setStageId] = useState("all");
  const [activeAccountId, setActiveAccountId] = useState<string | null>(usageAccounts[0].id);

  const accountMatchesToolbar = useMemo(() => usageAccounts.filter((account) => {
    const query = search.trim().toLocaleLowerCase();
    if (query && !`${account.account} ${account.id} ${account.plan}`.toLocaleLowerCase().includes(query)) return false;
    if (statusValues.length > 0 && !statusValues.includes(account.status.toLocaleLowerCase().replace(" ", "-"))) return false;
    if (planValues.length > 0 && !planValues.includes(account.plan.toLocaleLowerCase())) return false;
    return true;
  }), [planValues, search, statusValues]);

  const filteredAccounts = useMemo(() => accountMatchesToolbar.filter((account) => {
    if (featureId !== "all" && !account.features.includes(featureId)) return false;
    if (stageId !== "all" && account.stage !== stageId) return false;
    return true;
  }), [accountMatchesToolbar, featureId, stageId]);

  const ratio = accountMatchesToolbar.length / usageAccounts.length;
  const visibleUsage = useMemo(() => usageData.slice(-daysInRange(dateRange)).map((datum) => ({
    ...datum,
    values: Object.fromEntries(Object.entries(datum.values).map(([key, value]) => [key, typeof value === "number" ? Math.round(value * ratio) : value])),
  })), [dateRange, ratio]);
  const latestDatum = visibleUsage.at(-1) ?? usageData.at(-1)!;
  const activeAccount = filteredAccounts.find((account) => account.id === activeAccountId) ?? filteredAccounts[0] ?? null;
  const featureItems = usageFeatureOptions.map((feature, index) => ({
    id: feature.id,
    label: feature.label,
    value: accountMatchesToolbar.length ? Math.round(accountMatchesToolbar.filter((account) => account.features.includes(feature.id)).length / accountMatchesToolbar.length * 100) : 0,
    tone: index === 0 ? "primary" as const : index === 1 ? "secondary" as const : "tertiary" as const,
  }));
  const scaledStages = conversionStages.map((stage) => ({ ...stage, value: Math.round(stage.value * ratio) }));

  const selectView = (nextViewId: string) => {
    setViewId(nextViewId);
    setSearch("");
    setFeatureId("all");
    setStageId("all");
    setStatusValues(nextViewId === "at-risk" ? ["at-risk"] : []);
    setPlanValues(nextViewId === "enterprise" ? ["enterprise"] : []);
  };

  return (
    <section className="whatiuse-analytics-recipe whatiuse-usage-explorer" aria-label="Usage and Adoption Explorer">
      <header className="whatiuse-analytics-recipe__header"><div><h3>Usage &amp; Adoption</h3><p>Inspect usage, activation, and account health.</p></div><small>{filteredAccounts.length} accounts</small></header>
      <DataToolbar
        label="Usage filters"
        start={<>
          <SearchInput label="Search accounts" placeholder="Search accounts…" value={search} onChange={(event) => setSearch(event.currentTarget.value)} onClear={() => setSearch("")} />
          <DateRangeFilter value={dateRange} onValueChange={setDateRange} presets={usageRangePresets} />
          <FacetFilter label="Status" values={statusValues} onValuesChange={setStatusValues} options={[{ value: "active", label: "Active", count: 7 }, { value: "at-risk", label: "At risk", count: 3 }, { value: "trial", label: "Trial", count: 2 }]} />
          <FacetFilter label="Plan" values={planValues} onValuesChange={setPlanValues} options={[{ value: "team", label: "Team", count: 3 }, { value: "business", label: "Business", count: 5 }, { value: "enterprise", label: "Enterprise", count: 4 }]} />
        </>}
        end={<>
          <SavedViewMenu views={usageViews} value={viewId} onValueChange={selectView} label="View" />
          <DataExportMenu rows={filteredAccounts} columns={usageExportColumns} fileName="usage-adoption" download={false} />
        </>}
      />
      <div className="whatiuse-analytics-recipe__metrics">
        <Metric label="Daily active users" value={(latestDatum.values.active as number).toLocaleString()} trend={{ value: "+9.2%", label: `${visibleUsage.length}-day change`, direction: "up" }} visual={<Sparkline values={visibleUsage.map((datum) => datum.values.active)} decorative />} />
        <Metric label="Activated accounts" value={Math.round(scaledStages[2].value).toLocaleString()} trend={{ value: `${percent(scaledStages[2].value / Math.max(1, scaledStages[1].value) * 100)}`, label: "from trial", direction: "up" }} />
        <Metric label="Feature adoption" value={`${accountMatchesToolbar.length ? Math.round(accountMatchesToolbar.reduce((sum, account) => sum + account.adoption, 0) / accountMatchesToolbar.length) : 0}%`} context={`${accountMatchesToolbar.length} matching accounts`} />
      </div>
      <div className="whatiuse-usage-explorer__primary">
        <Chart title="Active usage" description="Daily users and sessions." data={visibleUsage} series={usageSeries} valueFormatter={(value) => value.toLocaleString()} />
        <section className="whatiuse-usage-explorer__module" aria-labelledby="feature-adoption-title">
          <header><div><h4 id="feature-adoption-title">Feature adoption</h4><p>Select to filter accounts.</p></div>{featureId !== "all" && <button type="button" onClick={() => setFeatureId("all")}>Clear</button>}</header>
          <Breakdown label="Feature adoption" selectedId={featureId} onSelect={(item) => setFeatureId((current) => current === item.id ? "all" : item.id)} formatter={(value) => `${value}%`} items={featureItems} />
        </section>
      </div>
      <div className="whatiuse-usage-explorer__journey">
        <section className="whatiuse-usage-explorer__module" aria-labelledby="activation-path-title">
          <header><div><h4 id="activation-path-title">Activation path</h4><p>Select a stage to filter accounts.</p></div>{stageId !== "all" && <button type="button" onClick={() => setStageId("all")}>Clear</button>}</header>
          <Funnel label="Activation path" stages={scaledStages} selectedId={stageId} onSelect={(stage) => setStageId((current) => current === stage.id ? "all" : stage.id)} />
        </section>
        <section className="whatiuse-usage-explorer__module" aria-labelledby="retention-title">
          <header><div><h4 id="retention-title">Retention</h4><p>Weekly active workspace cohorts.</p></div></header>
          <Cohort label="Workspace retention" periods={["W0", "W1", "W2", "W3", "W4", "W5"]} rows={cohortRows} />
        </section>
      </div>
      <div className="whatiuse-analytics-recipe__records whatiuse-usage-explorer__records">
        <div><strong>Accounts</strong><DataResultSummary total={usageAccounts.length} filtered={filteredAccounts.length} noun="account" detail={[featureId !== "all" ? usageFeatureOptions.find((feature) => feature.id === featureId)?.label : null, stageId !== "all" ? conversionStages.find((stage) => stage.id === stageId)?.label : null].filter(Boolean).join(" · ") || undefined} /></div>
        <DataTable ariaLabel="Usage accounts" data={filteredAccounts} columns={usageTableColumns} getRowId={(account) => account.id} getRowLabel={(account) => account.account} paginate={false} defaultSorting={[{ id: "adoption", direction: "desc" }]} onRowActivate={(account) => setActiveAccountId(account.id)} emptyTitle="No matching accounts" emptyDescription="Clear a filter to see accounts." />
        {activeAccount && <aside className="whatiuse-usage-explorer__detail" aria-label={`${activeAccount.account} details`}>
          <div><span>Selected account</span><strong>{activeAccount.account}</strong></div>
          <PropertyList columns={2} items={[{ id: "plan", label: "Plan", value: activeAccount.plan }, { id: "status", label: "Status", value: activeAccount.status }, { id: "users", label: "Active users", value: activeAccount.activeUsers.toLocaleString() }, { id: "adoption", label: "Adoption", value: `${activeAccount.adoption}%` }]} />
        </aside>}
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
    <section className="whatiuse-analytics-recipe" aria-label="Conversion and Retention recipe">
      <header className="whatiuse-analytics-recipe__header"><div><h3>Conversion &amp; Retention</h3><p>Select a stage to update the trend and records.</p></div><small>12 weeks</small></header>
      <div className="whatiuse-analytics-recipe__metrics whatiuse-analytics-recipe__metrics--two">
        <Metric label="Trial to paid" value={percent(conversionStages.at(-1)!.value / conversionStages[1].value * 100)} trend={{ value: "+2.1 pts", label: "vs prior period", direction: "up" }} />
        <Metric label={`${stage.label} conversion`} value={stageIndex === 0 ? "Entry" : percent(stage.value / prior.value * 100)} context={`${stage.value.toLocaleString()} accounts`} visual={<Sparkline values={conversionTrend.map((datum) => datum.values[stageId])} decorative fill />} />
      </div>
      <div className="whatiuse-analytics-recipe__conversion">
        <Funnel label="Signup funnel" stages={conversionStages} selectedId={stageId} onSelect={(next) => setStageId(next.id)} />
        <Chart title={`${stage.label} trend`} description="Weekly count for the selected funnel stage." data={conversionTrend} series={selectedSeries} type="bar" includeZero valueFormatter={(value) => Math.round(value).toLocaleString()} />
      </div>
      <Cohort label="Weekly workspace retention" periods={["W0", "W1", "W2", "W3", "W4", "W5"]} rows={cohortRows} />
      <div className="whatiuse-analytics-recipe__records"><div><strong>{stage.label}</strong><span>{selectedRecords.length} sample accounts</span></div><DataTable ariaLabel={`${stage.label} accounts`} data={selectedRecords} columns={conversionColumns} getRowId={(record) => record.id} emptyTitle="No accounts" emptyDescription="No records reached this stage." /></div>
    </section>
  );
}
