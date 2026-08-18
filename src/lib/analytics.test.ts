import { describe, expect, it } from "vitest";
import {
  clampAnalyticsIndex,
  createAnalyticsAreaPath,
  createAnalyticsPath,
  createAnalyticsTicks,
  describeAnalyticsDatum,
  getAnalyticsBandPosition,
  getAnalyticsDomain,
  getAnalyticsPointPosition,
  getStackedAnalyticsDomain,
  getPercentChange,
  summarizeAnalyticsSeries,
  type AnalyticsDatum,
  type AnalyticsSeries,
} from "./analytics";

const data: readonly AnalyticsDatum[] = [
  { id: "jan", label: "January", values: { current: 10, previous: 8 } },
  { id: "feb", label: "February", values: { current: 20, previous: null } },
  { id: "mar", label: "March", values: { current: 30, previous: 18 } },
];

const series: readonly AnalyticsSeries[] = [
  { id: "current", label: "Current" },
  { id: "previous", label: "Previous", lineStyle: "dashed" },
];

const box = { width: 100, height: 60, left: 10, right: 10, top: 10, bottom: 10 } as const;

describe("analytics geometry", () => {
  it("derives padded and zero-inclusive domains without hiding negative values", () => {
    expect(getAnalyticsDomain(data, ["current"], { paddingRatio: 0 })).toEqual([10, 30]);
    expect(getAnalyticsDomain(data, ["current"], { includeZero: true, paddingRatio: 0 })).toEqual([0, 30]);
    expect(getAnalyticsDomain([], ["current"])).toEqual([0, 1]);
    expect(getAnalyticsDomain(data, ["current"], { domain: [5, 40] })).toEqual([5, 40]);
  });

  it("creates stable ticks and point positions", () => {
    expect(createAnalyticsTicks([0, 100], 5)).toEqual([0, 50, 100]);
    expect(getAnalyticsPointPosition(data, 0, "current", [0, 40], box)).toEqual({ x: 10, y: 40, value: 10 });
    expect(getAnalyticsPointPosition(data, 1, "previous", [0, 40], box)).toBeNull();
    const band = getAnalyticsBandPosition(3, 1, box);
    expect(band.start).toBeCloseTo(36.67, 2);
    expect(band.center).toBeCloseTo(50, 5);
    expect(band.width).toBeCloseTo(26.67, 2);
  });

  it("keeps gaps explicit in line paths and area segments", () => {
    expect(createAnalyticsPath(data, "current", [0, 40], box)).toBe("M10.00,40.00 L50.00,30.00 L90.00,20.00");
    expect(createAnalyticsPath(data, "previous", [0, 40], box)).toBe("M10.00,42.00 M90.00,32.00");
    expect(createAnalyticsAreaPath(data, "previous", [0, 40], box)).toBe("M10.00,50.00 L10.00,42.00 L10.00,50.00 Z M90.00,50.00 L90.00,32.00 L90.00,50.00 Z");
    expect(createAnalyticsAreaPath(data, "current", [0, 40], box)).toMatch(/^M10\.00,50\.00 .* Z$/);
  });

  it("derives a stacked domain from positive and negative totals", () => {
    const stacked = [
      { id: "one", label: "One", values: { a: 8, b: 4, c: -2 } },
      { id: "two", label: "Two", values: { a: 5, b: 12, c: -6 } },
    ];
    expect(getStackedAnalyticsDomain(stacked, ["a", "b", "c"], { paddingRatio: 0 })).toEqual([-6, 17]);
  });
});

describe("analytics semantics", () => {
  it("clamps inspection and leaves an intentionally cleared index empty", () => {
    expect(clampAnalyticsIndex(-2, 3)).toBe(0);
    expect(clampAnalyticsIndex(8, 3)).toBe(2);
    expect(clampAnalyticsIndex(null, 3)).toBeNull();
    expect(clampAnalyticsIndex(0, 0)).toBeNull();
  });

  it("treats a zero comparison as not comparable", () => {
    expect(getPercentChange(15, 10)).toBe(50);
    expect(getPercentChange(5, 10)).toBe(-50);
    expect(getPercentChange(10, 0)).toBeNull();
  });

  it("writes the same values exposed by the visual encoding", () => {
    expect(describeAnalyticsDatum(data[0], series, (value) => String(value))).toBe("January. Current 10, Previous 8.");
    expect(describeAnalyticsDatum(data[1], series, (value) => String(value))).toBe("February. Current 20.");
    expect(summarizeAnalyticsSeries(data, series[0], (value) => String(value))).toBe("Current increased from 10 to 30.");
  });
});
