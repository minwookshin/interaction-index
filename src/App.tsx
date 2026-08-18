import {
  Archive,
  ArrowsOutLineHorizontal,
  ArrowsDownUp,
  ArrowCounterClockwise,
  ArrowRight,
  Bell,
  BookOpenText,
  Browsers,
  CaretDown,
  Check,
  CheckCircle,
  ChartLine,
  Command,
  Compass,
  Copy,
  CursorText,
  Diamond,
  DotsThree,
  DownloadSimple,
  FileText,
  Gear,
  GithubLogo,
  GitBranch,
  LinkSimple,
  List,
  MagnifyingGlass,
  Moon,
  Monitor,
  Palette,
  PersonArmsSpread,
  Star,
  Plus,
  Rows,
  Selection,
  ShieldCheck,
  SidebarSimple,
  Stack,
  DeviceMobile,
  Sun,
  Tag,
  TerminalWindow,
  TextT,
  Trash,
  WaveSine,
  X,
} from "@phosphor-icons/react";
import { lazy, Suspense, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "./styles.css";
import "./documentation-chrome.css";
import packageManifest from "../package.json";
import {
  ActionList,
  Alert,
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumbs,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  Checkbox,
  Combobox,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextSwitcher,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Fieldset,
  FieldsetLegend,
  IconButton,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InlineEdit,
  Kbd,
  KbdGroup,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
  Pagination,
  Progress,
  RadioGroup,
  SearchInput,
  SegmentedControl,
  Select,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarSeparator,
  NumberField,
  EmptyState,
  toast,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UndoBar,
  UndoStackProvider,
  useUndoStack,
  actionListContract,
  inlineEditContract,
  sharedDetailContract,
  undoStackContract,
} from "./components/ui";
import {
  AsyncIconButtonPreview,
  ComponentMetadataDialogPreview,
  IssueActionsMenuPreview,
  PrioritySelectPreview,
} from "./components/showcase/priority-component-previews";
import {
  ComponentToastPreview,
  DiscardDraftAlertPreview,
  FavoriteTooltipPreview,
  IssueContextMenuPreview,
  IssuePropertiesSheetPreview,
  ViewOptionsPopoverPreview,
} from "./components/showcase/overlay-component-previews";
import {
  ActionButtonGroupPreview,
  AssigneeComboboxPreview,
  ComponentSearchPreview,
  CompactNumberFieldPreview,
  DescriptionTextareaPreview,
  InteractionNotesCheckboxPreview,
  InteractionSwitchPreview,
  IssueViewSegmentedPreview,
  NotificationRadioPreview,
  PlatformContextSwitcherPreview,
  ProjectFieldPreview,
  ProjectTextFieldPreview,
} from "./components/showcase/control-component-previews";
import {
  BreadcrumbPathPreview,
  DismissibleAlertPreview,
  EmptyCollectionPreview,
  ExportProgressPreview,
  FilterCollapsiblePreview,
  StableTabsPreview,
} from "./components/showcase/navigation-feedback-previews";
import type { BehaviorContract } from "./lib/behavior-contract";
import { componentGuidance, type ComponentGuidance } from "./component-guidance";
import { components, libraryComponentGroups, libraryComponents, type ComponentId } from "./component-catalog";
import { componentApi } from "./documentation/component-api";
import { generatedComponentExports } from "./documentation/generated-component-exports";
import { FoundationDetail, FoundationOverview, foundationItems, type FoundationId } from "./documentation/foundations";
import { LiveSpecimen } from "./documentation/live-specimen";
import { ComponentStatePreview, getStateFlags } from "./documentation/state-preview";
import { publicDocItems, publicDocOutlines, type PublicDocId, type PublicDocGroup } from "./documentation/public-doc-metadata";
import { copyText } from "./lib/copy-text";

const DatePickerExample = lazy(() => import("./documentation/date-picker-previews").then((module) => ({ default: module.DatePickerExample })));
const DatePickerPrimaryPreview = lazy(() => import("./documentation/date-picker-previews").then((module) => ({ default: module.DatePickerPrimaryPreview })));
const TreeExample = lazy(() => import("./documentation/tree-previews").then((module) => ({ default: module.TreeExample })));
const TreePrimaryPreview = lazy(() => import("./documentation/tree-previews").then((module) => ({ default: module.TreePrimaryPreview })));
const ReorderableListExample = lazy(() => import("./documentation/reorderable-list-previews").then((module) => ({ default: module.ReorderableListExample })));
const ReorderableListPrimaryPreview = lazy(() => import("./documentation/reorderable-list-previews").then((module) => ({ default: module.ReorderableListPrimaryPreview })));
const PublicDocPage = lazy(() => import("./documentation/public-docs").then((module) => ({ default: module.PublicDocPage })));

function ReactAriaPreviewFallback() {
  return <div className="react-aria-preview-fallback" aria-hidden="true">Loading preview…</div>;
}

export { components } from "./component-catalog";
export type { ComponentId } from "./component-catalog";

const patterns = [
  {
    id: "edit-in-place",
    name: "Edit in place",
    intent: "Change without leaving",
    componentId: "inline-edit",
    description: "Change a small value without leaving its surrounding context.",
    useWhen: "The value is short, the change is reversible, and preserving row or page context matters.",
    avoidWhen: "The task needs several fields, complex validation, or a dedicated review step.",
    outcome: "Edit a value without shifting the layout.",
    components: ["Inline Edit", "Icon Button", "Text Field"],
    contract: inlineEditContract,
  },
  {
    id: "find-and-act",
    name: "Find and act",
    intent: "Search, then execute",
    componentId: "action-list",
    description: "Find one action quickly inside a dense keyboard-first surface.",
    useWhen: "People know roughly what they want and benefit from filtering, shortcuts, and fast execution.",
    avoidWhen: "People need to browse rich content, compare many attributes, or understand a new taxonomy.",
    outcome: "Search and run an action with one active state.",
    components: ["Action List", "Text Field", "Popover"],
    contract: actionListContract,
  },
  {
    id: "preserve-context",
    name: "Preserve context",
    intent: "Inspect without losing place",
    componentId: "shared-detail",
    description: "Move from a collection into detail while preserving identity and position.",
    useWhen: "People repeatedly inspect adjacent objects and need to return to the same place in a list.",
    avoidWhen: "The destination is a deep workflow that needs its own navigation, history, or full-width canvas.",
    outcome: "Open details without losing your place.",
    components: ["Shared Detail", "Icon Button", "List row"],
    contract: sharedDetailContract,
  },
  {
    id: "recover-from-action",
    name: "Recover from action",
    intent: "Mutate, then recover",
    componentId: "undo-stack",
    description: "Let people act immediately while keeping recent reversible work recoverable.",
    useWhen: "The mutation is safe to apply optimistically and can be represented by a clear inverse action.",
    avoidWhen: "The action is legally, financially, or technically irreversible and requires confirmation first.",
    outcome: "Act immediately, then undo from the same history.",
    components: ["Undo Stack", "Toast", "Button"],
    contract: undoStackContract,
  },
] as const;

type PatternId = (typeof patterns)[number]["id"];
type FoundationRoute = `foundation-${FoundationId}`;
export type ViewId = ComponentId | PatternId | FoundationRoute | PublicDocId | "foundations" | "patterns" | "components" | "home";
export type Theme = "light" | "dark";

type NavSectionId = "getting-started" | "foundations" | "components" | "patterns" | "project";

const publicDocGroups: readonly { id: NavSectionId; label: PublicDocGroup }[] = [
  { id: "getting-started", label: "Getting started" },
  { id: "project", label: "Project" },
];

function isPublicDocId(value: string): value is PublicDocId {
  return publicDocItems.some((item) => item.id === value);
}

function readHashRoute() {
  const [view = "", section] = window.location.hash.slice(1).split("/");
  return { view, section };
}

const currentCompatibility = [
  { label: "React", value: packageManifest.peerDependencies.react },
  { label: "TypeScript", value: packageManifest.devDependencies.typescript.replace(/^[^\d]*/, "") },
  { label: "Base UI", value: packageManifest.dependencies["@base-ui/react"].replace(/^[^\d]*/, "") },
  { label: "React Aria", value: packageManifest.dependencies["react-aria-components"].replace(/^[^\d]*/, "") },
  { label: "Release", value: packageManifest.private ? "Not published" : packageManifest.version },
] as const;

const patternSteps: Record<PatternId, readonly string[]> = {
  "edit-in-place": ["Select the project title", "Enter saves, Escape cancels", "Confirm focus returns to the value"],
  "find-and-act": ["Type to narrow the action list", "Use Arrow keys to move", "Press Enter to run the active action"],
  "preserve-context": ["Open one list row", "Retarget a neighboring row", "Press Escape to return to origin"],
  "recover-from-action": ["Archive the current object", "Observe the recovery surface", "Use Undo or Command Z to restore"],
};

const sharedItems = [
  { id: "motion", title: "Motion contract", meta: "INT-184 · Updated 8m", description: "Define origin, continuity, interruption, keyboard, and reduced-motion behavior before implementation.", status: "In review" },
  { id: "density", title: "Density audit", meta: "INT-179 · Updated 24m", description: "Verify 28 and 32 pixel controls across narrow and wide product surfaces.", status: "Ready" },
  { id: "focus", title: "Focus map", meta: "INT-172 · Updated 1h", description: "Document entry, traversal, dismissal, and focus restoration for every overlay.", status: "Draft" },
] as const;

function Specimen({ label, note, children, className }: { label: string; note?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`specimen ${className ?? ""}`}>
      <div className="specimen__header"><span>{label}</span>{note && <small>{note}</small>}</div>
      <div className="specimen__canvas">{children}</div>
    </section>
  );
}

function ApiStrip({ values }: { values: string[] }) {
  return <div className="api-strip">{values.map((value) => <code key={value}>{value}</code>)}</div>;
}

function ContractPanel({ contract }: { contract: BehaviorContract }) {
  return (
    <section className="contract-panel">
      <div className="contract-panel__heading"><span className="lab-nav__authored"><Diamond weight="fill" aria-hidden="true" /></span> Behavior contract</div>
      <dl>
        <div><dt>Input</dt><dd>{contract.input.join(", ")}</dd></div>
        <div><dt>Origin</dt><dd>{contract.origin}</dd></div>
        <div><dt>Enter</dt><dd>{contract.enter}</dd></div>
        <div><dt>Active</dt><dd>{contract.active}</dd></div>
        <div><dt>Exit</dt><dd>{contract.exit}</dd></div>
        <div><dt>Interruption</dt><dd>{contract.interruption}</dd></div>
        <div><dt>Reduced motion</dt><dd>{contract.reducedMotion}</dd></div>
      </dl>
      <div className="contract-panel__keys">{contract.keyboard.map((key) => <kbd key={key}>{key}</kbd>)}</div>
    </section>
  );
}

function ComponentGuidancePanel({ guidance, mode }: { guidance: ComponentGuidance; mode: "usage" | "accessibility" }) {
  const titleId = `guidance-${mode}-title`;
  return (
    <section className="component-guidance" id={`system-${mode}`} aria-labelledby={titleId}>
      <div className="component-guidance__heading"><h2 id={titleId}>{mode === "usage" ? "Usage" : "Accessibility"}</h2></div>
      {mode === "usage" ? <div className="guidance-usage">
        <article><span>Use when</span><p>{guidance.useWhen}</p></article>
        <article><span>Avoid when</span><p>{guidance.avoidWhen}</p></article>
      </div> : <>
      <div className="guidance-section">
        <div className="guidance-section__label"><span>Documented states</span><small>{guidance.states.length} distinct</small></div>
        <div className="state-list">{guidance.states.map((state) => <span key={state}>{state}</span>)}</div>
      </div>
      <div className="guidance-columns">
        <div className="guidance-section">
          <div className="guidance-section__label"><span>Keyboard</span></div>
          <ul>{guidance.keyboard.map((item) => <li key={item}><span className="guidance-marker"><Diamond aria-hidden="true" /></span><span>{item}</span></li>)}</ul>
        </div>
        <div className="guidance-section">
          <div className="guidance-section__label"><span>Checks</span></div>
          <ul>{guidance.quality.map((item) => <li key={item}><span className="guidance-marker"><Diamond aria-hidden="true" /></span><span>{item}</span></li>)}</ul>
        </div>
      </div>
      </>}
    </section>
  );
}

