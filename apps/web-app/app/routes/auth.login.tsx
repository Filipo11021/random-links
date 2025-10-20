import { Button, Checkbox, Input, Link } from "@heroui/react";
import { type Result, tryAsync } from "@repo/type-safe-errors";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import React from "react";
import {
  Form,
  Link as RouterLink,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import { authClient } from "~/auth-client";
import type { Route } from "./+types/auth.login";

type ActionData = Result<void, { message: string }>;

function signIn({
  email,
  password,
  remember,
}: {
  email: string;
  password: string;
  remember: boolean;
}): Promise<Result<void, { message: string }>> {
  return tryAsync(
    async () => {
      const res = await authClient.signIn.email({
        email,
        password,
        rememberMe: remember,
      });

      if (res.error) {
        throw Error(res.error.message);
      }
    },
    (error) => ({
      message: error instanceof Error ? error.message : "Failed to log in",
    }),
  );
}

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionData> {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const remember = formData.get("remember") as string;

  const authResponse = await signIn({
    email,
    password,
    remember: remember === "true",
  });

  if (!authResponse.ok) {
    return authResponse;
  }

  throw redirect("/");
}

export default function Login() {
  const [isVisible, setIsVisible] = React.useState(false);
  const navigation = useNavigation();
  const actionData = useActionData<ActionData>();

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-large flex w-full max-w-sm flex-col gap-4 px-8 pt-6 pb-10">
        <p className="pb-4 text-left text-3xl font-semibold">
          Log In
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>
        <Form className="flex flex-col gap-4" method="post">
          {actionData?.ok === false && (
            <p className="text-red-500">{actionData.error.message}</p>
          )}
          <Input
            isRequired
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="text"
            variant="bordered"
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <EyeClosedIcon className="text-default-400 pointer-events-none text-2xl" />
                ) : (
                  <EyeIcon className="text-default-400 pointer-events-none text-2xl" />
                )}
              </button>
            }
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox defaultSelected value="true" name="remember" size="sm">
              Remember me
            </Checkbox>
          </div>
          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={navigation.state === "submitting"}
          >
            Log In
          </Button>
        </Form>
        <p className="text-small text-center">
          <Link as={RouterLink} to="/auth/register" size="sm">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
