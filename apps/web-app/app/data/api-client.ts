import type { AppType } from "@repo/backend";
import { hc } from "hono/client";

export const apiClient = hc<AppType>(import.meta.env.VITE_API_URL!, {
  init: {
    credentials: "include",
  },
});
