import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ConversionRetentionRecipe, ProductUsageRecipe, SaaSOverviewRecipe } from "./analytics-recipes";

describe("Teum Analytics recipes", () => {
  it("keeps the SaaS range, metric, chart, and detail action on one period", async () => {
    const user = userEvent.setup();
    render(<SaaSOverviewRecipe />);
    expect(screen.getByRole("region", { name: "SaaS Overview recipe" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Recurring revenue. 12 data points." })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "6M" }));
    expect(screen.getByRole("group", { name: "Recurring revenue. 6 data points." })).toBeInTheDocument();
    const plot = screen.getByRole("group", { name: "Recurring revenue. 6 data points." });
    plot.focus();
    await user.keyboard("{End}{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Aug revenue opened.");
  });

  it("synchronizes two usage charts from either keyboard inspection or a release", async () => {
    const user = userEvent.setup();
    render(<ProductUsageRecipe />);
    const plots = [
      screen.getByRole("group", { name: "Active usage. 14 data points." }),
      screen.getByRole("group", { name: "Feature events. 14 data points." }),
    ];
    plots[0].focus();
    await user.keyboard("{Home}");
    expect(screen.getByText("Aug 3", { selector: ".teum-analytics-recipe__header small" })).toBeInTheDocument();
    const liveRegions = document.querySelectorAll(".teum-chart > .teum-sr-only[aria-live='polite']");
    expect(liveRegions).toHaveLength(2);
    expect(liveRegions[0]).toHaveTextContent("Aug 3. Daily active users");
    expect(liveRegions[1]).toHaveTextContent("Aug 3. Automations");

    await user.click(screen.getByRole("button", { name: /Search latency incident/ }));
    expect(screen.getByText("Aug 15", { selector: ".teum-analytics-recipe__header small" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Search latency incident/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("uses the selected funnel stage for the trend and supporting records", async () => {
    const user = userEvent.setup();
    render(<ConversionRetentionRecipe />);
    const region = screen.getByRole("region", { name: "Conversion and Retention recipe" });
    expect(within(region).getByRole("table", { name: "Activated accounts" })).toBeInTheDocument();

    await user.click(within(region).getByRole("button", { name: /Became paid/ }));
    expect(within(region).getByRole("group", { name: "Became paid trend. 12 data points." })).toBeInTheDocument();
    const table = within(region).getByRole("table", { name: "Became paid accounts" });
    expect(within(table).getAllByRole("row").length).toBeGreaterThan(1);
  });
});
