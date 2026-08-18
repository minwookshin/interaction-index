import { CheckCircle, Package } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  Alert,
  Breadcrumbs,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  EmptyState,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui";
import "./navigation-feedback-previews.css";

type BreadcrumbLevel = "workspace" | "projects" | "refresh";

const breadcrumbPaths: Record<BreadcrumbLevel, readonly { label: string; href?: string }[]> = {
  workspace: [{ label: "Workspace" }],
  projects: [{ label: "Workspace", href: "/workspace" }, { label: "Projects" }],
  refresh: [{ label: "Workspace", href: "/workspace" }, { label: "Projects", href: "/projects" }, { label: "UI Refresh" }],
};

export function BreadcrumbPathPreview() {
  const [level, setLevel] = useState<BreadcrumbLevel>("refresh");

  const navigate = (event: MouseEvent<HTMLElement>) => {
    const link = (event.target as HTMLElement).closest("a");
    if (!link) return;
    event.preventDefault();
    setLevel(link.textContent === "Workspace" ? "workspace" : "projects");
  };

  return (
    <div className="teum-breadcrumb-preview">
      <Breadcrumbs label="Component preview breadcrumb" items={breadcrumbPaths[level]} onClick={navigate} />
      {level !== "refresh" && <Button variant="quiet" size="small" onClick={() => setLevel("refresh")}>Return to issue</Button>}
      <span className="teum-sr-only" role="status" aria-live="polite">Current location: {breadcrumbPaths[level].at(-1)?.label}</span>
    </div>
  );
}

export function StableTabsPreview() {
  const [value, setValue] = useState("overview");

  return (
    <Tabs className="tabs-demo tabs-demo--primary" value={value} onValueChange={setValue}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="relations">Relations</TabsTrigger>
      </TabsList>
      <div className="tabs-panel-viewport">
        <TabsContent value="overview"><div className="tab-card"><strong>Live component</strong><p>Inspect the component at product density.</p></div></TabsContent>
        <TabsContent value="activity"><div className="tab-card"><strong>Recent activity</strong><p>Review the latest component changes.</p></div></TabsContent>
        <TabsContent value="relations"><div className="tab-card"><strong>Related work</strong><p>Trace connected patterns and dependencies.</p></div></TabsContent>
      </div>
    </Tabs>
  );
}

export function FilterCollapsiblePreview() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible className="teum-collapsible teum-filter-collapsible-preview" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>Advanced filter rules</CollapsibleTrigger>
      <CollapsibleContent>
        <span>State is ready</span>
        <span>Owner is assigned</span>
      </CollapsibleContent>
    </Collapsible>
  );
}

type ExportState = "idle" | "running" | "complete";

export function ExportProgressPreview() {
  const [value, setValue] = useState(0);
  const [state, setState] = useState<ExportState>("idle");
  const interval = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(interval.current), []);

  const run = () => {
    window.clearInterval(interval.current);
    setValue(0);
    setState("running");
    interval.current = window.setInterval(() => {
      setValue((current) => {
        const next = Math.min(100, current + 20);
        if (next === 100) {
          window.clearInterval(interval.current);
          setState("complete");
        }
        return next;
      });
    }, 180);
  };

  return (
    <div className="teum-export-progress-preview" data-state={state}>
      <Progress label={state === "complete" ? "Export complete" : "Export components"} value={value} />
      <Button variant="secondary" size="small" disabled={state === "running"} onClick={run}>
        {state === "complete" ? "Run again" : state === "running" ? "Exporting" : "Run export"}
      </Button>
      <span className="teum-sr-only" role="status" aria-live="polite">{state === "complete" ? "Export complete" : ""}</span>
    </div>
  );
}

export function DismissibleAlertPreview() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="teum-alert-preview">
      {visible ? (
        <Alert title="Import complete" onDismiss={() => setVisible(false)} dismissLabel="Dismiss import confirmation">
          40 components were added.
        </Alert>
      ) : (
        <Button variant="secondary" size="small" onClick={() => setVisible(true)}>Restore alert</Button>
      )}
    </div>
  );
}

export function EmptyCollectionPreview() {
  const [created, setCreated] = useState(false);

  if (!created) {
    return (
      <EmptyState
        title="No components yet"
        description="Add the first component to this collection."
        icon={<Package />}
        primaryAction={<Button size="small" variant="primary" onClick={() => setCreated(true)}>Add component</Button>}
      />
    );
  }

  return (
    <section className="product-context product-context--toolbar teum-empty-state-result" aria-label="Created component example">
      <div className="product-context__identity">
        <span className="product-context__icon"><CheckCircle weight="fill" aria-hidden="true" /></span>
        <div><strong>Button</strong><span>Added to the collection</span></div>
      </div>
      <Button variant="quiet" size="small" onClick={() => setCreated(false)}>Reset</Button>
    </section>
  );
}
