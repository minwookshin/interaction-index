import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ActionButtonGroupPreview,
  ComponentSearchPreview,
  DescriptionTextareaPreview,
  InteractionNotesCheckboxPreview,
  PlatformContextSwitcherPreview,
  ProjectFieldPreview,
  ProjectTextFieldPreview,
} from "./control-component-previews";

describe("control component previews", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("reveals field validation only after the editable value becomes invalid", async () => {
    const user = userEvent.setup();
    render(<ProjectFieldPreview />);

    const input = screen.getByRole("textbox", { name: "Project name" });
    await user.clear(input);
    await user.tab();

    expect(screen.getByText("Enter a project name.")).toBeVisible();
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("announces grouped action feedback without adding a visible status row", async () => {
    const user = userEvent.setup();
    render(<ActionButtonGroupPreview />);

    await user.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByRole("status")).toHaveClass("teum-sr-only");
    expect(screen.getByRole("status")).toHaveTextContent("Preview opened");

    const approve = screen.getByRole("button", { name: "Approve issue" });
    expect(approve).toHaveClass("teum-icon-button");
    await user.click(approve);
    expect(screen.getByRole("status")).toHaveTextContent("Issue approved");
    expect(screen.getByRole("button", { name: "Remove approval" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Remove approval" }));
    expect(screen.getByRole("status")).toHaveTextContent("Approval removed");
  });

  it("keeps Text Field distinct from Field with compact handle validation", async () => {
    const user = userEvent.setup();
    render(<ProjectTextFieldPreview />);

    const input = screen.getByRole("textbox", { name: "Handle" });
    expect(input).toHaveValue("minwook");
    expect(screen.getByRole("status")).toHaveTextContent("Handle available");

    await user.clear(input);
    await user.type(input, "ab");
    await user.tab();

    expect(screen.getByText("Use at least three lowercase characters.")).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Handle unavailable");
  });

  it("keeps textarea count synchronized with the edited value", async () => {
    const user = userEvent.setup();
    render(<DescriptionTextareaPreview />);

    const textarea = screen.getByRole("textbox", { name: "Description" });
    await user.clear(textarea);
    await user.type(textarea, "Short note");
    expect(screen.getByRole("status", { name: "Character count" })).toHaveTextContent("10/96");
  });

  it("updates checkbox guidance with the checked state", async () => {
    const user = userEvent.setup();
    render(<InteractionNotesCheckboxPreview />);

    const checkbox = screen.getByRole("checkbox", { name: "Include interaction notes" });
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(screen.getByText("Only component code will be exported.")).toBeInTheDocument();
  });

  it("searches asynchronously and always exposes a direct clear path", () => {
    vi.useFakeTimers();
    render(<ComponentSearchPreview />);

    const input = screen.getByRole("searchbox", { name: "Search" });
    fireEvent.change(input, { target: { value: "dialog" } });
    expect(input).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(420));
    expect(input).not.toHaveAttribute("aria-busy");
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");
  });

  it("changes the rich context selection and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<PlatformContextSwitcherPreview />);

    const trigger = screen.getByRole("combobox", { name: "Preview platform" });
    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: /Native/ }));
    expect(trigger).toHaveTextContent("Native");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