function ComponentApiPanel({ id }: { id: ComponentId }) {
  const rows = componentApi[id];
  const publicExports = generatedComponentExports[id];
  const component = components.find((item) => item.id === id)!;
  const guidance = componentGuidance[id];
  const primaryExport = publicExports.find((item) => item.kind === "function")?.name ?? publicExports[0]?.name ?? component.name;
  const registryItem = `@teum-pinned/${id}`;
  const installCommand = `npx shadcn@${packageManifest.devDependencies.shadcn} add ${registryItem}`;
  const [installCopied, setInstallCopied] = useState(false);
  const copyInstall = () => void copyText(installCommand).then((result) => {
    setInstallCopied(result);
    window.setTimeout(() => setInstallCopied(false), 1200);
  });
  return (
    <section className="component-api" id="system-api" aria-labelledby="component-api-title">
      <div className="component-guidance__heading"><h2 id="component-api-title">API</h2></div>
      <div className="component-api__install"><code>{installCommand}</code><button type="button" onClick={copyInstall} aria-label={`Copy ${component.name} install command`}><Copy aria-hidden="true" />{installCopied ? "Copied" : "Copy"}</button></div>
      <div className="component-api__facts" role="region" aria-label={`${component.name} reference summary`}>
        <article><span>Primary export</span><code>{primaryExport}</code></article>
        <article><span>Registry item</span><code>{registryItem}</code></article>
        <article><span>Primitive</span><strong>{guidance.source}</strong></article>
        <article><span>Coverage</span><strong>{guidance.states.length} states</strong></article>
      </div>
      <div className="component-api__table-wrap">
      <table aria-label={`${component.name} API`}>
        <thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Purpose</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.name}><th scope="row"><code>{row.name}</code>{row.required && <span>Required</span>}</th><td><code>{row.type}</code></td><td><code>{row.defaultValue === "—" ? "None" : row.defaultValue}</code></td><td>{row.description}</td></tr>)}</tbody>
      </table>
      </div>
      <details className="component-api__generated">
        <summary>
          <span><strong>Generated public surface</strong><small>Read from the TypeScript entry point</small></span>
          <span><small>{publicExports.length} exports</small><CaretDown aria-hidden="true" /></span>
        </summary>
        <div className="component-api__export-list">
          {publicExports.map((item) => (
            <article key={item.name}>
              <code>{item.name}</code>
              <span>{item.kind}</span>
              <code>{item.signature}</code>
            </article>
          ))}
        </div>
      </details>
      <div className="component-support" aria-label={`${component.name} compatibility and confidence`}>
        <div className="component-support__heading">
          <div><h3>Compatibility</h3></div>
          <p>Pre-release. APIs may change.</p>
        </div>
        <dl className="component-support__versions">{currentCompatibility.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
        <div className="component-support__confidence">
          <div><span>Keyboard contract</span><ul>{guidance.keyboard.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div>
          <div><span>Verification</span><ul><li><Check aria-hidden="true" />Documented states covered by automated tests</li><li><Check aria-hidden="true" />Light, dark, focus, and reduced motion covered</li><li><Check aria-hidden="true" />Assistive-technology review still required</li></ul></div>
        </div>
      </div>
    </section>
  );
}

function ButtonDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Issue composer actions">
        <div className="demo-row">
          <Button variant="primary">Create issue</Button>
          <Button variant="secondary">Save draft</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="quiet">View details</Button>
        </div>
      </Specimen>
      <Specimen label="Size & content">
        <div className="demo-row demo-row--baseline">
          <Button size="small">Small</Button>
          <Button size="medium" leadingIcon={<Plus />}>Medium</Button>
          <Button size="large" trailingIcon={<ArrowRight />}>Large</Button>
        </div>
      </Specimen>
      <Specimen label="Operational states">
        <div className="demo-grid demo-grid--states">
          <div><span>Default</span><Button variant="secondary">Assign</Button></div>
          <div><span>Loading</span><Button variant="secondary" loading>Assign</Button></div>
          <div><span>Disabled</span><Button variant="secondary" disabled>Assign</Button></div>
          <div><span>Primary</span><Button variant="primary" leadingIcon={<Check />}>Confirm</Button></div>
        </div>
      </Specimen>
      <ApiStrip values={["primary", "secondary", "ghost", "quiet", "loading", "small · 28", "medium · 32", "large · 36"]} />
    </>
  );
}

function IconButtonDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Compact issue toolbar">
        <div className="demo-row">
          <IconButton variant="secondary" aria-label="Create item" tooltip="Create item"><Plus /></IconButton>
          <IconButton variant="ghost" aria-label="Notifications" tooltip="Notifications"><Bell /></IconButton>
          <IconButton variant="ghost" aria-label="Settings" tooltip="Settings"><Gear /></IconButton>
          <IconButton variant="ghost" aria-label="More actions" tooltip="More actions"><DotsThree weight="bold" /></IconButton>
          <IconButton variant="ghost" aria-label="Delete item" tooltip="Delete item" disabled><Trash /></IconButton>
          <IconButton variant="secondary" aria-label="Saving item" tooltip="Saving" loading><Check /></IconButton>
        </div>
      </Specimen>
      <Specimen label="Sizing & count">
        <div className="demo-row demo-row--baseline">
          <IconButton size="small" variant="secondary" aria-label="Small menu" tooltip="Small"><Rows /></IconButton>
          <IconButton size="medium" variant="secondary" aria-label="Medium menu" tooltip="Medium"><Rows /></IconButton>
          <IconButton size="large" variant="secondary" aria-label="Large menu" tooltip="Large"><Rows /></IconButton>
          <button className="count-button" aria-label="8 notifications"><Bell /><span>8</span></button>
        </div>
      </Specimen>
      <ApiStrip values={["aria-label · required", "tooltip · recommended", "small · 28", "medium · 32", "large · 36"]} />
    </>
  );
}

function FieldDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Project metadata form">
        <form className="field-family-demo" aria-label="Project metadata" onSubmit={(event) => event.preventDefault()}>
          <Field>
            <FieldLabel>Project name</FieldLabel>
            <FieldControl placeholder="Teum" />
            <FieldDescription>Shown to everyone in this workspace.</FieldDescription>
          </Field>
          <Field invalid>
            <FieldLabel>Identifier</FieldLabel>
            <FieldControl defaultValue="INT-" aria-invalid="true" />
            <FieldError>Use a unique identifier.</FieldError>
          </Field>
          <Fieldset>
            <FieldsetLegend>Include in export</FieldsetLegend>
            <FieldGroup>
              <Checkbox label="Component source" defaultChecked />
              <Checkbox label="Interaction notes" defaultChecked />
            </FieldGroup>
          </Fieldset>
        </form>
      </Specimen>
      <ApiStrip values={["label association", "description", "error", "required", "read only", "disabled", "fieldset legend"]} />
    </>
  );
}

function InputGroupDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Repository destination">
        <div className="input-group-demo">
          <label htmlFor="repository-path">Repository</label>
          <InputGroup>
            <InputGroupAddon>github.com/</InputGroupAddon>
            <InputGroupInput id="repository-path" defaultValue="minwook/teum" />
            <InputGroupButton aria-label="Copy repository path"><Copy /></InputGroupButton>
          </InputGroup>
          <span>Use a repository you can publish from this workspace.</span>
        </div>
      </Specimen>
      <ApiStrip values={["leading addon", "trailing action", "keyboard hint", "focus within", "invalid", "disabled"]} />
    </>
  );
}

function KbdDemo() {
  return (
    <>
      <Specimen label="Shortcut language" note="Presentational, never a focus target">
        <div className="kbd-demo-grid">
          <div><span>Open command menu</span><KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup></div>
          <div><span>Save changes</span><KbdGroup><Kbd>⌘</Kbd><Kbd>Enter</Kbd></KbdGroup></div>
          <div><span>Move selection</span><KbdGroup><Kbd>↑</Kbd><Kbd>↓</Kbd></KbdGroup></div>
        </div>
      </Specimen>
      <ApiStrip values={["single key", "modifier chord", "sequence", "inside button", "inside input"]} />
    </>
  );
}

function ButtonGroupDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Issue view actions">
        <div className="button-group-demo">
          <ButtonGroup aria-label="Issue view actions" attached>
            <Button variant="secondary" size="small">Preview</Button>
            <Button variant="secondary" size="small">Open</Button>
            <Button variant="secondary" size="small" aria-label="More issue actions"><DotsThree /></Button>
          </ButtonGroup>
          <ButtonGroup aria-label="Document actions">
            <Button variant="ghost" size="small">Cancel</Button>
            <ButtonGroupSeparator />
            <Button variant="primary" size="small">Publish</Button>
          </ButtonGroup>
        </div>
      </Specimen>
      <ApiStrip values={["group label", "attached", "detached", "mixed hierarchy", "vertical", "disabled item"]} />
    </>
  );
}

function ToolbarDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Issue formatting toolbar">
        <Toolbar aria-label="Issue formatting">
          <ToolbarGroup aria-label="Text style">
            <ToolbarButton aria-label="Bold"><strong>B</strong></ToolbarButton>
            <ToolbarButton aria-label="Italic"><em>I</em></ToolbarButton>
            <ToolbarButton aria-label="Add link"><LinkSimple /></ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup aria-label="Insert">
            <ToolbarButton aria-label="Add attachment"><Plus /></ToolbarButton>
            <Menu>
              <MenuTrigger render={<ToolbarButton aria-label="More formatting"><DotsThree /></ToolbarButton>} />
              <MenuContent>
                <MenuItem><List />Bulleted list</MenuItem>
                <MenuItem><Command />Command block</MenuItem>
              </MenuContent>
            </Menu>
          </ToolbarGroup>
          <ToolbarInput aria-label="Find in issue" placeholder="Find…" />
        </Toolbar>
      </Specimen>
      <ApiStrip values={["Arrow keys", "Home / End", "loop focus", "group", "separator", "popup trigger", "one trailing input"]} />
    </>
  );
}

function TextFieldDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Project settings form">
        <form className="field-demo-form" aria-label="Project settings form" onSubmit={(event) => event.preventDefault()}>
          <TextField fieldClassName="field-demo-form__name" label="Project name" defaultValue="Teum" description="Shown to everyone in the workspace." />
          <TextField label="Identifier" defaultValue="INT-" error="Use a unique identifier." />
          <TextField label="Workspace key" value="INT" description="Managed by your organization." disabled />
          <TextField label="Search" placeholder="Search components…" leading={<MagnifyingGlass />} trailing={<kbd>⌘K</kbd>} />
          <TextField label="Read only" value="Linear light" readOnly />
        </form>
      </Specimen>
      <ApiStrip values={["label", "description", "error", "leading", "trailing", "disabled", "readOnly"]} />
    </>
  );
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <>
      <Specimen label="Product recipe" note="Export configuration">
        <div className="demo-stack demo-stack--narrow">
          <Checkbox label="Include interaction notes" description="Adds behavior contracts to the export." checked={checked} onCheckedChange={setChecked} />
          <Checkbox label="Publish documentation" defaultChecked />
          <Checkbox label="All component states" description="Some states are selected." indeterminate />
          <Checkbox label="Private beta" disabled />
        </div>
      </Specimen>
      <ApiStrip values={["checked", "unchecked", "indeterminate", "disabled", "16px visual · 40px target"]} />
    </>
  );
}

function SwitchDemo() {
  const [enabled, setEnabled] = useState(true);
  return (
    <>
      <Specimen label="Product recipe" note="Workspace preferences">
        <div className="setting-card">
          <Switch label="Interaction previews" description="Play component motion in specimen canvases." checked={enabled} onCheckedChange={setEnabled} />
          <Switch label="Focus diagnostics" description="Reveal keyboard focus paths." />
          <Switch label="Experimental primitives" description="Unavailable in this release." disabled />
        </div>
      </Specimen>
      <ApiStrip values={["checked", "unchecked", "disabled", "32 × 18", "instant state change"]} />
    </>
  );
}

