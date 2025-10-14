import type { Tag } from "~/data/types";
import { apiClient } from "./api-client";

export const getAllTags = async (): Promise<Tag[] | { error: string }> => {
  const res = await apiClient.tags.$get({ query: {} });
  const data = await res.json();
  return data;
};

export const createTag = async (
  input: Omit<Tag, "id" | "createdAt">,
): Promise<void | { error: string }> => {
  const res = await apiClient.tags.$post({ json: input });
  const data = await res.json();
  if ("error" in data) {
    return { error: data.error };
  }
};

export const updateTag = async (
  input: Omit<Tag, "createdAt">,
): Promise<void | { error: string }> => {
  const res = await apiClient.tags.$put({ json: input });
  const data = await res.json();
  if ("error" in data) {
    return { error: data.error };
  }
};

export const deleteTag = async (
  id: string,
): Promise<void | { error: string }> => {
  const res = await apiClient.tags[":id"].$delete({ param: { id } });
  const data = await res.json();
  if ("error" in data) {
    return { error: data.error };
  }
};
