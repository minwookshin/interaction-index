import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  BulkActionBar,
  Button,
  ColumnManager,
  DataExportMenu,
  DataTable,
  type DataTableColumn,
  DateRangeFilter,
  FilterBuilder,
  type DataFilter,
  SavedViews,
} from ".";

type Issue = {
  id: string;
  name: string;
  status: "Open" | "Done";
};

const issues: readonly Issue[] = [
  { id: "beta", name: "Beta issue", status: "Open" },
  { id: "alpha", name: "Alpha issue", status: "Done" },
];

const columns: readonly DataTableColumn<Issue>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true, hideable: false },
  { id: "status", header: "Status", accessor: "status" },
];

describe("Teum Data components", () => {
  it("sorts semantic rows and keeps controlled selection stable", async () => {
    const user = userEvent.setup();

    function Harness() {
      const [selection, setSelection] = useState<readonly string[]>([]);
      return (
        <DataTable
          ariaLabel="Release issues"
          data={issues}
          columns={columns}
          getRowId={(issue) => issue.id}
          getRowLabel={(issue) => issue.name}
          selectable
          selectedRowIds={selection}
          onSelectedRowIdsChange={setSelection}
          defaultSorting={[{ id: "name", direction: "asc" }]}
        />
      );
    }

    render(<Harness />);
    const table = screen.getByRole("table", { name: "Release issues" });
    expect(within(table).getByRole("columnheader", { name: /Name/ })).toHaveAttribute("aria-sort", "ascending");
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("Alpha issue");

    await user.click(within(table).getByRole("button", { name: /Sort Name/ }));
    expect(within(table).getByRole("columnheader", { name: /Name/ })).toHaveAttribute("aria-sort", "descending");
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("Beta issue");

    await user.click(within(table).getByRole("checkbox", { name: "Select Beta issue" }));
    expect(within(table).getByRole("checkbox", { name: "Select Beta issue" })).toBeChecked();
    expect(screen.getByText("1 rows selected")).toBeInTheDocument();
    await user.click(within(table).getByRole("checkbox", { name: "Select Beta issue" }));
    expect(screen.getByText("0 rows selected")).toBeInTheDocument();
  });

  it("renders explicit loading, empty, and error contracts", () => {
    const { rerender } = render(
      <DataTable ariaLabel="Issues" data={issues} columns={columns} getRowId={(issue) => issue.id} loading />,
    );
    expect(screen.getByRole("table", { name: "Issues" })).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("Alpha issue")).not.toBeInTheDocument();

    rerender(<DataTable ariaLabel="Issues" data={[]} columns={columns} getRowId={(issue) => issue.id} emptyTitle="No issues yet" emptyDescription="Create the first issue." />);
    expect(screen.getByText("No issues yet")).toBeInTheDocument();
    expect(screen.getByText("Create the first issue.")).toBeInTheDocument();

    rerender(<DataTable ariaLabel="Issues" data={[]} columns={columns} getRowId={(issue) => issue.id} error="Retry the request." />);
    expect(screen.getByText("Could not load data")).toBeInTheDocument();
    expect(screen.getByText("Retry the request.")).toBeInTheDocument();
  });

  it("builds visible filters and lets people remove them", async () => {
    const user = userEvent.setup();

    function Harness() {
      const [filters, setFilters] = useState<readonly DataFilter[]>([]);
      return <FilterBuilder fields={[{ id: "status", label: "Status", values: [{ label: "Open", value: "Open" }, { label: "Done", value: "Done" }] }]} filters={filters} onFiltersChange={setFilters} />;
    }

    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Filter" }));
    await user.click(screen.getByRole("combobox", { name: "Value" }));
    await user.click(await screen.findByRole("option", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "Add filter" }));

    expect(screen.getByText("Status is Open")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove Status is Open" }));
    expect(screen.queryByText("Status is Open")).not.toBeInTheDocument();
  });

  it("keeps saved views and column visibility in system menus", async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();
    const onVisibilityChange = vi.fn();
    render(<>
      <SavedViews views={[{ id: "all", label: "All issues" }, { id: "mine", label: "Assigned to me" }]} value="all" onValueChange={onViewChange} />
      <ColumnManager columns={[{ id: "name", label: "Name", visible: true, required: true }, { id: "status", label: "Status", visible: true }]} onVisibilityChange={onVisibilityChange} />
    </>);

    await user.click(screen.getByRole("button", { name: "View: All issues" }));
    await user.click(await screen.findByRole("menuitemradio", { name: "Assigned to me" }));
    expect(onViewChange).toHaveBeenCalledWith("mine");

    await user.click(screen.getByRole("button", { name: "2 of 2 columns visible" }));
    await user.click(await screen.findByRole("menuitemcheckbox", { name: "Status" }));
    expect(onVisibilityChange).toHaveBeenCalledWith("status", false);
  });

  it("appears only for a real selection and exposes a clear path", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onArchive = vi.fn();
    const { rerender } = render(<BulkActionBar count={0} onClear={onClear} actions={<Button onClick={onArchive}>Archive</Button>} />);
    expect(screen.queryByRole("region", { name: "Bulk actions" })).not.toBeInTheDocument();

    rerender(<BulkActionBar count={2} noun="issue" onClear={onClear} actions={<Button onClick={onArchive}>Archive</Button>} />);
    expect(screen.getByRole("region", { name: "Bulk actions" })).toHaveTextContent("2 issues selected");
    await user.click(screen.getByRole("button", { name: "Archive" }));
    expect(onArchive).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("supports controlled server pagination without processing the supplied page again", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <DataTable
        ariaLabel="Server issues"
        data={issues}
        columns={columns}
        getRowId={(issue) => issue.id}
        manualPagination
        manualSorting
        page={2}
        pageSize={2}
        rowCount={8}
        onPageChange={onPageChange}
      />,
    );
    expect(screen.getByText("8 records")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("pins and resizes columns with an explicit keyboard path", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        ariaLabel="Resizable issues"
        data={issues}
        columns={columns.map((column) => ({ ...column, width: column.id === "name" ? 180 : 120, resizable: true }))}
        getRowId={(issue) => issue.id}
        defaultColumnPinning={{ start: ["name"], end: [] }}
      />,
    );
    const nameHeader = screen.getByRole("columnheader", { name: /Name/ });
    expect(nameHeader).toHaveAttribute("data-pinned", "start");
    const resize = screen.getByRole("separator", { name: "Resize Name column" });
    expect(resize).toHaveAttribute("aria-valuenow", "180");
    await user.click(resize);
    await user.keyboard("{ArrowRight}");
    expect(resize).toHaveAttribute("aria-valuenow", "192");
  });

  it("virtualizes a large collection while preserving the total row contract", () => {
    const large = Array.from({ length: 1_000 }, (_, index) => ({ id: `issue-${index}`, name: `Issue ${index}`, status: "Open" as const }));
    render(
      <DataTable
        ariaLabel="Large issue collection"
        data={large}
        columns={columns}
        getRowId={(issue) => issue.id}
        paginate={false}
        virtualize={{ height: 240, estimateRowHeight: 39, overscan: 3 }}
      />,
    );
    const table = screen.getByRole("table", { name: "Large issue collection" });
    expect(table).toHaveAttribute("aria-rowcount", "1001");
    expect(within(table).getAllByRole("row").length).toBeLessThan(30);
    expect(within(table).getByText("Issue 0")).toBeInTheDocument();
  });

  it("applies a date preset only after confirmation", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateRangeFilter
        value={{ from: null, to: null }}
        onValueChange={onValueChange}
        presets={[{ id: "july", label: "July", getValue: () => ({ from: "2026-07-01", to: "2026-07-31" }) }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Date range: Any time/ }));
    await user.click(screen.getByRole("button", { name: "July" }));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onValueChange).toHaveBeenCalledWith({ from: "2026-07-01", to: "2026-07-31" });
  });

  it("exports visible or selected rows through the same product menu", async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    render(
      <DataExportMenu
        rows={issues}
        selectedRows={[issues[0]]}
        columns={[{ id: "name", header: "Name", value: "name" }]}
        fileName="issues"
        download={false}
        onExport={onExport}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Export" }));
    await user.click(await screen.findByRole("menuitem", { name: "Export selected CSV" }));
    expect(onExport).toHaveBeenCalledWith(expect.objectContaining({ fileName: "issues-selected.csv", rowCount: 1 }), "selected");
    expect(screen.getByText("1 rows exported as CSV")).toBeInTheDocument();
  });
});
