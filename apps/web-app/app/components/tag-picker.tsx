import { Button, Chip } from "@heroui/react";
import type { Tag } from "~/data/types";

interface TagPickerProps {
  tags: Tag[];
  selectedTagFilters: string[];
  setSelectedTagFilters: (tags: string[]) => void;
  className?: string;
  maxVisibleTags?: number;
}

export function TagPicker({
  tags,
  selectedTagFilters,
  setSelectedTagFilters,
  className = "",
  maxVisibleTags = 5,
}: TagPickerProps) {
  if (tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisibleTags);

  const handleTagToggle = (tagId: string) => {
    if (selectedTagFilters.includes(tagId)) {
      setSelectedTagFilters(selectedTagFilters.filter((id) => id !== tagId));
    } else {
      setSelectedTagFilters([...selectedTagFilters, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTagFilters(selectedTagFilters.filter((id) => id !== tagId));
  };

  return (
    <div className={`flex gap-2 flex-wrap min-h-[2.5rem] ${className}`}>
      {visibleTags.map((tag) => {
        const isSelected = selectedTagFilters.includes(tag.id);
        return (
          <Chip
            key={tag.id}
            onClick={() => handleTagToggle(tag.id)}
            onClose={isSelected ? () => handleRemoveTag(tag.id) : undefined}
            style={{
              backgroundColor: tag.color,
              color: "#fff",
              opacity: isSelected ? 1 : 0.7,
            }}
            className={`cursor-pointer transition-all duration-200 ${
              isSelected
                ? "ring-2 ring-white ring-opacity-50 shadow-lg"
                : "hover:opacity-100 hover:shadow-md"
            }`}
          >
            {tag.name}
          </Chip>
        );
      })}

      {tags.length > maxVisibleTags && (
        <Button
          size="sm"
          variant="flat"
          onPress={() => {
            const nextTag = tags[maxVisibleTags];
            if (nextTag) {
              handleTagToggle(nextTag.id);
            }
          }}
        >
          +{tags.length - maxVisibleTags} more
        </Button>
      )}
    </div>
  );
}
