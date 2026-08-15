import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeviceMobile, Monitor } from "@phosphor-icons/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Avatar,
  Badge,
  Breadcrumbs,
  Combobox,
  ContextSwitcher,
  Pagination,
  Progress,
  RadioGroup,
  SearchInput,
  Select,
  Skeleton,
  Spinner,
  Textarea,
} from ".";

describe("extended component set", () => {
  it("makes removable badges explicit actions", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Badge removable removeLabel="Remove Design filter" onRemove={onRemove}>Design</Badge>);
    await user.click(screen.getByRole("button", { name: "Remove Design filter" }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("keeps textarea validation and character count associated", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Description" error="Add more detail." maxLength={20} showCount />);
    const field = screen.getByRole("textbox", { name: "Description" });
    await user.type(field, "Hello");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription("Add more detail.");
    expect(screen.getByRole("status", { name: "Character count" })).toHaveTextContent("5/20");
  });

  it("supports arrow-key selection in a labelled radio group", async () => {
    const user = userEvent.setup();
    render(<RadioGroup label="Cadence" defaultValue="daily" options={[{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }]} />);
    const daily = screen.getByRole("radio", { name: "Daily" });
    daily.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Weekly" })).toBeChecked();
  });

  it("keeps horizontal radio layouts operable with horizontal arrow keys", async () => {
    const user = userEvent.setup();
    render(<RadioGroup label="Layout" orientation="horizontal" defaultValue="list" options={[{ value: "list", label: "List" }, { value: "board", label: "Board" }]} />);
    const list = screen.getByRole("radio", { name: "List" });
    list.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Board" })).toBeChecked();
  });

  it("resolves the selected label from a short predefined Select list", () => {
    render(<Select label="Priority" defaultValue="high" options={[{ label: "Low", value: "low" }, { label: "High", value: "high" }]} />);
    expect(screen.getByRole("combobox", { name: "Priority" })).toHaveTextContent("High");
  });

  it("selects a richly described context without relying on color", async () => {
    const user = userEvent.setup();
    render(<ContextSwitcher aria-label="Platform" defaultValue="web" options={[
      { value: "web", label: "Web", description: "Browser interfaces", icon: <Monitor /> },
      { value: "native", label: "Native", description: "Mobile applications", icon: <DeviceMobile /> },
    ]} />);
    const trigger = screen.getByRole("combobox", { name: "Platform" });
    expect(trigger).toHaveTextContent("Web");
    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: /Native/ }));
    expect(trigger).toHaveTextContent("Native");
  });

  it("keeps an explicitly empty context honest instead of displaying a false selection", () => {
    render(<ContextSwitcher aria-label="Platform" value={null} options={[
      { value: "web", label: "Web", description: "Browser interfaces", icon: <Monitor /> },
      { value: "native", label: "Native", description: "Mobile applications", icon: <DeviceMobile /> },
    ]} />);
    expect(screen.getByRole("combobox", { name: "Platform" })).toHaveTextContent("Choose context");
  });

  it("filters and selects a Combobox option", async () => {
    const user = userEvent.setup();
    render(<Combobox label="Assignee" options={[{ label: "Avery Stone", value: "avery" }, { label: "Mina Park", value: "mina" }]} />);
    const input = screen.getByRole("combobox", { name: "Assignee" });
    await user.type(input, "Mina");
    expect(screen.queryByRole("option", { name: "Avery Stone", hidden: true })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Mina Park", hidden: true })).toBeInTheDocument();
  });

  it("clears a controlled Search Input without changing geometry", async () => {
    const user = userEvent.setup();
    function SearchHarness() {
      const [value, setValue] = useState("button");
      return <SearchInput value={value} onChange={(event) => setValue(event.target.value)} onClear={() => setValue("")} />;
    }
    render(<SearchHarness />);
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("");
  });

  it("tracks and clears a Search Input that owns its local value", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<SearchInput defaultValue="button" onClear={onClear} />);
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("");
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("clamps pagination at boundaries and marks the current page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={12} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("normalizes invalid pagination inputs without rendering an impossible current page", () => {
    render(<Pagination page={99} totalPages={0} onPageChange={() => undefined} />);
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("uses semantic breadcrumbs and a non-link current page", () => {
    render(<Breadcrumbs items={[{ label: "Workspace", href: "/" }, { label: "Project", href: "/projects" }, { label: "Issue" }]} />);
    const navigation = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(navigation).getByText("Issue")).toHaveAttribute("aria-current", "page");
    expect(within(navigation).queryByRole("link", { name: "Issue" })).not.toBeInTheDocument();
  });

  it("exposes progress and spinner status while hiding skeleton geometry", () => {
    const { container } = render(<><Progress label="Export" value={68} /><Spinner label="Loading panel" /><Skeleton width={120} height={10} /></>);
    expect(screen.getByRole("progressbar", { name: "Export" })).toHaveAttribute("aria-valuenow", "68");
    expect(screen.getByRole("status", { name: "Loading panel" })).toBeInTheDocument();
    expect(container.querySelector(".teum-skeleton")).toHaveAttribute("aria-hidden", "true");
  });

  it("maps Progress against its full min-to-max range", () => {
    render(<Progress aria-label="Migration" min={50} max={150} value={100} />);
    expect(screen.getByRole("progressbar", { name: "Migration" })).toHaveStyle({ "--teum-progress-scale": "0.5" });
  });

  it("labels presence without turning the avatar into an action", () => {
    const { container } = render(<Avatar fallback="AS" status="online" />);
    expect(screen.getByLabelText("online presence")).toBeInTheDocument();
    expect(container.querySelector(".teum-avatar")).toHaveAttribute("data-status", "online");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
