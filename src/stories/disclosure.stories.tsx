import type { Meta, StoryObj } from "@storybook/react-vite";
import { componentStory } from "./story-contract";

const meta = { title: "Components/Disclosure", tags: ["test"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsible: Story = componentStory("collapsible");
