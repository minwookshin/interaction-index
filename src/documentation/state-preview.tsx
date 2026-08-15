import {
  Archive,
  ArrowRight,
  Bell,
  CaretDown,
  Check,
  Command,
  Copy,
  Folder,
  MagnifyingGlass,
  Monitor,
  DeviceMobile,
  TerminalWindow,
  Plus,
  Star,
  Trash,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  ActionList,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  Combobox,
  ContextSwitcher,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  EmptyState,
  IconButton,
  InlineEdit,
  Pagination,
  Progress,
  RadioGroup,
  SearchInput,
  SegmentedControl,
  Select,
  SharedDetail,
  Skeleton,
  SkeletonText,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
  Textarea,
  NumberField,
} from "../components/ui";

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high", disabled: true },
] as const;

const peopleOptions = [
  { label: "Avery Stone", value: "avery", description: "Design" },
  { label: "Mina Park", value: "mina", description: "Engineering" },
  { label: "Sofia Chen", value: "sofia", description: "Research", disabled: true },
] as const;

const contextOptions = [
  { value: "web", label: "Web", description: "Browser product interfaces", icon: <Monitor /> },
  { value: "native", label: "Native", description: "Mobile and desktop applications", icon: <DeviceMobile /> },
  { value: "terminal", label: "Terminal", description: "Keyboard-first command tools", icon: <TerminalWindow />, disabled: true },
] as const;

const detailItems = [
  { id: "motion", title: "Motion contract", meta: "INT-184", description: "Document origin and interruption.", status: "Review" },
  { id: "focus", title: "Focus map", meta: "INT-172", description: "Verify focus restoration.", status: "Draft" },
] as const;

function has(state: string, ...tokens: string[]) {
  return tokens.some((token) => state.includes(token));
}

function InlineSelectSurface({ state }: { state: string }) {
  const highlighted = has(state, "highlighted");
  const disabled = has(state, "disabled item");
  return (
    <div className="state-inline-surface state-inline-surface--options" aria-hidden="true">
      <span>Medium{!highlighted && <Check weight="bold" />}</span>
      <span data-highlighted={highlighted || undefined} data-disabled={disabled || undefined}>High{disabled && <small>Unavailable</small>}</span>
    </div>
  );
}

function InlineComboboxSurface({ state }: { state: string }) {
  if (has(state, "no results")) return <div className="state-inline-surface state-inline-empty" aria-hidden="true">No matching options</div>;
  return (
    <div className="state-inline-surface state-inline-surface--people" aria-hidden="true">
      <span data-highlighted={has(state, "highlighted") || undefined}><strong>Mina Park</strong><small>Engineering</small></span>
      {!has(state, "filtering") && <span data-disabled={has(state, "disabled item") || undefined}><strong>Sofia Chen</strong><small>Research</small></span>}
    </div>
  );
}

function TooltipState({ state }: { state: string }) {
  const open = !has(state, "closed");
  const collision = has(state, "collision");
  const side = collision ? "bottom" : has(state, "right") ? "right" : has(state, "left") ? "left" : has(state, "bottom") ? "bottom" : "top";
  return (
    <div className="state-overlay-stack" data-side={side}>
      {open && <div className="state-tooltip-bubble" role="tooltip">{collision ? "Flipped below" : "Create item"} <kbd>{has(state, "delayed") ? "500ms" : "⌘N"}</kbd></div>}
      <IconButton className={has(state, "keyboard") ? "state-forced-focus" : undefined} variant="secondary" aria-label="Create item"><Plus /></IconButton>
    </div>
  );
}

