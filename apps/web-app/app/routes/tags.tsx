import { Button, Input } from "@heroui/react";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { TagCard } from "~/components/tag-card";
import { TagPicker } from "~/components/tag-picker";
import { linksQuery } from "~/data/links";
import { tagsQuery } from "~/data/tags";
import type { Tag } from "~/data/types";
import type { Route } from "./+types/tags";

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const [tags, links] = await Promise.all([
    tagsQuery.getData(),
    linksQuery.getData(),
  ]);

  return { tags, links };
}

export default function Tags() {
  const { tags, links } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  if (!tags.ok || !links.ok) {
    throw new Error("Failed to load data, please try refreshing the page.");
  }

  const {
    filteredTags,
    searchQuery,
    setSearchQuery,
    selectedTagFilters,
    setSelectedTagFilters,
  } = useFilteredTags(tags.value);

  const getLinkCount = (tagId: string) => {
    return links.value.filter((link) =>
      link.tags.some((tag) => tag.id === tagId),
    ).length;
  };

  const handleEdit = async (tag: Tag) => {
    await navigate(`${tag.id}/edit`, { state: { tag } });
  };

  const handleDelete = async (tag: Tag) => {
    await navigate(`${tag.id}/destroy`, { state: { tag } });
  };

  const onAddOpen = async () => {
    await navigate("new");
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
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }

  return <div>An unexpected error occurred</div>;
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
