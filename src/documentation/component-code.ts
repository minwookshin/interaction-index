export type ComponentDocId =
  | "button"
  | "icon-button"
  | "field"
  | "input-group"
  | "kbd"
  | "button-group"
  | "toolbar"
  | "text-field"
  | "textarea"
  | "checkbox"
  | "radio-group"
  | "switch"
  | "select"
  | "context-switcher"
  | "combobox"
  | "search-input"
  | "number-field"
  | "date-picker"
  | "segmented-control"
  | "tooltip"
  | "popover"
  | "menu"
  | "context-menu"
  | "dialog"
  | "sheet"
  | "alert-dialog"
  | "tabs"
  | "breadcrumbs"
  | "pagination"
  | "collapsible"
  | "toast"
  | "progress"
  | "spinner"
  | "skeleton"
  | "alert"
  | "empty-state"
  | "badge"
  | "avatar"
  | "table"
  | "tree"
  | "reorderable-list"
  | "inline-edit"
  | "action-list"
  | "shared-detail"
  | "undo-stack";

export const componentCode: Record<ComponentDocId, string> = {
  button: `import { Button } from "@index/ui";

export function CreateIssueAction() {
  return <Button variant="primary">Create issue</Button>;
}`,
  "icon-button": `import { Plus } from "@phosphor-icons/react";
import { IconButton } from "@index/ui";

export function AddItemAction() {
  return (
    <IconButton aria-label="Create item" tooltip="Create item">
      <Plus />
    </IconButton>
  );
}`,
  field: `import {
  Field,
  FieldControl,
  FieldDescription,
  FieldLabel,
  Fieldset,
  FieldsetLegend,
} from "@index/ui";

export function ProjectMetadata() {
  return (
    <Fieldset>
      <FieldsetLegend>Project metadata</FieldsetLegend>
      <Field>
        <FieldLabel>Project name</FieldLabel>
        <FieldControl defaultValue="Interaction Index" />
        <FieldDescription>Visible to everyone in the workspace.</FieldDescription>
      </Field>
    </Fieldset>
  );
}`,
  "input-group": `import { Copy } from "@phosphor-icons/react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@index/ui";

export function RepositoryField() {
  return (
    <InputGroup>
      <InputGroupAddon>github.com/</InputGroupAddon>
      <InputGroupInput aria-label="Repository path" />
      <InputGroupButton aria-label="Copy repository path"><Copy /></InputGroupButton>
    </InputGroup>
  );
}`,
  kbd: `import { Kbd, KbdGroup } from "@index/ui";

export function CommandShortcut() {
  return <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>;
}`,
  "button-group": `import { Button, ButtonGroup } from "@index/ui";

export function IssueActions() {
  return (
    <ButtonGroup aria-label="Issue actions" attached>
      <Button size="small">Preview</Button>
      <Button size="small">Open</Button>
    </ButtonGroup>
  );
}`,
  toolbar: `import { Plus } from "@phosphor-icons/react";
import { Toolbar, ToolbarButton, ToolbarInput, ToolbarSeparator } from "@index/ui";

export function FormattingToolbar() {
  return (
    <Toolbar aria-label="Formatting">
      <ToolbarButton aria-label="Bold"><strong>B</strong></ToolbarButton>
      <ToolbarButton aria-label="Add"><Plus /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarInput aria-label="Find" placeholder="Find…" />
    </Toolbar>
  );
}`,
  "text-field": `import { TextField } from "@index/ui";

export function ProjectNameField() {
  return (
    <TextField
      label="Project name"
      defaultValue="Interaction Index"
      description="Shown to everyone in the workspace."
    />
  );
}`,
  textarea: `import { Textarea } from "@index/ui";

export function IssueDescription() {
  return <Textarea label="Description" maxLength={280} showCount />;
}`,
  checkbox: `import { Checkbox } from "@index/ui";

export function ExportOptions() {
  return (
    <Checkbox
      label="Include interaction notes"
      description="Adds behavior contracts to the export."
      defaultChecked
    />
  );
}`,
  "radio-group": `import { RadioGroup } from "@index/ui";

export function DeliveryCadence() {
  return <RadioGroup label="Send updates" defaultValue="daily" options={[
    { value: "instant", label: "Immediately" },
    { value: "daily", label: "Daily digest" },
    { value: "off", label: "Never" },
  ]} />;
}`,
  switch: `import { Switch } from "@index/ui";

export function PreviewPreference() {
  return (
    <Switch
      label="Interaction previews"
      description="Play component motion in specimen canvases."
      defaultChecked
    />
  );
}`,
  select: `import { Select } from "@index/ui";

export function PrioritySelect() {
  return <Select label="Priority" defaultValue="medium" options={[
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ]} />;
}`,
  "context-switcher": `import { Monitor, DeviceMobile, TerminalWindow } from "@phosphor-icons/react";
import { ContextSwitcher } from "@index/ui";

export function PlatformSwitcher() {
  return <ContextSwitcher aria-label="Preview platform" defaultValue="web" options={[
    { value: "web", label: "Web", description: "Browser product interfaces", icon: <Monitor /> },
    { value: "native", label: "Native", description: "Mobile and desktop applications", icon: <DeviceMobile /> },
    { value: "terminal", label: "Terminal", description: "Keyboard-first command tools", icon: <TerminalWindow /> },
  ]} />;
}`,
  combobox: `import { Combobox } from "@index/ui";

export function AssigneeCombobox({ people }) {
  return <Combobox label="Assignee" options={people} placeholder="Search people…" />;
}`,
  "search-input": `import { SearchInput } from "@index/ui";

export function ComponentSearch({ query, setQuery }) {
  return <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} placeholder="Search components…" />;
}`,
  "number-field": `import { NumberField } from "@index/ui";

export function CycleCapacity() {
  return (
    <NumberField
      label="Cycle capacity"
      description="Issues available to this cycle."
      defaultValue={24}
      min={1}
      max={99}
    />
  );
}`,
  "date-picker": `import { parseDate } from "@internationalized/date";
import { DatePicker } from "@index/ui";

export function DueDate() {
  return (
    <DatePicker
      label="Due date"
      defaultValue={parseDate("2026-08-21")}
      description="Dates follow the current locale."
    />
  );
}`,
  "segmented-control": `import { SegmentedControl } from "@index/ui";

export function IssueView() {
  return (
    <SegmentedControl
      label="Issue view"
      defaultValue="list"
      options={[
        { value: "list", label: "List" },
        { value: "board", label: "Board" },
        { value: "timeline", label: "Timeline" },
      ]}
    />
  );
}`,
  tooltip: `import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@index/ui";

export function FavoriteHint() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button>Favorite</Button>} />
      <TooltipContent>Add to favorites</TooltipContent>
    </Tooltip>
  );
}`,
  popover: `import {
  Button,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@index/ui";

export function ViewOptions() {
  return (
    <Popover>
      <PopoverTrigger render={<Button>View options</Button>} />
      <PopoverContent>
        <PopoverTitle>View options</PopoverTitle>
        <PopoverDescription>Choose which metadata is visible.</PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}`,
  menu: `import { Button, Menu, MenuContent, MenuItem, MenuTrigger } from "@index/ui";

export function IssueActions() {
  return (
    <Menu>
      <MenuTrigger render={<Button>More actions</Button>} />
      <MenuContent>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Archive</MenuItem>
      </MenuContent>
    </Menu>
  );
}`,
  "context-menu": `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@index/ui";

export function IssueContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>Motion contract</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuItem>Archive</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}`,
  dialog: `import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  TextField,
} from "@index/ui";

export function EditComponentMetadata() {
  return (
    <Dialog>
      <DialogTrigger render={<Button>Open dialog</Button>} />
      <DialogContent>
        <DialogTitle>Edit component metadata</DialogTitle>
        <DialogDescription>Update the public name and summary.</DialogDescription>
        <TextField label="Display name" defaultValue="Draft primitive" />
        <TextField label="Summary" defaultValue="A compact authored interaction." />
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <DialogClose render={<Button variant="primary" />}>Save changes</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
  sheet: `import {
  Button,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@index/ui";

export function IssueProperties() {
  return (
    <Sheet>
      <SheetTrigger render={<Button>Properties</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Issue properties</SheetTitle>
          <SheetDescription>Organize this issue without leaving the list.</SheetDescription>
        </SheetHeader>
        <SheetBody>{/* compact form fields */}</SheetBody>
        <SheetFooter><SheetClose>Save changes</SheetClose></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}`,
  "alert-dialog": `import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@index/ui";

export function DiscardDraft() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button />}>Discard draft</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard this component draft?</AlertDialogTitle>
          <AlertDialogDescription>Unpublished notes will be permanently removed.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>Keep draft</AlertDialogClose>
          <AlertDialogClose render={<Button variant="primary" />}>Discard draft</AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
  tabs: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@index/ui";

export function IssueViews() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Issue overview</TabsContent>
      <TabsContent value="activity">Recent activity</TabsContent>
    </Tabs>
  );
}`,
  breadcrumbs: `import { Breadcrumbs } from "@index/ui";

export function IssueLocation() {
  return <Breadcrumbs items={[
    { label: "Workspace", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "UI Refresh" },
  ]} />;
}`,
  pagination: `import { useState } from "react";
import { Pagination } from "@index/ui";

export function ResultsPagination() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} totalPages={18} onPageChange={setPage} />;
}`,
  collapsible: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@index/ui";

export function AdvancedRules() {
  return (
    <Collapsible className="ix-collapsible">
      <CollapsibleTrigger>Advanced filter rules</CollapsibleTrigger>
      <CollapsibleContent>Match state contracts that restore focus.</CollapsibleContent>
    </Collapsible>
  );
}`,
  toast: `import { Button, toast } from "@index/ui";

export function SaveFeedback() {
  return (
    <Button onClick={() => toast.success("Component saved")}>Save component</Button>
  );
}`,
  progress: `import { Progress } from "@index/ui";

export function ExportProgress() {
  return <Progress label="Exporting data" value={68} />;
}`,
  spinner: `import { Spinner } from "@index/ui";

export function PanelLoading() {
  return <Spinner label="Loading panel" />;
}`,
  skeleton: `import { Skeleton, SkeletonText } from "@index/ui";

export function IssueSkeleton() {
  return <><Skeleton width={32} height={32} radius="round" /><SkeletonText lines={3} /></>;
}`,
  alert: `import { Alert, Button } from "@index/ui";

export function RegistryWarning() {
  return (
    <Alert title="Registry could not be verified" variant="critical" action={<Button size="small">Review</Button>}>
      One source path no longer resolves.
    </Alert>
  );
}`,
  "empty-state": `import { Button, EmptyState } from "@index/ui";

export function FilteredEmptyState() {
  return (
    <EmptyState
      title="No components match this view"
      description="Clear the active filters or add a component."
      primaryAction={<Button variant="primary">Add component</Button>}
    />
  );
}`,
  badge: `import { Badge } from "@index/ui";

export function IssueStatus() {
  return <Badge variant="strong">In review</Badge>;
}`,
  avatar: `import { Avatar, AvatarGroup } from "@index/ui";

export function ProjectMembers() {
  return <AvatarGroup aria-label="Project members"><Avatar fallback="AS" /><Avatar fallback="MP" status="online" /></AvatarGroup>;
}`,
  table: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@index/ui";

