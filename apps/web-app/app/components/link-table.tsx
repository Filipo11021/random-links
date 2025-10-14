import {
  Button,
  ButtonGroup,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Edit, ExternalLink, Trash2 } from "lucide-react";
import type { Link, Tag } from "../data/types";

interface LinkTableProps {
  links: Link[];
  tags: Tag[];
  onEdit: (link: Link) => void;
  onDelete: (link: Link) => void;
}

export function LinkTable({ links, tags, onEdit, onDelete }: LinkTableProps) {
  return (
    <Table aria-label="Links table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>URL</TableColumn>
        <TableColumn>TAGS</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody emptyContent="No links found">
        {links.map((link) => {
          const linkTags = tags.filter((tag) =>
            link.tags.some((t) => t.id === tag.id),
          );
          return (
            <TableRow key={link.id}>
              <TableCell className="font-medium">{link.name}</TableCell>
              <TableCell>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {link.url.substring(0, 50)}
                  {link.url.length > 50 ? "..." : ""}
                  <ExternalLink size={14} />
                </a>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {linkTags.map((tag) => (
                    <Chip
                      key={tag.id}
                      size="sm"
                      style={{ backgroundColor: tag.color, color: "#fff" }}
                    >
                      {tag.name}
                    </Chip>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <ButtonGroup size="sm" variant="flat">
                  <Button isIconOnly onClick={() => onEdit(link)}>
                    <Edit size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    onPress={() => onDelete(link)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
