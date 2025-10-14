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
import { getAllLinks } from "~/data/links";
import { createTag, deleteTag, getAllTags, updateTag } from "~/data/tags";
import type { Tag } from "~/data/types";
import type { Route } from "./+types/tags";

export async function clientLoader() {
  const [tags, links] = await Promise.all([getAllTags(), getAllLinks()]);
  return { tags, links };
}

type HiddenField<T extends string> = {
  name: T;
  value: string;
};

type Action =
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

function getActionName<T extends Action["name"]>(name: T): T {
  return name;
}

function useActionIsLoading(actionName: Action["name"]) {
  const navigation = useNavigation();
  return (
    navigation.state === "submitting" &&
    navigation.formData?.get(actionTypeName) === actionName
  );
}

function useActionResult(actionName: Action["name"]) {
  const actionData = useActionData<{ success: boolean; action: string }>();
  if (actionData?.action === actionName) {
    return actionData;
  }

  return null;
}

function ActionMetadata({ action }: { action: Action }) {
  return (
    <>
      <input type="hidden" name={actionTypeName} value={action.name} />
      {action.hiddenFields.map((field) => (
        <input type="hidden" name={field.name} value={field.value} />
      ))}
    </>
  );
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === getActionName("create")) {
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    await createTag({ name, color });
    return { success: true, action: getActionName("create") };
  }

  if (action === getActionName("update")) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    await updateTag({ id, name, color });
    return { success: true, action: getActionName("update") };
  }

  if (action === getActionName("delete")) {
    const id = formData.get("id") as string;
    await deleteTag(id);
    return { success: true, action: getActionName("delete") };
  }

  return { success: false, action };
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
    if (actionData?.success) onClose();
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
    if (actionData?.success) onClose();
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
    if (actionData?.success) onClose();
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

  if ("error" in tags) {
    return <div>Error loading tags {tags.error}</div>;
  }
  if ("error" in links) {
    return <div>Error loading links {links.error}</div>;
  }

  const {
    filteredTags,
    searchQuery,
    setSearchQuery,
    selectedTagFilters,
    setSelectedTagFilters,
  } = useFilteredTags(tags);

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
    return links.filter((link) => link.tags.some((tag) => tag.id === tagId))
      .length;
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
          tags={tags}
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
