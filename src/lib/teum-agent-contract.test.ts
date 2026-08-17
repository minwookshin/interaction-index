import { describe, expect, it } from "vitest";
import { teumAnalyticsRecipeContracts } from "./teum-analytics-contract";
import { teumDataRecipeContracts } from "./teum-data-contract";
import {
  selectTeumRecipe,
  teumAgentForbiddenRules,
  teumAgentRecipeContracts,
  teumAgentSelectionRules,
} from "./teum-agent-contract";
import { teumProductPatternContracts } from "./teum-product-patterns-contract";

const sourceRecipes = [
  ...teumDataRecipeContracts.map((recipe) => ({ id: recipe.id, components: recipe.components })),
  ...teumAnalyticsRecipeContracts.map((recipe) => ({ id: recipe.id, components: recipe.components })),
  ...teumProductPatternContracts.map((recipe) => ({ id: recipe.id, components: recipe.components })),
];

describe("Teum agent contract", () => {
  it("keeps every authored recipe in the agent catalog without changing its component vocabulary", () => {
    expect(teumAgentRecipeContracts.map((recipe) => recipe.id).sort()).toEqual(sourceRecipes.map((recipe) => recipe.id).sort());
    for (const source of sourceRecipes) {
      const agentRecipe = teumAgentRecipeContracts.find((recipe) => recipe.id === source.id);
      expect(agentRecipe, source.id).toBeDefined();
      expect(new Set(agentRecipe?.components)).toEqual(new Set(source.components));
    }
  });

  it("selects each recipe from a representative product task", () => {
    const tasks = [
      ["Triage the issue backlog and let operators bulk close with undo", "issues-workspace"],
      ["Create a server customer list with a saved customer view and export", "customer-directory"],
      ["Build a compliance audit log for immutable events", "audit-log"],
      ["Show MRR, expansion revenue, and the current revenue target", "saas-overview"],
      ["Compare feature adoption with each release event", "product-usage"],
      ["Connect the activation funnel to cohort retention", "conversion-retention"],
      ["Give customer success an account follow-up workspace", "customer-workspace"],
      ["Show billing usage, plan limits, and invoices", "billing-usage"],
      ["Invite a member and review role permissions", "members-permissions"],
    ] as const;
    for (const [task, expected] of tasks) expect(selectTeumRecipe(task)?.recipe.id, task).toBe(expected);
  });

  it("does not guess when no authored recipe has an explicit signal", () => {
    expect(selectTeumRecipe("Build a generic marketing landing page")).toBeNull();
  });

  it("publishes explicit choice and rejection boundaries", () => {
    expect(teumAgentSelectionRules.length).toBeGreaterThanOrEqual(12);
    expect(teumAgentForbiddenRules.length).toBeGreaterThanOrEqual(12);
    for (const rule of teumAgentSelectionRules) {
      expect(rule.when.length).toBeGreaterThan(0);
      expect(rule.rejectWhen.length).toBeGreaterThan(0);
      expect(rule.insteadOf.length).toBeGreaterThan(0);
    }
  });
});
