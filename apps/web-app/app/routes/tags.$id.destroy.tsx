import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { err, type Result } from "@repo/type-safe-errors";
import {
  redirect,
  useFetcher,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { deleteTag } from "~/data/tags";
import type { Tag } from "~/data/types";
import type { Route } from "./+types/tags.$id.destroy";

type ActionData = Result<void, { message: string }>;

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionData> {
  const formData = await request.formData();

  const id = formData.get("id") as string;

  const result = await deleteTag(id);
  if (!result.ok) {
    return err({ message: result.error ?? "Failed to delete tag" });
  }

  throw redirect("..");
}

export default function DestroyTagModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const state = useDestroyState();
  const fetcher = useFetcher<ActionData>();
  const isPending = fetcher.state !== "idle";
  const { isError, error } = useActionError(fetcher.data);

  if (!id) throw new Error("Tag ID not found");
  if (!state?.tag) throw new Error("Tag not found");

  async function onClose() {
    await navigate("..");
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent>
        <fetcher.Form method="post">
          <input hidden name="id" value={id} />
          <ModalHeader>Delete Tag</ModalHeader>
          <ModalBody>
            {isError && <Alert color="danger">{error}</Alert>}
            <p>
              Are you sure you want to delete "{state.tag.name}"? This will
              remove the tag from all associated links.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" type="submit" isLoading={isPending}>
              Delete
            </Button>
          </ModalFooter>
        </fetcher.Form>
      </ModalContent>
    </Modal>
  );
}

function useDestroyState() {
  const location = useLocation();
  return location.state as { tag?: Tag } | undefined;
}

function useActionError(data: ActionData | undefined) {
  if (data?.ok === false) {
    return {
      isError: true,
      error: data.error?.message,
    } as const;
  }

  return {
    isError: false,
  } as const;
}
