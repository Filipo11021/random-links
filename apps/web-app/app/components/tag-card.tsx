import { Button, ButtonGroup, Card, CardHeader } from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import type { Tag } from "../data/types";

interface TagCardProps {
  tag: Tag;
  linkCount: number;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}

export function TagCard({ tag, linkCount, onEdit, onDelete }: TagCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg"
            style={{ backgroundColor: tag.color }}
          />
          <div>
            <h3 className="text-lg font-semibold">{tag.name}</h3>

            <p className="text-sm text-gray-500">{linkCount} links</p>
          </div>
        </div>
        <ButtonGroup size="sm" variant="flat">
          <Button isIconOnly onClick={() => onEdit(tag)}>
            <Edit size={16} />
          </Button>
          <Button isIconOnly color="danger" onClick={() => onDelete(tag)}>
            <Trash2 size={16} />
          </Button>
        </ButtonGroup>
      </CardHeader>
    </Card>
  );
}
