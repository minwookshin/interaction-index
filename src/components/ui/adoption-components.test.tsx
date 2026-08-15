import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Alert,
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  EmptyState,
  NumberField,
  SegmentedControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from ".";

describe("product adoption components", () => {
  it("keeps static alerts out of live regions and supports a labelled dismiss action", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { rerender } = render(<Alert title="Sync paused" onDismiss={onDismiss}>Changes stay on this device.</Alert>);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(onDismiss).toHaveBeenCalledOnce();

    rerender(<Alert title="Sync resumed" live="polite">All changes are current.</Alert>);
    expect(screen.getByRole("status")).toHaveTextContent("Sync resumed");
  });

  it("names an empty composition from its visible title and keeps actions discoverable", () => {
    render(<EmptyState title="No matching issues" description="Clear the current filter." primaryAction={<Button>Clear filter</Button>} />);
    const region = screen.getByText("No matching issues").closest(".ix-empty-state");
    expect(region).toHaveAccessibleName("No matching issues");
    expect(within(region as HTMLElement).getByRole("button", { name: "Clear filter" })).toBeInTheDocument();
  });

  it("requires an explicit response in an alert dialog and restores focus", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger render={<Button />}>Discard draft</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
            <AlertDialogDescription>Unpublished notes will be removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button />}>Keep draft</AlertDialogClose>
            <AlertDialogClose render={<Button variant="primary" />}>Discard</AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    const trigger = screen.getByRole("button", { name: "Discard draft" });
    await user.click(trigger);
    expect(await screen.findByRole("alertdialog", { name: "Discard this draft?" })).toHaveAccessibleDescription("Unpublished notes will be removed.");
    await user.click(screen.getByRole("button", { name: "Keep draft" }));
    await vi.waitFor(() => expect(trigger).toHaveFocus());
  });

  it("associates number-field help and exposes semantic step actions", async () => {
    const user = userEvent.setup();
    render(<NumberField label="Cycle capacity" description="Issues available to this cycle." defaultValue={24} min={1} max={99} />);
    const input = screen.getByRole("textbox", { name: "Cycle capacity" });
    expect(input).toHaveAccessibleDescription("Issues available to this cycle.");
    await user.click(screen.getByRole("button", { name: "Increase Cycle capacity" }));
    expect(input).toHaveValue("25");
    expect(document.querySelectorAll(`[id="${input.id}"]`)).toHaveLength(1);
  });

  it("keeps segmented selection singular and announces the group", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SegmentedControl label="Issue view" defaultValue="list" onValueChange={onValueChange} options={[{ value: "list", label: "List" }, { value: "board", label: "Board" }]} />);
    const group = screen.getByRole("group", { name: "Issue view" });
    const list = within(group).getByRole("button", { name: "List" });
    const board = within(group).getByRole("button", { name: "Board" });
    expect(list).toHaveAttribute("aria-pressed", "true");
    await user.click(board);
    expect(board).toHaveAttribute("aria-pressed", "true");
    expect(list).toHaveAttribute("aria-pressed", "false");
    expect(onValueChange).toHaveBeenLastCalledWith("board");
  });

  it("discloses supporting content without changing destination", async () => {
    const user = userEvent.setup();
    render(<Collapsible className="ix-collapsible"><CollapsibleTrigger>Compatibility details</CollapsibleTrigger><CollapsibleContent>React 19 and Base UI 1.</CollapsibleContent></Collapsible>);
    const trigger = screen.getByRole("button", { name: "Compatibility details" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("React 19 and Base UI 1.")).toBeVisible();
  });

  it("preserves native table relationships", () => {
    render(<Table aria-label="Issues"><TableHeader><TableRow><TableHead>Issue</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Motion contract</TableCell><TableCell>Review</TableCell></TableRow></TableBody></Table>);
    const table = screen.getByRole("table", { name: "Issues" });
    expect(within(table).getByRole("columnheader", { name: "Issue" })).toHaveAttribute("scope", "col");
    expect(within(table).getAllByRole("cell")).toHaveLength(2);
  });
});
