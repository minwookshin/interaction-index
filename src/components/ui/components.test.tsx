import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ActionList } from "./action-list";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { InlineEdit } from "./inline-edit";
import { SharedDetail } from "./shared-detail";
import { Switch } from "./switch";

describe("core controls", () => {
  it("keeps button geometry and semantics while loading", () => {
    render(<Button loading>Save changes</Button>);
    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("tabindex", "0");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveTextContent("Save changes");
  });

  it("toggles checkbox and switch with the keyboard", async () => {
    const user = userEvent.setup();
    render(<><Checkbox label="Include notes" /><Switch label="Show previews" /></>);
    const checkbox = screen.getByRole("checkbox", { name: "Include notes" });
    const toggle = screen.getByRole("switch", { name: "Show previews" });
    checkbox.focus();
    await user.keyboard(" ");
    expect(checkbox).toBeChecked();
    toggle.focus();
    await user.keyboard(" ");
    expect(toggle).toBeChecked();
  });

  it("keeps choice descriptions out of the accessible name and in the description", () => {
    render(<><Checkbox label="Include notes" description="Adds the authored contract." /><Switch label="Show previews" description="Updates immediately." /></>);
    const checkbox = screen.getByRole("checkbox", { name: "Include notes" });
    const toggle = screen.getByRole("switch", { name: "Show previews" });
    expect(checkbox).toHaveAccessibleDescription("Adds the authored contract.");
    expect(toggle).toHaveAccessibleDescription("Updates immediately.");
  });

  it("exposes an indeterminate checkbox as mixed", () => {
    render(<Checkbox label="Select all" indeterminate />);
    expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute("aria-checked", "mixed");
  });
});

describe("authored interaction components", () => {
  function InlineHarness() {
    const [value, setValue] = useState("Interaction Index");
    return <InlineEdit value={value} onSave={setValue} />;
  }

  it("saves inline edits with Enter and cancels with Escape", async () => {
    const user = userEvent.setup();
    render(<InlineHarness />);
    await user.click(screen.getByRole("button", { name: "Edit value: Interaction Index" }));
    const input = screen.getByRole("textbox", { name: "Edit value" });
    await user.clear(input);
    await user.type(input, "Index Core{Enter}");
    expect(screen.getByRole("button", { name: "Edit value: Index Core" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit value: Index Core" }));
    await user.clear(screen.getByRole("textbox", { name: "Edit value" }));
    await user.type(screen.getByRole("textbox", { name: "Edit value" }), "Discard me{Escape}");
    const trigger = screen.getByRole("button", { name: "Edit value: Index Core" });
    expect(trigger).toBeInTheDocument();
    await vi.waitFor(() => expect(trigger).toHaveFocus());
  });

  it("filters and runs action-list items without moving input focus", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<ActionList items={[
      { id: "create", label: "Create component" },
      { id: "archive", label: "Archive component" },
      { id: "delete", label: "Delete permanently", disabled: true },
    ]} onAction={onAction} />);
    const input = screen.getByRole("combobox");
    expect(screen.getByText("⌘K")).toHaveAccessibleName("Command K");
    await user.type(input, "archive");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await user.keyboard("{Enter}");
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ id: "archive" }));
    expect(input).toHaveFocus();
  });

  it("keeps invalid inline edits open with an associated error", async () => {
    const user = userEvent.setup();
    render(<InlineEdit value="Issue title" onSave={vi.fn()} validate={(value) => value.length < 3 ? "Use at least 3 characters." : undefined} />);
    await user.click(screen.getByRole("button", { name: "Edit value: Issue title" }));
    const input = screen.getByRole("textbox", { name: "Edit value" });
    await user.clear(input);
    await user.type(input, "A{Enter}");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Use at least 3 characters.");
  });

  it("commits an inline edit once when Enter also causes blur", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<InlineEdit value="Issue title" onSave={onSave} />);
    await user.click(screen.getByRole("button", { name: "Edit value: Issue title" }));
    const input = screen.getByRole("textbox", { name: "Edit value" });
    await user.clear(input);
    await user.type(input, "Updated title{Enter}");
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("moves focus into shared detail and restores it on Escape", async () => {
    const user = userEvent.setup();
    render(<SharedDetail items={[{ id: "one", title: "Motion contract", meta: "Updated now", description: "Details" }]} />);
    const origin = screen.getByRole("button", { name: /Motion contract/ });
    await user.click(origin);
    const detail = await screen.findByRole("region", { name: "Motion contract" });
    await vi.waitFor(() => expect(detail).toHaveFocus());
    expect(screen.queryByRole("tooltip", { name: "Close" })).not.toBeInTheDocument();
    await user.keyboard("{Escape}");
    await vi.waitFor(() => expect(origin).toHaveFocus());
  });

  it("suppresses spatial motion when shared detail is opened from the keyboard", async () => {
    const user = userEvent.setup();
    const { container } = render(<SharedDetail items={[{ id: "one", title: "Motion contract", meta: "Updated now", description: "Details" }]} />);
    const origin = screen.getByRole("button", { name: /Motion contract/ });
    origin.focus();
    await user.keyboard("{Enter}");
    expect(container.querySelector(".ix-shared-detail")).toHaveAttribute("data-motion-mode", "direct");
    expect(await screen.findByRole("region", { name: "Motion contract" })).toBeInTheDocument();
  });

  it("retargets shared detail without stacking regions", async () => {
    const user = userEvent.setup();
    render(<SharedDetail items={[
      { id: "motion", title: "Motion contract", meta: "Updated now", description: "Motion details" },
      { id: "focus", title: "Focus map", meta: "Updated later", description: "Focus details" },
    ]} defaultSelectedId="motion" />);

    expect(screen.getAllByRole("region")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: /Focus map/ }));
    await vi.waitFor(() => expect(screen.getByRole("region", { name: "Focus map" })).toBeInTheDocument());
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(screen.getByRole("button", { name: /Motion contract/ })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: /Focus map/ })).toHaveAttribute("aria-expanded", "true");
  });

  it("lets a nested overlay consume Escape before Shared Detail closes", async () => {
    const user = userEvent.setup();
    render(<SharedDetail items={[{ id: "one", title: "Motion contract", meta: "Updated now", description: "Details" }]} renderDetail={() => (
      <Dialog>
        <DialogTrigger render={<Button />}>Edit metadata</DialogTrigger>
        <DialogContent><DialogTitle>Edit metadata</DialogTitle></DialogContent>
      </Dialog>
    )} />);
    await user.click(screen.getByRole("button", { name: /Motion contract/ }));
    await user.click(screen.getByRole("button", { name: "Edit metadata" }));
    expect(await screen.findByRole("dialog", { name: "Edit metadata" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await vi.waitFor(() => expect(screen.queryByRole("dialog", { name: "Edit metadata" })).not.toBeInTheDocument());
    expect(screen.getByRole("region", { name: "Motion contract" })).toBeInTheDocument();
  });
});
