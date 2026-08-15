import type { Meta, StoryObj } from "@storybook/react-vite";
import { componentStory } from "./story-contract";

const meta = { title: "Components/Data display", tags: ["test"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Badge: Story = componentStory("badge");
export const Avatar: Story = componentStory("avatar");
export const Table: Story = componentStory("table");
export const Tree: Story = componentStory("tree");