function PopoverState({ state }: { state: string }) {
  const open = has(state, "open", "focus within", "validation", "loading", "collision");
  const restored = has(state, "focus restored", "escape dismissed");
  return (
    <div className="state-overlay-stack">
      <Button className={restored ? "state-forced-focus" : undefined} size="small" trailingIcon={<CaretDown />}>View</Button>
      {open && (
        <div className="state-popover-card" aria-hidden="true">
          <strong>View options</strong>
          <span>{has(state, "validation") ? "Choose at least one field." : has(state, "loading") ? "Updating…" : has(state, "collision") ? "Flipped below trigger" : "Show contracts"}</span>
          {has(state, "loading") ? <Spinner size="small" /> : <Switch aria-label="Show contracts" defaultChecked />}
        </div>
      )}
    </div>
  );
}

function MenuState({ state }: { state: string }) {
  const open = !has(state, "closed");
  return (
    <div className="state-overlay-stack">
      <IconButton className={has(state, "focus") ? "state-forced-focus" : undefined} variant="secondary" aria-label="More actions"><Command /></IconButton>
      {open && (
        <div className="state-menu-card" role="presentation">
          <span data-highlighted={has(state, "highlighted", "typeahead") || undefined}><Copy />Duplicate<kbd>⌘D</kbd></span>
          {has(state, "separator") && <i />}
          <span data-disabled={has(state, "disabled") || undefined} data-danger={has(state, "destructive") || undefined}>
            {has(state, "destructive") ? <Trash /> : <Archive />}
            {has(state, "checked") ? "Show archived" : has(state, "overflow") ? "Move to another workspace…" : "Archive"}
            {has(state, "checked") && <Check />}
          </span>
        </div>
      )}
    </div>
  );
}

function DialogState({ state }: { state: string }) {
  if (has(state, "closed", "escape dismissed")) return <Button className={has(state, "escape") ? "state-forced-focus" : undefined} size="small">Open dialog</Button>;
  return (
    <div className="state-dialog-card" data-phase={has(state, "entering") ? "entering" : has(state, "exiting") ? "exiting" : undefined}>
      <strong>Edit component metadata</strong>
      <span>{has(state, "error") ? "Could not save. Try again." : "Update the public name and summary."}</span>
      <div><Button size="small">Cancel</Button><Button size="small" variant="primary" loading={has(state, "submitting")} disabled={has(state, "disabled action")}>Save changes</Button></div>
    </div>
  );
}

function AlertDialogState({ state }: { state: string }) {
  if (has(state, "closed")) return <Button size="small">Discard draft</Button>;
  return (
    <div className="state-dialog-card" data-phase={has(state, "entering") ? "entering" : has(state, "exiting") ? "exiting" : undefined}>
      <strong>Discard this draft?</strong>
      <span>{has(state, "error") ? "Could not discard the draft." : "Unpublished notes will be permanently removed."}</span>
      <div><Button className={has(state, "focus") ? "state-forced-focus" : undefined} size="small">Keep draft</Button><Button size="small" variant="primary" loading={has(state, "confirming")}>Discard</Button></div>
    </div>
  );
}

function TableState({ state }: { state: string }) {
  if (has(state, "empty")) return <EmptyState size="compact" title="No matching issues" description="Clear the current filter." />;
  const loading = has(state, "loading");
  return (
    <div className="state-table-preview">
      <Table aria-label={`${state} table preview`}>
        <TableHeader><TableRow><TableHead aria-sort={has(state, "sorted") ? "ascending" : undefined}>Issue</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>{["Motion contract", "Focus map"].map((title, rowIndex) => <TableRow key={title} data-selected={(has(state, "selected") && rowIndex === 0) || undefined}><TableCell>{loading ? <Skeleton width={96} height={9} /> : title}</TableCell><TableCell>{loading ? <Skeleton width={54} height={9} /> : rowIndex ? "Draft" : "Review"}</TableCell></TableRow>)}</TableBody>
      </Table>
    </div>
  );
}

