import {
  Archive,
  CalendarBlank,
  CheckCircle,
  Circle,
  Command,
  DotsThree,
  Plus,
  Rows,
  UserCircle,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import {
  ActionList,
  type ActionListItem,
  Badge,
  BulkActionBar,
  Button,
  ColumnManager,
  DataTable,
  type DataTableColumn,
  DataToolbar,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FilterBuilder,
  type DataFilter,
  type FilterField,
  IconButton,
  InlineEdit,
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
  SearchInput,
  SavedViews,
  Select,
  SharedDetail,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
  UndoBar,
  UndoStackProvider,
  useUndoStack,
  toast,
} from "../components/ui";

type PilotIssue = {
  id: string;
  code: string;
  title: string;
  description: string;
  status: "Backlog" | "In progress" | "Done";
  priority: "Low" | "Medium" | "High";
  assignee: string;
  updated: string;
};

const initialIssues: PilotIssue[] = [
  { id: "focus", code: "INT-204", title: "Unify keyboard focus", description: "Make focus movement predictable across menus, dialogs, and shared detail views.", status: "In progress", priority: "High", assignee: "Avery Stone", updated: "8m" },
  { id: "motion", code: "INT-198", title: "Tune shared detail motion", description: "Preserve list identity while detail content changes and adjacent issues are inspected.", status: "Backlog", priority: "Medium", assignee: "Mina Park", updated: "32m" },
  { id: "registry", code: "INT-191", title: "Verify registry consumer", description: "Install the public boundary into a clean app and record every generated dependency.", status: "Done", priority: "High", assignee: "Noah Williams", updated: "2h" },
  { id: "contrast", code: "INT-184", title: "Review dark theme contrast", description: "Check text, focus, disabled controls, and overlays in the cool graphite dark theme.", status: "Backlog", priority: "Low", assignee: "Avery Stone", updated: "1d" },
];

const statusOptions = ["Backlog", "In progress", "Done"].map((value) => ({ label: value, value }));
const priorityOptions = ["Low", "Medium", "High"].map((value) => ({ label: value, value }));
const proofSteps = [
  ["Find", "Filter issue"],
  ["Inspect", "Select row"],
  ["Act", "Archive via ⌘K"],
  ["Recover", "Choose Undo"],
] as const;

const filterFields: readonly FilterField[] = [
  { id: "status", label: "Status", values: statusOptions },
  { id: "priority", label: "Priority", values: priorityOptions },
  { id: "assignee", label: "Assignee", values: ["Avery Stone", "Mina Park", "Noah Williams", "Unassigned"].map((value) => ({ label: value, value })) },
];

const savedViews = [
  { id: "all", label: "All issues", description: "Every issue in the cycle" },
  { id: "active", label: "Active", description: "Backlog and in-progress work" },
  { id: "mine", label: "Assigned to me", description: "Issues owned by Avery Stone" },
  { id: "done", label: "Completed", description: "Finished work" },
] as const;

function PilotWorkspaceInner({ onReset }: { onReset: () => void }) {
  const [issues, setIssues] = useState(initialIssues);
  const [selectedId, setSelectedId] = useState<string | null>(initialIssues[0].id);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<readonly DataFilter[]>([]);
  const [savedView, setSavedView] = useState("all");
  const [selectedRowIds, setSelectedRowIds] = useState<readonly string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [proofStep, setProofStep] = useState(0);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const { pushUndo } = useUndoStack();

  const filtered = useMemo(() => issues.filter((issue) => {
    const queryMatches = `${issue.code} ${issue.title} ${issue.status} ${issue.priority} ${issue.assignee}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    const viewMatches = savedView === "all"
      || (savedView === "active" && issue.status !== "Done")
      || (savedView === "mine" && issue.assignee === "Avery Stone")
      || (savedView === "done" && issue.status === "Done");
    const filtersMatch = filters.every((filter) => {
      const candidate = String(issue[filter.fieldId as keyof PilotIssue]);
      return filter.operator === "is" ? candidate === filter.value : candidate !== filter.value;
    });
    return queryMatches && viewMatches && filtersMatch;
  }), [filters, issues, query, savedView]);
  const selected = issues.find((issue) => issue.id === selectedId);
  const sharedItems = filtered.map((issue) => ({ id: issue.id, title: issue.title, meta: `${issue.code} · ${issue.updated}`, description: issue.description, status: issue.status }));

  const dataColumns = useMemo<readonly DataTableColumn<PilotIssue>[]>(() => [
    {
      id: "issue",
      header: "Issue",
      accessor: (issue) => `${issue.code} ${issue.title}`,
      sortable: true,
      width: "38%",
      hideable: false,
      cell: (issue) => (
        <button type="button" className="pilot-table-link" onClick={() => selectIssue(issue.id)}>
          {issue.status === "Done" ? <CheckCircle aria-hidden="true" /> : <Circle aria-hidden="true" />}
          <span><strong>{issue.title}</strong><small>{issue.code}</small></span>
        </button>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
      sortable: true,
      cell: (issue) => <Badge variant={issue.status === "Done" ? "strong" : "outline"}>{issue.status}</Badge>,
    },
    { id: "priority", header: "Priority", accessor: "priority", sortable: true },
    { id: "assignee", header: "Assignee", accessor: "assignee", sortable: true },
    { id: "updated", header: "Updated", accessor: "updated", align: "end", width: 72 },
  ], []);

  const viewCounts = useMemo(() => ({
    all: issues.length,
    active: issues.filter((issue) => issue.status !== "Done").length,
    mine: issues.filter((issue) => issue.assignee === "Avery Stone").length,
    done: issues.filter((issue) => issue.status === "Done").length,
  }), [issues]);

  const selectIssue = (id: string | null) => {
    setSelectedId(id);
    if (id) setProofStep((current) => Math.max(current, 2));
  };

  const actionItems = useMemo<readonly ActionListItem[]>(() => selected ? [
    { id: "toggle-status", label: selected.status === "Done" ? "Reopen issue" : "Mark issue done", description: `Update ${selected.code} without leaving the detail`, icon: selected.status === "Done" ? <Circle /> : <CheckCircle />, shortcut: "D" },
    { id: "priority", label: "Set high priority", description: `Move ${selected.code} to the active review queue`, icon: <Rows />, shortcut: "P" },
    { id: "archive", label: "Archive issue", description: "Remove it now and keep recovery available", icon: <Archive />, shortcut: "E", variant: "danger" },
  ] : [], [selected]);

  useEffect(() => {
    const openActions = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLocaleLowerCase() !== "k" || !selected) return;
      event.preventDefault();
      setActionsOpen(true);
      setProofStep((current) => Math.max(current, 2));
    };
    window.addEventListener("keydown", openActions);
    return () => window.removeEventListener("keydown", openActions);
  }, [selected]);

  const updateIssue = (id: string, update: Partial<PilotIssue>) => setIssues((current) => current.map((issue) => issue.id === id ? { ...issue, ...update, updated: "Now" } : issue));

  const archiveIssue = (id: string, source: "menu" | "action-list" = "menu") => {
    const index = issues.findIndex((issue) => issue.id === id);
    const issue = issues[index];
    if (!issue) return;
    const remaining = issues.filter((item) => item.id !== id);
    setIssues(remaining);
    setSelectedId(remaining[Math.min(index, Math.max(remaining.length - 1, 0))]?.id ?? null);
    if (source === "action-list") setProofStep(3);
    pushUndo({
      label: `Archived ${issue.code}`,
      undo: () => {
        setIssues((current) => current.some((item) => item.id === issue.id) ? current : [...current.slice(0, index), issue, ...current.slice(index)]);
        setSelectedId(issue.id);
        if (source === "action-list") setProofStep(4);
      },
    });
  };

  const completeSelectedIssues = () => {
    const ids = new Set(selectedRowIds);
    if (!ids.size) return;
    setIssues((current) => current.map((issue) => ids.has(issue.id) ? { ...issue, status: "Done", updated: "Now" } : issue));
    setSelectedRowIds([]);
    toast(`${ids.size} ${ids.size === 1 ? "issue" : "issues"} completed`, { id: "pilot-feedback" });
  };

  const archiveSelectedIssues = () => {
    const ids = new Set(selectedRowIds);
    const archived = issues.filter((issue) => ids.has(issue.id));
    if (!archived.length) return;
    const previousIssues = issues;
    const remaining = issues.filter((issue) => !ids.has(issue.id));
    setIssues(remaining);
    setSelectedRowIds([]);
    if (selectedId && ids.has(selectedId)) setSelectedId(remaining[0]?.id ?? null);
    pushUndo({
      label: `Archived ${archived.length} ${archived.length === 1 ? "issue" : "issues"}`,
      undo: () => {
        setIssues(previousIssues);
        setSelectedId(archived[0]?.id ?? null);
      },
    });
  };

  const runAction = (item: ActionListItem) => {
    if (!selected) return;
    setActionsOpen(false);
    if (item.id === "toggle-status") {
      const nextStatus = selected.status === "Done" ? "In progress" : "Done";
      updateIssue(selected.id, { status: nextStatus });
      toast(nextStatus === "Done" ? "Issue completed" : "Issue reopened", { id: "pilot-feedback" });
    }
    if (item.id === "priority") {
      updateIssue(selected.id, { priority: "High" });
      toast("Priority updated", { id: "pilot-feedback", description: `${selected.code} is now high priority.` });
    }
    if (item.id === "archive") archiveIssue(selected.id, "action-list");
  };

  const createIssue = () => {
    const title = draftTitle.trim();
    if (!title) return;
    const next: PilotIssue = {
      id: `issue-${Date.now()}`,
      code: `INT-${206 + issues.length}`,
      title,
      description: draftDescription.trim() || "Add product context and acceptance criteria.",
      status: "Backlog",
      priority: "Medium",
      assignee: "Unassigned",
      updated: "Now",
    };
    setIssues((current) => [next, ...current]);
    setSelectedId(next.id);
    setDraftTitle("");
    setDraftDescription("");
    setCreateOpen(false);
    toast("Issue created", { id: "pilot-feedback", description: `${next.code} is ready for refinement.` });
  };

  return (
    <section className="pilot-workspace" aria-label="Issues Workspace">
      <header className="pilot-workspace__header">
        <div className="pilot-workspace__identity"><span><Rows aria-hidden="true" /></span><div><strong>Interface quality</strong><small>Cycle 08 · {issues.length} issues</small></div></div>
        <div className="pilot-workspace__actions">
          <SearchInput label="Search pilot issues" value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value.trim()) setProofStep((current) => Math.max(current, 1)); }} onClear={() => setQuery("")} placeholder="Search issues…" shortcut="/" />
          <Dialog open={actionsOpen} onOpenChange={(open) => { setActionsOpen(open); if (open) setProofStep((current) => Math.max(current, 2)); }}>
            <DialogTrigger render={<Button variant="secondary" size="small" leadingIcon={<Command />} aria-label="Open issue actions (Command K)">Actions</Button>} />
            <DialogContent className="pilot-action-dialog">
              <DialogHeader><DialogTitle>Act on {selected?.code ?? "selected issue"}</DialogTitle><DialogDescription>Find one action without losing the selected issue or its place in the list.</DialogDescription></DialogHeader>
              <ActionList items={actionItems} onAction={runAction} autoFocus placeholder="Search issue actions…" />
            </DialogContent>
          </Dialog>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button variant="primary" size="small" leadingIcon={<Plus />} aria-label="New issue">New issue</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>Create issue</DialogTitle><DialogDescription>Add a small, concrete piece of interface work to the active cycle.</DialogDescription></DialogHeader>
              <form className="pilot-create-form" onSubmit={(event) => { event.preventDefault(); createIssue(); }}>
                <TextField autoFocus label="Title" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder="What needs attention?" />
                <TextField label="Description" value={draftDescription} onChange={(event) => setDraftDescription(event.target.value)} placeholder="Add useful context" />
                <DialogFooter><DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose><Button type="submit" variant="primary" disabled={!draftTitle.trim()}>Create issue</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="pilot-proof" aria-label="Interaction proof task">
        <div><strong>Proof task</strong><span>Find → inspect → act → recover</span><button type="button" onClick={onReset}>Reset</button></div>
        <ol>{proofSteps.map(([label, description], index) => {
          const step = index + 1;
          return <li key={label} data-complete={proofStep >= step || undefined} aria-current={proofStep === index ? "step" : undefined}><span>{step}</span><div><strong>{label}</strong><small>{description}</small></div></li>;
        })}</ol>
      </div>

      <DataToolbar
        className="pilot-data-toolbar"
        label="Issue data controls"
        start={<>
          <SavedViews
            label="Saved views"
            views={savedViews.map((view) => ({ ...view, count: viewCounts[view.id] }))}
            value={savedView}
            onValueChange={setSavedView}
          />
          <FilterBuilder fields={filterFields} filters={filters} onFiltersChange={setFilters} />
        </>}
        end={<ColumnManager
          columns={dataColumns.map((column) => ({
            id: column.id,
            label: String(column.header),
            visible: columnVisibility[column.id] !== false,
            required: column.hideable === false,
          }))}
          onVisibilityChange={(id, visible) => setColumnVisibility((current) => ({ ...current, [id]: visible }))}
        />}
      />

      <Tabs defaultValue="issues" className="pilot-tabs">
        <div className="pilot-tabs__bar"><TabsList aria-label="Pilot views"><TabsTrigger value="issues">Issues</TabsTrigger><TabsTrigger value="cycle">Cycle</TabsTrigger></TabsList><span>{filtered.length} visible</span></div>
        <TabsContent value="issues" className="pilot-tabs__panel">
          {sharedItems.length ? <SharedDetail
            className="pilot-shared-detail"
            items={sharedItems}
            selectedId={filtered.some((issue) => issue.id === selectedId) ? selectedId : null}
            onSelectedIdChange={selectIssue}
            focusOnOpen={false}
            regionLabel="Selected issue detail"
            renderDetail={(item) => {
              const issue = issues.find((candidate) => candidate.id === item.id)!;
              return <div className="pilot-detail-content">
                <p>{issue.description}</p>
                <div className="pilot-detail-fields">
                  <Select label="Status" options={statusOptions} value={issue.status} onValueChange={(value) => updateIssue(issue.id, { status: value as PilotIssue["status"] })} />
                  <Select label="Priority" options={priorityOptions} value={issue.priority} onValueChange={(value) => updateIssue(issue.id, { priority: value as PilotIssue["priority"] })} />
                </div>
                <dl className="pilot-detail-meta"><div><dt><UserCircle aria-hidden="true" />Assignee</dt><dd>{issue.assignee}</dd></div><div><dt><CalendarBlank aria-hidden="true" />Updated</dt><dd>{issue.updated}</dd></div></dl>
                <div className="pilot-detail-title"><span>Title</span><InlineEdit value={issue.title} label="Edit issue title" onSave={(title) => updateIssue(issue.id, { title })} validate={(title) => title.length < 4 ? "Use at least four characters." : undefined} /></div>
                <div className="pilot-detail-actions"><Button size="small" variant="secondary" onClick={() => { updateIssue(issue.id, { status: issue.status === "Done" ? "In progress" : "Done" }); toast(issue.status === "Done" ? "Issue reopened" : "Issue completed", { id: "pilot-feedback" }); }}>{issue.status === "Done" ? "Reopen" : "Mark done"}</Button><Menu><MenuTrigger render={<IconButton size="small" variant="ghost" aria-label="More issue actions"><DotsThree /></IconButton>} /><MenuContent align="end"><MenuLabel>{issue.code}</MenuLabel><MenuItem onClick={() => updateIssue(issue.id, { priority: "High" })}>Set high priority</MenuItem><MenuSeparator /><MenuItem className="teum-menu__item--danger" onClick={() => archiveIssue(issue.id)}><Archive aria-hidden="true" />Archive issue</MenuItem></MenuContent></Menu></div>
              </div>;
            }}
          /> : <div className="pilot-empty"><strong>No matching issues</strong><p>Try a different query or create a new issue.</p><Button size="small" onClick={() => setQuery("")}>Clear search</Button></div>}
        </TabsContent>
        <TabsContent value="cycle" className="pilot-tabs__panel pilot-cycle">
          <DataTable
            ariaLabel="Active cycle issues"
            data={filtered}
            columns={dataColumns}
            getRowId={(issue) => issue.id}
            getRowLabel={(issue) => `${issue.code} ${issue.title}`}
            selectable
            selectedRowIds={selectedRowIds}
            onSelectedRowIdsChange={setSelectedRowIds}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            defaultSorting={[{ id: "issue", direction: "asc" }]}
            pageSize={8}
            onRowActivate={(issue) => selectIssue(issue.id)}
            emptyTitle="No matching issues"
            emptyDescription="Change the active view, search, or filter."
          />
          <BulkActionBar
            count={selectedRowIds.length}
            noun="issue"
            onClear={() => setSelectedRowIds([])}
            actions={<>
              <Button size="small" variant="ghost" leadingIcon={<CheckCircle />} onClick={completeSelectedIssues}>Mark done</Button>
              <Button size="small" variant="ghost" leadingIcon={<Archive />} onClick={archiveSelectedIssues}>Archive</Button>
            </>}
          />
        </TabsContent>
      </Tabs>
      <UndoBar />
      <span className="teum-sr-only" aria-live="polite">{selected ? `${selected.code} selected` : "No issue selected"}</span>
    </section>
  );
}

export function IssuesWorkspace() {
  const [run, setRun] = useState(0);
  return <UndoStackProvider key={run}><PilotWorkspaceInner onReset={() => setRun((current) => current + 1)} /></UndoStackProvider>;
}

export const ProductPilot = IssuesWorkspace;