function TooltipDemo() {
  return (
    <>
      <Specimen label="Placement states" note="350ms open delay">
        <div className="tooltip-stage">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger render={<Button variant="secondary">{side[0].toUpperCase() + side.slice(1)}</Button>} />
              <TooltipContent side={side}>Add to favorites <kbd>F</kbd></TooltipContent>
            </Tooltip>
          ))}
        </div>
      </Specimen>
      <ApiStrip values={["top", "right", "bottom", "left", "delay · 350ms", "Escape · dismiss"]} />
    </>
  );
}

function PopoverDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="View settings popover">
        <div className="overlay-stage">
          <Popover>
            <PopoverTrigger render={<Button variant="secondary" trailingIcon={<CaretDown />}>View options</Button>} />
            <PopoverContent>
              <div className="popover-copy"><PopoverTitle>View options</PopoverTitle><PopoverDescription>Change how component metadata appears.</PopoverDescription></div>
              <div className="popover-settings"><Switch label="Show contracts" defaultChecked /><Switch label="Show API" defaultChecked /></div>
              <div className="popover-actions"><Button variant="ghost" size="small">Reset</Button><Button variant="primary" size="small">Apply</Button></div>
            </PopoverContent>
          </Popover>
        </div>
      </Specimen>
      <ApiStrip values={["anchored", "non-modal", "click outside · dismiss", "Escape · dismiss", "focus return"]} />
    </>
  );
}

function MenuDemo() {
  const [contracts, setContracts] = useState(true);
  return (
    <>
      <Specimen label="Product recipe" note="Issue context actions">
        <div className="overlay-stage">
          <Menu>
            <MenuTrigger render={<Button variant="secondary" trailingIcon={<CaretDown />}>More actions</Button>} />
            <MenuContent>
              <MenuLabel>Component</MenuLabel>
              <MenuItem><Copy />Duplicate <kbd>⌘D</kbd></MenuItem>
              <MenuItem><Archive />Archive <kbd>E</kbd></MenuItem>
              <MenuCheckboxItem checked={contracts} onCheckedChange={setContracts}>Show contracts</MenuCheckboxItem>
              <MenuSeparator />
              <MenuItem className="teum-menu__item--danger"><Trash />Delete</MenuItem>
            </MenuContent>
          </Menu>
        </div>
      </Specimen>
      <ApiStrip values={["Arrow keys", "Home / End", "Enter / Space", "typeahead", "checkbox item", "Escape"]} />
    </>
  );
}

function ContextMenuDemo() {
  const [contracts, setContracts] = useState(true);
  return (
    <>
      <Specimen label="Product recipe" note="Right click, long press, or use Shift + F10">
        <ContextMenu>
          <ContextMenuTrigger className="context-menu-demo-card">
            <span className="product-context__icon"><Rows aria-hidden="true" /></span>
            <span><strong>Motion contract</strong><small>INT-184 · In review</small></span>
            <KbdGroup><Kbd>⇧</Kbd><Kbd>F10</Kbd></KbdGroup>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Issue</ContextMenuLabel>
            <ContextMenuItem><Copy />Duplicate <kbd>⌘D</kbd></ContextMenuItem>
            <ContextMenuItem><Archive />Archive</ContextMenuItem>
            <ContextMenuCheckboxItem checked={contracts} onCheckedChange={setContracts}>Show contracts</ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuItem className="teum-menu__item--danger"><Trash />Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Specimen>
      <ApiStrip values={["right click", "long press", "Shift + F10", "Arrow keys", "typeahead", "Escape", "focus return"]} />
    </>
  );
}

function DialogDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Focused metadata task">
        <div className="dialog-preview-card">
          <div><strong>Component metadata</strong><p>Edit a small group of related fields without leaving the catalog.</p></div>
          <Dialog>
            <DialogTrigger render={<Button variant="secondary">Edit details</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>Edit component metadata</DialogTitle><DialogDescription>Update the public name and summary for this component.</DialogDescription></DialogHeader>
              <div className="dialog-form"><TextField label="Display name" defaultValue="Draft primitive" /><Select label="Maturity" defaultValue="alpha" options={[{ label: "Alpha", value: "alpha" }, { label: "Beta", value: "beta" }, { label: "Stable", value: "stable" }]} /><TextField label="Summary" defaultValue="A compact interaction." /></div>
              <DialogFooter><DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose><DialogClose render={<Button variant="primary" />}>Save changes</DialogClose></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Specimen>
      <ApiStrip values={["focus trap", "Escape · close", "backdrop · close", "focus return", "label + description"]} />
    </>
  );
}

function SheetDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Issue properties without losing the list">
        <div className="sheet-preview-card">
          <div><strong>Motion contract</strong><p>INT-184 · In review · Updated 8m ago</p></div>
          <Sheet>
            <SheetTrigger render={<Button variant="secondary">Open properties</Button>} />
            <SheetContent>
              <SheetHeader><SheetTitle>Issue properties</SheetTitle><SheetDescription>Update the fields that organize this issue.</SheetDescription></SheetHeader>
              <SheetBody>
                <TextField label="Title" defaultValue="Motion contract" />
                <Select label="Priority" options={priorityOptions} defaultValue="medium" />
                <TextField label="Identifier" value="INT-184" readOnly />
              </SheetBody>
              <SheetFooter><SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose><SheetClose render={<Button variant="primary" />}>Save changes</SheetClose></SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </Specimen>
      <ApiStrip values={["modal focus", "right · default", "left", "top", "bottom", "Escape · close", "focus return"]} />
    </>
  );
}

function TabsDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Issue detail views">
        <Tabs className="tabs-demo tabs-demo--recipes" defaultValue="preview">
          <TabsList><TabsTrigger value="preview">Overview</TabsTrigger><TabsTrigger value="states">Activity</TabsTrigger><TabsTrigger value="contract">Relations</TabsTrigger><TabsTrigger value="archive" disabled>Archive</TabsTrigger></TabsList>
          <div className="tabs-panel-viewport">
            <TabsContent value="preview"><div className="tab-card"><strong>Live component</strong><p>Inspect the component at product density.</p></div></TabsContent>
            <TabsContent value="states"><div className="tab-card"><strong>State coverage</strong><p>Default, hover, active, focus, disabled, and loading.</p></div></TabsContent>
            <TabsContent value="contract"><div className="tab-card"><strong>Behavior contract</strong><p>Origin, continuity, interruption, keyboard, and reduced motion.</p></div></TabsContent>
          </div>
        </Tabs>
      </Specimen>
      <ApiStrip values={["Arrow Left / Right", "Home / End", "automatic activation", "aria-controls"]} />
    </>
  );
}

function ToastDemo() {
  const nextToast = useRef(0);

  const nextToastId = () => {
    const toastId = `component-feedback-detail-${nextToast.current}`;
    nextToast.current += 1;
    return toastId;
  };

  return (
    <>
      <Specimen label="Product recipe" note="Mutation feedback">
        <div className="demo-row">
          <Button variant="secondary" onClick={() => toast("Component duplicated", { id: nextToastId(), description: "Button / Draft was added to the index.", action: undefined })}>Confirm action</Button>
          <Button variant="secondary" onClick={() => {
            const toastId = nextToastId();
            toast("Component archived", { id: toastId, description: undefined, action: { label: "Undo", onClick: () => toast("Component restored", { id: toastId, description: "Archive was reversed.", action: undefined }) } });
          }}>Show undo</Button>
          <Button variant="secondary" onClick={() => toast.error("Couldn’t publish", { id: nextToastId(), description: "Check the registry configuration and try again.", action: undefined })}>Show error</Button>
        </div>
      </Specimen>
      <ApiStrip values={["polite live region", "3 visible", "collapsed stack", "hover to expand", "scoped action", "4s default"]} />
    </>
  );
}

const peopleOptions = [
  { label: "Avery Stone", value: "avery", description: "Product design" },
  { label: "Mina Park", value: "mina", description: "Design engineering" },
  { label: "Noah Williams", value: "noah", description: "Product management" },
  { label: "Sofia Chen", value: "sofia", description: "Research" },
] as const;

const priorityOptions = [
  { label: "No priority", value: "none" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
] as const;

const contextSwitcherOptions = [
  { value: "web", label: "Web", description: "Browser product interfaces", icon: <Monitor /> },
  { value: "native", label: "Native", description: "Mobile and desktop applications", icon: <DeviceMobile /> },
  { value: "terminal", label: "Terminal", description: "Keyboard-first command tools", icon: <TerminalWindow /> },
] as const;

function BadgeDemo() {
  return <>
    <Specimen label="Product recipe" note="Issue metadata">
      <div className="demo-row demo-row--centered"><Badge>Draft</Badge><Badge variant="strong">In review</Badge><Badge variant="outline">Design</Badge><Badge leadingIcon={<Star weight="fill" />}>Favorite</Badge><Badge variant="danger">Blocked</Badge><Badge removable removeLabel="Remove Design filter">Design</Badge></div>
    </Specimen>
    <ApiStrip values={["neutral", "strong", "outline", "semantic label", "icon", "removable", "truncation", "disabled action"]} />
  </>;
}

function AvatarDemo() {
  return <>
    <Specimen label="Identity states" note="Fallbacks are deterministic">
      <div className="demo-row demo-row--centered"><Avatar fallback="AS" size="small" /><Avatar fallback="MP" status="online" /><Avatar fallback="NW" size="large" status="away" /><AvatarGroup aria-label="Project members"><Avatar fallback="AS" /><Avatar fallback="MP" /><Avatar fallback="NW" /></AvatarGroup></div>
    </Specimen>
    <ApiStrip values={["image", "fallback", "small · 24", "medium · 32", "large · 40", "status", "group", "overflow"]} />
  </>;
}

function TextareaDemo() {
  return <>
    <Specimen label="Product recipe" note="Issue description">
      <div className="field-demo-grid"><Textarea label="Description" defaultValue="Document the interaction contract and its interruption behavior." description="Markdown is supported." maxLength={280} showCount /><Textarea label="Required context" placeholder="Add context…" error="Add enough detail for the assignee to act." /><Textarea label="Read only" value="This description is synced from the source issue." readOnly /></div>
    </Specimen>
    <ApiStrip values={["empty", "filled", "focus", "error", "readOnly", "disabled", "count", "resize", "long content"]} />
  </>;
}

function RadioGroupDemo() {
  return <>
    <Specimen label="Product recipe" note="Notification frequency">
      <RadioGroup label="Send updates" description="Choose one delivery cadence." defaultValue="daily" options={[{ value: "instant", label: "Immediately", description: "Every update as it happens." }, { value: "daily", label: "Daily digest", description: "One summary each morning." }, { value: "off", label: "Never", description: "No email updates." }]} />
    </Specimen>
    <ApiStrip values={["unchecked", "checked", "hover", "focus", "required", "error", "disabled item", "disabled group", "horizontal"]} />
  </>;
}

function SelectDemo() {
  return <>
    <Specimen label="Product recipe" note="Short predefined list"><Select label="Priority" description="Used to sort work in the active cycle." options={priorityOptions} defaultValue="medium" /></Specimen>
    <ApiStrip values={["placeholder", "selected", "open", "highlighted", "typeahead", "disabled item", "error", "required", "disabled"]} />
  </>;
}

function ContextSwitcherDemo() {
  const [context, setContext] = useState<string | null>("web");
  return <>
    <Specimen label="Product recipe" note={`Current context: ${context ?? "None"}`}>
      <ContextSwitcher aria-label="Preview platform" options={contextSwitcherOptions} value={context} onValueChange={setContext} />
    </Specimen>
    <ApiStrip values={["icon", "label", "description", "selected", "hover", "focus-visible", "open", "disabled item", "long label"]} />
  </>;
}

function ComboboxDemo() {
  return <>
    <Specimen label="Product recipe" note="Filter a larger set"><Combobox label="Assignee" description="Search by name or role." options={peopleOptions} defaultValue={peopleOptions[1]} /></Specimen>
    <ApiStrip values={["empty query", "filtering", "highlighted", "selected", "clear", "no results", "disabled item", "error", "disabled"]} />
  </>;
}

function SearchInputDemo() {
  const [query, setQuery] = useState("");
  return <>
    <Specimen label="Product recipe" note="Free-form catalog search"><div className="field-demo-grid"><SearchInput value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} placeholder="Search components…" shortcut="⌘K" /><SearchInput placeholder="Searching…" loading /><SearchInput placeholder="Search disabled" disabled /></div></Specimen>
    <ApiStrip values={["empty", "query", "focus", "clear", "loading", "results", "no results", "disabled", "shortcut"]} />
  </>;
}

