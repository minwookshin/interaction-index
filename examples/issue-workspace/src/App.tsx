import { useMemo, useState } from "react";
import {
  ActionList,
  type ActionListItem,
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  SearchInput,
  SharedDetail,
  TextField,
  Toaster,
  UndoBar,
  UndoStackProvider,
  useUndoStack,
  toast,
} from "teum";

type Issue = {
  id: string;
  code: string;
  title: string;
  description: string;
  status: "Backlog" | "In progress" | "Done";
  updated: string;
};

const seed: Issue[] = [
  { id: "focus", code: "INT-204", title: "Unify keyboard focus", description: "Keep focus return predictable across menus, dialogs, and shared detail.", status: "In progress", updated: "8m" },
  { id: "motion", code: "INT-198", title: "Tune shared detail motion", description: "Preserve list identity while adjacent issues are inspected.", status: "Backlog", updated: "32m" },
  { id: "registry", code: "INT-191", title: "Verify registry consumer", description: "Install the public boundary into a clean application and record the result.", status: "Done", updated: "2h" },
];

function Workspace() {
  const [issues, setIssues] = useState(seed);
  const [selectedId, setSelectedId] = useState<string | null>(seed[0].id);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const { pushUndo } = useUndoStack();

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return issues.filter((issue) => `${issue.code} ${issue.title} ${issue.status}`.toLocaleLowerCase().includes(needle));
  }, [issues, query]);
  const selected = issues.find((issue) => issue.id === selectedId) ?? null;
  const sharedItems = filtered.map((issue) => ({
    id: issue.id,
    title: issue.title,
    meta: `${issue.code} · ${issue.updated}`,
    description: issue.description,
    status: issue.status,
  }));

  const archiveIssue = (id: string) => {
    const index = issues.findIndex((issue) => issue.id === id);
    const archived = issues[index];
    if (!archived) return;
    const remaining = issues.filter((issue) => issue.id !== id);
    setIssues(remaining);
    setSelectedId(remaining[Math.min(index, Math.max(remaining.length - 1, 0))]?.id ?? null);
    pushUndo({
      label: `Archived ${archived.code}`,
      undo: () => {
        setIssues((current) => current.some((issue) => issue.id === archived.id)
          ? current
          : [...current.slice(0, index), archived, ...current.slice(index)]);
        setSelectedId(archived.id);
      },
    });
    toast("Issue archived", { id: "workspace-feedback", description: `${archived.code} can be restored with Undo.` });
  };

  const actionItems = useMemo<readonly ActionListItem[]>(() => selected ? [
    { id: "complete", label: selected.status === "Done" ? "Reopen issue" : "Mark issue done", description: `Update ${selected.code} without leaving this view`, shortcut: "D" },
    { id: "archive", label: "Archive issue", description: "Remove it and keep recovery available", shortcut: "E", variant: "danger" },
  ] : [], [selected]);

  const runAction = (action: ActionListItem) => {
    if (!selected) return;
    setActionsOpen(false);
    if (action.id === "archive") archiveIssue(selected.id);
    if (action.id === "complete") {
      const next = selected.status === "Done" ? "In progress" : "Done";
      setIssues((current) => current.map((issue) => issue.id === selected.id ? { ...issue, status: next, updated: "Now" } : issue));
      toast(next === "Done" ? "Issue completed" : "Issue reopened", { id: "workspace-feedback" });
    }
  };

  const createIssue = () => {
    const title = draftTitle.trim();
    if (!title) return;
    const issue: Issue = {
      id: `issue-${Date.now()}`,
      code: `INT-${210 + issues.length}`,
      title,
      description: draftDescription.trim() || "Add context and acceptance criteria.",
      status: "Backlog",
      updated: "Now",
    };
    setIssues((current) => [issue, ...current]);
    setSelectedId(issue.id);
    setDraftTitle("");
    setDraftDescription("");
    setCreateOpen(false);
    toast("Issue created", { id: "workspace-feedback", description: `${issue.code} is ready for refinement.` });
  };

  return (
    <main className="consumer-shell">
      <header className="consumer-header">
        <div>
          <span>Internal dogfood</span>
          <h1>Interface quality</h1>
          <p>One real workflow composed only from the packed public API.</p>
        </div>
        <div className="consumer-actions">
          <Dialog open={actionsOpen} onOpenChange={setActionsOpen}>
            <DialogTrigger render={<Button variant="secondary" size="small" disabled={!selected}>Actions</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>Act on {selected?.code ?? "issue"}</DialogTitle><DialogDescription>Choose an action without losing list context.</DialogDescription></DialogHeader>
              <ActionList items={actionItems} onAction={runAction} autoFocus placeholder="Search issue actions…" />
            </DialogContent>
          </Dialog>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button variant="primary" size="small">New issue</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>Create issue</DialogTitle><DialogDescription>Add a concrete piece of interface work to the cycle.</DialogDescription></DialogHeader>
              <form className="consumer-form" onSubmit={(event) => { event.preventDefault(); createIssue(); }}>
                <TextField autoFocus label="Title" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder="What needs attention?" />
                <TextField label="Description" value={draftDescription} onChange={(event) => setDraftDescription(event.target.value)} placeholder="Add useful context" />
                <DialogFooter><DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose><Button type="submit" variant="primary" disabled={!draftTitle.trim()}>Create issue</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <section className="consumer-toolbar" aria-label="Issue filters">
        <SearchInput label="Search issues" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} placeholder="Search issues…" shortcut="/" />
        <span>{filtered.length} visible</span>
      </section>

      <section className="consumer-workspace" aria-label="Issue workspace">
        {sharedItems.length ? (
          <SharedDetail
            items={sharedItems}
            selectedId={filtered.some((issue) => issue.id === selectedId) ? selectedId : null}
            onSelectedIdChange={setSelectedId}
            focusOnOpen={false}
            regionLabel="Selected issue detail"
            renderDetail={(item) => {
              const issue = issues.find((candidate) => candidate.id === item.id)!;
              return (
                <div className="consumer-detail">
                  <Badge variant={issue.status === "Done" ? "strong" : "outline"}>{issue.status}</Badge>
                  <p>{issue.description}</p>
                  <dl><div><dt>Issue</dt><dd>{issue.code}</dd></div><div><dt>Updated</dt><dd>{issue.updated}</dd></div></dl>
                  <div><Button size="small" variant="secondary" onClick={() => runAction({ id: "complete", label: "Toggle completion" })}>{issue.status === "Done" ? "Reopen" : "Mark done"}</Button><Button size="small" variant="quiet" onClick={() => archiveIssue(issue.id)}>Archive</Button></div>
                </div>
              );
            }}
          />
        ) : (
          <div className="consumer-empty"><strong>No matching issues</strong><p>Clear the query or create a new issue.</p><Button size="small" onClick={() => setQuery("")}>Clear search</Button></div>
        )}
      </section>
      <UndoBar />
      <Toaster />
    </main>
  );
}

export default function App() {
  return <UndoStackProvider><Workspace /></UndoStackProvider>;
}
