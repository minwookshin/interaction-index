export type MaturityStatus = "Experimental" | "Ready" | "Deprecated";

export type ComponentMaturityRecord = {
  id: string;
  name: string;
  status: MaturityStatus;
  evidence: string;
  nextGate: string;
};

const componentNames = {
  button: "Button",
  "icon-button": "Icon Button",
  field: "Field & Fieldset",
  "input-group": "Input Group",
  kbd: "Kbd",
  "button-group": "Button Group",
  toolbar: "Toolbar",
  "text-field": "Text Field",
  textarea: "Textarea",
  checkbox: "Checkbox",
  "radio-group": "Radio Group",
  switch: "Switch",
  select: "Select",
  "context-switcher": "Context Switcher",
  combobox: "Combobox",
  "search-input": "Search Input",
  "number-field": "Number Field",
  "date-picker": "Calendar & Date Picker",
  "segmented-control": "Segmented Control",
  tooltip: "Tooltip",
  popover: "Popover",
  menu: "Menu",
  "context-menu": "Context Menu",
  dialog: "Dialog",
  sheet: "Sheet",
  "alert-dialog": "Alert Dialog",
  tabs: "Tabs",
  breadcrumbs: "Breadcrumbs",
  pagination: "Pagination",
  collapsible: "Collapsible",
  toast: "Toast",
  progress: "Progress",
  spinner: "Spinner",
  skeleton: "Skeleton",
  alert: "Alert",
  "empty-state": "Empty State",
  badge: "Badge",
  avatar: "Avatar",
  table: "Table",
  tree: "Tree",
  "reorderable-list": "Reorderable List",
  "inline-edit": "Inline Edit",
  "action-list": "Action List",
  "shared-detail": "Shared Detail",
  "undo-stack": "Undo Stack",
} as const;

const authoredComponents = new Set(["inline-edit", "action-list", "shared-detail", "undo-stack"]);

export const componentMaturity: readonly ComponentMaturityRecord[] = Object.entries(componentNames).map(([id, name]) => ({
  id,
  name,
  status: "Experimental",
  evidence: authoredComponents.has(id)
    ? "Behavior contract, keyboard path, product composition, registry, and light/dark coverage"
    : "State contract, keyboard path, registry artifact, and light/dark route coverage",
  nextGate: "Manual assistive-technology sign-off and independent product adoption",
}));

export const maturityDefinitions: readonly {
  status: MaturityStatus;
  meaning: string;
  releaseContract: string;
}[] = [
  {
    status: "Experimental",
    meaning: "Useful for evaluation and alpha product work; the API may still change.",
    releaseContract: "Every breaking change is named in the changelog and paired with a migration note.",
  },
  {
    status: "Ready",
    meaning: "Supported for product use with a stable contract and an expected long-term path.",
    releaseContract: "Promotion requires the complete evidence gate and a maintained migration path.",
  },
  {
    status: "Deprecated",
    meaning: "Kept temporarily for migration and should not be selected for new work.",
    releaseContract: "Documentation names the replacement, warning, final supported version, and removal window.",
  },
];

export const readyCriteria = [
  "Public props, semantic tokens, and behavior contract are stable and documented.",
  "Keyboard, focus return, reduced motion, forced colors, 200% zoom, and light/dark paths pass.",
  "The versioned registry artifact, clean consumer install, local-change review, and upgrade path pass.",
  "Manual assistive-technology review is recorded for the component's highest-risk task.",
  "At least one independent product consumer has exercised the API without a private workaround.",
  "A maintainer, deprecation owner, and migration path are named before promotion.",
] as const;
