import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AnalyticsRendererGallery, ConversionRetentionRecipe, ProductUsageRecipe, SaaSOverviewRecipe } from "./analytics-recipes";

describe("whatiuse Analytics recipes", () => {
  it("keeps every renderer in one shared visual and semantic contract", () => {
    const { container } = render(<AnalyticsRendererGallery />);
    expect(screen.getByRole("region", { name: "Analytics renderer family" })).toBeInTheDocument();
    expect(container.querySelector('[data-chart-type="area"]')).toBeInTheDocument();
    expect(container.querySelector('[data-chart-type="stacked-bar"]')).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Plan mix. 4 segments." })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Feature activity data" })).toBeInTheDocument();
  });

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

  it("keeps chart inspection local and cross-filters only from explicit product choices", async () => {
    const user = userEvent.setup();
    render(<ProductUsageRecipe />);
    const region = screen.getByRole("region", { name: "Usage and Adoption Explorer" });
    expect(within(region).getByRole("toolbar", { name: "Usage filters" })).toBeInTheDocument();
    const plot = within(region).getByRole("group", { name: "Active usage. 14 data points." });
    const liveRegions = document.querySelectorAll(".whatiuse-chart > .whatiuse-sr-only[aria-live='polite']");
    expect(liveRegions).toHaveLength(1);
    expect(liveRegions[0]).toHaveTextContent("");

    plot.focus();
    await user.keyboard("{Home}");
    expect(liveRegions[0]).toHaveTextContent("Aug 3. Daily active users");

    await user.click(within(region).getByRole("button", { name: /Automations/ }));
    const resultSummary = within(region).getByRole("status");
    expect(resultSummary).toHaveTextContent(/5\s*accounts/);
    expect(resultSummary).toHaveTextContent(/of\s*12/);
    expect(resultSummary).toHaveTextContent("Automations");

    await user.click(within(region).getByRole("button", { name: /Became paid/ }));
    expect(resultSummary).toHaveTextContent(/2\s*accounts/);
    expect(resultSummary).toHaveTextContent(/Automations\s*·\s*Became paid/);

    within(region).getByRole("row", { name: /Juniper Enterprise Active/ }).focus();
    await user.keyboard("{Enter}");
    expect(within(region).getByRole("complementary", { name: "Juniper details" })).toBeInTheDocument();

    await user.type(within(region).getByRole("searchbox", { name: "Search accounts" }), "Northstar");
    const accountTable = within(region).getByRole("table", { name: "Usage accounts" });
    expect(within(accountTable).getAllByRole("row")).toHaveLength(2);
    expect(within(region).getByRole("complementary", { name: "Northstar details" })).toBeInTheDocument();
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
