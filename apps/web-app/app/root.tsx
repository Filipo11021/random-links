import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { UIProvider } from "~/ui/ui-provider";
import type { Route } from "./+types/root";
import { authClient } from "./auth-client";
import { userContext } from "./context";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const authMiddleware: Route.ClientMiddlewareFunction = async (
  { context, request },
  next,
) => {
  const session = await authClient.getSession();
  const user = session.data?.user;

  if (user) {
    context.set(userContext, user);
    return next();
  }

  const isNotProtectedRoute = new URL(request.url).pathname.startsWith("/auth");
  if (isNotProtectedRoute) return next();

  throw redirect("/auth/login");
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authMiddleware,
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <UIProvider>
      <div className="min-h-screen bg-gray-50">
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
          </NavbarContent>
        </Navbar>
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </UIProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
