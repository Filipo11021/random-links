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
import { redirect, useFetcher, useNavigate } from "react-router";
import { ColorPickerField } from "~/components/color-picker";
import { createTag } from "~/data/tags";
import type { Route } from "./+types/tags.new";

type ActionData = Result<void, { message: string }>;

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionData> {
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const color = formData.get("color") as string;
  const result = await createTag({ name, color });

  if (!result.ok) {
    return err({ message: result.error ?? "Failed to create tag" });
  }

  throw redirect("..");
}

export default function NewTagModal() {
  const navigate = useNavigate();
  const fetcher = useFetcher<ActionData>();
  const isPending = fetcher.state !== "idle";
  const { isError, error } = useActionError(fetcher.data);

  function onClose() {
    navigate("..");
  }

  console.log(fetcher.data);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent>
        <fetcher.Form method="post">
          <ModalHeader>Add New Tag</ModalHeader>
          <ModalBody>
            {isError && <Alert color="danger">{error}</Alert>}
            <Input
              name="name"
              label="Name"
              placeholder="Enter tag name"
              required
            />
            <ColorPickerField name="color" />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isPending}>
              Add Tag
            </Button>
          </ModalFooter>
        </fetcher.Form>
      </ModalContent>
    </Modal>
  );
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
