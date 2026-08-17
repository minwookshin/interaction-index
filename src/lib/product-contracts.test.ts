import { describe, expect, it } from "vitest";
import { teumMotionContract } from "./motion-contract";
import { issuesWorkspaceContract, teumDataComponentContracts } from "./teum-data-contract";
import {
  teumAnalyticsComponentContracts,
  teumAnalyticsRecipeContracts,
  teumAnalyticsStateContract,
} from "./teum-analytics-contract";
import {
  teumProductPatternContracts,
  teumProductPatternSystemContract,
} from "./teum-product-patterns-contract";

describe("Motion Contract v1", () => {
  it("keeps routine motion responsive and repeated work instant", () => {
    expect(Math.max(...Object.values(teumMotionContract.durationMs))).toBeLessThanOrEqual(
      teumMotionContract.constraints.maxRoutineDurationMs,
    );
    expect(teumMotionContract.frequency.constant.treatment).toBe("instant");
    expect(teumMotionContract.constraints.minimumEntryScale).toBeGreaterThanOrEqual(0.95);
    expect(teumMotionContract.constraints.forbiddenPatterns).toContain("transition: all");
    expect(teumMotionContract.constraints.forbiddenPatterns).toContain("ease-in for interface feedback");
  });

  it("keeps reduced motion and interruption explicit", () => {
    expect(teumMotionContract.principles).toContain("Let interrupted transitions retarget instead of restarting.");
    expect(teumMotionContract.principles).toContain("Remove spatial travel when reduced motion is requested.");
  });
});

describe("Teum Data contracts", () => {
  it("defines the six public product primitives", () => {
    expect(teumDataComponentContracts.map(({ id }) => id)).toEqual([
      "data-table",
      "filter-builder",
      "data-toolbar",
      "bulk-action-bar",
      "date-range-filter",
      "data-export-menu",
    ]);
    for (const contract of teumDataComponentContracts) {
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

describe("Teum Analytics contracts", () => {
  it("defines nine bounded product primitives without pretending a chart engine is a product API", () => {
    expect(teumAnalyticsComponentContracts.map(({ id }) => id)).toEqual([
      "metric",
      "sparkline",
      "chart",
      "comparison",
      "breakdown",
      "goal",
      "funnel",
      "cohort",
      "timeline",
    ]);
    for (const contract of teumAnalyticsComponentContracts) {
      expect(contract.useWhen.length).toBeGreaterThan(0);
      expect(contract.avoidWhen.length).toBeGreaterThan(0);
      expect(contract.accessibility.length).toBeGreaterThan(0);
    }
  });

  it("keeps visual, interactive, and textual analytic evidence on one state contract", () => {
    expect(teumAnalyticsStateContract.rules).toContain(
      "Every visual encoding has a textual value, label, or semantic table equivalent.",
    );
    expect(teumAnalyticsStateContract.rules).toContain(
      "Recipes own URL and server state; visual primitives remain transport-agnostic.",
    );
    expect(teumAnalyticsRecipeContracts.map(({ id }) => id)).toEqual([
      "saas-overview",
      "product-usage",
      "conversion-retention",
    ]);
    expect(teumAnalyticsRecipeContracts.find(({ id }) => id === "product-usage")?.invariants).toContain(
      "Two charts share one active index.",
    );
  });
});

describe("Teum Product Pattern contracts", () => {
  it("defines the three B2B tasks without adding another primitive layer", () => {
    expect(teumProductPatternContracts.map(({ id }) => id)).toEqual([
      "customer-workspace",
      "billing-usage",
      "members-permissions",
    ]);
    for (const contract of teumProductPatternContracts) {
      expect(contract.taskSequence.length).toBeGreaterThanOrEqual(5);
      expect(contract.components.length).toBeGreaterThanOrEqual(8);
      expect(contract.failureStates.length).toBeGreaterThan(0);
      expect(contract.accessibility.length).toBeGreaterThan(0);
    }
  });

  it("keeps product state outside visual primitives and requires a recovery path", () => {
    expect(teumProductPatternSystemContract.rules).toContain(
      "Patterns compose public Teum components and keep product state outside visual primitives.",
    );
    expect(teumProductPatternSystemContract.rules).toContain(
      "Destructive or costly work always exposes a review, cancellation, or recovery path.",
    );
  });
});
