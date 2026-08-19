import { describe, expect, it } from "vitest";
import { whatiuseMotionContract } from "./motion-contract";
import { issuesWorkspaceContract, whatiuseDataComponentContracts } from "./whatiuse-data-contract";
import {
  whatiuseAnalyticsComponentContracts,
  whatiuseAnalyticsRecipeContracts,
  whatiuseAnalyticsStateContract,
} from "./whatiuse-analytics-contract";
import {
  whatiuseProductPatternContracts,
  whatiuseProductPatternSystemContract,
} from "./whatiuse-product-patterns-contract";

describe("Motion Contract v1", () => {
  it("keeps routine motion responsive and repeated work instant", () => {
    expect(Math.max(...Object.values(whatiuseMotionContract.durationMs))).toBeLessThanOrEqual(
      whatiuseMotionContract.constraints.maxRoutineDurationMs,
    );
    expect(whatiuseMotionContract.frequency.constant.treatment).toBe("instant");
    expect(whatiuseMotionContract.constraints.minimumEntryScale).toBeGreaterThanOrEqual(0.95);
    expect(whatiuseMotionContract.constraints.forbiddenPatterns).toContain("transition: all");
    expect(whatiuseMotionContract.constraints.forbiddenPatterns).toContain("ease-in for interface feedback");
  });

  it("keeps reduced motion and interruption explicit", () => {
    expect(whatiuseMotionContract.principles).toContain("Let interrupted transitions retarget instead of restarting.");
    expect(whatiuseMotionContract.principles).toContain("Remove spatial travel when reduced motion is requested.");
  });
});

describe("whatiuse Data contracts", () => {
  it("defines the public product primitives", () => {
    expect(whatiuseDataComponentContracts.map(({ id }) => id)).toEqual([
      "data-table",
      "filter-builder",
      "data-toolbar",
      "saved-view-menu",
      "column-visibility-menu",
      "facet-filter",
      "data-sort-menu",
      "data-group-menu",
      "data-density-control",
      "data-result-summary",
      "bulk-action-bar",
      "row-actions-menu",
      "cursor-pagination",
      "date-range-filter",
      "data-export-menu",
      "property-list",
      "audit-log",
      "data-state",
    ]);
    for (const contract of whatiuseDataComponentContracts) {
      expect(contract.intent).not.toBe("");
      expect(contract.requires.length).toBeGreaterThan(0);
      expect(contract.accessibility.length).toBeGreaterThan(0);
    }
  });

  it("keeps every Issues Workspace surface on one state model", () => {
    expect(issuesWorkspaceContract.components).toEqual(expect.arrayContaining([
      "DataToolbar",
      "DataTable",
      "SharedDetail",
      "UndoStack",
    ]));
    expect(issuesWorkspaceContract.invariants).toContain(
      "Search, filters, table, details, and actions share one source of truth.",
    );
    expect(issuesWorkspaceContract.invariants).toContain("Selection never changes table geometry.");
  });
});

describe("whatiuse Analytics contracts", () => {
  it("defines seventeen bounded product primitives without pretending a chart engine is a product API", () => {
    expect(whatiuseAnalyticsComponentContracts.map(({ id }) => id)).toEqual([
      "metric",
      "sparkline",
      "chart",
      "histogram",
      "scatter-chart",
      "waterfall-chart",
      "donut-chart",
      "radar-chart",
      "gauge",
      "sankey-chart",
      "heatmap",
      "comparison",
      "breakdown",
      "goal",
      "funnel",
      "cohort",
      "timeline",
    ]);
    for (const contract of whatiuseAnalyticsComponentContracts) {
      expect(contract.useWhen.length).toBeGreaterThan(0);
      expect(contract.avoidWhen.length).toBeGreaterThan(0);
      expect(contract.accessibility.length).toBeGreaterThan(0);
    }
  });

  it("keeps visual, interactive, and textual analytic evidence on one state contract", () => {
    expect(whatiuseAnalyticsStateContract.rules).toContain(
      "Every visual encoding has a textual value, label, or semantic table equivalent.",
    );
    expect(whatiuseAnalyticsStateContract.rules).toContain(
      "Recipes own URL and server state; visual primitives remain transport-agnostic.",
    );
    expect(whatiuseAnalyticsRecipeContracts.map(({ id }) => id)).toEqual([
      "saas-overview",
      "product-usage",
      "conversion-retention",
    ]);
    expect(whatiuseAnalyticsRecipeContracts.find(({ id }) => id === "product-usage")?.invariants).toContain(
      "Only explicit feature and stage selection cross-filter records.",
    );
  });
});

describe("whatiuse Product Pattern contracts", () => {
  it("defines the three B2B tasks without adding another primitive layer", () => {
    expect(whatiuseProductPatternContracts.map(({ id }) => id)).toEqual([
      "customer-workspace",
      "billing-usage",
      "members-permissions",
    ]);
    for (const contract of whatiuseProductPatternContracts) {
      expect(contract.taskSequence.length).toBeGreaterThanOrEqual(5);
      expect(contract.components.length).toBeGreaterThanOrEqual(8);
      expect(contract.failureStates.length).toBeGreaterThan(0);
      expect(contract.accessibility.length).toBeGreaterThan(0);
    }
  });

  it("keeps product state outside visual primitives and requires a recovery path", () => {
    expect(whatiuseProductPatternSystemContract.rules).toContain(
      "Patterns compose public whatiuse components and keep product state outside visual primitives.",
    );
    expect(whatiuseProductPatternSystemContract.rules).toContain(
      "Destructive or costly work always exposes a review, cancellation, or recovery path.",
    );
  });
});
