import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { err, ok, type Result } from "@repo/type-safe-errors";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { ColorPickerField } from "~/components/color-picker";
import { TagCard } from "~/components/tag-card";
import { TagPicker } from "~/components/tag-picker";
import { clearQueryCache } from "~/data/cache";
import { linksQuery } from "~/data/links";
import { createTag, deleteTag, tagsQuery, updateTag } from "~/data/tags";
import type { Tag } from "~/data/types";
import type { Route } from "./+types/tags";

type HiddenField<T extends string> = {
  name: T;
  value: string;
};

export type Action =
  | {
      name: "create";
      hiddenFields: [];
    }
  | {
      name: "update";
      hiddenFields: [HiddenField<"id">];
    }
  | {
      name: "delete";
      hiddenFields: [HiddenField<"id">];
    };

const actionTypeName = "_action";

export function getActionName<T extends Action["name"]>(name: T): T {
  return name;
}

export function useActionIsLoading(actionName: Action["name"]) {
  const navigation = useNavigation();
  return (
    navigation.state === "submitting" &&
    navigation.formData?.get(actionTypeName) === actionName
  );
}

type ActionData = Result<
  {
    action: Action["name"];
  },
  {
    action: Action["name"] | null;
    message: string;
  }
>;

export function useActionResult(actionName: Action["name"]) {
  const actionData = useActionData<ActionData>();

  if (actionData?.ok && actionData.value.action === actionName) {
    return actionData;
  }

  if (!actionData?.ok && actionData?.error.action === actionName) {
    return actionData;
  }

  return null;
}

export function ActionMetadata({ action }: { action: Action }) {
  return (
    <>
      <input type="hidden" name={actionTypeName} value={action.name} />
      {action.hiddenFields.map((field) => (
        <input type="hidden" name={field.name} value={field.value} />
      ))}
    </>
  );
}

function DisplayErrorMessage({
  actionData,
}: {
  actionData: ActionData | null;
}) {
  if (!actionData) return null;
  if (actionData?.ok) return null;
  return <p className="text-red-500">{actionData?.error.message}</p>;
}

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const [tags, links] = await Promise.all([
    tagsQuery.getData(),
    linksQuery.getData(),
  ]);
  return { tags, links };
}

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionData> {
  clearQueryCache();

  const formData = await request.formData();
  const action = formData.get(actionTypeName);

  if (action === getActionName("create")) {
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    const result = await createTag({ name, color });

    if (!result.ok)
      return err({
        action,
        message: result.error,
      });
    return ok({ action });
  }

  if (action === getActionName("update")) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    const result = await updateTag({ id, name, color });

    if (!result.ok)
      return err({
        action,
        message: result.error,
      });
    return ok({ action });
  }

  if (action === getActionName("delete")) {
    const id = formData.get("id") as string;
    const result = await deleteTag(id);

    if (!result.ok)
      return err({
        action,
        message: result.error,
      });

    return ok({ action });
  }

  return err({ action: null, message: "Invalid action" });
}

interface AddTagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddTagModal({ isOpen, onClose }: AddTagModalProps) {
  const actionName = getActionName("create");

  const actionData = useActionResult(actionName);
  const isLoading = useActionIsLoading(actionName);

