import type { Meta, StoryObj } from "@storybook/react-vite";
import { componentStory } from "./story-contract";

const meta = { title: "Components/Feedback", tags: ["test"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Toast: Story = componentStory("toast");
export const Progress: Story = componentStory("progress");
export const Spinner: Story = componentStory("spinner");
export const Skeleton: Story = componentStory("skeleton");
export const Alert: Story = componentStory("alert");
export const EmptyState: Story = componentStory("empty-state");
