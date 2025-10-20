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
import type { Route } from "./+types/auth.register";

type ActionData = Result<void, { message: string }>;

function signUp({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}): Promise<Result<void, { message: string }>> {
  return tryAsync(
    async () => {
      const res = await authClient.signUp.email({
        email,
        password,
        name: username,
      });

      if (res.error) {
        throw Error(res.error.message);
      }
    },
    (error) => ({
      message: error instanceof Error ? error.message : "Failed to sign up",
    }),
  );
}

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionData> {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const authResponse = await signUp({ username, email, password });
  if (!authResponse.ok) {
    return authResponse;
  }

  throw redirect("/");
}

export default function Component() {
  const [isVisible, setIsVisible] = React.useState(false);
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-large flex w-full max-w-sm flex-col gap-4 px-8 pt-6 pb-10">
        <p className="pb-4 text-left text-3xl font-semibold">
          Sign Up
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
            label="Username"
            labelPlacement="outside"
            name="username"
            placeholder="Enter your username"
            type="text"
            variant="bordered"
          />
          <Input
            isRequired
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="email"
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
          <Checkbox isRequired className="py-4" size="sm">
            I agree with the&nbsp;
            <Link className="relative z-1" href="#" size="sm">
              Terms
            </Link>
            &nbsp; and&nbsp;
            <Link className="relative z-1" href="#" size="sm">
              Privacy Policy
            </Link>
          </Checkbox>
          <Button
            color="primary"
            type="submit"
            isLoading={navigation.state === "submitting"}
          >
            Sign Up
          </Button>
        </Form>
        <p className="text-small text-center">
          <Link as={RouterLink} to="/auth/login" size="sm">
            Already have an account? Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