function BreadcrumbsDemo() {
  return <>
    <Specimen label="Product recipe" note="Issue location"><div className="demo-stack"><Breadcrumbs label="Issue location breadcrumb" items={[{ label: "Workspace", href: "#" }, { label: "Projects", href: "#" }, { label: "UI Refresh", href: "#" }, { label: "Update copy" }]} /><Breadcrumbs label="Collapsed issue location breadcrumb" maxItems={4} items={[{ label: "Workspace", href: "#" }, { label: "Teams", href: "#" }, { label: "Design", href: "#" }, { label: "Projects", href: "#" }, { label: "UI Refresh", href: "#" }, { label: "Update copy" }]} /></div></Specimen>
    <ApiStrip values={["root", "link", "current", "hover", "focus", "collapsed", "long label", "mobile", "custom icon"]} />
  </>;
}

function PaginationDemo() {
  const [page, setPage] = useState(4);
  return <>
    <Specimen label="Product recipe" note={`Page ${page} of 18`}><Pagination label="Product recipe pagination" page={page} totalPages={18} onPageChange={setPage} /></Specimen>
    <ApiStrip values={["first", "middle", "last", "current", "hover", "focus", "previous disabled", "next disabled", "condensed"]} />
  </>;
}

function SkeletonDemo() {
  return <>
    <Specimen label="Product recipe" note="Preserve final geometry"><div className="skeleton-recipe"><Skeleton radius="round" width={32} height={32} /><div><Skeleton width={142} height={11} /><SkeletonText lines={2} /></div></div></Specimen>
    <ApiStrip values={["text", "heading", "avatar", "card", "table row", "compact", "multi-line", "reduced motion"]} />
  </>;
}

function ProgressDemo() {
  return <>
    <Specimen label="Task states" note="Determinate and indeterminate"><div className="demo-stack demo-stack--wide"><Progress label="Exporting data" value={68} /><Progress label="Preparing archive" value={null} /><Progress label="Complete" value={100} size="small" /></div></Specimen>
    <ApiStrip values={["zero", "progressing", "half", "near complete", "complete", "indeterminate", "small", "labelled", "custom range"]} />
  </>;
}

function SpinnerDemo() {
  return <>
    <Specimen label="Size and context" note="Ongoing work"><div className="demo-row demo-row--centered"><Spinner size="small" label="Loading row" /><Spinner label="Loading panel" /><Spinner size="large" label="Loading page" /><Button loading>Saving</Button></div></Specimen>
    <ApiStrip values={["small", "medium", "large", "button", "inline", "surface", "contrast", "labelled", "reduced motion"]} />
  </>;
}

function AlertDemo() {
  const [visible, setVisible] = useState(true);
  return <>
    <Specimen label="Product recipe" note="Persistent feedback belongs beside the affected work">
      <div className="demo-stack demo-stack--wide">
        <Alert title="Import complete">{libraryComponents.length} components were added to the local registry.</Alert>
        <Alert variant="critical" title="Registry could not be verified" action={<Button size="small" variant="secondary">Review</Button>}>One source path no longer resolves.</Alert>
        {visible ? <Alert title="Keyboard review ready" onDismiss={() => setVisible(false)}>Run the documented tab order before release.</Alert> : <Button size="small" variant="quiet" onClick={() => setVisible(true)}>Restore dismissed alert</Button>}
      </div>
    </Specimen>
    <ApiStrip values={["neutral", "critical", "title", "description", "action", "dismiss", "polite", "assertive"]} />
  </>;
}

function EmptyStateDemo() {
  return <>
    <Specimen label="Product recipe" note="Explain why the collection is empty">
      <EmptyState title="No components match this view" description="Clear the active filters or add a component from the registry." primaryAction={<Button variant="primary" size="small">Add component</Button>} secondaryAction={<Button variant="ghost" size="small">Clear filters</Button>} />
    </Specimen>
    <ApiStrip values={["title", "description", "icon", "primary action", "secondary action", "compact"]} />
  </>;
}

function AlertDialogDemo() {
  return <>
    <Specimen label="Product recipe" note="Consequential action">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="secondary" />}>Discard draft</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Discard this component draft?</AlertDialogTitle><AlertDialogDescription>The draft and its unpublished interaction notes will be permanently removed.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogClose render={<Button variant="ghost" />}>Keep draft</AlertDialogClose><AlertDialogClose render={<Button variant="primary" />}>Discard draft</AlertDialogClose></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Specimen>
    <ApiStrip values={["required response", "focus trap", "Escape policy", "title", "description", "safe initial focus", "focus return"]} />
  </>;
}

function NumberFieldDemo() {
  return <>
    <Specimen label="Product recipe" note="Locale-aware stepping and bounds">
      <div className="field-demo-grid number-field-demo-grid">
        <NumberField label="Cycle capacity" description="Issues available to this cycle." defaultValue={24} min={1} max={99} />
        <NumberField label="Estimate" defaultValue={3} min={0} max={100} suffix="pts" />
        <NumberField label="Failed value" defaultValue={120} min={0} max={100} error="Use a value from 0 to 100." />
        <NumberField label="Locked budget" value={80} suffix="%" readOnly />
      </div>
    </Specimen>
    <ApiStrip values={["Arrow Up / Down", "increment", "decrement", "min", "max", "step", "locale", "format", "readOnly", "disabled"]} />
  </>;
}

function DatePickerDemo() {
  return <>
    <Specimen label="Product recipe" note="Locale-aware entry and calendar selection">
      <Suspense fallback={<ReactAriaPreviewFallback />}><DatePickerExample /></Suspense>
    </Specimen>
    <ApiStrip values={["locale", "calendar system", "date segments", "Arrow keys", "Page Up / Down", "min / max", "unavailable dates", "validation"]} />
  </>;
}

function SegmentedControlDemo() {
  const [view, setView] = useState<string | null>("list");
  return <>
    <Specimen label="Product recipe" note={`Current view: ${view ?? "None"}`}>
      <div className="demo-stack demo-stack--wide">
        <SegmentedControl label="Issue view" value={view ?? undefined} onValueChange={setView} options={[{ value: "list", label: "List" }, { value: "board", label: "Board" }, { value: "timeline", label: "Timeline" }]} />
        <SegmentedControl label="Density" size="small" defaultValue="compact" options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }, { value: "spacious", label: "Spacious", disabled: true }]} />
      </div>
    </Specimen>
    <ApiStrip values={["single selection", "Arrow keys", "Home / End", "horizontal", "vertical", "small", "disabled item"]} />
  </>;
}

function CollapsibleDemo() {
  return <>
    <Specimen label="Product recipe" note="Supporting detail without navigation">
      <div className="demo-stack demo-stack--wide">
        <Collapsible className="teum-collapsible" defaultOpen><CollapsibleTrigger>Advanced filter rules</CollapsibleTrigger><CollapsibleContent>Matches components whose state contract includes focus restoration, keyboard dismissal, and a reduced-motion fallback.</CollapsibleContent></Collapsible>
        <Collapsible className="teum-collapsible"><CollapsibleTrigger>Compatibility details</CollapsibleTrigger><CollapsibleContent>Tested with React {currentCompatibility[0].value}, TypeScript {currentCompatibility[1].value}, Base UI {currentCompatibility[2].value}, and React Aria {currentCompatibility[3].value}.</CollapsibleContent></Collapsible>
      </div>
    </Specimen>
    <ApiStrip values={["closed", "open", "Enter / Space", "focus remains", "disabled", "hidden until found", "reduced motion"]} />
  </>;
}

const tableRecipeRows = [
  { id: "INT-184", name: "Motion contract", status: "In review", owner: "Mina", updated: "8m" },
  { id: "INT-179", name: "Density audit", status: "Ready", owner: "Avery", updated: "24m" },
  { id: "INT-172", name: "Focus map", status: "Draft", owner: "Noah", updated: "1h" },
  { id: "INT-168", name: "Dark surfaces", status: "Ready", owner: "Sofia", updated: "2h" },
  { id: "INT-162", name: "Command registry", status: "Draft", owner: "Mina", updated: "3h" },
  { id: "INT-158", name: "Semantic colors", status: "In review", owner: "Avery", updated: "5h" },
  { id: "INT-151", name: "Table recipe", status: "Ready", owner: "Noah", updated: "8h" },
  { id: "INT-147", name: "Alert announcement", status: "Draft", owner: "Sofia", updated: "11h" },
  { id: "INT-139", name: "Keyboard direct", status: "Ready", owner: "Mina", updated: "1d" },
  { id: "INT-132", name: "Reduced motion", status: "In review", owner: "Avery", updated: "1d" },
  { id: "INT-126", name: "Overlay origin", status: "Draft", owner: "Noah", updated: "2d" },
  { id: "INT-118", name: "Registry contract", status: "Ready", owner: "Sofia", updated: "3d" },
] as const;

