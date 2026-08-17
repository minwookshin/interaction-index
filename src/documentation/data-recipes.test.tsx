import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { AuditLogRecipe, CustomerDirectoryRecipe } from "./data-recipes";

describe("Teum Data recipes", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/docs");
  });

  it("connects the customer server request, URL, and personal saved-view lifecycle", async () => {
    const user = userEvent.setup();
    render(<CustomerDirectoryRecipe />);

    expect(await screen.findByText("5,000 matches")).toBeInTheDocument();
    const table = screen.getByRole("table", { name: "Customer Directory" });
    expect(table).toHaveAttribute("aria-rowcount", "5001");

    const search = screen.getByRole("searchbox", { name: "Search customers" });
    await user.type(search, "Northstar 001");
    await waitFor(() => expect(screen.getByText("1 matches")).toBeInTheDocument());
    expect(window.location.search).toContain("customers-q=Northstar+001");
    expect(within(table).getByText("Northstar 001")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Saved views: All customers" }));
    await user.click(await screen.findByRole("menuitem", { name: "Save as new view" }));
    await user.type(screen.getByRole("textbox", { name: "View name" }), "Renewal watch");
    await user.click(screen.getByRole("button", { name: "Save view" }));

    await waitFor(() => expect(window.localStorage.getItem("teum:data:customer-views:v1")).toContain("Renewal watch"));
    expect(window.location.search).toContain("customers-view=");
    await user.click(screen.getByRole("button", { name: "Saved views: Renewal watch" }));
    expect(await screen.findByRole("menuitemradio", { name: /Renewal watch/ })).toBeChecked();
  });

  it("keeps a ten-thousand-row audit collection virtual and immutable", async () => {
    const user = userEvent.setup();
    render(<AuditLogRecipe />);

    const table = screen.getByRole("table", { name: "Audit Log" });
    const rowCount = Number(table.getAttribute("aria-rowcount"));
    expect(rowCount).toBeGreaterThan(600);
    expect(rowCount).toBeLessThan(10_001);
    expect(within(table).getAllByRole("row").length).toBeLessThan(40);
    expect(within(table).queryByRole("checkbox")).not.toBeInTheDocument();

    await user.type(screen.getByRole("searchbox", { name: "Search audit events" }), "API key created");
    await waitFor(() => expect(window.location.search).toContain("audit-q=API+key+created"));
    expect(within(table).getAllByText("API key created").length).toBeGreaterThan(0);
  });
});
