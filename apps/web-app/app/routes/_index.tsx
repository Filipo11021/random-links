import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { err, ok, type Result } from "@repo/type-safe-errors";
import { Grid3x3, List, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { LinkCard } from "~/components/link-card";
import { LinkTable } from "~/components/link-table";
import { TagPicker } from "~/components/tag-picker";
import { createLink, deleteLink, linksQuery, updateLink } from "~/data/links";
import { tagsQuery } from "~/data/tags";
import type { Link } from "~/data/types";
import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const [links, tags] = await Promise.all([
    linksQuery.getData(),
    tagsQuery.getData(),
  ]);

  return { links, tags };
}

type ActionData = Result<
  {
    action: "create" | "update" | "delete";
  },
  {
    action: "create" | "update" | "delete" | null;
    message: string;
  }
>;

function DisplayErrorMessage({
  actionData,
}: {
  actionData: ActionData | null | undefined;
}) {
  if (!actionData || actionData.ok) return null;

  return <p className="text-red-500">{actionData.error.message}</p>;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");

  linksQuery.clearCache();

  if (action === "create") {
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const tagIds = formData.getAll("tagIds") as string[];

    const result = await createLink({ name, url, tagIds });

    if (!result.ok) {
      return err({
        action: "create",
        message: result.error,
      });
    }

    return ok({ action: "create" });
  }

  if (action === "update") {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const tagIds = formData.getAll("tagIds") as string[];

    const result = await updateLink({ id, name, url, tagIds });

    if (!result.ok) {
      return err({
        action: "update",
        message: result.error,
      });
    }

    return ok({ action: "update" });
  }

  if (action === "delete") {
    const id = formData.get("id") as string;

    const result = await deleteLink(id);

    if (!result.ok) {
      return err({
        action: "delete",
        message: result.error,
      });
    }

    return ok({ action: "delete" });
  }

  return err({ action, message: "Invalid action" });
}

export default function Home() {
  const { links, tags } = useLoaderData<typeof clientLoader>();
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const actionData = useActionData<ActionData>();

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

  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [deletingLink, setDeletingLink] = useState<Link | null>(null);

  useEffect(() => {
    if (actionData?.ok) {
      onAddClose();
      onEditClose();
      onDeleteClose();
      setEditingLink(null);
      setDeletingLink(null);
    }
  }, [
    actionData,
    onAddClose,
    onEditClose,
    onDeleteClose,
    setEditingLink,
    setDeletingLink,
  ]);

  if (!links.ok) {
    return <div>Error loading links {links.error}</div>;
  }
  if (!tags.ok) {
    return <div>Error loading tags {tags.error}</div>;
  }

  const filteredLinks = links.value.filter((link) => {
    const matchesSearch =
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag =
      selectedTagFilters.length === 0 ||
      selectedTagFilters.every((selectedTagId) =>
        link.tags.some((tag) => tag.id === selectedTagId),
      );
    return matchesSearch && matchesTag;
  });

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    onEditOpen();
  };

  const handleDelete = (link: Link) => {
    setDeletingLink(link);
    onDeleteOpen();
  };

  const isLoading = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Links</h1>
        <div className="flex gap-2">
          <Button
            color="default"
            variant={viewMode === "grid" ? "solid" : "flat"}
            isIconOnly
            onPress={() => setViewMode("grid")}
          >
            <Grid3x3 size={20} />
          </Button>
          <Button
            color="default"
            variant={viewMode === "table" ? "solid" : "flat"}
            isIconOnly
            onPress={() => setViewMode("table")}
          >
            <List size={20} />
          </Button>
          <Button
            color="primary"
            onPress={onAddOpen}
            startContent={<Plus size={20} />}
          >
            Add Link
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search size={18} />}
          className="flex-1"
        />
        <TagPicker
          tags={tags.value}
          selectedTagFilters={selectedTagFilters}
          setSelectedTagFilters={setSelectedTagFilters}
        />
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <LinkTable
          links={filteredLinks}
          tags={tags.value}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalContent>
          <Form method="post">
            <input type="hidden" name="_action" value="create" />
            <ModalHeader>Add New Link</ModalHeader>
            <ModalBody>
              <DisplayErrorMessage actionData={actionData} />
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
                {tags.value.map((tag) => (
                  <SelectItem key={tag.id}>{tag.name}</SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onAddClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Add Link
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalContent>
          <Form method="post">
            <input type="hidden" name="_action" value="update" />
            <input type="hidden" name="id" value={editingLink?.id} />
            <ModalHeader>Edit Link</ModalHeader>
            <ModalBody>
              <DisplayErrorMessage actionData={actionData} />
              <Input
                name="name"
                label="Name"
                placeholder="Enter link name"
                defaultValue={editingLink?.name}
                required
              />
              <Input
                name="url"
                label="URL"
                placeholder="https://example.com"
                type="url"
                defaultValue={editingLink?.url}
                required
              />
              <Select
                name="tagIds"
                label="Tags"
                selectionMode="multiple"
                placeholder="Select tags"
                defaultSelectedKeys={editingLink?.tags.map((tag) => tag.id)}
              >
                {tags.value.map((tag) => (
                  <SelectItem key={tag.id}>{tag.name}</SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onEditClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Update Link
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <Form method="post">
            <input type="hidden" name="_action" value="delete" />
            <input type="hidden" name="id" value={deletingLink?.id} />
            <ModalHeader>Delete Link</ModalHeader>
            <ModalBody>
              <DisplayErrorMessage actionData={actionData} />
              <p>Are you sure you want to delete "{deletingLink?.name}"?</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onDeleteClose}>
                Cancel
              </Button>
              <Button color="danger" type="submit" isLoading={isLoading}>
                Delete
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </div>
  );
}