function DataTableRecipe({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [ascending, setAscending] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const rows = useMemo(() => tableRecipeRows
    .filter((row) => `${row.id} ${row.name} ${row.owner} ${row.status}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    .sort((a, b) => ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)), [ascending, query]);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const visibleRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const allSelected = visibleRows.length > 0 && visibleRows.every((row) => selected.includes(row.id));
  const toggleRow = (id: string, checked: boolean) => setSelected((current) => checked ? [...new Set([...current, id])] : current.filter((value) => value !== id));
  const toggleAll = (checked: boolean) => setSelected((current) => checked ? [...new Set([...current, ...visibleRows.map((row) => row.id)])] : current.filter((value) => !visibleRows.some((row) => row.id === value)));
  const updateQuery = (value: string) => { setQuery(value); setPage(1); };

  return <div className="data-table-recipe" data-compact={compact || undefined}>
    <div className="data-table-recipe__toolbar"><SearchInput aria-label="Filter issues" value={query} onChange={(event) => updateQuery(event.target.value)} onClear={() => updateQuery("")} placeholder="Filter issues…" /><Badge variant="outline">{rows.length} results</Badge></div>
    <Table aria-label="Interaction quality issues">
      <TableHeader><TableRow><TableHead className="data-table-recipe__select"><Checkbox aria-label="Select every visible issue" checked={allSelected} indeterminate={!allSelected && visibleRows.some((row) => selected.includes(row.id))} onCheckedChange={(checked) => toggleAll(Boolean(checked))} /></TableHead><TableHead aria-sort={ascending ? "ascending" : "descending"}><button className="teum-table-sort" type="button" aria-label={`Sort issues ${ascending ? "descending" : "ascending"}`} onClick={() => setAscending((value) => !value)}>Issue <ArrowsDownUp /></button></TableHead><TableHead>Status</TableHead><TableHead>Owner</TableHead><TableHead>Updated</TableHead></TableRow></TableHeader>
      <TableBody>{visibleRows.map((row) => <TableRow key={row.id} data-selected={selected.includes(row.id) || undefined}><TableCell className="data-table-recipe__select"><Checkbox aria-label={`Select ${row.name}`} checked={selected.includes(row.id)} onCheckedChange={(checked) => toggleRow(row.id, Boolean(checked))} /></TableCell><TableCell><span className="data-table-recipe__identity"><strong>{row.name}</strong><small>{row.id}</small></span></TableCell><TableCell><Badge className="data-table-recipe__status" variant="outline" data-status={row.status.toLocaleLowerCase().replaceAll(" ", "-")}>{row.status}</Badge></TableCell><TableCell>{row.owner}</TableCell><TableCell>{row.updated}</TableCell></TableRow>)}</TableBody>
    </Table>
    {!rows.length && <EmptyState size="compact" title="No matching issues" description="Try another title, identifier, owner, or status." secondaryAction={<Button size="small" variant="ghost" onClick={() => updateQuery("")}>Clear search</Button>} />}
    <div className="data-table-recipe__footer"><span>{selected.length ? `${selected.length} selected` : `Page ${page} of ${totalPages}`}</span><Pagination label={compact ? "Issue table preview pages" : "Issue table pages"} page={page} totalPages={totalPages} onPageChange={setPage} siblingCount={0} /></div>
  </div>;
}

function TableDemo() {
  return <>
    <Specimen className="specimen--signature" label="Product recipe" note="A table primitive composed into a local data-table recipe"><DataTableRecipe /></Specimen>
    <ApiStrip values={["caption", "header", "row", "cell", "selection", "sorting recipe", "filtering recipe", "empty recipe", "pagination recipe"]} />
  </>;
}

function TreeDemo() {
  return <>
    <Specimen label="Product recipe" note="Hierarchical project navigation">
      <Suspense fallback={<ReactAriaPreviewFallback />}><TreeExample /></Suspense>
    </Specimen>
    <ApiStrip values={["Arrow Up / Down", "Arrow Left / Right", "Home / End", "typeahead", "selection", "expanded keys", "disabled item"]} />
  </>;
}

function ReorderableListDemo() {
  return <>
    <Specimen className="specimen--signature" label="Product recipe" note="Reorder with pointer, touch, or the keyboard drag handle">
      <Suspense fallback={<ReactAriaPreviewFallback />}><ReorderableListExample /></Suspense>
    </Specimen>
    <ApiStrip values={["pointer drag", "touch drag", "keyboard drag", "screen-reader announcements", "drop indicator", "controlled order", "reduced motion"]} />
  </>;
}

function InlineEditDemo({ includeContract = true }: { includeContract?: boolean } = {}) {
  const [title, setTitle] = useState("Teum");
  const saveTitle = async (value: string) => {
    await new Promise((resolve) => window.setTimeout(resolve, 420));
    setTitle(value);
  };
  return (
    <>
      <Specimen label="Product recipe" note="Rename without losing context">
        <div className="inline-edit-demo"><span className="inline-edit-demo__eyebrow">Project title</span><InlineEdit value={title} onSave={saveTitle} validate={(value) => value.length < 3 ? "Use at least 3 characters." : undefined} /></div>
      </Specimen>
      {includeContract && <ContractPanel contract={inlineEditContract} />}
      <ApiStrip values={["click · edit", "Enter · save", "Escape · cancel", "blur · save", "focus return"]} />
    </>
  );
}

function ActionListDemo({ includeContract = true }: { includeContract?: boolean } = {}) {
  const [lastAction, setLastAction] = useState("No action selected");
  const items = useMemo(() => [
    { id: "create", label: "Create component", description: "Start with the system defaults", icon: <Plus />, shortcut: "C" },
    { id: "duplicate", label: "Duplicate current", description: "Copy states and behavior contract", icon: <Copy />, shortcut: "⌘D" },
    { id: "archive", label: "Archive component", description: "Move it out of the active index", icon: <Archive />, shortcut: "E", loading: true },
    { id: "delete", label: "Delete permanently", description: "Remove the component and its notes", icon: <Trash />, variant: "danger" as const },
    { id: "publish", label: "Publish component", icon: <Check />, disabled: true, inactiveReason: "Complete the accessibility review first" },
  ], []);
  return (
    <>
      <Specimen className="specimen--signature" label="Product recipe" note={lastAction}>
        <div className="command-recipe">
          <div className="command-recipe__context" aria-hidden="true">
            <div className="command-recipe__toolbar"><span>Cycle 42</span><strong>Interaction quality</strong><span>12 issues</span></div>
            <div className="command-recipe__row"><span /><div><strong>Refine spatial continuity</strong><small>INT-184 · In review</small></div><em>Gavin</em></div>
            <div className="command-recipe__row"><span /><div><strong>Audit compact density</strong><small>INT-179 · Ready</small></div><em>Today</em></div>
            <div className="command-recipe__row"><span /><div><strong>Map keyboard focus</strong><small>INT-172 · Draft</small></div><em>1h</em></div>
          </div>
          <ActionList items={items} onAction={(item) => setLastAction(`Ran: ${item.label}`)} />
        </div>
      </Specimen>
      {includeContract && <ContractPanel contract={actionListContract} />}
      <ApiStrip values={["combobox", "aria-activedescendant", "Arrow keys", "Home / End", "Enter", "disabled options"]} />
    </>
  );
}

function SharedDetailDemo({ includeContract = true }: { includeContract?: boolean } = {}) {
  return (
    <>
      <Specimen className="specimen--signature" label="Product recipe" note="Inspect neighboring issues without losing place"><SharedDetail items={sharedItems} defaultSelectedId="motion" regionLabel="Product recipe shared detail" /></Specimen>
      {includeContract && <ContractPanel contract={sharedDetailContract} />}
      <ApiStrip values={["Continuity preset", "shared title", "interruptible retarget", "Escape", "focus origin", "reduced motion"]} />
    </>
  );
}

function UndoStackDemo({ includeContract = true }: { includeContract?: boolean } = {}) {
  const { pushUndo } = useUndoStack();
  const seed = [
    { id: "INT-184", title: "Define motion contract", status: "In review", updated: "8m" },
    { id: "INT-179", title: "Audit compact density", status: "Ready", updated: "24m" },
    { id: "INT-172", title: "Map keyboard focus", status: "Draft", updated: "1h" },
  ];
  const [items, setItems] = useState(seed);
  const archive = (item: (typeof seed)[number], index: number) => {
    setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    pushUndo({ label: `Archived “${item.title}”`, undo: () => setItems((current) => [...current.slice(0, index), item, ...current.slice(index)]) });
  };
  return (
    <>
      <Specimen className="specimen--signature" label="Product recipe" note="Archive multiple rows, then use Undo or ⌘Z">
        <div className="undo-demo">
          <div className="undo-demo__header"><div><span>Cycle 42</span><strong>Interaction quality</strong></div><small>{items.length} active</small></div>
          <div className="undo-demo__list">
            {items.length ? items.map((item, index) => (
              <div key={item.id}>
                <span className="undo-demo__dot" aria-hidden="true" />
                <span className="undo-demo__identity"><strong>{item.title}</strong><small>{item.id} · Updated {item.updated}</small></span>
                <span className="undo-demo__status">{item.status}</span>
                <IconButton variant="ghost" size="small" aria-label={`Archive ${item.title}`} tooltip="Archive" onClick={() => archive(item, index)}><Archive /></IconButton>
              </div>
            )) : <div className="undo-demo__empty">All items archived</div>}
          </div>
          <UndoBar />
        </div>
      </Specimen>
      {includeContract && <ContractPanel contract={undoStackContract} />}
      <ApiStrip values={["LIFO stack", "Cmd / Ctrl + Z", "inverse action", "live announcement", "multiple recovery"]} />
    </>
  );
}

function DemoFor({ id, includeContract = true }: { id: ComponentId; includeContract?: boolean }) {
  const demos: Record<ComponentId, ReactNode> = {
    button: <ButtonDemo />, "icon-button": <IconButtonDemo />, field: <FieldDemo />, "input-group": <InputGroupDemo />, kbd: <KbdDemo />, "button-group": <ButtonGroupDemo />, toolbar: <ToolbarDemo />, "text-field": <TextFieldDemo />, textarea: <TextareaDemo />, checkbox: <CheckboxDemo />, "radio-group": <RadioGroupDemo />, switch: <SwitchDemo />, select: <SelectDemo />, "context-switcher": <ContextSwitcherDemo />, combobox: <ComboboxDemo />, "search-input": <SearchInputDemo />, "number-field": <NumberFieldDemo />, "date-picker": <DatePickerDemo />, "segmented-control": <SegmentedControlDemo />,
    tooltip: <TooltipDemo />, popover: <PopoverDemo />, menu: <MenuDemo />, "context-menu": <ContextMenuDemo />, dialog: <DialogDemo />, sheet: <SheetDemo />, "alert-dialog": <AlertDialogDemo />, tabs: <TabsDemo />, toast: <ToastDemo />,
    breadcrumbs: <BreadcrumbsDemo />, pagination: <PaginationDemo />, collapsible: <CollapsibleDemo />, progress: <ProgressDemo />, spinner: <SpinnerDemo />, skeleton: <SkeletonDemo />, alert: <AlertDemo />, "empty-state": <EmptyStateDemo />, badge: <BadgeDemo />, avatar: <AvatarDemo />, table: <TableDemo />, tree: <TreeDemo />,
    "reorderable-list": <ReorderableListDemo />, "inline-edit": <InlineEditDemo includeContract={includeContract} />, "action-list": <ActionListDemo includeContract={includeContract} />, "shared-detail": <SharedDetailDemo includeContract={includeContract} />, "undo-stack": <UndoStackDemo includeContract={includeContract} />,
  };
  return demos[id];
}

const flowSpecimens = new Set<ComponentId>([
  "action-list",
  "shared-detail",
  "undo-stack",
]);

const contextSpecimens = new Set<ComponentId>([
  "button",
  "field",
  "input-group",
  "button-group",
  "toolbar",
  "text-field",
  "textarea",
  "select",
  "context-switcher",
  "combobox",
  "search-input",
  "number-field",
  "collapsible",
  "popover",
  "menu",
  "dialog",
  "sheet",
  "date-picker",
  "context-menu",
  "alert-dialog",
  "alert",
  "empty-state",
  "table",
  "tree",
  "reorderable-list",
  "inline-edit",
]);

function getSpecimenType(id: ComponentId) {
  if (flowSpecimens.has(id)) return "flow" as const;
  if (contextSpecimens.has(id)) return "context" as const;
  return "compact" as const;
}

function ButtonProductContext() {
  return (
    <section className="product-context product-context--composer" aria-label="Issue composer action example">
      <header className="product-context__header">
        <div><span>New issue</span><strong>Improve keyboard focus</strong></div>
        <Badge variant="outline">Draft</Badge>
      </header>
      <div className="product-context__body">
        <p>Check pointer and keyboard focus across previews.</p>
        <div className="product-context__actions">
          <Button variant="primary">Create issue</Button>
          <Button variant="secondary">Save draft</Button>
          <Button variant="quiet">Cancel</Button>
        </div>
      </div>
    </section>
  );
}

function TextFieldProductContext() {
  return (
    <section className="product-context product-context--setting" aria-label="Project setting example">
      <div className="product-context__copy">
        <strong>Project identity</strong>
        <span>Used in navigation, search, and shared links.</span>
      </div>
      <div className="product-context__field">
        <TextField label="Project name" defaultValue="Teum" description="Visible to everyone in the workspace." />
      </div>
    </section>
  );
}

function SheetProductContext() {
  return (
    <section className="product-context product-context--toolbar" aria-label="Issue property panel example">
      <div className="product-context__identity">
        <span className="product-context__icon"><Rows aria-hidden="true" /></span>
        <div><strong>Motion contract</strong><span>INT-184 · In review</span></div>
      </div>
      <Sheet>
        <SheetTrigger render={<Button variant="secondary" size="small">Properties</Button>} />
        <SheetContent>
          <SheetHeader><SheetTitle>Issue properties</SheetTitle><SheetDescription>Organize this issue without leaving the list.</SheetDescription></SheetHeader>
          <SheetBody><TextField label="Title" defaultValue="Motion contract" /><Select label="Priority" options={priorityOptions} defaultValue="medium" /></SheetBody>
          <SheetFooter><SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose><SheetClose render={<Button variant="primary" />}>Save changes</SheetClose></SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  );
}

export function PrimaryPreviewFor({ id }: { id: ComponentId }) {
  if (id === "button") return <ButtonProductContext />;
  if (id === "icon-button") return <AsyncIconButtonPreview />;
  if (id === "field") return <ProjectFieldPreview />;
  if (id === "input-group") return <PrimaryInputGroupPreview />;
  if (id === "kbd") return <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>;
  if (id === "button-group") return <ActionButtonGroupPreview />;
  if (id === "toolbar") return <PrimaryToolbarPreview />;
  if (id === "text-field") return <ProjectTextFieldPreview />;
  if (id === "textarea") return <DescriptionTextareaPreview />;
  if (id === "checkbox") return <InteractionNotesCheckboxPreview />;
  if (id === "radio-group") return <NotificationRadioPreview />;
  if (id === "switch") return <InteractionSwitchPreview />;
  if (id === "select") return <PrioritySelectPreview />;
  if (id === "context-switcher") return <PlatformContextSwitcherPreview />;
  if (id === "combobox") return <AssigneeComboboxPreview />;
  if (id === "search-input") return <ComponentSearchPreview />;
  if (id === "number-field") return <CompactNumberFieldPreview />;
  if (id === "date-picker") return <Suspense fallback={<ReactAriaPreviewFallback />}><DatePickerPrimaryPreview /></Suspense>;
  if (id === "segmented-control") return <IssueViewSegmentedPreview />;
  if (id === "tooltip") return <FavoriteTooltipPreview />;
  if (id === "popover") return <ViewOptionsPopoverPreview />;
  if (id === "menu") return <IssueActionsMenuPreview />;
  if (id === "context-menu") return <IssueContextMenuPreview />;
  if (id === "dialog") return <ComponentMetadataDialogPreview />;
  if (id === "sheet") return <IssuePropertiesSheetPreview />;
  if (id === "alert-dialog") return <DiscardDraftAlertPreview />;
  if (id === "tabs") return <StableTabsPreview />;
  if (id === "breadcrumbs") return <BreadcrumbPathPreview />;
  if (id === "pagination") return <PrimaryPagination />;
  if (id === "collapsible") return <FilterCollapsiblePreview />;
  if (id === "toast") return <ComponentToastPreview />;
  if (id === "progress") return <ExportProgressPreview />;
  if (id === "spinner") return <div className="demo-row demo-row--centered"><Spinner label="Loading content" /><span>Loading content</span></div>;
  if (id === "skeleton") return <div className="skeleton-recipe"><Skeleton radius="round" width={32} height={32} /><SkeletonText lines={3} /></div>;
  if (id === "alert") return <DismissibleAlertPreview />;
  if (id === "empty-state") return <EmptyCollectionPreview />;
  if (id === "badge") return <PrimaryBadgePreview />;
  if (id === "avatar") return <AvatarGroup aria-label="Project members"><Avatar fallback="AS" alt="Avery Stone" size="large" /><Avatar fallback="MP" alt="Mina Park" size="large" status="online" /><Avatar fallback="NW" alt="Noah Williams" size="large" /></AvatarGroup>;
  if (id === "table") return <DataTableRecipe compact />;
  if (id === "tree") return <Suspense fallback={<ReactAriaPreviewFallback />}><TreePrimaryPreview /></Suspense>;
  if (id === "reorderable-list") return <Suspense fallback={<ReactAriaPreviewFallback />}><ReorderableListPrimaryPreview /></Suspense>;
  if (id === "inline-edit") return <PrimaryInlineEdit />;
  if (id === "action-list") return <PrimaryActionList />;
  if (id === "shared-detail") return <div className="primary-shared-detail"><SharedDetail items={sharedItems} defaultSelectedId="motion" focusOnOpen={false} regionLabel="Shared Detail product context" /></div>;
  return <UndoStackProvider><PrimaryUndo /></UndoStackProvider>;
}

function PrimaryInputGroupPreview() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyRepository = async () => {
    if (!await copyText("minwook/teum")) return;
    setCopied(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 1200);
  };

  return <div className="primary-field-preview"><InputGroup><InputGroupAddon>github.com/</InputGroupAddon><InputGroupInput aria-label="Repository path" defaultValue="minwook/teum" /><InputGroupButton aria-label={copied ? "Repository path copied" : "Copy repository path"} onClick={() => void copyRepository()}>{copied ? <Check weight="bold" /> : <Copy />}</InputGroupButton></InputGroup><span className="teum-sr-only" role="status" aria-live="polite">{copied ? "Repository path copied" : ""}</span></div>;
}

function PrimaryToolbarPreview() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  return <Toolbar aria-label="Formatting"><ToolbarButton aria-label="Bold" aria-pressed={bold} onClick={() => setBold((value) => !value)}><strong>B</strong></ToolbarButton><ToolbarButton aria-label="Italic" aria-pressed={italic} onClick={() => setItalic((value) => !value)}><em>I</em></ToolbarButton><ToolbarSeparator /><ToolbarButton aria-label="Add link"><LinkSimple /></ToolbarButton><ToolbarInput aria-label="Find" placeholder="Find…" /></Toolbar>;
}

function PrimaryBadgePreview() {
  const [showDesign, setShowDesign] = useState(true);

  return <div className="demo-row demo-row--centered"><Badge>Draft</Badge><Badge variant="strong">In review</Badge>{showDesign ? <Badge variant="outline" removable removeLabel="Remove Design filter" onRemove={() => setShowDesign(false)}>Design</Badge> : <Button variant="quiet" size="small" onClick={() => setShowDesign(true)}>Restore filter</Button>}</div>;
}

function PrimaryPagination() {
  const [page, setPage] = useState(3);
  return <Pagination label="Component preview pagination" page={page} totalPages={12} onPageChange={setPage} />;
}

function PrimaryInlineEdit() {
  const [value, setValue] = useState("Teum");
  return <div className="primary-inline-edit"><span>Project title</span><InlineEdit value={value} onSave={setValue} /></div>;
}

function PrimaryActionList() {
  const items = useMemo(() => [
    { id: "create", label: "Create component", description: "Start with the system defaults", icon: <Plus />, shortcut: "C" },
    { id: "duplicate", label: "Duplicate current", description: "Copy states and behavior contract", icon: <Copy />, shortcut: "⌘D" },
    { id: "archive", label: "Archive component", description: "Move it out of the active index", icon: <Archive />, shortcut: "E" },
  ], []);
  return <div className="primary-action-list"><ActionList items={items} onAction={(item) => toast(`${item.label} selected`, { id: "action-list-selection" })} /></div>;
}

function PrimaryUndo() {
  const { pushUndo } = useUndoStack();
  const [archived, setArchived] = useState(false);
  return <div className="primary-undo"><div><strong>Motion contract</strong><small>{archived ? "Archived" : "INT-184 · In review"}</small></div><Button variant="secondary" onClick={() => { setArchived(true); pushUndo({ label: "Archived Motion contract", undo: () => setArchived(false) }); }}>Archive</Button><UndoBar /></div>;
}

function ComponentLiveExample({ id }: { id: ComponentId }) {
  const [resetKey, setResetKey] = useState(0);
  const [mode, setMode] = useState<"product" | "state">("product");
  const [stateIndex, setStateIndex] = useState(0);
  const states = componentGuidance[id].states;
  const selectedState = states[stateIndex] ?? states[0] ?? "Default";
  const specimen = mode === "state" ? "compact" : getSpecimenType(id);
  useEffect(() => {
    setMode("product");
    setStateIndex(0);
    setResetKey(0);
  }, [id]);
  const reset = () => {
    toast.dismiss();
    setResetKey((value) => value + 1);
  };
  const controls = (
    <div className="live-specimen__controls">
      <div className="live-specimen__tabs" role="group" aria-label="Preview mode">
        <button type="button" aria-pressed={mode === "product"} onClick={() => setMode("product")}>Product</button>
        <button type="button" aria-pressed={mode === "state"} onClick={() => setMode("state")}>State</button>
      </div>
      {mode === "state" && (
        <Menu>
          <MenuTrigger render={<button className="live-specimen__state-trigger" type="button" aria-label={`Preview state: ${selectedState}`}><span>{selectedState}</span><CaretDown aria-hidden="true" /></button>} />
          <MenuContent className="live-specimen__state-menu" align="end" side="bottom" sideOffset={5} collisionAvoidance={{ side: "shift", align: "shift", fallbackAxisSide: "none" }}>
            <MenuRadioGroup value={selectedState} onValueChange={(state: string) => {
              const nextIndex = states.findIndex((option) => option === state);
              if (nextIndex >= 0) setStateIndex(nextIndex);
            }}>
              {states.map((state) => <MenuRadioItem key={state} value={state}>{state}</MenuRadioItem>)}
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
      )}
    </div>
  );
  const stateSlug = selectedState.toLocaleLowerCase().replaceAll(" ", "-");
  return (
    <LiveSpecimen id={id} controls={controls} specimen={specimen} note={mode === "product" ? "Interactive" : selectedState} onReset={reset}>
      {mode === "product" ? <div key={`${id}-product-${resetKey}`} className="primary-preview"><PrimaryPreviewFor id={id} /></div> : <article key={`${id}-${stateSlug}-${resetKey}`} className="state-tile state-tile--live" data-state={stateSlug} data-state-flags={getStateFlags(selectedState)} aria-label={`${selectedState} state preview`}><div className="state-tile__preview" inert><StatePreview id={id} state={selectedState} index={stateIndex} /></div></article>}
    </LiveSpecimen>
  );
}

function StatePreview({ id, state, index }: { id: ComponentId; state: string; index: number }) {
  return <ComponentStatePreview id={id} state={state} index={index} />;
}

function ComponentStateCoverage({ id, states }: { id: ComponentId; states: readonly string[] }) {
  return (
    <section className="component-state-coverage" id="system-states" aria-labelledby="state-coverage-title">
      <div className="component-state-coverage__header"><div><h2 id="state-coverage-title">States</h2></div></div>
      <ul className="state-gallery" aria-label={`${components.find((component) => component.id === id)?.name ?? id} state contract`}>
        {states.map((state, index) => (
          <li className="state-tile" data-state={state.toLocaleLowerCase().replaceAll(" ", "-")} data-state-flags={getStateFlags(state)} key={`${id}-${state}`}>
            <span>{state}</span>
            <div className="state-tile__preview" inert><StatePreview id={id} state={state} index={index} /></div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NavigationSection({ label, count, expanded, active, onToggle, children }: { label: string; count?: number; expanded: boolean; active?: boolean; onToggle: () => void; children: ReactNode }) {
  const contentId = useId();
  return <section className="system-nav-group" data-expanded={expanded || undefined} data-active={active || undefined}>
    <button type="button" className="system-nav-group__trigger" aria-controls={contentId} aria-expanded={expanded} onClick={onToggle}><span>{label}</span>{typeof count === "number" && <small>{count}</small>}<CaretDown className="system-nav-group__chevron" aria-hidden="true" /></button>
    <div id={contentId} className="system-nav-group__content" aria-hidden={!expanded} inert={!expanded ? true : undefined}><div className="system-nav-group__content-inner">{children}</div></div>
  </section>;
}

const navigationLeafIcons: Partial<Record<string, typeof Compass>> = {
  installation: DownloadSimple,
  "choosing-components": Selection,
  "product-pilot": Monitor,
  analytics: ChartLine,
  "agent-native": TerminalWindow,
  foundations: Stack,
  "foundation-color": Palette,
  "foundation-typography": TextT,
  "foundation-spacing": ArrowsOutLineHorizontal,
  "foundation-motion": WaveSine,
  patterns: Stack,
  "edit-in-place": CursorText,
  "find-and-act": Command,
  "preserve-context": SidebarSimple,
  "recover-from-action": ArrowCounterClockwise,
  "component-status": CheckCircle,
  accessibility: PersonArmsSpread,
  "browser-support": Browsers,
  security: ShieldCheck,
  contributing: GitBranch,
  releases: Tag,
  licensing: FileText,
};

function NavigationLeaf({ id, label, selected, meta, onSelect }: { id: string; label: string; selected: boolean; meta?: string; onSelect: () => void }) {
  const Icon = navigationLeafIcons[id];
  return <a className={Icon ? "system-nav-leaf system-nav-leaf--icon" : "system-nav-leaf"} href={`#${id}`} data-selected={selected || undefined} aria-current={selected ? "page" : undefined} onClick={(event) => { event.preventDefault(); onSelect(); }}>
    {Icon && <span className="system-nav-leaf__icon"><Icon weight="regular" aria-hidden="true" /></span>}
    <strong>{label}</strong>
    {meta && <em>{meta}</em>}
  </a>;
}

function PageOutline({ view, onNavigate }: { view: ViewId; onNavigate: (id: ViewId) => void }) {
  const componentView = components.some((item) => item.id === view);
  const patternView = patterns.some((item) => item.id === view);
  const docView = isPublicDocId(view);
  const items = docView ? publicDocOutlines[view] : componentView ? [
    { id: "system-overview", label: "Overview" },
    { id: "system-preview", label: "Preview" },
    { id: "system-examples", label: "Examples" },
    { id: "system-states", label: "States" },
    { id: "system-usage", label: "Usage" },
    { id: "system-accessibility", label: "Accessibility" },
    { id: "system-api", label: "API" },
  ] : patternView ? [
    { id: "system-overview", label: "Overview" },
    { id: "pattern-live", label: "Live pattern" },
    { id: "pattern-guidance", label: "Guidance" },
    { id: "pattern-contract", label: "Behavior contract" },
    { id: "pattern-built-from", label: "Built from" },
  ] : [{ id: "system-overview", label: "Overview" }];

  const itemKey = items.map((item) => item.id).join("|");
  const [activeOutlineId, setActiveOutlineId] = useState(items[0]?.id ?? "system-overview");
  const lockedOutlineId = useRef<string | null>(null);

  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>(".system-detail__scroll");
    if (!scroller) return;
    const sectionIds = itemKey.split("|").filter(Boolean);
    let frame = 0;
    let navigationFrame = 0;
    let sectionObserver: MutationObserver | null = null;
    const update = () => {
      frame = 0;
      if (lockedOutlineId.current) {
        setActiveOutlineId(lockedOutlineId.current);
        return;
      }
      const readingLine = scroller.getBoundingClientRect().top + 96;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= readingLine) current = id;
      }
      const nearBottom = scroller.scrollTop > 1 && scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= 3;
      setActiveOutlineId(nearBottom ? sectionIds.at(-1) ?? current : current);
    };
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    const unlock = () => { lockedOutlineId.current = null; };
    const unlockFromKeyboard = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) unlock();
    };
    const requestedSection = readHashRoute().view === view ? readHashRoute().section : undefined;
    lockedOutlineId.current = requestedSection && sectionIds.includes(requestedSection) ? requestedSection : null;
    setActiveOutlineId(lockedOutlineId.current ?? sectionIds[0] ?? "system-overview");
    if (lockedOutlineId.current) {
      const scrollToRequestedSection = () => {
        const id = lockedOutlineId.current;
        if (!id) return false;
        const section = document.getElementById(id);
        if (!section) return false;
        section.scrollIntoView({ behavior: "auto", block: "start" });
        return true;
      };
      navigationFrame = window.requestAnimationFrame(() => {
        if (scrollToRequestedSection()) return;
        sectionObserver = new MutationObserver(() => {
          if (!scrollToRequestedSection()) return;
          sectionObserver?.disconnect();
          sectionObserver = null;
        });
        sectionObserver.observe(scroller, { childList: true, subtree: true });
      });
    } else {
      update();
    }
    scroller.addEventListener("scroll", schedule, { passive: true });
    scroller.addEventListener("wheel", unlock, { passive: true });
    scroller.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("keydown", unlockFromKeyboard);
    window.addEventListener("resize", schedule);
    return () => {
      scroller.removeEventListener("scroll", schedule);
      scroller.removeEventListener("wheel", unlock);
      scroller.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlockFromKeyboard);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      if (navigationFrame) window.cancelAnimationFrame(navigationFrame);
      sectionObserver?.disconnect();
    };
  }, [itemKey, view]);

  const scrollTo = (id: string) => {
    lockedOutlineId.current = id;
    setActiveOutlineId(id);
    window.history.replaceState(null, "", `#${view}/${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeOutlineId));
  return <aside className="system-outline system-outline--public" aria-label="Page outline"><div className="system-outline__section"><div className="system-outline__eyebrow"><span>On this page</span><small aria-live="polite">{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</small></div>{items.map((item) => <button type="button" key={item.id} data-active={item.id === activeOutlineId || undefined} aria-current={item.id === activeOutlineId ? "location" : undefined} onClick={() => scrollTo(item.id)}>{item.label}</button>)}</div>{view !== "licensing" && <div className="system-outline__section system-outline__actions"><button type="button" onClick={() => onNavigate("licensing")}><ShieldCheck aria-hidden="true" />MIT license</button></div>}</aside>;
}

function ConsolidatedDesignSystemMode({ view, onSelect, onHome, theme, onThemeChange }: { view: ViewId; onSelect: (id: ViewId) => void; onHome: () => void; theme: Theme; onThemeChange: (theme: Theme) => void }) {
  const publicDoc = isPublicDocId(view) ? publicDocItems.find((item) => item.id === view)! : undefined;
  const foundationId = view.startsWith("foundation-") ? view.replace("foundation-", "") as FoundationId : undefined;
  const foundations = view === "foundations" || Boolean(foundationId);
  const activePattern = patterns.find((pattern) => pattern.id === view);
  const patternsMode = view === "patterns" || Boolean(activePattern);
  const componentsMode = !publicDoc && !foundations && !patternsMode;
  const activeId: ComponentId = components.some((component) => component.id === view) ? view as ComponentId : "button";
  const [filter, setFilter] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const activeSection: NavSectionId = publicDoc
    ? publicDoc.group === "Getting started" ? "getting-started" : publicDoc.group === "Components" ? "components" : publicDoc.group === "Patterns" ? "patterns" : "project"
    : foundations ? "foundations" : patternsMode ? "patterns" : "components";
  const [expandedSections, setExpandedSections] = useState<Record<NavSectionId, boolean>>({ "getting-started": false, foundations: false, components: false, patterns: false, project: false });
  const activeComponent = components.find((item) => item.id === activeId)!;
  const guidance = componentGuidance[activeId];
  const filtered = libraryComponents.filter((component) => `${component.name} ${component.group} ${component.description}`.toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase()));
  const filteredPatterns = patterns.filter((pattern) => `${pattern.name} ${pattern.intent} ${pattern.description}`.toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase()));
  const filteredDocs = publicDocItems.filter((doc) => `${doc.label} ${doc.group} ${doc.description} ${publicDocOutlines[doc.id].map((item) => item.label).join(" ")}`.toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase()));
  const filteredFoundations = foundationItems.filter((foundation) => `${foundation.label} ${foundation.description}`.toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase()));
  const groups = [...new Set(filtered.map((component) => component.group))];
  const foundation = foundationItems.find((item) => item.id === foundationId);
  const pageTitle = publicDoc?.label ?? foundation?.label ?? activePattern?.name ?? (view === "foundations" ? "Foundations" : view === "patterns" ? "Patterns" : activeComponent.name);
  const pageDescription = publicDoc?.description ?? foundation?.description ?? activePattern?.description ?? (view === "foundations" ? "Color, type, spacing, and motion tokens." : view === "patterns" ? "Patterns for editing, acting, inspecting, and recovery." : activeComponent.description);

  useLayoutEffect(() => {
    document.title = "whatiuse";
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", pageDescription);
  }, [pageDescription, pageTitle]);

  useLayoutEffect(() => {
    const scroller = document.querySelector<HTMLElement>(".system-detail__scroll");
    if (!scroller) return;
    if (typeof scroller.scrollTo === "function") scroller.scrollTo({ top: 0, behavior: "auto" });
    else scroller.scrollTop = 0;
  }, [view]);

  const focusDocumentOnCompactNavigation = () => {
    if (!window.matchMedia("(max-width: 820px)").matches) return;
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById("teum-documentation-content")?.focus({ preventScroll: true })));
  };
  const openComponent = (id: ComponentId = activeId) => {
    setNavigationOpen(false);
    setExpandedSections({ "getting-started": false, foundations: false, components: true, patterns: false, project: false });
    onSelect(id);
    focusDocumentOnCompactNavigation();
  };
  const navigate = (id: ViewId) => {
    setNavigationOpen(false);
    const publicGroup = isPublicDocId(id) ? publicDocItems.find((item) => item.id === id)?.group : undefined;
    const nextSection: NavSectionId = publicGroup
      ? publicGroup === "Getting started" ? "getting-started" : publicGroup === "Components" ? "components" : publicGroup === "Patterns" ? "patterns" : "project"
      : id === "foundations" || id.startsWith("foundation-") ? "foundations" : id === "patterns" || patterns.some((pattern) => pattern.id === id) ? "patterns" : "components";
    setExpandedSections({ "getting-started": false, foundations: false, components: false, patterns: false, project: false, [nextSection]: true });
    onSelect(id);
    focusDocumentOnCompactNavigation();
  };
  const openPattern = (id: PatternId) => navigate(id);
  const openFoundation = (id: FoundationId) => navigate(`foundation-${id}`);
  const toggleSection = (id: NavSectionId) => setExpandedSections((current) => ({ "getting-started": false, foundations: false, components: false, patterns: false, project: false, [id]: !current[id] }));
  useEffect(() => {
    setFilter("");
  }, [view]);

  useEffect(() => {
    setExpandedSections({ "getting-started": false, foundations: false, components: false, patterns: false, project: false, [activeSection]: true });
  }, [activeSection]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        if (window.matchMedia("(max-width: 820px)").matches) {
          setNavigationOpen(true);
          window.requestAnimationFrame(() => document.querySelector<HTMLInputElement>(".system-nav--consolidated .system-component-search input")?.focus());
          return;
        }
        document.querySelector<HTMLInputElement>(".system-component-search--global input")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="system-stage system-stage--consolidated">
      <div className="system-window system-window--consolidated">
        <a className="teum-skip-link" href="#teum-documentation-content" onClick={(event) => { event.preventDefault(); document.getElementById("teum-documentation-content")?.focus({ preventScroll: true }); }}>Skip to documentation</a>
        <span className="teum-sr-only" role="status" aria-live="polite" aria-atomic="true">{pageTitle} page loaded</span>
        <aside className="system-nav system-nav--consolidated" aria-label="Design system navigation" data-open={navigationOpen || undefined}>
          <div className="system-brand"><a className="system-brand__home" href="/" aria-label="Teum home" onClick={(event) => { event.preventDefault(); onHome(); }}><span className="system-brand__mark"><Command weight="bold" /></span><strong>Teum</strong></a><button type="button" className="system-nav__close" aria-label="Close navigation" onClick={() => setNavigationOpen(false)}><X aria-hidden="true" /></button></div>
          <label className="system-component-search system-component-search--global"><MagnifyingGlass aria-hidden="true" /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search docs…" aria-label="Search documentation" /><kbd>⌘K</kbd></label>
          <div className="system-nav__scroll">
            <nav className="system-nav__items" aria-label="System sections">
              {filter ? <div className="system-search-results" role="region" aria-label="Documentation search results">
                <span className="system-nav__label">Search results</span>
                {filteredDocs.length > 0 && <div className="system-component-group"><span>Documentation</span>{filteredDocs.map((doc) => <NavigationLeaf key={doc.id} id={doc.id} label={doc.label} selected={doc.id === publicDoc?.id} onSelect={() => navigate(doc.id)} />)}</div>}
                {filteredFoundations.length > 0 && <div className="system-component-group"><span>Foundations</span>{filteredFoundations.map((foundation) => <NavigationLeaf key={foundation.id} id={`foundation-${foundation.id}`} label={foundation.label} selected={foundation.id === foundationId} onSelect={() => openFoundation(foundation.id)} />)}</div>}
                {filtered.length > 0 && groups.map((group) => <div className="system-component-group" key={group}><span>{group}</span>{filtered.filter((component) => component.group === group).map((component) => <a href={`#${component.id}`} key={component.id} data-selected={component.id === activeId && componentsMode || undefined} aria-current={component.id === activeId && componentsMode ? "page" : undefined} onClick={(event) => { event.preventDefault(); openComponent(component.id); }}><strong>{component.name}</strong></a>)}</div>)}
                {filteredPatterns.length > 0 && <div className="system-component-group"><span>Patterns</span>{filteredPatterns.map((pattern) => <NavigationLeaf key={pattern.id} id={pattern.id} label={pattern.name} selected={pattern.id === activePattern?.id} onSelect={() => openPattern(pattern.id)} />)}</div>}
                {!filteredDocs.length && !filteredFoundations.length && !filtered.length && !filteredPatterns.length && <div className="system-component-empty">No matching documentation</div>}
              </div> : <>
                <NavigationSection label="Getting started" expanded={expandedSections["getting-started"]} active={activeSection === "getting-started"} onToggle={() => toggleSection("getting-started")}>
                  <div className="system-component-list" role="region" aria-label="Getting started documentation"><div className="system-component-group">{publicDocItems.filter((doc) => doc.group === "Getting started").map((doc) => <NavigationLeaf key={doc.id} id={doc.id} label={doc.label} selected={doc.id === publicDoc?.id} onSelect={() => navigate(doc.id)} />)}</div></div>
                </NavigationSection>

                <NavigationSection label="Foundations" count={foundationItems.length} expanded={expandedSections.foundations} active={activeSection === "foundations"} onToggle={() => toggleSection("foundations")}>
                  <div className="system-component-list" role="region" aria-label="Foundation catalog"><div className="system-component-group"><NavigationLeaf id="foundations" label="Overview" selected={view === "foundations"} onSelect={() => navigate("foundations")} />{foundationItems.map((foundation) => <NavigationLeaf key={foundation.id} id={`foundation-${foundation.id}`} label={foundation.label} selected={foundation.id === foundationId} onSelect={() => openFoundation(foundation.id)} />)}</div></div>
                </NavigationSection>

                <NavigationSection label="Components" count={libraryComponents.length} expanded={expandedSections.components} active={activeSection === "components"} onToggle={() => toggleSection("components")}>
                  <div className="system-component-list system-component-list--catalog" role="region" aria-label="Component catalog">
                    <div className="system-component-group system-component-group--collections"><span>Collections</span>{publicDocItems.filter((doc) => doc.group === "Components").map((doc) => <NavigationLeaf key={doc.id} id={doc.id} label={doc.label} selected={doc.id === publicDoc?.id} onSelect={() => navigate(doc.id)} />)}</div>
                    {libraryComponentGroups.map((group) => <div className="system-component-group" key={group}><span>{group}</span>{libraryComponents.filter((component) => component.group === group).map((component) => <a href={`#${component.id}`} key={component.id} data-selected={component.id === activeId && componentsMode || undefined} aria-current={component.id === activeId && componentsMode ? "page" : undefined} onClick={(event) => { event.preventDefault(); openComponent(component.id); }}><strong>{component.name}</strong></a>)}</div>)}
                  </div>
                </NavigationSection>

                <NavigationSection label="Patterns" count={patterns.length} expanded={expandedSections.patterns} active={activeSection === "patterns"} onToggle={() => toggleSection("patterns")}>
                  <div className="system-component-list" role="region" aria-label="Pattern catalog"><div className="system-component-group"><NavigationLeaf id="patterns" label="Overview" selected={view === "patterns"} onSelect={() => navigate("patterns")} />{patterns.map((pattern) => <NavigationLeaf key={pattern.id} id={pattern.id} label={pattern.name} selected={pattern.id === activePattern?.id} onSelect={() => openPattern(pattern.id)} />)}{publicDocItems.filter((doc) => doc.group === "Patterns").map((doc) => <NavigationLeaf key={doc.id} id={doc.id} label={doc.label} selected={doc.id === publicDoc?.id} onSelect={() => navigate(doc.id)} />)}</div></div>
                </NavigationSection>

                {publicDocGroups.filter((group) => group.id === "project").map((group) => <NavigationSection key={group.id} label={group.label} expanded={expandedSections[group.id]} active={activeSection === group.id} onToggle={() => toggleSection(group.id)}><div className="system-component-list" role="region" aria-label={`${group.label} documentation`}><div className="system-component-group">{publicDocItems.filter((doc) => doc.group === group.label).map((doc) => <NavigationLeaf key={doc.id} id={doc.id} label={doc.label} selected={doc.id === publicDoc?.id} onSelect={() => navigate(doc.id)} />)}</div></div></NavigationSection>)}
              </>}
            </nav>
          </div>
          <div className="system-nav__footer"><a href="https://www.minwookshin.com/" target="_blank" rel="noreferrer">made by minwook</a><button type="button" onClick={() => navigate("licensing")}>MIT licensed</button></div>
        </aside>
        <button type="button" className="system-nav-scrim" data-open={navigationOpen || undefined} aria-label="Close navigation" aria-hidden={!navigationOpen} tabIndex={navigationOpen ? 0 : -1} onClick={() => setNavigationOpen(false)} />

        <header className="system-topbar system-topbar--consolidated" aria-label="Workspace actions">
          <div className="system-topbar__location"><button type="button" className="system-nav__open" aria-label="Open navigation" onClick={() => setNavigationOpen(true)}><List aria-hidden="true" /></button></div>
          <div className="system-topbar__actions">
            <Tooltip><TooltipTrigger render={<a className="system-icon-action" href="https://github.com/minwookshin/teum" target="_blank" rel="noreferrer" aria-label="View Teum on GitHub"><GithubLogo weight="fill" aria-hidden="true" /></a>} /><TooltipContent>GitHub</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger render={<a className="system-icon-action" href="#installation" aria-label="Open documentation" onClick={(event) => { event.preventDefault(); navigate("installation"); }}><BookOpenText aria-hidden="true" /></a>} /><TooltipContent>Documentation</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger render={<button type="button" className="theme-toggle" data-theme={theme} aria-label={"Current theme: " + theme + ". Switch to " + (theme === "light" ? "dark" : "light") + " theme"} onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}</button>} /><TooltipContent>{theme === "light" ? "Dark mode" : "Light mode"}</TooltipContent></Tooltip>
          </div>
        </header>

        <main className="system-detail system-detail--consolidated">
          <div id="teum-documentation-content" className="system-detail__scroll" tabIndex={0} role="region" aria-label="Documentation content">
            {publicDoc ? <Suspense fallback={<div className="system-detail__content public-doc-page system-reference-page public-doc-loading" aria-hidden="true">Loading documentation…</div>}><PublicDocPage id={publicDoc.id} onNavigate={(id) => navigate(id as ViewId)} /></Suspense> : foundations ? foundationId ? <FoundationDetail id={foundationId} onBack={() => navigate("foundations")} /> : <FoundationOverview onSelect={onSelect} /> : patternsMode ? activePattern ? <PatternDetail pattern={activePattern} /> : <PatternsOverview onSelect={openPattern} /> : <div className="system-detail__content system-reference-page system-component-page">
              <section className="system-overview" id="system-overview">
                <h1>{activeComponent.name}</h1>
                <p>{activeComponent.description}</p>
              </section>

              <div className="system-doc-panel system-doc-panel--sequential" id="system-content">
                <section className="system-section-heading" id="system-preview"><div><h2>Preview</h2></div></section>
                <ComponentLiveExample id={activeId} />

                <section className="system-section-heading system-section-heading--variants" id="system-examples"><div><h2>Examples</h2></div></section>
                <div className="system-specimens"><DemoFor id={activeId} /></div>

                <ComponentStateCoverage id={activeId} states={guidance.states} />

                <ComponentGuidancePanel guidance={guidance} mode="usage" />
                <ComponentGuidancePanel guidance={guidance} mode="accessibility" />
                <ComponentApiPanel id={activeId} />
              </div>
              <footer className="system-footer"><span>Teum</span><span>Inter / 4px base</span></footer>
            </div>}
          </div>
        </main>
        <PageOutline view={view} onNavigate={navigate} />
      </div>
    </div>
  );
}

