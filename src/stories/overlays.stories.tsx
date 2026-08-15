import type { Meta, StoryObj } from "@storybook/react-vite";
import { componentStory } from "./story-contract";

const meta = { title: "Components/Overlays", tags: ["test"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tooltip: Story = componentStory("tooltip");
export const Popover: Story = componentStory("popover");
export const Menu: Story = componentStory("menu");
export const ContextMenu: Story = componentStory("context-menu");
export const Dialog: Story = componentStory("dialog");
export const Sheet: Story = componentStory("sheet");
export const AlertDialog: Story = componentStory("alert-dialog");
