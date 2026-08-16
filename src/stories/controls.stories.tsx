import type { Meta, StoryObj } from "@storybook/react-vite";
import { componentStory } from "./story-contract";

const meta = { title: "Components/Controls", tags: ["test"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Button: Story = componentStory("button");
export const IconButton: Story = componentStory("icon-button");
export const Field: Story = componentStory("field");
export const InputGroup: Story = componentStory("input-group");
export const Kbd: Story = componentStory("kbd");
export const ButtonGroup: Story = componentStory("button-group");
export const Toolbar: Story = componentStory("toolbar");
export const TextField: Story = componentStory("text-field");
export const Textarea: Story = componentStory("textarea");
export const Checkbox: Story = componentStory("checkbox");
export const RadioGroup: Story = componentStory("radio-group");
export const Switch: Story = componentStory("switch");
export const Select: Story = componentStory("select");
export const ContextSwitcher: Story = componentStory("context-switcher");
export const Combobox: Story = componentStory("combobox");
export const SearchInput: Story = componentStory("search-input");
export const NumberField: Story = componentStory("number-field");
export const DatePicker: Story = componentStory("date-picker");
export const SegmentedControl: Story = componentStory("segmented-control");
