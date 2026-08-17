import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  createDataViewState,
  parseSavedViews,
  useDataViewState,
  useSavedViews,
  type DataViewLocationAdapter,
  type DataViewStorageAdapter,
} from "./data-view-state";

describe("Data view hooks", () => {
  it("keeps URL hydration, state changes, and browser history on one validated boundary", async () => {
    let search = "utm_source=docs&customers-q=renewal&customers-page=4";
    const listeners = new Set<() => void>();
    const location: DataViewLocationAdapter = {
      read: () => search,
      write: (next) => { search = next; },
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };

    const { result } = renderHook(() => useDataViewState({
      initialState: { pagination: { page: 1, pageSize: 25 } },
      syncToUrl: true,
      parameterPrefix: "customers-",
      location,
    }));

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.state.query).toBe("renewal");
    expect(result.current.state.pagination.page).toBe(4);

    act(() => result.current.patchState({ sorting: [{ id: "arr", direction: "desc" }] }));
    expect(result.current.state.pagination.page).toBe(1);
    expect(search).toContain("utm_source=docs");
    expect(search).toContain("customers-sort=");

    act(() => {
      search = "utm_source=docs&customers-q=enterprise";
      listeners.forEach((listener) => listener());
    });
    expect(result.current.state.query).toBe("enterprise");
  });

  it("persists rapid create, update, and delete operations without dropping a view", async () => {
    const values = new Map<string, string>();
    const storage: DataViewStorageAdapter = {
      read: (key) => values.get(key) ?? null,
      write: (key, value) => { values.set(key, value); },
      remove: (key) => { values.delete(key); },
    };
    const ids = ["renewals", "risk"];
    const { result } = renderHook(() => useSavedViews({
      storageKey: "views",
      storage,
      createId: () => ids.shift() ?? "fallback",
      now: () => new Date("2026-08-16T00:00:00.000Z"),
    }));
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.saveView("Renewals", createDataViewState({ query: "renewal" }));
      result.current.saveView("At risk", createDataViewState({ filters: [{ id: "status:is", fieldId: "status", operator: "is", value: "At risk" }] }));
    });
    expect(result.current.personalViews.map((view) => view.id)).toEqual(["renewals", "risk"]);
    expect(parseSavedViews(values.get("views") ?? null)).toHaveLength(2);

    act(() => { result.current.updateView("renewals", createDataViewState({ query: "enterprise" })); });
    expect(result.current.personalViews.find((view) => view.id === "renewals")?.state.query).toBe("enterprise");

    act(() => { result.current.removeView("risk"); });
    expect(result.current.personalViews.map((view) => view.id)).toEqual(["renewals"]);
  });
});
