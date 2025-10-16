import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import type { User } from "better-auth";
import { NavLink } from "react-router";
import { LogoutActionForm } from "./routes/auth.logout";

export function AppNavbar({ user }: { user: User | null }) {
  return (
    <Navbar isBordered maxWidth="full">
      <NavbarBrand>
        <p className="font-bold text-xl">Random Links</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "text-foreground"
            }
          >
            Links
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            to="/tags"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "text-foreground"
            }
          >
            Tags
          </NavLink>
        </NavbarItem>

        {user && <UserButton user={user} />}
      </NavbarContent>
    </Navbar>
  );
}

function UserButton({ user }: { user: User }) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          className="transition-transform cursor-pointer"
          color="secondary"
          name={user.name}
          size="sm"
          src={user.image ?? undefined}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{user.email}</p>
        </DropdownItem>

        {/*
         Wrapping DropdownItem directly with LogoutActionForm causes a "type.getCollectionNode is not a function" error.
         Instead, render the LogoutActionForm inside DropdownItem like official recommendation
         See: https://github.com/heroui-inc/heroui/issues/729#issuecomment-1804504964
        */}
        <DropdownItem key="logout" color="danger">
          <LogoutActionForm>
            <button className="w-full cursor-pointer" type="submit">
              Log Out
            </button>
          </LogoutActionForm>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
