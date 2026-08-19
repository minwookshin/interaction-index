import { ArrowsClockwise } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  BulkActionBar,
  Button,
  ColumnManager,
  DataExportMenu,
  DataTable,
  type DataTableColumn,
  DataToolbar,
  DateRangeFilter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FilterBuilder,
  type FilterField,
  IconButton,
  SavedViews,
  SearchInput,
  TextField,
  createDataViewState,
  getDataRequestKey,
  toDataRequest,
  useDataViewState,
  useSavedViews,
  type DataExportColumn,
  type DataSavedView,
  type DataViewFilter,
  type DataViewState,
  toast,
} from "../components/ui";

type CustomerRecord = {
  id: string;
  customer: string;
  domain: string;
  plan: "Starter" | "Growth" | "Enterprise";
  status: "Active" | "At risk" | "Trial";
  owner: string;
  arr: number;
  renewal: string;
};

type AuditRecord = {
  id: string;
  event: "Member invited" | "Role changed" | "API key created" | "Export downloaded" | "SSO policy updated";
  actor: string;
  target: string;
  outcome: "Succeeded" | "Blocked";
  occurredAt: string;
};

const owners = ["Avery Stone", "Mina Park", "Noah Williams", "Sofia Chen"] as const;
const companyWords = ["Northstar", "Kindred", "Relay", "Juniper", "Arc", "Fieldwork", "Cinder", "Kite", "Cobalt", "Plain"] as const;
const plans = ["Starter", "Growth", "Enterprise"] as const;
const customerStatuses = ["Active", "Active", "Active", "At risk", "Trial"] as const;
const shortDateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const shortDateTimeFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" });

const customerRecords: readonly CustomerRecord[] = Array.from({ length: 5_000 }, (_, index) => {
  const company = `${companyWords[index % companyWords.length]} ${String(Math.floor(index / companyWords.length) + 1).padStart(3, "0")}`;
  const renewal = new Date(Date.UTC(2026, 7, 1 + ((index * 11) % 180))).toISOString().slice(0, 10);
  return {
    id: `CUS-${String(index + 1).padStart(5, "0")}`,
    customer: company,
    domain: `${company.toLowerCase().replaceAll(" ", "-")}.com`,
    plan: plans[index % plans.length],
    status: customerStatuses[index % customerStatuses.length],
    owner: owners[index % owners.length],
    arr: 1_200 + ((index * 1_379) % 198_800),
    renewal,
  };
});

const auditEvents = ["Member invited", "Role changed", "API key created", "Export downloaded", "SSO policy updated"] as const;
const auditRecords: readonly AuditRecord[] = Array.from({ length: 10_000 }, (_, index) => ({
  id: `AUD-${String(index + 1).padStart(6, "0")}`,
  event: auditEvents[index % auditEvents.length],
  actor: owners[index % owners.length],
  target: index % 3 === 0 ? `Workspace ${index % 41}` : `Member ${index % 307}`,
  outcome: index % 17 === 0 ? "Blocked" : "Succeeded",
  occurredAt: new Date(Date.UTC(2026, 7, 16, 12) - index * 60 * 60 * 1_000).toISOString(),
}));

const viewTimestamp = "2026-08-16T00:00:00.000Z";

function systemView(id: string, label: string, state: DataViewState, description?: string): DataSavedView {
  return { id, label, description, state, scope: "system", createdAt: viewTimestamp, updatedAt: viewTimestamp };
}

const customerBaseState = createDataViewState({
  viewId: "all-customers",
  pagination: { page: 1, pageSize: 8 },
  sorting: [{ id: "customer", direction: "asc" }],
  columnVisibility: { domain: false, owner: false },
  columnSizing: { customer: 148, domain: 188, plan: 86, status: 90, owner: 132, arr: 78, renewal: 108 },
  columnPinning: { start: [], end: [] },
});

