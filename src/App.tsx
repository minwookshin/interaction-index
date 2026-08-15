import {
  Archive,
  ArrowsDownUp,
  ArrowCounterClockwise,
  ArrowRight,
  Bell,
  CaretDown,
  Check,
  Command,
  Copy,
  Diamond,
  DotsThree,
  Gear,
  LinkSimple,
  List,
  MagnifyingGlass,
  Moon,
  Monitor,
  Package,
  Star,
  Plus,
  Rows,
  ShieldCheck,
  DeviceMobile,
  Sun,
  TerminalWindow,
  Trash,
  X,
} from "@phosphor-icons/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  Checkbox,
  Combobox,
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
  IconButton,
  InlineEdit,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
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
import type { BehaviorContract } from "./lib/behavior-contract";
import { componentGuidance, type ComponentGuidance } from "./component-guidance";
import { copyText } from "./lib/copy-text";
import { componentCode } from "./documentation/component-code";
import { componentApi } from "./documentation/component-api";
import { FoundationDetail, FoundationOverview, foundationItems, type FoundationId } from "./documentation/foundations";
import { LiveSpecimen } from "./documentation/live-specimen";
import { ComponentStatePreview, getStateFlags } from "./documentation/state-preview";
import { PublicDocPage, publicDocItems, publicDocOutlines, type PublicDocId, type PublicDocGroup } from "./documentation/public-docs";

const components = [
  { id: "button", name: "Button", group: "Controls", description: "Compact actions with stable loading geometry and explicit hierarchy." },
  { id: "icon-button", name: "Icon Button", group: "Controls", description: "Square actions that require an accessible name and contextual tooltip." },
  { id: "text-field", name: "Text Field", group: "Controls", description: "Dense text entry with labels, descriptions, validation, and adornments." },
  { id: "textarea", name: "Textarea", group: "Controls", description: "Long-form input with persistent guidance, validation, and count feedback." },
  { id: "checkbox", name: "Checkbox", group: "Controls", description: "Binary or mixed selection with a generous invisible hit target." },
  { id: "radio-group", name: "Radio Group", group: "Controls", description: "A labelled, keyboard-navigable choice between mutually exclusive options." },
  { id: "switch", name: "Switch", group: "Controls", description: "Immediate settings with clear on, off, focus, and disabled states." },
  { id: "select", name: "Select", group: "Controls", description: "Compact selection from a short predefined list with native-feeling typeahead." },
  { id: "context-switcher", name: "Context Switcher", group: "Controls", description: "Rich single selection with icon, supporting context, and quiet layered elevation." },
  { id: "combobox", name: "Combobox", group: "Controls", description: "Filter and select from a larger predefined collection without free-form ambiguity." },
  { id: "search-input", name: "Search Input", group: "Controls", description: "Free-form query input with clear, loading, and keyboard-shortcut affordances." },
  { id: "number-field", name: "Number Field", group: "Controls", description: "Locale-aware numeric entry with keyboard stepping, bounds, and stable controls." },
  { id: "segmented-control", name: "Segmented Control", group: "Controls", description: "Compact single selection between peer views or presentation modes." },
  { id: "tooltip", name: "Tooltip", group: "Overlays", description: "A concise label or shortcut hint for otherwise ambiguous controls." },
  { id: "popover", name: "Popover", group: "Overlays", description: "A lightweight, non-modal surface anchored to its trigger." },
  { id: "menu", name: "Menu", group: "Overlays", description: "A keyboard-navigable set of contextual actions and toggles." },
  { id: "dialog", name: "Dialog", group: "Overlays", description: "A focused modal task with trapped focus, explicit completion, and reversible dismissal." },
  { id: "alert-dialog", name: "Alert Dialog", group: "Overlays", description: "A blocking consequential decision that requires an explicit user response." },
  { id: "tabs", name: "Tabs", group: "Navigation", description: "A dense view switcher with automatic keyboard navigation." },
  { id: "breadcrumbs", name: "Breadcrumbs", group: "Navigation", description: "Compact location context with semantic current-page and collapsed-depth handling." },
  { id: "pagination", name: "Pagination", group: "Navigation", description: "Bounded page navigation for data sets where stable positions matter." },
  { id: "collapsible", name: "Collapsible", group: "Disclosure", description: "Progressively reveals supporting content without changing destinations." },
  { id: "toast", name: "Toast", group: "Feedback", description: "Brief confirmation that stays secondary to the current task." },
  { id: "progress", name: "Progress", group: "Feedback", description: "Determinate or indeterminate task completion with a screen-reader status contract." },
  { id: "spinner", name: "Spinner", group: "Feedback", description: "Compact ongoing-work feedback for controls and tightly bounded surfaces." },
  { id: "skeleton", name: "Skeleton", group: "Feedback", description: "Layout-preserving placeholder geometry for content that is expected imminently." },
  { id: "alert", name: "Alert", group: "Feedback", description: "Persistent inline feedback with an optional action and deliberate announcement policy." },
  { id: "empty-state", name: "Empty State", group: "Feedback", description: "Explains an empty collection and offers the smallest useful next step." },
  { id: "badge", name: "Badge", group: "Data display", description: "Compact metadata, category, status, and removable-filter labeling." },
  { id: "avatar", name: "Avatar", group: "Data display", description: "Person or entity identity with deterministic fallback, size, status, and grouping." },
  { id: "table", name: "Table", group: "Data display", description: "Semantic tabular structure composed into product-specific sorting, filtering, and selection." },
  { id: "inline-edit", name: "Inline Edit", group: "Interaction", description: "Edit in place while preserving line geometry and focus origin.", contract: inlineEditContract },
  { id: "action-list", name: "Action List", group: "Interaction", description: "A filterable, keyboard-first action surface for dense workflows.", contract: actionListContract },
  { id: "shared-detail", name: "Shared Detail", group: "Interaction", description: "Move from a list object to its detail without losing identity.", contract: sharedDetailContract },
  { id: "undo-stack", name: "Undo Stack", group: "Interaction", description: "Make consequential actions recoverable through a real LIFO history.", contract: undoStackContract },
] as const;

type ComponentId = (typeof components)[number]["id"];

