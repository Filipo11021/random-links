import { err, ok, type Result } from "@repo/type-safe-errors";
import { useFetcher } from "react-router";
import { linkAiSummary } from "~/data/links";
import type { Link } from "~/data/types";
import type { Route } from "./+types/ai-summary.$linkId";

type ActionData = Result<
  { data: string; linkId: string; linkName: string },
  { message: string }
>;

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionData> {
  const formData = await request.formData();
  const linkId = formData.get("linkId") as string;
  const linkName = formData.get("linkName") as string;

  const result = await linkAiSummary(linkId);
  if (!result.ok) {
    return err({ message: result.error ?? "Failed to generate AI summary" });
  }

  return ok({ data: result.value.data, linkId: linkId, linkName: linkName });
}

export function useGenerateAiSummary() {
  const fetcher = useFetcher<ActionData>();
  return {
    isPending: (linkId: string) =>
      fetcher.state !== "idle" &&
      fetcher.formAction === `/ai-summary/${linkId}`,
    data: fetcher.data,
    submit: (link: Link) =>
      fetcher.submit(
        { linkId: link.id, linkName: link.name },
        { method: "post", action: `/ai-summary/${link.id}` },
      ),
    reset: () => fetcher.unstable_reset(),
  };
}
