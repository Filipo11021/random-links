import {
  Alert,
  Button,
  Input,
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
import { ColorPickerField } from "~/components/color-picker";
import { updateTag } from "~/data/tags";
import type { Tag } from "~/data/types";
import type { Route } from "./+types/tags.$id.edit";

type ActionData = Result<void, { message: string }>;

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionData> {
  const formData = await request.formData();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const color = formData.get("color") as string;

  const result = await updateTag({ id, name, color });

  if (!result.ok) {
    return err({ message: result.error ?? "Failed to update tag" });
  }

  throw redirect("..");
}

export default function EditTagModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const state = useEditState();
  const fetcher = useFetcher<ActionData>();
  const isPending = fetcher.state !== "idle";
  const { isError, error } = useActionError(fetcher.data);

  if (!id) throw new Error("Tag ID not found");
  if (!state?.tag) throw new Error("Tag not found");

  function onClose() {
    navigate("..");
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent>
        <fetcher.Form method="post">
          <input hidden name="id" value={id} />
          <ModalHeader>Edit Tag</ModalHeader>
          <ModalBody>
            {isError && <Alert color="danger">{error}</Alert>}
            <Input
              name="name"
              label="Name"
              placeholder="Enter tag name"
              defaultValue={state.tag.name}
              required
            />
            <ColorPickerField name="color" />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isPending}>
              Update Tag
            </Button>
          </ModalFooter>
        </fetcher.Form>
      </ModalContent>
    </Modal>
  );
}

function useEditState() {
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
