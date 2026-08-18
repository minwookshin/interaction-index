import axe from "axe-core";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../legacy-app";
import { componentGuidance } from "../component-guidance";

const structuralRoutes = [
  ...Object.keys(componentGuidance),
  "foundations",
  "foundation-color",
  "foundation-typography",
  "foundation-spacing",
  "foundation-motion",
  "patterns",
  "edit-in-place",
  "find-and-act",
  "preserve-context",
  "recover-from-action",
];

describe("documentation accessibility", () => {
  it.each(structuralRoutes)("has no detectable structural violations on %s", async (route) => {
    window.history.replaceState(null, "", `#${route}`);
    const { container, unmount } = render(<App />);
    try {
      const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
      expect(result.violations).toEqual([]);
    } finally {
      unmount();
    }
  }, 15_000);

  it("keeps the component API table structurally accessible", async () => {
    window.history.replaceState(null, "", "#button");
    const { container, unmount } = render(<App />);

    try {
      const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
      expect(result.violations).toEqual([]);
    } finally {
      unmount();
    }
  }, 15_000);
});
