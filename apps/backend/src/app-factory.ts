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
  Bindings: CloudflareBindings;
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
