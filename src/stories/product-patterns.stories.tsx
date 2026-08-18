import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { BillingUsageRecipe, CustomerWorkspaceRecipe, MembersPermissionsRecipe } from "../documentation/product-pattern-recipes";

const meta = {
  title: "Product/Patterns",
  tags: ["test"],
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: "Three B2B product tasks composed from whatiuse Core, Data, Analytics, and one shared pattern contract." } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function PatternStory({ children }: { children: React.ReactNode }) {
  return <main className="analytics-story">{children}</main>;
}

export const CustomerWorkspace: Story = {
  render: () => <PatternStory><CustomerWorkspaceRecipe /></PatternStory>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: "Customer Workspace recipe" })).toBeVisible();
    await userEvent.clear(canvas.getByRole("searchbox", { name: "Search customers" }));
    await userEvent.type(canvas.getByRole("searchbox", { name: "Search customers" }), "Relay");
    await userEvent.click(canvas.getByRole("button", { name: /Relay Systems/ }));
    const detail = canvas.getByRole("region", { name: "Selected customer" });
    await expect(detail).toHaveTextContent("At risk");
    await waitFor(() => {
      expect(detail).toHaveStyle({ opacity: "1" });
      expect(detail.querySelector(".teum-shared-detail__content")).toHaveStyle({ opacity: "1" });
    });
    canvasElement.dataset.storyReady = "true";
  },
};

export const BillingUsage: Story = {
  render: () => <PatternStory><BillingUsageRecipe /></PatternStory>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "90D" }));
    await expect(canvas.getByRole("group", { name: "API usage. 12 data points." })).toBeVisible();
    canvasElement.dataset.storyReady = "true";
  },
};

export const MembersPermissions: Story = {
  render: () => <PatternStory><MembersPermissionsRecipe /></PatternStory>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "Permissions" }));
    await expect(canvas.getByRole("region", { name: "Role permissions table" })).toBeVisible();
    canvasElement.dataset.storyReady = "true";
  },
};
