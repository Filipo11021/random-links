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
import {
  redirect,
  useFetcher,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { updateLink } from "~/data/links";
import type { Link, Tag } from "~/data/types";
import type { Route } from "./+types/links.$id.edit";

type ActionData = Result<void, { message: string }>;

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionData> {
  const formData = await request.formData();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const tagIds = formData.getAll("tagIds") as string[];

  const result = await updateLink({ id, name, url, tagIds });

  if (!result.ok) {
    return err({
      message: result.error ?? "Failed to update link",
    });
  }

  throw redirect("..");
}

export default function EditLinkModal() {
  const navigate = useNavigate();

  const { id } = useParams();
  const state = useEditState();

  const fetcher = useFetcher<ActionData>();
  const isPending = fetcher.state !== "idle";
  const { isError, error } = useActionError(fetcher.data);

  if (!id) throw new Error("Link ID not found");
  if (!state?.link || !state?.tags) throw new Error("Link or tags not found");

  async function onClose() {
    await navigate("..");
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent>
        <fetcher.Form method="post">
          <input hidden name="id" value={id} />
          <ModalHeader>Edit Link</ModalHeader>
          <ModalBody>
            {isError && <Alert color="danger">{error}</Alert>}
            <Input
              name="name"
              label="Name"
              placeholder="Enter link name"
              defaultValue={state.link.name}
              required
            />
            <Input
              name="url"
              label="URL"
              placeholder="https://example.com"
              type="url"
              defaultValue={state.link.url}
              required
            />
            <Select
              name="tagIds"
              label="Tags"
              selectionMode="multiple"
              placeholder="Select tags"
              defaultSelectedKeys={state.link.tags.map((tag) => tag.id)}
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
              Update Link
            </Button>
          </ModalFooter>
        </fetcher.Form>
      </ModalContent>
    </Modal>
  );
}

function useEditState() {
  const location = useLocation();
  return location.state as { link?: Link; tags?: Tag[] } | undefined;
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
