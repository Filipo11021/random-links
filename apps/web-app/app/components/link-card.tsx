import {
  Button,
  ButtonGroup,
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Tooltip,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import type { Link as LinkItem } from "../data/types";
import { GenerateAiSummaryButton } from "./ai-summary";

interface LinkCardProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDelete: (link: LinkItem) => void;
  aiSummary: {
    handler: () => void;
    isPending: boolean;
    enabled: boolean;
  };
}

export function LinkCard({ link, onEdit, onDelete, aiSummary }: LinkCardProps) {
  const linkDomain = new URL(link.url).hostname;

  return (
    <Card className="justify-between">
      <CardHeader className="flex items-start flex-1 justify-between">
        <a href={link.url} target="_blank" rel="noopener noreferrer">
          <p className="text-sm text-default-600">{linkDomain}</p>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{link.name}</h3>
          </div>
        </a>

        <ButtonGroup size="sm" variant="flat">
          <GenerateAiSummaryButton
            type="button"
            onPress={aiSummary.handler}
            isPending={aiSummary.isPending}
            enabled={aiSummary.enabled}
          />
          <Tooltip closeDelay={150} content="Edit">
            <Button isIconOnly onPress={() => onEdit(link)}>
              <Edit size={16} />
              <span className="sr-only">Edit</span>
            </Button>
          </Tooltip>
          <Tooltip closeDelay={150} content="Delete">
            <Button isIconOnly color="danger" onPress={() => onDelete(link)}>
              <Trash2 size={16} />
              <span className="sr-only">Delete</span>
            </Button>
          </Tooltip>
        </ButtonGroup>
      </CardHeader>
      <CardFooter>
        <div className="flex flex-col gap-2 flex-1">
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
        </div>
      </CardFooter>
    </Card>
  );
}
