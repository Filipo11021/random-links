import { err, ok, type Result } from "@repo/type-safe-errors";
import type { Link } from "~/data/types";
import { apiClient } from "./api-client";

export const getAllLinks = async (): Promise<Result<Link[], string>> => {
  const res = await apiClient.links.$get({ query: { tags: [] } });
  const data = await res.json();

  if ("error" in data) return err(data.error);

  return ok(data);
};

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
