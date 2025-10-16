import { err, ok, type Result } from "@repo/type-safe-errors";
import type { Tag } from "~/data/types";
import { apiClient } from "./api-client";
import { createQuery } from "./cache";

export const getAllTags = async (options?: {
  signal?: AbortSignal;
}): Promise<Result<Tag[], string>> => {
  const res = await apiClient.tags.$get(
    { query: {} },
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

export const tagsQuery = createQuery({
  cacheKey: "tags",
  fetcher: getAllTags,
});

export const createTag = async (
  input: Omit<Tag, "id" | "createdAt">,
): Promise<Result<{}, string>> => {
  const res = await apiClient.tags.$post({ json: input });
  const data = await res.json();

  if ("error" in data) return err(data.error);

  return ok({});
};

export const updateTag = async (
  input: Omit<Tag, "createdAt">,
): Promise<Result<{}, string>> => {
  const res = await apiClient.tags.$put({ json: input });
  const data = await res.json();

  if ("error" in data) return err(data.error);

  return ok({});
};

export const deleteTag = async (id: string): Promise<Result<{}, string>> => {
  const res = await apiClient.tags[":id"].$delete({ param: { id } });
  const data = await res.json();

  if ("error" in data) return err(data.error);

  return ok({});
};