const customerSystemViews = [
  systemView("all-customers", "All customers", customerBaseState, "Every account"),
  systemView("at-risk", "At risk", createDataViewState({
    ...customerBaseState,
    viewId: "at-risk",
    filters: [{ id: "status:is", fieldId: "status", operator: "is", value: "At risk" }],
    sorting: [{ id: "arr", direction: "desc" }],
  }), "Accounts needing review"),
  systemView("enterprise-renewals", "Enterprise renewals", createDataViewState({
    ...customerBaseState,
    viewId: "enterprise-renewals",
    filters: [{ id: "plan:is", fieldId: "plan", operator: "is", value: "Enterprise" }],
    dateRange: { from: "2026-08-01", to: "2026-10-31" },
  }), "Renewing this quarter"),
] as const;

const customerFilterFields: readonly FilterField[] = [
  { id: "plan", label: "Plan", values: plans.map((value) => ({ label: value, value })) },
  { id: "status", label: "Status", values: ["Active", "At risk", "Trial"].map((value) => ({ label: value, value })) },
  { id: "owner", label: "Owner", values: owners.map((value) => ({ label: value, value })) },
  { id: "arr", label: "ARR", kind: "number", placeholder: "50000" },
  { id: "customer", label: "Customer", kind: "text", placeholder: "Company name" },
];

const customerColumns: readonly DataTableColumn<CustomerRecord>[] = [
  { id: "customer", header: "Customer", accessor: "customer", sortable: true, hideable: false, resizable: true, width: 148, minWidth: 148, maxWidth: 360 },
  { id: "domain", header: "Domain", accessor: "domain", resizable: true, width: 188, minWidth: 148 },
  { id: "plan", header: "Plan", accessor: "plan", sortable: true, resizable: true, width: 86 },
  { id: "status", header: "Status", accessor: "status", sortable: true, resizable: true, width: 90, cell: (row) => <Badge variant={row.status === "At risk" ? "warning" : row.status === "Active" ? "success" : "outline"}>{row.status}</Badge> },
  { id: "owner", header: "Owner", accessor: "owner", sortable: true, resizable: true, width: 132 },
  { id: "arr", header: "ARR", accessor: "arr", sortable: true, sortType: "basic", align: "end", resizable: true, width: 78, cell: (row) => `$${row.arr.toLocaleString()}` },
  { id: "renewal", header: "Renewal", accessor: "renewal", sortable: true, sortType: "datetime", align: "end", resizable: true, width: 108, cell: (row) => shortDateFormatter.format(new Date(`${row.renewal}T00:00:00.000Z`)) },
];

const customerExportColumns: readonly DataExportColumn<CustomerRecord>[] = customerColumns.map((column) => ({
  id: column.id,
  header: String(column.header),
  value: column.accessor as keyof CustomerRecord,
}));

function compareValues(left: unknown, right: unknown, direction: "asc" | "desc") {
  const result = typeof left === "number" && typeof right === "number"
    ? left - right
    : String(left ?? "").localeCompare(String(right ?? ""), undefined, { numeric: true });
  return direction === "desc" ? -result : result;
}

function matchesFilter(record: Record<string, unknown>, filter: DataViewFilter): boolean {
  const value = record[filter.fieldId];
  const expected = filter.value;
  switch (filter.operator) {
    case "is": return String(value) === String(expected);
    case "is-not": return String(value) !== String(expected);
    case "contains": return String(value).toLocaleLowerCase().includes(String(expected).toLocaleLowerCase());
    case "does-not-contain": return !String(value).toLocaleLowerCase().includes(String(expected).toLocaleLowerCase());
    case "greater-than": return Number(value) > Number(expected);
    case "less-than": return Number(value) < Number(expected);
    case "is-empty": return value === null || value === undefined || value === "";
    case "is-not-empty": return value !== null && value !== undefined && value !== "";
    default: return true;
  }
}

