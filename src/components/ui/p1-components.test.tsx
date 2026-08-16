import { parseDate } from "@internationalized/date";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  DatePicker,
  ReorderableList,
  Tree,
} from ".";

describe("complex collection and date components", () => {
  it("opens a locale-aware calendar from a labelled date field and restores focus", async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Due date" defaultValue={parseDate("2026-08-21")} />);
    const trigger = screen.getByRole("button", { name: /Open calendar/ });
    await user.click(trigger);
    expect(await screen.findByRole("grid")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await expect.poll(() => screen.queryByRole("grid")).toBeNull();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a context menu with pointer input and closes with Escape", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu>
        <ContextMenuTrigger>Motion contract</ContextMenuTrigger>
        <ContextMenuContent><ContextMenuItem>Duplicate</ContextMenuItem></ContextMenuContent>
      </ContextMenu>,
    );
    await user.pointer({ target: screen.getByText("Motion contract"), keys: "[MouseRight]" });
    expect(await screen.findByRole("menuitem", { name: "Duplicate" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await expect.poll(() => screen.queryByRole("menuitem", { name: "Duplicate" })).toBeNull();
  });

  it("exposes hierarchy, expansion, and disabled nodes through tree semantics", () => {
    render(<Tree aria-label="Project structure" defaultExpandedKeys={["root"]} items={[{ id: "root", label: "Components", children: [{ id: "controls", label: "Controls" }, { id: "archive", label: "Archive", disabled: true }] }]} />);
    expect(screen.getByRole("treegrid", { name: "Project structure" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Components/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("row", { name: /Archive/ })).toHaveAttribute("aria-disabled", "true");
  });

  it("provides a labelled keyboard drag handle for every reorderable item", () => {
    const onItemsChange = vi.fn();
    render(<ReorderableList aria-label="Release sequence" defaultItems={[{ id: "capture", label: "Capture intent" }, { id: "verify", label: "Verify behavior" }]} onItemsChange={onItemsChange} />);
    expect(screen.getByRole("grid", { name: "Release sequence" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Move Capture intent" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Move Verify behavior" })).toBeInTheDocument();
  });
});
