import registry from "../../registry.json" with { type: "json" };

type PublicRoute = readonly [route: string, heading: string, group: "docs" | "foundations" | "components" | "patterns"];

const documentationRoutes: readonly PublicRoute[] = [
  ["installation", "Installation", "docs"],
  ["choosing-components", "Core", "docs"],
  ["product-pilot", "Data", "docs"],
  ["analytics", "Analytics", "docs"],
  ["product-patterns", "Workflow", "docs"],
  ["collaboration-patterns", "Collaboration", "docs"],
  ["agent-native", "For coding agents", "docs"],
  ["component-status", "Status", "docs"],
  ["accessibility", "Accessibility", "docs"],
  ["browser-support", "Browser support", "docs"],
  ["security", "Security", "docs"],
  ["contributing", "Contributing", "docs"],
  ["releases", "Releases", "docs"],
  ["licensing", "Licensing", "docs"],
];

const foundationRoutes: readonly PublicRoute[] = [
  ["foundations", "Foundations", "foundations"],
  ["foundation-color", "Color", "foundations"],
  ["foundation-typography", "Typography", "foundations"],
  ["foundation-spacing", "Spacing", "foundations"],
  ["foundation-motion", "Motion", "foundations"],
];

const patternRoutes: readonly PublicRoute[] = [
  ["patterns", "Patterns", "patterns"],
  ["edit-in-place", "Edit in place", "patterns"],
  ["find-and-act", "Find and act", "patterns"],
  ["preserve-context", "Preserve context", "patterns"],
  ["recover-from-action", "Recover from action", "patterns"],
];

const componentRoutes = registry.items
  .filter((item) => item.type === "registry:ui")
  .map((item) => [item.name, item.title, "components"] as const satisfies PublicRoute);

if (componentRoutes.length !== 45) {
  throw new Error(`The public route matrix must contain 45 components; found ${componentRoutes.length}`);
}

export const publicRoutes: readonly PublicRoute[] = [
  ...documentationRoutes,
  ...foundationRoutes,
  ...componentRoutes,
  ...patternRoutes,
];

if (publicRoutes.length !== 69) {
  throw new Error(`The public route matrix must contain 69 routes; found ${publicRoutes.length}`);
}

export const publicRouteGroups = {
  docs: documentationRoutes,
  foundations: foundationRoutes,
  components: componentRoutes,
  patterns: patternRoutes,
} as const;
