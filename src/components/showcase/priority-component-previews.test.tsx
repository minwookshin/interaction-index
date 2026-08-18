import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AsyncIconButtonPreview,
  ComponentMetadataDialogPreview,
  IssueActionsMenuPreview,
  PrioritySelectPreview,
} from "./priority-component-previews";

describe("priority component previews", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("runs and automatically resets the icon-button action without changing its geometry", () => {
    vi.useFakeTimers();
    render(<AsyncIconButtonPreview />);

    const button = screen.getByRole("button", { name: "Create item" });
    fireEvent.click(button, { detail: 1 });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.closest(".teum-icon-action-preview")).toHaveAttribute("data-activation", "pointer");

    act(() => vi.advanceTimersByTime(720));
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button.closest(".teum-icon-action-preview")).toHaveAttribute("data-state", "success");
    expect(screen.getByRole("status")).toHaveTextContent("Item created");

    act(() => vi.advanceTimersByTime(1200));
    expect(button).toBeEnabled();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();

    fireEvent.click(button, { detail: 0 });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.closest(".teum-icon-action-preview")).toHaveAttribute("data-activation", "keyboard");
  });

  it("updates the select value and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<PrioritySelectPreview />);

    const trigger = screen.getByRole("combobox", { name: "Priority" });
    expect(trigger).toHaveTextContent("Medium");
    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "High" }));

    expect(trigger).toHaveTextContent("High");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("keeps the menu open for a reversible toggle and restores focus after an action", async () => {
    const user = userEvent.setup();
    render(<IssueActionsMenuPreview />);

    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    const followItem = await screen.findByRole("menuitemcheckbox", { name: "Follow issue" });
    await user.click(followItem);

    expect(followItem).toBeChecked();
    expect(screen.getByRole("menu", { name: "Actions" })).toBeInTheDocument();
    expect(screen.getByText("INT-184 · Following")).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: /Duplicate/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Issue duplicated");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("saves dialog metadata, discards later drafts, and restores focus on escape", async () => {
    const user = userEvent.setup();
    render(<ComponentMetadataDialogPreview />);

    const trigger = screen.getByRole("button", { name: "Edit details" });
    await user.click(trigger);
    const nameInput = screen.getByRole("textbox", { name: "Display name" });
    await user.clear(nameInput);
    await user.type(nameInput, "Command surface");
    const maturityTrigger = screen.getByRole("combobox", { name: "Maturity" });
    await user.click(maturityTrigger);
    await user.click(await screen.findByRole("option", { name: "Beta" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(screen.getByText("Command surface", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Component metadata saved");
    await waitFor(() => expect(trigger).toHaveFocus());

    await user.click(trigger);
    const reopenedInput = screen.getByRole("textbox", { name: "Display name" });
    await user.clear(reopenedInput);
    await user.type(reopenedInput, "Temporary name");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("Command surface", { selector: "strong" })).toBeInTheDocument();

    await user.click(trigger);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
