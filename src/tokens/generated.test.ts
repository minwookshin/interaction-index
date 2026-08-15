import { describe, expect, it } from "vitest";
import { tokenByPath, tokenManifest, tokenModes, tokenPaths, tokenVar } from "./generated";

describe("generated design tokens", () => {
  it("publishes one typed path and one unique CSS variable per token", () => {
    expect(tokenPaths.length).toBeGreaterThanOrEqual(120);
    expect(new Set(tokenPaths).size).toBe(tokenPaths.length);
    expect(new Set(tokenManifest.map((token) => token.cssVariable)).size).toBe(tokenManifest.length);
    expect(tokenManifest.every((token) => tokenPaths.includes(token.path))).toBe(true);
  });

  it("keeps light and dark values on the same semantic contract", () => {
    expect(tokenModes).toEqual(["light", "dark"]);
    expect(tokenManifest.every((token) => token.values.light && token.values.dark)).toBe(true);
    expect(tokenByPath["theme.surface.bg-canvas"].values).toEqual({ light: "#ffffff", dark: "#0e0e0f" });
    expect(tokenByPath["theme.foreground.fg-default"].values.light).toBe("var(--ix-gray-900)");
    expect(tokenByPath["theme.foreground.fg-default"].values.dark).toBe("var(--ix-gray-900)");
  });

  it("exposes type-safe variable references to product code", () => {
    expect(tokenVar("foundation.layout.control-height-md")).toBe("var(--ix-control-height-md)");
    expect(tokenVar("theme.elevation.shadow-flyout")).toBe("var(--ix-shadow-flyout)");
  });
});
