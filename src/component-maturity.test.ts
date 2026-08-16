import { describe, expect, it } from "vitest";
import { componentGuidance } from "./component-guidance";
import { componentMaturity, readyCriteria } from "./component-maturity";

describe("component maturity contract", () => {
  it("covers every public component once", () => {
    expect(componentMaturity).toHaveLength(Object.keys(componentGuidance).length);
    expect(new Set(componentMaturity.map((component) => component.id)).size).toBe(componentMaturity.length);
  });

  it("does not overstate alpha readiness", () => {
    expect(componentMaturity.every((component) => component.status === "Experimental")).toBe(true);
    expect(componentMaturity.every((component) => component.nextGate.includes("independent product adoption"))).toBe(true);
    expect(readyCriteria.length).toBeGreaterThanOrEqual(6);
  });
});
