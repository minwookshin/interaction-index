import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BillingUsageRecipe, CustomerWorkspaceRecipe, MembersPermissionsRecipe } from "./product-pattern-recipes";

describe("whatiuse Product Patterns", () => {
  it("keeps customer search and detail in one task", async () => {
    const user = userEvent.setup();
    render(<CustomerWorkspaceRecipe />);
    expect(screen.getByRole("region", { name: "Selected customer" })).toHaveTextContent("Northstar Labs");

    await user.clear(screen.getByRole("searchbox", { name: "Search customers" }));
    await user.type(screen.getByRole("searchbox", { name: "Search customers" }), "Relay");
    expect(screen.getByRole("button", { name: /Relay Systems/ })).toBeVisible();
    expect(screen.queryByRole("button", { name: /Fieldwork/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Relay Systems/ }));
    await user.click(screen.getAllByRole("button", { name: "Complete follow-up" }).at(-1)!);
    expect(screen.getAllByRole("button", { name: "Follow-up complete" }).at(-1)).toBeDisabled();
  });

  it("keeps billing period and plan review interactive", async () => {
    const user = userEvent.setup();
    render(<BillingUsageRecipe />);
    await user.click(screen.getByRole("button", { name: "90D" }));
    expect(screen.getByRole("group", { name: "API usage. 12 data points." })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Manage plan" }));
    expect(screen.getByRole("dialog", { name: "Review Scale plan" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog", { name: "Review Scale plan" })).not.toBeInTheDocument();
  });

  it("preserves the access task across tabs and invites a member", async () => {
    const user = userEvent.setup();
    render(<MembersPermissionsRecipe />);
    await user.click(screen.getByRole("tab", { name: "Permissions" }));
    const exportPermission = screen.getByRole("checkbox", { name: "Export data for Member" });
    expect(exportPermission).toBeChecked();
    await user.click(exportPermission);
    expect(exportPermission).not.toBeChecked();

    await user.click(screen.getByRole("button", { name: "Invite member" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Work email" }), { target: { value: "alex@northstar.co" } });
    await user.click(screen.getByRole("button", { name: "Send invitation" }));
    await user.click(screen.getByRole("tab", { name: "Members" }));
    expect(screen.getByRole("cell", { name: /Alex/ })).toBeVisible();
  });
});