function queryCustomers(state: DataViewState) {
  const request = toDataRequest(state);
  const query = request.query.trim().toLocaleLowerCase();
  const filtered = customerRecords.filter((record) => {
    if (query && !`${record.customer} ${record.domain} ${record.owner}`.toLocaleLowerCase().includes(query)) return false;
    if (!request.filters.every((filter) => matchesFilter(record as unknown as Record<string, unknown>, filter))) return false;
    if (request.dateRange.from && record.renewal < request.dateRange.from) return false;
    if (request.dateRange.to && record.renewal > request.dateRange.to) return false;
    return true;
  });
  const sorting = request.sorting[0];
  const sorted = sorting
    ? [...filtered].sort((left, right) => compareValues(left[sorting.id as keyof CustomerRecord], right[sorting.id as keyof CustomerRecord], sorting.direction))
    : filtered;
  const start = (request.pagination.page - 1) * request.pagination.pageSize;
  return { rows: sorted.slice(start, start + request.pagination.pageSize), rowCount: sorted.length };
}

function SaveViewDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; onSave: (label: string) => void }) {
  const [label, setLabel] = useState("");
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) setLabel(""); onOpenChange(next); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Save view</DialogTitle><DialogDescription>Save the current query, filters, columns, and date range.</DialogDescription></DialogHeader>
        <form onSubmit={(event) => { event.preventDefault(); if (!label.trim()) return; onSave(label); setLabel(""); }}>
          <TextField autoFocus label="View name" value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Quarterly renewals" />
          <DialogFooter><Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" variant="primary" disabled={!label.trim()}>Save view</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CustomerDirectoryRecipe() {
  const { state, setState, patchState, isHydrated } = useDataViewState({
    initialState: customerBaseState,
    syncToUrl: true,
    parameterPrefix: "customers-",
  });
  const { views, saveView, updateView, removeView } = useSavedViews({
    storageKey: "whatiuse:data:customer-views:v1",
    systemViews: customerSystemViews,
    onStorageError: () => toast("Saved views are unavailable", { id: "customer-view-storage" }),
  });
  const [result, setResult] = useState(() => queryCustomers(customerBaseState));
  const [isFetching, setFetching] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<readonly string[]>([]);
  const [saveOpen, setSaveOpen] = useState(false);
  const requestKey = getDataRequestKey(state);

  useEffect(() => {
    if (!isHydrated) return;
    setFetching(true);
    const timer = window.setTimeout(() => {
      setResult(queryCustomers(state));
      setFetching(false);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [isHydrated, requestKey, state]);

  useEffect(() => setSelectedRowIds([]), [requestKey]);

  const selectedRows = result.rows.filter((row) => selectedRowIds.includes(row.id));
  const activeView = views.find((view) => view.id === state.viewId);
  const applyView = (id: string) => {
    const next = views.find((view) => view.id === id);
    if (next) setState(createDataViewState({ ...next.state, viewId: id }));
  };

  return (
    <section className="whatiuse-data-recipe" aria-label="Customer Directory recipe">
      <header className="whatiuse-data-recipe__header"><div><h3>Customer Directory</h3><p>Accounts and renewals</p></div><small>{result.rowCount.toLocaleString()} matches</small></header>
      <DataToolbar
        label="Customer data controls"
        start={<>
          <SearchInput label="Search customers" placeholder="Search customers…" value={state.query} loading={isFetching} onChange={(event) => patchState({ query: event.target.value })} onClear={() => patchState({ query: "" })} />
          <SavedViews
            label="Saved views"
            views={views.map((view) => ({ id: view.id, label: view.label, description: view.description, scope: view.scope }))}
            value={state.viewId ?? "all-customers"}
            onValueChange={applyView}
            onSaveCurrent={() => setSaveOpen(true)}
            onUpdateCurrent={activeView?.scope === "personal" ? () => { updateView(activeView.id, state); toast("View updated", { id: "customer-view-feedback" }); } : undefined}
            onDeleteCurrent={activeView?.scope === "personal" ? () => { removeView(activeView.id); applyView("all-customers"); toast("View deleted", { id: "customer-view-feedback" }); } : undefined}
          />
          <FilterBuilder fields={customerFilterFields} filters={state.filters} onFiltersChange={(filters) => patchState({ filters })} />
          <DateRangeFilter value={state.dateRange} onValueChange={(dateRange) => patchState({ dateRange })} label="Renewal" />
        </>}
        end={<>
          <DataExportMenu rows={result.rows} selectedRows={selectedRows} columns={customerExportColumns} fileName="customers" onExport={(artifact) => toast(`${artifact.rowCount} customers exported`, { id: "customer-export" })} />
          <ColumnManager
            columns={customerColumns.map((column) => ({ id: column.id, label: String(column.header), visible: state.columnVisibility[column.id] !== false, required: column.hideable === false }))}
            onVisibilityChange={(id, visible) => patchState({ columnVisibility: { ...state.columnVisibility, [id]: visible } }, { resetPage: false })}
            onResetSizing={() => patchState({ columnSizing: customerBaseState.columnSizing }, { resetPage: false })}
          />
        </>}
      />
      <DataTable
        ariaLabel="Customer Directory"
        data={result.rows}
        columns={customerColumns}
        getRowId={(row) => row.id}
        getRowLabel={(row) => `${row.id} ${row.customer}`}
        selectable
        selectedRowIds={selectedRowIds}
        onSelectedRowIdsChange={setSelectedRowIds}
        sorting={state.sorting}
        onSortingChange={(sorting) => patchState({ sorting })}
        manualSorting
        columnVisibility={state.columnVisibility}
        onColumnVisibilityChange={(columnVisibility) => patchState({ columnVisibility }, { resetPage: false })}
        columnSizing={{ ...state.columnSizing }}
        onColumnSizingChange={(columnSizing) => patchState({ columnSizing }, { resetPage: false })}
        columnPinning={state.columnPinning}
        onColumnPinningChange={(columnPinning) => patchState({ columnPinning }, { resetPage: false })}
        resizable
        page={state.pagination.page}
        pageSize={state.pagination.pageSize}
        onPageChange={(page) => patchState({ pagination: { ...state.pagination, page } }, { resetPage: false })}
        manualPagination
        rowCount={result.rowCount}
        loading={!isHydrated}
        isFetching={isFetching}
        emptyTitle="No customers match"
        emptyDescription="Change the query, filters, or renewal range."
      />
      <div className="whatiuse-data-recipe__bulk-slot">
        <BulkActionBar
          count={selectedRowIds.length}
          noun="customer"
          onClear={() => setSelectedRowIds([])}
          actions={<Button size="small" variant="ghost" onClick={() => { toast(`${selectedRows.length} customers ready to export`, { id: "customer-bulk-export" }); setSelectedRowIds([]); }}>Export</Button>}
        />
      </div>
      <SaveViewDialog open={saveOpen} onOpenChange={setSaveOpen} onSave={(label) => {
        const view = saveView(label, state);
        setState(view.state);
        setSaveOpen(false);
        toast("View saved", { id: "customer-view-feedback" });
      }} />
    </section>
  );
}

const auditFilterFields: readonly FilterField[] = [
  { id: "event", label: "Event", values: auditEvents.map((value) => ({ label: value, value })) },
  { id: "actor", label: "Actor", values: owners.map((value) => ({ label: value, value })) },
  { id: "outcome", label: "Outcome", values: ["Succeeded", "Blocked"].map((value) => ({ label: value, value })) },
  { id: "target", label: "Target", kind: "text", placeholder: "Workspace or member" },
];

const auditColumns: readonly DataTableColumn<AuditRecord>[] = [
  { id: "event", header: "Event", accessor: "event", sortable: true, hideable: false, resizable: true, width: 154, minWidth: 136 },
  { id: "actor", header: "Actor", accessor: "actor", sortable: true, resizable: true, width: 120 },
  { id: "target", header: "Target", accessor: "target", resizable: true, width: 146 },
  { id: "outcome", header: "Outcome", accessor: "outcome", sortable: true, resizable: true, width: 96, cell: (row) => <Badge variant={row.outcome === "Blocked" ? "danger" : "neutral"}>{row.outcome}</Badge> },
  { id: "occurredAt", header: "Occurred", accessor: "occurredAt", sortable: true, sortType: "datetime", align: "end", resizable: true, width: 136, cell: (row) => shortDateTimeFormatter.format(new Date(row.occurredAt)) },
];

const auditExportColumns: readonly DataExportColumn<AuditRecord>[] = auditColumns.map((column) => ({
  id: column.id,
  header: String(column.header),
  value: column.accessor as keyof AuditRecord,
}));

export function AuditLogRecipe() {
  const { state, patchState } = useDataViewState({
    initialState: {
      sorting: [{ id: "occurredAt", direction: "desc" }],
      columnSizing: { event: 154, actor: 120, target: 146, outcome: 96, occurredAt: 136 },
      columnPinning: { start: [], end: [] },
      dateRange: { from: "2026-07-18", to: "2026-08-16" },
    },
    syncToUrl: true,
    parameterPrefix: "audit-",
  });
  const [isFetching, setFetching] = useState(false);
  const filtered = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase();
    return auditRecords.filter((record) => {
      if (query && !`${record.event} ${record.actor} ${record.target}`.toLocaleLowerCase().includes(query)) return false;
      if (!state.filters.every((filter) => matchesFilter(record as unknown as Record<string, unknown>, filter))) return false;
      const date = record.occurredAt.slice(0, 10);
      if (state.dateRange.from && date < state.dateRange.from) return false;
      if (state.dateRange.to && date > state.dateRange.to) return false;
      return true;
    });
  }, [state.dateRange.from, state.dateRange.to, state.filters, state.query]);

  const refresh = () => {
    setFetching(true);
    window.setTimeout(() => setFetching(false), 240);
  };

  return (
    <section className="whatiuse-data-recipe" aria-label="Audit Log recipe">
      <header className="whatiuse-data-recipe__header"><div><h3>Audit Log</h3><p>Workspace activity</p></div><small>{filtered.length.toLocaleString()} events</small></header>
      <DataToolbar
        label="Audit log controls"
        start={<>
          <SearchInput label="Search audit events" placeholder="Search audit log…" value={state.query} loading={isFetching} onChange={(event) => patchState({ query: event.target.value })} onClear={() => patchState({ query: "" })} />
          <FilterBuilder fields={auditFilterFields} filters={state.filters} onFiltersChange={(filters) => patchState({ filters })} />
          <DateRangeFilter value={state.dateRange} onValueChange={(dateRange) => patchState({ dateRange })} label="Occurred" />
        </>}
        end={<>
          <DataExportMenu rows={filtered} columns={auditExportColumns} fileName="audit-log" onExport={(artifact) => toast(`${artifact.rowCount} events exported`, { id: "audit-export" })} />
          <ColumnManager
            columns={auditColumns.map((column) => ({ id: column.id, label: String(column.header), visible: state.columnVisibility[column.id] !== false, required: column.hideable === false }))}
            onVisibilityChange={(id, visible) => patchState({ columnVisibility: { ...state.columnVisibility, [id]: visible } }, { resetPage: false })}
          />
          <IconButton size="small" variant="ghost" aria-label="Refresh audit log" onClick={refresh}><ArrowsClockwise aria-hidden="true" /></IconButton>
        </>}
      />
      <DataTable
        ariaLabel="Audit Log"
        data={filtered}
        columns={auditColumns}
        getRowId={(row) => row.id}
        sorting={state.sorting}
        onSortingChange={(sorting) => patchState({ sorting })}
        columnVisibility={state.columnVisibility}
        onColumnVisibilityChange={(columnVisibility) => patchState({ columnVisibility }, { resetPage: false })}
        columnSizing={{ ...state.columnSizing }}
        onColumnSizingChange={(columnSizing) => patchState({ columnSizing }, { resetPage: false })}
        columnPinning={state.columnPinning}
        onColumnPinningChange={(columnPinning) => patchState({ columnPinning }, { resetPage: false })}
        resizable
        paginate={false}
        virtualize={{ height: 390, estimateRowHeight: 39, overscan: 10 }}
        isFetching={isFetching}
        emptyTitle="No audit events"
        emptyDescription="Change the query, event filters, or date range."
      />
    </section>
  );
}
