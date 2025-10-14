import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma";

export const getAuth = (env: {
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  CORS_ORIGINS: string[];
  prisma: PrismaClient;
}) => {
  return betterAuth({
    database: prismaAdapter(env.prisma, {
      provider: "sqlite",
    }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: env.CORS_ORIGINS,
  });
};

export type Auth = ReturnType<typeof getAuth>;
