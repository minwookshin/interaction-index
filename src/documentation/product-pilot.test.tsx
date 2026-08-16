import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProductPilot } from "./product-pilot";

describe("ProductPilot", () => {
  it("filters issues without replacing the product workspace", async () => {
    const user = userEvent.setup();
    render(<ProductPilot />);

    await user.type(screen.getByRole("searchbox", { name: "Search pilot issues" }), "registry");
    expect(screen.getByRole("button", { name: /Verify registry consumer/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Tune shared detail motion/ })).not.toBeInTheDocument();
    expect(screen.getByText("1 visible")).toBeInTheDocument();
  });

  it("creates a real issue through the dialog", async () => {
    const user = userEvent.setup();
    render(<ProductPilot />);

    await user.click(screen.getByRole("button", { name: "New issue" }));
    const dialog = screen.getByRole("dialog");
    await user.type(within(dialog).getByRole("textbox", { name: "Title" }), "Document product pilot");
    await user.type(within(dialog).getByRole("textbox", { name: "Description" }), "Record the real composition path.");
    await user.click(within(dialog).getByRole("button", { name: "Create issue" }));

    expect(await screen.findByRole("heading", { name: "Document product pilot" })).toBeInTheDocument();
    expect(screen.getByText("Cycle 08 · 5 issues")).toBeInTheDocument();
  }, 10_000);

  it("archives and restores the selected issue through the undo stack", async () => {
    const user = userEvent.setup();
    render(<ProductPilot />);

    await user.click(screen.getByRole("button", { name: "More issue actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Archive issue" }));
    await waitFor(() => expect(screen.queryByRole("heading", { name: "Unify keyboard focus" })).not.toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(await screen.findByRole("heading", { name: "Unify keyboard focus" })).toBeInTheDocument();
  });

  it("composes Action List, Shared Detail, and Undo Stack in one task", async () => {
    const user = userEvent.setup();
    render(<ProductPilot />);

    await user.click(screen.getByRole("button", { name: /Tune shared detail motion/ }));
    expect(screen.getByRole("heading", { name: "Tune shared detail motion" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open issue actions (Command K)" }));
    const dialog = screen.getByRole("dialog", { name: "Act on INT-198" });
    await user.click(within(dialog).getByRole("option", { name: /Archive issue/ }));
    await waitFor(() => expect(screen.getByText("Cycle 08 · 3 issues")).toBeInTheDocument());
    expect(screen.getByText("Archive via ⌘K").closest("li")).toHaveAttribute("data-complete");

    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(await screen.findByRole("heading", { name: "Tune shared detail motion" })).toBeInTheDocument();
    expect(screen.getByText("Choose Undo").closest("li")).toHaveAttribute("data-complete");
  });
});
