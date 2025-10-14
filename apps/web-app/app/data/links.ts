import type { Link } from "~/data/types";
import { apiClient } from "./api-client";

export const getAllLinks = async (): Promise<Link[] | { error: string }> => {
  const res = await apiClient.links.$get({ query: { tags: [] } });
  const data = await res.json();
  return data;
};

export const createLink = async (input: {
  name: string;
  url: string;
  tagIds: string[];
}): Promise<void | { error: string }> => {
  const res = await apiClient.links.$post({ json: input });
  const data = await res.json();
  if ("error" in data) {
    return { error: data.error };
  }
};

export const updateLink = async (input: {
  name: string;
  url: string;
  id: string;
  tagIds: string[];
}): Promise<void | { error: string }> => {
  const res = await apiClient.links.$put({ json: input });
  const data = await res.json();
  if ("error" in data) {
    return { error: data.error };
  }
};

export const deleteLink = async (
  id: string,
): Promise<void | { error: string }> => {
  const res = await apiClient.links[":id"].$delete({ param: { id } });
  const data = await res.json();
  if ("error" in data) {
    return { error: data.error };
  }
};