const patterns = [
  {
    id: "edit-in-place",
    name: "Edit in place",
    intent: "Change without leaving",
    componentId: "inline-edit",
    description: "Change a small value without leaving its surrounding context.",
    useWhen: "The value is short, the change is reversible, and preserving row or page context matters.",
    avoidWhen: "The task needs several fields, complex validation, or a dedicated review step.",
    outcome: "Edit, save, cancel, and focus restoration happen without shifting the surrounding layout.",
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
    outcome: "Pointer and keyboard navigation share one active state from query to execution.",
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
    outcome: "Selection, detail, dismissal, and focus return read as one continuous spatial transition.",
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
    outcome: "Each mutation enters a real LIFO history with explicit feedback and deterministic recovery.",
    components: ["Undo Stack", "Toast", "Button"],
    contract: undoStackContract,
  },
] as const;

type PatternId = (typeof patterns)[number]["id"];
type FoundationRoute = `foundation-${FoundationId}`;
type ViewId = ComponentId | PatternId | FoundationRoute | PublicDocId | "foundations" | "patterns" | "product";
type Theme = "light" | "dark";

type NavSectionId = "getting-started" | "foundations" | "components" | "patterns" | "quality" | "project";

const publicDocGroups: readonly { id: NavSectionId; label: PublicDocGroup }[] = [
  { id: "getting-started", label: "Getting started" },
  { id: "quality", label: "Quality" },
  { id: "project", label: "Project" },
];

function isPublicDocId(value: string): value is PublicDocId {
  return publicDocItems.some((item) => item.id === value);
}

const currentCompatibility = [
  { label: "React", value: packageManifest.dependencies.react.replace(/^[^\d]*/, "") },
  { label: "TypeScript", value: packageManifest.devDependencies.typescript.replace(/^[^\d]*/, "") },
  { label: "Base UI", value: packageManifest.dependencies["@base-ui/react"].replace(/^[^\d]*/, "") },
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
      <div className="component-guidance__heading">
        <div><span>{mode === "usage" ? "Product guidance" : "Interaction coverage"}</span><h2 id={titleId}>{mode === "usage" ? "Use it with intent" : "Accessible in every state"}</h2></div>
        <p>{mode === "usage" ? "Keep the decision rule close to the component without crowding its live preview." : "Review keyboard input, supported states, and the quality bar as one focused checklist."}</p>
      </div>
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
          <div className="guidance-section__label"><span>Keyboard</span><small>Input contract</small></div>
          <ul>{guidance.keyboard.map((item) => <li key={item}><span className="guidance-marker"><Diamond aria-hidden="true" /></span><span>{item}</span></li>)}</ul>
        </div>
        <div className="guidance-section">
          <div className="guidance-section__label"><span>Quality bar</span><small>Review checklist</small></div>
          <ul>{guidance.quality.map((item) => <li key={item}><span className="guidance-marker"><Diamond aria-hidden="true" /></span><span>{item}</span></li>)}</ul>
        </div>
      </div>
      </>}
    </section>
  );
}

function ComponentApiPanel({ id }: { id: ComponentId }) {
  const rows = componentApi[id];
  const component = components.find((item) => item.id === id)!;
  const guidance = componentGuidance[id];
  const importName = component.name.replaceAll(" ", "");
  return (
    <section className="component-api" id="system-api" aria-labelledby="component-api-title">
      <div className="component-guidance__heading">
        <div><span>Reference</span><h2 id="component-api-title">Props and defaults</h2></div>
        <p>The public surface stays small, composable, and aligned with the live examples.</p>
      </div>
      <div className="component-api__facts" aria-label={`${component.name} reference summary`}>
        <article><span>Import</span><code>{importName}</code></article>
        <article><span>Package</span><code>@index/ui</code></article>
        <article><span>Primitive</span><strong>{guidance.source}</strong></article>
        <article><span>Coverage</span><strong>{guidance.states.length} states</strong></article>
      </div>
      <div className="component-api__table-wrap">
      <table aria-label={`${component.name} API`}>
        <thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Purpose</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.name}><th scope="row"><code>{row.name}</code>{row.required && <span>Required</span>}</th><td><code>{row.type}</code></td><td><code>{row.defaultValue === "—" ? "None" : row.defaultValue}</code></td><td>{row.description}</td></tr>)}</tbody>
      </table>
      </div>
      <div className="component-support" aria-label={`${component.name} compatibility and confidence`}>
        <div className="component-support__heading">
          <div><span>Compatibility</span><h3>Current workspace contract</h3></div>
          <p>Public preview. APIs may change before a stable release, so compatibility claims stay pinned to the versions tested here.</p>
        </div>
        <dl className="component-support__versions">{currentCompatibility.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
        <div className="component-support__confidence">
          <div><span>Keyboard contract</span><ul>{guidance.keyboard.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div>
          <div><span>Verification</span><ul><li><Check aria-hidden="true" />Every documented state renders in automated coverage</li><li><Check aria-hidden="true" />Light, dark, focus, and reduced-motion rules are reviewable</li><li><Check aria-hidden="true" />Manual assistive-technology QA remains a release gate</li></ul></div>
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

function TextFieldDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Project settings form">
        <div className="field-demo-grid">
          <TextField label="Project name" defaultValue="Interaction Index" description="Shown to everyone in the workspace." />
          <TextField label="Search" placeholder="Search components…" leading={<MagnifyingGlass />} trailing={<kbd>⌘K</kbd>} />
          <TextField label="Identifier" defaultValue="INT-" error="Use a unique identifier." />
          <TextField label="Read only" value="Linear light" readOnly />
          <TextField label="Workspace key" value="INT" description="Managed by your organization." disabled />
        </div>
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
              <MenuItem className="ix-menu__item--danger"><Trash />Delete</MenuItem>
            </MenuContent>
          </Menu>
        </div>
      </Specimen>
      <ApiStrip values={["Arrow keys", "Home / End", "Enter / Space", "typeahead", "checkbox item", "Escape"]} />
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
              <div className="dialog-form"><TextField label="Display name" defaultValue="Draft primitive" /><Select label="Maturity" defaultValue="alpha" options={[{ label: "Alpha", value: "alpha" }, { label: "Beta", value: "beta" }, { label: "Stable", value: "stable" }]} /><TextField label="Summary" defaultValue="A compact authored interaction." /></div>
              <DialogFooter><DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose><DialogClose render={<Button variant="primary" />}>Save changes</DialogClose></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Specimen>
      <ApiStrip values={["focus trap", "Escape · close", "backdrop · close", "focus return", "label + description"]} />
    </>
  );
}

function TabsDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Issue detail views">
        <Tabs defaultValue="preview">
          <TabsList><TabsTrigger value="preview">Overview</TabsTrigger><TabsTrigger value="states">Activity</TabsTrigger><TabsTrigger value="contract">Relations</TabsTrigger><TabsTrigger value="archive" disabled>Archive</TabsTrigger></TabsList>
          <TabsContent value="preview"><div className="tab-card"><strong>Live component</strong><p>Inspect the component at product density.</p></div></TabsContent>
          <TabsContent value="states"><div className="tab-card"><strong>State coverage</strong><p>Default, hover, active, focus, disabled, and loading.</p></div></TabsContent>
          <TabsContent value="contract"><div className="tab-card"><strong>Behavior contract</strong><p>Origin, continuity, interruption, keyboard, and reduced motion.</p></div></TabsContent>
        </Tabs>
      </Specimen>
      <ApiStrip values={["Arrow Left / Right", "Home / End", "automatic activation", "aria-controls"]} />
    </>
  );
}

function ToastDemo() {
  return (
    <>
      <Specimen label="Product recipe" note="Mutation feedback">
        <div className="demo-row">
          <Button variant="secondary" onClick={() => toast("Component duplicated", { description: "Button / Draft was added to the index." })}>Confirm action</Button>
          <Button variant="secondary" onClick={() => toast("Component archived", { action: { label: "Undo", onClick: () => toast("Component restored") } })}>Show undo</Button>
          <Button variant="secondary" onClick={() => toast.error("Couldn’t publish", { description: "Check the registry configuration and try again." })}>Show error</Button>
        </div>
      </Specimen>
      <ApiStrip values={["polite live region", "close", "action", "4s default", "bottom-right"]} />
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
        <Alert title="Import complete">35 components were added to the local registry.</Alert>
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
    <Specimen label="Product recipe" note="Explicit response for a consequential action">
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
      <div className="field-demo-grid">
        <NumberField label="Cycle capacity" description="Issues available to this cycle." defaultValue={24} min={1} max={99} />
        <NumberField label="Estimate" defaultValue={3} min={0} max={100} suffix="pts" />
        <NumberField label="Failed value" defaultValue={120} min={0} max={100} error="Use a value from 0 to 100." />
        <NumberField label="Locked budget" value={80} suffix="%" readOnly />
      </div>
    </Specimen>
    <ApiStrip values={["Arrow Up / Down", "increment", "decrement", "min", "max", "step", "locale", "format", "readOnly", "disabled"]} />
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
        <Collapsible className="ix-collapsible" defaultOpen><CollapsibleTrigger>Advanced filter rules</CollapsibleTrigger><CollapsibleContent>Matches components whose state contract includes focus restoration, keyboard dismissal, and a reduced-motion fallback.</CollapsibleContent></Collapsible>
        <Collapsible className="ix-collapsible"><CollapsibleTrigger>Compatibility details</CollapsibleTrigger><CollapsibleContent>Tested with React {currentCompatibility[0].value}, TypeScript {currentCompatibility[1].value}, and Base UI {currentCompatibility[2].value}.</CollapsibleContent></Collapsible>
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
      <TableHeader><TableRow><TableHead className="data-table-recipe__select"><Checkbox aria-label="Select every visible issue" checked={allSelected} indeterminate={!allSelected && visibleRows.some((row) => selected.includes(row.id))} onCheckedChange={(checked) => toggleAll(Boolean(checked))} /></TableHead><TableHead aria-sort={ascending ? "ascending" : "descending"}><button className="ix-table-sort" type="button" aria-label={`Sort issues ${ascending ? "descending" : "ascending"}`} onClick={() => setAscending((value) => !value)}>Issue <ArrowsDownUp /></button></TableHead><TableHead>Status</TableHead><TableHead>Owner</TableHead><TableHead>Updated</TableHead></TableRow></TableHeader>
      <TableBody>{visibleRows.map((row) => <TableRow key={row.id} data-selected={selected.includes(row.id) || undefined}><TableCell className="data-table-recipe__select"><Checkbox aria-label={`Select ${row.name}`} checked={selected.includes(row.id)} onCheckedChange={(checked) => toggleRow(row.id, Boolean(checked))} /></TableCell><TableCell><span className="data-table-recipe__identity"><strong>{row.name}</strong><small>{row.id}</small></span></TableCell><TableCell><Badge variant={row.status === "In review" ? "strong" : "outline"}>{row.status}</Badge></TableCell><TableCell>{row.owner}</TableCell><TableCell>{row.updated}</TableCell></TableRow>)}</TableBody>
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

function InlineEditDemo({ includeContract = true }: { includeContract?: boolean } = {}) {
  const [title, setTitle] = useState("Interaction Index");
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
    button: <ButtonDemo />, "icon-button": <IconButtonDemo />, "text-field": <TextFieldDemo />, textarea: <TextareaDemo />, checkbox: <CheckboxDemo />, "radio-group": <RadioGroupDemo />, switch: <SwitchDemo />, select: <SelectDemo />, "context-switcher": <ContextSwitcherDemo />, combobox: <ComboboxDemo />, "search-input": <SearchInputDemo />, "number-field": <NumberFieldDemo />, "segmented-control": <SegmentedControlDemo />,
    tooltip: <TooltipDemo />, popover: <PopoverDemo />, menu: <MenuDemo />, dialog: <DialogDemo />, "alert-dialog": <AlertDialogDemo />, tabs: <TabsDemo />, toast: <ToastDemo />,
    breadcrumbs: <BreadcrumbsDemo />, pagination: <PaginationDemo />, collapsible: <CollapsibleDemo />, progress: <ProgressDemo />, spinner: <SpinnerDemo />, skeleton: <SkeletonDemo />, alert: <AlertDemo />, "empty-state": <EmptyStateDemo />, badge: <BadgeDemo />, avatar: <AvatarDemo />, table: <TableDemo />,
    "inline-edit": <InlineEditDemo includeContract={includeContract} />, "action-list": <ActionListDemo includeContract={includeContract} />, "shared-detail": <SharedDetailDemo includeContract={includeContract} />, "undo-stack": <UndoStackDemo includeContract={includeContract} />,
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
  "alert-dialog",
  "alert",
  "empty-state",
  "table",
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
        <p>Make pointer and keyboard focus feel intentional across component previews.</p>
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
        <TextField label="Project name" defaultValue="Interaction Index" description="Visible to everyone in the workspace." />
      </div>
    </section>
  );
}

function MenuProductContext() {
  return (
    <section className="product-context product-context--toolbar" aria-label="Issue toolbar menu example">
      <div className="product-context__identity">
        <span className="product-context__icon"><Rows aria-hidden="true" /></span>
        <div><strong>Motion contract</strong><span>INT-184 · In review</span></div>
      </div>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" size="small" trailingIcon={<CaretDown />}>Actions</Button>} />
        <MenuContent>
          <MenuLabel>Issue</MenuLabel>
          <MenuItem><Copy />Duplicate <kbd>⌘D</kbd></MenuItem>
          <MenuItem><Archive />Archive</MenuItem>
          <MenuSeparator />
          <MenuItem className="ix-menu__item--danger"><Trash />Delete</MenuItem>
        </MenuContent>
      </Menu>
    </section>
  );
}

function DialogProductContext() {
  return (
    <section className="product-context product-context--toolbar" aria-label="Component metadata example">
      <div className="product-context__identity">
        <span className="product-context__icon"><Package aria-hidden="true" /></span>
        <div><strong>Draft primitive</strong><span>Local component · Not published</span></div>
      </div>
      <Dialog>
        <DialogTrigger render={<Button variant="secondary" size="small">Edit details</Button>} />
        <DialogContent>
          <DialogHeader><DialogTitle>Edit component metadata</DialogTitle><DialogDescription>Update the public name and summary without leaving the current catalog position.</DialogDescription></DialogHeader>
          <div className="dialog-form"><TextField label="Display name" defaultValue="Draft primitive" /><Select label="Maturity" defaultValue="alpha" options={[{ label: "Alpha", value: "alpha" }, { label: "Beta", value: "beta" }, { label: "Stable", value: "stable" }]} /><TextField label="Summary" defaultValue="A compact authored interaction." /></div>
          <DialogFooter><DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose><DialogClose render={<Button variant="primary" />}>Save changes</DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function PrimaryPreviewFor({ id }: { id: ComponentId }) {
  if (id === "button") return <ButtonProductContext />;
  if (id === "icon-button") return <IconButton variant="secondary" aria-label="Create item" tooltip="Create item"><Plus /></IconButton>;
  if (id === "text-field") return <TextFieldProductContext />;
  if (id === "textarea") return <div className="primary-field-preview"><Textarea label="Description" defaultValue="Document the interaction contract." description="Markdown is supported." /></div>;
  if (id === "checkbox") return <Checkbox label="Include interaction notes" description="Adds behavior contracts to the export." defaultChecked />;
  if (id === "radio-group") return <RadioGroup label="Send updates" defaultValue="daily" options={[{ value: "instant", label: "Immediately" }, { value: "daily", label: "Daily digest" }, { value: "off", label: "Never" }]} />;
  if (id === "switch") return <div className="primary-setting-preview"><Switch label="Interaction previews" description="Play component motion in specimen canvases." defaultChecked /></div>;
  if (id === "select") return <div className="primary-field-preview"><Select label="Priority" options={priorityOptions} defaultValue="medium" /></div>;
  if (id === "context-switcher") return <ContextSwitcher aria-label="Preview platform" options={contextSwitcherOptions} defaultValue="web" />;
  if (id === "combobox") return <div className="primary-field-preview"><Combobox label="Assignee" options={peopleOptions} defaultValue={peopleOptions[1]} /></div>;
  if (id === "search-input") return <SearchInput placeholder="Search components…" shortcut="⌘K" />;
  if (id === "number-field") return <div className="primary-field-preview"><NumberField label="Cycle capacity" defaultValue={24} min={1} max={99} /></div>;
  if (id === "segmented-control") return <SegmentedControl label="Issue view" defaultValue="list" options={[{ value: "list", label: "List" }, { value: "board", label: "Board" }, { value: "timeline", label: "Timeline" }]} />;
  if (id === "tooltip") return <Tooltip><TooltipTrigger render={<Button variant="secondary">Favorite</Button>} /><TooltipContent>Add to favorites <kbd>F</kbd></TooltipContent></Tooltip>;
  if (id === "popover") return <Popover><PopoverTrigger render={<Button variant="secondary" trailingIcon={<CaretDown />}>View options</Button>} /><PopoverContent><div className="popover-copy"><PopoverTitle>View options</PopoverTitle><PopoverDescription>Choose which metadata is visible.</PopoverDescription></div><div className="primary-popover-row"><Switch label="Show contracts" defaultChecked /></div></PopoverContent></Popover>;
  if (id === "menu") return <MenuProductContext />;
  if (id === "dialog") return <DialogProductContext />;
  if (id === "alert-dialog") return <AlertDialog><AlertDialogTrigger render={<Button variant="secondary" />}>Discard draft</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Discard this component draft?</AlertDialogTitle><AlertDialogDescription>The draft and its unpublished interaction notes will be permanently removed.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogClose render={<Button variant="ghost" />}>Keep draft</AlertDialogClose><AlertDialogClose render={<Button variant="primary" />}>Discard draft</AlertDialogClose></AlertDialogFooter></AlertDialogContent></AlertDialog>;
  if (id === "tabs") return <Tabs defaultValue="overview"><TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger><TabsTrigger value="relations">Relations</TabsTrigger></TabsList><TabsContent value="overview"><div className="tab-card"><strong>Live component</strong><p>Inspect the component at product density.</p></div></TabsContent><TabsContent value="activity"><div className="tab-card">Recent activity</div></TabsContent><TabsContent value="relations"><div className="tab-card">Related work</div></TabsContent></Tabs>;
  if (id === "breadcrumbs") return <Breadcrumbs label="Component preview breadcrumb" items={[{ label: "Workspace", href: "#" }, { label: "Projects", href: "#" }, { label: "UI Refresh" }]} />;
  if (id === "pagination") return <PrimaryPagination />;
  if (id === "collapsible") return <Collapsible className="ix-collapsible"><CollapsibleTrigger>Advanced filter rules</CollapsibleTrigger><CollapsibleContent>Match state contracts that restore focus and define reduced motion.</CollapsibleContent></Collapsible>;
  if (id === "toast") return <Button variant="primary" onClick={() => toast.success("Component saved", { description: "Button is ready for review." })}>Show toast</Button>;
  if (id === "progress") return <Progress label="Exporting data" value={68} />;
  if (id === "spinner") return <div className="demo-row demo-row--centered"><Spinner label="Loading content" /><span>Loading content</span></div>;
  if (id === "skeleton") return <div className="skeleton-recipe"><Skeleton radius="round" width={32} height={32} /><SkeletonText lines={3} /></div>;
  if (id === "alert") return <Alert title="Import complete">35 components were added to the local registry.</Alert>;
  if (id === "empty-state") return <EmptyState title="No matching components" description="Clear the active filters or add a component from the registry." primaryAction={<Button size="small" variant="primary">Add component</Button>} />;
  if (id === "badge") return <div className="demo-row demo-row--centered"><Badge>Draft</Badge><Badge variant="strong">In review</Badge><Badge variant="outline">Design</Badge></div>;
  if (id === "avatar") return <AvatarGroup aria-label="Project members"><Avatar fallback="AS" /><Avatar fallback="MP" status="online" /><Avatar fallback="NW" /></AvatarGroup>;
  if (id === "table") return <DataTableRecipe compact />;
  if (id === "inline-edit") return <PrimaryInlineEdit />;
  if (id === "action-list") return <PrimaryActionList />;
  if (id === "shared-detail") return <div className="primary-shared-detail"><SharedDetail items={sharedItems} defaultSelectedId="motion" focusOnOpen={false} regionLabel="Shared Detail product context" /></div>;
  return <UndoStackProvider><PrimaryUndo /></UndoStackProvider>;
}

function PrimaryPagination() {
  const [page, setPage] = useState(3);
  return <Pagination label="Component preview pagination" page={page} totalPages={12} onPageChange={setPage} />;
}

function PrimaryInlineEdit() {
  const [value, setValue] = useState("Interaction Index");
  return <div className="primary-inline-edit"><span>Project title</span><InlineEdit value={value} onSave={setValue} /></div>;
}

function PrimaryActionList() {
  const items = useMemo(() => [
    { id: "create", label: "Create component", description: "Start with the system defaults", icon: <Plus />, shortcut: "C" },
    { id: "duplicate", label: "Duplicate current", description: "Copy states and behavior contract", icon: <Copy />, shortcut: "⌘D" },
    { id: "archive", label: "Archive component", description: "Move it out of the active index", icon: <Archive />, shortcut: "E" },
  ], []);
  return <div className="primary-action-list"><ActionList items={items} onAction={(item) => toast(`${item.label} selected`)} /></div>;
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
      {mode === "state" && <label className="live-specimen__state-picker"><span className="ix-sr-only">Preview state</span><select aria-label="Preview state" value={stateIndex} onChange={(event) => setStateIndex(Number(event.target.value))}>{states.map((state, index) => <option value={index} key={state}>{state}</option>)}</select><CaretDown aria-hidden="true" /></label>}
    </div>
  );
  const stateSlug = selectedState.toLocaleLowerCase().replaceAll(" ", "-");
  return (
    <LiveSpecimen id={id} code={componentCode[id]} controls={controls} specimen={specimen} note={mode === "product" ? "Interactive · keyboard ready" : `${selectedState} · locked inspection`} onReset={reset}>
      {mode === "product" ? <div key={`${id}-product-${resetKey}`} className="primary-preview"><PrimaryPreviewFor id={id} /></div> : <article key={`${id}-${stateSlug}-${resetKey}`} className="state-tile state-tile--live" data-state={stateSlug} data-state-flags={getStateFlags(selectedState)} aria-label={`${selectedState} state preview`}><div className="state-tile__preview" inert><StatePreview id={id} state={selectedState} index={stateIndex} /></div></article>}
    </LiveSpecimen>
  );
}

function StatePreview({ id, state, index }: { id: ComponentId; state: string; index: number }) {
  return <ComponentStatePreview id={id} state={state} index={index} />;
}

const stateGroupOrder = [
  "Rest and content",
  "Pointer feedback",
  "Keyboard and focus",
  "Lifecycle and async",
  "Validation and recovery",
] as const;

type StateGroup = (typeof stateGroupOrder)[number];

function getStateGroup(state: string): StateGroup {
  const value = state.toLocaleLowerCase();
  if (["error", "invalid", "required", "validation", "restored", "expired", "undoing"].some((token) => value.includes(token))) return "Validation and recovery";
  if (["focus", "keyboard", "typeahead", "escape", "arrow"].some((token) => value.includes(token))) return "Keyboard and focus";
  if (["hover", "pressed", "pointer", "highlighted"].some((token) => value.includes(token))) return "Pointer feedback";
  if (["loading", "saving", "submitting", "confirming", "disabled", "open", "closed", "entering", "exiting", "opening", "closing", "detail", "retargeting", "queued"].some((token) => value.includes(token))) return "Lifecycle and async";
  return "Rest and content";
}

function ComponentStateCoverage({ id, states }: { id: ComponentId; states: readonly string[] }) {
  const groups = stateGroupOrder.map((label) => ({ label, states: states.filter((state) => getStateGroup(state) === label) })).filter((group) => group.states.length > 0);
  return (
    <section className="component-state-coverage" id="system-states" aria-labelledby="state-coverage-title">
      <div className="component-state-coverage__header"><div><span>State contract</span><h2 id="state-coverage-title">Inspect states without changing them</h2></div><p>Visual proofs stay locked and truthful. Use the interactive Product preview above for pointer and keyboard testing.</p></div>
      <div className="state-contract-groups">
        {groups.map((group) => <section className="state-contract-group" aria-labelledby={`${id}-${group.label.toLocaleLowerCase().replaceAll(" ", "-")}`} key={group.label}>
          <header><h3 id={`${id}-${group.label.toLocaleLowerCase().replaceAll(" ", "-")}`}>{group.label}</h3></header>
          <div className="state-gallery">
            {group.states.map((state) => {
              const index = states.indexOf(state);
              return <article className="state-tile" data-state={state.toLocaleLowerCase().replaceAll(" ", "-")} data-state-flags={getStateFlags(state)} key={`${id}-${state}`}><span>{state}</span><div className="state-tile__preview" inert><StatePreview id={id} state={state} index={index} /></div></article>;
            })}
          </div>
        </section>)}
      </div>
    </section>
  );
}

function NavigationSection({ label, count, expanded, active, onToggle, children }: { label: string; count?: number; expanded: boolean; active?: boolean; onToggle: () => void; children: ReactNode }) {
  return <section className="system-nav-group" data-expanded={expanded || undefined} data-active={active || undefined}>
    <button type="button" className="system-nav-group__trigger" aria-expanded={expanded} onClick={onToggle}><CaretDown aria-hidden="true" /><span>{label}</span>{typeof count === "number" && <small>{count}</small>}</button>
    <div className="system-nav-group__content" hidden={!expanded}>{children}</div>
  </section>;
}

function PageOutline({ view, onNavigate, onCopy }: { view: ViewId; onNavigate: (id: ViewId) => void; onCopy: () => void }) {
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
      const nearBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= 3;
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
    lockedOutlineId.current = null;
    setActiveOutlineId(sectionIds[0] ?? "system-overview");
    update();
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
    };
  }, [itemKey, view]);

  const scrollTo = (id: string) => {
    lockedOutlineId.current = id;
    setActiveOutlineId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeOutlineId));
  return <aside className="system-outline system-outline--public" aria-label="Page outline"><div className="system-outline__section"><div className="system-outline__eyebrow"><span>On this page</span><small aria-live="polite">{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</small></div>{items.map((item) => <button type="button" key={item.id} data-active={item.id === activeOutlineId || undefined} aria-current={item.id === activeOutlineId ? "location" : undefined} onClick={() => scrollTo(item.id)}>{item.label}</button>)}</div><div className="system-outline__section system-outline__actions"><button type="button" onClick={onCopy}><Copy aria-hidden="true" />Copy page link</button>{view !== "licensing" && <button type="button" onClick={() => onNavigate("licensing")}><ShieldCheck aria-hidden="true" />MIT license</button>}</div></aside>;
}

