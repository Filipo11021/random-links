import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useTheme } from "@heroui/use-theme";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" isIconOnly size="md">
          {theme === "dark" && <MoonIcon />}
          {theme === "light" && <SunIcon />}
          {theme === "system" && <MonitorIcon />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu onAction={(key) => setTheme(key as string)}>
        <DropdownItem key="light">Light</DropdownItem>
        <DropdownItem key="dark">Dark</DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
