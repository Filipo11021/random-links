import { redirect } from "react-router";
import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Random Links" },
    { name: "description", content: "A simple link manager" },
  ];
}

export async function clientLoader({}: Route.ClientLoaderArgs) {
  throw redirect("/links");
}
