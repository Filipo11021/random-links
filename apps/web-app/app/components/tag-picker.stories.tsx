import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { TagPicker } from "./tag-picker";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/TagPicker",
  component: TagPicker,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    tags: { control: "object" },
    selectedTagFilters: {
      table: {
        disable: true,
      },
    },
    setSelectedTagFilters: {
      table: {
        disable: true,
      },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof TagPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    tags: [
      { id: "1", name: "Tag 1", color: "#3b82f6", createdAt: "2021-01-01" },
      { id: "2", name: "Tag 2", color: "#10b981", createdAt: "2021-01-01" },
      { id: "3", name: "Tag 3", color: "#ef4444", createdAt: "2021-01-01" },
      { id: "4", name: "Tag 4", color: "#f59e0b", createdAt: "2021-01-01" },
      { id: "5", name: "Tag 5", color: "#8b5cf6", createdAt: "2021-01-01" },
      { id: "6", name: "Tag 6", color: "#ec4899", createdAt: "2021-01-01" },
      { id: "7", name: "Tag 7", color: "#0ea5e9", createdAt: "2021-01-01" },
      { id: "8", name: "Tag 8", color: "#10b981", createdAt: "2021-01-01" },
      { id: "9", name: "Tag 9", color: "#ef4444", createdAt: "2021-01-01" },
      { id: "10", name: "Tag 10", color: "#3b82f6", createdAt: "2021-01-01" },
    ],
    selectedTagFilters: [],
    setSelectedTagFilters: fn(),
  },
  render: function Render(args) {
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <TagPicker
        {...args}
        selectedTagFilters={selected}
        setSelectedTagFilters={setSelected}
      />
    );
  },
};
