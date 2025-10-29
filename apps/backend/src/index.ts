import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { appFactory } from "./app-factory";
import { getAuth } from "./auth";
import { linksApp } from "./links";
import { customLogger } from "./logger";
import {
  type FeaturePermissionName,
  featurePermissionsApp,
} from "./permissions/permissions";
import { tagsApp } from "./tags";

const authApp = appFactory
  .createApp()
  .on(["POST", "GET"], "/api/auth/*", (c) => {
    const auth = getAuth({
      prisma: c.get("prisma"),
      BETTER_AUTH_URL: c.env.BETTER_AUTH_URL,
      BETTER_AUTH_SECRET: c.env.BETTER_AUTH_SECRET,
      CORS_ORIGINS: c.env.CORS_ORIGINS.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    });

    return auth.handler(c.req.raw);
  })
  .use("*", async (c, next) => {
    const auth = getAuth({
      prisma: c.get("prisma"),
      BETTER_AUTH_URL: c.env.BETTER_AUTH_URL,
      BETTER_AUTH_SECRET: c.env.BETTER_AUTH_SECRET,
      CORS_ORIGINS: c.env.CORS_ORIGINS.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    });

    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    c.get("logger").info(session?.user.id, "Current user");

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  });

const app = new Hono<{
  Bindings: CloudflareBindings;
}>()
  .use(logger(customLogger))
  .use("*", (c, next) => {
    return cors({
      origin: (c.env.CORS_ORIGINS || "")
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })(c, next);
  })
  .route("/", authApp)
  .route("/", linksApp)
  .route("/", tagsApp)
  .route("/", featurePermissionsApp)
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .onError((error, c) => {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    return c.json({ error: error.message }, 500);
  });

export type AppType = typeof app;

export default app;
export type { FeaturePermissionName };
