import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ComponentToastPreview,
  DiscardDraftAlertPreview,
  FavoriteTooltipPreview,
  IssueContextMenuPreview,
  IssuePropertiesSheetPreview,
  ViewOptionsPopoverPreview,
} from "./overlay-component-previews";

const toastSpies = vi.hoisted(() => ({
  base: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock("../ui", async () => {
  const actual = await vi.importActual<typeof import("../ui")>("../ui");
  return {
    ...actual,
    toast: Object.assign(toastSpies.base, {
      success: toastSpies.success,
      error: toastSpies.error,
      info: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
      dismiss: vi.fn(),
    }),
  };
});

describe("overlay component previews", () => {
  beforeEach(() => {
    toastSpies.base.mockReset();
    toastSpies.success.mockReset();
    toastSpies.error.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the tooltip action reversible while updating its accessible name", async () => {
    const user = userEvent.setup();
    render(<FavoriteTooltipPreview />);

    const add = screen.getByRole("button", { name: "Add to favorites" });
    await user.click(add);
    expect(screen.getByRole("button", { name: "Remove from favorites" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Remove from favorites" }));
    expect(screen.getByRole("button", { name: "Add to favorites" })).toHaveAttribute("aria-pressed", "false");
  });

  it("changes the visible view state from inside the anchored popover", async () => {
    const user = userEvent.setup();
    render(<ViewOptionsPopoverPreview />);

    await user.click(screen.getByRole("button", { name: "View" }));
    await user.click(await screen.findByRole("switch", { name: "Show contracts" }));

    expect(screen.getByText("Contracts hidden")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Show contracts" })).not.toBeChecked();
  });

  it("keeps a context-menu toggle open and applies a later object action", async () => {
    const user = userEvent.setup();
    render(<IssueContextMenuPreview />);

    fireEvent.contextMenu(screen.getByText("Motion contract"));
    const follow = await screen.findByRole("menuitemcheckbox", { name: "Follow" });
    await user.click(follow);
    expect(follow).toBeChecked();
    expect(screen.getByRole("menu", { name: "Issue context menu" })).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: "Archive" }));
    expect(screen.getByRole("status")).toHaveTextContent("Issue archived");
  });

  it("commits sheet edits, discards a later draft, and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<IssuePropertiesSheetPreview />);

    const trigger = screen.getByRole("button", { name: "Properties" });
    await user.click(trigger);
    const title = screen.getByRole("textbox", { name: "Title" });
    await user.clear(title);
    await user.type(title, "Motion guidance");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(screen.getByText("Motion guidance", { selector: "strong" })).toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());

    await user.click(trigger);
    const reopenedTitle = screen.getByRole("textbox", { name: "Title" });
    await user.clear(reopenedTitle);
    await user.type(reopenedTitle, "Temporary title");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("Motion guidance", { selector: "strong" })).toBeInTheDocument();
  });

  it("makes the alert-dialog outcome visible and exposes a repeat path", async () => {
    const user = userEvent.setup();
    render(<DiscardDraftAlertPreview />);

    await user.click(screen.getByRole("button", { name: "Discard" }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Discard" }));

    expect(await screen.findByRole("button", { name: "Restore" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Restore" }));
    expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
  });

  it("creates a bounded-stack identity per event while keeping undo scoped to its toast", async () => {
    const user = userEvent.setup();
    render(<ComponentToastPreview />);
    const trigger = screen.getByRole("button", { name: "Show toast" });

    await user.click(trigger);
    expect(toastSpies.success).toHaveBeenLastCalledWith("Component saved", expect.objectContaining({
      id: "component-feedback-0",
      action: undefined,
    }));

    await user.click(trigger);
    expect(toastSpies.base).toHaveBeenLastCalledWith("Component archived", expect.objectContaining({
      id: "component-feedback-1",
      description: undefined,
      action: expect.objectContaining({ label: "Undo" }),
    }));

    await user.click(trigger);
    expect(toastSpies.error).toHaveBeenLastCalledWith("Couldn’t publish", expect.objectContaining({
      id: "component-feedback-2",
      action: undefined,
    }));
  });
});
