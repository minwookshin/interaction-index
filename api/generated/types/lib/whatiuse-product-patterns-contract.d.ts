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
export declare const customerWorkspaceContract: {
    readonly id: "customer-workspace";
    readonly intent: "Find an account, inspect its health and activity, then complete a follow-up without losing the customer list.";
    readonly roles: readonly ["Customer success", "Account owner", "Support lead"];
    readonly taskSequence: readonly ["Search or filter accounts", "Open one customer", "Review health and usage", "Inspect activity", "Complete the next action"];
    readonly components: readonly ["DataToolbar", "SearchInput", "FilterBuilder", "SharedDetail", "Tabs", "Metric", "Progress", "Timeline", "Button", "Toast"];
    readonly stateOwnership: {
        readonly shareable: readonly ["query", "health filter", "segment filter", "selected customer"];
        readonly persisted: readonly ["saved customer view"];
        readonly transient: readonly ["active detail tab", "follow-up feedback"];
    };
    readonly invariants: readonly ["The selected account stays anchored to its row while the detail changes.", "Health, owner, plan, and renewal context use one customer record.", "Completing a follow-up does not reorder or clear the customer list.", "Pointer and keyboard paths open the same detail and return to the same origin."];
    readonly failureStates: readonly ["No matching accounts", "Customer detail unavailable", "Follow-up failed"];
    readonly accessibility: readonly ["The customer list and detail are separately labelled regions.", "Health is written in text rather than encoded by tone alone.", "Escape closes detail and restores focus to the selected customer."];
};
export declare const billingUsageContract: {
    readonly id: "billing-usage";
    readonly intent: "Compare plan usage, limits, and invoices before changing a subscription or exporting a receipt.";
    readonly roles: readonly ["Workspace owner", "Billing admin", "Finance"];
    readonly taskSequence: readonly ["Choose a billing period", "Review plan and spend", "Inspect usage limits", "Compare the trend", "Open an invoice or manage the plan"];
    readonly components: readonly ["SegmentedControl", "Metric", "Sparkline", "Chart", "Progress", "Alert", "DataTable", "Dialog", "Button", "Toast"];
    readonly stateOwnership: {
        readonly shareable: readonly ["billing period"];
        readonly persisted: readonly ["plan", "billing contact", "usage limits"];
        readonly transient: readonly ["active chart point", "open invoice", "manage-plan dialog"];
    };
    readonly invariants: readonly ["Metrics, chart, usage limits, and invoices use the same billing period.", "Approaching a limit never changes layout or hides the exact consumed and allowed values.", "A plan change requires an explicit review step.", "Invoice actions name the invoice and preserve the current period."];
    readonly failureStates: readonly ["Usage unavailable", "Payment failed", "Invoice unavailable", "Plan change rejected"];
    readonly accessibility: readonly ["Every usage limit has a progressbar name and exact value text.", "Payment risk uses a semantic label and icon, not color alone.", "The usage chart keeps its semantic data table."];
};
export declare const membersPermissionsContract: {
    readonly id: "members-permissions";
    readonly intent: "Invite people, change roles, and audit permission boundaries without separating membership from access policy.";
    readonly roles: readonly ["Workspace owner", "Organization admin", "Security admin"];
    readonly taskSequence: readonly ["Find a member", "Review status and role", "Change access or invite someone", "Compare role permissions", "Confirm the policy change"];
    readonly components: readonly ["Tabs", "DataToolbar", "SearchInput", "FilterBuilder", "DataTable", "Select", "Badge", "Checkbox", "Dialog", "TextField", "Toast"];
    readonly stateOwnership: {
        readonly shareable: readonly ["active tab", "member query", "role filter"];
        readonly persisted: readonly ["members", "roles", "permission grants"];
        readonly transient: readonly ["invite draft", "pending role change", "confirmation feedback"];
    };
    readonly invariants: readonly ["A member has one visible role and one visible invitation status.", "Permission changes update the named role, never an ambiguous current selection.", "The last owner cannot be removed or demoted without a replacement.", "Changing tabs does not reset member filters or permission drafts."];
    readonly failureStates: readonly ["Duplicate invitation", "Invite failed", "Role change rejected", "Last-owner protection"];
    readonly accessibility: readonly ["Role controls include the member name in their accessible label.", "Permission cells expose role and capability together.", "Success and failure feedback is announced without moving focus."];
};
export declare const whatiuseProductPatternContracts: readonly [{
    readonly id: "customer-workspace";
    readonly intent: "Find an account, inspect its health and activity, then complete a follow-up without losing the customer list.";
    readonly roles: readonly ["Customer success", "Account owner", "Support lead"];
    readonly taskSequence: readonly ["Search or filter accounts", "Open one customer", "Review health and usage", "Inspect activity", "Complete the next action"];
    readonly components: readonly ["DataToolbar", "SearchInput", "FilterBuilder", "SharedDetail", "Tabs", "Metric", "Progress", "Timeline", "Button", "Toast"];
    readonly stateOwnership: {
        readonly shareable: readonly ["query", "health filter", "segment filter", "selected customer"];
        readonly persisted: readonly ["saved customer view"];
        readonly transient: readonly ["active detail tab", "follow-up feedback"];
    };
    readonly invariants: readonly ["The selected account stays anchored to its row while the detail changes.", "Health, owner, plan, and renewal context use one customer record.", "Completing a follow-up does not reorder or clear the customer list.", "Pointer and keyboard paths open the same detail and return to the same origin."];
    readonly failureStates: readonly ["No matching accounts", "Customer detail unavailable", "Follow-up failed"];
    readonly accessibility: readonly ["The customer list and detail are separately labelled regions.", "Health is written in text rather than encoded by tone alone.", "Escape closes detail and restores focus to the selected customer."];
}, {
    readonly id: "billing-usage";
    readonly intent: "Compare plan usage, limits, and invoices before changing a subscription or exporting a receipt.";
    readonly roles: readonly ["Workspace owner", "Billing admin", "Finance"];
    readonly taskSequence: readonly ["Choose a billing period", "Review plan and spend", "Inspect usage limits", "Compare the trend", "Open an invoice or manage the plan"];
    readonly components: readonly ["SegmentedControl", "Metric", "Sparkline", "Chart", "Progress", "Alert", "DataTable", "Dialog", "Button", "Toast"];
    readonly stateOwnership: {
        readonly shareable: readonly ["billing period"];
        readonly persisted: readonly ["plan", "billing contact", "usage limits"];
        readonly transient: readonly ["active chart point", "open invoice", "manage-plan dialog"];
    };
    readonly invariants: readonly ["Metrics, chart, usage limits, and invoices use the same billing period.", "Approaching a limit never changes layout or hides the exact consumed and allowed values.", "A plan change requires an explicit review step.", "Invoice actions name the invoice and preserve the current period."];
    readonly failureStates: readonly ["Usage unavailable", "Payment failed", "Invoice unavailable", "Plan change rejected"];
    readonly accessibility: readonly ["Every usage limit has a progressbar name and exact value text.", "Payment risk uses a semantic label and icon, not color alone.", "The usage chart keeps its semantic data table."];
}, {
    readonly id: "members-permissions";
    readonly intent: "Invite people, change roles, and audit permission boundaries without separating membership from access policy.";
    readonly roles: readonly ["Workspace owner", "Organization admin", "Security admin"];
    readonly taskSequence: readonly ["Find a member", "Review status and role", "Change access or invite someone", "Compare role permissions", "Confirm the policy change"];
    readonly components: readonly ["Tabs", "DataToolbar", "SearchInput", "FilterBuilder", "DataTable", "Select", "Badge", "Checkbox", "Dialog", "TextField", "Toast"];
    readonly stateOwnership: {
        readonly shareable: readonly ["active tab", "member query", "role filter"];
        readonly persisted: readonly ["members", "roles", "permission grants"];
        readonly transient: readonly ["invite draft", "pending role change", "confirmation feedback"];
    };
    readonly invariants: readonly ["A member has one visible role and one visible invitation status.", "Permission changes update the named role, never an ambiguous current selection.", "The last owner cannot be removed or demoted without a replacement.", "Changing tabs does not reset member filters or permission drafts."];
    readonly failureStates: readonly ["Duplicate invitation", "Invite failed", "Role change rejected", "Last-owner protection"];
    readonly accessibility: readonly ["Role controls include the member name in their accessible label.", "Permission cells expose role and capability together.", "Success and failure feedback is announced without moving focus."];
}];
export declare const whatiuseProductPatternSystemContract: {
    readonly version: 1;
    readonly layers: readonly ["Core controls", "Data state", "Analytics context", "Product task"];
    readonly rules: readonly ["Patterns compose public whatiuse components and keep product state outside visual primitives.", "One task owns one primary collection, one detail origin, and one foreground feedback channel.", "Shareable filters survive task changes; transient overlays and selections do not.", "Destructive or costly work always exposes a review, cancellation, or recovery path.", "Patterns may be restyled through semantic tokens but may not depend on private selectors or undocumented props."];
};
