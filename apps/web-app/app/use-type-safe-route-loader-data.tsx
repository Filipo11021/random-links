import type { Register } from "react-router";
import { useMatches } from "react-router";

type RouteModuleId = keyof Register["routeModules"];
type RouteModules = Register["routeModules"];

type ClientLoaderIfExists<Id extends RouteModuleId> = RouteModules[Id] extends {
  clientLoader: infer Loader;
}
  ? Loader
  : never;

type ServerLoaderIfExists<Id extends RouteModuleId> = RouteModules[Id] extends {
  loader: infer Loader;
}
  ? Loader
  : never;

// data flow: ServerLoader -> ClientLoader -> Data
type LoaderIfExists<Id extends RouteModuleId> =
  ClientLoaderIfExists<Id> extends never
    ? ServerLoaderIfExists<Id>
    : ClientLoaderIfExists<Id>;

type IsFunction<Fn> = Fn extends (...args: any[]) => unknown ? Fn : never;

type LoaderReturnType<Loader> = Awaited<ReturnType<IsFunction<Loader>>>;

export function useTypeSafeRouteLoaderData<
  Id extends RouteModuleId,
  Loader extends LoaderIfExists<Id>,
  LoaderData extends LoaderReturnType<Loader>
>(routeId: Id): LoaderData | undefined {
  const matches = useMatches();

  const route = matches.find((match) => match.id === routeId);
  const routeLoaderData = route?.loaderData as LoaderData | undefined;

  return routeLoaderData;
}