function TabsState({ state }: { state: string }) {
  const active = state === "active" || has(state, "pressed", "focus", "vertical") ? "activity" : "overview";
  return (
    <Tabs defaultValue={active} className={has(state, "overflow") ? "state-tabs-overflow" : undefined}>
      <TabsList className={has(state, "vertical") ? "state-tabs-vertical" : undefined}>
        <TabsTrigger className={has(state, "focus") ? "state-forced-focus" : undefined} value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity" disabled={has(state, "disabled")}>{has(state, "long") ? "Project activity and history" : "Activity"}</TabsTrigger>
      </TabsList>
      <TabsContent value="overview"><span className="state-tab-copy">Overview content</span></TabsContent>
      <TabsContent value="activity"><span className="state-tab-copy">Recent activity</span></TabsContent>
    </Tabs>
  );
}

function ToastState({ state }: { state: string }) {
  if (has(state, "dismissed")) return <span className="state-empty-status"><Check /> Notification dismissed</span>;
  const error = has(state, "error");
  const loading = has(state, "loading", "queued", "paused");
  return (
    <div className="state-toast-card" data-error={error || undefined}>
      {loading ? <Spinner size="small" /> : error ? <WarningCircle /> : <Check />}
      <span><strong>{error ? "Could not save" : has(state, "success") ? "Component saved" : has(state, "long") ? "Component changes were saved and queued for review" : "Changes saved"}</strong>{has(state, "paused") && <small>Sync paused</small>}</span>
      {has(state, "with action") && <button type="button">Undo</button>}
    </div>
  );
}

function InlineEditState({ state }: { state: string }) {
  if (has(state, "editing", "dirty", "saving", "error")) {
    return (
      <div className="state-inline-edit" data-status={has(state, "error") ? "error" : has(state, "saving") ? "saving" : "editing"}>
        <div><input aria-label="Project title" defaultValue={has(state, "dirty") ? "Interaction system" : "Interaction Index"} disabled={has(state, "saving")} />{has(state, "saving") && <Spinner size="small" />}</div>
        {has(state, "error") && <small>Use a unique name.</small>}
      </div>
    );
  }
  return <InlineEdit className={has(state, "focus") ? "state-forced-focus" : undefined} value={has(state, "cancelled") ? "Interaction Index" : "Interaction Index"} onSave={() => undefined} disabled={has(state, "disabled")} />;
}

function ActionListState({ state }: { state: string }) {
  const empty = has(state, "empty");
  const long = has(state, "long");
  return (
    <ActionList
      defaultQuery={has(state, "filtering", "empty") ? (empty ? "missing" : "arch") : undefined}
      items={empty ? [] : [
        { id: "create", label: long ? "Create a component from the current interaction contract" : "Create component", icon: <Plus />, shortcut: "C" },
        { id: "archive", label: "Archive component", icon: <Archive />, loading: has(state, "loading"), disabled: has(state, "disabled"), variant: has(state, "destructive") ? "danger" : "default" },
      ]}
      onAction={() => undefined}
    />
  );
}

function SharedDetailState({ state }: { state: string }) {
  const detail = has(state, "opening", "detail", "retargeting", "closing");
  const phase = has(state, "opening") ? "opening" : has(state, "closing") ? "closing" : undefined;
  return <div className="state-shared-detail" data-phase={phase}><SharedDetail items={detailItems} defaultSelectedId={detail ? (has(state, "retargeting") ? "focus" : "motion") : undefined} focusOnOpen={false} regionLabel={`${state} shared detail preview`} /></div>;
}

function UndoState({ state }: { state: string }) {
  if (has(state, "idle", "restored", "expired")) return <span className="state-empty-status"><Check />{has(state, "idle") ? "No pending recovery" : has(state, "expired") ? "Recovery expired" : "Component restored"}</span>;
  return (
    <div className="state-undo-card" data-undoing={has(state, "undoing") || undefined}>
      <span><strong>{has(state, "long") ? "Archived Interaction contract from the current project" : "Archived component"}</strong><small>{has(state, "stacked") ? "3 actions in history" : has(state, "keyboard") ? "⌘Z available" : "Action can be restored"}</small></span>
      <Button className={has(state, "focused") ? "state-forced-focus" : undefined} variant="ghost" size="small">Undo</Button>
    </div>
  );
}

