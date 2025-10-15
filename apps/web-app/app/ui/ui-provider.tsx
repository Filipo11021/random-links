import { HeroUIProvider } from "@heroui/react";
import type { ReactNode } from "react";

type UIProviderProps = {
  children: ReactNode;
};

export const UIProvider = ({ children }: UIProviderProps) => {
  return <HeroUIProvider>{children}</HeroUIProvider>;
};
