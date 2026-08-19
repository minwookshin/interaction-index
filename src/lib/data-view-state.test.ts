import { describe, expect, it } from "vitest";
import {
  createDataViewState,
  getDataRequestKey,
  mergeDataViewSearch,
  parseDataViewState,
  parseSavedViews,
  patchDataViewState,
  serializeDataViewState,
  serializeSavedViews,
  type DataSavedView,
} from "./data-view-state";

describe("Data view state", () => {
  it("round-trips the complete adopter-owned state through a readable URL boundary", () => {
    const state = createDataViewState({
      query: "renewal",
      filters: [{ id: "status:is", fieldId: "status", operator: "is", value: "active" }],
      sorting: [{ id: "revenue", direction: "desc" }],
      pagination: { page: 3, pageSize: 50 },
      columnVisibility: { owner: false },
      columnSizing: { customer: 280 },
      columnPinning: { start: ["customer"], end: ["actions"] },
      dateRange: { from: "2026-07-01", to: "2026-07-31" },
      viewId: "renewals",
    });

    const serialized = serializeDataViewState(state);
    expect(serialized).toContain("whatiuse-q=renewal");
    expect(parseDataViewState(serialized)).toEqual(state);
    expect(mergeDataViewSearch("utm_source=docs&legacy=1", state)).toContain("utm_source=docs");
    expect(getDataRequestKey(state)).not.toContain("columnSizing");
  });

  it("resets pagination for query changes but preserves it for display changes", () => {
    const current = createDataViewState({ pagination: { page: 7, pageSize: 25 } });
    expect(patchDataViewState(current, { query: "critical" }).pagination.page).toBe(1);
    expect(patchDataViewState(current, { columnVisibility: { owner: false } }).pagination.page).toBe(7);
  });

  it("serializes only changes from a recipe baseline", () => {
    const baseline = createDataViewState({
      sorting: [{ id: "customer", direction: "asc" }],
      columnSizing: { customer: 240 },
      columnPinning: { start: ["customer"], end: [] },
      viewId: "all-customers",
    });
    expect(serializeDataViewState(baseline, { prefix: "customers-", baseline })).toBe("");
    const changed = patchDataViewState(baseline, { query: "renewal" });
    const serialized = serializeDataViewState(changed, { prefix: "customers-", baseline });
    expect(serialized).toBe("customers-q=renewal");
    expect(parseDataViewState(serialized, baseline, { prefix: "customers-" })).toEqual(changed);
  });

  it("sanitizes malformed URL state without discarding a safe fallback", () => {
    const state = parseDataViewState(
      "whatiuse-page=-20&whatiuse-size=99999&whatiuse-from=not-a-date&whatiuse-filter=%7Bbad",
      { query: "fallback", columnPinning: { start: ["name"] } },
    );
    expect(state.query).toBe("fallback");
    expect(state.pagination).toEqual({ page: 1, pageSize: 500 });
    expect(state.dateRange.from).toBeNull();
    expect(state.columnPinning.start).toEqual(["name"]);
  });

  it("persists only personal saved views and revalidates their state", () => {
    const now = "2026-08-16T00:00:00.000Z";
    const personal: DataSavedView = {
      id: "mine",
      label: "My renewals",
      scope: "personal",
      state: createDataViewState({ query: "renewal" }),
      createdAt: now,
      updatedAt: now,
    };
    expect(parseSavedViews(serializeSavedViews([personal]))).toEqual([personal]);
    expect(parseSavedViews(JSON.stringify({ version: 1, views: [{ ...personal, scope: "system" }] }))).toEqual([]);
    expect(parseSavedViews("not-json")).toEqual([]);
  });
});
