import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AsyncActionButton } from "./async-action-button";

describe("AsyncActionButton", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a catalog demo to idle after showing completion", () => {
    vi.useFakeTimers();
    render(<AsyncActionButton autoResetMs={1400} />);

    fireEvent.click(screen.getByRole("button", { name: "Create issue" }));
    expect(screen.getByRole("button", { name: "Create issue" })).toHaveAttribute("aria-busy", "true");

    act(() => vi.advanceTimersByTime(920));
    const button = screen.getByRole("button", { name: "Create issue" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(within(button).getByText("Created")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1400));
    expect(screen.getByRole("button", { name: "Create issue" })).toBeEnabled();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("replays the full interaction when the replay key changes", () => {
    vi.useFakeTimers();
    const { rerender } = render(<AsyncActionButton replayKey={0} />);

    fireEvent.click(screen.getByRole("button", { name: "Create issue" }));
    act(() => vi.advanceTimersByTime(920));
    expect(within(screen.getByRole("button", { name: "Create issue" })).getByText("Created")).toBeInTheDocument();

    rerender(<AsyncActionButton replayKey={1} />);
    expect(screen.getByRole("button", { name: "Create issue" })).toHaveAttribute("aria-busy", "true");
    act(() => vi.advanceTimersByTime(920));
    expect(within(screen.getByRole("button", { name: "Create issue" })).getByText("Created")).toBeInTheDocument();
  });

  it("keeps keyboard replay on the direct motion path", () => {
    vi.useFakeTimers();
    const { rerender } = render(<AsyncActionButton replayKey={0} />);

    rerender(<AsyncActionButton replayActivation="keyboard" replayKey={1} />);

    expect(screen.getByRole("button", { name: "Create issue" }).closest(".whatiuse-async-action")).toHaveAttribute("data-activation", "keyboard");
  });

  it("keeps width stable by default and exposes morphing as an explicit option", () => {
    const { rerender } = render(<AsyncActionButton />);
    const root = screen.getByRole("button", { name: "Create issue" }).closest(".whatiuse-async-action");

    expect(root).toHaveAttribute("data-width-behavior", "stable");
    expect(root?.querySelector(".whatiuse-async-action__sizer")).toBeInTheDocument();
    expect(root?.querySelectorAll(".whatiuse-async-action__sizer-button")).toHaveLength(3);

    rerender(<AsyncActionButton widthBehavior="morph" />);
    expect(root).toHaveAttribute("data-width-behavior", "morph");
    expect(root?.querySelector(".whatiuse-async-action__sizer")).not.toBeInTheDocument();
  });
});
