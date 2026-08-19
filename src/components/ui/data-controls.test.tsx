import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  AuditLog,
  CursorPagination,
  DataDensityControl,
  DataGroupMenu,
  DataResultSummary,
  DataSortMenu,
  DataState,
  FacetFilter,
  PropertyList,
  RowActionsMenu,
} from ".";

describe("whatiuse Data controls", () => {
  it("keeps facet selection explicit and clearable", async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();
    const { container } = render(<FacetFilter label="Status" values={["active"]} onValuesChange={onValuesChange} options={[
      { value: "active", label: "Active", count: 18 },
      { value: "risk", label: "At risk", count: 4 },
    ]} />);

    expect(container.querySelector(".whatiuse-facet-filter__trigger-content")).toHaveTextContent("Status1");

    await user.click(screen.getByRole("button", { name: "Status: 1 selected" }));
    await user.click(await screen.findByRole("menuitemcheckbox", { name: /At risk/ }));
    expect(onValuesChange).toHaveBeenLastCalledWith(["active", "risk"]);
    await user.click(await screen.findByRole("menuitem", { name: "Clear status" }));
    expect(onValuesChange).toHaveBeenLastCalledWith([]);
  });

  it("publishes deliberate sort and group choices", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    const { rerender } = render(<DataSortMenu value={{ id: "updated", direction: "desc" }} onValueChange={onSort} options={[
      { id: "updated", label: "Updated" },
      { id: "arr", label: "ARR" },
    ]} />);

    await user.click(screen.getByRole("button", { name: "Sort: Updated, descending" }));
    await user.click(await screen.findByRole("menuitemradio", { name: "ARR" }));
    expect(onSort).toHaveBeenLastCalledWith({ id: "arr", direction: "desc" });

    await user.keyboard("{Escape}");
    const onGroup = vi.fn();
    rerender(<DataGroupMenu value={null} onValueChange={onGroup} options={[{ id: "status", label: "Status" }]} />);
    await user.click(screen.getByRole("button", { name: "Group" }));
    await user.click(await screen.findByRole("menuitemradio", { name: "Status" }));
    expect(onGroup).toHaveBeenCalledWith("status");
  });

  it("keeps density and cursor navigation controlled", async () => {
    const user = userEvent.setup();
    const onDensity = vi.fn();
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    render(<>
      <DataDensityControl value="default" onValueChange={onDensity} />
      <CursorPagination hasPrevious={false} hasNext range="26–50" onPrevious={onPrevious} onNext={onNext} />
    </>);

    await user.click(screen.getByRole("button", { name: "Compact" }));
    expect(onDensity).toHaveBeenCalledWith("compact");
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrevious).not.toHaveBeenCalled();
  });

  it("keeps counts and properties available as text", () => {
    render(<>
      <DataResultSummary total={248} filtered={18} selected={3} noun="account" detail="Status is Active" />
      <PropertyList aria-label="Account properties" items={[
        { id: "owner", label: "Owner", value: "Avery" },
        { id: "plan", label: "Plan", value: "Business", description: "Annual" },
      ]} />
    </>);

    expect(screen.getByText("18").closest("output")).toHaveTextContent("18 accountsof 2483 selectedStatus is Active");
    const properties = screen.getByText("Owner").closest("dl");
    expect(properties).toHaveTextContent("OwnerAveryPlanBusinessAnnual");
  });

  it("supports row actions, audit selection, and stable collection states", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onSelect = vi.fn();
    render(<>
      <RowActionsMenu label="Northstar actions" actions={[{ id: "open", label: "Open account" }]} onAction={onAction} />
      <AuditLog label="Account activity" items={[{ id: "owner", actor: "Mina", action: "changed owner", timestamp: "8m" }]} onSelect={onSelect} />
      <DataState state="error" title="Accounts unavailable" />
    </>);

    await user.click(screen.getByRole("button", { name: "Northstar actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Open account" }));
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ id: "open" }));
    await user.click(screen.getByRole("button", { name: /Mina changed owner/ }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "owner" }));
    const alert = screen.getByRole("alert");
    expect(within(alert).getByText("Accounts unavailable")).toBeInTheDocument();
  });
});
