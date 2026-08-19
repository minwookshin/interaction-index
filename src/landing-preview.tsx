import { useMemo, useState } from "react";
import { AsyncActionButton } from "./components/showcase/async-action-button";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Chart } from "./components/ui/chart";
import { DataTable, type DataTableColumn } from "./components/ui/data-table";
import { Metric } from "./components/ui/metric";
import { SearchInput } from "./components/ui/search-input";
import { Switch } from "./components/ui/switch";
import { TextField } from "./components/ui/text-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import type { AnalyticsDatum, AnalyticsSeries } from "./lib/analytics";
import "./styles.css";

type CollectionId = "core" | "data" | "analytics";

const collections: readonly { id: CollectionId; label: string }[] = [
  { id: "core", label: "Core" },
  { id: "data", label: "Data" },
  { id: "analytics", label: "Analytics" },
] as const;

type IssueRow = {
  id: string;
  issue: string;
  status: "Backlog" | "In progress" | "Done";
  owner: string;
  updated: string;
};

const issueRows: readonly IssueRow[] = [
  { id: "INT-204", issue: "Polish onboarding motion", status: "In progress", owner: "Avery", updated: "12 min" },
  { id: "INT-198", issue: "Review empty states", status: "Done", owner: "Mina", updated: "43 min" },
  { id: "INT-191", issue: "Ship data filters", status: "Backlog", owner: "Noah", updated: "2 hr" },
  { id: "INT-184", issue: "Audit keyboard focus", status: "In progress", owner: "Sofia", updated: "5 hr" },
] as const;

const issueColumns: readonly DataTableColumn<IssueRow>[] = [
  {
    id: "issue",
    header: "Issue",
    accessor: "issue",
    sortable: true,
    cell: (row) => <span className="landing-data-preview__issue"><strong>{row.issue}</strong><small>{row.id}</small></span>,
    width: "44%",
  },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    cell: (row) => <Badge variant={row.status === "Done" ? "strong" : "outline"}>{row.status}</Badge>,
    width: "22%",
  },
  { id: "owner", header: "Owner", accessor: "owner", width: "18%" },
  { id: "updated", header: "Updated", accessor: "updated", align: "end", width: "16%" },
] as const;

const analyticsData: readonly AnalyticsDatum[] = [
  { id: "jan", label: "Jan", values: { completed: 62, created: 74 } },
  { id: "feb", label: "Feb", values: { completed: 70, created: 79 } },
  { id: "mar", label: "Mar", values: { completed: 78, created: 83 } },
  { id: "apr", label: "Apr", values: { completed: 84, created: 88 } },
  { id: "may", label: "May", values: { completed: 91, created: 94 } },
  { id: "jun", label: "Jun", values: { completed: 102, created: 98 } },
] as const;

const analyticsSeries: readonly AnalyticsSeries[] = [
  { id: "completed", label: "Completed", tone: "primary" },
  { id: "created", label: "Created", tone: "secondary", lineStyle: "dashed" },
] as const;

function CorePreview() {
  return <div className="landing-core-preview">
    <section className="landing-core-preview__surface" aria-labelledby="landing-core-title">
      <header><h2 id="landing-core-title">Project settings</h2></header>
      <form onSubmit={(event) => event.preventDefault()}>
        <TextField label="Project name" defaultValue="Product refresh" />
        <TextField label="Identifier" defaultValue="PRD" />
        <div className="landing-core-preview__setting">
          <Switch defaultChecked label="Add new issues to the active cycle" />
        </div>
        <div className="landing-core-preview__actions">
          <Button variant="quiet">Cancel</Button>
          <AsyncActionButton compact idleLabel="Save" loadingLabel="Saving" successLabel="Saved" showIdleArrow={false} />
        </div>
      </form>
    </section>
  </div>;
}

function DataPreview() {
  const [query, setQuery] = useState("");
  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return issueRows;
    return issueRows.filter((row) => [row.id, row.issue, row.status, row.owner].some((value) => value.toLowerCase().includes(normalized)));
  }, [query]);

  return <div className="landing-data-preview">
    <section className="landing-data-preview__surface" aria-labelledby="landing-data-title">
      <header>
        <h2 id="landing-data-title">Issues</h2>
        <SearchInput label="Search issues" placeholder="Search issues" value={query} onChange={(event) => setQuery(event.currentTarget.value)} onClear={() => setQuery("")} />
      </header>
      <DataTable ariaLabel="Issue preview" data={filteredRows} columns={issueColumns} getRowId={(row) => row.id} paginate={false} emptyTitle="No matching issues" />
    </section>
  </div>;
}

function AnalyticsPreview() {
  return <div className="landing-analytics-preview">
    <section className="landing-analytics-preview__surface" aria-labelledby="landing-analytics-title">
      <h2 id="landing-analytics-title" className="whatiuse-sr-only">Issue analytics</h2>
      <div className="landing-analytics-preview__metrics">
        <Metric label="Completed" value="102" />
        <Metric label="Created" value="98" />
      </div>
      <Chart title="Issue velocity" data={analyticsData} series={analyticsSeries} type="line" height={210} />
    </section>
  </div>;
}

export function LandingCollectionPreview() {
  const [active, setActive] = useState<CollectionId>("core");

  return <Tabs render={<section />} className="landing-collection-preview" aria-label="whatiuse component collections" value={active} onValueChange={(value) => setActive(value as CollectionId)}>
    <header className="landing-collection-preview__header">
      <TabsList aria-label="Component collections">{collections.map((collection) => <TabsTrigger value={collection.id} key={collection.id}>{collection.label}</TabsTrigger>)}</TabsList>
    </header>
    <TabsContent value="core" className="landing-collection-preview__body"><CorePreview /></TabsContent>
    <TabsContent value="data" className="landing-collection-preview__body"><DataPreview /></TabsContent>
    <TabsContent value="analytics" className="landing-collection-preview__body"><AnalyticsPreview /></TabsContent>
  </Tabs>;
}
