import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Breakdown,
  Chart,
  Cohort,
  Comparison,
  DonutChart,
  Funnel,
  Goal,
  Heatmap,
  Metric,
  Sparkline,
  Timeline,
  type AnalyticsDatum,
  type AnalyticsSeries,
} from ".";

const data: readonly AnalyticsDatum[] = [
  { id: "jan", label: "Jan", values: { current: 10, previous: 8 } },
  { id: "feb", label: "Feb", values: { current: 14, previous: 11 } },
  { id: "mar", label: "Mar", values: { current: 18, previous: 12 } },
];

const series: readonly AnalyticsSeries[] = [
  { id: "current", label: "Current", tone: "primary" },
  { id: "previous", label: "Previous", tone: "secondary", lineStyle: "dashed" },
];

describe("whatiuse Analytics components", () => {
  it("shares one keyboard inspection state with its live text and drill-down", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    const { container } = render(<Chart title="Revenue" data={data} series={series} onDatumActivate={onActivate} />);

    const plot = screen.getByRole("group", { name: "Revenue. 3 data points." });
    plot.focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("Feb. Current 14, Previous 11.")).toBeInTheDocument();
    expect(container.querySelector(".whatiuse-analytics-inspection")).toHaveTextContent("FebCurrent14Previous11");
    expect(container.querySelector(".whatiuse-chart__tooltip")).not.toBeInTheDocument();
    await user.keyboard("{Home}");
    expect(screen.getByText("Jan. Current 10, Previous 8.")).toBeInTheDocument();
    await user.keyboard("{End}{Enter}");
    expect(onActivate).toHaveBeenCalledWith(data[2], 2);
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Mar. Current 18, Previous 12.")).not.toBeInTheDocument();
  });

  it("keeps an accessible table present and prevents hiding the final series", async () => {
    const user = userEvent.setup();
    render(<Chart title="Revenue" data={data} series={series} />);
    const table = screen.getByRole("table", { name: "Revenue data" });
    expect(table.parentElement).toHaveClass("whatiuse-chart__table--visually-hidden");
    await user.click(screen.getByRole("button", { name: "View data" }));
    expect(table.parentElement).not.toHaveClass("whatiuse-chart__table--visually-hidden");
    expect(within(table).getByRole("rowheader", { name: "Mar" })).toBeInTheDocument();

    const current = screen.getByRole("button", { name: "Current" });
    const previous = screen.getByRole("button", { name: "Previous" });
    await user.click(previous);
    expect(previous).toHaveAttribute("aria-pressed", "false");
    expect(current).toHaveAttribute("aria-disabled", "true");
    await user.click(current);
    expect(current).toHaveAttribute("aria-pressed", "true");
  });

  it("coalesces repeated pointer inspection into one frame and cancels stale work on leave", () => {
    const onActiveIndexChange = vi.fn();
    const frames = new Map<number, FrameRequestCallback>();
    let nextFrame = 0;
    const requestFrame = vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      nextFrame += 1;
      frames.set(nextFrame, callback);
      return nextFrame;
    });
    const cancelFrame = vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
      frames.delete(id);
    });
    render(<Chart title="Revenue" data={data} series={series} onActiveIndexChange={onActiveIndexChange} />);

    const plot = screen.getByRole("group", { name: "Revenue. 3 data points." });
    vi.spyOn(plot, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 640,
      bottom: 264,
      left: 0,
      width: 640,
      height: 264,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(plot, { clientX: 120 });
    fireEvent.pointerMove(plot, { clientX: 120 });
    expect(requestFrame).toHaveBeenCalledTimes(1);
    expect(onActiveIndexChange).not.toHaveBeenCalled();

    act(() => frames.get(1)?.(16));
    expect(onActiveIndexChange).toHaveBeenCalledTimes(1);
    expect(onActiveIndexChange).toHaveBeenLastCalledWith(0);

    fireEvent.pointerMove(plot, { clientX: 520 });
    expect(requestFrame).toHaveBeenCalledTimes(2);
    fireEvent.pointerLeave(plot);
    expect(cancelFrame).toHaveBeenCalledWith(2);
    expect(onActiveIndexChange).toHaveBeenLastCalledWith(null);

    requestFrame.mockRestore();
    cancelFrame.mockRestore();
  });

  it("renders explicit loading and empty contracts", () => {
    const { rerender } = render(<Chart title="Revenue" data={data} series={series} loading />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading chart");
    expect(screen.getByRole("group", { name: "Revenue. 3 data points." })).toHaveAttribute("tabindex", "-1");

    rerender(<Chart title="Revenue" data={[]} series={series} empty="No revenue yet." />);
    expect(screen.getByText("No revenue yet.")).toBeInTheDocument();
  });

  it("renders grouped and stacked bars with an explicit error state", () => {
    const { container, rerender } = render(<Chart title="Revenue" data={data} series={series} type="bar" />);
    expect(container.querySelectorAll(".whatiuse-chart__bars rect")).toHaveLength(6);
    rerender(<Chart title="Revenue" data={data} series={series} type="stacked-bar" />);
    expect(container.querySelectorAll(".whatiuse-chart__bars rect")).toHaveLength(6);
    rerender(<Chart title="Revenue" data={data} series={series} error="Revenue could not be loaded." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Revenue could not be loaded.");
  });

  it("shares donut pointer and keyboard selection with visible values and a table", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(<DonutChart title="Plan mix" data={[
      { id: "team", label: "Team", value: 60 },
      { id: "business", label: "Business", value: 30 },
      { id: "enterprise", label: "Enterprise", value: 10 },
    ]} onDatumActivate={onActivate} />);

    const plot = screen.getByRole("group", { name: "Plan mix. 3 segments." });
    plot.focus();
    await user.keyboard("{ArrowRight}{Enter}");
    expect(screen.getByText("Business. 30. 30.0 percent.")).toBeInTheDocument();
    expect(onActivate).toHaveBeenCalledWith(expect.objectContaining({ id: "business" }));
    await user.click(screen.getByRole("button", { name: "View data" }));
    expect(screen.getByRole("table", { name: "Plan mix data" })).toBeVisible();
  });

  it("moves through a semantic heatmap in two dimensions", async () => {
    const user = userEvent.setup();
    render(<Heatmap title="Feature activity" columns={["Mon", "Tue"]} rows={[
      { id: "create", label: "Create", values: [12, 18] },
      { id: "share", label: "Share", values: [8, null] },
    ]} />);

    const first = screen.getByRole("button", { name: "Create, Mon, 12" });
    first.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Create, Tue, 18" })).toHaveAttribute("aria-pressed", "true");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Share, Tue, no data" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("region", { name: "Feature activity" })).toHaveTextContent("Share, TueNo data");
  });

  it("reconciles an uncontrolled legend when the recipe replaces its series", () => {
    const activatedSeries: readonly AnalyticsSeries[] = [{ id: "activated", label: "Activated" }];
    const paidSeries: readonly AnalyticsSeries[] = [{ id: "paid", label: "Became paid" }];
    const changingData: readonly AnalyticsDatum[] = [
      { id: "w1", label: "W1", values: { activated: 42, paid: 12 } },
      { id: "w2", label: "W2", values: { activated: 48, paid: 16 } },
    ];
    const { rerender } = render(<Chart title="Stage trend" data={changingData} series={activatedSeries} />);

    rerender(<Chart title="Stage trend" data={changingData} series={paidSeries} />);

    expect(screen.queryByText("No data for this range.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Became paid" })).toHaveAttribute("aria-pressed", "true");
    expect(within(screen.getByRole("table", { name: "Stage trend data" })).getByRole("columnheader", { name: "Became paid" })).toBeInTheDocument();
  });

  it("keeps compact metrics, trends, comparisons, goals, and sparklines textual", () => {
    render(<>
      <Metric label="MRR" value="$18k" trend={{ value: "+8%", label: "this month", direction: "up", sentiment: "positive" }} />
      <Metric label="Loading MRR" value="$0" loading />
      <Comparison label="MRR comparison" current={15} previous={10} formatter={(value) => `$${value}`} positiveDirection="up" />
      <Goal label="Revenue target" value={75} target={100} />
      <Sparkline values={[1, 3, 2]} label="Three-month MRR trend" />
      <Sparkline values={[1, null, 2]} decorative />
    </>);

    expect(screen.getByRole("group", { name: "MRR" })).toHaveTextContent("$18k+8%this month");
    expect(screen.getByRole("group", { name: "Loading MRR" })).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText("MRR comparison")).toHaveTextContent("50.0%");
    expect(screen.getByRole("progressbar", { name: "Revenue target" })).toHaveAttribute("aria-valuetext", "75 of 100");
    expect(screen.getByRole("img", { name: "Three-month MRR trend" })).toBeInTheDocument();
    expect(document.querySelectorAll(".whatiuse-sparkline[aria-hidden='true']")).toHaveLength(1);
  });

  it("uses native pressed controls when a recipe makes lists selectable", async () => {
    const user = userEvent.setup();

    function Harness() {
      const [selected, setSelected] = useState("alpha");
      return <>
        <Breakdown label="Plan mix" selectedId={selected} onSelect={(item) => setSelected(item.id)} items={[{ id: "alpha", label: "Alpha", value: 80 }, { id: "beta", label: "Beta", value: 20 }]} />
        <Funnel label="Signup funnel" selectedId={selected} onSelect={(item) => setSelected(item.id)} stages={[{ id: "alpha", label: "Visited", value: 100 }, { id: "beta", label: "Paid", value: 40 }]} />
        <Timeline label="Release timeline" activeId={selected} onSelect={(item) => setSelected(item.id)} items={[{ id: "alpha", label: "Alpha release", timestamp: "Aug 1" }, { id: "beta", label: "Beta release", timestamp: "Aug 8" }]} />
      </>;
    }

    render(<Harness />);
    await user.click(screen.getByRole("button", { name: /Beta20/ }));
    expect(screen.getByRole("button", { name: /Paid40/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Beta releaseAug 8/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps cohort strength redundant with semantic headers and text", () => {
    render(<Cohort label="Weekly retention" periods={["W0", "W1"]} rows={[{ id: "aug", label: "Aug 1", size: 120, values: [1, null] }]} />);
    const table = screen.getByRole("table", { name: "Weekly retention" });
    expect(within(table).getByRole("columnheader", { name: "W1" })).toBeInTheDocument();
    expect(within(table).getByRole("rowheader", { name: "Aug 1" })).toBeInTheDocument();
    expect(within(table).getByLabelText("Aug 1, W0, 100%")).toHaveTextContent("100%");
    expect(within(table).getByLabelText("Aug 1, W1, no data")).toHaveTextContent("—");
  });
});
