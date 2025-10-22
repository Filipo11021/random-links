import { err, type Result } from "@repo/type-safe-errors";
import { Form, redirect } from "react-router";
import { authClient } from "~/auth-client";
import type { Route } from "./+types/auth.logout";

const logoutActionName = Symbol().toString();

type LogoutResult = Result<
  { action: string },
  { message: string; action: string }
>;

export function LogoutActionForm({
  children,
  ...rest
}: {
  children: React.ReactNode;
}) {
  return (
    <Form {...rest} method="post" action="/auth/logout">
      {children}
    </Form>
  );
}

export async function clientAction(
  _: Route.ClientActionArgs,
): Promise<LogoutResult | Response> {
  const res = await authClient.signOut();

  if (res.error) {
    return err({
      message: res.error.message ?? "Failed to sign out",
      action: logoutActionName,
    });
  }

  return redirect("/auth/login");
}