export function IssueTable({ issues }) {
  return (
    <Table aria-label="Issues">
      <TableHeader><TableRow><TableHead>Issue</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
      <TableBody>{issues.map((issue) => (
        <TableRow key={issue.id}>
          <TableCell>{issue.title}</TableCell>
          <TableCell>{issue.status}</TableCell>
        </TableRow>
      ))}</TableBody>
    </Table>
  );
}`,
  tree: `import { Tree } from "@index/ui";

const items = [{
  id: "workspace",
  label: "Interaction Index",
  children: [
    { id: "foundations", label: "Foundations" },
    { id: "components", label: "Components" },
  ],
}];

export function ProjectTree() {
  return <Tree aria-label="Project structure" items={items} defaultExpandedKeys={["workspace"]} />;
}`,
  "reorderable-list": `import { ReorderableList } from "@index/ui";

const steps = [
  { id: "capture", label: "Capture intent" },
  { id: "compose", label: "Compose primitives" },
  { id: "verify", label: "Verify behavior" },
];

export function ReleaseSequence() {
  return <ReorderableList aria-label="Release sequence" defaultItems={steps} />;
}`,
  "inline-edit": `import { useState } from "react";
import { InlineEdit } from "@index/ui";

export function ProjectTitle() {
  const [title, setTitle] = useState("Interaction Index");

  return <InlineEdit value={title} onSave={setTitle} label="Edit project title" />;
}`,
  "action-list": `import { ActionList } from "@index/ui";

const actions = [
  { id: "create", label: "Create component", shortcut: "C" },
  { id: "duplicate", label: "Duplicate current", shortcut: "⌘D" },
];

export function CommandActions() {
  return <ActionList items={actions} onAction={(item) => run(item.id)} />;
}`,
  "shared-detail": `import { SharedDetail } from "@index/ui";

const issues = [
  {
    id: "motion",
    title: "Motion contract",
    meta: "INT-184 · Updated 8m",
    description: "Define continuity and interruption behavior.",
    status: "In review",
  },
];

export function IssueInspector() {
  return <SharedDetail items={issues} />;
}`,
  "undo-stack": `import { Button, UndoBar, useUndoStack } from "@index/ui";

export function ArchiveAction() {
  const { pushUndo } = useUndoStack();

  const archive = () => {
    removeItem();
    pushUndo({ label: "Archived item", undo: restoreItem });
  };

  return (
    <>
      <Button onClick={archive}>Archive</Button>
      <UndoBar />
    </>
  );
}`,
};
