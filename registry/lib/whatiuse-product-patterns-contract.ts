export type WhatiuseProductPatternContract = {
  id: string;
  intent: string;
  roles: readonly string[];
  taskSequence: readonly string[];
  components: readonly string[];
  stateOwnership: {
    shareable: readonly string[];
    persisted: readonly string[];
    transient: readonly string[];
  };
  invariants: readonly string[];
  failureStates: readonly string[];
  accessibility: readonly string[];
};

export const customerWorkspaceContract = {
  id: "customer-workspace",
  intent: "Find an account, inspect its health and activity, then complete a follow-up without losing the customer list.",
  roles: ["Customer success", "Account owner", "Support lead"],
  taskSequence: ["Search or filter accounts", "Open one customer", "Review health and usage", "Inspect activity", "Complete the next action"],
  components: ["DataToolbar", "SearchInput", "FilterBuilder", "SharedDetail", "Tabs", "Metric", "Progress", "Timeline", "Button", "Toast"],
  stateOwnership: {
    shareable: ["query", "health filter", "segment filter", "selected customer"],
    persisted: ["saved customer view"],
    transient: ["active detail tab", "follow-up feedback"],
  },
  invariants: [
    "The selected account stays anchored to its row while the detail changes.",
    "Health, owner, plan, and renewal context use one customer record.",
    "Completing a follow-up does not reorder or clear the customer list.",
    "Pointer and keyboard paths open the same detail and return to the same origin.",
  ],
  failureStates: ["No matching accounts", "Customer detail unavailable", "Follow-up failed"],
  accessibility: ["The customer list and detail are separately labelled regions.", "Health is written in text rather than encoded by tone alone.", "Escape closes detail and restores focus to the selected customer."],
} as const satisfies WhatiuseProductPatternContract;

export const billingUsageContract = {
  id: "billing-usage",
  intent: "Compare plan usage, limits, and invoices before changing a subscription or exporting a receipt.",
  roles: ["Workspace owner", "Billing admin", "Finance"],
  taskSequence: ["Choose a billing period", "Review plan and spend", "Inspect usage limits", "Compare the trend", "Open an invoice or manage the plan"],
  components: ["SegmentedControl", "Metric", "Sparkline", "Chart", "Progress", "Alert", "DataTable", "Dialog", "Button", "Toast"],
  stateOwnership: {
    shareable: ["billing period"],
    persisted: ["plan", "billing contact", "usage limits"],
    transient: ["active chart point", "open invoice", "manage-plan dialog"],
  },
  invariants: [
    "Metrics, chart, usage limits, and invoices use the same billing period.",
    "Approaching a limit never changes layout or hides the exact consumed and allowed values.",
    "A plan change requires an explicit review step.",
    "Invoice actions name the invoice and preserve the current period.",
  ],
  failureStates: ["Usage unavailable", "Payment failed", "Invoice unavailable", "Plan change rejected"],
  accessibility: ["Every usage limit has a progressbar name and exact value text.", "Payment risk uses a semantic label and icon, not color alone.", "The usage chart keeps its semantic data table."],
} as const satisfies WhatiuseProductPatternContract;

export const membersPermissionsContract = {
  id: "members-permissions",
  intent: "Invite people, change roles, and audit permission boundaries without separating membership from access policy.",
  roles: ["Workspace owner", "Organization admin", "Security admin"],
  taskSequence: ["Find a member", "Review status and role", "Change access or invite someone", "Compare role permissions", "Confirm the policy change"],
  components: ["Tabs", "DataToolbar", "SearchInput", "FilterBuilder", "DataTable", "Select", "Badge", "Checkbox", "Dialog", "TextField", "Toast"],
  stateOwnership: {
    shareable: ["active tab", "member query", "role filter"],
    persisted: ["members", "roles", "permission grants"],
    transient: ["invite draft", "pending role change", "confirmation feedback"],
  },
  invariants: [
    "A member has one visible role and one visible invitation status.",
    "Permission changes update the named role, never an ambiguous current selection.",
    "The last owner cannot be removed or demoted without a replacement.",
    "Changing tabs does not reset member filters or permission drafts.",
  ],
  failureStates: ["Duplicate invitation", "Invite failed", "Role change rejected", "Last-owner protection"],
  accessibility: ["Role controls include the member name in their accessible label.", "Permission cells expose role and capability together.", "Success and failure feedback is announced without moving focus."],
} as const satisfies WhatiuseProductPatternContract;

export const whatiuseProductPatternContracts = [
  customerWorkspaceContract,
  billingUsageContract,
  membersPermissionsContract,
] as const;

export const whatiuseProductPatternSystemContract = {
  version: 1,
  layers: ["Core controls", "Data state", "Analytics context", "Product task"],
  rules: [
    "Patterns compose public whatiuse components and keep product state outside visual primitives.",
    "One task owns one primary collection, one detail origin, and one foreground feedback channel.",
    "Shareable filters survive task changes; transient overlays and selections do not.",
    "Destructive or costly work always exposes a review, cancellation, or recovery path.",
    "Patterns may be restyled through semantic tokens but may not depend on private selectors or undocumented props.",
  ],
} as const;
