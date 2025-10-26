import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { appFactory } from "./app-factory";

const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, {
  message:
    "Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).",
});

export const tagsApp = appFactory
  .createApp()
  .get(
    "/tags",
    zValidator("query", z.object({ name: z.string().optional() })),
    async (c) => {
      const { name } = c.req.valid("query");
      const user = c.get("user");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const tags = await c.get("prisma").tag.findMany({
        where: {
          name: {
            contains: name,
          },
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return c.json(tags);
    },
  )
  .post(
    "/tags",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1),
        color: hexColorSchema,
      }),
    ),
    async (c) => {
      const { name, color } = c.req.valid("json");
      const user = c.get("user");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const tag = await c.get("prisma").tag.create({
        data: {
          name,
          color,
          userId: user.id,
        },
      });

      return c.json(tag);
    },
  )
  .delete(
    "/tags/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");
      const prisma = c.get("prisma");

      if (!user) return c.json({ error: "Unauthorized" }, 401);

      await prisma.tag.delete({ where: { id, userId: user.id } });

      return c.json({ success: true });
    },
  )
  .put(
    "/tags",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1),
        id: z.string(),
        color: hexColorSchema,
      }),
    ),
    async (c) => {
      const { id, name, color } = c.req.valid("json");

      const user = c.get("user");
      const prisma = c.get("prisma");

      if (!user) return c.json({ error: "Unauthorized" }, 401);

      const tag = await prisma.tag.update({
        where: { id, userId: user.id },
        data: { name, color },
      });

      return c.json(tag);
    },
  );