function PatternsOverview({ onSelect }: { onSelect: (id: PatternId) => void }) {
  return (
    <div className="system-detail__content system-patterns system-editorial-page">
      <section className="system-overview">
        <h1>Patterns</h1>
        <p>Reusable product behaviors that connect components, state, motion, and recovery around a recurring user goal.</p>
      </section>

      <SystemSignature />

      <div className="pattern-index" role="region" aria-label="Interaction pattern index">
        {patterns.map((pattern) => <a href={`#${pattern.id}`} key={pattern.id} onClick={(event) => { event.preventDefault(); onSelect(pattern.id); }}>
          <div><span>{pattern.intent}</span><h2>{pattern.name}</h2><p>{pattern.description}</p></div>
          <div className="pattern-index__meta"><small>Built from</small><strong>{pattern.components.join(", ")}</strong><ArrowRight aria-hidden="true" /></div>
        </a>)}
      </div>
      <footer className="system-footer"><span>Teum</span><span>4 patterns</span></footer>
    </div>
  );
}

function SystemSignature() {
  return (
    <section className="system-signature" aria-labelledby="system-signature-title">
      <div><span>Behavior signature</span><h2 id="system-signature-title">Identity without an accent color</h2></div>
      <dl>
        <div><dt>01</dt><dd><strong>Stable geometry</strong><span>State changes preserve the control and surrounding layout.</span></dd></div>
        <div><dt>02</dt><dd><strong>Shared origin</strong><span>Overlays and detail views reveal where they came from.</span></dd></div>
        <div><dt>03</dt><dd><strong>Reversible completion</strong><span>Consequential actions expose a clear path back.</span></dd></div>
      </dl>
    </section>
  );
}