  useEffect(() => {
    if (actionData?.ok) onClose();
  }, [actionData, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <Form method="post">
          <ActionMetadata
            action={{
              name: actionName,
              hiddenFields: [],
            }}
          />
          <ModalHeader>Add New Tag</ModalHeader>
          <ModalBody>
            <DisplayErrorMessage actionData={actionData} />
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
            <Button color="primary" type="submit" isLoading={isLoading}>
              Add Tag
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}

interface EditTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTag: Tag | null;
}

function EditTagModal({ isOpen, onClose, editingTag }: EditTagModalProps) {
  const actionName = "update";
  const actionData = useActionResult(actionName);
  const isLoading = useActionIsLoading(actionName);

  useEffect(() => {
    if (actionData?.ok) onClose();
  }, [actionData, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <Form method="post">
          <ActionMetadata
            action={{
              name: actionName,
              hiddenFields: [{ name: "id", value: editingTag?.id ?? "" }],
            }}
          />
          <ModalHeader>Edit Tag</ModalHeader>
          <ModalBody>
            <DisplayErrorMessage actionData={actionData} />
            <Input
              name="name"
              label="Name"
              placeholder="Enter tag name"
              defaultValue={editingTag?.name}
              required
            />
            <ColorPickerField name="color" />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading}>
              Update Tag
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}

interface DeleteTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletingTag: Tag | null;
}

function DeleteTagModal({ isOpen, onClose, deletingTag }: DeleteTagModalProps) {
  const actionName = getActionName("delete");
  const actionData = useActionResult(actionName);
  const isLoading = useActionIsLoading(actionName);

  useEffect(() => {
    if (actionData?.ok) onClose();
  }, [actionData, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <Form method="post">
          <ActionMetadata
            action={{
              name: actionName,
              hiddenFields: [{ name: "id", value: deletingTag?.id ?? "" }],
            }}
          />
          <ModalHeader>Delete Tag</ModalHeader>
          <ModalBody>
            <DisplayErrorMessage actionData={actionData} />
            <p>
              Are you sure you want to delete "{deletingTag?.name}"? This will
              remove the tag from all associated links.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" type="submit" isLoading={isLoading}>
              Delete
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}

interface TagHeaderProps {
  onAddOpen: () => void;
}

function TagHeader({ onAddOpen }: TagHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-3xl font-bold">Tags</h1>
      <Button
        color="primary"
        onPress={onAddOpen}
        startContent={<Plus size={20} />}
      >
        Add Tag
      </Button>
    </div>
  );
}

interface TagSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function TagSearch({ searchQuery, setSearchQuery }: TagSearchProps) {
  return (
    <div className="flex-1">
      <Input
        placeholder="Search tags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        startContent={<Search size={18} />}
      />
    </div>
  );
}

interface TagGridProps {
  filteredTags: Tag[];
  getLinkCount: (tagId: string) => number;
  handleEdit: (tag: Tag) => void;
  handleDelete: (tag: Tag) => void;
}

function TagGrid({
  filteredTags,
  getLinkCount,
  handleEdit,
  handleDelete,
}: TagGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTags.map((tag) => (
        <TagCard
          key={tag.id}
          tag={tag}
          linkCount={getLinkCount(tag.id)}
          onEdit={() => handleEdit(tag)}
          onDelete={() => handleDelete(tag)}
        />
      ))}
    </div>
  );
}

function useFilteredTags(tags: Tag[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);

  const filteredTags = useMemo(() => {
    return tags.filter((tag) => {
      const matchesSearch = tag.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        selectedTagFilters.length === 0 || selectedTagFilters.includes(tag.id);
      return matchesSearch && matchesFilter;
    });
  }, [tags, searchQuery, selectedTagFilters]);

  return {
    filteredTags,
    searchQuery,
    setSearchQuery,
    selectedTagFilters,
    setSelectedTagFilters,
  };
}

export default function Tags() {
  const { tags, links } = useLoaderData<typeof clientLoader>();

  if (!tags.ok) {
    return <div>Error loading tags {tags.error}</div>;
  }
  if (!links.ok) {
    return <div>Error loading links {links.error}</div>;
  }

  const {
    filteredTags,
    searchQuery,
    setSearchQuery,
    selectedTagFilters,
    setSelectedTagFilters,
  } = useFilteredTags(tags.value);

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);

  const getLinkCount = (tagId: string) => {
    return links.value.filter((link) =>
      link.tags.some((tag) => tag.id === tagId),
    ).length;
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    onEditOpen();
  };

  const handleDelete = (tag: Tag) => {
    setDeletingTag(tag);
    onDeleteOpen();
  };

  return (
    <div className="space-y-6">
      <TagHeader onAddOpen={onAddOpen} />

      <div className="flex flex-col gap-4">
        <TagSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <TagPicker
          tags={tags.value}
          selectedTagFilters={selectedTagFilters}
          setSelectedTagFilters={setSelectedTagFilters}
        />
      </div>

      <TagGrid
        filteredTags={filteredTags}
        getLinkCount={getLinkCount}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <AddTagModal isOpen={isAddOpen} onClose={onAddClose} />
      <EditTagModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        editingTag={editingTag}
      />
      <DeleteTagModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        deletingTag={deletingTag}
      />
    </div>
  );
}
