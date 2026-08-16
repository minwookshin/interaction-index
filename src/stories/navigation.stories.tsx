import type { Meta, StoryObj } from "@storybook/react-vite";
import { componentStory } from "./story-contract";

const meta = { title: "Components/Navigation", tags: ["test"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tabs: Story = componentStory("tabs");
export const Breadcrumbs: Story = componentStory("breadcrumbs");
export const Pagination: Story = componentStory("pagination");