function PatternPlayground({ pattern }: { pattern: (typeof patterns)[number] }) {
  const [session, setSession] = useState(0);
  const replay = () => {
    toast.dismiss();
    setSession((value) => value + 1);
  };
  return (
    <section className="pattern-playground" aria-label={`${pattern.name} playground`}>
      <header>
        <div><span>Playground</span><strong>{pattern.intent}</strong></div>
        <button type="button" onClick={replay}><ArrowCounterClockwise aria-hidden="true" />Replay</button>
      </header>
      <div className="pattern-playground__body">
        <ol>{patternSteps[pattern.id].map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
        <div className="pattern-playground__stage"><div key={`${pattern.id}-${session}`}><PrimaryPreviewFor id={pattern.componentId} /></div></div>
      </div>
      <footer><span>Stable geometry</span><span>Shared origin</span><span>Reversible completion</span></footer>
    </section>
  );
}

function PatternDetail({ pattern }: { pattern: (typeof patterns)[number] }) {
  return (
    <div className="system-detail__content system-pattern-detail system-reference-page">
      <section className="system-overview">
        <h1>{pattern.name}</h1>
        <p>{pattern.description}</p>
      </section>

      <section className="system-section-heading" id="pattern-live"><div><h2>{pattern.outcome}</h2></div></section>
      <PatternPlayground pattern={pattern} />

      <section className="pattern-guidance" id="pattern-guidance" aria-label={`${pattern.name} guidance`}>
        <article><span>Use when</span><p>{pattern.useWhen}</p></article>
        <article><span>Avoid when</span><p>{pattern.avoidWhen}</p></article>
      </section>

      <div id="pattern-contract"><ContractPanel contract={pattern.contract} /></div>

      <section className="pattern-built-from" id="pattern-built-from">
        <div><span>Built from</span><h2>Components stay visible behind the behavior</h2></div>
        <div>{pattern.components.map((component) => <span key={component}>{component}</span>)}</div>
      </section>
      <footer className="system-footer"><span>Teum</span><span>Interaction pattern</span></footer>
    </div>
  );
}

export function DocumentationApp({ view, onSelect, onHome, theme, onThemeChange }: {
  view: string;
  onSelect: (id: ViewId) => void;
  onHome: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  const normalizedView: ViewId = isPublicDocId(view)
    || view === "foundations"
    || view === "patterns"
    || foundationItems.some((item) => `foundation-${item.id}` === view)
    || patterns.some((pattern) => pattern.id === view)
    || components.some((component) => component.id === view)
    ? view as ViewId
    : "installation";

  return (
    <TooltipProvider>
      <UndoStackProvider>
        <ConsolidatedDesignSystemMode view={normalizedView} onSelect={onSelect} onHome={onHome} theme={theme} onThemeChange={onThemeChange} />
        <Toaster />
      </UndoStackProvider>
    </TooltipProvider>
  );
}
