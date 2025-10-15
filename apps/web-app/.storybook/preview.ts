import type { Preview } from "@storybook/react-vite";
import "../app/app.css";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { UIProvider } from "../app/ui/ui-provider";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    withThemeFromJSXProvider({
      Provider: UIProvider,
    }),
  ],
};

export default preview;
