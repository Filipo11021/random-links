import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { appFactory } from "./app-factory";

export const linksApp = appFactory
  .createApp()
  .get(
    "/links",
    zValidator(
      "query",
      z.object({ tags: z.array(z.string().max(1000)).max(100).optional() }),
    ),
    async (c) => {
      const { tags } = c.req.valid("query");
      const user = c.get("user");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const links = await c.get("prisma").link.findMany({
        where: {
          ...(tags
            ? {
                tags: {
                  some: { name: { in: tags } },
                },
              }
            : {}),
          userId: user.id,
        },
        include: {
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return c.json(links);
    },
  )
  .post(
    "/links",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1).max(1000),
        url: z.url().max(1000),
        tagIds: z.array(z.string().max(1000)).max(100),
      }),
    ),
    async (c) => {
      const { name, url, tagIds } = c.req.valid("json");
      const user = c.get("user");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const link = await c.get("prisma").link.create({
        data: {
          name,
          url,
          userId: user.id,
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        },
      });

      return c.json(link);
    },
  )
  .delete(
    "/links/:id",
    zValidator("param", z.object({ id: z.string().max(1000) })),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await c.get("prisma").link.delete({ where: { id, userId: user.id } });

      return c.json({ success: true });
    },
  )
  .put(
    "/links",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1).max(1000),
        url: z.url().max(1000),
        id: z.string().max(1000),
        tagIds: z.array(z.string().max(1000)).max(100),
      }),
    ),
    async (c) => {
      const { id, name, url, tagIds } = c.req.valid("json");
      const user = c.get("user");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const link = await c.get("prisma").link.update({
        where: { id, userId: user.id },
        data: {
          name,
          url,
          tags: {
            set: tagIds.map((id) => ({ id })),
          },
        },
      });

      return c.json(link);
    },
  );
