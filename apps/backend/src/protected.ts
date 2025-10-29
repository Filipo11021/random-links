import { appFactory } from "./app-factory";

export const protectedMiddleware = appFactory.createMiddleware(
  async (c, next) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return next();
  },
);
