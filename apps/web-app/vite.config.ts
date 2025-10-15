/// <reference types="vitest/config" />

import { reactRouter } from "@react-router/dev/vite";
import { createViteConfig } from "./vite-base.config";

export default createViteConfig({ plugins: [reactRouter()] });
