import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BreadcrumbPathPreview,
  DismissibleAlertPreview,
  EmptyCollectionPreview,
  ExportProgressPreview,
  FilterCollapsiblePreview,
  StableTabsPreview,
} from "./navigation-feedback-previews";

describe("navigation and feedback previews", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps breadcrumb navigation inside the specimen and offers a return path", async () => {
    const user = userEvent.setup();
    render(<BreadcrumbPathPreview />);

    await user.click(screen.getByRole("link", { name: "Projects" }));
    expect(screen.getByText("Projects")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("status")).toHaveTextContent("Current location: Projects");

    await user.click(screen.getByRole("button", { name: "Return to issue" }));
    expect(screen.getByText("UI Refresh")).toHaveAttribute("aria-current", "page");
  });

  it("switches peer tab content without unmounting the stable panel viewport", async () => {
    const user = userEvent.setup();
    const { container } = render(<StableTabsPreview />);
    const viewport = container.querySelector(".tabs-panel-viewport");

    await user.click(screen.getByRole("tab", { name: "Activity" }));
    expect(screen.getByText("Recent activity")).toBeVisible();
    expect(container.querySelector(".tabs-panel-viewport")).toBe(viewport);
  });

  it("reveals and hides optional filter detail through one disclosure trigger", async () => {
    const user = userEvent.setup();
    render(<FilterCollapsiblePreview />);

    const trigger = screen.getByRole("button", { name: "Advanced filter rules" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("State is ready")).toBeVisible();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("runs progress to completion and exposes an immediate repeat path", () => {
    vi.useFakeTimers();
    render(<ExportProgressPreview />);

    fireEvent.click(screen.getByRole("button", { name: "Run export" }));
    act(() => vi.advanceTimersByTime(1100));

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByRole("button", { name: "Run again" })).toBeEnabled();
    expect(screen.getByRole("status")).toHaveTextContent("Export complete");
  });

  it("dismisses and restores persistent alert feedback", async () => {
    const user = userEvent.setup();
    render(<DismissibleAlertPreview />);

    await user.click(screen.getByRole("button", { name: "Dismiss import confirmation" }));
    await user.click(screen.getByRole("button", { name: "Restore alert" }));
    expect(screen.getByText("Import complete")).toBeInTheDocument();
  });

  it("turns the empty-state action into a visible collection result and can reset", async () => {
    const user = userEvent.setup();
    render(<EmptyCollectionPreview />);

    await user.click(screen.getByRole("button", { name: "Add component" }));
    expect(screen.getByText("Added to the collection")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByText("No components yet")).toBeInTheDocument();
  });
});
