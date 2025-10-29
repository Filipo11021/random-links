import { err, ok, type Result } from "@repo/type-safe-errors";
import type { Link } from "~/data/types";
import { apiClient } from "./api-client";
import { createQuery } from "./cache";

export const getAllLinks = async (options?: {
  signal?: AbortSignal;
}): Promise<Result<Link[], string>> => {
  const res = await apiClient.links.$get(
    { query: { tags: [] } },
    {
      init: {
        signal: options?.signal,
      },
    },
  );
  const data = await res.json();

  if ("error" in data) return err(data.error);

  return ok(data);
};

export const linksQuery = createQuery({
  cacheKey: "links",
  fetcher: getAllLinks,
});

export const createLink = async (input: {
  name: string;
  url: string;
  tagIds: string[];
}): Promise<Result<{}, string>> => {
  const res = await apiClient.links.$post({ json: input });
  const data = await res.json();

  if ("error" in data) return err(data.error);

  return ok({});
};

export const updateLink = async (input: {
  name: string;
  url: string;
  id: string;
  tagIds: string[];
}): Promise<Result<{}, string>> => {
  const res = await apiClient.links.$put({ json: input });
  const data = await res.json();

  if ("error" in data) return err(data.error);

  return ok({});
};

export const deleteLink = async (id: string): Promise<Result<{}, string>> => {
  const res = await apiClient.links[":id"].$delete({ param: { id } });
  const data = await res.json();

  if ("error" in data) return err(data.error);

  return ok({});
};

export const linkAiSummary = async (
  id: string,
): Promise<Result<{ data: string }, string>> => {
  const res = await apiClient.links[":id"]["ai-summary"].$post({
    param: { id },
  });
  const json = await res.json();

  if ("error" in json) return err(json.error);

  return ok({ data: json.data });
};
