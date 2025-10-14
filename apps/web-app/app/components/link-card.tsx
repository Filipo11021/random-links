import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Chip,
} from "@heroui/react";
import { Edit, ExternalLink, Trash2 } from "lucide-react";
import type { Link } from "../data/types";

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (link: Link) => void;
}

export function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-start pb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{link.name}</h3>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
          >
            {link.url}
            <ExternalLink size={14} />
          </a>
        </div>
        <ButtonGroup size="sm" variant="flat">
          <Button isIconOnly onClick={() => onEdit(link)}>
            <Edit size={16} />
          </Button>
          <Button isIconOnly color="danger" onClick={() => onDelete(link)}>
            <Trash2 size={16} />
          </Button>
        </ButtonGroup>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="flex flex-wrap gap-2">
          {link.tags.map((tag) => (
            <Chip
              key={tag.id}
              size="sm"
              style={{ backgroundColor: tag.color, color: "#fff" }}
            >
              {tag.name}
            </Chip>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
