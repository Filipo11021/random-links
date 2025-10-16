import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub, redirect } from "react-router";
import { AppNavbar } from "./app-navbar";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/AppNavbar",
  component: AppNavbar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
  decorators: [
    (Story) => {
      const Stub = createRoutesStub([
        {
          path: "/",
          Component: Story,
        },
        {
          path: "/auth/logout",
          action: () => redirect("/"),
        },
      ]);

      return <Stub />;
    },
  ],
} satisfies Meta<typeof AppNavbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithUser: Story = {
  args: {
    user: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};

export const WithoutUser: Story = {
  args: {
    user: null,
  },
};
