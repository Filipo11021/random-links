import { Session, User } from "better-auth";
import { createFactory } from "hono/factory";
import { PrismaClient } from "./generated/prisma";
import { type Logger, logger } from "./logger";
import { getPrismaFromD1 } from "./prisma";

export const appFactory = createFactory<{
  Variables: {
    user: User | null;
    session: Session | null;
    prisma: PrismaClient;
    logger: Logger;
  };
  Bindings: {
    D1_DATABASE: D1Database;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    CORS_ORIGINS: string;
  };
}>({
  initApp: (app) => {
    app.use("*", async (c, next) => {
      c.set("logger", logger);

      return next();
    });

    app.use("*", async (c, next) => {
      c.set("prisma", getPrismaFromD1(c.env.D1_DATABASE));
      return next();
    });
  },
});
