import type { Meta, StoryObj } from "@storybook/react-vite";
import { componentStory } from "./story-contract";

const meta = { title: "Components/Interaction", tags: ["test"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const InlineEdit: Story = componentStory("inline-edit");
export const ReorderableList: Story = componentStory("reorderable-list");
export const ActionList: Story = componentStory("action-list");
export const SharedDetail: Story = componentStory("shared-detail");
export const UndoStack: Story = componentStory("undo-stack");
