import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  AnalyticsRendererGallery,
  ConversionRetentionRecipe,
  ProductUsageRecipe,
  SaaSOverviewRecipe,
} from "../documentation/analytics-recipes";

const meta = {
  title: "Product/Analytics",
  tags: ["test"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "A source-owned renderer family and three product recipes prove Teum Analytics against real decision tasks, explicit shared state, local keyboard inspection, and semantic data equivalents.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function AnalyticsStory({ children }: { children: React.ReactNode }) {
  return <main className="analytics-story">{children}</main>;
}

export const RendererFamily: Story = {
  render: () => <AnalyticsStory><AnalyticsRendererGallery /></AnalyticsStory>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: "Analytics renderer family" })).toBeVisible();
    await expect(canvas.getByRole("group", { name: "Plan mix. 4 segments." })).toBeVisible();
    await expect(canvas.getByRole("region", { name: "Feature activity" })).toBeVisible();
    canvasElement.dataset.storyReady = "true";
  },
};

export const SaaSOverview: Story = {
  render: () => <AnalyticsStory><SaaSOverviewRecipe /></AnalyticsStory>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: "SaaS Overview recipe" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "6M" }));
    await expect(canvas.getByRole("group", { name: "Recurring revenue. 6 data points." })).toBeVisible();
    canvasElement.dataset.storyReady = "true";
  },
};

export const ProductUsage: Story = {
  render: () => <AnalyticsStory><ProductUsageRecipe /></AnalyticsStory>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const plot = canvas.getByRole("group", { name: "Active usage. 14 data points." });
    plot.focus();
    await userEvent.keyboard("{Home}");
    await expect(canvas.getByText("Aug 12", { selector: ".teum-analytics-recipe__header small" })).toBeVisible();
    await expect(canvas.getByText("Aug 3", { selector: ".teum-chart__tooltip > strong" })).toBeVisible();
    canvasElement.dataset.storyReady = "true";
  },
};

export const ConversionRetention: Story = {
  render: () => <AnalyticsStory><ConversionRetentionRecipe /></AnalyticsStory>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Became paid/ }));
    await expect(canvas.getByRole("group", { name: "Became paid trend. 12 data points." })).toBeVisible();
    canvasElement.dataset.storyReady = "true";
  },
};