export function getStateFlags(state: string) {
  const normalized = state.toLocaleLowerCase();
  return [
    has(normalized, "hover", "pointer") && "hover",
    has(normalized, "pressed") && "pressed",
    has(normalized, "focus", "keyboard") && "focus",
    has(normalized, "open", "entering", "detail") && "open",
    has(normalized, "loading", "saving", "submitting", "undoing") && "loading",
    has(normalized, "error", "invalid", "validation") && "error",
    has(normalized, "disabled") && "disabled",
    ["checked", "selected", "active", "current", "on"].includes(normalized) && "selected",
  ].filter(Boolean).join(" ");
}

export function ComponentStatePreview({ id, state, index }: { id: string; state: string; index: number }) {
  const normalized = state.toLocaleLowerCase();
  const disabled = has(normalized, "disabled");
  const loading = has(normalized, "loading", "submitting", "saving");
  const error = has(normalized, "error", "invalid");

  if (id === "button") return <Button disabled={disabled} loading={loading} leadingIcon={has(normalized, "leading") ? <Plus /> : undefined} trailingIcon={has(normalized, "trailing") ? <ArrowRight /> : undefined}>{has(normalized, "long") ? "Create and assign issue" : "Create issue"}</Button>;
  if (id === "icon-button") {
    if (has(normalized, "tooltip")) return <TooltipState state="keyboard open" />;
    if (has(normalized, "count")) return <span className="state-icon-count"><IconButton aria-label="Notifications"><Bell /></IconButton><small>3</small></span>;
    return <IconButton className={has(normalized, "destructive") ? "state-icon-destructive" : undefined} disabled={disabled} loading={loading} aria-label={state}>{has(normalized, "destructive") ? <Trash /> : <Plus />}</IconButton>;
  }
  if (id === "text-field") return <TextField aria-label={state} placeholder={has(normalized, "empty") ? "Project name" : undefined} defaultValue={has(normalized, "filled", "read") ? "Interaction Index" : undefined} error={error ? "Use a unique name." : undefined} disabled={disabled} readOnly={has(normalized, "read")} leading={has(normalized, "leading") ? <MagnifyingGlass /> : undefined} trailing={has(normalized, "trailing") ? <kbd>⌘K</kbd> : undefined} />;
  if (id === "textarea") return <Textarea aria-label={state} placeholder="Add a description…" defaultValue={has(normalized, "filled", "long") ? "Document the interaction contract and its interruption behavior." : undefined} error={error ? "Add enough detail." : undefined} disabled={disabled} readOnly={has(normalized, "read")} maxLength={280} showCount={has(normalized, "count")} />;
  if (id === "checkbox") return <Checkbox label={has(normalized, "long") ? "Include every documented interaction state" : has(normalized, "required") ? "Include notes *" : "Include notes"} defaultChecked={has(normalized, "checked") && !has(normalized, "unchecked")} indeterminate={has(normalized, "indeterminate")} disabled={disabled} required={has(normalized, "required")} />;
  if (id === "radio-group") return <div className="state-radio-single"><RadioGroup label="Delivery cadence" options={[{ value: "daily", label: has(normalized, "required") ? "Daily *" : "Daily", disabled: has(normalized, "disabled item") }]} defaultValue={normalized === "checked" || has(normalized, "pressed", "focus") ? "daily" : undefined} disabled={has(normalized, "disabled group")} required={has(normalized, "required")} error={error ? "Choose one option." : undefined} /></div>;
  if (id === "switch") return <Switch label={has(normalized, "long") ? "Automatically play component interaction previews" : "Interaction previews"} description={has(normalized, "description") ? "Takes effect immediately." : undefined} defaultChecked={normalized === "on" || has(normalized, "controlled", "pressed")} disabled={disabled} />;
  if (id === "select") return <div className="state-control-stack"><Select aria-label={state} options={priorityOptions} defaultValue={has(normalized, "placeholder") ? undefined : "medium"} disabled={disabled} error={error ? "Select a priority." : undefined} />{has(normalized, "open", "highlighted", "disabled item") && <InlineSelectSurface state={normalized} />}</div>;
  if (id === "context-switcher") return <ContextSwitcher className={has(normalized, "focus") ? "state-forced-focus" : undefined} aria-label={state} options={contextOptions} defaultValue="web" defaultOpen={has(normalized, "open", "keyboard highlighted", "disabled item")} disabled={disabled} />;
  if (id === "combobox") return <div className="state-control-stack"><Combobox aria-label={state} options={peopleOptions} defaultValue={has(normalized, "selected", "clear") ? peopleOptions[1] : undefined} defaultInputValue={has(normalized, "filtering", "highlighted") ? "mi" : has(normalized, "no results") ? "zzz" : undefined} error={error ? "Choose an assignee." : undefined} disabled={disabled} />{has(normalized, "filtering", "highlighted", "no results") && <InlineComboboxSurface state={normalized} />}</div>;
  if (id === "search-input") return <SearchInput aria-label={state} value={has(normalized, "query", "results", "clear") ? "button" : ""} readOnly loading={loading} disabled={disabled} onClear={has(normalized, "clear") ? () => undefined : undefined} placeholder={has(normalized, "no results") ? "No matching results" : "Search…"} />;
  if (id === "number-field") return <NumberField inputProps={{ "aria-label": state }} defaultValue={has(normalized, "empty") ? undefined : has(normalized, "bounds") ? 100 : has(normalized, "stepped") ? 25 : 24} min={0} max={100} error={error ? "Use a value from 0 to 100." : undefined} readOnly={has(normalized, "read")} disabled={disabled} suffix="%" />;
  if (id === "segmented-control") return <SegmentedControl className={has(normalized, "focus") ? "state-forced-focus" : undefined} label={state} defaultValue={has(normalized, "selected", "keyboard") ? "board" : "list"} disabled={has(normalized, "disabled group")} options={[{ value: "list", label: "List" }, { value: "board", label: has(normalized, "long") ? "Project board view" : "Board", disabled: has(normalized, "disabled item") }]} />;
  if (id === "tooltip") return <TooltipState state={normalized} />;
  if (id === "popover") return <PopoverState state={normalized} />;
  if (id === "menu") return <MenuState state={normalized} />;
  if (id === "dialog") return <DialogState state={normalized} />;
  if (id === "alert-dialog") return <AlertDialogState state={normalized} />;
  if (id === "tabs") return <TabsState state={normalized} />;
  if (id === "breadcrumbs") return <Breadcrumbs label={`${state} breadcrumb preview`} maxItems={has(normalized, "collapsed", "mobile") ? 3 : 5} items={[{ label: "Workspace", href: "#", icon: has(normalized, "custom icon") ? <Folder /> : undefined }, { label: "Projects", href: "#" }, { label: has(normalized, "long") ? "Quarterly experience modernization" : "UI Refresh" }]} />;
  if (id === "pagination") return <Pagination label={`${state} pagination preview`} page={has(normalized, "first", "previous") ? 1 : has(normalized, "last", "next") ? 12 : 5} totalPages={12} onPageChange={() => undefined} siblingCount={has(normalized, "condensed") ? 0 : 1} />;
  if (id === "collapsible") return <Collapsible className="ix-collapsible" defaultOpen={has(normalized, "open", "long")} disabled={disabled}><CollapsibleTrigger className={has(normalized, "focus") ? "state-forced-focus" : undefined}>Compatibility details</CollapsibleTrigger><CollapsibleContent>{has(normalized, "long") ? "Tested with the pinned React, TypeScript, Base UI, keyboard, theme, and reduced-motion contracts documented in this workspace." : "Tested with the pinned workspace versions."}</CollapsibleContent></Collapsible>;
  if (id === "toast") return <ToastState state={normalized} />;
  if (id === "progress") return <Progress label={has(normalized, "label") ? "Export" : undefined} aria-label={`${state} progress preview`} value={has(normalized, "indeterminate") ? null : has(normalized, "zero") ? 0 : has(normalized, "half") ? 50 : has(normalized, "near") ? 92 : has(normalized, "complete") ? 100 : has(normalized, "custom") ? 75 : Math.max(18, index * 12)} max={has(normalized, "custom") ? 250 : undefined} size={has(normalized, "small") ? "small" : "medium"} />;
  if (id === "spinner") return <div className={has(normalized, "surface") ? "state-spinner-surface" : has(normalized, "button") ? "state-spinner-button" : "state-spinner-inline"}><Spinner size={has(normalized, "small") ? "small" : has(normalized, "large") ? "large" : "medium"} label={state} />{has(normalized, "label", "inline") && <span>Loading</span>}</div>;
  if (id === "skeleton") return has(normalized, "avatar") ? <Skeleton radius="round" width={32} height={32} /> : has(normalized, "multi", "table") ? <SkeletonText lines={3} /> : <Skeleton width={has(normalized, "compact") ? 92 : has(normalized, "heading") ? 180 : 160} height={has(normalized, "card") ? 64 : has(normalized, "heading") ? 18 : 10} radius={has(normalized, "card") ? "medium" : "small"} />;
  if (id === "alert") return <Alert variant={has(normalized, "critical") ? "critical" : "neutral"} title={has(normalized, "long") ? "Registry verification completed with one unresolved source path" : "Registry check complete"} action={has(normalized, "with action") ? <Button size="small">Review</Button> : undefined} onDismiss={has(normalized, "dismissible") ? () => undefined : undefined} live={has(normalized, "assertive") ? "assertive" : has(normalized, "polite") ? "polite" : undefined}>35 components were reviewed.</Alert>;
  if (id === "empty-state") return <EmptyState size={has(normalized, "compact") ? "compact" : "default"} title={has(normalized, "filtered") ? "No matching components" : "No components yet"} description={has(normalized, "long") ? "This workspace has no compatible components in the current source, theme, state, and accessibility filters." : "Add one from the registry when you are ready."} primaryAction={has(normalized, "primary") ? <Button size="small" variant="primary">Add component</Button> : undefined} secondaryAction={has(normalized, "secondary") ? <Button size="small" variant="ghost">Clear filters</Button> : undefined} />;
  if (id === "badge") return <Badge variant={has(normalized, "strong") ? "strong" : has(normalized, "outline") ? "outline" : has(normalized, "semantic") ? "danger" : "neutral"} leadingIcon={has(normalized, "icon") ? <Star /> : undefined} removable={has(normalized, "remove", "action")}>{has(normalized, "truncated") ? "Exceptionally long status label" : has(normalized, "semantic") ? "Blocked" : "In review"}</Badge>;
  if (id === "avatar") return has(normalized, "group") ? <AvatarGroup><Avatar fallback="AS" /><Avatar fallback="MP" status="online" /><Avatar fallback="NW" /></AvatarGroup> : <Avatar fallback="AS" size={has(normalized, "small") ? "small" : has(normalized, "large") ? "large" : "medium"} status={has(normalized, "online") ? "online" : has(normalized, "away") ? "away" : has(normalized, "busy") ? "busy" : has(normalized, "offline") ? "offline" : undefined} />;
  if (id === "table") return <TableState state={normalized} />;
  if (id === "inline-edit") return <InlineEditState state={normalized} />;
  if (id === "action-list") return <ActionListState state={normalized} />;
  if (id === "shared-detail") return <SharedDetailState state={normalized} />;
  return <UndoState state={normalized} />;
}