function ConsolidatedDesignSystemMode({ view, onSelect, theme, onThemeChange }: { view: ViewId; onSelect: (id: ViewId) => void; theme: Theme; onThemeChange: (theme: Theme) => void }) {
  const publicDoc = isPublicDocId(view) ? publicDocItems.find((item) => item.id === view)! : undefined;
  const foundationId = view.startsWith("foundation-") ? view.replace("foundation-", "") as FoundationId : undefined;
  const foundations = view === "foundations" || Boolean(foundationId);
  const activePattern = patterns.find((pattern) => pattern.id === view);
  const patternsMode = view === "patterns" || Boolean(activePattern);
  const componentsMode = !publicDoc && !foundations && !patternsMode;
  const activeId: ComponentId = components.some((component) => component.id === view) ? view as ComponentId : "button";
  const [filter, setFilter] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const activeSection: NavSectionId = publicDoc ? publicDoc.group === "Getting started" ? "getting-started" : publicDoc.group === "Quality" ? "quality" : "project" : foundations ? "foundations" : patternsMode ? "patterns" : "components";
  const [expandedSections, setExpandedSections] = useState<Record<NavSectionId, boolean>>({ "getting-started": false, foundations: false, components: false, patterns: false, quality: false, project: false });
  const activeComponent = components.find((item) => item.id === activeId)!;
  const guidance = componentGuidance[activeId];
  const filtered = components.filter((component) => `${component.name} ${component.group} ${component.description}`.toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase()));
  const filteredPatterns = patterns.filter((pattern) => `${pattern.name} ${pattern.intent} ${pattern.description}`.toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase()));
  const filteredDocs = publicDocItems.filter((doc) => `${doc.label} ${doc.group} ${doc.description}`.toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase()));
  const filteredFoundations = foundationItems.filter((foundation) => `${foundation.label} ${foundation.description}`.toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase()));
  const groups = [...new Set(filtered.map((component) => component.group))];

  const copyViewLink = () => {
    void copyText(window.location.href).then((copied) => copied ? toast("View link copied") : toast.error("Could not copy view link"));
  };

  const openComponent = (id: ComponentId = activeId) => {
    setNavigationOpen(false);
    setExpandedSections({ "getting-started": false, foundations: false, components: true, patterns: false, quality: false, project: false });
    onSelect(id);
  };
  const navigate = (id: ViewId) => {
    setNavigationOpen(false);
    const nextSection: NavSectionId = isPublicDocId(id) ? publicDocItems.find((item) => item.id === id)?.group === "Getting started" ? "getting-started" : publicDocItems.find((item) => item.id === id)?.group === "Quality" ? "quality" : "project" : id === "foundations" || id.startsWith("foundation-") ? "foundations" : id === "patterns" || patterns.some((pattern) => pattern.id === id) ? "patterns" : "components";
    setExpandedSections({ "getting-started": false, foundations: false, components: false, patterns: false, quality: false, project: false, [nextSection]: true });
    onSelect(id);
  };
  const openPattern = (id: PatternId) => navigate(id);
  const openFoundation = (id: FoundationId) => navigate(`foundation-${id}`);
  const toggleSection = (id: NavSectionId) => setExpandedSections((current) => ({ "getting-started": false, foundations: false, components: false, patterns: false, quality: false, project: false, [id]: !current[id] }));
  useEffect(() => {
    setFilter("");
  }, [view]);

  useEffect(() => {
    setExpandedSections({ "getting-started": false, foundations: false, components: false, patterns: false, quality: false, project: false, [activeSection]: true });
  }, [activeSection]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        document.querySelector<HTMLInputElement>(".system-component-search input")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="system-stage system-stage--consolidated">
      <div className="system-window system-window--consolidated">
        <aside className="system-nav system-nav--consolidated" aria-label="Design system navigation" data-open={navigationOpen || undefined}>
          <div className="system-brand"><span className="system-brand__mark"><Command weight="bold" /></span><strong>Index</strong><span className="system-brand__divider">/</span><span>Docs</span><button type="button" className="system-nav__close" aria-label="Close navigation" onClick={() => setNavigationOpen(false)}><X aria-hidden="true" /></button></div>
          <label className="system-component-search system-component-search--global"><MagnifyingGlass aria-hidden="true" /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search docs…" aria-label="Search documentation" /><kbd>⌘K</kbd></label>
          <div className="system-nav__scroll">
            <nav className="system-nav__items" aria-label="System sections">
              {filter ? <div className="system-search-results" role="region" aria-label="Documentation search results">
                <span className="system-nav__label">Search results</span>
                {filteredDocs.length > 0 && <div className="system-component-group"><span>Documentation</span>{filteredDocs.map((doc) => <a href={`#${doc.id}`} key={doc.id} data-selected={doc.id === publicDoc?.id || undefined} onClick={(event) => { event.preventDefault(); navigate(doc.id); }}><strong>{doc.label}</strong></a>)}</div>}
                {filteredFoundations.length > 0 && <div className="system-component-group"><span>Foundations</span>{filteredFoundations.map((foundation) => <a href={`#foundation-${foundation.id}`} key={foundation.id} data-selected={foundation.id === foundationId || undefined} onClick={(event) => { event.preventDefault(); openFoundation(foundation.id); }}><strong>{foundation.label}</strong></a>)}</div>}
                {filtered.length > 0 && groups.map((group) => <div className="system-component-group" key={group}><span>{group}</span>{filtered.filter((component) => component.group === group).map((component) => <a href={`#${component.id}`} key={component.id} data-selected={component.id === activeId && componentsMode || undefined} onClick={(event) => { event.preventDefault(); openComponent(component.id); }}><strong>{component.name}</strong></a>)}</div>)}
                {filteredPatterns.length > 0 && <div className="system-component-group"><span>Patterns</span>{filteredPatterns.map((pattern) => <a href={`#${pattern.id}`} key={pattern.id} data-selected={pattern.id === activePattern?.id || undefined} onClick={(event) => { event.preventDefault(); openPattern(pattern.id); }}><strong>{pattern.name}</strong></a>)}</div>}
                {!filteredDocs.length && !filteredFoundations.length && !filtered.length && !filteredPatterns.length && <div className="system-component-empty">No matching documentation</div>}
              </div> : <>
                <NavigationSection label="Getting started" expanded={expandedSections["getting-started"]} active={activeSection === "getting-started"} onToggle={() => toggleSection("getting-started")}>
                  <div className="system-component-list" role="region" aria-label="Getting started documentation"><div className="system-component-group">{publicDocItems.filter((doc) => doc.group === "Getting started").map((doc) => <a href={`#${doc.id}`} key={doc.id} data-selected={doc.id === publicDoc?.id || undefined} onClick={(event) => { event.preventDefault(); navigate(doc.id); }}><strong>{doc.label}</strong></a>)}</div></div>
                </NavigationSection>

                <NavigationSection label="Foundations" count={foundationItems.length} expanded={expandedSections.foundations} active={activeSection === "foundations"} onToggle={() => toggleSection("foundations")}>
                  <div className="system-component-list" role="region" aria-label="Foundation catalog"><div className="system-component-group"><a href="#foundations" data-selected={view === "foundations" || undefined} onClick={(event) => { event.preventDefault(); navigate("foundations"); }}><strong>Overview</strong></a>{foundationItems.map((foundation) => <a href={`#foundation-${foundation.id}`} key={foundation.id} data-selected={foundation.id === foundationId || undefined} onClick={(event) => { event.preventDefault(); openFoundation(foundation.id); }}><strong>{foundation.label}</strong></a>)}</div></div>
                </NavigationSection>

                <NavigationSection label="Components" count={components.length} expanded={expandedSections.components} active={activeSection === "components"} onToggle={() => toggleSection("components")}>
                  <div className="system-component-list" role="region" aria-label="Component catalog">{[...new Set(components.map((component) => component.group))].map((group) => <div className="system-component-group" key={group}><span>{group}</span>{components.filter((component) => component.group === group).map((component) => {
                    const authored = "contract" in component && component.contract;
                    return <a href={`#${component.id}`} key={component.id} data-selected={component.id === activeId && componentsMode || undefined} onClick={(event) => { event.preventDefault(); openComponent(component.id); }}><strong>{component.name}</strong>{authored && <em>Authored</em>}</a>;
                  })}</div>)}</div>
                </NavigationSection>

                <NavigationSection label="Patterns" count={patterns.length} expanded={expandedSections.patterns} active={activeSection === "patterns"} onToggle={() => toggleSection("patterns")}>
                  <div className="system-component-list" role="region" aria-label="Pattern catalog"><div className="system-component-group"><a href="#patterns" data-selected={view === "patterns" || undefined} onClick={(event) => { event.preventDefault(); navigate("patterns"); }}><strong>Overview</strong></a>{patterns.map((pattern) => <a href={`#${pattern.id}`} key={pattern.id} data-selected={pattern.id === activePattern?.id || undefined} onClick={(event) => { event.preventDefault(); openPattern(pattern.id); }}><strong>{pattern.name}</strong><em>Authored</em></a>)}</div></div>
                </NavigationSection>

                {publicDocGroups.filter((group) => group.id === "quality" || group.id === "project").map((group) => <NavigationSection key={group.id} label={group.label} expanded={expandedSections[group.id]} active={activeSection === group.id} onToggle={() => toggleSection(group.id)}><div className="system-component-list" role="region" aria-label={`${group.label} documentation`}><div className="system-component-group">{publicDocItems.filter((doc) => doc.group === group.label).map((doc) => <a href={`#${doc.id}`} key={doc.id} data-selected={doc.id === publicDoc?.id || undefined} onClick={(event) => { event.preventDefault(); navigate(doc.id); }}><strong>{doc.label}</strong></a>)}</div></div></NavigationSection>)}
              </>}
            </nav>
          </div>
          <div className="system-nav__footer"><span><Package aria-hidden="true" /> @index/ui</span><button type="button" onClick={() => navigate("licensing")}>MIT licensed</button></div>
        </aside>
        {navigationOpen && <button type="button" className="system-nav-scrim" aria-label="Close navigation" onClick={() => setNavigationOpen(false)} />}

        <header className="system-topbar system-topbar--consolidated" aria-label="Workspace actions">
          <div className="system-topbar__location"><button type="button" className="system-nav__open" aria-label="Open navigation" onClick={() => setNavigationOpen(true)}><List aria-hidden="true" /></button><span>{publicDoc?.label ?? (foundations ? foundationId ? foundationItems.find((item) => item.id === foundationId)?.label : "Foundations" : patternsMode ? activePattern?.name ?? "Patterns" : activeComponent.name)}</span></div>
          <div className="system-topbar__actions">
            <button type="button" className="theme-toggle" data-theme={theme} aria-label={"Current theme: " + theme + ". Switch to " + (theme === "light" ? "dark" : "light") + " theme"} onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button>
            <Button variant="ghost" size="small" leadingIcon={<LinkSimple />} aria-label="Copy page link" onClick={copyViewLink}>Copy link</Button>
          </div>
        </header>

        <main className="system-detail system-detail--consolidated">
          <div className="system-detail__scroll">
            {publicDoc ? <PublicDocPage id={publicDoc.id} onNavigate={(id) => navigate(id as ViewId)} /> : foundations ? foundationId ? <FoundationDetail id={foundationId} onBack={() => navigate("foundations")} /> : <FoundationOverview onSelect={onSelect} /> : patternsMode ? activePattern ? <PatternDetail pattern={activePattern} /> : <PatternsOverview onSelect={openPattern} /> : <div className="system-detail__content">
              <section className="system-overview" id="system-overview">
                <h1>{activeComponent.name}</h1>
                <p>{activeComponent.description}</p>
              </section>

              <div className="system-doc-panel system-doc-panel--sequential" id="system-content">
                <section className="system-section-heading" id="system-preview"><div><span>Preview</span><h2>Default composition</h2><p>Shown at the density and context the component needs. Overlays stay closed until their trigger is pressed.</p></div></section>
                <ComponentLiveExample id={activeId} />

                <section className="system-section-heading system-section-heading--variants" id="system-examples"><div><span>Examples</span><h2>Variants and product recipes</h2><p>Real composition, content pressure, size, and operational behavior.</p></div></section>
                <div className="system-specimens"><DemoFor id={activeId} /></div>

                <ComponentStateCoverage id={activeId} states={guidance.states} />

                <ComponentGuidancePanel guidance={guidance} mode="usage" />
                <ComponentGuidancePanel guidance={guidance} mode="accessibility" />
                <ComponentApiPanel id={activeId} />
              </div>
              <footer className="system-footer"><span>Interaction Index</span><span>Inter / 4px base</span></footer>
            </div>}
          </div>
        </main>
        <PageOutline view={view} onNavigate={navigate} onCopy={copyViewLink} />
      </div>
    </div>
  );
}

