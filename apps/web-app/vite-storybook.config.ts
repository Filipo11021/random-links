import { createViteConfig } from "./vite-base.config";

// storybook  have conflict with react router plugin
// so we need to create a config without react router plugin
// https://github.com/storybookjs/storybook/issues/25154#issuecomment-1852976172
export default createViteConfig({ plugins: [] });
