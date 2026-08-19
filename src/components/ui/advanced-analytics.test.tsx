import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Gauge, Histogram, RadarChart, SankeyChart, ScatterChart, WaterfallChart } from ".";

describe("advanced whatiuse Analytics", () => {
  it("keeps histogram pointer, keyboard, activation, and table evidence on one bin", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    const onActiveIndexChange = vi.fn();
    const frames = new Map<number, FrameRequestCallback>();
    let nextFrame = 0;
    const requestFrame = vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      nextFrame += 1;
      frames.set(nextFrame, callback);
      return nextFrame;
    });
    render(<Histogram title="Response time" data={[
      { id: "fast", label: "0–50 ms", start: 0, end: 50, value: 18 },
      { id: "steady", label: "50–100 ms", start: 50, end: 100, value: 42 },
    ]} onBinActivate={onActivate} onActiveIndexChange={onActiveIndexChange} />);

    const plot = screen.getByRole("group", { name: "Response time. 2 bins." });
    vi.spyOn(plot, "getBoundingClientRect").mockReturnValue({ x: 0, y: 0, top: 0, right: 640, bottom: 240, left: 0, width: 640, height: 240, toJSON: () => ({}) });
    fireEvent.pointerMove(plot, { clientX: 500 });
    expect(onActiveIndexChange).not.toHaveBeenCalled();
    act(() => frames.get(1)?.(16));
    expect(onActiveIndexChange).toHaveBeenLastCalledWith(1);

    plot.focus();
    await user.keyboard("{Home}{Enter}");
    expect(onActivate).toHaveBeenCalledWith(expect.objectContaining({ id: "fast" }), 0);
    await user.click(screen.getByRole("button", { name: "View data" }));
    const table = screen.getByRole("table", { name: "Response time data" });
    expect(within(table).getByRole("rowheader", { name: "0–50 ms" })).toBeInTheDocument();
    requestFrame.mockRestore();
  });

  it("inspects scatter points by keyboard and preserves exact x and y data", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(<ScatterChart title="Account health" xLabel="Seats" yLabel="Actions" data={[
      { id: "northstar", label: "Northstar", x: 24, y: 182 },
      { id: "relay", label: "Relay", x: 42, y: 248, series: "Business" },
    ]} onPointActivate={onActivate} />);
    const plot = screen.getByRole("group", { name: "Account health. 2 points." });
    plot.focus();
    await user.keyboard("{ArrowRight}{Enter}");
    expect(screen.getByText("Northstar. Seats 24. Actions 182.")).toBeInTheDocument();
    expect(onActivate).toHaveBeenCalledWith(expect.objectContaining({ id: "northstar" }), 0);
    expect(within(screen.getByRole("table", { name: "Account health data" })).getByRole("columnheader", { name: "Series" })).toBeInTheDocument();
  });

  it("computes a waterfall running total and exposes signed changes without color", async () => {
    const user = userEvent.setup();
    render(<WaterfallChart title="Revenue bridge" data={[
      { id: "open", label: "Open", value: 82, kind: "total" },
      { id: "new", label: "New", value: 19 },
      { id: "churn", label: "Churn", value: -3 },
      { id: "close", label: "Close", value: 98, kind: "total" },
    ]} />);
    const table = screen.getByRole("table", { name: "Revenue bridge data" });
    expect(within(table).getByRole("rowheader", { name: "Churn" }).parentElement).toHaveTextContent("Churnchange-398");
    const plot = screen.getByRole("group", { name: "Revenue bridge. 4 steps." });
    plot.focus();
    await user.keyboard("{End}");
    expect(screen.getByText("Close. total. 98. Running total 98.")).toBeInTheDocument();
  });

  it("normalizes radar axes while announcing every active dimension value", async () => {
    const user = userEvent.setup();
    const { container } = render(<RadarChart title="Plan comparison" axes={[
      { id: "automation", label: "Automation", max: 100 },
      { id: "governance", label: "Governance", max: 100 },
      { id: "support", label: "Support", max: 100 },
    ]} series={[
      { id: "team", label: "Team", values: { automation: 72, governance: 48, support: 54 } },
      { id: "business", label: "Business", values: { automation: 88, governance: 84, support: 76 } },
    ]} />);
    const plot = screen.getByRole("group", { name: "Plan comparison. 3 axes and 2 series." });
    plot.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Automation. Team 72. Business 88.")).toBeInTheDocument();
    expect(container.querySelector(".whatiuse-analytics-frame__inspection")).toHaveTextContent("AutomationTeam72Business88");
    expect(container.querySelector(".whatiuse-radar-chart__tooltip")).not.toBeInTheDocument();
    const table = screen.getByRole("table", { name: "Plan comparison data" });
    expect(within(table).getByRole("columnheader", { name: "Business" })).toBeInTheDocument();
  });

  it("uses a real meter contract for a static gauge", () => {
    render(<Gauge title="Workspace capacity" value={68} max={100} label="Used" marker={{ value: 80, label: "Review" }} />);
    const meter = screen.getByRole("meter", { name: "Used" });
    expect(meter).toHaveAttribute("aria-valuenow", "68");
    expect(meter).toHaveAttribute("aria-valuetext", "68 of 100");
    const table = screen.getByRole("table", { name: "Workspace capacity data" });
    expect(within(table).getByRole("rowheader", { name: "Review" }).parentElement).toHaveTextContent("80");
  });

  it("keeps Sankey flow order, keyboard inspection, and source rows aligned", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    const { container } = render(<SankeyChart title="Signup flow" nodes={[
      { id: "visit", label: "Visited", column: 0 },
      { id: "start", label: "Started", column: 1 },
      { id: "activate", label: "Activated", column: 2 },
    ]} links={[
      { id: "visit-start", source: "visit", target: "start", value: 2164 },
      { id: "start-activate", source: "start", target: "activate", value: 1288 },
    ]} onLinkActivate={onActivate} />);
    const plot = screen.getByRole("group", { name: "Signup flow. 3 nodes and 2 flows." });
    plot.focus();
    await user.keyboard("{ArrowRight}{Enter}");
    expect(screen.getByText("Visited to Started. 2,164.")).toBeInTheDocument();
    expect(container.querySelector(".whatiuse-analytics-frame__inspection")).toHaveTextContent("Visited to StartedVolume2,164");
    expect(container.querySelector(".whatiuse-sankey-chart__tooltip")).not.toBeInTheDocument();
    expect(onActivate).toHaveBeenCalledWith(expect.objectContaining({ id: "visit-start" }), 0);
    expect(within(screen.getByRole("table", { name: "Signup flow data" })).getByRole("rowheader", { name: "Started to Activated" })).toBeInTheDocument();
  });
});
