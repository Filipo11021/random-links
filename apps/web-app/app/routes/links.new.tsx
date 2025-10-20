import {
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { err, type Result } from "@repo/type-safe-errors";
import { redirect, useFetcher, useLocation, useNavigate } from "react-router";
import { createLink } from "~/data/links";
import type { Tag } from "~/data/types";
import type { Route } from "./+types/links.new";

type ActionData = Result<void, { message: string }>;

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionData> {
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const tagIds = formData.getAll("tagIds") as string[];

  const result = await createLink({ name, url, tagIds });

  if (!result.ok)
    return err({
      action: "create",
      message: result.error,
    });

  throw redirect("..");
}

export default function NewLinkModal() {
  const navigate = useNavigate();
  const state = useNewLinkState();
  const fetcher = useFetcher<ActionData>();
  const isPending = fetcher.state !== "idle";
  const { isError, error } = useActionError(fetcher.data);

  function onClose() {
    navigate("..");
  }

  if (!state?.tags) {
    return <div>Error loading tags</div>;
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent>
        <fetcher.Form method="post">
          <ModalHeader>Add New Link</ModalHeader>
          <ModalBody>
            {isError && <Alert color="danger">{error}</Alert>}
            <Input
              name="name"
              label="Name"
              placeholder="Enter link name"
              required
            />
            <Input
              name="url"
              label="URL"
              placeholder="https://example.com"
              type="url"
              required
            />
            <Select
              name="tagIds"
              label="Tags"
              selectionMode="multiple"
              placeholder="Select tags"
            >
              {state.tags.map((tag) => (
                <SelectItem key={tag.id}>{tag.name}</SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isPending}>
              Add Link
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

function useNewLinkState() {
  const location = useLocation();
  return location.state as { tags?: Tag[] } | undefined;
}
