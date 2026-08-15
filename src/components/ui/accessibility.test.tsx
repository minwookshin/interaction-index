import axe from "axe-core";
import { render } from "@testing-library/react";
import { Monitor } from "@phosphor-icons/react";
import { describe, expect, it, vi } from "vitest";
import { ActionList } from "./action-list";
import { Alert } from "./alert";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Breadcrumbs } from "./breadcrumbs";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Combobox } from "./combobox";
import { ContextSwitcher } from "./context-switcher";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { EmptyState } from "./empty-state";
import { IconButton } from "./icon-button";
import { Pagination } from "./pagination";
import { NumberField } from "./number-field";
import { Progress } from "./progress";
import { RadioGroup } from "./radio-group";
import { SearchInput } from "./search-input";
import { SegmentedControl } from "./segmented-control";
import { Select } from "./select";
import { Spinner } from "./spinner";
import { Switch } from "./switch";
import { TextField } from "./text-field";
import { Textarea } from "./textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { TooltipProvider } from "./tooltip";

describe("accessibility baseline", () => {
  it("has no detectable structural violations in the control composition", async () => {
    const { container } = render(
      <TooltipProvider>
        <main>
          <h1>Component controls</h1>
          <Button>Save</Button>
          <IconButton aria-label="More options">•••</IconButton>
          <TextField label="Project name" description="Visible to the workspace" />
          <Checkbox label="Include notes" />
          <Switch label="Show previews" />
          <ActionList items={[{ id: "create", label: "Create component" }]} onAction={vi.fn()} />
        </main>
      </TooltipProvider>,
    );
    const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(result.violations).toEqual([]);
  });

  it("has no detectable structural violations in the extended product composition", async () => {
    const { container } = render(
      <main>
        <h1>Extended product controls</h1>
        <Badge>Active</Badge>
        <Avatar fallback="AS" status="online" />
        <Textarea label="Description" description="Add the decision context." />
        <RadioGroup label="Cadence" defaultValue="weekly" options={[{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }]} />
        <Select label="Priority" defaultValue="high" options={[{ value: "low", label: "Low" }, { value: "high", label: "High" }]} />
        <ContextSwitcher aria-label="Platform" defaultValue="web" options={[{ value: "web", label: "Web", description: "Browser interfaces", icon: <Monitor /> }]} />
        <Combobox label="Assignee" options={[{ value: "avery", label: "Avery Stone" }, { value: "mina", label: "Mina Park" }]} />
        <SearchInput aria-label="Search issues" />
        <Breadcrumbs items={[{ label: "Workspace", href: "/" }, { label: "Issue" }]} />
        <Pagination page={2} totalPages={8} onPageChange={vi.fn()} />
        <Progress label="Import" value={42} />
        <Spinner label="Loading issue details" />
        <NumberField label="Cycle capacity" description="Issues in the cycle." defaultValue={24} />
        <SegmentedControl label="Issue view" defaultValue="list" options={[{ value: "list", label: "List" }, { value: "board", label: "Board" }]} />
        <Collapsible><CollapsibleTrigger>Compatibility</CollapsibleTrigger><CollapsibleContent>React 19</CollapsibleContent></Collapsible>
        <Alert title="Sync paused">Changes remain local.</Alert>
        <EmptyState title="No issues" description="Create the first issue." primaryAction={<Button>Create issue</Button>} />
        <Table aria-label="Issues"><TableHeader><TableRow><TableHead>Issue</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Motion contract</TableCell></TableRow></TableBody></Table>
      </main>,
    );
    const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(result.violations).toEqual([]);
  });
});
