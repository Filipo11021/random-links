import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeSwitcher } from "./theme-switcher";

const meta = {
  title: "Example/ThemeSwitcher",
  component: ThemeSwitcher,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