function PatternsOverview({ onSelect }: { onSelect: (id: PatternId) => void }) {
  return (
    <div className="system-detail__content system-patterns">
      <section className="system-overview">
        <h1>Interaction patterns</h1>
        <p>Reusable product behaviors that connect components, state, motion, and recovery around a recurring user goal.</p>
      </section>

      <SystemSignature />

      <div className="pattern-index" role="region" aria-label="Interaction pattern index">
        {patterns.map((pattern) => <a href={`#${pattern.id}`} key={pattern.id} onClick={(event) => { event.preventDefault(); onSelect(pattern.id); }}>
          <div><span>{pattern.intent}</span><h2>{pattern.name}</h2><p>{pattern.description}</p></div>
          <div className="pattern-index__meta"><small>Built from</small><strong>{pattern.components.join(", ")}</strong><ArrowRight aria-hidden="true" /></div>
        </a>)}
      </div>
      <footer className="system-footer"><span>Interaction Index</span><span>4 authored patterns</span></footer>
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
    <div className="system-detail__content system-pattern-detail">
      <section className="system-overview">
        <h1>{pattern.name}</h1>
        <p>{pattern.description}</p>
      </section>

      <section className="system-section-heading" id="pattern-live"><div><span>Live pattern</span><h2>{pattern.outcome}</h2><p>Complete the task sequence, interrupt it, then replay it before reading the contract.</p></div></section>
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
      <footer className="system-footer"><span>Interaction Index</span><span>Authored behavior contract</span></footer>
    </div>
  );
}

