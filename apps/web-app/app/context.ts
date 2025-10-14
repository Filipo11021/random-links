import type { User } from "better-auth";
import { createContext } from "react-router";

export const userContext = createContext<User | null>(null);
