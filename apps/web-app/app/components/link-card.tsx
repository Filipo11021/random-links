import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Link,
} from "@heroui/react";
import { Edit, ExternalLink, Trash2 } from "lucide-react";
import type { Link as LinkItem } from "../data/types";

interface LinkCardProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDelete: (link: LinkItem) => void;
}

export function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  const linkDomain = new URL(link.url).hostname;

  return (
    <Card className="flex flex-col gap-1">
      <CardHeader className="flex gap-2 items-start">
        <div className="w-full flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold">{link.name}</h3>
            <p className="text-sm text-default-600">{linkDomain}</p>
          </div>
          <Link
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm flex gap-1"
          >
            Open in new tab
            <ExternalLink size={14} />
          </Link>
        </div>
        <ButtonGroup size="sm" variant="flat">
          <Button isIconOnly onPress={() => onEdit(link)}>
            <Edit size={16} />
          </Button>
          <Button isIconOnly color="danger" onPress={() => onDelete(link)}>
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