function App() {
  const getInitial = (): ViewId => {
    const hash = window.location.hash.slice(1) as ViewId;
    if (hash === "product") return "introduction";
    if (isPublicDocId(hash) || hash === "foundations" || hash === "patterns" || foundationItems.some((item) => `foundation-${item.id}` === hash)) return hash;
    if (patterns.some((pattern) => pattern.id === hash)) return hash;
    return components.some((component) => component.id === hash) ? hash : "introduction";
  };
  const [view, setView] = useState<ViewId>(getInitial);
  const [theme, setTheme] = useState<Theme>(() => window.localStorage.getItem("index-ui-theme") === "dark" ? "dark" : "light");

  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || hash === "product") window.history.replaceState(null, "", `#${view}`);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("index-ui-theme", theme);
  }, [theme]);

  const select = (id: ViewId) => {
    setView(id);
    window.history.replaceState(null, "", `#${id}`);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.querySelector(".system-detail__scroll")?.scrollTo?.({ top: 0, behavior: "auto" });
  };

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash.slice(1) as ViewId;
      if (isPublicDocId(next) || next === "foundations" || next === "patterns" || next === "product" || foundationItems.some((item) => `foundation-${item.id}` === next) || components.some((item) => item.id === next) || patterns.some((pattern) => pattern.id === next)) {
        setView(next === "product" ? "introduction" : next);
        document.querySelector(".system-detail__scroll")?.scrollTo?.({ top: 0, behavior: "auto" });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <TooltipProvider>
      <UndoStackProvider>
        <ConsolidatedDesignSystemMode view={view} onSelect={select} theme={theme} onThemeChange={setTheme} />
        <Toaster />
      </UndoStackProvider>
    </TooltipProvider>
  );
}

export default App;
