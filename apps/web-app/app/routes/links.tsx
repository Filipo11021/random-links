import { Button, Input } from "@heroui/react";
import { Grid3x3, List, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { AiSummaryModal } from "~/components/ai-summary";
import { LinkCard } from "~/components/link-card";
import { LinkTable } from "~/components/link-table";
import { TagPicker } from "~/components/tag-picker";
import { linksQuery } from "~/data/links";
import { tagsQuery } from "~/data/tags";
import type { Link } from "~/data/types";
import type { Route } from "./+types/links";
import { useGenerateAiSummary } from "./ai-summary.$linkId";

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const [links, tags] = await Promise.all([
    linksQuery.getData(),
    tagsQuery.getData(),
  ]);

  return { links, tags };
}

export default function Links() {
  const { links, tags } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const aiSummary = useGenerateAiSummary();

  if (!links.ok || !tags.ok) {
    throw new Error("Failed to load data, please try refreshing the page.");
  }

  const filteredLinks = links.value.filter((link) => {
    const matchesSearch =
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTagFilters.every((selectedTagId) =>
      link.tags.some((tag) => tag.id === selectedTagId),
    );
    return matchesSearch && matchesTag;
  });

  const handleEdit = async (link: Link) => {
    await navigate(`${link.id}/edit`, {
      state: { link, tags: tags.value },
      preventScrollReset: true,
    });
  };

  const handleDelete = async (link: Link) => {
    await navigate(`${link.id}/destroy`, {
      state: { link },
      preventScrollReset: true,
    });
  };

  const onAddOpen = async () => {
    await navigate("new", { preventScrollReset: true });
  };

  return (
    <div className="space-y-6">
      <LinkHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddOpen={onAddOpen}
      />

      <LinkSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tags={tags.value}
        selectedTagFilters={selectedTagFilters}
        setSelectedTagFilters={setSelectedTagFilters}
      />

      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={handleEdit}
              onDelete={handleDelete}
              aiSummary={{
                isPending: aiSummary.isPending(link.id),
                handler: () => aiSummary.submit(link),
              }}
            />
          ))}
        </div>
      )}

      {viewMode === "table" && (
        <LinkTable
          links={filteredLinks}
          tags={tags.value}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {aiSummary.data?.ok === true && (
        <AiSummaryModal
          isOpen={true}
          setIsOpen={() => {
            aiSummary.reset();
          }}
          linkTitle={`${aiSummary.data.value.linkName}`}
        >
          {aiSummary.data?.value.data}
        </AiSummaryModal>
      )}

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

interface LinkHeaderProps {
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
  onAddOpen: () => void;
}

function LinkHeader({ viewMode, setViewMode, onAddOpen }: LinkHeaderProps) {
  return (
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
          <span className="sr-only">Cards view</span>
        </Button>

        <Button
          color="default"
          variant={viewMode === "table" ? "solid" : "flat"}
          isIconOnly
          onPress={() => setViewMode("table")}
        >
          <List size={20} />
          <span className="sr-only">Table view</span>
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
  );
}

interface LinkSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tags: any[];
  selectedTagFilters: string[];
  setSelectedTagFilters: (filters: string[]) => void;
}

function LinkSearch({
  searchQuery,
  setSearchQuery,
  tags,
  selectedTagFilters,
  setSelectedTagFilters,
}: LinkSearchProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search links..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        startContent={<Search size={18} />}
        className="flex-1"
      />
      <TagPicker
        tags={tags}
        selectedTagFilters={selectedTagFilters}
        setSelectedTagFilters={setSelectedTagFilters}
      />
    </div>
  );
}
