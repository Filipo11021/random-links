import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
} from "@heroui/react";
import { SparklesIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function GenerateAiSummaryButton({
  isPending,
  type,
  onPress,
}: {
  isPending: boolean;
  type: "button";
  onPress: () => void;
}) {
  return (
    <Tooltip closeDelay={150} content="AI Summary">
      <Button
        color="secondary"
        isIconOnly
        isLoading={isPending}
        type={type}
        onPress={onPress}
      >
        <SparklesIcon size={16} />
        <span className="sr-only">AI Summary</span>
      </Button>
    </Tooltip>
  );
}

export function AiSummaryModal({
  isOpen,
  setIsOpen,
  children,
  linkTitle,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: string;
  linkTitle: string;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader>
          <span className="line-clamp-2 mr-2">AI Summary for {linkTitle}</span>
        </ModalHeader>
        <ModalBody>
          <ReactMarkdown>{children}</ReactMarkdown>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
