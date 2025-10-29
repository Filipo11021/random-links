import { createGroq } from "@ai-sdk/groq";
import { zValidator } from "@hono/zod-validator";
import { generateText } from "ai";
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
  )
  .post(
    "/links/:id/ai-summary",
    zValidator("param", z.object({ id: z.string().max(1000) })),
    async (c) => {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");

      const link = await c.get("prisma").link.findUnique({ where: { id } });
      if (!link) return c.json({ error: "Link not found" }, 404);

      if (link.userId !== user.id) {
        return c.json({ error: "You are not the owner of this link" }, 401);
      }

      const groq = createGroq({
        apiKey: c.env.GROQ_API_KEY,
      });

      const { text } = await generateText({
        model: groq("openai/gpt-oss-20b"),
        prompt: `
Summarize the content at this URL: ${link.url}.

Output format: Markdown unordered list. Each list item must follow this exact format: **Title** - Description

- Provide bullet points that capture the main ideas, key takeaways, and any clear conclusions.
   - Keep each bullet concise.
   - Use plain, easy-to-understand language.
- If the page is behind a paywall or unreachable, say so and extract whatever is visible.
- No long quotes; no extra commentary or analysis unless it's an explicit main takeaway.
- Output only Markdown.
        `,
        tools: {
          browser_search: groq.tools.browserSearch({}),
        },
        toolChoice: "required",
        providerOptions: {
          groq: {
            reasoningEffort: "low",
          },
        },
        topP: 1,
        temperature: 1,
        maxOutputTokens: 8192,
      });

      return c.json({ data: text });
    },
  );
