/**
 * Better Auth CLI configuration file
 *
 * Docs: https://www.better-auth.com/docs/concepts/cli
 */
import { PrismaD1 } from "@prisma/adapter-d1";
import { getAuth } from "./src/auth";
import { PrismaClient } from "./src/generated/prisma";

const { BETTER_AUTH_URL, BETTER_AUTH_SECRET, CORS_ORIGINS } = process.env;

const auth = getAuth({
  prisma: new PrismaClient({
    adapter: new PrismaD1({
      CLOUDFLARE_D1_TOKEN: process.env.CLOUDFLARE_D1_TOKEN!,
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID!,
      CLOUDFLARE_DATABASE_ID: process.env.CLOUDFLARE_DATABASE_ID!,
    }),
  }),
  BETTER_AUTH_URL: BETTER_AUTH_URL!,
  BETTER_AUTH_SECRET: BETTER_AUTH_SECRET!,
  CORS_ORIGINS: CORS_ORIGINS!
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
});
export default auth;
